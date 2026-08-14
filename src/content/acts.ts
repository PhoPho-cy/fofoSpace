import type { ActId } from '../shared/types';

/** 四幕元信息（可被编辑器「章节文字」覆盖） */
export interface ActMeta {
  id: ActId;
  chapter: string; // 第一章
  numeral: string; // 壹
  title: string;   // 归墟
  sub: string;     // 封面 · 进入记忆
}

export const ACTS: ActMeta[] = [
  { id: 'cover', chapter: '第一章', numeral: '壹', title: '归墟',   sub: '封面 · 进入记忆' },
  { id: 'about', chapter: '第二章', numeral: '贰', title: '水镜',   sub: '个人简介' },
  { id: 'work',  chapter: '第三章', numeral: '叁', title: '心核',   sub: '作品展示' },
  { id: 'docs',  chapter: '第四章', numeral: '肆', title: '脉髓',   sub: '技术文档' },
];

export function actMeta(id: ActId): ActMeta {
  return ACTS.find((a) => a.id === id)!;
}
