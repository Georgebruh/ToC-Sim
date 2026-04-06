interface GenerateCommandPaletteProps {
  isActive: boolean;
  onClose: () => void;
}

export function GenerateCommandPalette({ isActive, onClose }: GenerateCommandPaletteProps) {
  if (!isActive) return null;

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] z-50 flex flex-col bg-surface shadow-[0_40px_80px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden pointer-events-auto">
      <div className="px-5 py-3 bg-surface-container-low flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
        <span className="text-xs font-bold uppercase tracking-widest text-on-surface">Gemini Automata Builder</span>
        <button onClick={onClose} className="ml-auto text-[10px] text-on-surface-variant font-mono bg-surface-container-high hover:bg-surface-container-highest transition-colors px-2 py-1 rounded cursor-pointer">ESC</button>
      </div>
      <div className="flex flex-col relative bg-surface-container">
        <input 
          autoFocus 
          onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }} 
          className="w-full bg-surface-container-low px-6 py-6 text-secondary font-mono text-sm outline-none focus:bg-surface-container-high transition-all border-b-2 border-transparent focus:border-secondary placeholder:text-on-surface-variant/50" 
          placeholder="e.g., 'Generate a DFA that accepts binary strings ending in 01'..." 
          type="text" 
        />
      </div>
      <div className="p-4 bg-surface flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 px-2">Example Prompts</p>
        <div className="px-4 py-3 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer flex items-center gap-4 group">
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-sm transition-colors">edit_note</span>
          <span className="text-xs text-on-surface font-mono">DFA for an even number of 0s and 1s</span>
          <span className="material-symbols-outlined ml-auto text-on-surface-variant opacity-0 group-hover:opacity-100 group-hover:text-secondary text-sm transition-all">arrow_forward</span>
        </div>
        <div className="px-4 py-3 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer flex items-center gap-4 group">
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-sm transition-colors">edit_note</span>
          <span className="text-xs text-on-surface font-mono">NFA that accepts the language (a|b)*abb</span>
          <span className="material-symbols-outlined ml-auto text-on-surface-variant opacity-0 group-hover:opacity-100 group-hover:text-secondary text-sm transition-all">arrow_forward</span>
        </div>
      </div>
    </div>
  );
}
