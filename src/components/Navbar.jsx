import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navLinks } from '../data'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="navbar"
      style={{
        '--nav-bg': scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
        '--nav-border': scrolled ? 'rgba(255,255,255,0.06)' : 'transparent',
      }}
    >
      <div className="container navbar-inner">
        {/* Logo */}
        <a href="#" className="navbar-logo">
          <span className="logo-text">FOFO</span>
          <span className="logo-dot">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="navbar-links">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <a href="#contact" className="nav-cta">
            <span className="nav-cta-text">Contact</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button className="navbar-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="navbar-mobile-menu"
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            ))}
            <a href="#contact" className="mobile-nav-cta" onClick={() => setMobileOpen(false)}>
              Contact
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: var(--nav-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--nav-border);
          transition: background 0.3s, border-color 0.3s;
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--nav-height);
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 2px;
          z-index: 100;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .logo-dot {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-tertiary);
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: var(--space-xl);
        }

        .nav-link {
          font-size: 14px;
          font-weight: 400;
          color: var(--text-secondary);
          transition: color 0.2s;
          position: relative;
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 100%;
          height: 1px;
          background: var(--text-primary);
          transition: right 0.3s var(--ease-out);
        }

        .nav-link:hover::after {
          right: 0;
        }

        .nav-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border: 1px solid var(--border-default);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          transition: all 0.3s var(--ease-out);
        }

        .nav-cta:hover {
          border-color: var(--text-secondary);
          background: rgba(255,255,255,0.05);
        }

        .nav-cta svg {
          transition: transform 0.3s var(--ease-out);
        }

        .nav-cta:hover svg {
          transform: translateX(3px);
        }

        .navbar-mobile-btn {
          display: none;
          z-index: 100;
          padding: 8px;
          color: var(--text-primary);
        }

        .navbar-mobile-menu {
          position: fixed;
          top: var(--nav-height);
          left: 0;
          right: 0;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-default);
          padding: var(--space-lg) var(--space-xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .mobile-nav-link {
          font-size: 18px;
          color: var(--text-secondary);
          padding: 12px 0;
          border-bottom: 1px solid var(--border-subtle);
          transition: color 0.2s;
        }

        .mobile-nav-link:hover {
          color: var(--text-primary);
        }

        .mobile-nav-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          border: 1px solid var(--border-default);
          border-radius: 100px;
          font-size: 15px;
          font-weight: 500;
          color: var(--text-primary);
          margin-top: var(--space-sm);
          transition: all 0.3s;
        }

        .mobile-nav-cta:hover {
          background: rgba(255,255,255,0.05);
        }

        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .navbar-mobile-btn { display: flex; align-items: center; justify-content: center; }
        }
      `}</style>
    </motion.header>
  )
}
