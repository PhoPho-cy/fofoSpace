import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'motion/react';
import {
  ACT_IDS,
  actForProgress,
  cameraX,
  charWorld,
  clamp,
  scrollTopForProgress,
  type ActId,
} from './config';
import SceneTrack from './scene/SceneTrack';
import ActRail from './ui/ActRail';
import { useContent } from '../content/store';

interface JourneyProps {
  /** 记忆之门是否已开启（用于延迟执行深链滚动） */
  started: boolean;
}

/**
 * 桌面端横版探索：一段从上到下的滚动，驱动角色沿固定路径向右探索。
 * 文字安全区（左 35%）+ 游戏层（右 65%）持续共存，能量线贯穿四幕。
 */
export default function Journey({ started }: JourneyProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { content } = useContent();
  const { brand, hint } = content.ui;

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  // 轻微惯性：相机 / 角色使用弹簧平滑跟随
  const smoothP = useSpring(scrollYProgress, { stiffness: 92, damping: 22, mass: 0.55 });
  const clampedP = useTransform(smoothP, (v) => clamp(v, 0, 1));
  const lit = useTransform(clampedP, (v) => v);
  const cameraXVal = useTransform(clampedP, (v) => cameraX(v));
  const charX = useTransform(clampedP, (v) => `${charWorld(v)}vw`);

  const [activeAct, setActiveAct] = useState<ActId>('cover');
  const [hoveredWork, setHoveredWork] = useState<string | null>(null);
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActiveAct(actForProgress(v));
  });

  // 深链：/?act=work 等，在门开启后跳转到对应幕
  useEffect(() => {
    if (!started) return;
    const params = new URLSearchParams(window.location.search);
    const act = params.get('act') as ActId | null;
    if (act && (ACT_IDS as string[]).includes(act)) {
      const p = ACT_IDS.indexOf(act) / ACT_IDS.length;
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollTopForProgress(p), behavior: 'auto' });
      });
    }
  }, [started]);

  const jumpTo = useCallback((act: ActId) => {
    const p = ACT_IDS.indexOf(act) / ACT_IDS.length;
    window.scrollTo({ top: scrollTopForProgress(p), behavior: 'smooth' });
  }, []);

  const openProject = useCallback(
    (id: string) => navigate(`/project/${id}?from=home`),
    [navigate],
  );
  const openDoc = useCallback(
    (thoughtId: string | undefined) =>
      navigate(thoughtId ? `/thoughts?id=${thoughtId}&from=home` : '/thoughts?from=home'),
    [navigate],
  );

  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <div ref={scrollRef} className="relative" style={{ height: `${ACT_IDS.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-abyss">
        {/* 全局氛围：体积雾 + 柔光 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(1100px 620px at 72% 22%, rgba(29,58,71,0.38), transparent 62%), radial-gradient(800px 480px at 8% 108%, rgba(8,24,33,0.55), transparent 60%)',
          }}
        />
        <SceneTrack
          cameraX={cameraXVal}
          activeAct={activeAct}
          lit={lit}
          progress={scrollYProgress}
          charX={charX}
          onJump={jumpTo}
          hoveredWork={hoveredWork}
          onWorkHover={setHoveredWork}
          onOpenProject={openProject}
          hoveredDoc={hoveredDoc}
          onDocHover={setHoveredDoc}
          onOpenDoc={openDoc}
        />
        <ActRail activeAct={activeAct} onJump={jumpTo} />

        {/* 顶部品牌（极小，非导航栏） */}
        <div className="pointer-events-none absolute left-[7vw] top-8 z-30">
          <span className="font-display text-sm font-bold tracking-[0.35em] text-petal/70">
            {brand}
          </span>
        </div>

        {/* 底部提示（仅在封面幕显示） */}
        <motion.div
          className="pointer-events-none absolute bottom-6 right-10 z-30 font-mono text-[9px] uppercase tracking-[0.35em] text-ice/50"
          style={{ opacity: hintOpacity }}
        >
          {hint}
        </motion.div>

        {/* 底部细进度线（融入场景，非面板） */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-30 w-40 -translate-x-1/2">
          <div className="h-px w-full bg-ice/15">
            <motion.div
              className="h-px origin-left bg-gradient-to-r from-ice/60 to-petal"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
