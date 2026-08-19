import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import fullscreenVertexShader from './shaders/fullscreen.vert.glsl?raw';
import memoryFragmentShader from './shaders/memory.frag.glsl?raw';

interface ShaderBackdropProps {
  detail: number;
  reduced: boolean;
}

export default function ShaderBackdrop({ detail, reduced }: ShaderBackdropProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { gl, size } = useThree();
  const pointerTarget = useMemo(() => new THREE.Vector2(), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDetail: { value: detail },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2() },
    }),
    [detail],
  );

  useFrame((state, delta) => {
    const shader = material.current;
    if (!shader) return;
    if (!reduced) shader.uniforms.uTime.value += Math.min(delta, 0.05);
    shader.uniforms.uDetail.value = detail;
    shader.uniforms.uResolution.value.set(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio());
    pointerTarget.set(state.pointer.x, state.pointer.y);
    shader.uniforms.uPointer.value.lerp(pointerTarget, reduced ? 1 : 0.06);
  });

  return (
    <mesh renderOrder={-1000} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={fullscreenVertexShader}
        fragmentShader={memoryFragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
