import React, { useState } from 'react';

export default function App() {
  // --- State Hooks ---
  const [isExplainActive, setIsExplainActive] = useState(false);
  const [isGenerateActive, setIsGenerateActive] = useState(false);
  const [isDebugActive, setIsDebugActive] = useState(false);

  // --- Event Handlers (Mutually Exclusive) ---
  const handleExplainClick = () => {
    setIsExplainActive(!isExplainActive);
    setIsGenerateActive(false);
    setIsDebugActive(false);
  };

  const handleGenerateClick = () => {
    setIsGenerateActive(!isGenerateActive);
    setIsExplainActive(false);
    setIsDebugActive(false);
  };

  const handleDebugClick = () => {
    setIsDebugActive(!isDebugActive);
    setIsExplainActive(false);
    setIsGenerateActive(false);
  };

  return (
    <div className="h-screen w-screen bg-background text-on-surface font-['Space_Grotesk'] overflow-hidden flex flex-col selection:bg-primary-container selection:text-on-primary-container relative">
      
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

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Semantic Shell */}
        <aside className="w-20 bg-surface-container-low flex flex-col items-center py-8 space-y-8 z-40 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
          {/* EXPLAIN BUTTON */}
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
            <span className={`uppercase text-[10px] tracking-widest mt-1 transition-colors ${isExplainActive ? 'text-primary' : 'text-secondary'}`}>
              Explain
            </span>
          </div>

          {/* GENERATE BUTTON */}
          <div 
            onClick={handleGenerateClick}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <span 
              className={`material-symbols-outlined transition-transform scale-95 active:scale-90 ${
                isGenerateActive 
                  ? 'text-primary drop-shadow-[0_0_8px_rgba(186,158,255,0.5)]' 
                  : 'text-on-surface-variant group-hover:text-primary group-hover:scale-100'
              }`}
            >
              auto_awesome
            </span>
            <span className={`uppercase text-[10px] tracking-widest mt-1 transition-colors ${isGenerateActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
              Generate
            </span>
          </div>

          {/* DEBUG BUTTON */}
          <div 
            onClick={handleDebugClick}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <span 
              className={`material-symbols-outlined transition-transform scale-95 active:scale-90 ${
                isDebugActive 
                  ? 'text-primary drop-shadow-[0_0_8px_rgba(186,158,255,0.5)]' 
                  : 'text-on-surface-variant group-hover:text-primary group-hover:scale-100'
              }`}
            >
              bug_report
            </span>
            <span className={`uppercase text-[10px] tracking-widest mt-1 transition-colors ${isDebugActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
              Debug
            </span>
          </div>
        </aside>

        {/* Central Canvas */}
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

          {/* GENERATE COMMAND PALETTE (Conditional) */}
          {isGenerateActive && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] z-50 flex flex-col bg-surface shadow-[0_40px_80px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden pointer-events-auto">
              <div className="px-5 py-3 bg-surface-container-low flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface">Gemini Automata Builder</span>
                <button onClick={() => setIsGenerateActive(false)} className="ml-auto text-[10px] text-on-surface-variant font-mono bg-surface-container-high hover:bg-surface-container-highest transition-colors px-2 py-1 rounded cursor-pointer">ESC</button>
              </div>
              <div className="flex flex-col relative bg-surface-container">
                <input autoFocus onKeyDown={(e) => { if (e.key === 'Escape') setIsGenerateActive(false); }} className="w-full bg-surface-container-low px-6 py-6 text-secondary font-mono text-sm outline-none focus:bg-surface-container-high transition-all border-b-2 border-transparent focus:border-secondary placeholder:text-on-surface-variant/50" placeholder="e.g., 'Generate a DFA that accepts binary strings ending in 01'..." type="text" />
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
          )}

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

        {/* Right Sidebar - Simulation Panel */}
        <aside className="w-80 bg-surface-container-low flex flex-col h-full overflow-y-auto shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.2)] z-30 pb-20">
          <div className="p-6 bg-surface-container shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Logic Inspector</h2>
              <span className="material-symbols-outlined text-on-surface-variant text-sm cursor-pointer hover:text-on-surface transition-colors">settings</span>
            </div>
            
            {/* Dynamic Status Box */}
            <div className={`p-4 rounded-xl shadow-inner transition-colors ${isDebugActive ? 'bg-error/10' : 'bg-secondary/10'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`material-symbols-outlined text-sm ${isDebugActive ? 'text-error' : 'text-secondary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isDebugActive ? 'warning' : 'check_circle'}
                </span>
                <span className={`font-bold text-sm tracking-tight uppercase ${isDebugActive ? 'text-error' : 'text-secondary'}`}>
                  {isDebugActive ? 'Syntax Error' : 'Accepted'}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                {isDebugActive ? 'Non-deterministic transition detected.' : 'String matched grammar '}<span className={`${isDebugActive ? 'text-error' : 'text-secondary'} font-mono`}>{!isDebugActive && 'L(M₁)'}</span>
              </p>
            </div>
          </div>

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
            
            {/* Dynamic Final Step */}
            {!isDebugActive ? (
              <>
                <div className="hover:bg-surface-container-high p-2 -mx-2 rounded transition-colors flex items-center gap-2 bg-surface-container-high/30">
                  <span className="text-on-surface-variant">Step 3:</span>
                  <span className="text-primary">q₁</span> 
                  <span className="text-on-surface-variant">→</span>
                  <span className="text-on-surface">0</span>
                  <span className="text-on-surface-variant">→</span>
                  <span className="text-secondary font-bold">q₂</span>
                </div>
                <p className="text-secondary mt-4 font-bold uppercase tracking-wider text-[10px]">Terminating at q₂ (ACCEPTING)</p>
              </>
            ) : (
               <>
                <div className="hover:bg-error/10 p-2 -mx-2 rounded transition-colors flex items-center gap-2 bg-error/5 border-l-2 border-error">
                  <span className="text-error font-bold">Step 3:</span>
                  <span className="text-primary">q₁</span> 
                  <span className="text-error">→</span>
                  <span className="text-error font-bold line-through">1</span>
                  <span className="text-error">→</span>
                  <span className="text-error font-bold">???</span>
                </div>
                <p className="text-error mt-4 font-bold uppercase tracking-wider text-[10px]">Engine Halted (AMBIGUITY)</p>
              </>
            )}
          </div>

          <div className="p-6 mt-auto bg-surface-container flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Compiler</span>
              <span className="text-[10px] font-bold text-on-surface">v2.4.0-stable</span>
            </div>
            <div className="flex gap-2">
              <div className="h-1.5 flex-grow bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
                <div className={`h-full w-2/3 ${isDebugActive ? 'bg-error' : 'bg-secondary'}`}></div>
              </div>
              <div className="h-1.5 flex-grow bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
                <div className="h-full w-1/2 bg-primary"></div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* BottomNavBar */}
      <footer className="fixed bottom-0 left-0 right-0 h-16 flex justify-center items-center gap-10 z-40 bg-surface-container/85 backdrop-blur-xl rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.6)] font-['Space_Grotesk'] font-medium">
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

      {/* TOAST NOTIFICATION (Logic Debugger) */}
      {isDebugActive && (
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
              onClick={() => setIsDebugActive(false)}
              className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}