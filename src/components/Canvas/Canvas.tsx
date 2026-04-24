import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MousePointer2, Circle, ArrowRight, Trash2 } from 'lucide-react';

import { AutomatonNode, type AutomatonNodeData } from './AutomatonNode';
import { TransitionEdge, type TransitionEdgeData } from './TransitionEdge';
import { EPSILON, expandSymbols, type Automaton } from '../../lib/automaton';

const nodeTypes: NodeTypes = { automaton: AutomatonNode };
const edgeTypes: EdgeTypes = { transition: TransitionEdge };

export type AutomatonFlowNode = Node<AutomatonNodeData, 'automaton'>;
export type AutomatonFlowEdge = Edge<TransitionEdgeData, 'transition'>;

export type ToolMode = 'select' | 'state' | 'transition' | 'delete';

export interface CanvasHandle {
  loadAutomaton: (automaton: Automaton, layout?: Record<string, { x: number; y: number }>) => void;
  clear: () => void;
}

export interface CanvasProps {
  activeStateIds?: Set<string>;
  onAutomatonChange?: (automaton: Automaton) => void;
  handleRef?: React.Ref<CanvasHandle>;
}

export function flowToAutomaton(
  nodes: AutomatonFlowNode[],
  edges: AutomatonFlowEdge[],
): Automaton {
  const states = nodes.map((n) => ({
    id: n.id,
    label: n.data.label,
    isStart: !!n.data.isStart,
    isAccept: !!n.data.isAccept,
  }));

  const transitions = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    symbol: e.data?.symbol ?? EPSILON,
  }));

  const alphabet = Array.from(
    new Set(
      transitions.flatMap((t) => expandSymbols(t.symbol)).filter((s) => s !== EPSILON),
    ),
  );

  return { states, transitions, alphabet };
}

