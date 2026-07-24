import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, ArrowDownRight, X } from 'lucide-react'
import { featuredProjects, techBlocks } from '../data'
import TechBlockDetail from './TechBlockDetail'

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

// 精选项目卡片（错落布局的一项）
function FeaturedCard({ project, index, onClick }) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      className={`featured-card ${isEven ? 'left-media' : 'right-media'}`}
      variants={fadeInUp}
      custom={index * 0.12}
    >
      {/* Media Side */}
      <div className="featured-media" onClick={() => onClick(project)}>
        {project.featuredImage ? (
          <img src={project.featuredImage} alt={project.title} className="featured-img" />
        ) : (
          <div className="featured-placeholder">
            {project.videoSrc ? (
              <video src={project.videoSrc} muted loop playsInline className="featured-video" />
            ) : (
              <Play size={32} />
            )}
          </div>
        )}
        <div className="featured-media-overlay">
          <div className="featured-view-btn">
            <span>查看详情</span>
            <ArrowDownRight size={18} />
          </div>
        </div>
      </div>

      {/* Text Side */}
      <div className="featured-info" onClick={() => onClick(project)}>
        <p className="featured-number">{String(index + 1).padStart(2, '0')}</p>
        <h3 className="featured-title">{project.title}</h3>
        <p className="featured-subtitle">{project.subtitle}</p>
        <p className="featured-desc">{project.description}</p>
        <div className="featured-keywords">
          {project.techKeywords.map((kw) => (
            <span key={kw} className="featured-keyword">{kw}</span>
          ))}
        </div>
        <div className="featured-tech-count">
          {project.techPoints.length} 个技术点
        </div>
      </div>
    </motion.div>
  )
}

