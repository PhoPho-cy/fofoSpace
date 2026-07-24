import { motion } from 'framer-motion'
import { Mail, ArrowRight } from 'lucide-react'
import { footerData } from '../data'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

export default function Footer() {
  return (
    <footer className="footer-section" id="contact">
      <div className="container footer-container">
        <motion.div
          className="footer-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Left - Big Text */}
          <motion.div className="footer-text" variants={fadeInUp}>
            <p className="section-label">Contact</p>
            <h2 className="footer-title">
              {footerData.title.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h2>
            <p className="footer-subtitle">{footerData.subtitle}</p>

            {/* CTA */}
            <a href={`mailto:${footerData.email}`} className="footer-cta">
              <span>Get in Touch</span>
              <ArrowRight size={18} />
            </a>
          </motion.div>

          {/* Right - Links */}
          <motion.div className="footer-right" variants={fadeInUp} custom={0.15}>
            {/* Social Links */}
            <div className="footer-social">
              <p className="footer-social-label">Social</p>
              <div className="footer-social-links">
                {footerData.social.map((s) => (
                  <a key={s.label} href={s.href} className="footer-social-link" target="_blank" rel="noopener noreferrer">
                    {s.label}
                    <ArrowRight size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="footer-contact">
              <a href={`mailto:${footerData.email}`} className="footer-email">
                <Mail size={16} />
                <span>{footerData.email}</span>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="footer-bottom"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          custom={0.3}
        >
          <span className="footer-copy">&copy; {new Date().getFullYear()} Technical Artist. All rights reserved.</span>
        </motion.div>
      </div>

      <style>{`
        .footer-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: var(--bg-primary);
          border-top: 1px solid var(--border-default);
        }

        .footer-container {
          width: 100%;
          padding-top: var(--space-5xl);
          padding-bottom: var(--space-2xl);
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: var(--space-5xl);
          align-items: start;
          margin-bottom: var(--space-5xl);
        }

        .footer-title {
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: var(--space-lg);
        }

        .footer-subtitle {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: var(--space-2xl);
          max-width: 400px;
        }

        .footer-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 28px;
          border: 1px solid var(--border-default);
          border-radius: 100px;
          font-size: 15px;
          font-weight: 500;
          color: var(--text-primary);
          transition: all 0.3s var(--ease-out);
        }

        .footer-cta:hover {
          border-color: var(--text-secondary);
          background: rgba(255,255,255,0.05);
          gap: 16px;
        }

        .footer-cta svg {
          transition: transform 0.3s var(--ease-out);
        }

        .footer-cta:hover svg {
          transform: translateX(4px);
        }

        .footer-right {
          padding-top: var(--space-4xl);
        }

        .footer-social-label {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-tertiary);
          margin-bottom: var(--space-md);
        }

        .footer-social-links {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          margin-bottom: var(--space-3xl);
        }

        .footer-social-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid var(--border-default);
          font-size: 15px;
          color: var(--text-secondary);
          transition: all 0.3s;
        }

        .footer-social-link:hover {
          color: var(--text-primary);
          border-bottom-color: var(--text-tertiary);
        }

        .footer-social-link svg {
          opacity: 0;
          transform: translateX(-8px);
          transition: all 0.3s var(--ease-out);
        }

        .footer-social-link:hover svg {
          opacity: 1;
          transform: translateX(0);
        }

        .footer-email {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--text-secondary);
          transition: color 0.2s;
        }

        .footer-email:hover {
          color: var(--text-primary);
        }

        .footer-bottom {
          padding-top: var(--space-lg);
          border-top: 1px solid var(--border-default);
        }

        .footer-copy {
          font-size: 12px;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: var(--space-2xl);
          }
          .footer-right {
            padding-top: 0;
          }
          .footer-title {
            font-size: clamp(32px, 10vw, 48px);
          }
        }
      `}</style>
    </footer>
  )
}
