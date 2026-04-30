import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  computeEpsilonClosure,
  processString,
  stepThrough,
  type Automaton,
  type SimulationStep,
} from '../lib/automaton';

const EMPTY_AUTOMATON: Automaton = { states: [], transitions: [], alphabet: [] };

export interface UseSimulationApi {
  automaton: Automaton;
  setAutomaton: (a: Automaton) => void;
  inputString: string;
  setInputString: (s: string) => void;
  steps: SimulationStep[];
  stepIndex: number;
  currentStep: SimulationStep | null;
  activeStateIds: Set<string>;
  accepted: boolean | null;
  isPlaying: boolean;
  speedMs: number;
  setSpeedMs: (ms: number) => void;
  step: () => void;
  stepBack: () => void;
  run: () => void;
  reset: () => void;
  play: () => void;
  pause: () => void;
}

export function useSimulation(): UseSimulationApi {
  const automatonRef = useRef<Automaton>(EMPTY_AUTOMATON);
  const [automatonVersion, setAutomatonVersion] = useState(0);
  const [inputString, setInputStringState] = useState('ab');
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(500);

  const setAutomaton = useCallback((a: Automaton) => {
    automatonRef.current = a;
    setAutomatonVersion((v) => v + 1);
  }, []);

  const reset = useCallback(() => {
    setSteps([]);
    setStepIndex(-1);
    setAccepted(null);
    setIsPlaying(false);
  }, []);

  const setInputString = useCallback(
    (s: string) => {
      setInputStringState(s);
      reset();
    },
    [reset],
  );

  const buildSteps = useCallback((): { steps: SimulationStep[]; accepted: boolean } => {
    const collected: SimulationStep[] = [];
    const iter = stepThrough(automatonRef.current, inputString);
    let next = iter.next();
    while (!next.done) {
      collected.push(next.value);
      next = iter.next();
    }
    return { steps: collected, accepted: next.value === true };
  }, [inputString]);

  const ensureSteps = useCallback((): SimulationStep[] => {
    if (steps.length > 0) return steps;
    const built = buildSteps();
    setSteps(built.steps);
    setAccepted(built.accepted);
    return built.steps;
  }, [buildSteps, steps]);

  const step = useCallback(() => {
    const all = ensureSteps();
    setStepIndex((i) => Math.min(i + 1, all.length - 1));
  }, [ensureSteps]);

  const stepBack = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const run = useCallback(() => {
    const result = processString(automatonRef.current, inputString);
    setSteps(result.steps);
    setStepIndex(result.steps.length - 1);
    setAccepted(result.accepted);
    setIsPlaying(false);
  }, [inputString]);

  const play = useCallback(() => {
    ensureSteps();
    setIsPlaying(true);
  }, [ensureSteps]);

  const pause = useCallback(() => setIsPlaying(false), []);

  useEffect(() => {
    if (!isPlaying) return;
    const tick = setInterval(() => {
      setStepIndex((i) => {
        const total = steps.length;
        if (total === 0 || i >= total - 1) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, speedMs);
    return () => clearInterval(tick);
  }, [isPlaying, speedMs, steps.length]);

  const currentStep = stepIndex >= 0 ? (steps[stepIndex] ?? null) : null;

  const activeStateIds = useMemo(() => {
    if (currentStep) return currentStep.currentStates;
    const a = automatonRef.current;
    const startIds = new Set(a.states.filter((s) => s.isStart).map((s) => s.id));
    return computeEpsilonClosure(startIds, a.transitions);
  }, [currentStep, automatonVersion]);

  return {
    automaton: automatonRef.current,
    setAutomaton,
    inputString,
    setInputString,
    steps,
    stepIndex,
    currentStep,
    activeStateIds,
    accepted,
    isPlaying,
    speedMs,
    setSpeedMs,
    step,
    stepBack,
    run,
    reset,
    play,
    pause,
  };
}