// 精选项目详情弹窗
function FeaturedDetail({ project, onClose, onOpenTechBlock, setLastFeaturedId }) {
  const handleTechPointClick = (blockId) => {
    const block = techBlocks.find(b => b.id === blockId)
    if (block) {
      setLastFeaturedId(project.id)
      onClose()
      setTimeout(() => onOpenTechBlock(block), 300)
    }
  }

  if (!project) return null

  const relatedBlocks = techBlocks.filter(b => b.featuredId === project.id)

  return (
    <motion.div
      className="detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="detail-panel"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="detail-header">
          <button className="detail-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Video / Image */}
        <div className="detail-media">
          {project.videoSrc ? (
            <video src={project.videoSrc} controls autoPlay muted loop playsInline className="detail-video" />
          ) : project.featuredImage ? (
            <img src={project.featuredImage} alt={project.title} className="detail-image" />
          ) : (
            <div className="detail-media-placeholder">
              <span>Drop your video or image here</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="detail-body">
          <h2 className="detail-title">{project.title}</h2>
          <p className="detail-subtitle">{project.subtitle}</p>
          <p className="detail-desc">{project.description}</p>

          {/* Tech Points */}
          <div className="detail-tech-section">
            <h3 className="detail-tech-heading">技术点</h3>
            <div className="detail-tech-list">
              {project.techPoints.map((tp) => {
                const block = relatedBlocks.find(b => b.id === tp.blockId)
                return (
                  <button
                    key={tp.id}
                    className="detail-tech-item"
                    onClick={() => handleTechPointClick(tp.blockId)}
                  >
                    <div className="detail-tech-item-header">
                      <span className="detail-tech-title">{tp.title}</span>
                      <ArrowDownRight size={16} />
                    </div>
                    <p className="detail-tech-summary">{tp.summary}</p>
                    <span className="detail-tech-jump">点击查看详情 → 跳转至下方项目块</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .detail-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: var(--space-3xl) var(--space-xl);
          overflow-y: auto;
        }

        .detail-panel {
          width: 100%;
          max-width: 1000px;
          background: var(--bg-primary);
          border: 1px solid var(--border-default);
          border-radius: 16px;
          overflow: hidden;
          margin: auto;
        }

        .detail-header {
          display: flex;
          justify-content: flex-end;
          padding: var(--space-md) var(--space-xl);
        }

        .detail-close {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid var(--border-default);
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .detail-close:hover {
          color: var(--text-primary);
          border-color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
        }

        .detail-media {
          width: 100%;
          aspect-ratio: 16/9;
          background: var(--bg-primary);
          overflow: hidden;
        }

        .detail-video,
        .detail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-media-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 14px;
        }

        .detail-body {
          padding: var(--space-2xl);
        }

        .detail-title {
          font-size: 28px;
          font-weight: 400;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .detail-subtitle {
          font-size: 14px;
          color: var(--text-tertiary);
          margin-bottom: var(--space-lg);
        }

        .detail-desc {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: var(--space-2xl);
        }

        .detail-tech-heading {
          font-family: var(--font-mono);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-tertiary);
          margin-bottom: var(--space-lg);
        }

        .detail-tech-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .detail-tech-item {
          text-align: left;
          padding: var(--space-lg);
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          transition: all 0.3s;
        }

        .detail-tech-item:hover {
          border-color: var(--text-muted);
          background: var(--bg-card-hover);
          transform: translateX(4px);
        }

        .detail-tech-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-sm);
        }

        .detail-tech-title {
          font-size: 15px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .detail-tech-item-header svg {
          color: var(--text-tertiary);
          flex-shrink: 0;
        }

        .detail-tech-summary {
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: var(--space-sm);
        }

        .detail-tech-jump {
          font-size: 11px;
          color: var(--text-muted);
        }
      `}</style>
    </motion.div>
  )
}

export default function FeaturedProjects() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [openTechBlock, setOpenTechBlock] = useState(null)
  const [lastFeaturedId, setLastFeaturedId] = useState(null)

  return (
    <>
      <section className="featured-section" id="featured">
        <div className="container">
          {/* Section Header */}
          <motion.div
            className="featured-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <p className="section-label">Featured Works</p>
            <h2 className="section-title">精选项目</h2>
            <p className="featured-header-desc">
              每个项目是一段完整的探索，点击可查看涉及的所有技术点细节。
            </p>
          </motion.div>

          {/* Project Cards - Staggered Layout */}
          <motion.div
            className="featured-list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {featuredProjects.map((project, index) => (
              <FeaturedCard
                key={project.id}
                project={project}
                index={index}
                onClick={setSelectedProject}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedProject && (
        <FeaturedDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenTechBlock={setOpenTechBlock}
          setLastFeaturedId={setLastFeaturedId}
        />
      )}

      {/* Tech Block Detail — opened from featured */}
      {openTechBlock && (
        <TechBlockDetail
          block={openTechBlock}
          onClose={() => setOpenTechBlock(null)}
          openedFromFeatured={true}
          onBackToFeatured={() => {
            const proj = featuredProjects.find(p => p.id === lastFeaturedId)
            if (proj) setSelectedProject(proj)
          }}
        />
      )}

      <style>{`
        .featured-section {
          padding: var(--space-5xl) 0;
          background: var(--bg-primary);
        }

        .featured-header {
          margin-bottom: var(--space-4xl);
        }

        .featured-header-desc {
          font-size: 14px;
          color: var(--text-tertiary);
          max-width: 500px;
        }

        .featured-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-5xl);
        }

        /* Featured Card */
        .featured-card {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: var(--space-4xl);
          align-items: center;
          cursor: pointer;
        }

        .featured-card.right-media {
          grid-template-columns: 1fr 1.1fr;
        }

        .featured-card.right-media .featured-media {
          order: 2;
        }

        .featured-card.right-media .featured-info {
          order: 1;
        }

        /* Media */
        .featured-media {
          position: relative;
          aspect-ratio: 16/10;
          border-radius: 12px;
          overflow: hidden;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
        }

        .featured-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s var(--ease-out);
        }

        .featured-card:hover .featured-img {
          transform: scale(1.03);
        }

        .featured-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
        }

        .featured-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.6;
        }

        .featured-media-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s var(--ease-out);
        }

        .featured-card:hover .featured-media-overlay {
          opacity: 1;
        }

        .featured-view-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 100px;
          color: white;
          font-size: 14px;
        }

        /* Info */
        .featured-info {
          padding: var(--space-lg) 0;
        }

        .featured-number {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-tertiary);
          margin-bottom: var(--space-sm);
        }

        .featured-title {
          font-size: 32px;
          font-weight: 400;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .featured-subtitle {
          font-size: 14px;
          color: var(--text-tertiary);
          margin-bottom: var(--space-lg);
        }

        .featured-desc {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: var(--space-lg);
        }

        .featured-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
        }

        .featured-keyword {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 4px 10px;
          border: 1px solid var(--border-default);
          border-radius: 4px;
          color: var(--text-tertiary);
        }

        .featured-tech-count {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .featured-card,
          .featured-card.right-media {
            grid-template-columns: 1fr;
            gap: var(--space-xl);
          }

          .featured-card.right-media .featured-media {
            order: 1;
          }

          .featured-card.right-media .featured-info {
            order: 2;
          }
        }
      `}</style>
    </>
  )
}
