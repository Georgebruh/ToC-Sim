import { useEffect, useRef, useState } from 'react';
import {
  buildExplainPrompt,
  createTutorChat,
  isGeminiConfigured,
  type TutorChat,
} from '../lib/gemini';
import type { Automaton } from '../lib/automaton';

interface AITutorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  automaton: Automaton;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  // pending=true while we're streaming the model's reply in
  pending?: boolean;
}

export function AITutorSidebar({ isOpen, onClose, automaton }: AITutorSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The chat session is created lazily the first time the sidebar opens, so
  // every "open" gets a fresh conversation tied to the automaton at that moment.
  const chatRef = useRef<TutorChat | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const hasAutoExplained = useRef(false);

  // Kick off the auto-explain when the sidebar opens. We guard with a ref so
  // that toggling other state doesn't re-trigger it.
  useEffect(() => {
    if (!isOpen) {
      hasAutoExplained.current = false;
      return;
    }
    if (hasAutoExplained.current) return;
    hasAutoExplained.current = true;

    if (!isGeminiConfigured()) {
      setError(
        'Gemini API key is not set. Add VITE_GEMINI_API_KEY to your .env.local file and restart the dev server.',
      );
      return;
    }

    setMessages([]);
    setError(null);
    chatRef.current = createTutorChat();
    void streamReply(buildExplainPrompt(automaton), { hidePrompt: true });
    // We deliberately don't depend on `automaton` — the explanation is a
    // snapshot taken at open time. Follow-up questions can ask about changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Keep the transcript scrolled to the bottom as new chunks land.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function streamReply(prompt: string, opts?: { hidePrompt?: boolean }) {
    if (!chatRef.current) return;
    setIsThinking(true);
    setError(null);

    setMessages((prev) => {
      const next = [...prev];
      if (!opts?.hidePrompt) next.push({ role: 'user', text: prompt });
      next.push({ role: 'model', text: '', pending: true });
      return next;
    });

    try {
      let acc = '';
      for await (const chunk of chatRef.current.sendMessage(prompt)) {
        acc += chunk;
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === 'model') {
            next[next.length - 1] = { ...last, text: acc };
          }
          return next;
        });
      }
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.role === 'model') {
          next[next.length - 1] = { ...last, pending: false };
        }
        return next;
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong talking to Gemini.';
      setError(msg);
      setMessages((prev) => prev.filter((m) => !(m.role === 'model' && m.pending)));
    } finally {
      setIsThinking(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;
    setInput('');
    void streamReply(trimmed);
  }

  return (
    <aside
      // Slides in from the left, just to the right of the icon rail.
      className={`absolute top-0 left-0 h-full w-[380px] bg-surface-container-low border-r border-outline-variant shadow-[8px_0_32px_rgba(0,0,0,0.35)] z-30 flex flex-col transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-hidden={!isOpen}
    >
      <div className="px-4 py-3 bg-surface-container flex items-center gap-3 border-b border-outline-variant">
        <span
          className="material-symbols-outlined text-primary text-xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          psychology
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface">
            AI Tutor
          </span>
          <span className="text-[10px] text-on-surface-variant">
            Gemini 2.5 Flash
          </span>
        </div>
        <button
          onClick={onClose}
          className="ml-auto text-[10px] text-on-surface-variant font-mono bg-surface-container-high hover:bg-surface-container-highest transition-colors px-2 py-1 rounded"
          aria-label="Close AI tutor"
        >
          ✕
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && !error && (
          <div className="text-xs text-on-surface-variant italic">
            Opening tutor… reading your automaton.
          </div>
        )}

        {error && (
          <div className="text-xs text-primary bg-primary/10 border border-primary/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-outline-variant bg-surface-container-low p-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isThinking ? 'Thinking…' : 'Ask a follow-up…'}
          disabled={isThinking || !!error}
          className="flex-1 bg-surface-container-high text-on-surface placeholder:text-on-surface-variant text-xs px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isThinking || !input.trim() || !!error}
          className="bg-primary text-on-primary text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg hover:bg-primary-dim transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </aside>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] text-xs leading-relaxed rounded-2xl px-3 py-2 whitespace-pre-wrap ${
          isUser
            ? 'bg-primary/20 text-on-surface border border-primary/30 rounded-br-sm'
            : 'bg-surface-container text-on-surface border border-outline-variant rounded-bl-sm'
        }`}
      >
        {message.text}
        {message.pending && message.text.length === 0 && (
          <span className="inline-flex gap-1 items-center text-on-surface-variant">
            <Dot /> <Dot delay={150} /> <Dot delay={300} />
          </span>
        )}
      </div>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
