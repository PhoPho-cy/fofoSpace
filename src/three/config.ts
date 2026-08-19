export type Quality = 'low' | 'medium' | 'high';

export interface QualitySettings {
  dpr: [number, number];
  antialias: boolean;
  shadows: boolean;
  shaderDetail: number;
  energySegments: number;
  grassCount: number;
}

export const QUALITY: Record<Quality, QualitySettings> = {
  low: {
    dpr: [1, 1],
    antialias: false,
    shadows: false,
    shaderDetail: 0,
    energySegments: 32,
    grassCount: 420,
  },
  medium: {
    dpr: [1, 1.5],
    antialias: true,
    shadows: false,
    shaderDetail: 0.55,
    energySegments: 64,
    grassCount: 850,
  },
  high: {
    dpr: [1, 2],
    antialias: true,
    shadows: true,
    shaderDetail: 1,
    energySegments: 96,
    grassCount: 1400,
  },
};

export const QUALITY_ORDER: Quality[] = ['low', 'medium', 'high'];

export function degradeQuality(quality: Quality): Quality {
  const index = QUALITY_ORDER.indexOf(quality);
  return QUALITY_ORDER[Math.max(0, index - 1)];
}
