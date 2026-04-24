import { useState } from 'react';
import { regexToNFA, type Automaton } from '../lib/automaton';

interface GenerateCommandPaletteProps {
  isActive: boolean;
  onClose: () => void;
  onGenerate?: (automaton: Automaton, layout: Record<string, { x: number; y: number }>) => void;
}

const EXAMPLES = [
  '(a|b)*abb',
  '(0|1)*01',
  'a(b|c)*d',
  'ab+',
  '(0|1)*1(0|1)(0|1)',
];

export function GenerateCommandPalette({
  isActive,
  onClose,
  onGenerate,
}: GenerateCommandPaletteProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isActive) return null;

  const submit = (regex: string) => {
    try {
      const result = regexToNFA(regex);
      setError(null);
      onGenerate?.(result.automaton, result.layout);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] z-50 flex flex-col bg-surface shadow-[0_40px_80px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden pointer-events-auto border border-outline-variant">
      <div className="px-5 py-3 bg-surface-container-low flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
        <span className="text-xs font-bold uppercase tracking-widest text-on-surface">
          Regex → NFA (Thompson's construction)
        </span>
        <button
          onClick={onClose}
          className="ml-auto text-[10px] text-on-surface-variant font-mono bg-surface-container-high hover:bg-surface-container-highest transition-colors px-2 py-1 rounded cursor-pointer"
        >
          ESC
        </button>
      </div>

      <div className="flex flex-col relative bg-surface-container">
        <input
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'Enter' && value.length > 0) submit(value);
          }}
          className="w-full bg-surface-container-low px-6 py-6 text-secondary font-mono text-sm outline-none focus:bg-surface-container-high transition-all border-b-2 border-transparent focus:border-secondary placeholder:text-on-surface-variant/50"
          placeholder="Type a regular expression — e.g. (a|b)*abb"
        />
        {error && (
          <div className="px-6 py-2 text-xs font-mono text-primary bg-primary/10 border-t border-primary/20">
            {error}
          </div>
        )}
      </div>

      <div className="p-4 bg-surface flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 px-2">
          Examples
        </p>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => {
              setValue(ex);
              submit(ex);
            }}
            className="px-4 py-3 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer flex items-center gap-4 group text-left"
          >
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-sm transition-colors">
              edit_note
            </span>
            <span className="text-xs text-on-surface font-mono">{ex}</span>
            <span className="material-symbols-outlined ml-auto text-on-surface-variant opacity-0 group-hover:opacity-100 group-hover:text-secondary text-sm transition-all">
              arrow_forward
            </span>
          </button>
        ))}
        <p className="text-[10px] text-on-surface-variant mt-2 px-2 font-mono">
          Operators: concat, <span className="text-on-surface">|</span> (union),{' '}
          <span className="text-on-surface">*</span>, <span className="text-on-surface">+</span>,{' '}
          <span className="text-on-surface">?</span>,{' '}
          <span className="text-on-surface">( )</span>,{' '}
          <span className="text-on-surface">\</span> (escape)
        </p>
      </div>
    </div>
  );
}
