import { COLORS, GROUND_Y } from '../config';
import type { TechThought } from '../../data';

/** 单个知识节点（可独立用于移动端） */
export function DocNodeArt({
  className = '',
  lit = false,
  label,
}: {
  className?: string;
  lit?: boolean;
  label?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className ?? ''}`}>
      <span
        className="block rounded-full transition-all duration-500"
        style={{
          width: lit ? 26 : 16,
          height: lit ? 26 : 16,
          background: lit ? COLORS.petal : COLORS.cyanSoft,
          boxShadow: lit
            ? `0 0 22px ${COLORS.glowPetal}, 0 0 46px ${COLORS.glowPetal}`
            : `0 0 10px ${COLORS.glowIce}`,
        }}
      />
      {label && (
        <span
          className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 ${
            lit ? 'text-petal' : 'text-ice/55'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export interface DocNodeDef {
  id: string;
  x: number;
  y: number;
  label: string;
  thoughtId?: string;
}

export const DOC_NODES: DocNodeDef[] = [
  { id: 'shader', x: 306, y: 50, label: '着色器 · Shader', thoughtId: 'shader-tradeoffs' },
  { id: 'procedural', x: 330, y: 40, label: '程序化 · Niagara', thoughtId: 'procedural-pipelines' },
  { id: 'realtime', x: 354, y: 50, label: '实时渲染', thoughtId: 'ray-marching-notes' },
  { id: 'articles', x: 318, y: 66, label: '技术文章', thoughtId: undefined },
];

export interface DocNodesProps {
  thoughts: TechThought[];
  hoveredId: string | null;
  /** 是否处于文档幕（控制键盘可访问性） */
  active: boolean;
  onHover: (id: string | null) => void;
  onOpen: (thoughtId: string | undefined) => void;
}

/** 文档区 —— 神经主干 + 知识节点 */
export default function DocNodes({ thoughts, hoveredId, active, onHover, onOpen }: DocNodesProps) {
  return (
    <div className="pointer-events-none absolute left-0 top-0 h-full" style={{ width: '90vw', left: '296vw' }} aria-hidden="true">
      {/* 神经主干 */}
      <svg
        viewBox="0 0 90 100"
        preserveAspectRatio="none"
        className="absolute left-0 top-0 h-full w-full"
      >
        <g fill="none" stroke={COLORS.cyanSoft} strokeWidth="0.7" opacity="0.8">
          <path d="M10 100 C10 80 14 72 18 62 C22 52 26 46 30 40" />
          <path d="M10 100 C10 82 14 74 18 66 C22 58 28 54 36 50" />
          <path d="M10 100 C10 84 14 78 20 72 C26 66 34 62 44 60" />
          <path d="M18 62 C24 58 28 56 30 40" />
          <path d="M18 66 C24 62 30 58 36 50" />
          <path d="M20 72 C26 68 32 66 40 64" />
          {/* 细分支 */}
          <path d="M24 62 C26 58 28 52 28 48" strokeOpacity="0.5" />
          <path d="M28 56 C32 52 34 48 36 44" strokeOpacity="0.5" />
          <path d="M26 66 C30 62 34 58 40 54" strokeOpacity="0.5" />
          <path d="M32 62 C36 60 40 58 46 56" strokeOpacity="0.5" />
        </g>
      </svg>

      {/* 知识节点 */}
      <div className="pointer-events-auto">
        {DOC_NODES.map((n) => {
          const lit = hoveredId === n.id;
          const thought = thoughts.find((t) => t.id === n.thoughtId);
          return (
            <button
              key={n.id}
              type="button"
              className="group absolute flex cursor-pointer flex-col items-center gap-1"
              tabIndex={active ? 0 : -1}
              aria-hidden={!active}
              style={{
                left: `${n.x - 296}vw`,
                top: `${GROUND_Y - n.y}vh`,
                transform: 'translate(-50%, 0)',
              }}
              aria-label={thought ? `${n.label}：${thought.title}` : `${n.label}：全部技术文章`}
              aria-pressed={lit}
              onMouseEnter={() => onHover(n.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(n.id)}
              onBlur={() => onHover(null)}
              onClick={() => onOpen(n.thoughtId)}
            >
              <DocNodeArt lit={lit} />
              <span className={`font-mono text-[10px] uppercase tracking-[0.22em] ${lit ? 'text-petal' : 'text-ice/55'}`}>
                {n.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
