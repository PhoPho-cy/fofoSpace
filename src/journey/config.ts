// ============================================================
// 浮光 · FOFO 空间 —— 旅程配置
// 一切几何 / 节奏 / 视觉常量集中于此，便于统一调整。
// 世界坐标单位：横轴为 vw、纵轴为 vh（1 单位 = 1vw / 1vh）。
// ============================================================

import type { ActId } from '../shared/types';
import { ACTS, actMeta, type ActMeta } from '../content/acts';
export { ACTS, actMeta };
export type { ActMeta };
export type { ActId } from '../shared/types';

export const ACT_IDS = ACTS.map((a) => a.id) as ActId[];

// ---- 轨道 / 相机 ----
export const TRACK_ACTS = 4;
export const TRACK_WIDTH = TRACK_ACTS * 100; // vw，轨道总宽 400vw
export const CAMERA_RANGE = TRACK_WIDTH - 100; // vw，相机可平移 300vw

// 角色：世界坐标起点与行程（vw）
export const CHAR_SPAWN = 12;
export const CHAR_TRAVEL = 372;
// 角色相对视口左侧的稳定位置（vw，位于右侧约 65% 区域）
export const CHAR_LEAD = 66;
// 地面线 / 角色脚底基准（vh）
export const GROUND_Y = 78;

export const NODE_X: Record<ActId, number> = {
  cover: 36,
  about: 130,
  work: 205,
  docs: 308,
};

export const NODE_Y: Record<ActId, number> = {
  cover: 68,
  about: 56,
  work: 62,
  docs: 56,
};

// 每幕文字安全区激活的进度区间（0..1）
export const ACT_RANGES: Record<ActId, [number, number]> = {
  cover: [0.0, 0.2],
  about: [0.22, 0.46],
  work: [0.48, 0.74],
  docs: [0.76, 1.0],
};

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** 角色世界 x（vw） */
export function charWorld(p: number): number {
  return CHAR_SPAWN + clamp(p, 0, 1) * CHAR_TRAVEL;
}

/** 相机 x（vw）：跟随角色，保持角色在 CHAR_LEAD 处 */
export function cameraX(p: number): number {
  return clamp(charWorld(p) - CHAR_LEAD, 0, CAMERA_RANGE);
}

/** 当前激活幕 */
export function actForProgress(p: number): ActId {
  const v = clamp(p, 0, 1);
  for (const act of ACTS) {
    const [s, e] = ACT_RANGES[act.id];
    if (v >= s && v < e) return act.id;
  }
  return 'docs';
}

/** 某一幕内部进度（用于文字淡入淡出） */
export function actProgress(p: number, act: ActId): number {
  const [s, e] = ACT_RANGES[act];
  const v = clamp((clamp(p, 0, 1) - s) / (e - s), 0, 1);
  return v;
}

// ---- 能量线路径 ----
export interface Pt { x: number; y: number; }

/** 能量线途经的关键点（世界坐标 vw/vh） */
export const PATH_WAYPOINTS: Pt[] = [
  { x: 5, y: 80 },
  { x: 36, y: 70 },
  { x: 130, y: 58 },
  { x: 205, y: 62 },
  { x: 308, y: 56 },
  { x: 396, y: 82 },
];

/** Catmull-Rom 平滑采样，生成能量线折线点 */
export function buildPath(points: Pt[], samples = 320): Pt[] {
  const out: Pt[] = [];
  const n = points.length;
  const seg = Math.max(1, Math.floor(samples / (n - 1)));
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];
    for (let s = 0; s < seg; s++) {
      const t = s / seg;
      const t2 = t * t;
      const t3 = t2 * t;
      const x =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const y =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      out.push({ x, y });
    }
  }
  out.push({ x: points[n - 1].x, y: points[n - 1].y });
  return out;
}

export const ENERGY_PATH = buildPath(PATH_WAYPOINTS, 320);

export function pointAt(points: Pt[], f: number): Pt {
  const i = clamp(Math.floor(f * (points.length - 1)), 0, points.length - 1);
  return points[i];
}

// ---- 调色板 ----
export const COLORS = {
  abyss: '#05070d',
  cyanDeep: '#081821',
  cyan: '#0d2029',
  cyanSoft: '#1d3a47',
  mist: '#5d7480',
  ice: '#a9d6e5',
  iceSoft: '#d3e9f1',
  petal: '#eedce7',
  petalSoft: '#e0c4d4',
  petalDim: 'rgba(238, 220, 231, 0.35)',
  glowPetal: 'rgba(238, 220, 231, 0.5)',
  glowIce: 'rgba(169, 214, 229, 0.5)',
};

/** 滚动进度 → 页面滚动位置（用于跳跃导航） */
export function scrollTopForProgress(p: number): number {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  return clamp(p, 0, 1) * max;
}
