import { useEffect, useRef } from 'react';
import { useMotionValueEvent, type MotionValue } from 'motion/react';
import { COLORS, ENERGY_PATH, TRACK_WIDTH, clamp, pointAt } from '../config';
import { usePrefersReducedMotion } from '../hooks';

interface EnergyLineProps {
  /** 0..1：能量线点亮进度（MotionValue，避免每帧重渲染） */
  lit: MotionValue<number>;
}

const EMBER_COUNT = 34;
const SPARK_COUNT = 4;

/**
 * 贯穿四幕的粉白色发光能量线。
 * - 主线 / 外光晕：stroke-dash 随 lit 点亮
 * - 微粒：沿线分布的萤火，随点亮顺序呼吸
 * - 流光：沿路径流动的亮点，只出现在已点亮段
 * 所有更新走 rAF 直接写 SVG 属性，保持 60fps。
 */
export default function EnergyLine({ lit }: EnergyLineProps) {
  const reduced = usePrefersReducedMotion();
  const litRef = useRef(0);
  const mainRef = useRef<SVGPolylineElement | null>(null);
  const glowRef = useRef<SVGPolylineElement | null>(null);
  const emberRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const sparkRefs = useRef<(SVGCircleElement | null)[]>([]);

  useMotionValueEvent(lit, 'change', (v) => {
    litRef.current = clamp(v, 0, 1);
  });

  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      // 页面隐藏（切后台）时跳过所有写入，只保留计时器，节省电量
      if (document.hidden) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const l = litRef.current;
      const main = mainRef.current;
      const glow = glowRef.current;

      if (main) main.setAttribute('stroke-dashoffset', String(1 - l));
      if (glow) glow.setAttribute('stroke-dashoffset', String(1 - l + 0.018));

      emberRefs.current.forEach((el, i) => {
        if (!el) return;
        const frac = i / (EMBER_COUNT - 1);
        const on = l >= frac;
        const breathe = 0.35 + 0.55 * ((Math.sin(now / 260 + i * 1.71) + 1) / 2);
        el.setAttribute('opacity', String(on ? (reduced ? 0.5 : breathe) : 0));
      });

      if (!reduced) {
        sparkRefs.current.forEach((el, i) => {
          if (!el) return;
          const frac = ((now / 1000) * 0.16 + i * 0.24) % 1;
          if (frac <= l + 0.03) {
            const pt = pointAt(ENERGY_PATH, frac);
            el.setAttribute('cx', String(pt.x));
            el.setAttribute('cy', String(pt.y));
            el.setAttribute('opacity', '1');
          } else {
            el.setAttribute('opacity', '0');
          }
        });
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const pts = ENERGY_PATH.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 h-full"
      style={{ width: `${TRACK_WIDTH}vw` }}
      viewBox={`0 0 ${TRACK_WIDTH} 100`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="energy-main-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.ice} stopOpacity="0.55" />
          <stop offset="45%" stopColor={COLORS.ice} />
          <stop offset="55%" stopColor={COLORS.petal} />
          <stop offset="100%" stopColor={COLORS.petalSoft} stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* 外光晕 */}
      <polyline
        ref={glowRef}
        points={pts}
        fill="none"
        stroke={COLORS.petal}
        strokeOpacity="0.16"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
      />
      {/* 主线 */}
      <polyline
        ref={mainRef}
        points={pts}
        fill="none"
        stroke="url(#energy-main-grad)"
        strokeWidth="0.62"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
      />

      {/* 沿线萤火 */}
      {Array.from({ length: EMBER_COUNT }).map((_, i) => {
        const f = i / (EMBER_COUNT - 1);
        const pt = pointAt(ENERGY_PATH, f);
        return (
          <ellipse
            key={i}
            ref={(el) => {
              emberRefs.current[i] = el;
            }}
            cx={pt.x}
            cy={pt.y}
            rx={0.62}
            ry={0.36}
            fill={i % 3 === 0 ? COLORS.petal : COLORS.ice}
            opacity="0"
          />
        );
      })}

      {/* 起点微光（始终可见） */}
      <circle
        cx={ENERGY_PATH[0].x}
        cy={ENERGY_PATH[0].y}
        r={0.9}
        fill={COLORS.petal}
        className="animate-pulse-glow"
      />
      <circle
        cx={ENERGY_PATH[0].x}
        cy={ENERGY_PATH[0].y}
        r={2.2}
        fill={COLORS.petal}
        opacity="0.15"
        className="animate-pulse-glow"
      />

      {/* 流动流光 */}
      {!reduced &&
        Array.from({ length: SPARK_COUNT }).map((_, i) => (
          <circle
            key={`spark-${i}`}
            ref={(el) => {
              sparkRefs.current[i] = el;
            }}
            r={0.55}
            fill={COLORS.petal}
            opacity="0"
          />
        ))}
    </svg>
  );
}


