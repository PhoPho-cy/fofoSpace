import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Code, Image, GitCompare, FileText } from 'lucide-react'
import { techBlocks, tagCategories } from '../data'
import TechBlockDetail from './TechBlockDetail'

const mediaIcons = {
  video: <Play size={14} />, gif: <Play size={14} />,
  comparison: <GitCompare size={14} />, image: <Image size={14} />,
  code: <Code size={14} />, text: <FileText size={14} />,
}
const mediaLabels = {
  video: '视频', gif: '动图', comparison: '对比',
  image: '图片', code: '代码', text: '文字',
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: .6, ease: [.16, 1, .3, 1], delay: d } }),
}

function TechBlockCard({ block, index, onClick }) {
  return (
    <motion.div className="tbc-card" variants={fadeInUp} custom={index * .06} onClick={() => onClick(block)}>
      {/* Thumbnail */}
      <div className="tbc-thumb">
        {block.thumbnail
          ? <img src={block.thumbnail} alt="" className="tbc-thumb-img"/>
          : <div className="tbc-thumb-placeholder">{mediaIcons[block.mediaType]}</div>
        }
        <div className="tbc-thumb-overlay"><span>查看详情</span></div>
      </div>
      {/* Info */}
      <div className="tbc-info">
        <div className="tbc-meta">
          <span className="tbc-year">{block.year}</span>
          <span className="tbc-badge">{mediaIcons[block.mediaType]}<span>{mediaLabels[block.mediaType]}</span></span>
        </div>
        <h3 className="tbc-title">{block.title}</h3>
        <p className="tbc-desc">{block.description}</p>
        <div className="tbc-tags">{block.tags.map(t => <span key={t} className="tbc-tag">{t}</span>)}</div>
      </div>
    </motion.div>
  )
}

export default function TechBlocksSection() {
  const [activeTag, setActiveTag] = useState('all')
  const [openBlock, setOpenBlock] = useState(null)

  const filtered = activeTag === 'all' ? techBlocks : techBlocks.filter(b => b.tags.includes(activeTag))

  return (
    <>
      <section className="tech-blocks-section" id="tech-blocks">
        <div className="container">
          <motion.div className="tbc-header" initial="hidden" whileInView="visible" viewport={{once:true,margin:'-100px'}} variants={fadeInUp}>
            <p className="section-label">Technical Details</p>
            <h2 className="section-title">关于我的技术库</h2>
            <p className="tbc-header-desc">每个技术点的独立展示，含视频、动图、对比图、代码块或详文说明。</p>
          </motion.div>

          <motion.div className="tbc-filters" initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeInUp} custom={.1}>
            {tagCategories.map(c => (
              <button key={c.id} className={`tbc-filter ${activeTag===c.id?'active':''}`} onClick={()=>setActiveTag(c.id)}>
                {c.label}
              </button>
            ))}
          </motion.div>

          <motion.div className="tbc-grid"
            variants={{ visible: { transition: { staggerChildren: .06 } } }}
            initial="hidden" animate="visible">
            {filtered.map((b, i) => <TechBlockCard key={b.id} block={b} index={i} onClick={setOpenBlock}/>)}
          </motion.div>
          {filtered.length === 0 && <motion.div className="tbc-empty" initial={{opacity:0}} animate={{opacity:1}}><p>该分类下暂无技术点</p></motion.div>}
        </div>
      </section>

      {openBlock && <TechBlockDetail block={openBlock} onClose={() => setOpenBlock(null)} openedFromFeatured={false}/>}

      <style>{`
        .tech-blocks-section { padding: var(--space-5xl) 0; background: var(--bg-primary); }
        .tbc-header { margin-bottom: var(--space-2xl); }
        .tbc-header-desc { font-size: 14px; color: var(--text-tertiary); max-width: 500px; }
        .tbc-filters { display: flex; flex-wrap: wrap; gap: var(--space-sm); margin-bottom: var(--space-3xl); }
        .tbc-filter {
          font-family: var(--font-mono); font-size: 12px; padding: 8px 18px;
          border: 1px solid var(--border-default); border-radius: 100px;
          color: var(--text-tertiary); transition: all .3s;
        }
        .tbc-filter:hover { color: var(--text-primary); border-color: var(--text-muted); }
        .tbc-filter.active { color: var(--bg-primary); background: var(--text-primary); border-color: var(--text-primary); }
        .tbc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md); }
        .tbc-card {
          background: var(--bg-card); border: 1px solid var(--border-default);
          border-radius: 12px; overflow: hidden; cursor: pointer;
          transition: all .3s;
        }
        .tbc-card:hover { border-color: var(--border-default); transform: translateY(-4px); background: var(--bg-card-hover); }
        .tbc-thumb { position: relative; aspect-ratio: 16/10; background: var(--bg-primary); overflow: hidden; }
        .tbc-thumb-img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
        .tbc-card:hover .tbc-thumb-img { transform: scale(1.03); }
        .tbc-thumb-placeholder {
          width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
          color: var(--text-muted);
        }
        .tbc-thumb-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,.55);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity .4s;
        }
        .tbc-card:hover .tbc-thumb-overlay { opacity: 1; }
        .tbc-thumb-overlay span {
          font-size: 14px; font-weight: 500; color: #fff;
          padding: 10px 24px; border: 1px solid rgba(255,255,255,.3); border-radius: 100px;
        }
        .tbc-info { padding: var(--space-lg); }
        .tbc-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-sm); }
        .tbc-year { font-family: var(--font-mono); font-size: 12px; color: var(--text-tertiary); }
        .tbc-badge {
          display: flex; align-items: center; gap: 4px; font-family: var(--font-mono);
          font-size: 11px; color: var(--text-muted); padding: 3px 8px;
          border: 1px solid var(--border-default); border-radius: 100px;
        }
        .tbc-title { font-size: 16px; font-weight: 500; letter-spacing: -.01em; color: var(--text-primary); margin-bottom: var(--space-sm); }
        .tbc-desc { font-size: 13px; line-height: 1.6; color: var(--text-tertiary); margin-bottom: var(--space-md); }
        .tbc-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tbc-tag { font-family: var(--font-mono); font-size: 10px; padding: 3px 8px; background: var(--bg-primary); border-radius: 4px; color: var(--text-muted); }
        .tbc-empty { text-align: center; padding: var(--space-4xl); color: var(--text-muted); }
        @media (max-width: 768px) { .tbc-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}
