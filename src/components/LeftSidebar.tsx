interface LeftSidebarProps {
  isExplainActive: boolean;
  isGenerateActive: boolean;
  isDebugActive: boolean;
  onExplainClick: () => void;
  onGenerateClick: () => void;
  onDebugClick: () => void;
}

export function LeftSidebar({
  isExplainActive,
  isGenerateActive,
  isDebugActive,
  onExplainClick,
  onGenerateClick,
  onDebugClick,
}: LeftSidebarProps) {
  return (
    <aside className="w-20 bg-surface-container-low flex flex-col items-center py-8 space-y-8 z-40 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      {/* EXPLAIN BUTTON */}
      <div 
        onClick={onExplainClick}
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
        onClick={onGenerateClick}
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
        onClick={onDebugClick}
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
  );
}
