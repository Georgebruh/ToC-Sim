import { useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import { EPSILON } from '../../lib/automaton';

export interface TransitionEdgeData {
  symbol: string;
  [key: string]: unknown;
}

export function TransitionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);

  const symbol = (data as TransitionEdgeData | undefined)?.symbol ?? '';

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const updateSymbol = (next: string) => {
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? { ...edge, data: { ...(edge.data ?? {}), symbol: next }, label: next || EPSILON }
          : edge,
      ),
    );
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ stroke: '#48474b', strokeWidth: 2 }} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {isEditing ? (
            <input
              autoFocus
              defaultValue={symbol === EPSILON ? '' : symbol}
              onBlur={(e) => {
                updateSymbol(e.target.value || EPSILON);
                setIsEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateSymbol((e.target as HTMLInputElement).value || EPSILON);
                  setIsEditing(false);
                } else if (e.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
              className="w-16 px-2 py-0.5 text-xs font-mono bg-surface-container-high text-on-surface rounded border border-secondary outline-none text-center"
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-2 py-0.5 text-xs font-mono bg-surface-container-low text-on-surface rounded shadow border border-outline-variant hover:border-secondary transition-colors"
              title="Click to edit symbol"
            >
              {symbol || EPSILON}
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
