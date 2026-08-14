// ============================================================
// Three.js 舞台配置：质量分级 / 性能预算
// 所有与画质相关的开关集中于此，方便按设备调优。
// ============================================================

export type Quality = 'low' | 'medium' | 'high';

export interface QualitySettings {
  /** 像素比范围 [min, max]，Clamp 防止 4K 屏被拉爆 */
  dpr: [number, number];
  antialias: boolean;
  shadows: boolean;
  /** 星空实例数量（instancedMesh，一次 draw call） */
  starCount: number;
  /** 环绕光点数量 */
  moteCount: number;
}

export const QUALITY: Record<Quality, QualitySettings> = {
  low: {
    dpr: [1, 1],
    antialias: false,
    shadows: false,
    starCount: 900,
    moteCount: 12,
  },
  medium: {
    dpr: [1, 1.5],
    antialias: true,
    shadows: false,
    starCount: 1800,
    moteCount: 24,
  },
  high: {
    dpr: [1, 2],
    antialias: true,
    shadows: true,
    starCount: 3200,
    moteCount: 40,
  },
};

export const QUALITY_ORDER: Quality[] = ['low', 'medium', 'high'];

export function degradeQuality(q: Quality): Quality {
  const i = QUALITY_ORDER.indexOf(q);
  return QUALITY_ORDER[Math.max(0, i - 1)];
}

export function upgradeQuality(q: Quality): Quality {
  const i = QUALITY_ORDER.indexOf(q);
  return QUALITY_ORDER[Math.min(QUALITY_ORDER.length - 1, i + 1)];
}