function CanvasInner({ activeStateIds, onAutomatonChange, handleRef }: CanvasProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);
  const { screenToFlowPosition, fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<AutomatonFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AutomatonFlowEdge>([]);
  const [tool, setTool] = useState<ToolMode>('select');
  const [contextMenu, setContextMenu] = useState<{
    nodeId: string;
    x: number;
    y: number;
  } | null>(null);

  const decoratedNodes = useMemo<AutomatonFlowNode[]>(
    () =>
      nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isActive: !!activeStateIds?.has(n.id),
        },
      })),
    [nodes, activeStateIds],
  );

  useEffect(() => {
    onAutomatonChange?.(flowToAutomaton(nodes, edges));
  }, [nodes, edges, onAutomatonChange]);

  const nextId = useCallback(() => {
    const id = `q${idCounter.current}`;
    idCounter.current += 1;
    return id;
  }, []);

  useImperativeHandle(
    handleRef,
    () => ({
      clear: () => {
        setNodes([]);
        setEdges([]);
        idCounter.current = 0;
      },
      loadAutomaton: (automaton, layout) => {
        const newNodes: AutomatonFlowNode[] = automaton.states.map((s, i) => ({
          id: s.id,
          type: 'automaton',
          position: layout?.[s.id] ?? { x: i * 140 + 80, y: 200 },
          data: {
            label: s.label,
            isStart: s.isStart,
            isAccept: s.isAccept,
            isActive: false,
          },
        }));
        const newEdges: AutomatonFlowEdge[] = automaton.transitions.map((t) => ({
          id: t.id,
          source: t.source,
          target: t.target,
          type: 'transition',
          data: { symbol: t.symbol },
          label: t.symbol,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#48474b' },
        }));
        const maxId = automaton.states
          .map((s) => parseInt(s.id.replace(/^q/, ''), 10))
          .filter((n) => !Number.isNaN(n))
          .reduce((a, b) => Math.max(a, b), -1);
        idCounter.current = maxId + 1;
        setNodes(newNodes);
        setEdges(newEdges);
        queueMicrotask(() => fitView({ duration: 400, padding: 0.2 }));
      },
    }),
    [fitView, setEdges, setNodes],
  );

  const createNodeAt = useCallback(
    (clientX: number, clientY: number) => {
      const position = screenToFlowPosition({ x: clientX, y: clientY });
      const id = nextId();
      setNodes((current) => [
        ...current,
        {
          id,
          type: 'automaton',
          position,
          data: {
            label: id,
            isStart: current.length === 0,
            isAccept: false,
            isActive: false,
          },
        },
      ]);
    },
    [nextId, screenToFlowPosition, setNodes],
  );

  const handlePaneClick = useCallback(
    (event: ReactMouseEvent) => {
      closeContextMenu();
      if (tool === 'state') {
        createNodeAt(event.clientX, event.clientY);
      }
    },
    [createNodeAt, tool],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: AutomatonFlowEdge = {
        id: `e_${connection.source}_${connection.target}_${Date.now()}`,
        source: connection.source!,
        target: connection.target!,
        type: 'transition',
        data: { symbol: EPSILON },
        label: EPSILON,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#48474b' },
      };
      setEdges((current) => addEdge(newEdge, current) as AutomatonFlowEdge[]);
    },
    [setEdges],
  );

  const handleNodeClick = useCallback(
    (_event: ReactMouseEvent, node: Node) => {
      if (tool === 'delete') {
        const targetId = node.id;
        setNodes((current) => current.filter((n) => n.id !== targetId));
        setEdges((current) =>
          current.filter((e) => e.source !== targetId && e.target !== targetId),
        );
      }
    },
    [setEdges, setNodes, tool],
  );

  const handleEdgeClick = useCallback(
    (_event: ReactMouseEvent, edge: Edge) => {
      if (tool === 'delete') {
        setEdges((current) => current.filter((e) => e.id !== edge.id));
      }
    },
    [setEdges, tool],
  );

  const onNodeContextMenu = useCallback(
    (event: ReactMouseEvent, node: Node) => {
      event.preventDefault();
      const bounds = wrapperRef.current?.getBoundingClientRect();
      setContextMenu({
        nodeId: node.id,
        x: event.clientX - (bounds?.left ?? 0),
        y: event.clientY - (bounds?.top ?? 0),
      });
    },
    [],
  );

  function closeContextMenu() {
    setContextMenu(null);
  }

  const toggleStart = useCallback(() => {
    if (!contextMenu) return;
    const targetId = contextMenu.nodeId;
    setNodes((current) =>
      current.map((n) =>
        n.id === targetId
          ? { ...n, data: { ...n.data, isStart: !n.data.isStart } }
          : { ...n, data: { ...n.data, isStart: false } },
      ),
    );
    closeContextMenu();
  }, [contextMenu, setNodes]);

  const toggleAccept = useCallback(() => {
    if (!contextMenu) return;
    const targetId = contextMenu.nodeId;
    setNodes((current) =>
      current.map((n) =>
        n.id === targetId
          ? { ...n, data: { ...n.data, isAccept: !n.data.isAccept } }
          : n,
      ),
    );
    closeContextMenu();
  }, [contextMenu, setNodes]);

  const deleteNode = useCallback(() => {
    if (!contextMenu) return;
    const targetId = contextMenu.nodeId;
    setNodes((current) => current.filter((n) => n.id !== targetId));
    setEdges((current) =>
      current.filter((e) => e.source !== targetId && e.target !== targetId),
    );
    closeContextMenu();
  }, [contextMenu, setEdges, setNodes]);

  const cursorClass =
    tool === 'state'
      ? 'cursor-crosshair'
      : tool === 'delete'
        ? 'cursor-not-allowed'
        : '';

  return (
    <div ref={wrapperRef} className={`w-full h-full relative ${cursorClass}`}>
      <ReactFlow
        nodes={decoratedNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={handlePaneClick}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onNodeContextMenu={onNodeContextMenu}
        nodesDraggable={tool !== 'delete'}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#2f3444" gap={28} size={1} />
        <Controls className="!bg-surface-container-low !border-outline-variant" />
      </ReactFlow>

      <ToolPalette tool={tool} onChange={setTool} />

      {contextMenu && (
        <div
          className="absolute z-50 bg-surface-container shadow-xl rounded-lg border border-outline-variant py-1 text-sm min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={toggleStart}
            className="w-full text-left px-3 py-1.5 hover:bg-surface-container-high text-on-surface"
          >
            Toggle Start State
          </button>
          <button
            onClick={toggleAccept}
            className="w-full text-left px-3 py-1.5 hover:bg-surface-container-high text-on-surface"
          >
            Toggle Accept State
          </button>
          <div className="h-px bg-outline-variant my-1" />
          <button
            onClick={deleteNode}
            className="w-full text-left px-3 py-1.5 hover:bg-surface-container-high text-on-surface-variant"
          >
            Delete Node
          </button>
        </div>
      )}

      <div className="absolute bottom-4 left-4 bg-surface-container-low/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] text-on-surface-variant uppercase tracking-widest pointer-events-none">
        {toolHint(tool)}
      </div>
    </div>
  );
}

function toolHint(tool: ToolMode): string {
  switch (tool) {
    case 'state':
      return 'State tool · click pane to add a state';
    case 'transition':
      return 'Transition tool · drag from a node handle to another node';
    case 'delete':
      return 'Delete tool · click any state or edge to remove it';
    default:
      return 'Select tool · drag nodes · right-click for options · drag handles to connect';
  }
}

interface ToolPaletteProps {
  tool: ToolMode;
  onChange: (tool: ToolMode) => void;
}

function ToolPalette({ tool, onChange }: ToolPaletteProps) {
  const tools: { id: ToolMode; label: string; icon: React.ReactNode }[] = [
    { id: 'select', label: 'Select', icon: <MousePointer2 size={16} /> },
    { id: 'state', label: 'State', icon: <Circle size={16} /> },
    { id: 'transition', label: 'Transition', icon: <ArrowRight size={16} /> },
    { id: 'delete', label: 'Delete', icon: <Trash2 size={16} /> },
  ];

  return (
    <div className="absolute top-6 left-6 z-10 bg-surface-container-low/90 backdrop-blur-md p-1.5 rounded-lg flex flex-col gap-1 shadow-lg border border-outline-variant">
      {tools.map((t) => {
        const active = tool === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            title={t.label}
            className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${
              active
                ? 'bg-secondary text-background'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            {t.icon}
          </button>
        );
      })}
    </div>
  );
}

export function Canvas(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
