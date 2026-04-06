export type State = string;
export type AlphabetSymbol = string;

// Using an empty string to represent Epsilon (ε) transitions in NFAs
export const EPSILON = '';

export interface Transition {
  from: State;
  symbol: AlphabetSymbol;
  to: State;
}

/**
 * JSON Schema representing an Automaton (DFA or NFA)
 */
export interface AutomatonSchema {
  type: 'DFA' | 'NFA';
  states: State[];
  alphabet: AlphabetSymbol[];
  transitions: Transition[];
  startState: State;
  acceptStates: State[];
}

export class Automaton {
  public schema: AutomatonSchema;
  // A mapping of: State -> (Symbol -> Set<State>)
  private transitionMap: Map<State, Map<AlphabetSymbol, Set<State>>>;

  constructor(schema: AutomatonSchema) {
    this.schema = schema;
    this.transitionMap = new Map();

    // Initialize mapping
    for (const state of schema.states) {
      this.transitionMap.set(state, new Map());
    }

    // Populate transitions into the lookup map for O(1) retrieval
    for (const transition of schema.transitions) {
      if (!this.transitionMap.has(transition.from)) {
        this.transitionMap.set(transition.from, new Map());
      }
      
      const stateMap = this.transitionMap.get(transition.from)!;
      
      if (!stateMap.has(transition.symbol)) {
        stateMap.set(transition.symbol, new Set());
      }
      stateMap.get(transition.symbol)!.add(transition.to);
    }
  }

  /**
   * Computes the epsilon closure for a given set of states.
   * i.e., all states reachable from the current states using only epsilon transitions.
   */
  public getEpsilonClosure(states: Set<State>): Set<State> {
    const closure = new Set<State>(states);
    const stack: State[] = Array.from(states);

    while (stack.length > 0) {
      const currentState = stack.pop()!;
      const stateTransitions = this.transitionMap.get(currentState);
      
      if (stateTransitions && stateTransitions.has(EPSILON)) {
        const epsilonTransitions = stateTransitions.get(EPSILON)!;
        for (const nextState of epsilonTransitions) {
          if (!closure.has(nextState)) {
            closure.add(nextState);
            stack.push(nextState);
          }
        }
      }
    }

    return closure;
  }

  /**
   * Gets the set of next states possible from the current states given an input symbol.
   */
  public getNextStates(currentStates: Set<State>, symbol: AlphabetSymbol): Set<State> {
    const nextStates = new Set<State>();
    
    for (const state of currentStates) {
      const stateTransitions = this.transitionMap.get(state);
      if (stateTransitions && stateTransitions.has(symbol)) {
        for (const nextState of stateTransitions.get(symbol)!) {
          nextStates.add(nextState);
        }
      }
    }
    
    // For NFA, apply epsilon closure to the resulting states.
    // For DFA, we skip the epsilon closure as they are deterministic.
    return this.schema.type === 'NFA' ? this.getEpsilonClosure(nextStates) : nextStates;
  }
}

/**
 * Generator function that yields the state of the automaton at each step.
 * Allows pausing, stepping backwards/forwards in a UI.
 * * @returns A generator yielding `{ currentStates, remainingString }` and returning a boolean (accepted or not).
 */
export function* stepThrough(
  automaton: Automaton, 
  inputString: string
): Generator<{ currentStates: Set<State>, remainingString: string }, boolean, unknown> {
  
  // For NFAs, the starting state must include its epsilon closure
  let currentStates = automaton.schema.type === 'NFA' 
    ? automaton.getEpsilonClosure(new Set([automaton.schema.startState]))
    : new Set([automaton.schema.startState]);
  
  let remainingString = inputString;

  // Yield the initial configuration
  yield { currentStates: new Set(currentStates), remainingString };

  for (const symbol of inputString) {
    // If we've reached a dead state (no valid transitions), we can stop
    if (currentStates.size === 0) {
      break;
    }
    
    currentStates = automaton.getNextStates(currentStates, symbol);
    remainingString = remainingString.slice(1);
    
    yield { currentStates: new Set(currentStates), remainingString };
  }

  // After processing all symbols (or dying early), check if any active state is an accept state
  for (const state of currentStates) {
    if (automaton.schema.acceptStates.includes(state)) {
      return true;
    }
  }

  return false;
}

/**
 * Helper function to run an entire string immediately without manually iterating.
 */
export function processString(automaton: Automaton, inputString: string): boolean {
  const iterator = stepThrough(automaton, inputString);
  let step = iterator.next();
  
  // Run the generator until it finishes
  while (!step.done) {
    step = iterator.next();
  }
  
  // Return the final result (true/false)
  return step.value as boolean;
}