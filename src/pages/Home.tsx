import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Journey from '../journey/Journey';
import VerticalJourney from '../journey/VerticalJourney';
import MemoryGate from '../journey/ui/MemoryGate';
import { useMediaQuery } from '../shared/hooks';

// three.js 通过懒加载按需进入（不会打进首屏主包）
const ThreeStage = lazy(() => import('../three/ThreeStage'));

export default function Home() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [entered, setEntered] = useState(false);
  const [show3D, setShow3D] = useState(false);

  // 门开启或 3D 舞台打开时锁定滚动
  useEffect(() => {
    document.body.style.overflow = entered && !show3D ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [entered, show3D]);

  return (
    <main className="relative min-h-screen bg-abyss text-white">
      <div aria-hidden={!entered} className={entered ? '' : 'pointer-events-none select-none'}>
        {isDesktop ? <Journey started={entered} /> : <VerticalJourney started={entered} />}
      </div>

      {/* 底部工具入口：3D 舞台 / 内容编辑（极小符文按钮，非导航） */}
      <div className="fixed bottom-6 left-6 z-30 flex gap-5">
        <button
          type="button"
          onClick={() => setShow3D(true)}
          className="rune-btn"
          style={{ textShadow: '0 1px 8px rgba(4,8,13,0.9)' }}
        >
          <span className="rune-dot" /> 3D 舞台
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="rune-btn"
          style={{ textShadow: '0 1px 8px rgba(4,8,13,0.9)' }}
        >
          <span className="rune-dot" /> 内容编辑
        </button>
      </div>

      {/* 3D 舞台（懒加载） */}
      <Suspense fallback={<StageFallback />}>
        <AnimatePresence>
          {show3D && <ThreeStage key="three-stage" onClose={() => setShow3D(false)} />}
        </AnimatePresence>
      </Suspense>

      <AnimatePresence>
        {!entered && (
          <MemoryGate
            key="memory-gate"
            onEnter={() => {
              setEntered(true);
              setShow3D(true);
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function StageFallback() {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-abyss">
      <span
        className="block h-8 w-8 animate-spin rounded-full border border-ice/20 border-t-petal/90"
        style={{ boxShadow: '0 0 18px rgba(238,220,231,0.5)' }}
      />
      <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-ice/60">正在搭建 3D 舞台</p>
    </div>
  );
}