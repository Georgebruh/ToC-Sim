export const EPSILON = 'ε';

export type TransitionSymbol = string;

export interface State {
  id: string;
  label: string;
  isStart: boolean;
  isAccept: boolean;
}

export interface Transition {
  id: string;
  source: string;
  target: string;
  symbol: TransitionSymbol;
}

export interface Automaton {
  states: State[];
  transitions: Transition[];
  alphabet: TransitionSymbol[];
}

export interface SimulationStep {
  currentStates: Set<string>;
  remainingString: string;
  consumedSymbol: TransitionSymbol | null;
}

export interface SimulationResult {
  accepted: boolean;
  finalStates: Set<string>;
  steps: SimulationStep[];
}
