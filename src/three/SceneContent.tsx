import { Component, Suspense, type ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import type { Project } from '../content/data';
import { useContent } from '../content/store';
import GameWorld from './game/GameWorld';
import ShaderBackdrop from './ShaderBackdrop';
import { QUALITY, type Quality } from './config';

interface SceneContentProps {
  quality: Quality;
  reduced: boolean;
  inputAxis: number;
  onFocusProject: (project: Project | null) => void;
  onSelectProject: (project: Project) => void;
}

function RemoteModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

class ModelBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SceneContent({
  quality,
  reduced,
  inputAxis,
  onFocusProject,
  onSelectProject,
}: SceneContentProps) {
  const settings = QUALITY[quality];
  const { content } = useContent();
  const modelUrl = content.stage.modelUrl.trim();

  return (
    <group>
      <ShaderBackdrop detail={settings.shaderDetail} reduced={reduced} />
      <fog attach="fog" args={['#05070d', 12, 42]} />
      <ambientLight intensity={0.42} color="#a9d6e5" />
      <directionalLight position={[7, 10, 5]} intensity={1.1} color="#d3e9f1" castShadow={settings.shadows} />

      <GameWorld
        projects={content.projects}
        energySegments={settings.energySegments}
        grassCount={settings.grassCount}
        inputAxis={inputAxis}
        reduced={reduced}
        onFocusProject={onFocusProject}
        onSelectProject={onSelectProject}
      />

      {modelUrl && (
        <ModelBoundary>
          <Suspense fallback={null}>
            <RemoteModel url={modelUrl} />
          </Suspense>
        </ModelBoundary>
      )}

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 8]} />
        <meshStandardMaterial color="#07141d" roughness={0.98} transparent opacity={0.82} />
      </mesh>
    </group>
  );
}
