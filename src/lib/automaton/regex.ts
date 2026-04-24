import { EPSILON, type Automaton, type State, type Transition } from './types';

type Node =
  | { kind: 'lit'; symbol: string }
  | { kind: 'epsilon' }
  | { kind: 'concat'; left: Node; right: Node }
  | { kind: 'union'; left: Node; right: Node }
  | { kind: 'star'; child: Node }
  | { kind: 'plus'; child: Node }
  | { kind: 'opt'; child: Node };

class Parser {
  private pos = 0;
  private input: string;

  constructor(input: string) {
    this.input = input;
  }

  parse(): Node {
    if (this.input.length === 0) return { kind: 'epsilon' };
    const node = this.parseUnion();
    if (this.pos < this.input.length) {
      throw new Error(`Unexpected character "${this.input[this.pos]}" at position ${this.pos}`);
    }
    return node;
  }

  private peek() {
    return this.input[this.pos];
  }
  private consume() {
    return this.input[this.pos++];
  }

  private parseUnion(): Node {
    let left = this.parseConcat();
    while (this.peek() === '|') {
      this.consume();
      const right = this.parseConcat();
      left = { kind: 'union', left, right };
    }
    return left;
  }

  private parseConcat(): Node {
    const items: Node[] = [];
    while (this.pos < this.input.length && this.peek() !== ')' && this.peek() !== '|') {
      items.push(this.parseQuantified());
    }
    if (items.length === 0) return { kind: 'epsilon' };
    return items.reduce((acc, n) => ({ kind: 'concat', left: acc, right: n }));
  }

  private parseQuantified(): Node {
    let atom = this.parseAtom();
    while (this.peek() === '*' || this.peek() === '+' || this.peek() === '?') {
      const op = this.consume();
      atom =
        op === '*'
          ? { kind: 'star', child: atom }
          : op === '+'
            ? { kind: 'plus', child: atom }
            : { kind: 'opt', child: atom };
    }
    return atom;
  }

  private parseAtom(): Node {
    const ch = this.peek();
    if (ch === '(') {
      this.consume();
      const inner = this.parseUnion();
      if (this.peek() !== ')') throw new Error('Missing closing parenthesis');
      this.consume();
      return inner;
    }
    if (ch === '\\') {
      this.consume();
      const escaped = this.consume();
      if (escaped === undefined) throw new Error('Trailing backslash');
      return { kind: 'lit', symbol: escaped };
    }
    if (ch === undefined || ch === ')' || ch === '|' || ch === '*' || ch === '+' || ch === '?') {
      throw new Error(`Unexpected token "${ch ?? 'EOF'}" at position ${this.pos}`);
    }
    this.consume();
    return { kind: 'lit', symbol: ch };
  }
}

interface Fragment {
  start: string;
  accept: string;
  states: State[];
  transitions: Transition[];
}

class Builder {
  private stateCounter = 0;
  private edgeCounter = 0;

  newState(): State {
    return {
      id: `q${this.stateCounter++}`,
      label: `q${this.stateCounter - 1}`,
      isStart: false,
      isAccept: false,
    };
  }

  newEdge(source: string, target: string, symbol: string): Transition {
    return {
      id: `t${this.edgeCounter++}`,
      source,
      target,
      symbol,
    };
  }

