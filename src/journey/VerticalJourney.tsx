import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { ACTS, COLORS, actForProgress, type ActId } from './config';
import { useContent } from '../content/store';
import { BeastArt } from './scene/Beast';
import { MirrorArt } from './scene/Mirror';
import { HeartCoreArt } from './scene/HeartCores';
import { DocNodeArt, DOC_NODES } from './scene/DocNodes';

/**
 * 移动端纵向叙事：保留能量线与节点关系，
 * 章节自上而下推进，角色沿左侧光脉下行。
 */
export default function VerticalJourney({ started }: { started: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { content } = useContent();
  const { profile, projects, thoughts, actCopy } = content;
  const copy = (id: ActId) => actCopy.find((c) => c.id === id) ?? { id, chapter: '', title: '', sub: '' };
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const markerTop = useTransform(scrollYProgress, (v) => `${v * 100}vh`);
  const [activeAct, setActiveAct] = useState<ActId>('cover');

  useMotionValueEvent(scrollYProgress, 'change', (v) => setActiveAct(actForProgress(v)));

  useEffect(() => {
    if (!started) return;
    const params = new URLSearchParams(window.location.search);
    const act = params.get('act') as ActId | null;
    if (act) {
      const i = ACTS.findIndex((a) => a.id === act);
      if (i >= 0) window.scrollTo({ top: i * window.innerHeight, behavior: 'auto' });
    }
  }, [started]);

  const jumpTo = useCallback((act: ActId) => {
    const i = ACTS.findIndex((a) => a.id === act);
    if (i >= 0) window.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' });
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* 左侧能量光脉 */}
      <div className="pointer-events-none fixed left-3 top-0 z-30 h-screen w-1">
        <div className="absolute inset-0 bg-ice/10" />
        <motion.div
          className="absolute inset-0 origin-top bg-gradient-to-b from-ice/70 via-petal to-petal"
          style={{ scaleY: scrollYProgress, boxShadow: `0 0 12px ${COLORS.glowPetal}` }}
        />
        {ACTS.map((act, i) => {
          const active = activeAct === act.id;
          return (
            <button
              key={act.id}
              type="button"
              className="absolute left-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45"
              style={{ top: `${(i / (ACTS.length - 1)) * 100}vh` }}
              onClick={() => jumpTo(act.id)}
              aria-label={`${act.chapter} ${act.title}`}
              aria-current={active ? 'true' : undefined}
            >
              <span
                className="block h-full w-full rotate-45 transition-all duration-300"
                style={{
                  background: active ? COLORS.petal : COLORS.cyanSoft,
                  boxShadow: active ? `0 0 12px ${COLORS.glowPetal}` : 'none',
                }}
              />
            </button>
          );
        })}
        {/* 角色随进度下行 */}
        <motion.div
          className="absolute left-1/2 z-20 flex h-5 w-5 -translate-x-1/2 items-center justify-center"
          style={{ top: markerTop, marginTop: '-10px' }}
          aria-hidden="true"
        >
          <span
            className="block h-2 w-2 rounded-full bg-petal"
            style={{ boxShadow: `0 0 12px ${COLORS.glowPetal}, 0 0 26px ${COLORS.glowPetal}` }}
          />
        </motion.div>
      </div>

      {/* 第一幕 · 封面 */}
      <section className="flex min-h-[100svh] flex-col items-center justify-center px-10 pl-12 text-center">
        <p className="chapter-label mb-4">{copy('cover').chapter} · {copy('cover').title}</p>
        <h1 className="display-title text-5xl">
          浮光
          <span className="mt-2 block text-lg font-normal tracking-[0.45em] text-ice/90">FOFO 的空间</span>
        </h1>
        <div className="mt-10 w-64">
          <BeastArt className="block w-full" />
        </div>
        <p className="body-copy mt-8 max-w-xs">记忆化作一条粉白色的光脉，贯穿四段旅程。</p>
        <button type="button" className="rune-btn mt-8" onClick={() => jumpTo('about')}>
          <span className="rune-dot" /> 进入记忆
        </button>
      </section>

      {/* 第二幕 · 简介 */}
      <section className="flex min-h-[100svh] flex-col items-center justify-center px-10 pl-12 text-center">
        <p className="chapter-label mb-4">{copy('about').chapter} · {copy('about').title}</p>
        <h2 className="display-title text-4xl">关于我</h2>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ice/80">{profile.role}</p>
        <div className="mt-8 w-44">
          <MirrorArt className="block w-full" />
        </div>
        <div className="mt-8 space-y-4">
          {profile.intro.map((t, i) => (
            <p key={i} className="body-copy max-w-sm">{t}</p>
          ))}
        </div>
        <div className="mt-6 flex max-w-sm flex-wrap justify-center gap-2">
          {profile.skills.map((s) => (
            <span key={s} className="font-mono text-[10px] uppercase tracking-[0.16em] text-petal/70">◈ {s}</span>
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ice/75">
          <a href={`mailto:${profile.email}`} className="rune-btn">{profile.email}</a>
          <span>微信 · {profile.wechat}</span>
        </div>
      </section>

      {/* 第三幕 · 作品 */}
      <section className="flex min-h-[100svh] flex-col items-center justify-center px-10 pl-12 text-center">
        <p className="chapter-label mb-4">{copy('work').chapter} · {copy('work').title}</p>
        <h2 className="display-title text-4xl">作品</h2>
        <p className="body-copy mt-3 max-w-xs">三颗心核，各自封存一段创造。</p>
        <div className="mt-8 flex items-end gap-6">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              className="flex w-24 flex-col items-center gap-2"
              onClick={() => navigate(`/project/${p.id}?from=home`)}
              aria-label={`查看作品：${p.title}`}
            >
              <HeartCoreArt className="block w-full" lit={false} />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ice/60">
                {p.title.split(':')[0]}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-8 w-full max-w-md space-y-3 text-left">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => navigate(`/project/${p.id}?from=home`)}
              className="group w-full border-b border-ice/10 py-3 text-left"
            >
              <span className="font-display text-lg font-bold text-petal/90">{p.title}</span>
              <span className="mt-1 block text-[12px] leading-relaxed text-[#c4d3da]/70">{p.shortDesc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 第四幕 · 文档 */}
      <section className="flex min-h-[100svh] flex-col items-center justify-center px-10 pl-12 text-center">
        <p className="chapter-label mb-4">{copy('docs').chapter} · {copy('docs').title}</p>
        <h2 className="display-title text-4xl">技术文档</h2>
        <p className="body-copy mt-3 max-w-xs">神经主干之上，四枚知识节点。</p>
        <div className="mt-10 w-full max-w-sm space-y-6">
          {DOC_NODES.map((n) => {
            const thought = thoughts.find((t) => t.id === n.thoughtId);
            return (
              <button
                key={n.id}
                type="button"
                className="flex w-full items-center justify-between gap-4 border-b border-ice/10 py-4 text-left"
                onClick={() =>
                  navigate(n.thoughtId ? `/thoughts?id=${n.thoughtId}&from=home` : '/thoughts?from=home')
                }
              >
                <span className="flex items-center gap-3">
                  <DocNodeArt lit={false} />
                  <span className="font-display text-lg font-bold text-petal/90">{n.label}</span>
                </span>
                <span className="max-w-[45%] text-right font-mono text-[10px] uppercase tracking-[0.14em] text-ice/50">
                  {thought?.summary.slice(0, 26) ?? '全部技术文章'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 底部进度 */}
      <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.35em] text-ice/60">
        {ACTS.map((a) => (
          <span key={a.id} className={activeAct === a.id ? 'text-petal' : ''}>
            {a.numeral}
            {a.id !== ACTS[ACTS.length - 1].id && <span className="mx-2 text-ice/25">·</span>}
          </span>
        ))}
      </div>
    </div>
  );
}


