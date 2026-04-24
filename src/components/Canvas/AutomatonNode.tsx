import { Handle, Position, type NodeProps } from '@xyflow/react';

export interface AutomatonNodeData {
  label: string;
  isStart: boolean;
  isAccept: boolean;
  isActive: boolean;
  [key: string]: unknown;
}

export function AutomatonNode({ data }: NodeProps) {
  const { label, isStart, isAccept, isActive } = data as AutomatonNodeData;

  const ringClass = isActive
    ? 'ring-2 ring-secondary node-glow ring-offset-4 ring-offset-surface'
    : 'ring-1 ring-outline-variant';

  return (
    <div className="relative">
      {isStart && (
        <div className="absolute top-1/2 -translate-y-1/2 -left-10 flex items-center pointer-events-none">
          <div className="h-px w-8 bg-secondary"></div>
          <div
            className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-secondary"
            style={{ marginLeft: '-1px' }}
          />
        </div>
      )}

      <div
        className={`w-20 h-20 bg-surface-container shadow-md rounded-full flex items-center justify-center transition-shadow ${ringClass}`}
      >
        {isAccept ? (
          <div className="w-[88%] h-[88%] bg-surface-container-highest rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className={`font-bold ${isActive ? 'text-secondary' : 'text-on-surface'}`}>
              {label}
            </span>
            <span className="text-[9px] text-on-surface-variant uppercase tracking-widest">
              Accept
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span className={`font-bold ${isActive ? 'text-secondary' : 'text-on-surface'}`}>
              {label}
            </span>
            {isStart && (
              <span className="text-[9px] text-on-surface-variant uppercase tracking-widest">
                Start
              </span>
            )}
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-secondary !w-2 !h-2 !border-0 opacity-0 hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-secondary !w-2 !h-2 !border-0 opacity-0 hover:opacity-100"
      />
    </div>
  );
}
