import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { heroData } from '../data'

// ========== 眼动颜文字 ==========
function EyeTrackingEmoji() {
  const containerRef = useRef(null)
  const [eyeOffset, setEyeOffset] = useState({ leftX: 0, leftY: 0, rightX: 0, rightY: 0 })

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    // 眼睛相对于光标的偏移，限制在 ±4px
    const maxMove = 4
    const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 80)) * maxMove
    const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 80)) * maxMove
    setEyeOffset({ leftX: dx, leftY: dy, rightX: dx, rightY: dy })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <motion.div
      ref={containerRef}
      className="hero-emoji"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="emoji-part">{heroData.emoji.left}</span>
      <span
        className="emoji-eye"
        style={{ transform: `translate(${eyeOffset.leftX}px, ${eyeOffset.leftY}px)` }}
      >
        {heroData.emoji.leftEye}
      </span>
      <span className="emoji-part">{heroData.emoji.mouth}</span>
      <span
        className="emoji-eye"
        style={{ transform: `translate(${eyeOffset.rightX}px, ${eyeOffset.rightY}px)` }}
      >
        {heroData.emoji.rightEye}
      </span>
      <span className="emoji-part">{heroData.emoji.right}</span>
    </motion.div>
  )
}

// ========== 跳动字母 ==========
function BouncingText({ text, delay = 0 }) {
  return (
    <span className="bouncing-text">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className={`bouncing-char ${char === ' ' ? 'space' : ''}`}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: delay + i * 0.04,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          // 持续的微浮动
          whileHover={{
            y: -8,
            transition: { type: 'spring', stiffness: 400, damping: 10 },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

export default function Hero() {
  const videoRef = useRef(null)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => setVideoError(true))
    }
  }, [])

  return (
    <section className="hero-section" id="home">
      {/* Background */}
      <div className="hero-bg">
        {!videoError && (
          <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline onError={() => setVideoError(true)}>
            {heroData.videoSrc && <source src={heroData.videoSrc} type="video/mp4" />}
          </video>
        )}
        <div className="hero-bg-overlay" />
        <div className="hero-bg-grain" />
      </div>

      {/* Content */}
      <div className="container hero-content">
        {/* 颜文字 */}
        <EyeTrackingEmoji />

        {/* 标题 */}
        <div className="hero-text">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hero-welcome"
          >
            {heroData.subtitle}
          </motion.p>

          {/* 跳动标题 */}
          <h1 className="hero-title">
            <div className="hero-title-line">
              <BouncingText text={heroData.greeting} delay={0.4} />
            </div>
            <div className="hero-title-prefix">
              <BouncingText text={heroData.namePrefix} delay={0.7} />
            </div>
            <div className="hero-title-name">
              <BouncingText text={heroData.nameHighlight} delay={1.0} />
            </div>
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="hero-desc"
          >
            {heroData.label}
            <span className="hero-desc-dot"> · </span>
            {heroData.desc}
          </motion.p>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 700px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.5;
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% 40%,
            rgba(30, 30, 30, 0.3) 0%,
            rgba(10, 10, 10, 0.7) 60%,
            rgba(10, 10, 10, 0.95) 100%
          );
        }

        .hero-bg-grain {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 256px 256px;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        /* ===== 颜文字 ===== */
        .hero-emoji {
          display: inline-flex;
          align-items: center;
          gap: 0;
          font-size: 52px;
          font-weight: 300;
          color: var(--text-primary);
          margin-bottom: var(--space-2xl);
          line-height: 1;
          user-select: none;
          cursor: default;
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.08));
        }

        .emoji-part {
          display: inline-block;
          transition: none;
        }

        .emoji-eye {
          display: inline-block;
          transition: transform 0.08s ease-out;
          will-change: transform;
        }

        /* ===== Title ===== */
        .hero-text {
          max-width: 1000px;
        }

        .hero-welcome {
          font-size: 16px;
          font-weight: 400;
          color: var(--text-tertiary);
          text-transform: lowercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-md);
        }

        .hero-title {
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: -0.03em;
          margin-bottom: var(--space-lg);
        }

        .hero-title-line {
          display: flex;
          flex-wrap: wrap;
          font-size: clamp(40px, 6vw, 80px);
          color: var(--text-primary);
          font-weight: 300;
        }

        .hero-title-prefix {
          display: flex;
          flex-wrap: wrap;
          font-size: clamp(36px, 5vw, 64px);
          color: var(--text-primary);
          font-weight: 300;
        }

        .hero-title-name {
          font-size: clamp(90px, 16vw, 200px);
          color: var(--text-primary);
          font-weight: 600;
          line-height: 0.9;
          margin-top: -0.02em;
        }

        /* Bouncing chars */
        .bouncing-text {
          display: inline-flex;
          flex-wrap: wrap;
        }

        .bouncing-char {
          display: inline-block;
          cursor: default;
          transition: color 0.2s;
        }

        .bouncing-char:hover {
          color: #fff;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }

        .bouncing-char.space {
          width: 0.3em;
        }

        /* Description */
        .hero-desc {
          font-size: clamp(14px, 1.5vw, 16px);
          font-weight: 400;
          line-height: 1.6;
          color: var(--text-secondary);
          max-width: 520px;
        }

        .hero-desc-dot {
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .hero-emoji {
            font-size: 36px;
          }
          .hero-title-line {
            font-size: clamp(36px, 10vw, 60px);
          }
        }
      `}</style>
    </section>
  )
}
