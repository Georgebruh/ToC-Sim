import { EPSILON, type Automaton, type SimulationStep } from '../lib/automaton';

interface RightSidebarProps {
  automaton: Automaton;
  inputString: string;
  onInputChange: (value: string) => void;
  speedMs: number;
  onSpeedChange: (ms: number) => void;
  steps: SimulationStep[];
  stepIndex: number;
  currentStep: SimulationStep | null;
  accepted: boolean | null;
  onRun: () => void;
  onReset: () => void;
  onToggleMultiRun: () => void;
  multiRunOpen: boolean;
}

export function RightSidebar({
  automaton,
  inputString,
  onInputChange,
  speedMs,
  onSpeedChange,
  steps,
  stepIndex,
  currentStep,
  accepted,
  onRun,
  onReset,
  onToggleMultiRun,
  multiRunOpen,
}: RightSidebarProps) {
  const finished = steps.length > 0 && stepIndex >= steps.length - 1;
  const stateLookup = new Map(automaton.states.map((s) => [s.id, s.label]));

  const consumed = currentStep
    ? inputString.slice(0, inputString.length - currentStep.remainingString.length)
    : '';
  const remaining = currentStep?.remainingString ?? inputString;

  const status =
    accepted === null
      ? { label: 'IDLE', tone: 'neutral' as const, icon: 'schedule' }
      : accepted
        ? { label: 'ACCEPTED', tone: 'good' as const, icon: 'check_circle' }
        : { label: 'REJECTED', tone: 'bad' as const, icon: 'cancel' };

  const toneText =
    status.tone === 'good'
      ? 'text-secondary'
      : status.tone === 'bad'
        ? 'text-primary'
        : 'text-on-surface-variant';
  const toneBg =
    status.tone === 'good'
      ? 'bg-secondary/10'
      : status.tone === 'bad'
        ? 'bg-primary/10'
        : 'bg-surface-container-high/40';

  return (
    <aside className="w-80 bg-surface-container-low flex flex-col h-full overflow-y-auto shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.2)] z-30 pb-20">
      <div className="p-6 bg-surface-container shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Logic Inspector
          </h2>
          <span className="text-[10px] font-mono text-on-surface-variant">
            {automaton.states.length} states · {automaton.transitions.length} edges
          </span>
        </div>

        <div className={`p-4 rounded-xl shadow-inner transition-colors ${toneBg}`}>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`material-symbols-outlined text-sm ${toneText}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {status.icon}
            </span>
            <span className={`font-bold text-sm tracking-tight uppercase ${toneText}`}>
              {status.label}
            </span>
            <span className="ml-auto text-[10px] text-on-surface-variant uppercase tracking-widest">
              Step {steps.length === 0 ? 0 : stepIndex + 1} / {steps.length}
            </span>
          </div>
          <div className="font-mono text-xs mt-2 bg-surface px-3 py-2 rounded">
            <span className="text-on-surface-variant line-through opacity-60">
              {consumed || '·'}
            </span>
            <span className="text-on-surface ml-1">
              {remaining || (finished ? '∎' : '·')}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-widest text-on-surface-variant">
            Input String
          </label>
          <input
            value={inputString}
            onChange={(e) => onInputChange(e.target.value)}
            className="w-full bg-surface-container-low px-4 py-3 text-secondary font-mono tracking-[0.2em] outline-none focus:bg-surface-container-high transition-all rounded-t-md border-b-2 border-transparent focus:border-secondary text-sm shadow-inner"
            placeholder="e.g. ab"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant">
              Playback Speed
            </label>
            <span className="text-[10px] text-on-surface-variant font-mono">
              {(speedMs / 1000).toFixed(2)}s / step
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={2000}
            step={50}
            value={speedMs}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none accent-secondary cursor-pointer"
          />
          <div className="flex justify-between">
            <span className="text-[10px] text-on-surface-variant font-mono">0.05s</span>
            <span className="text-[10px] text-on-surface-variant font-mono">2.0s</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onRun}
            className="flex-1 px-3 py-2 text-[11px] font-bold uppercase tracking-widest bg-primary text-on-primary rounded hover:opacity-90"
          >
            Run All
          </button>
          <button
            onClick={onReset}
            className="flex-1 px-3 py-2 text-[11px] font-bold uppercase tracking-widest bg-surface-container-high text-on-surface rounded hover:opacity-90"
          >
            Reset
          </button>
          <button
            onClick={onToggleMultiRun}
            title="Multiple Run"
            className={`px-3 py-2 text-[11px] font-bold uppercase tracking-widest rounded transition-colors ${
              multiRunOpen
                ? 'bg-secondary text-background'
                : 'bg-surface-container-high text-on-surface hover:opacity-90'
            }`}
          >
            Multi
          </button>
        </div>
      </div>

      <div className="flex-grow bg-surface mx-6 mb-6 rounded-xl p-5 font-mono text-[11px] flex flex-col gap-1 shadow-inner overflow-y-auto">
        <p className="text-on-surface-variant mb-3 font-sans uppercase tracking-widest text-[10px]">
          Path Trace
        </p>
        {steps.length === 0 ? (
          <p className="text-on-surface-variant text-[11px] italic">
            No simulation yet — press Step or Run.
          </p>
        ) : (
          steps.map((s, i) => {
            const active = i === stepIndex;
            return (
              <div
                key={i}
                className={`p-2 -mx-2 rounded transition-colors flex flex-wrap items-center gap-1 ${
                  active
                    ? 'bg-secondary/10 ring-1 ring-secondary/40'
                    : 'hover:bg-surface-container-high'
                }`}
              >
                <span className="text-on-surface-variant w-12">Step {i}:</span>
                {s.consumedSymbol && (
                  <span className="text-on-surface mr-1">
                    «{s.consumedSymbol === EPSILON ? 'ε' : s.consumedSymbol}»
                  </span>
                )}
                <span className={active ? 'text-secondary' : 'text-primary'}>
                  {'{'}
                  {Array.from(s.currentStates)
                    .map((id) => stateLookup.get(id) ?? id)
                    .join(', ') || '∅'}
                  {'}'}
                </span>
              </div>
            );
          })
        )}
        {accepted !== null && (
          <p
            className={`mt-3 font-bold uppercase tracking-wider text-[10px] ${
              accepted ? 'text-secondary' : 'text-primary'
            }`}
          >
            {accepted ? 'Accepted by final state set' : 'Rejected — no accept state reached'}
          </p>
        )}
      </div>
    </aside>
  );
}
