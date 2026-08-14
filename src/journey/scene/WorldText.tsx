import { useTransform, motion, type MotionValue } from 'motion/react';
import { actProgress, type ActId } from '../config';
import type { Profile, Project } from '../../content/data';
import type { ActCopy } from '../../content/types';
import { DOC_NODES } from './DocNodes';

interface WorldTextProps {
  progress: MotionValue<number>;
  activeAct: ActId;
  profile: Profile;
  projects: Project[];
  actCopy: ActCopy[];
  hoveredWork: string | null;
  onWorkHover: (id: string | null) => void;
  onJump: (act: ActId) => void;
  onOpenProject: (id: string) => void;
  onOpenDoc: (thoughtId: string | undefined) => void;
}

function useActStyle(progress: MotionValue<number>, act: ActId) {
  const range = useTransform(progress, (v) => actProgress(v, act));
  const opacity = useTransform(range, (ap) => {
    const fadeIn = Math.min(1, ap / 0.22);
    const fadeOut = Math.min(1, (1 - ap) / 0.18);
    return Math.max(0, fadeIn * fadeOut);
  });
  const y = useTransform(range, (ap) => 18 - ap * 24);
  return { opacity, y };
}

/**
 * 融入场景的文字块：锚定在世界坐标中，随镜头平移。
 * 场景焦点（神兽 / 水镜 / 心核 / 神经主干）与角色叠加在文字前方，形成前后遮挡关系。
 * 内容由 content（默认 src/data.ts + public/content.json 覆盖）驱动。
 */
export default function WorldText({
  progress,
  activeAct,
  profile,
  projects,
  actCopy,
  hoveredWork,
  onWorkHover,
  onJump,
  onOpenProject,
  onOpenDoc,
}: WorldTextProps) {
  const hoveredProject = projects.find((p) => p.id === hoveredWork) ?? null;

  return (
    <div className="pointer-events-none absolute left-0 top-0 h-full" aria-label="融入场景的文字">
      <CoverBlock progress={progress} active={activeAct === 'cover'} copy={actCopy[0]} onJump={onJump} />
      <AboutBlock progress={progress} active={activeAct === 'about'} profile={profile} copy={actCopy[1]} />
      <WorkBlock
        progress={progress}
        active={activeAct === 'work'}
        projects={projects}
        copy={actCopy[2]}
        hoveredProject={hoveredProject}
        onWorkHover={onWorkHover}
        onOpenProject={onOpenProject}
      />
      <DocsBlock progress={progress} active={activeAct === 'docs'} copy={actCopy[3]} onOpenDoc={onOpenDoc} />
    </div>
  );
}

/** 每个文字块背后的局部雾袋：柔化背景、保证可读，却不形成卡片 */
function FogPocket({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{
        background:
          'radial-gradient(58% 78% at 38% 50%, rgba(6,10,16,0.72), rgba(6,10,16,0.34) 55%, transparent 78%)',
        filter: 'blur(6px)',
      }}
    />
  );
}

function CoverBlock({
  progress,
  active,
  copy,
  onJump,
}: {
  progress: MotionValue<number>;
  active: boolean;
  copy: ActCopy;
  onJump: (act: ActId) => void;
}) {
  const { opacity, y } = useActStyle(progress, 'cover');
  return (
    <motion.section
      style={{ opacity, y, left: '5vw', top: '30vh', width: '26vw' }}
      className="absolute"
      aria-hidden={!active}
      inert={!active}
      aria-label="第一章 归墟 · 封面"
    >
      <FogPocket className="-inset-10" />
      <div className="relative">
        <p className="chapter-label mb-5">{copy.chapter} · {copy.title}</p>
        <h1 className="display-title text-[7.2vh] leading-[1.05]">
          浮光
          <span className="block font-normal text-[3.4vh] tracking-[0.5em] text-ice/95">FOFO 的空间</span>
        </h1>
        <p className="body-copy mt-6 max-w-[22vw]">
          记忆化作一条粉白色的光脉，贯穿四段旅程。向下滚动，让探索者带你走进沉眠神兽、记忆水镜、心核与脉髓。
        </p>
        <div className="pointer-events-auto mt-8">
          <button type="button" className="rune-btn" onClick={() => onJump('about')}>
            <span className="rune-dot" />
            进入记忆
          </button>
        </div>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em] text-mist/80">
          向下滚动 · 跟随光脉
        </p>
      </div>
    </motion.section>
  );
}

