export function BottomNavBar() {
  return (
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
  );
}
