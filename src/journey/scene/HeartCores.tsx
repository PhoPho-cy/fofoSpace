import { COLORS, GROUND_Y } from '../config';
import type { Project } from '../../data';

/** 单颗心核（可独立用于移动端） */
export function HeartCoreArt({
  className = '',
  lit = false,
}: {
  className?: string;
  lit?: boolean;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} width="100%" height="100%" aria-hidden="true">
      <defs>
        <filter id="heart-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>
      </defs>
      <g style={{ transition: 'transform 0.5s ease, opacity 0.5s ease' }} transform={lit ? 'translate(0 -2)' : undefined} opacity={lit ? 1 : 0.62}>
        <path
          d="M32 54 C 14 42 5 30 9.5 19 C 13.5 8.5 28 10 32 21 C 36 10 50.5 8.5 54.5 19 C 59 30 50 42 32 54 Z"
          fill={lit ? COLORS.petal : COLORS.cyanSoft}
          stroke={lit ? COLORS.petalSoft : COLORS.ice}
          strokeOpacity={lit ? 0.95 : 0.5}
          strokeWidth="1.6"
        />
        <path
          d="M32 54 C 14 42 5 30 9.5 19 C 13.5 8.5 28 10 32 21 C 36 10 50.5 8.5 54.5 19 C 59 30 50 42 32 54 Z"
          fill={COLORS.petal}
          opacity={lit ? 0.32 : 0}
          filter="url(#heart-glow)"
          style={{ transition: 'opacity 0.5s ease' }}
        />
        {/* 心核裂缝光 */}
        <path d="M32 21 C28 30 34 38 32 46" fill="none" stroke={COLORS.iceSoft} strokeWidth="1.1" opacity={lit ? 0.8 : 0.25} />
      </g>
    </svg>
  );
}

export interface HeartCoresProps {
  projects: Project[];
  hoveredId: string | null;
  /** 是否处于作品幕（控制键盘可访问性） */
  active: boolean;
  onHover: (id: string | null) => void;
  onOpen: (id: string) => void;
}

const CORE_POS: [number, number][] = [
  [186, 64],
  [222, 55],
  [258, 66],
];

/**
 * 作品区 —— 三颗可交互心核。
 * 悬停 / 聚焦点亮并同步摘要到左侧文字区；点击进入沉浸式详情。
 */
export default function HeartCores({ projects, hoveredId, active, onHover, onOpen }: HeartCoresProps) {
  return (
    <>
      {projects.map((p, i) => {
        const [x, y] = CORE_POS[i] ?? CORE_POS[0];
        const lit = hoveredId === p.id;
        return (
          <button
            key={p.id}
            type="button"
            className="group absolute cursor-pointer"
            tabIndex={active ? 0 : -1}
            aria-hidden={!active}
            style={{
              left: `${x}vw`,
              top: `${GROUND_Y - y}vh`,
              width: '13vw',
              transform: 'translate(-50%, 0)',
            }}
            aria-label={`查看作品：${p.title}`}
            aria-pressed={lit}
            onMouseEnter={() => onHover(p.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(p.id)}
            onBlur={() => onHover(null)}
            onClick={() => onOpen(p.id)}
          >
            {/* 聚焦光环 */}
            <span
              className="pointer-events-none absolute left-1/2 top-[38%] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-petal/40"
              style={{ opacity: lit ? 1 : 0, transition: 'opacity 0.4s ease', boxShadow: `0 0 26px ${COLORS.glowPetal}` }}
            />
            <HeartCoreArt lit={lit} className="block w-full drop-shadow-[0_0_14px_rgba(238,220,231,0.25)]" />
            <span
              className={`mt-2 block text-center font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 ${
                lit ? 'text-petal' : 'text-ice/50'
              }`}
            >
              {String(i + 1).padStart(2, '0')} · {p.title.split(':')[0]}
            </span>
          </button>
        );
      })}
    </>
  );
}
