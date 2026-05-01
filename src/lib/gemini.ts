import { GoogleGenAI, type Chat } from '@google/genai';
import type { Automaton } from './automaton';

// Pulled from Vite env so we don't ship the key in the bundle source.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

const MODEL = 'gemini-2.5-flash';

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!API_KEY) {
    throw new Error(
      'Missing VITE_GEMINI_API_KEY. Add it to your .env.local file and restart the dev server.',
    );
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: API_KEY });
  }
  return client;
}

export function isGeminiConfigured(): boolean {
  return Boolean(API_KEY);
}

// Turn the automaton into a compact, human-readable description so the model
// can reason about it without us having to teach it our internal id scheme.
export function serializeAutomaton(automaton: Automaton): string {
  const { states, transitions, alphabet } = automaton;

  if (states.length === 0) {
    return 'The canvas is empty — there are no states yet.';
  }

  const startStates = states.filter((s) => s.isStart).map((s) => s.label || s.id);
  const acceptStates = states.filter((s) => s.isAccept).map((s) => s.label || s.id);
  const labelOf = (id: string) => {
    const s = states.find((st) => st.id === id);
    return s?.label || id;
  };

  const lines: string[] = [];
  lines.push(`States (${states.length}): ${states.map((s) => s.label || s.id).join(', ')}`);
  lines.push(`Alphabet: ${alphabet.length ? alphabet.join(', ') : '(none yet)'}`);
  lines.push(`Start state(s): ${startStates.length ? startStates.join(', ') : '(none)'}`);
  lines.push(`Accept state(s): ${acceptStates.length ? acceptStates.join(', ') : '(none)'}`);
  lines.push('');
  lines.push('Transitions:');
  if (transitions.length === 0) {
    lines.push('  (no transitions)');
  } else {
    for (const t of transitions) {
      lines.push(`  ${labelOf(t.source)} --${t.symbol}--> ${labelOf(t.target)}`);
    }
  }

  return lines.join('\n');
}

const SYSTEM_INSTRUCTION = `You are an AI tutor embedded in an automata theory simulator. You help students understand finite automata (DFA, NFA, NFA-ε), regular expressions, and the strings they accept.

Style:
- Be concise but warm. Prefer short paragraphs and bullet points over walls of text.
- Use plain language first, formal terms second.
- When useful, walk through a small example trace.
- Don't invent states or transitions that weren't given to you.
- If the automaton is empty or malformed, say so kindly and suggest a next step.`;

// Builds the opening user message so the model has the machine in front of it
// before we ask it anything else. We keep this separate so callers can prepend
// other framing (e.g. "explain this machine") without re-serializing.
export function buildExplainPrompt(automaton: Automaton): string {
  return `Here is the current automaton on my canvas:\n\n${serializeAutomaton(
    automaton,
  )}\n\nPlease explain in plain language what this machine does — what language it recognizes (or appears to recognize), how it processes input, and anything notable about its structure. If it's incomplete, point out what's missing.`;
}

export interface TutorChat {
  sendMessage: (message: string) => AsyncGenerator<string, void, unknown>;
}

// Wraps a Gemini chat session so the UI just deals with strings going in
// and a stream of text chunks coming out.
export function createTutorChat(): TutorChat {
  const chat: Chat = getClient().chats.create({
    model: MODEL,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.6,
    },
  });

  return {
    async *sendMessage(message: string) {
      const stream = await chat.sendMessageStream({ message });
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) yield text;
      }
    },
  };
}
