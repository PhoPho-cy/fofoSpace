import type { Profile, Project, TechThought } from '../data';
import type { ActId } from '../journey/config';

/** 每幕可编辑的文字 */
export interface ActCopy {
  id: ActId;
  chapter: string;
  title: string;
  sub: string;
}

/** 3D 舞台可配置项 */
export interface StageContent {
  /** GLTF/GLB 模型 URL（留空则不加载模型） */
  modelUrl: string;
  note: string;
}

/** 全局 UI 文案 */
export interface UiContent {
  brand: string;
  hint: string;
}

/** 站点全部可配置内容（编辑器读写的数据结构） */
export interface SiteContent {
  profile: Profile;
  projects: Project[];
  thoughts: TechThought[];
  actCopy: ActCopy[];
  stage: StageContent;
  ui: UiContent;
}