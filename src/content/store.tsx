import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_CONTENT } from './defaults';
import type { SiteContent } from './types';

export type SaveResult =
  | { ok: true; mode: 'api'; message: string }
  | { ok: true; mode: 'download'; message: string }
  | { ok: false; mode: 'error'; message: string };

interface ContentContextValue {
  /** 当前生效内容（默认 + public/content.json 覆盖） */
  content: SiteContent;
  /** content.json 是否已加载完成 */
  loaded: boolean;
  /** 保存：优先写入 public/content.json（dev API），失败则下载 JSON 供手动放置 */
  saveContent: (next: SiteContent) => Promise<SaveResult>;
  /** 恢复默认并删除 content.json */
  resetContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);

  // 启动时读取 public/content.json（静态资源，dev / build 均可）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/content.json');
        if (res.ok) {
          const patch = (await res.json()) as Partial<SiteContent>;
          if (!cancelled) setContent((base) => mergeContent(base, patch));
        }
      } catch {
        // 文件不存在或网络异常时使用默认内容
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const saveContent = useCallback(async (next: SiteContent): Promise<SaveResult> => {
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      if (res.ok) {
        setContent(next);
        return { ok: true, mode: 'api', message: '已保存到 public/content.json，刷新全设备生效。' };
      }
      throw new Error(`HTTP ${res.status}`);
    } catch {
      // 无后端环境（如纯静态部署）：下载 JSON 供手动放入 public/
      downloadJson(next);
      return {
        ok: true,
        mode: 'download',
        message: '当前环境不支持写入文件，已下载 content.json，请放入 public/ 目录。',
      };
    }
  }, []);

  const resetContent = useCallback(async () => {
    // 恢复默认：写回默认内容（保持 content.json 常驻，避免 404 噪音）
    const next = structuredClone(DEFAULT_CONTENT);
    await saveContent(next);
  }, [saveContent]);

  const value = useMemo(
    () => ({ content, loaded, saveContent, resetContent }),
    [content, loaded, saveContent, resetContent],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent 必须在 <ContentProvider> 内使用');
  return ctx;
}

/** 浅合并：顶层对象逐键合并，数组整体替换 */
export function mergeContent(base: SiteContent, patch: Partial<SiteContent>): SiteContent {
  const out: SiteContent = { ...base };
  (Object.keys(patch) as (keyof SiteContent)[]).forEach((k) => {
    const pv = patch[k];
    if (pv == null) return;
    if (Array.isArray(pv) || typeof pv !== 'object') {
      out[k] = pv as never;
      return;
    }
    const baseVal = base[k];
    const prev = baseVal && typeof baseVal === 'object' && !Array.isArray(baseVal) ? baseVal : {};
    out[k] = { ...(prev as object), ...pv } as never;
  });
  return out;
}

export function downloadJson(data: SiteContent) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'content.json';
  a.click();
  URL.revokeObjectURL(url);
}