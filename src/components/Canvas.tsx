interface CanvasProps {
  isGenerateActive: boolean;
  isDebugActive: boolean;
}

export function Canvas({ isGenerateActive, isDebugActive }: CanvasProps) {
  return (
    <main className="flex-1 relative canvas-grid bg-surface overflow-hidden">
      
      {/* Canvas Toolbar */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
        <div className="bg-surface-container-low/80 backdrop-blur-md p-1.5 rounded-lg flex flex-col gap-1 shadow-lg">
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">near_me</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">circle</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">call_made</span>
          </button>
          <div className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface mt-2 bg-surface-container-highest cursor-pointer">
            <span className="material-symbols-outlined text-sm">fit_screen</span>
          </div>
        </div>
      </div>

      {/* Graph Nodes */}
      <div className={`w-full h-full relative transition-opacity duration-300 ${isGenerateActive ? 'opacity-30' : 'opacity-100'}`}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path d="M 300 400 L 500 400" fill="none" stroke="#48474b" strokeWidth="2"></path>
          <polygon fill="#48474b" points="500,400 490,395 490,405"></polygon>
          <text fill="#acaaae" fontFamily="Space Grotesk" fontSize="12" x="385" y="390">1</text>
          <path d="M 500 400 Q 600 300 700 400" fill="none" stroke={isDebugActive ? "#ff6e84" : "#00f4fe"} strokeDasharray="4" strokeWidth="2"></path>
          <polygon fill={isDebugActive ? "#ff6e84" : "#00f4fe"} points="700,400 690,392 694,402"></polygon>
          <text fill={isDebugActive ? "#ff6e84" : "#00f4fe"} fontFamily="Space Grotesk" fontSize="12" x="590" y="330">0, 1</text>
        </svg>

        <div className="absolute left-[260px] top-[360px] w-20 h-20 bg-surface-container shadow-md rounded-full flex flex-col items-center justify-center">
          <span className="text-on-surface font-bold">q₀</span>
          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Initial</span>
        </div>

        <div className={`absolute left-[460px] top-[360px] w-20 h-20 bg-surface-container shadow-md rounded-full flex flex-col items-center justify-center ring-2 ring-offset-4 ring-offset-surface ${isDebugActive ? 'ring-error node-glow-error' : 'ring-secondary node-glow'}`}>
          <span className={`font-bold ${isDebugActive ? 'text-error' : 'text-secondary'}`}>q₁</span>
          <span className={`text-[10px] uppercase tracking-widest ${isDebugActive ? 'text-error/70' : 'text-secondary/70'}`}>{isDebugActive ? 'Halted' : 'Active'}</span>
        </div>

        <div className="absolute left-[660px] top-[360px] w-20 h-20 bg-surface-container shadow-md rounded-full flex items-center justify-center">
          <div className="w-[88%] h-[88%] bg-surface-container-highest rounded-full flex items-center justify-center shadow-inner">
            <span className="text-on-surface font-bold">q₂</span>
          </div>
        </div>
      </div>

      {/* Graph Status Overlay */}
      <div className="absolute bottom-24 left-6 bg-surface-container-low/80 backdrop-blur-md px-4 py-2 rounded-lg flex items-center gap-4 shadow-lg">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isDebugActive ? 'bg-error' : 'bg-secondary'}`}></div>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isDebugActive ? 'text-error' : 'text-on-surface'}`}>{isDebugActive ? 'Engine Halted' : 'Live Engine'}</span>
        </div>
        <div className="h-4 w-px bg-surface-container-highest"></div>
        <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">States: 4</span>
        <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Transitions: 7</span>
      </div>
    </main>
  );
}
