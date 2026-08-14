import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { COLORS } from '../config';

interface MemoryGateProps {
  onEnter: () => void;
}

/**
 * 首屏加载 / 进入记忆之门。
 * 等待资源加载（window load + 最小时长）后呈现入口，点击或回车进入。
 */
export default function MemoryGate({ onEnter }: MemoryGateProps) {
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const seen = typeof window !== 'undefined' && sessionStorage.getItem('fofoGateSeen') === '1';

  useEffect(() => {
    const minDelay = seen ? 450 : 1000;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
      sessionStorage.setItem('fofoGateSeen', '1');
    };

    const t = window.setTimeout(finish, minDelay);
    if (document.readyState !== 'complete') {
      window.addEventListener('load', finish, { once: true });
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && readyRef.current) enter();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('load', finish);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 就绪后自动进入（老访客更快），点击 / 回车可提前
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(enter, seen ? 900 : 2200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const readyRef = useRef(ready);
  readyRef.current = ready;

  const enter = () => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    window.setTimeout(onEnter, 850);
  };

  const leavingRef = useRef(false);
  leavingRef.current = leaving;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: COLORS.abyss, pointerEvents: leaving ? 'none' : 'auto' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      role="dialog"
      aria-modal="true"
      aria-label="进入记忆"
    >
      {/* 背景雾 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 500px at 70% 30%, rgba(29,58,71,0.5), transparent 65%), radial-gradient(700px 400px at 20% 80%, rgba(8,24,33,0.9), transparent 60%)',
        }}
      />
      {/* 旋转符文环 */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 100 100" className="h-full w-full animate-spin-slow opacity-40">
          <circle cx="50" cy="50" r="48" fill="none" stroke={COLORS.cyanSoft} strokeWidth="0.4" strokeDasharray="1 3" />
          <circle cx="50" cy="50" r="42" fill="none" stroke={COLORS.cyanSoft} strokeWidth="0.25" strokeDasharray="0.5 2.5" />
          {Array.from({ length: 8 }).map((_, i) => {
            return (
              <rect
                key={i}
                x={49.4}
                y={-2}
                width="1.2"
                height="6"
                fill={i % 2 ? COLORS.ice : COLORS.petal}
                opacity="0.6"
                transform={`rotate(${(i / 8) * 360}) translate(0 50)`}
              />
            );
          })}
        </svg>
      </div>

      {/* 标题区 */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="mb-8 h-px w-40 overflow-hidden bg-ice/20">
          <div
            className="h-px w-full origin-left bg-gradient-to-r from-ice to-petal"
            style={{
              transform: ready ? 'scaleX(1)' : 'scaleX(0.25)',
              transition: 'transform 1.6s ease',
            }}
          />
        </div>

        {!ready ? (
          <div className="flex flex-col items-center gap-6">
            <span
              className="block h-7 w-7 animate-spin rounded-full border border-ice/20 border-t-petal/90"
              style={{ boxShadow: `0 0 18px ${COLORS.glowPetal}` }}
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-ice/60">正在点亮记忆</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <p className="chapter-label mb-4">第一章 · 归墟</p>
            <h1 className="display-title text-[6vh]">
              浮光
              <span className="mt-1 block text-[2.6vh] font-normal tracking-[0.5em] text-ice/90">FOFO 的空间</span>
            </h1>
            <p className="body-copy mt-6 max-w-sm">一段关于记忆与创造的旅程，正等待着被唤醒。</p>
            <button type="button" className="rune-btn mt-10 text-sm" onClick={enter} autoFocus>
              <span className="rune-dot h-3 w-3" />
              进入记忆
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}


