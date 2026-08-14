import { COLORS } from '../config';

/**
 * 探索者角色（纯 SVG）。
 * 尺寸固定、脚底贴地，供旅程在固定地面高度复用。
 * 呼吸 / 微光由 CSS 动画驱动，符合「同一角色尺寸与地面高度」的设定。
 */
export default function CharacterArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 84"
      className={className}
      width="100%"
      height="100%"
      role="img"
      aria-label="记忆之旅的探索者"
    >
      <defs>
        <radialGradient id="char-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.petal} stopOpacity="0.5" />
          <stop offset="100%" stopColor={COLORS.petal} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="char-cloak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#173441" />
          <stop offset="100%" stopColor="#0c1f29" />
        </linearGradient>
      </defs>

      {/* 脚下微光 */}
      <ellipse cx="30" cy="80" rx="20" ry="4" fill="url(#char-glow)" className="animate-pulse-glow" />

      {/* 杖 */}
      <g className="animate-float" style={{ transformOrigin: '34px 80px' }}>
        <line x1="42" y1="20" x2="40" y2="80" stroke="#274a58" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="43" cy="17" r="3" fill={COLORS.ice} opacity="0.9" />
        <circle cx="43" cy="17" r="6" fill={COLORS.ice} opacity="0.18" className="animate-pulse-glow" />
      </g>

      <g className="animate-breathe" style={{ transformOrigin: '30px 80px' }}>
        {/* 腿 */}
        <rect x="21" y="64" width="7" height="16" rx="3.5" fill="#0a1a23" />
        <rect x="32" y="64" width="7" height="16" rx="3.5" fill="#0a1a23" />
        {/* 袍身 */}
        <path
          d="M14 62 C14 40 18 30 30 28 C42 30 46 40 46 62 L45 66 L15 66 Z"
          fill="url(#char-cloak)"
          stroke="#2c5566"
          strokeWidth="1.4"
        />
        {/* 袍边 */}
        <path d="M16 56 C20 60 24 62 30 62 C36 62 40 60 44 56" fill="none" stroke={COLORS.petalDim} strokeWidth="1" />
        {/* 兜帽 */}
        <path d="M18 38 C18 22 24 14 30 14 C36 14 42 22 42 38 C36 32 24 32 18 38 Z" fill="#163542" stroke="#2c5566" strokeWidth="1.3" />
        {/* 脸 */}
        <ellipse cx="30" cy="30" rx="6.4" ry="7.6" fill="#e9d9d3" />
        {/* 眼 */}
        <circle cx="27.4" cy="29.5" r="1.1" fill={COLORS.cyanDeep} />
        <circle cx="32.6" cy="29.5" r="1.1" fill={COLORS.cyanDeep} />
        {/* 光坠 */}
        <g className="animate-pulse-glow" style={{ transformOrigin: '30px 52px' }}>
          <line x1="30" y1="40" x2="30" y2="50" stroke={COLORS.petalSoft} strokeWidth="0.8" />
          <path d="M30 50 L33 55 L30 60 L27 55 Z" fill={COLORS.petal} />
          <circle cx="30" cy="55" r="5" fill={COLORS.petal} opacity="0.15" />
        </g>
      </g>
    </svg>
  );
}
