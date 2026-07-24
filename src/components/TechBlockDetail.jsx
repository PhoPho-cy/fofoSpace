import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ArrowUp, Play, Code, Image, GitCompare, FileText } from 'lucide-react'

// 对比拖动滑块
function CompareSlider({ images, caption }) {
  const [pos, setPos] = useState(50)
  const ref = useRef(null)
  const drag = useRef(false)
  const onMove = (cx) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos(Math.max(0, Math.min((cx - r.left) / r.width, 1)) * 100)
  }
  return (
    <div className="bd-compare" ref={ref}
      onMouseDown={() => drag.current=true}
      onMouseUp={() => drag.current=false}
      onMouseLeave={() => drag.current=false}
      onMouseMove={e => drag.current && onMove(e.clientX)}>
      <div className="bd-c-bg" style={{backgroundImage:`url(${images[1]?.after||''})`}}/>
      <div className="bd-c-fg" style={{backgroundImage:`url(${images[0]?.before||''})`,clipPath:`inset(0 ${100-pos}% 0 0)`}}/>
      <div className="bd-c-line" style={{left:`${pos}%`}}><div className="bd-c-knob"><GitCompare size={14}/></div></div>
      <div className="bd-c-labels"><span>{images[0]?.label||'Before'}</span><span>{images[1]?.label||'After'}</span></div>
      {caption && <div className="bd-caption">{caption}</div>}
    </div>
  )
}

// 渲染单个 detailSection
function SectionBlock({ section, index }) {
  switch (section.type) {
    case 'h2':
      return <h2 className="bd-h2" id={`s-${index}`}>{section.text}</h2>
    case 'h3':
      return <h3 className="bd-h3" id={`s-${index}`}>{section.text}</h3>
    case 'text':
      return <p className="bd-text">{section.content}</p>
    case 'video':
      return section.src
        ? <div className="bd-media"><video src={section.src} controls muted loop className="bd-video"/>{section.caption && <div className="bd-caption">{section.caption}</div>}</div>
        : <div className="bd-placeholder"><Play size={24}/><span>视频区域</span></div>
    case 'gif':
      return section.src
        ? <div className="bd-media"><img src={section.src} alt="" className="bd-img"/>{section.caption && <div className="bd-caption">{section.caption}</div>}</div>
        : <div className="bd-placeholder"><Play size={24}/><span>动图区域</span></div>
    case 'comparison':
      return <CompareSlider images={section.images} caption={section.caption}/>
    case 'image':
      return section.src
        ? <div className="bd-media"><img src={section.src} alt="" className="bd-img"/>{section.caption && <div className="bd-caption">{section.caption}</div>}</div>
        : <div className="bd-placeholder"><Image size={24}/><span>图片区域</span></div>
    case 'code':
      return (
        <div className="bd-code-wrap">
          <div className="bd-code-bar"><span className="bd-code-lang">{section.language||'Code'}</span></div>
          <pre className="bd-code-pre"><code>{section.snippet}</code></pre>
          {section.caption && <div className="bd-caption">{section.caption}</div>}
        </div>
      )
    default:
      return null
  }
}

