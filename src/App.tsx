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
import { useSimulation } from './hooks/useSimulation';
import { processString, type Automaton } from './lib/automaton';

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

  const sim = useSimulation();
  const canvasHandleRef = useRef<CanvasHandle>(null);
  const [showMultiRun, setShowMultiRun] = useState(false);

  const handleAutomatonChange = useCallback(
    (next: Automaton) => sim.setAutomaton(next),
    [sim],
  );

  const handleGenerate = useCallback(
    (automaton: Automaton, layout: Record<string, { x: number; y: number }>) => {
      canvasHandleRef.current?.loadAutomaton(automaton, layout);
      sim.reset();
    },
    [sim],
  );

  const canStepBack = sim.stepIndex > 0;
  const canStepForward = sim.steps.length === 0 || sim.stepIndex < sim.steps.length - 1;

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
            activeStateIds={sim.activeStateIds}
            onAutomatonChange={handleAutomatonChange}
          />

          <GenerateCommandPalette
            isActive={isGenerateActive}
            onClose={() => setIsGenerateActive(false)}
            onGenerate={handleGenerate}
          />

          {showMultiRun && (
            <MultipleRunPanel
              automaton={sim.automaton}
              onClose={() => setShowMultiRun(false)}
            />
          )}
        </div>

        <RightSidebar
          automaton={sim.automaton}
          inputString={sim.inputString}
          onInputChange={sim.setInputString}
          speedMs={sim.speedMs}
          onSpeedChange={sim.setSpeedMs}
          steps={sim.steps}
          stepIndex={sim.stepIndex}
          currentStep={sim.currentStep}
          accepted={sim.accepted}
          onRun={sim.run}
          onReset={sim.reset}
          onToggleMultiRun={() => setShowMultiRun((v) => !v)}
          multiRunOpen={showMultiRun}
        />
      </div>

      <BottomNavBar
        isPlaying={sim.isPlaying}
        canStepBack={canStepBack}
        canStepForward={canStepForward}
        onPlay={sim.play}
        onPause={sim.pause}
        onStepBack={sim.stepBack}
        onStepForward={sim.step}
      />

      <DebugToast isActive={isDebugActive} onClose={() => setIsDebugActive(false)} />
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
      .map((s) => ({ input: s, result: processString(automaton, s) }));
  }, [text, automaton]);

  const acceptedCount = results.filter((r) => r.result.accepted).length;

  return (
    <div className="absolute top-6 right-6 w-[360px] z-30 bg-surface-container shadow-2xl rounded-xl border border-outline-variant flex flex-col max-h-[80vh]">
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
