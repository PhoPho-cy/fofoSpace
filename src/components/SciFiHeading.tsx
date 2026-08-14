import { motion, useAnimationControls } from 'motion/react';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '../utils';

interface Props {
  children: ReactNode;
  className?: string;
  as?: any;
}

export default function SciFiHeading({ children, className, as: Component = 'h2' }: Props) {
  const controls = useAnimationControls();
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          controls.start("glitch");
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [hasAnimated, controls]);

  const handleMouseEnter = () => {
    controls.start("glitch");
  };

  const easeInOut: any = "easeInOut";
  const easeOut: any = "easeOut";

  const glitchVariants: any = {
    glitch: {
      x: [0, -2, 3, -1, 0],
      y: [0, 1, -1, 1, 0],
      opacity: [1, 0.9, 1, 0.9, 1],
      transition: { duration: 0.4, ease: easeInOut }
    }
  };

  const sweepVariants: any = {
    glitch: {
      backgroundPosition: ["200% 50%", "-100% 50%"],
      opacity: [0, 1, 0],
      transition: { duration: 0.6, ease: easeOut }
    }
  };

  const glitchLayer1: any = {
    glitch: {
      x: [0, -4, 4, -2, 0],
      opacity: [0, 1, 1, 0, 0],
      clipPath: [
        "inset(10% 0 80% 0)",
        "inset(40% 0 40% 0)",
        "inset(80% 0 10% 0)",
        "inset(0 100% 0 0)"
      ],
      transition: { duration: 0.3 }
    }
  };

  const glitchLayer2: any = {
    glitch: {
      x: [0, 4, -4, 2, 0],
      opacity: [0, 1, 1, 0, 0],
      clipPath: [
        "inset(80% 0 10% 0)",
        "inset(20% 0 60% 0)",
        "inset(50% 0 30% 0)",
        "inset(0 100% 0 0)"
      ],
      transition: { duration: 0.3, delay: 0.1 }
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={cn("relative inline-block cursor-default group", className)}
    >
      <motion.div variants={glitchVariants} animate={controls}>
        <Component className="relative z-10">
          {children}
        </Component>
      </motion.div>

      <motion.div
        variants={sweepVariants}
        animate={controls}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,1) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        <Component>
          {children}
        </Component>
      </motion.div>
      
      <motion.div
        variants={glitchLayer1}
        animate={controls}
        className="absolute inset-0 z-0 text-[#2D63FF] pointer-events-none"
        style={{ opacity: 0 }}
      >
        <Component>
          {children}
        </Component>
      </motion.div>
      
      <motion.div
        variants={glitchLayer2}
        animate={controls}
        className="absolute inset-0 z-0 text-[#ff003c] pointer-events-none"
        style={{ opacity: 0 }}
      >
        <Component>
          {children}
        </Component>
      </motion.div>
    </div>
  );
}
