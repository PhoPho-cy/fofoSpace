import { Component, Suspense, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { QUALITY, type Quality } from './config';
import { useContent } from '../content/store';

/**
 * 3D 舞台的示例内容（占位场景）。
 * 全部使用 Instancing / 简单几何 / 共享材质，展示性能优先的写法；
 * 后续替换为真实美术资源时保持同样的分层结构即可。
 */

/** 星空：InstancedMesh，一次 draw call 渲染数千颗星 */
function Stars({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 150;
      arr[i * 3 + 1] = Math.random() * 55 - 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 150;
    }
    return arr;
  }, [count]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(0.06 + Math.random() * 0.2);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions, count]);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined as unknown as THREE.BufferGeometry, undefined as unknown as THREE.Material, count]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#a9d6e5" toneMapped={false} />
    </instancedMesh>
  );
}

/** 环绕「记忆之核」的浮尘光点 */
function Motes({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const data = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        radius: 1.8 + Math.random() * 2.6,
        speed: 0.16 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.5) * 3.2,
        size: 0.05 + Math.random() * 0.1,
      })),
    [count],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const children = group.current?.children;
    if (!children) return;
    data.forEach((d, i) => {
      const child = children[i];
      if (!child) return;
      const a = t * d.speed + d.phase;
      child.position.set(
        Math.cos(a) * d.radius,
        d.y + Math.sin(t * 0.6 + d.phase) * 0.3,
        Math.sin(a) * d.radius,
      );
    });
  });

  return (
    <group ref={group}>
      {data.map((d, i) => (
        <mesh key={i}>
          <sphereGeometry args={[d.size, 8, 8]} />
          <meshBasicMaterial color={i % 2 ? '#eedce7' : '#a9d6e5'} toneMapped={false} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** 中央「记忆之核」 */
function Core() {
  const mesh = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.2;
      mesh.current.rotation.x = Math.sin(t * 0.3) * 0.15;
      mesh.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.06);
    }
    if (wire.current) wire.current.rotation.y = -t * 0.35;
  });
  return (
    <group>
      <mesh ref={mesh} position={[0, 1.6, 0]}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial
          color="#12303b"
          emissive="#eedce7"
          emissiveIntensity={0.35}
          roughness={0.35}
          metalness={0.2}
          flatShading
        />
      </mesh>
      <mesh ref={wire} position={[0, 1.6, 0]}>
        <icosahedronGeometry args={[1.15, 0]} />
        <meshBasicMaterial color="#e3c6d6" wireframe transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 1.6, 0]} color="#eedce7" intensity={9} distance={14} />
    </group>
  );
}

/** 远景山影 */
function Mountains() {
  const data = useMemo(
    () => [
      { x: -22, z: -34, r: 11, h: 12, c: '#0a1a23' },
      { x: -4, z: -40, r: 15, h: 16, c: '#0d2029' },
      { x: 20, z: -36, r: 12, h: 13, c: '#0a1a23' },
    ],
    [],
  );
  return (
    <group>
      {data.map((m, i) => (
        <mesh key={i} position={[m.x, m.h / 2 - 0.5, m.z]}>
          <coneGeometry args={[m.r, m.h, 5]} />
          <meshStandardMaterial color={m.c} flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/** 编辑器配置的外部 GLTF/GLB 模型（自动加载，失败时回退占位场景） */
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

/** 缓慢环绕相机：廉价氛围感，不动场景本体 */
function CameraDrift({ reduced }: { reduced: boolean }) {
  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    const a = Math.sin(t * 0.05) * 0.16;
    state.camera.position.x = Math.sin(a) * 7.5;
    state.camera.position.z = Math.cos(a) * 7.5;
    state.camera.position.y = 2.2 + Math.sin(t * 0.08) * 0.25;
    state.camera.lookAt(0, 1.6, 0);
  });
  return null;
}

export default function SceneContent({ quality, reduced }: { quality: Quality; reduced: boolean }) {
  const s = QUALITY[quality];
  const { content } = useContent();
  const modelUrl = content.stage.modelUrl.trim();
  return (
    <group>
      <fog attach="fog" args={['#05070d', 16, 85]} />
      <color attach="background" args={['#05070d']} />

      <ambientLight intensity={0.35} color="#a9d6e5" />
      <directionalLight position={[8, 12, 4]} intensity={0.9} color="#d3e9f1" castShadow={s.shadows} />

      <CameraDrift reduced={reduced} />
      <Stars count={s.starCount} />
      <Motes count={s.moteCount} />
      <Core />
      <Mountains />
      {modelUrl && (
        <ModelBoundary>
          <Suspense fallback={null}>
            <RemoteModel url={modelUrl} />
          </Suspense>
        </ModelBoundary>
      )}

      {/* 地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[90, 48]} />
        <meshStandardMaterial color="#081821" roughness={0.95} />
      </mesh>
    </group>
  );
}