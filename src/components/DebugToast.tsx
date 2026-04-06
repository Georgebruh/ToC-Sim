interface DebugToastProps {
  isActive: boolean;
  onClose: () => void;
}

export function DebugToast({ isActive, onClose }: DebugToastProps) {
  if (!isActive) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[100] transition-all duration-300 transform translate-x-0">
      <div className="bg-surface-container-highest border-l-4 border-error p-4 shadow-2xl flex items-start gap-4 max-w-sm rounded-r-lg">
        <div className="bg-error/20 p-2 rounded">
          <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
        </div>
        <div className="flex-1">
          <h3 className="text-error font-bold text-sm tracking-tight mb-1 uppercase">Non-Deterministic Transition</h3>
          <p className="text-on-surface-variant text-xs leading-relaxed">
            State <span className="font-mono text-primary">q₁</span> has multiple outgoing transitions for input <span className="font-mono text-on-surface">'1'</span>. Engine halted.
          </p>
        </div>
        <button 
          onClick={onClose}
          className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
}
