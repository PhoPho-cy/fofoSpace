import { useMemo } from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { COLORS, GROUND_Y } from '../config';

/**
 * 视差层：远景山影 / 中景遗迹 / 近景草石。
 * 各层以不同速度随相机平移（背景慢、前景快），营造纵深探索感。
 * 内容绘制范围覆盖 0..520vw，避免平移后露出空白。
 */
export default function ParallaxLayers({ cameraX }: { cameraX: MotionValue<number> }) {
  const bgX = useTransform(cameraX, (v) => `${-v * 0.12}vw`);
  const midX = useTransform(cameraX, (v) => `${-v * 0.55}vw`);
  const fgX = useTransform(cameraX, (v) => `${-v * 1.3}vw`);

  const silhouettes = useMemo(
    () => [
      { x: 40, w: 70, h: 26 },
      { x: 130, w: 84, h: 32 },
      { x: 230, w: 66, h: 22 },
      { x: 330, w: 96, h: 30 },
      { x: 420, w: 76, h: 24 },
    ],
    [],
  );

  const columns = useMemo(
    () => [
      { x: 78, h: 26 },
      { x: 108, h: 18 },
      { x: 176, h: 22 },
      { x: 250, h: 16 },
      { x: 288, h: 24 },
      { x: 376, h: 20 },
      { x: 404, h: 27 },
      { x: 470, h: 18 },
    ],
    [],
  );

  const tufts = useMemo(() => {
    const arr: { x: number; y: number; s: number; o: number }[] = [];
    for (let x = 2; x < 520; x += 13) {
      arr.push({ x: x + (Math.random() - 0.5) * 6, y: 86 + Math.random() * 8, s: 0.6 + Math.random() * 0.9, o: 0.25 + Math.random() * 0.4 });
    }
    return arr;
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* 远景 */}
      <motion.svg
        style={{ x: bgX }}
        className="absolute left-0 top-0 h-full"
        width="520vw"
        viewBox="0 0 520 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="bg-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.cyanDeep} stopOpacity="0.9" />
            <stop offset="70%" stopColor={COLORS.cyan} stopOpacity="0.55" />
            <stop offset="100%" stopColor={COLORS.abyss} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="520" height="100" fill="url(#bg-sky)" />
        {silhouettes.map((s, i) => (
          <path
            key={i}
            d={`M${s.x - s.w / 2} 78 L${s.x - s.w / 4} ${78 - s.h * 0.55} L${s.x} ${78 - s.h} L${s.x + s.w / 4} ${78 - s.h * 0.55} L${s.x + s.w / 2} 78 Z`}
            fill={COLORS.cyanDeep}
            opacity="0.85"
          />
        ))}
        {/* 星尘 */}
        {Array.from({ length: 40 }).map((_, i) => (
          <circle
            key={`star-${i}`}
            cx={(i * 37.7) % 520}
            cy={8 + ((i * 13.3) % 40)}
            r={0.35 + ((i * 7) % 3) * 0.18}
            fill={COLORS.ice}
            opacity={0.14 + ((i * 11) % 5) * 0.05}
          />
        ))}
      </motion.svg>

      {/* 中景：遗迹柱影 */}
      <motion.svg
        style={{ x: midX }}
        className="absolute left-0 top-0 h-full"
        width="520vw"
        viewBox="0 0 520 100"
        preserveAspectRatio="none"
      >
        {columns.map((c, i) => (
          <g key={i} opacity="0.55">
            <rect x={c.x - 2.4} y={78 - c.h} width="4.8" height={c.h} fill={COLORS.cyanDeep} />
            <rect x={c.x - 3.6} y={78 - c.h - 2.2} width="7.2" height="2.2" fill={COLORS.cyan} />
            <rect x={c.x - 3.6} y={77.6} width="7.2" height="1.6" fill={COLORS.cyan} />
            <rect x={c.x - 0.7} y={78 - c.h + 4} width="1.4" height={c.h - 8} fill={COLORS.ice} opacity="0.08" />
          </g>
        ))}
        {/* 远处光点 */}
        {columns.map((c, i) => (
          <circle key={`glow-${i}`} cx={c.x} cy={78 - c.h - 4} r="0.8" fill={COLORS.petal} opacity="0.2" />
        ))}
      </motion.svg>

      {/* 近景：草石 */}
      <motion.svg
        style={{ x: fgX }}
        className="absolute left-0 top-0 h-full"
        width="520vw"
        viewBox="0 0 520 100"
        preserveAspectRatio="none"
      >
        {tufts.map((t, i) => (
          <g key={i} opacity={t.o}>
            <line x1={t.x} y1={t.y} x2={t.x - 1.4} y2={t.y - 5 * t.s} stroke={COLORS.cyanSoft} strokeWidth="0.7" />
            <line x1={t.x} y1={t.y} x2={t.x} y2={t.y - 6.4 * t.s} stroke={COLORS.cyanSoft} strokeWidth="0.7" />
            <line x1={t.x} y1={t.y} x2={t.x + 1.4} y2={t.y - 5 * t.s} stroke={COLORS.cyanSoft} strokeWidth="0.7" />
            {i % 5 === 0 && <circle cx={t.x + 2.4} cy={t.y + 1.4} r="0.9" fill={COLORS.cyanSoft} />}
          </g>
        ))}
        {/* 近处飘浮花瓣 */}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={`petal-${i}`}
            cx={(i * 47.3) % 520}
            cy={20 + ((i * 29.7) % 55)}
            r={0.55 + (i % 3) * 0.3}
            fill={i % 2 ? COLORS.petal : COLORS.ice}
            opacity={0.12 + (i % 4) * 0.05}
          />
        ))}
      </motion.svg>
    </div>
  );
}

/** 连续地面：四幕共用同一地面高度与质感 */
export function Ground() {
  return (
    <svg
      className="pointer-events-none absolute left-0"
      style={{ top: `${GROUND_Y}vh`, height: `${100 - GROUND_Y}vh`, width: '400vw' }}
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ground-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1a23" />
          <stop offset="55%" stopColor="#07131b" />
          <stop offset="100%" stopColor="#040a10" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="24" fill="url(#ground-fill)" />
      <line x1="0" y1="0.6" x2="400" y2="0.6" stroke={COLORS.cyanSoft} strokeWidth="0.5" opacity="0.55" />
      {/* 地面微光（能量线落点） */}
      {[36, 130, 205, 308].map((x, i) => (
        <ellipse key={i} cx={x} cy="1.2" rx="9" ry="2.4" fill={COLORS.petal} opacity="0.1" className="animate-pulse-glow" />
      ))}
      {/* 地面纹理 */}
      {Array.from({ length: 60 }).map((_, i) => (
        <ellipse key={i} cx={(i * 13.7) % 400} cy={4 + ((i * 17.3) % 12)} rx={1.1 + (i % 4) * 0.5} ry={0.5 + (i % 3) * 0.3} fill={COLORS.cyan} opacity="0.6" />
      ))}
    </svg>
  );
}

