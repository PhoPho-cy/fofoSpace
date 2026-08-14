import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import Experience from './Experience';
import { useMediaQuery, usePrefersReducedMotion } from '../journey/hooks';
import { QUALITY_ORDER, type Quality } from './config';

interface ThreeStageProps {
  onClose: () => void;
}

/**
 * 3D 舞台（懒加载入口）：
 * 全屏展示 Three.js 场景，顶部提供画质档位与关闭按钮。
 * 由 Home 通过 React.lazy 按需引入，three 不会进入首屏包。
 */
export default function ThreeStage({ onClose }: ThreeStageProps) {
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [quality, setQuality] = useState<Quality>(() => (isMobile ? 'medium' : 'high'));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      role="dialog"
      aria-modal="true"
      aria-label="3D 舞台预览"
    >
      <Experience quality={quality} reduced={reduced} onQualityChange={setQuality} />

      {/* 顶栏 */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <span className="rune-dot" />
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-ice/70">
            3D Stage · 记忆之核
          </span>
        </div>
        <div className="pointer-events-auto flex items-center gap-5">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ice/50">
            质量 · {quality}
          </span>
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.25em] text-ice/40 md:inline">
            {QUALITY_ORDER[QUALITY_ORDER.length - 1] === quality ? '自动降级' : `已降级至 ${quality}`}
          </span>
          <button type="button" onClick={onClose} className="rune-btn" aria-label="关闭 3D 舞台">
            <span className="rune-dot" /> 关闭 <X size={14} />
          </button>
        </div>
      </div>

      {/* 底部提示 */}
      <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.35em] text-ice/40">
        Esc 关闭 · 帧率下降时自动降级画质
      </p>
    </motion.div>
  );
}