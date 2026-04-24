import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Header,
  LeftSidebar,
  Canvas,
  GenerateCommandPalette,
  RightSidebar,
  BottomNavBar,
  DebugToast,
  type CanvasHandle,
} from './components';
import { useSimulationState } from './hooks/useSimulationState';
import {
  computeEpsilonClosure,
  EPSILON,
  processString,
  stepThrough,
  type Automaton,
  type SimulationStep,
} from './lib/automaton';

const EMPTY_AUTOMATON: Automaton = { states: [], transitions: [], alphabet: [] };

export default function App() {
  const {
    isExplainActive,
    isGenerateActive,
    isDebugActive,
    setIsGenerateActive,
    setIsDebugActive,
    handleExplainClick,
    handleGenerateClick,
    handleDebugClick,
  } = useSimulationState();

  const automatonRef = useRef<Automaton>(EMPTY_AUTOMATON);
  const canvasHandleRef = useRef<CanvasHandle>(null);
  const [inputString, setInputString] = useState('ab');
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [showMultiRun, setShowMultiRun] = useState(false);

  const handleAutomatonChange = useCallback((next: Automaton) => {
    automatonRef.current = next;
  }, []);

  const resetSimulation = useCallback(() => {
    setSteps([]);
    setStepIndex(-1);
    setAccepted(null);
  }, []);

  const buildSteps = useCallback((): SimulationStep[] => {
    const automaton = automatonRef.current;
    const collected: SimulationStep[] = [];
    const iter = stepThrough(automaton, inputString);
    let next = iter.next();
    while (!next.done) {
      collected.push(next.value);
      next = iter.next();
    }
    setAccepted(next.value === true);
    return collected;
  }, [inputString]);

  const handleStep = useCallback(() => {
    if (steps.length === 0) {
      const collected = buildSteps();
      setSteps(collected);
      setStepIndex(0);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [buildSteps, steps.length]);

  const handleRunAll = useCallback(() => {
    const result = processString(automatonRef.current, inputString);
    setSteps(result.steps);
    setStepIndex(result.steps.length - 1);
    setAccepted(result.accepted);
  }, [inputString]);

  const handleGenerate = useCallback(
    (automaton: Automaton, layout: Record<string, { x: number; y: number }>) => {
      canvasHandleRef.current?.loadAutomaton(automaton, layout);
      resetSimulation();
    },
    [resetSimulation],
  );

  const activeStep = stepIndex >= 0 ? steps[stepIndex] : null;
  const activeStateIds = useMemo(() => {
    if (activeStep) return activeStep.currentStates;
    const automaton = automatonRef.current;
    const startIds = new Set(automaton.states.filter((s) => s.isStart).map((s) => s.id));
    return computeEpsilonClosure(startIds, automaton.transitions);
  }, [activeStep]);

  return (
    <div className="h-screen w-screen bg-background text-on-surface font-['Space_Grotesk'] overflow-hidden flex flex-col selection:bg-primary selection:text-on-primary relative">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar
          isExplainActive={isExplainActive}
          isGenerateActive={isGenerateActive}
          isDebugActive={isDebugActive}
          onExplainClick={handleExplainClick}
          onGenerateClick={handleGenerateClick}
          onDebugClick={handleDebugClick}
        />

        <div className="flex-1 relative canvas-grid bg-surface">
          <Canvas
            handleRef={canvasHandleRef}
            activeStateIds={activeStateIds}
            onAutomatonChange={handleAutomatonChange}
          />

          <SimulationBar
            inputString={inputString}
            onInputChange={(s) => {
              setInputString(s);
              resetSimulation();
            }}
            onStep={handleStep}
            onRun={handleRunAll}
            onReset={resetSimulation}
            onToggleMultiRun={() => setShowMultiRun((v) => !v)}
            stepIndex={stepIndex}
            totalSteps={steps.length}
            currentStep={activeStep}
            accepted={accepted}
          />

          <GenerateCommandPalette
            isActive={isGenerateActive}
            onClose={() => setIsGenerateActive(false)}
            onGenerate={handleGenerate}
          />

          {showMultiRun && (
            <MultipleRunPanel
              automaton={automatonRef.current}
              onClose={() => setShowMultiRun(false)}
            />
          )}
        </div>

        <RightSidebar isDebugActive={isDebugActive} />
      </div>

      <BottomNavBar />

      <DebugToast isActive={isDebugActive} onClose={() => setIsDebugActive(false)} />
    </div>
  );
}

interface SimulationBarProps {
  inputString: string;
  onInputChange: (value: string) => void;
  onStep: () => void;
  onRun: () => void;
  onReset: () => void;
  onToggleMultiRun: () => void;
  stepIndex: number;
  totalSteps: number;
  currentStep: SimulationStep | null;
  accepted: boolean | null;
}

function SimulationBar({
  inputString,
  onInputChange,
  onStep,
  onRun,
  onReset,
  onToggleMultiRun,
  stepIndex,
  totalSteps,
  currentStep,
  accepted,
}: SimulationBarProps) {
  const consumed = currentStep
    ? inputString.slice(0, inputString.length - currentStep.remainingString.length)
    : '';
  const remaining = currentStep?.remainingString ?? inputString;
  const finished = totalSteps > 0 && stepIndex >= totalSteps - 1;

  const statusLabel = accepted === null ? 'IDLE' : accepted ? 'ACCEPTED' : 'REJECTED';
  const statusColor =
    accepted === null
      ? 'text-on-surface-variant'
      : accepted
        ? 'text-secondary'
        : 'text-primary';

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-surface-container-low/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl flex items-center gap-4 z-20 border border-outline-variant">
      <div className="flex flex-col gap-1">
        <label className="text-[9px] uppercase tracking-widest text-on-surface-variant">
          Input String
        </label>
        <input
          value={inputString}
          onChange={(e) => onInputChange(e.target.value)}
          className="bg-surface-container px-3 py-1.5 text-secondary font-mono text-sm rounded outline-none focus:ring-1 focus:ring-secondary w-48"
          placeholder="e.g. ab"
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[180px]">
        <label className="text-[9px] uppercase tracking-widest text-on-surface-variant">Tape</label>
        <div className="font-mono text-sm bg-surface-container px-3 py-1.5 rounded">
          <span className="text-on-surface-variant line-through opacity-60">{consumed || '·'}</span>
          <span className="text-on-surface ml-1">{remaining || (finished ? '∎' : '·')}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onStep}
          disabled={finished && totalSteps > 0}
          className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-secondary text-background rounded hover:opacity-90 disabled:opacity-40"
        >
          Step
        </button>
        <button
          onClick={onRun}
          className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-primary text-on-primary rounded hover:opacity-90"
        >
          Run
        </button>
        <button
          onClick={onReset}
          className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-surface-container-high text-on-surface rounded hover:opacity-90"
        >
          Reset
        </button>
        <button
          onClick={onToggleMultiRun}
          className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-surface-container-high text-on-surface rounded hover:opacity-90 border border-outline-variant"
        >
          Multi-Run
        </button>
      </div>

      <div className="flex flex-col items-end gap-0.5 min-w-[110px]">
        <span className={`text-[10px] uppercase tracking-widest font-bold ${statusColor}`}>
          {statusLabel}
        </span>
        <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">
          Step {totalSteps === 0 ? 0 : stepIndex + 1} / {totalSteps}
        </span>
        {currentStep?.consumedSymbol && (
          <span className="text-[10px] text-on-surface-variant font-mono">
            consumed «{currentStep.consumedSymbol === EPSILON ? 'ε' : currentStep.consumedSymbol}»
          </span>
        )}
      </div>
    </div>
  );
}

