import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aboutData } from '../data'
import { Mail, MapPin } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

// 筛选出不含"软件"的 tab 用于 tab 切换
const tabs = aboutData.experienceSections.filter(s => !s.title.includes('软件'))

export default function About() {
  const [activeTab, setActiveTab] = useState(0)

  // 软件数据
  const software = aboutData.software || { left: [], right: [] }

  return (
    <section className="about-section" id="about">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="about-grid"
        >
          {/* Left: Avatar & Quick Info */}
          <motion.div className="about-left" variants={fadeInUp} custom={0}>
            <div className="about-avatar-wrapper">
              {aboutData.avatar ? (
                <img src={aboutData.avatar} alt={aboutData.name} className="about-avatar" />
              ) : (
                <div className="about-avatar-placeholder">
                  <span>FP</span>
                </div>
              )}
            </div>

            <h2 className="about-name">{aboutData.name}</h2>
            <p className="about-role">{aboutData.title}</p>

            <div className="about-contact-links">
              <a href={`mailto:${aboutData.contact.email}`} className="about-contact-item">
                <Mail size={15} />
                <span>{aboutData.contact.email}</span>
              </a>
              <div className="about-contact-item">
                <MapPin size={15} />
                <span>{aboutData.contact.location}</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Bio + Tabs + Software */}
          <motion.div className="about-right" variants={fadeInUp} custom={0.1}>
            <p className="section-label">About Me</p>
            <p className="about-bio">{aboutData.bio}</p>

            {/* Experience Tabs */}
            <div className="experience-section">
              <div className="experience-tabs">
                {tabs.map((section, i) => (
                  <button
                    key={i}
                    className={`experience-tab ${activeTab === i ? 'active' : ''}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {section.title}
                    {activeTab === i && (
                      <motion.div
                        className="experience-tab-indicator"
                        layoutId="tab-indicator"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  className="experience-content"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {tabs[activeTab].items.map((item, j) => (
                    <div key={j} className="experience-item">
                      <div className="experience-item-header">
                        <span className="experience-role">{item.role}</span>
                        <span className="experience-period">{item.period}</span>
                      </div>
                      {item.company && (
                        <span className="experience-company">{item.company}</span>
                      )}
                      <p className="experience-desc">{item.description}</p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Software — always visible */}
            <div className="software-section">
              <p className="software-label">擅长软件</p>
              <div className="software-grid">
                {/* Left: Main Software */}
                <div className="software-col">
                  <p className="software-col-title">软件</p>
                  <div className="software-list">
                    {software.left.map((s, i) => (
                      <div key={i} className="software-item">
                        <span className="software-name">{s.name}</span>
                        {s.years && <span className="software-years">{s.years}</span>}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Right: Modules */}
                <div className="software-col">
                  <p className="software-col-title">擅长模块</p>
                  <div className="software-modules">
                    {software.right.map((s, i) => (
                      <span key={i} className="software-module-tag">{s.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        .about-section {
          padding: var(--space-5xl) 0;
          background: var(--bg-primary);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: var(--space-5xl);
          align-items: start;
        }

        /* Left Column */
        .about-left {
          position: sticky;
          top: calc(var(--nav-height) + var(--space-2xl));
        }

        .about-avatar-wrapper {
          width: 240px; height: 240px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: var(--space-xl);
          border: 1px solid var(--border-default);
        }

        .about-avatar {
          width: 100%; height: 100%; object-fit: cover;
        }

        .about-avatar-placeholder {
          width: 100%; height: 100%;
          background: var(--bg-card);
          display: flex; align-items: center; justify-content: center;
          font-size: 56px; font-weight: 300;
          color: var(--text-muted); letter-spacing: -.02em;
        }

        .about-name {
          font-size: 28px; font-weight: 400;
          letter-spacing: -.02em; color: var(--text-primary); margin-bottom: 4px;
        }

        .about-role {
          font-size: 14px; color: var(--text-tertiary); margin-bottom: var(--space-lg);
        }

        .about-contact-links {
          display: flex; flex-direction: column; gap: var(--space-sm);
        }

        .about-contact-item {
          display: flex; align-items: center; gap: var(--space-sm);
          font-size: 13px; color: var(--text-secondary); transition: color .2s;
        }

        a.about-contact-item:hover { color: var(--text-primary); }

        /* Right Column */
        .about-bio {
          font-size: 15px; line-height: 1.75;
          color: var(--text-secondary); margin-bottom: var(--space-lg); max-width: 600px;
        }

        /* Experience Tabs */
        .experience-section { margin-bottom: var(--space-2xl); }

        .experience-tabs {
          display: flex; gap: 0; margin-bottom: var(--space-xl);
          border-bottom: 1px solid var(--border-default);
        }

        .experience-tab {
          position: relative; padding: 12px 20px;
          font-size: 13px; font-weight: 400;
          color: var(--text-tertiary); transition: color .25s;
        }

        .experience-tab:hover { color: var(--text-secondary); }
        .experience-tab.active { color: var(--text-primary); }

        .experience-tab-indicator {
          position: absolute; bottom: -1px; left: 0; right: 0;
          height: 1px; background: var(--text-primary);
        }

        .experience-content {
          display: flex; flex-direction: column; gap: var(--space-lg);
        }

        .experience-item {
          padding-bottom: var(--space-lg); border-bottom: 1px solid var(--border-subtle);
        }

        .experience-item:last-child { border-bottom: none; padding-bottom: 0; }

        .experience-item-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;
        }

        .experience-role { font-size: 14px; font-weight: 500; color: var(--text-primary); }
        .experience-period { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
        .experience-company { font-size: 13px; color: var(--text-tertiary); }
        .experience-desc {
          font-size: 13px; line-height: 1.65; color: var(--text-secondary); margin-top: var(--space-sm);
        }

        /* Software — always visible */
        .software-section {
          border-top: 1px solid var(--border-default);
          padding-top: var(--space-2xl);
        }

        .software-label {
          font-family: var(--font-mono);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-tertiary);
          margin-bottom: var(--space-lg);
        }

        .software-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-2xl);
        }

        .software-col-title {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: var(--space-md);
        }

        .software-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .software-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--border-subtle);
        }

        .software-name {
          font-size: 14px;
          color: var(--text-primary);
        }

        .software-years {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-muted);
        }

        .software-modules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .software-module-tag {
          font-family: var(--font-mono);
          font-size: 12px;
          padding: 8px 16px;
          border: 1px solid var(--border-default);
          border-radius: 8px;
          color: var(--text-secondary);
          transition: all .2s;
        }

        .software-module-tag:hover {
          border-color: var(--text-muted);
          color: var(--text-primary);
          background: rgba(255,255,255,.02);
        }

        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr; gap: var(--space-2xl); }
          .about-left { position: static; text-align: center; }
          .about-avatar-wrapper { margin: 0 auto var(--space-xl); }
          .about-contact-links { align-items: center; }
          .experience-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .experience-tab { white-space: nowrap; flex-shrink: 0; }
          .software-grid { grid-template-columns: 1fr; gap: var(--space-xl); }
        }
      `}</style>
    </section>
  )
}
