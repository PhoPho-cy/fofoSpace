import { ACTS, type ActId } from '../config';

interface ActRailProps {
  activeAct: ActId;
  onJump: (act: ActId) => void;
}

/**
 * 侧边章节轨：四枚符文节点，点击跳转对应幕。
 * 替代传统顶部导航栏，符合“无顶部导航”的视觉规范。
 */
export default function ActRail({ activeAct, onJump }: ActRailProps) {
  return (
    <nav
      aria-label="章节导航"
      className="absolute right-[2.4vw] top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-7 lg:flex"
    >
      {ACTS.map((act) => {
        const active = act.id === activeAct;
        return (
          <button
            key={act.id}
            type="button"
            onClick={() => onJump(act.id)}
            aria-current={active ? 'true' : undefined}
            aria-label={`${act.chapter} ${act.title}`}
            className="group relative flex items-center gap-3"
          >
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.3em] transition-all duration-500 ${
                active ? 'text-petal' : 'text-ice/0 opacity-0 group-hover:text-ice/60 group-hover:opacity-100'
              }`}
              style={active ? { textShadow: '0 0 12px rgba(238,220,231,0.6)' } : undefined}
            >
              {act.title}
            </span>
            <span
              className={`block rotate-45 transition-all duration-500 ${
                active
                  ? 'h-2.5 w-2.5 bg-petal shadow-[0_0_14px_rgba(238,220,231,0.9)]'
                  : 'h-1.5 w-1.5 bg-ice/40 group-hover:bg-ice/80 group-hover:shadow-[0_0_10px_rgba(169,214,229,0.7)]'
              }`}
            />
            <span className="absolute -right-5 hidden font-mono text-[8px] text-ice/40 group-hover:block">
              {act.numeral}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
