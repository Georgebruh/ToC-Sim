interface RightSidebarProps {
  isDebugActive: boolean;
}

export function RightSidebar({ isDebugActive }: RightSidebarProps) {
  return (
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
  );
}
