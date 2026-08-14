import { motion, AnimatePresence } from 'motion/react';
import { useContent } from '../content/store';
import GlobalNav from '../components/GlobalNav';
import { Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import SciFiHeading from '../components/SciFiHeading';
import { useState, useEffect } from 'react';

export default function TechThoughts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { content } = useContent();
  const thoughts = content.thoughts;
  const [searchQuery, setSearchQuery] = useState('');

  const params = new URLSearchParams(location.search);
  const activeId = params.get('id') || thoughts[0]?.id || '';
  const fromProject = params.get('fromProject');
  const fromHome = params.get('from') === 'home';

  const filteredThoughts = thoughts.filter(thought =>
    thought.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thought.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thought.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeThought = thoughts.find(t => t.id === activeId) || thoughts[0];

  const handleSelect = (id: string) => {
     navigate(`/thoughts?id=${id}${fromProject ? `&fromProject=${fromProject}` : ''}`, { replace: true });
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
     if (fromProject) navigate(`/project/${fromProject}?act=work`);
     else if (fromHome) navigate('/?act=docs');
     else navigate('/?act=cover');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-abyss font-body text-white"
    >
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(1000px 560px at 75% -5%, rgba(29,58,71,0.42), transparent 62%), radial-gradient(760px 460px at 0% 110%, rgba(8,24,33,0.9), transparent 60%)',
        }}
      />
      <GlobalNav />

      <div className="relative mx-auto max-w-[110rem] px-8 pb-32 pt-28 md:px-12 md:pt-36 lg:px-24">
        <button
          onClick={handleBack}
          className="rune-btn mb-14"
        >
          <span className="rune-dot" /> 返回{fromProject ? '心核' : '空间'}
        </button>

        <div className="relative z-10 mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="chapter-label mb-5">第四章 · 脉髓</p>
            <SciFiHeading as="h1" className="display-title text-4xl font-bold uppercase tracking-tight md:text-7xl">
              <span>技术文档</span>
            </SciFiHeading>
            <p className="body-copy mt-5 max-w-xl">神经主干之上的知识节点：着色器、程序化管线、实时渲染与工程笔记。</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ice/50" size={16} />
            <input
              type="text"
              placeholder="检索笔记…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="检索技术文档"
              className="w-full border-b border-ice/20 bg-transparent py-3 pl-11 pr-4 font-mono text-sm uppercase tracking-widest text-white placeholder:text-ice/30 focus:border-petal focus:outline-none"
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-start gap-16 lg:flex-row lg:gap-32">
          {/* 索引侧栏 */}
          <div className="w-full shrink-0 lg:sticky lg:top-24 lg:w-80">
            <h3 className="chapter-label mb-6">归档索引</h3>
            {filteredThoughts.length === 0 && (
              <div className="py-8 text-center font-mono text-xs uppercase tracking-widest text-ice/40">
                未找到匹配笔记。
              </div>
            )}
            <ul className="space-y-2 border-l border-ice/10 pl-5">
              {filteredThoughts.map((thought) => (
                <li key={thought.id}>
                  <button
                    onClick={() => handleSelect(thought.id)}
                    aria-current={activeId === thought.id ? 'true' : undefined}
                    className={`block w-full py-4 text-left transition-all duration-300 ${
                      activeId === thought.id ? 'text-petal' : 'text-white/55 hover:text-white'
                    }`}
                  >
                    <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-ice/50">
                      {thought.date}
                    </span>
                    <span className={`mt-1 block font-display text-lg font-bold leading-relaxed ${activeId === thought.id ? 'text-glow-petal' : ''}`}>
                      {thought.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 正文 */}
          <div className="min-h-[50vh] w-full flex-1">
            <AnimatePresence mode="wait">
              <motion.article
                key={activeThought.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-border-subtle bg-void/60 p-8 backdrop-blur-xl md:p-14"
              >
                <div className="mb-12 flex flex-col justify-between gap-6 border-b border-border-subtle pb-10 md:flex-row md:items-baseline">
                  <SciFiHeading as="h2" className="display-title text-3xl font-bold uppercase leading-tight md:text-5xl">
                    <span>{activeThought.title}</span>
                  </SciFiHeading>
                  <span className="shrink-0 font-mono text-sm uppercase tracking-[0.25em] text-ice">{activeThought.date}</span>
                </div>

                <p className="body-copy mb-14 whitespace-pre-wrap text-lg md:text-xl">{activeThought.summary}</p>

                <div className="min-h-[400px] whitespace-pre-wrap rounded-lg border border-border-subtle bg-abyss/80 p-8 font-mono text-[15px] leading-loose text-[#c4d3da]/90 shadow-inner md:p-12">
                  {activeThought.content}
                </div>

                {activeThought.relatedProjects && activeThought.relatedProjects.length > 0 && (
                  <div className="mt-14 border-t border-border-subtle pt-10">
                    <h4 className="chapter-label mb-6">关联心核</h4>
                    <div className="flex flex-wrap gap-5">
                      {activeThought.relatedProjects.map(projId => (
                        <button
                          key={projId}
                          onClick={() => navigate(`/project/${projId}?from=home`)}
                          className="rune-btn"
                        >
                          <span className="rune-dot" /> {projId}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
