import { COLORS, GROUND_Y, NODE_X } from '../config';

/**
 * 沉睡的神兽 —— 第一幕焦点。
 * 暗青色的蜷曲躯体 + 沿脊背的粉白微光，配合呼吸动画。
 */
export function BeastArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 64" className={className} width="100%" height="100%" role="img" aria-label="沉睡的神兽">
      <defs>
        <linearGradient id="beast-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16323f" />
          <stop offset="100%" stopColor="#0a1b24" />
        </linearGradient>
        <radialGradient id="beast-mist" cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor={COLORS.petal} stopOpacity="0.12" />
          <stop offset="100%" stopColor={COLORS.petal} stopOpacity="0" />
        </radialGradient>
        <filter id="beast-glow-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* 雾气 */}
      <ellipse cx="66" cy="56" rx="62" ry="12" fill="url(#beast-mist)" className="animate-pulse-glow" />

      <g className="animate-breathe" style={{ transformOrigin: '66px 58px' }}>
        {/* 尾巴 */}
        <path
          d="M18 44 C8 42 4 34 8 26 C11 20 18 20 20 24"
          fill="none"
          stroke="#16323f"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="9" cy="25" r="2.2" fill={COLORS.petalDim} />

        {/* 身体 */}
        <ellipse cx="64" cy="44" rx="44" ry="17" fill="url(#beast-body)" stroke="#2c5566" strokeWidth="1.4" />
        {/* 前肢 */}
        <ellipse cx="92" cy="55" rx="12" ry="6" fill="#0d2330" />
        {/* 头部 */}
        <g>
          <circle cx="104" cy="46" r="12" fill="url(#beast-body)" stroke="#2c5566" strokeWidth="1.3" />
          {/* 角 */}
          <path d="M100 36 C98 30 100 26 104 23" fill="none" stroke={COLORS.ice} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          {/* 耳 */}
          <path d="M110 36 L115 30 L118 37 Z" fill="#16323f" stroke="#2c5566" strokeWidth="1" />
          {/* 闭眼 */}
          <path d="M100 47 C102 45.4 104 45.4 106 47" fill="none" stroke={COLORS.ice} strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
          {/* 鼻 */}
          <ellipse cx="112" cy="49" rx="1.8" ry="1.2" fill="#3c6b7d" />
        </g>

        {/* 脊背粉白光脉 */}
        <path
          d="M28 40 C48 30 76 28 98 36"
          fill="none"
          stroke={COLORS.petal}
          strokeWidth="2.6"
          strokeLinecap="round"
          opacity="0.85"
          filter="url(#beast-glow-blur)"
          className="animate-pulse-glow"
        />
        <path
          d="M30 41 C50 31 76 29 97 36"
          fill="none"
          stroke={COLORS.petalSoft}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* 飘起的记忆之息 */}
        <circle cx="86" cy="26" r="1.2" fill={COLORS.petal} opacity="0.5" className="animate-float" />
        <circle cx="120" cy="32" r="1" fill={COLORS.ice} opacity="0.4" className="animate-float" style={{ animationDelay: '1.2s' }} />
        <circle cx="64" cy="22" r="1.1" fill={COLORS.petal} opacity="0.35" className="animate-float" style={{ animationDelay: '2.1s' }} />
      </g>
    </svg>
  );
}

/** 世界坐标中的神兽（放置于封面焦点） */
export default function Beast() {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${NODE_X.cover}vw`,
        top: `${GROUND_Y}vh`,
        width: '46vw',
        transform: 'translate(-50%, -100%)',
      }}
      aria-hidden="true"
    >
      <BeastArt className="block w-full" />
    </div>
  );
}