function AboutBlock({
  progress,
  active,
  profile,
  copy,
}: {
  progress: MotionValue<number>;
  active: boolean;
  profile: Profile;
  copy: ActCopy;
}) {
  const { opacity, y } = useActStyle(progress, 'about');
  return (
    <motion.section
      style={{ opacity, y, left: '105vw', top: '30vh', width: '24vw' }}
      className="absolute"
      aria-hidden={!active}
      inert={!active}
      aria-label="第二章 水镜 · 个人简介"
    >
      <FogPocket className="-inset-10" />
      <div className="relative">
        <p className="chapter-label mb-5">{copy.chapter} · {copy.title}</p>
        <h2 className="display-title text-[4.6vh]">关于我</h2>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-ice/85">{profile.role}</p>
        <div className="mt-6 space-y-4">
          {profile.intro.map((t, i) => (
            <p key={i} className="body-copy">{t}</p>
          ))}
        </div>
        <div className="mt-6 flex max-w-[22vw] flex-wrap gap-2">
          {profile.skills.map((s) => (
            <span key={s} className="font-mono text-[10px] uppercase tracking-[0.18em] text-petal/75">
              ◈ {s}
            </span>
          ))}
        </div>
        <div className="pointer-events-auto mt-8 flex max-w-[22vw] flex-col gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em]">
          <a href={`mailto:${profile.email}`} className="rune-btn justify-start">
            <span className="rune-dot" /> {profile.email}
          </a>
          <span className="flex items-center gap-3 text-ice/75">
            <span className="h-2 w-2 rotate-45 bg-ice/60" /> 微信 · {profile.wechat}
          </span>
        </div>
      </div>
    </motion.section>
  );
}

function WorkBlock({
  progress,
  active,
  projects,
  copy,
  hoveredProject,
  onWorkHover,
  onOpenProject,
}: {
  progress: MotionValue<number>;
  active: boolean;
  projects: Project[];
  copy: ActCopy;
  hoveredProject: Project | null;
  onWorkHover: (id: string | null) => void;
  onOpenProject: (id: string) => void;
}) {
  const { opacity, y } = useActStyle(progress, 'work');
  return (
    <motion.section
      style={{ opacity, y, left: '168vw', top: '28vh', width: '28vw' }}
      className="absolute"
      aria-hidden={!active}
      inert={!active}
      aria-label="第三章 心核 · 作品展示"
    >
      <FogPocket className="-inset-10" />
      <div className="relative">
        <p className="chapter-label mb-5">{copy.chapter} · {copy.title}</p>
        <h2 className="display-title text-[4.6vh]">作品</h2>
        <p className="body-copy mt-3 max-w-[24vw]">三颗心核，各自封存一段创造。悬停点亮，点击进入沉浸式详情。</p>
        <div className="pointer-events-auto mt-6 flex max-w-[26vw] flex-col">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className="group flex items-baseline gap-4 border-b border-ice/10 py-3 text-left transition-colors"
              onMouseEnter={() => onWorkHover(p.id)}
              onMouseLeave={() => onWorkHover(null)}
              onFocus={() => onWorkHover(p.id)}
              onBlur={() => onWorkHover(null)}
              onClick={() => onOpenProject(p.id)}
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-ice/60">0{i + 1}</span>
              <span className="font-display text-[2.4vh] font-bold text-petal/95 transition-colors group-hover:text-petal">
                {p.title.split(':')[0]}
              </span>
              <span className="ml-auto font-mono text-[10px] text-ice/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-petal">→</span>
            </button>
          ))}
        </div>
        {hoveredProject && (
          <div className="mt-5 max-w-[22vw]">
            <p className="body-copy text-[13px]">{hoveredProject.shortDesc}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {hoveredProject.techStack.map((t) => (
                <span key={t} className="font-mono text-[9px] uppercase tracking-[0.18em] text-ice/60">{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}

function DocsBlock({
  progress,
  active,
  copy,
  onOpenDoc,
}: {
  progress: MotionValue<number>;
  active: boolean;
  copy: ActCopy;
  onOpenDoc: (id: string | undefined) => void;
}) {
  const { opacity, y } = useActStyle(progress, 'docs');
  return (
    <motion.section
      style={{ opacity, y, left: '282vw', top: '28vh', width: '26vw' }}
      className="absolute"
      aria-hidden={!active}
      inert={!active}
      aria-label="第四章 脉髓 · 技术文档"
    >
      <FogPocket className="-inset-10" />
      <div className="relative">
        <p className="chapter-label mb-5">{copy.chapter} · {copy.title}</p>
        <h2 className="display-title text-[4.6vh]">技术文档</h2>
        <p className="body-copy mt-3 max-w-[24vw]">神经主干之上，四枚知识节点：着色器、程序化管线、实时渲染与技术文章。</p>
        <div className="pointer-events-auto mt-6 flex max-w-[24vw] flex-col">
          {DOC_NODES.map((n) => (
            <button
              key={n.id}
              type="button"
              className="group flex items-center gap-4 border-b border-ice/10 py-3 text-left transition-colors"
              onClick={() => onOpenDoc(n.thoughtId)}
            >
              <span className="h-2 w-2 rotate-45 bg-petal/60 shadow-[0_0_10px_rgba(238,220,231,0.6)] transition-all duration-300 group-hover:bg-petal group-hover:shadow-[0_0_14px_rgba(238,220,231,0.95)]" />
              <span className="font-display text-[2.2vh] font-bold text-petal/90 transition-colors group-hover:text-petal">{n.label}</span>
              <span className="ml-auto font-mono text-[10px] text-ice/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-petal">→</span>
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}