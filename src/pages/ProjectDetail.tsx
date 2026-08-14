import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '../content/store';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import GlobalNav from '../components/GlobalNav';
import { useState } from 'react';
import SciFiHeading from '../components/SciFiHeading';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { content } = useContent();
  const { projects, thoughts } = content;
  const project = projects.find(p => p.id === id);

  if (!project) return <div className="p-24 text-white font-body">未找到该项目</div>;

  const toc = project.details.filter(b => b.heading).map(b => ({ id: b.id, heading: b.heading, level: b.headingLevel || 'h2' }));

  const scrollToBlock = (blockId: string) => {
     const el = document.getElementById(blockId);
     if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-abyss font-body text-white"
    >
      {/* 氛围背景 */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(1000px 560px at 80% 0%, rgba(29,58,71,0.4), transparent 62%), radial-gradient(760px 460px at 0% 100%, rgba(8,24,33,0.9), transparent 60%)',
        }}
      />
      <GlobalNav />

      {/* 头部 */}
      <div className="relative w-full overflow-hidden pb-16 pt-28 md:pt-36">
        <div className="relative z-10 mx-auto flex w-full max-w-[140rem] flex-col items-start px-8 md:px-12 lg:px-24">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/?act=work')}
            className="rune-btn mb-16"
          >
            <span className="rune-dot" /> 返回心核
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-12 w-full"
          >
            <p className="chapter-label mb-6">心核 · 作品详情</p>
            <SciFiHeading
              as="h1"
              className="display-title mb-8 text-left text-4xl md:text-7xl lg:text-[96px] font-bold uppercase leading-[1.02] tracking-tight"
            >
              {project.title.split(':').map((part, i) => (
                <span key={i} className="block">{part}{i === 0 && project.title.includes(':') ? ':' : ''}</span>
              ))}
            </SciFiHeading>

            <div className="mb-8 flex flex-wrap gap-3">
              {project.techStack.map(tag => (
                <span key={tag} className="font-mono text-[11px] uppercase tracking-[0.2em] text-petal/80">
                  ◈ {tag}
                </span>
              ))}
            </div>
            <p className="body-copy max-w-3xl">{project.shortDesc}</p>
          </motion.div>

          {/* 封面展示（懒加载 + 尺寸预留） */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative w-full overflow-hidden rounded-xl border border-border-subtle shadow-[0_30px_100px_rgba(0,0,0,0.7)]"
            style={{ aspectRatio: '16 / 9' }}
          >
            {project.coverMedia.endsWith('.mp4') ? (
              <video src={project.coverMedia} autoPlay loop muted playsInline className="h-full w-full object-cover" />
            ) : (
              <img
                src={project.coverMedia}
                alt={project.title}
                loading="lazy"
                width={1600}
                height={900}
                className="h-full w-full object-cover"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/60 via-transparent to-transparent" />
          </motion.div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[140rem] flex-col items-start gap-16 px-8 py-16 md:px-12 lg:flex-row lg:gap-32 lg:px-24 lg:py-24">
        {/* 目录 */}
        {toc.length > 0 && (
          <div className="w-full shrink-0 lg:sticky lg:top-24 lg:w-80">
            <h3 className="chapter-label mb-6">脉络 · Index</h3>
            <ul className="space-y-5 border-l border-ice/10 pl-5">
              {toc.map(item => (
                <li key={item.id} className={item.level === 'h3' ? 'ml-4' : ''}>
                  <button
                    onClick={() => scrollToBlock(item.id)}
                    className="text-left font-mono text-xs uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-petal"
                  >
                    {item.heading}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 内容块 */}
        <div className="w-full flex-1 space-y-40">
          {project.details.map((block) => {
             const thought = block.type === 'thoughtRef' ? thoughts.find(t => t.id === block.thoughtId) : null;

             return (
               <motion.div
                 id={block.id}
                 key={block.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: '-100px' }}
                 transition={{ duration: 0.8 }}
                 className="space-y-8"
               >
                 {block.type === 'mixed' && (
                    <div className="flex flex-col items-start gap-12 xl:flex-row xl:gap-24">
                       <div className="flex shrink-0 flex-col space-y-8 xl:w-[50%]">
                          {block.heading && (
                            <SciFiHeading
                               as={block.headingLevel || 'h2'}
                               className={`display-title inline-block border-b border-border-subtle pb-6 font-bold uppercase ${block.headingLevel === 'h3' ? 'text-2xl text-white/80' : 'text-3xl lg:text-4xl'}`}
                            >
                              <span>{block.heading}</span>
                            </SciFiHeading>
                          )}
                          {block.content && (
                            <p className="body-copy whitespace-pre-wrap">{block.content}</p>
                          )}
                       </div>

                       <div className="w-full xl:w-[50%]">
                          {block.mediaType === 'video' && block.mediaUrl && (
                            <div className="overflow-hidden rounded-lg border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                              <video src={block.mediaUrl} autoPlay loop muted playsInline className="h-auto w-full" />
                            </div>
                          )}
                          {block.mediaType === 'image' && block.mediaUrl && (
                            <div className="overflow-hidden rounded-lg border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                              <img src={block.mediaUrl} alt={block.heading} loading="lazy" width={1200} height={675} className="h-auto w-full" />
                            </div>
                          )}
                          {block.mediaType === 'code' && block.codeString && (
                            <CodeBlock code={block.codeString} />
                          )}
                          {block.mediaType === 'compare' && block.mediaUrl && block.mediaUrl2 && (
                            <ComparisonSlider left={block.mediaUrl} right={block.mediaUrl2} />
                          )}
                       </div>
                    </div>
                 )}

                 {block.type !== 'mixed' && block.type !== 'thoughtRef' && (
                    <div className="space-y-10">
                      {block.heading && (
                        <SciFiHeading
                           as={block.headingLevel || 'h2'}
                           className={`display-title inline-block border-b border-border-subtle pb-6 font-bold uppercase ${block.headingLevel === 'h3' ? 'text-2xl text-white/80' : 'text-3xl lg:text-4xl'}`}
                        >
                          <span>{block.heading}</span>
                        </SciFiHeading>
                      )}

                      {block.type === 'text' && (
                        <p className="body-copy max-w-7xl whitespace-pre-wrap">{block.content}</p>
                      )}

                      {block.type === 'video' && block.mediaUrl && (
                        <div className="max-w-7xl overflow-hidden rounded-lg border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                          <video src={block.mediaUrl} autoPlay loop muted playsInline className="h-auto w-full" />
                        </div>
                      )}

                      {block.type === 'image' && block.mediaUrl && (
                        <div className="max-w-7xl overflow-hidden rounded-lg border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                          <img src={block.mediaUrl} alt={block.heading} loading="lazy" width={1200} height={675} className="h-auto w-full" />
                        </div>
                      )}

                      {block.type === 'code' && block.codeString && (
                        <CodeBlock code={block.codeString} />
                      )}

                      {block.type === 'compare' && block.mediaUrl && block.mediaUrl2 && (
                        <ComparisonSlider left={block.mediaUrl} right={block.mediaUrl2} />
                      )}
                    </div>
                 )}

                 {block.type === 'thoughtRef' && thought && (
                    <div className="flex flex-col items-start gap-12 xl:flex-row xl:gap-24">
                       <div className="flex shrink-0 flex-col space-y-6 xl:w-[50%]">
                          {block.heading && (
                            <SciFiHeading
                               as={block.headingLevel || 'h2'}
                               className={`display-title inline-block border-b border-border-subtle pb-6 font-bold uppercase ${block.headingLevel === 'h3' ? 'text-2xl text-white/80' : 'text-3xl lg:text-4xl'}`}
                            >
                              <span>{block.heading}</span>
                            </SciFiHeading>
                          )}
                       </div>
                       <div className="w-full rounded-xl border border-border-subtle bg-void/70 p-8 backdrop-blur-xl md:p-12">
                          <p className="chapter-label mb-5">关联技术文档</p>
                          <h5 className="display-title text-2xl md:text-3xl">{thought.title}</h5>
                          <p className="body-copy mt-6">{thought.summary}</p>
                          <button type="button" className="rune-btn mt-10" onClick={() => navigate(`/thoughts?id=${thought.id}&fromProject=${project.id}`)}>
                            <span className="rune-dot" /> 阅读全文 <ExternalLink size={14} />
                          </button>
                       </div>
                    </div>
                 )}
               </motion.div>
             );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="max-w-7xl overflow-x-auto rounded-lg border border-border-subtle bg-void p-6 shadow-2xl md:p-10">
      <pre className="font-mono text-sm leading-loose text-petal/90 md:text-base"><code>{code}</code></pre>
    </div>
  );
}

function ComparisonSlider({ left, right }: { left: string, right: string }) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div
      className="relative max-w-7xl h-[300px] md:h-[500px] xl:h-[700px] overflow-hidden rounded-xl border border-white/10 select-none shadow-2xl cursor-ew-resize"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        setSliderPos((x / rect.width) * 100);
      }}
      onTouchMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
        setSliderPos((x / rect.width) * 100);
      }}
    >
      <img src={right} alt="After" loading="lazy" width={1200} height={675} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div
        className="pointer-events-none absolute inset-0 h-full w-full border-r-2 border-petal shadow-[0_0_20px_rgba(238,220,231,0.5)]"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={left} alt="Before" loading="lazy" width={1200} height={675} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      </div>

      <div
        className="pointer-events-none absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-petal shadow-2xl"
        style={{ left: `calc(${sliderPos}% - 20px)` }}
      >
        <div className="flex gap-[3px]">
          <div className="h-4 w-1 rounded-full bg-black/80" />
          <div className="h-4 w-1 rounded-full bg-black/80" />
        </div>
      </div>
    </div>
  );
}
