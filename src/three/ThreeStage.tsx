import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import type { Project } from '../content/data';
import { useMediaQuery, usePrefersReducedMotion } from '../shared/hooks';
import Experience from './Experience';
import { QUALITY_ORDER, type Quality } from './config';

interface ThreeStageProps {
  onClose: () => void;
}

export default function ThreeStage({ onClose }: ThreeStageProps) {
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [quality, setQuality] = useState<Quality>(() => (isMobile ? 'medium' : 'high'));
  const [inputAxis, setInputAxis] = useState(0);
  const [focusedProject, setFocusedProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const activeProject = selectedProject ?? focusedProject;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const stopMovement = () => setInputAxis(0);
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerup', stopMovement);
    window.addEventListener('pointercancel', stopMovement);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerup', stopMovement);
      window.removeEventListener('pointercancel', stopMovement);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-abyss"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      role="dialog"
      aria-modal="true"
      aria-label="GLSL 互动作品舞台"
    >
      <Experience
        quality={quality}
        reduced={reduced}
        inputAxis={inputAxis}
        onQualityChange={setQuality}
        onFocusProject={setFocusedProject}
        onSelectProject={setSelectedProject}
      />

      <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3">
          <span className="rune-dot" />
          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-ice/70 md:text-[10px] md:tracking-[0.35em]">
            GLSL PORTFOLIO · 记忆漫游
          </span>
        </div>
        <div className="pointer-events-auto flex items-center gap-3 md:gap-5">
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.25em] text-ice/50 sm:inline">
            {QUALITY_ORDER.at(-1) === quality ? `质量 · ${quality}` : `已降级 · ${quality}`}
          </span>
          <button type="button" onClick={onClose} className="rune-btn" aria-label="关闭互动舞台">
            <span className="rune-dot" /> 关闭 <X size={14} />
          </button>
        </div>
      </div>

      {activeProject && (
        <motion.aside
          key={activeProject.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto absolute bottom-24 left-5 w-[min(25rem,calc(100vw-2.5rem))] border-l border-petal/40 bg-abyss/55 px-5 py-4 backdrop-blur-md md:bottom-8 md:left-8"
          aria-live="polite"
        >
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-ice/55">记忆节点 · {activeProject.id}</p>
          <h2 className="mb-2 font-display text-xl text-petal">{activeProject.title}</h2>
          <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-ice-soft/70">{activeProject.shortDesc}</p>
          <div className="flex items-center gap-5">
            <button type="button" className="rune-btn" onClick={() => navigate(`/project/${activeProject.id}?from=stage`)}>
              <span className="rune-dot" /> 查看作品
            </button>
            {selectedProject && (
              <button type="button" className="font-mono text-[9px] tracking-[0.2em] text-ice/45 hover:text-ice" onClick={() => setSelectedProject(null)}>
                收起
              </button>
            )}
          </div>
        </motion.aside>
      )}

      <div className="pointer-events-auto absolute bottom-5 right-5 flex items-center gap-3 md:bottom-8 md:right-8">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center border border-ice/20 bg-abyss/55 font-mono text-lg text-petal backdrop-blur-md hover:border-petal/50"
          onPointerDown={() => setInputAxis(-1)}
          aria-label="向左移动"
        >
          ←
        </button>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center border border-ice/20 bg-abyss/55 font-mono text-lg text-petal backdrop-blur-md hover:border-petal/50"
          onPointerDown={() => setInputAxis(1)}
          aria-label="向右移动"
        >
          →
        </button>
      </div>

      <p className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.3em] text-ice/40 lg:block">
        A D / ← → 移动 · 靠近或点击心核 · Esc 关闭
      </p>
    </motion.div>
  );
}
