import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import grassVertexShader from '../shaders/grass.vert.glsl?raw';
import grassFragmentShader from '../shaders/grass.frag.glsl?raw';

interface GrassFieldProps {
  count: number;
  reduced: boolean;
  playerPosition: MutableRefObject<THREE.Vector3>;
}

function random(index: number, salt: number): number {
  const value = Math.sin(index * 91.73 + salt * 317.11) * 43758.5453;
  return value - Math.floor(value);
}

function createBladeGeometry(): THREE.BufferGeometry {
  const segments = 5;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let row = 0; row <= segments; row++) {
    const height = row / segments;
    const halfWidth = 0.055 * Math.max(0.08, 1 - Math.pow(height, 1.35));
    positions.push(-halfWidth, height, 0, halfWidth, height, 0);
    uvs.push(0, height, 1, height);
    if (row < segments) {
      const offset = row * 2;
      indices.push(offset, offset + 1, offset + 2, offset + 1, offset + 3, offset + 2);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export default function GrassField({ count, reduced, playerPosition }: GrassFieldProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const next = createBladeGeometry();
    next.setAttribute('aPhase', new THREE.InstancedBufferAttribute(
      Float32Array.from({ length: count }, (_, index) => random(index, 1) * Math.PI * 2),
      1,
    ));
    next.setAttribute('aShade', new THREE.InstancedBufferAttribute(
      Float32Array.from({ length: count }, (_, index) => random(index, 2)),
      1,
    ));
    return next;
  }, [count]);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uReduced: { value: reduced ? 1 : 0 },
    uPlayer: { value: new THREE.Vector3(-20, 0, 0) },
  }), [reduced]);

  useLayoutEffect(() => {
    const field = mesh.current;
    if (!field) return;
    const transform = new THREE.Object3D();
    for (let index = 0; index < count; index++) {
      const x = -10.5 + random(index, 3) * 21;
      const z = -2.5 + random(index, 4) * 5;
      const depth = (z + 2.5) / 5;
      const height = 0.16 + random(index, 5) * 0.26 + depth * 0.12;
      const width = 0.65 + random(index, 6) * 0.65;
      transform.position.set(x, 0.01 + random(index, 7) * 0.018, z);
      transform.rotation.set(0, (random(index, 8) - 0.5) * 0.38, 0);
      transform.scale.set(width, height, 1);
      transform.updateMatrix();
      field.setMatrixAt(index, transform.matrix);
    }
    field.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    field.instanceMatrix.needsUpdate = true;
    field.computeBoundingSphere();
  }, [count]);

  useFrame((_, delta) => {
    const shader = material.current;
    if (!shader) return;
    if (!reduced) shader.uniforms.uTime.value += Math.min(delta, 0.05);
    shader.uniforms.uReduced.value = reduced ? 1 : 0;
    shader.uniforms.uPlayer.value.copy(playerPosition.current);
  });

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, count]} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={grassVertexShader}
        fragmentShader={grassFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
