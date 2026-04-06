export default function App() {
  return (
    <>
      {/* Top Navigation */}
      <header className="bg-[#0e0e11] w-full top-0 border-b border-white/5 flex justify-between items-center px-6 h-14 fixed z-50">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-violet-400">ToC Console</span>
          <nav className="hidden md:flex gap-6 items-center">
            <a className="font-['Space_Grotesk'] text-sm tracking-tight text-[#acaaae] hover:text-[#f3f0f4] hover:bg-white/5 transition-colors px-2 py-1 rounded" href="#">File</a>
            <a className="font-['Space_Grotesk'] text-sm tracking-tight text-[#acaaae] hover:text-[#f3f0f4] hover:bg-white/5 transition-colors px-2 py-1 rounded" href="#">Edit</a>
            <a className="font-['Space_Grotesk'] text-sm tracking-tight text-[#acaaae] hover:text-[#f3f0f4] hover:bg-white/5 transition-colors px-2 py-1 rounded" href="#">View</a>
            <a className="font-['Space_Grotesk'] text-sm tracking-tight text-[#acaaae] hover:text-[#f3f0f4] hover:bg-white/5 transition-colors px-2 py-1 rounded" href="#">Terminal</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-[#acaaae] hover:text-on-surface transition-colors">account_circle</button>
        </div>
      </header>

      {/* Side Navigation (Semantic Shell) */}
      <aside className="bg-[#131316] h-screen w-20 fixed left-0 top-14 border-r border-white/5 flex flex-col items-center py-8 space-y-8 z-40">
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <span className="material-symbols-outlined text-cyan-400 drop-shadow-[0_0_8px_rgba(0,244,254,0.5)] transition-transform scale-95 active:scale-90" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          <span className="font-['Space_Grotesk'] uppercase text-[10px] tracking-widest text-cyan-400">Explain</span>
        </div>
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <span className="material-symbols-outlined text-[#acaaae] group-hover:text-violet-300 transition-transform scale-95 active:scale-90">auto_awesome</span>
          <span className="font-['Space_Grotesk'] uppercase text-[10px] tracking-widest text-[#acaaae] group-hover:text-violet-300">Generate</span>
        </div>
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <span className="material-symbols-outlined text-[#acaaae] group-hover:text-violet-300 transition-transform scale-95 active:scale-90">bug_report</span>
          <span className="font-['Space_Grotesk'] uppercase text-[10px] tracking-widest text-[#acaaae] group-hover:text-violet-300">Debug</span>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="pl-20 pt-14 h-screen flex">
        {/* Left: Canvas */}
        <section className="flex-grow relative canvas-grid overflow-hidden">
          {/* Canvas Toolbar */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
            <div className="bg-surface-container-low/80 backdrop-blur-md p-1.5 rounded-lg flex flex-col gap-1 border border-white/5">
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-highest transition-colors text-[#acaaae] hover:text-on-surface">
                <span className="material-symbols-outlined text-sm">near_me</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-highest transition-colors text-[#acaaae] hover:text-on-surface">
                <span className="material-symbols-outlined text-sm">circle</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-highest transition-colors text-[#acaaae] hover:text-on-surface">
                <span className="material-symbols-outlined text-sm">call_made</span>
              </button>
            </div>
          </div>

          {/* DFA Nodes & Transitions (Simulated SVG Layer) */}
          <div className="w-full h-full relative">
            {/* Transition Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 300 400 L 500 400" fill="none" stroke="#48474b" strokeWidth="2"></path>
              <polygon fill="#48474b" points="500,400 490,395 490,405"></polygon>
              <text fill="#acaaae" fontFamily="Space Grotesk" fontSize="12" x="385" y="390">1</text>
              <path d="M 500 400 Q 600 300 700 400" fill="none" stroke="#00f4fe" strokeDasharray="4" strokeWidth="2"></path>
              <polygon fill="#00f4fe" points="700,400 690,392 694,402"></polygon>
              <text fill="#00f4fe" fontFamily="Space Grotesk" fontSize="12" x="590" y="330">0</text>
            </svg>

            {/* State Nodes */}
            {/* q0: Initial */}
            <div className="absolute left-[260px] top-[360px] w-20 h-20 bg-surface-container border-2 border-outline-variant rounded-full flex flex-col items-center justify-center">
              <span className="text-on-surface font-bold">q₀</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Initial</span>
            </div>

            {/* q1: Active */}
            <div className="absolute left-[460px] top-[360px] w-20 h-20 bg-surface-container border-2 border-secondary rounded-full flex flex-col items-center justify-center node-glow">
              <span className="text-secondary font-bold">q₁</span>
              <span className="text-[10px] text-secondary/70 uppercase tracking-widest">Active</span>
            </div>

            {/* q2: Accepting */}
            <div className="absolute left-[660px] top-[360px] w-20 h-20 bg-surface-container border-2 border-outline-variant rounded-full flex items-center justify-center">
              <div className="w-[88%] h-[88%] border border-outline-variant rounded-full flex items-center justify-center">
                <span className="text-on-surface font-bold">q₂</span>
              </div>
            </div>
          </div>

          {/* Graph Status Overlay */}
          <div className="absolute bottom-6 left-6 bg-surface-container-low/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/5 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">Live Engine</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">States: 4</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Transitions: 7</span>
          </div>
        </section>

        {/* Right: Simulation Panel */}
        <aside className="w-80 bg-surface-container-low border-l border-white/5 flex flex-col h-full overflow-y-auto">
          {/* Panel Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Logic Inspector</h2>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">settings</span>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-primary font-bold text-sm tracking-tight">ACCEPTED</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">String matched grammar <span className="text-primary-dim">L(M₁)</span></p>
            </div>
          </div>

          {/* Input Controls */}
          <div className="p-6 space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2">Input String</label>
              <div className="relative group">
                <input className="w-full bg-surface-container-high border-none rounded-lg text-secondary font-mono tracking-widest focus:ring-0 focus:bg-surface-container-highest transition-colors px-3 py-2 outline-none" readOnly type="text" value="1101001" />
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary"></div>
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-3">Simulation Speed</label>
              <input className="w-full h-1 bg-surface-container-highest rounded-full appearance-none accent-primary cursor-pointer" type="range" />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-on-surface-variant">0.1s</span>
                <span className="text-[10px] text-on-surface-variant">2.0s</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="grid grid-cols-4 gap-2">
              <button className="bg-surface-container-high hover:bg-surface-container-highest h-10 flex items-center justify-center rounded-lg transition-transform active:scale-90">
                <span className="material-symbols-outlined text-on-surface text-sm">skip_previous</span>
              </button>
              <button className="col-span-2 bg-primary text-on-primary h-10 flex items-center justify-center rounded-lg transition-transform active:scale-95">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
              <button className="bg-surface-container-high hover:bg-surface-container-highest h-10 flex items-center justify-center rounded-lg transition-transform active:scale-90">
                <span className="material-symbols-outlined text-on-surface text-sm">skip_next</span>
              </button>
            </div>
          </div>

          {/* Execution Logs */}
          <div className="flex-grow bg-surface-container-lowest mx-6 mb-6 rounded-lg p-4 font-mono text-[11px] space-y-2 border border-white/5">
            <p className="text-on-surface-variant">Executing path trace...</p>
            <p className="text-on-surface">Step 1: <span className="text-primary">q₀</span> → 1 → <span className="text-primary">q₁</span></p>
            <p className="text-on-surface">Step 2: <span className="text-primary">q₁</span> → 1 → <span className="text-primary">q₁</span></p>
            <p className="text-on-surface">Step 3: <span className="text-primary">q₁</span> → 0 → <span className="text-secondary">q₂</span></p>
            <p className="text-secondary-dim mt-2">Terminating at q₂ (ACCEPTING)</p>
          </div>

          {/* Metadata Bento Mini */}
          <div className="p-6 mt-auto border-t border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Compiler</span>
              <span className="text-[10px] font-bold text-on-surface">v2.4.0-stable</span>
            </div>
            <div className="flex gap-2">
              <div className="h-1 flex-grow bg-secondary/20 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-secondary"></div>
              </div>
              <div className="h-1 flex-grow bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-primary"></div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Floating Help Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-2xl hover:scale-110 active:scale-95 transition-transform z-50">
        <span className="material-symbols-outlined">help</span>
      </button>
    </>
  );
}