export default function TechBlockDetail({ block, onClose, openedFromFeatured, onBackToFeatured }) {
  const contentRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState('')

  // 提取 h2/h3 生成索引
  const headings = (block?.detailSections || [])
    .filter(s => s.type === 'h2' || s.type === 'h3')
    .map((s, i) => ({ id: `s-${i}`, text: s.text, level: s.type }))

  // Scroll spy
  useEffect(() => {
    const el = contentRef.current
    if (!el || headings.length === 0) return
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { setActiveIdx(e.target.id); break }
      }
    }, { rootMargin: '-20% 0px -70% 0px' })
    headings.forEach(h => {
      const target = el.querySelector('#' + h.id)
      if (target) obs.observe(target)
    })
    return () => obs.disconnect()
  }, [headings])

  if (!block) return null

  return (
    <motion.div className="bd-overlay"
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}
      onClick={onClose}>
      <motion.div className="bd-panel"
        initial={{y:60,opacity:0}} animate={{y:0,opacity:1}} exit={{y:60,opacity:0}}
        transition={{duration:0.45,ease:[0.16,1,0.3,1]}}
        onClick={e=>e.stopPropagation()}>

        {/* Top bar */}
        <div className="bd-topbar">
          <div className="bd-topbar-left">
            {openedFromFeatured && (
              <button className="bd-back-btn" onClick={() => { onClose(); setTimeout(onBackToFeatured, 300); }}>
                <ArrowUp size={14}/><span>返回精选项目</span>
              </button>
            )}
          </div>
          <button className="bd-close" onClick={onClose}><X size={20}/></button>
        </div>

        <div className="bd-layout">
          {/* Left sidebar */}
          {headings.length > 0 && (
            <nav className="bd-sidebar">
              <p className="bd-sidebar-label">目录</p>
              {headings.map(h => (
                <button key={h.id}
                  className={`bd-sidebar-link ${h.level} ${activeIdx === h.id ? 'active' : ''}`}
                  onClick={() => {
                    contentRef.current?.querySelector('#' + h.id)?.scrollIntoView({behavior:'smooth',block:'start'})
                  }}>
                  {h.text}
                </button>
              ))}
            </nav>
          )}

          {/* Right content */}
          <div className="bd-content" ref={contentRef}>
            <div className="bd-meta">
              <span className="bd-meta-year">{block.year}</span>
              <span className="bd-meta-type">{block.mediaType}</span>
            </div>
            <h1 className="bd-title">{block.title}</h1>
            <p className="bd-desc">{block.description}</p>

            <div className="bd-tags">
              {block.tags.map(t=><span key={t} className="bd-tag">{t}</span>)}
            </div>

            {block.detailSections.map((s, i) => <SectionBlock key={i} section={s} index={i}/>)}
          </div>
        </div>
      </motion.div>

      <style>{`
        .bd-overlay {
          position:fixed;inset:0;z-index:3000;
          background:rgba(0,0,0,0.9);backdrop-filter:blur(16px);
          display:flex;align-items:flex-start;justify-content:center;
          padding:var(--space-xl);overflow-y:auto;
        }
        .bd-panel {
          width:100%;max-width:1200px;
          background:var(--bg-secondary);
          border:1px solid var(--border-default);border-radius:16px;
          overflow:hidden;margin:auto;
        }
        .bd-topbar {
          display:flex;align-items:center;justify-content:space-between;
          padding:var(--space-md) var(--space-xl);
          border-bottom:1px solid var(--border-default);
        }
        .bd-topbar-left { display:flex;align-items:center;gap:var(--space-md); }
        .bd-back-btn {
          display:inline-flex;align-items:center;gap:6px;
          padding:6px 14px;border:1px solid var(--border-default);border-radius:100px;
          font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary);transition:all .2s;
        }
        .bd-back-btn:hover { color:var(--text-primary);border-color:var(--text-muted); }
        .bd-back-btn svg { flex-shrink:0; }
        .bd-close {
          width:36px;height:36px;display:flex;align-items:center;justify-content:center;
          border-radius:50%;border:1px solid var(--border-default);
          color:var(--text-secondary);transition:all .2s;
        }
        .bd-close:hover { color:#fff;border-color:var(--text-muted);background:rgba(255,255,255,.05); }

        .bd-layout { display:grid;grid-template-columns:200px 1fr;min-height:0; }

        /* Sidebar */
        .bd-sidebar {
          position:sticky;top:0;
          padding:var(--space-xl);border-right:1px solid var(--border-default);
          max-height:calc(100vh - 80px);overflow-y:auto;align-self:start;
        }
        .bd-sidebar-label {
          font-family:var(--font-mono);font-size:11px;text-transform:uppercase;
          letter-spacing:.1em;color:var(--text-muted);margin-bottom:var(--space-lg);
        }
        .bd-sidebar-link {
          display:block;font-size:13px;color:var(--text-tertiary);
          padding:6px 0;transition:color .2s;text-decoration:none;
          line-height:1.5;border-left:1px solid transparent;padding-left:0;
          text-align:left;width:100%;background:none;border-top:none;border-right:none;border-bottom:none;
          cursor:pointer;font-family:var(--font-sans);
          border-radius:0;
        }
        .bd-sidebar-link.h3 { padding-left:12px;font-size:12px; }
        .bd-sidebar-link:hover { color:var(--text-primary); }
        .bd-sidebar-link.active { color:var(--text-primary); }
        .bd-sidebar-link.active.h3 { border-left-color:var(--text-muted); }

        /* Content */
        .bd-content {
          padding:var(--space-2xl);
          max-height:calc(100vh - 80px);overflow-y:auto;
        }
        .bd-meta {
          display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-sm);
        }
        .bd-meta-year {
          font-family:var(--font-mono);font-size:12px;color:var(--text-tertiary);
        }
        .bd-meta-type {
          font-family:var(--font-mono);font-size:11px;text-transform:uppercase;
          color:var(--text-muted);padding:2px 8px;border:1px solid var(--border-default);border-radius:4px;
        }
        .bd-title {
          font-size:28px;font-weight:400;letter-spacing:-.02em;color:#fff;margin-bottom:var(--space-md);
        }
        .bd-desc {
          font-size:14px;line-height:1.7;color:var(--text-secondary);margin-bottom:var(--space-lg);
        }
        .bd-tags {
          display:flex;flex-wrap:wrap;gap:6px;margin-bottom:var(--space-2xl);
          padding-bottom:var(--space-2xl);border-bottom:1px solid var(--border-default);
        }
        .bd-tag {
          font-family:var(--font-mono);font-size:10px;
          padding:3px 8px;background:var(--bg-primary);border-radius:4px;color:var(--text-muted);
        }

        /* Headings */
        .bd-h2 {
          font-size:20px;font-weight:500;color:#fff;
          margin:var(--space-2xl) 0 var(--space-md);
          padding-top:var(--space-md);
        }
        .bd-h2:first-child { margin-top:0; }
        .bd-h3 {
          font-size:15px;font-weight:500;color:var(--text-primary);
          margin:var(--space-lg) 0 var(--space-sm);
        }
        .bd-text {
          font-size:14px;line-height:1.75;color:var(--text-secondary);margin-bottom:var(--space-md);
          white-space:pre-line;
        }

        /* Media */
        .bd-media { margin:var(--space-lg) 0; }
        .bd-video,.bd-img {
          width:100%;max-height:60vh;object-fit:contain;
          background:var(--bg-primary);border-radius:8px;
        }
        .bd-placeholder {
          aspect-ratio:16/9;display:flex;flex-direction:column;
          align-items:center;justify-content:center;gap:var(--space-sm);
          background:var(--bg-primary);border-radius:8px;
          color:var(--text-muted);font-size:14px;margin:var(--space-lg) 0;
        }
        .bd-caption {
          font-family:var(--font-mono);font-size:12px;color:var(--text-muted);
          text-align:center;margin-top:var(--space-sm);
        }
        .bd-code-wrap { margin:var(--space-lg) 0;background:#0a0a0a;border-radius:8px;overflow:hidden; }
        .bd-code-bar { padding:10px 16px;border-bottom:1px solid #1a1a1a; }
        .bd-code-lang { font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary); }
        .bd-code-pre { padding:var(--space-lg);overflow-x:auto;font-family:var(--font-mono);font-size:12px;line-height:1.6;color:#c0c0c0;max-height:400px;overflow-y:auto; }
        .bd-code-pre code { white-space:pre; }

        /* Compare */
        .bd-compare {
          position:relative;aspect-ratio:16/9;overflow:hidden;cursor:ew-resize;user-select:none;
          margin:var(--space-lg) 0;border-radius:8px;
        }
        .bd-c-bg,.bd-c-fg { position:absolute;inset:0;background-size:cover;background-position:center; }
        .bd-c-line { position:absolute;top:0;bottom:0;width:2px;background:#fff;transform:translateX(-50%);z-index:2; }
        .bd-c-knob { position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:36px;height:36px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#111;box-shadow:0 2px 8px rgba(0,0,0,.3); }
        .bd-c-labels { position:absolute;bottom:10px;left:0;right:0;display:flex;justify-content:space-between;padding:0 12px;z-index:3;pointer-events:none; }
        .bd-c-labels span { font-size:11px;color:rgba(255,255,255,.6);background:rgba(0,0,0,.4);padding:3px 10px;border-radius:100px; }

        @media (max-width:768px) {
          .bd-layout { grid-template-columns:1fr; }
          .bd-sidebar { display:none; }
        }
      `}</style>
    </motion.div>
  )
}