  build(node: Node): Fragment {
    switch (node.kind) {
      case 'epsilon': {
        const s = this.newState();
        const a = this.newState();
        return {
          start: s.id,
          accept: a.id,
          states: [s, a],
          transitions: [this.newEdge(s.id, a.id, EPSILON)],
        };
      }
      case 'lit': {
        const s = this.newState();
        const a = this.newState();
        return {
          start: s.id,
          accept: a.id,
          states: [s, a],
          transitions: [this.newEdge(s.id, a.id, node.symbol)],
        };
      }
      case 'concat': {
        const left = this.build(node.left);
        const right = this.build(node.right);
        return {
          start: left.start,
          accept: right.accept,
          states: [...left.states, ...right.states],
          transitions: [
            ...left.transitions,
            this.newEdge(left.accept, right.start, EPSILON),
            ...right.transitions,
          ],
        };
      }
      case 'union': {
        const left = this.build(node.left);
        const right = this.build(node.right);
        const s = this.newState();
        const a = this.newState();
        return {
          start: s.id,
          accept: a.id,
          states: [s, ...left.states, ...right.states, a],
          transitions: [
            this.newEdge(s.id, left.start, EPSILON),
            this.newEdge(s.id, right.start, EPSILON),
            ...left.transitions,
            ...right.transitions,
            this.newEdge(left.accept, a.id, EPSILON),
            this.newEdge(right.accept, a.id, EPSILON),
          ],
        };
      }
      case 'star': {
        const child = this.build(node.child);
        const s = this.newState();
        const a = this.newState();
        return {
          start: s.id,
          accept: a.id,
          states: [s, ...child.states, a],
          transitions: [
            this.newEdge(s.id, child.start, EPSILON),
            this.newEdge(s.id, a.id, EPSILON),
            ...child.transitions,
            this.newEdge(child.accept, child.start, EPSILON),
            this.newEdge(child.accept, a.id, EPSILON),
          ],
        };
      }
      case 'plus': {
        const child = this.build(node.child);
        const s = this.newState();
        const a = this.newState();
        return {
          start: s.id,
          accept: a.id,
          states: [s, ...child.states, a],
          transitions: [
            this.newEdge(s.id, child.start, EPSILON),
            ...child.transitions,
            this.newEdge(child.accept, child.start, EPSILON),
            this.newEdge(child.accept, a.id, EPSILON),
          ],
        };
      }
      case 'opt': {
        const child = this.build(node.child);
        const s = this.newState();
        const a = this.newState();
        return {
          start: s.id,
          accept: a.id,
          states: [s, ...child.states, a],
          transitions: [
            this.newEdge(s.id, child.start, EPSILON),
            this.newEdge(s.id, a.id, EPSILON),
            ...child.transitions,
            this.newEdge(child.accept, a.id, EPSILON),
          ],
        };
      }
    }
  }
}

export interface RegexNFAResult {
  automaton: Automaton;
  layout: Record<string, { x: number; y: number }>;
}

export function regexToNFA(source: string): RegexNFAResult {
  const ast = new Parser(source).parse();
  const builder = new Builder();
  const frag = builder.build(ast);

  const states = frag.states.map((s) => ({
    ...s,
    isStart: s.id === frag.start,
    isAccept: s.id === frag.accept,
  }));

  const automaton: Automaton = {
    states,
    transitions: frag.transitions,
    alphabet: Array.from(
      new Set(frag.transitions.map((t) => t.symbol).filter((sym) => sym !== EPSILON)),
    ),
  };

  return {
    automaton,
    layout: layeredLayout(automaton),
  };
}

function layeredLayout(automaton: Automaton): Record<string, { x: number; y: number }> {
  const layer = new Map<string, number>();
  const start = automaton.states.find((s) => s.isStart)?.id;
  if (!start) return {};

  const queue: string[] = [start];
  layer.set(start, 0);
  while (queue.length > 0) {
    const node = queue.shift()!;
    const lvl = layer.get(node)!;
    for (const t of automaton.transitions) {
      if (t.source === node && !layer.has(t.target)) {
        layer.set(t.target, lvl + 1);
        queue.push(t.target);
      }
    }
  }

  // Any orphans get put on a final layer.
  let maxLayer = 0;
  layer.forEach((v) => {
    if (v > maxLayer) maxLayer = v;
  });
  for (const s of automaton.states) {
    if (!layer.has(s.id)) layer.set(s.id, maxLayer + 1);
  }

  const byLayer = new Map<number, string[]>();
  layer.forEach((v, k) => {
    if (!byLayer.has(v)) byLayer.set(v, []);
    byLayer.get(v)!.push(k);
  });

  const COL = 160;
  const ROW = 100;
  const layout: Record<string, { x: number; y: number }> = {};
  byLayer.forEach((ids, lvl) => {
    const total = ids.length;
    ids.forEach((id, idx) => {
      layout[id] = {
        x: lvl * COL + 80,
        y: (idx - (total - 1) / 2) * ROW + 300,
      };
    });
  });

  return layout;
}