interface MultipleRunPanelProps {
  automaton: Automaton;
  onClose: () => void;
}

function MultipleRunPanel({ automaton, onClose }: MultipleRunPanelProps) {
  const [text, setText] = useState('ab\nabb\naabb\nbbabb\n');
  const results = useMemo(() => {
    return text
      .split('\n')
      .map((line) => line)
      .map((s) => ({ input: s, result: processString(automaton, s) }));
  }, [text, automaton]);

  const acceptedCount = results.filter((r) => r.result.accepted).length;

  return (
    <div className="absolute top-32 right-6 w-[360px] z-30 bg-surface-container shadow-2xl rounded-xl border border-outline-variant flex flex-col max-h-[70vh]">
      <div className="px-4 py-3 bg-surface-container-low flex items-center gap-3 rounded-t-xl border-b border-outline-variant">
        <span className="text-xs font-bold uppercase tracking-widest text-on-surface">
          Multiple Run
        </span>
        <span className="ml-auto text-[10px] text-on-surface-variant">
          {acceptedCount}/{results.length} accepted
        </span>
        <button
          onClick={onClose}
          className="text-[10px] text-on-surface-variant font-mono bg-surface-container-high hover:bg-surface-container-highest transition-colors px-2 py-1 rounded"
        >
          ✕
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        spellCheck={false}
        className="w-full bg-surface-container-low px-3 py-2 text-secondary font-mono text-xs outline-none focus:bg-surface-container-high resize-none border-b border-outline-variant"
        placeholder="One string per line"
      />

      <div className="overflow-y-auto flex-1 font-mono text-xs">
        {results.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-1.5 border-b border-outline-variant/40 last:border-0"
          >
            <span className="text-on-surface-variant w-6">{i + 1}</span>
            <span className="text-on-surface flex-1 truncate">
              {r.input.length === 0 ? <em className="text-on-surface-variant">ε (empty)</em> : r.input}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${
                r.result.accepted ? 'text-secondary' : 'text-primary'
              }`}
            >
              {r.result.accepted ? 'Accept' : 'Reject'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
