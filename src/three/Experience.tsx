import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import type { Project } from '../content/data';
import SceneContent from './SceneContent';
import { QUALITY, degradeQuality, type Quality } from './config';

interface ExperienceProps {
  quality: Quality;
  reduced: boolean;
  inputAxis: number;
  onQualityChange: (quality: Quality) => void;
  onFocusProject: (project: Project | null) => void;
  onSelectProject: (project: Project) => void;
}

export default function Experience({
  quality,
  reduced,
  inputAxis,
  onQualityChange,
  onFocusProject,
  onSelectProject,
}: ExperienceProps) {
  const settings = QUALITY[quality];

  return (
    <Canvas
      dpr={settings.dpr}
      gl={{
        antialias: settings.antialias,
        powerPreference: 'high-performance',
        alpha: false,
        stencil: false,
        depth: true,
        preserveDrawingBuffer: false,
      }}
      camera={{ position: [0, 2.2, 7.5], fov: 45, near: 0.1, far: 80 }}
      frameloop="always"
      shadows={settings.shadows ? 'basic' : false}
      tabIndex={0}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        gl.setClearColor(new THREE.Color('#05070d'));
      }}
    >
      <PerformanceMonitor flipflops={3} onDecline={() => onQualityChange(degradeQuality(quality))} />
      <Suspense fallback={null}>
        <SceneContent
          quality={quality}
          reduced={reduced}
          inputAxis={inputAxis}
          onFocusProject={onFocusProject}
          onSelectProject={onSelectProject}
        />
      </Suspense>
    </Canvas>
  );
}
