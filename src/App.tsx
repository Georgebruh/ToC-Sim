import React, { useState } from 'react';

export default function App() {
  // --- State Hooks ---
  const [isExplainActive, setIsExplainActive] = useState(false);

  // --- Event Handlers ---
  const handleExplainClick = () => {
    setIsExplainActive(!isExplainActive);
    // Future AI Tutor logic will be fired from here
    console.log(`Explain mode toggled: ${!isExplainActive ? 'ON' : 'OFF'}`);
  };

  return (
    <div className="h-screen w-screen bg-background text-on-surface font-['Space_Grotesk'] overflow-hidden flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation */}
      <header className="w-full h-14 bg-surface-container flex justify-between items-center px-6 shrink-0 relative z-50 shadow-md">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-primary">ToC Console</span>
          <nav className="hidden md:flex gap-6 items-center">
            <a className="text-sm tracking-tight text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors px-3 py-1.5 rounded-md" href="#">File</a>
            <a className="text-sm tracking-tight text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors px-3 py-1.5 rounded-md" href="#">Edit</a>
            <a className="text-sm tracking-tight text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors px-3 py-1.5 rounded-md" href="#">View</a>
            <a className="text-sm tracking-tight text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors px-3 py-1.5 rounded-md" href="#">Terminal</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors">account_circle</button>
        </div>
      </header>

      {/* Main Layout (No Divider Lines - Tonal Shifts Only) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Semantic Shell */}
        <aside className="w-20 bg-surface-container-low flex flex-col items-center py-8 space-y-8 z-40 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
          {/* EXPLAIN BUTTON: Now wired with state and click handler */}
          <div 
            onClick={handleExplainClick}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <span 
              className={`material-symbols-outlined transition-transform scale-95 active:scale-90 ${
                isExplainActive 
                  ? 'text-primary drop-shadow-[0_0_8px_rgba(186,158,255,0.5)]' 
                  : 'text-secondary drop-shadow-[0_0_8px_rgba(0,244,254,0.5)] group-hover:scale-100'
              }`} 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              psychology
            </span>
            <span 
              className={`uppercase text-[10px] tracking-widest mt-1 transition-colors ${
                isExplainActive 
                  ? 'text-primary' 
                  : 'text-secondary'
              }`}
            >
              Explain
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 group cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-transform scale-95 active:scale-90">auto_awesome</span>
            <span className="uppercase text-[10px] tracking-widest text-on-surface-variant group-hover:text-primary mt-1">Generate</span>
          </div>
          <div className="flex flex-col items-center gap-1 group cursor-pointer">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-transform scale-95 active:scale-90">bug_report</span>
            <span className="uppercase text-[10px] tracking-widest text-on-surface-variant group-hover:text-primary mt-1">Debug</span>
          </div>
        </aside>

        {/* Central Canvas (Main Stage) */}
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

          {/* Simulated Graph Layer */}
          <div className="w-full h-full relative">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 300 400 L 500 400" fill="none" stroke="#48474b" strokeWidth="2"></path>
              <polygon fill="#48474b" points="500,400 490,395 490,405"></polygon>
              <text fill="#acaaae" fontFamily="Space Grotesk" fontSize="12" x="385" y="390">1</text>
              <path d="M 500 400 Q 600 300 700 400" fill="none" stroke="#00f4fe" strokeDasharray="4" strokeWidth="2"></path>
              <polygon fill="#00f4fe" points="700,400 690,392 694,402"></polygon>
              <text fill="#00f4fe" fontFamily="Space Grotesk" fontSize="12" x="590" y="330">0</text>
            </svg>

            {/* Nodes */}
            <div className="absolute left-[260px] top-[360px] w-20 h-20 bg-surface-container shadow-md rounded-full flex flex-col items-center justify-center">
              <span className="text-on-surface font-bold">q₀</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Initial</span>
            </div>

            <div className="absolute left-[460px] top-[360px] w-20 h-20 bg-surface-container shadow-md rounded-full flex flex-col items-center justify-center node-glow ring-2 ring-secondary ring-offset-4 ring-offset-surface">
              <span className="text-secondary font-bold">q₁</span>
              <span className="text-[10px] text-secondary/70 uppercase tracking-widest">Active</span>
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
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">Live Engine</span>
            </div>
            <div className="h-4 w-px bg-surface-container-highest"></div>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">States: 4</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Transitions: 7</span>
          </div>
        </main>

        {/* Right Sidebar - Simulation Panel (Sunken Layout) */}
        <aside className="w-80 bg-surface-container-low flex flex-col h-full overflow-y-auto shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.2)] z-30 pb-20">
          {/* Panel Header */}
          <div className="p-6 bg-surface-container shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Logic Inspector</h2>
              <span className="material-symbols-outlined text-on-surface-variant text-sm cursor-pointer hover:text-on-surface transition-colors">settings</span>
            </div>
            <div className="bg-secondary/10 p-4 rounded-xl shadow-inner transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-secondary font-bold text-sm tracking-tight uppercase">Accepted</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">String matched grammar <span className="text-secondary font-mono">L(M₁)</span></p>
            </div>
          </div>

          {/* Input Controls (IDE Style) */}
          <div className="p-6 flex flex-col gap-8">
            <div className="flex flex-col gap-2 relative">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant">Input String</label>
              <input 
                className="w-full bg-surface-container-low px-4 py-3 text-secondary font-mono tracking-[0.2em] outline-none focus:bg-surface-container-high transition-all rounded-t-md border-b-2 border-transparent focus:border-secondary text-sm shadow-inner" 
                type="text" 
                defaultValue="1101001" 
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant">Simulation Speed</label>
              <input className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none accent-secondary cursor-pointer" type="range" />
              <div className="flex justify-between">
                <span className="text-[10px] text-on-surface-variant font-mono">0.1s</span>
                <span className="text-[10px] text-on-surface-variant font-mono">2.0s</span>
              </div>
            </div>
          </div>

          {/* Execution Logs */}
          <div className="flex-grow bg-surface mx-6 mb-6 rounded-xl p-5 font-mono text-[11px] flex flex-col gap-1 shadow-inner overflow-y-auto">
            <p className="text-on-surface-variant mb-4 font-sans uppercase tracking-widest text-[10px]">Executing path trace...</p>
            <div className="hover:bg-surface-container-high p-2 -mx-2 rounded transition-colors flex items-center gap-2">
              <span className="text-on-surface-variant">Step 1:</span>
              <span className="text-primary">q₀</span> 
              <span className="text-on-surface-variant">→</span>
              <span className="text-on-surface">1</span>
              <span className="text-on-surface-variant">→</span>
              <span className="text-primary">q₁</span>
            </div>
            <div className="hover:bg-surface-container-high p-2 -mx-2 rounded transition-colors flex items-center gap-2">
              <span className="text-on-surface-variant">Step 2:</span>
              <span className="text-primary">q₁</span> 
              <span className="text-on-surface-variant">→</span>
              <span className="text-on-surface">1</span>
              <span className="text-on-surface-variant">→</span>
              <span className="text-primary">q₁</span>
            </div>
            <div className="hover:bg-surface-container-high p-2 -mx-2 rounded transition-colors flex items-center gap-2 bg-surface-container-high/30">
              <span className="text-on-surface-variant">Step 3:</span>
              <span className="text-primary">q₁</span> 
              <span className="text-on-surface-variant">→</span>
              <span className="text-on-surface">0</span>
              <span className="text-on-surface-variant">→</span>
              <span className="text-secondary font-bold">q₂</span>
            </div>
            <p className="text-secondary mt-4 font-bold uppercase tracking-wider text-[10px]">Terminating at q₂ (ACCEPTING)</p>
          </div>

          {/* Metadata Bento Mini */}
          <div className="p-6 mt-auto bg-surface-container flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Compiler</span>
              <span className="text-[10px] font-bold text-on-surface">v2.4.0-stable</span>
            </div>
            <div className="flex gap-2">
              <div className="h-1.5 flex-grow bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
                <div className="h-full w-2/3 bg-secondary"></div>
              </div>
              <div className="h-1.5 flex-grow bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
                <div className="h-full w-1/2 bg-primary"></div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* BottomNavBar */}
      <footer className="fixed bottom-0 left-0 right-0 h-16 flex justify-center items-center gap-10 z-50 bg-surface-container/85 backdrop-blur-xl rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.6)] font-['Space_Grotesk'] font-medium">
        <div className="flex flex-col items-center text-on-surface-variant hover:scale-110 transition-transform cursor-pointer active:scale-90 hover:text-on-surface">
          <span className="material-symbols-outlined">play_arrow</span>
          <span className="text-[10px] uppercase tracking-widest mt-1">Play</span>
        </div>
        <div className="flex flex-col items-center text-on-surface-variant hover:scale-110 transition-transform cursor-pointer active:scale-90 hover:text-on-surface">
          <span className="material-symbols-outlined">pause</span>
          <span className="text-[10px] uppercase tracking-widest mt-1">Pause</span>
        </div>
        <div className="flex flex-col items-center text-on-surface-variant hover:scale-110 transition-transform cursor-pointer active:scale-90 hover:text-on-surface">
          <span className="material-symbols-outlined">chevron_left</span>
          <span className="text-[10px] uppercase tracking-widest mt-1">Step Back</span>
        </div>
        <div className="flex flex-col items-center text-on-surface-variant hover:scale-110 transition-transform cursor-pointer active:scale-90 hover:text-on-surface">
          <span className="material-symbols-outlined">chevron_right</span>
          <span className="text-[10px] uppercase tracking-widest mt-1">Step Forward</span>
        </div>
      </footer>
    </div>
  );
}