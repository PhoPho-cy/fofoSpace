import { COLORS, GROUND_Y, NODE_X } from '../config';

/**
 * 记忆水镜 —— 第二幕焦点。
 * 竖立的水之镜：冰蓝到深青的水面、扩散的涟漪与倒映其中的小小身影。
 */
export function MirrorArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" className={className} width="100%" height="100%" role="img" aria-label="记忆水镜">
      <defs>
        <linearGradient id="mirror-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.ice} stopOpacity="0.16" />
          <stop offset="45%" stopColor={COLORS.cyanSoft} stopOpacity="0.3" />
          <stop offset="100%" stopColor={COLORS.cyanDeep} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="mirror-frame" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.cyanSoft} stopOpacity="0.2" />
          <stop offset="50%" stopColor={COLORS.ice} stopOpacity="0.7" />
          <stop offset="100%" stopColor={COLORS.cyanSoft} stopOpacity="0.2" />
        </linearGradient>
        <filter id="mirror-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* 辉光 */}
      <ellipse cx="60" cy="72" rx="52" ry="66" fill={COLORS.petal} opacity="0.05" filter="url(#mirror-glow)" className="animate-pulse-glow" />

      {/* 底座 */}
      <ellipse cx="60" cy="134" rx="40" ry="7" fill="#0c2029" stroke="#2c5566" strokeWidth="1" />
      <ellipse cx="60" cy="134" rx="24" ry="4" fill={COLORS.ice} opacity="0.12" />

      {/* 水镜主体 */}
      <ellipse cx="60" cy="72" rx="34" ry="58" fill="url(#mirror-water)" stroke="url(#mirror-frame)" strokeWidth="2" />

      {/* 涟漪 */}
      <g>
        <ellipse cx="60" cy="96" rx="10" ry="4" fill="none" stroke={COLORS.ice} strokeWidth="0.8" opacity="0" className="animate-ripple" />
        <ellipse cx="60" cy="96" rx="10" ry="4" fill="none" stroke={COLORS.ice} strokeWidth="0.8" opacity="0" className="animate-ripple" style={{ animationDelay: '1.2s' }} />
        <ellipse cx="60" cy="96" rx="10" ry="4" fill="none" stroke={COLORS.petal} strokeWidth="0.8" opacity="0" className="animate-ripple" style={{ animationDelay: '2.4s' }} />
      </g>

      {/* 倒影（模糊的小小身影） */}
      <g opacity="0.4" transform="translate(60 118) scale(1 -0.55)">
        <circle cx="0" cy="-8" r="5" fill={COLORS.ice} opacity="0.5" />
        <path d="M-8 0 C-8 -12 -4 -16 0 -16 C4 -16 8 -12 8 0 Z" fill={COLORS.ice} opacity="0.5" />
      </g>

      {/* 水面闪光 */}
      <line x1="34" y1="64" x2="86" y2="64" stroke={COLORS.iceSoft} strokeWidth="0.7" opacity="0.35" />
      <line x1="40" y1="84" x2="80" y2="84" stroke={COLORS.ice} strokeWidth="0.5" opacity="0.22" />
    </svg>
  );
}

/** 世界坐标中的水镜（放置于简介焦点） */
export default function Mirror() {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${NODE_X.about}vw`,
        top: `${GROUND_Y}vh`,
        width: '34vw',
        transform: 'translate(-50%, -100%)',
      }}
      aria-hidden="true"
    >
      <MirrorArt className="block w-full" />
    </div>
  );
}
