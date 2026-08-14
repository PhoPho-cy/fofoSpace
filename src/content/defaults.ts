import { PROFILE, MY_PROJECTS, TECH_THOUGHTS } from './data';
import { ACTS } from './acts';
import type { SiteContent } from './types';

/** 默认内容：来自 src/data.ts（与代码保持一致的唯一默认源） */
export const DEFAULT_CONTENT: SiteContent = {
  profile: PROFILE,
  projects: MY_PROJECTS,
  thoughts: TECH_THOUGHTS,
  actCopy: ACTS.map((a) => ({ id: a.id, chapter: a.chapter, title: a.title, sub: a.sub })),
  stage: {
    modelUrl: '',
    note: '放入 GLTF/GLB 模型地址后，3D 舞台会自动加载该模型（替换占位场景）。',
  },
  ui: {
    brand: '浮光 · FOFO',
    hint: '滚轮 / 触控驱动探索',
  },
};