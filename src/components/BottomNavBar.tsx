interface BottomNavBarProps {
  isPlaying: boolean;
  canStepBack: boolean;
  canStepForward: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
}

export function BottomNavBar({
  isPlaying,
  canStepBack,
  canStepForward,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
}: BottomNavBarProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 flex justify-center items-center gap-10 z-40 bg-surface-container/85 backdrop-blur-xl rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.6)] font-['Space_Grotesk'] font-medium">
      <NavButton
        icon="play_arrow"
        label="Play"
        active={isPlaying}
        onClick={onPlay}
        disabled={isPlaying}
      />
      <NavButton
        icon="pause"
        label="Pause"
        onClick={onPause}
        disabled={!isPlaying}
      />
      <NavButton
        icon="chevron_left"
        label="Step Back"
        onClick={onStepBack}
        disabled={!canStepBack}
      />
      <NavButton
        icon="chevron_right"
        label="Step Forward"
        onClick={onStepForward}
        disabled={!canStepForward}
      />
    </footer>
  );
}

interface NavButtonProps {
  icon: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, active, disabled, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center transition-transform cursor-pointer active:scale-90 ${
        disabled
          ? 'opacity-30 cursor-not-allowed'
          : active
            ? 'text-secondary scale-110'
            : 'text-on-surface-variant hover:scale-110 hover:text-on-surface'
      }`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-[10px] uppercase tracking-widest mt-1">{label}</span>
    </button>
  );
}
