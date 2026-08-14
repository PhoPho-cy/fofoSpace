import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import SceneContent from './SceneContent';
import { QUALITY, degradeQuality, type Quality } from './config';

interface ExperienceProps {
  quality: Quality;
  reduced: boolean;
  onQualityChange: (q: Quality) => void;
}

/**
 * Three.js Canvas 封装：性能优先的默认配置。
 * - dpr 限制在 [1, 2]，避免高 DPI 屏被拉爆
 * - powerPreference high-performance、关闭 alpha/stencil
 * - PerformanceMonitor：帧率下降时自动降级画质（只降不升，避免震荡）
 * - prefers-reduced-motion 时使用 frameloop="demand"（不主动渲染）
 * - three 通过懒加载按需进入主包
 */
export default function Experience({ quality, reduced, onQualityChange }: ExperienceProps) {
  const s = QUALITY[quality];

  return (
    <Canvas
      dpr={s.dpr}
      gl={{
        antialias: s.antialias,
        powerPreference: 'high-performance',
        alpha: false,
        stencil: false,
        depth: true,
        preserveDrawingBuffer: false,
      }}
      camera={{ position: [0, 2.2, 7.5], fov: 45, near: 0.1, far: 220 }}
      frameloop={reduced ? 'demand' : 'always'}
      shadows={s.shadows}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        gl.setClearColor(new THREE.Color('#05070d'));
      }}
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => onQualityChange(degradeQuality(quality))}
      />
      <Suspense fallback={null}>
        <SceneContent quality={quality} reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}