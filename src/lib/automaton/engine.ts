import {
  EPSILON,
  type Automaton,
  type SimulationResult,
  type SimulationStep,
  type Transition,
  type TransitionSymbol,
} from './types';

export function expandSymbols(label: string): TransitionSymbol[] {
  const trimmed = label.trim();
  if (trimmed === '' || trimmed === EPSILON) return [EPSILON];
  return trimmed
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function transitionMatches(t: Transition, symbol: TransitionSymbol): boolean {
  return expandSymbols(t.symbol).includes(symbol);
}

export function computeEpsilonClosure(
  states: Set<string>,
  transitions: Transition[],
): Set<string> {
  const closure = new Set<string>(states);
  const stack: string[] = Array.from(states);

  while (stack.length > 0) {
    const current = stack.pop()!;
    for (const t of transitions) {
      if (t.source === current && transitionMatches(t, EPSILON) && !closure.has(t.target)) {
        closure.add(t.target);
        stack.push(t.target);
      }
    }
  }

  return closure;
}

function move(
  states: Set<string>,
  symbol: TransitionSymbol,
  transitions: Transition[],
): Set<string> {
  const result = new Set<string>();
  for (const t of transitions) {
    if (states.has(t.source) && transitionMatches(t, symbol)) {
      result.add(t.target);
    }
  }
  return result;
}

function getStartIds(automaton: Automaton): Set<string> {
  return new Set(automaton.states.filter((s) => s.isStart).map((s) => s.id));
}

function isAcceptingSet(automaton: Automaton, ids: Set<string>): boolean {
  return automaton.states.some((s) => s.isAccept && ids.has(s.id));
}

export function* stepThrough(
  automaton: Automaton,
  inputString: string,
): Generator<SimulationStep, boolean, unknown> {
  const startIds = getStartIds(automaton);
  let currentStates = computeEpsilonClosure(startIds, automaton.transitions);
  let remainingString = inputString;

  yield {
    currentStates: new Set(currentStates),
    remainingString,
    consumedSymbol: null,
  };

  for (const symbol of inputString) {
    if (currentStates.size === 0) break;

    const moved = move(currentStates, symbol, automaton.transitions);
    currentStates = computeEpsilonClosure(moved, automaton.transitions);
    remainingString = remainingString.slice(1);

    yield {
      currentStates: new Set(currentStates),
      remainingString,
      consumedSymbol: symbol,
    };
  }

  return isAcceptingSet(automaton, currentStates);
}

export function processString(automaton: Automaton, inputString: string): SimulationResult {
  const steps: SimulationStep[] = [];
  const iterator = stepThrough(automaton, inputString);

  let next = iterator.next();
  while (!next.done) {
    steps.push(next.value);
    next = iterator.next();
  }

  const finalStep = steps[steps.length - 1];
  return {
    accepted: next.value === true,
    finalStates: finalStep ? finalStep.currentStates : new Set<string>(),
    steps,
  };
}
