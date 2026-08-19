import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Project } from '../../content/data';
import GrassField from './GrassField';
import { useGameControls } from './useGameControls';

interface GameWorldProps {
  projects: Project[];
  energySegments: number;
  grassCount: number;
  inputAxis: number;
  reduced: boolean;
  onFocusProject: (project: Project | null) => void;
  onSelectProject: (project: Project) => void;
}

const WORLD_MIN = -5.4;
const WORLD_MAX = 5.4;

function MemoryNode({
  project,
  position,
  onFocus,
  onSelect,
}: {
  project: Project;
  position: [number, number, number];
  onFocus: (project: Project | null) => void;
  onSelect: (project: Project) => void;
}) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ring.current) ring.current.rotation.z = state.clock.elapsedTime * 0.18;
  });

  useEffect(() => () => {
    document.body.style.cursor = '';
  }, []);

  return (
    <group position={position}>
      <mesh
        onPointerEnter={(event) => {
          event.stopPropagation();
          document.body.style.cursor = 'pointer';
          onFocus(project);
        }}
        onPointerLeave={() => {
          document.body.style.cursor = '';
          onFocus(null);
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(project);
        }}
      >
        <icosahedronGeometry args={[0.48, 2]} />
        <meshStandardMaterial color="#173847" emissive="#e3c6d6" emissiveIntensity={1.2} roughness={0.25} />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[0.78, 0.018, 6, 48]} />
        <meshBasicMaterial color="#eedce7" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <pointLight color="#eedce7" intensity={4.5} distance={5} />
    </group>
  );
}

export default function GameWorld({
  projects,
  energySegments,
  grassCount,
  inputAxis,
  reduced,
  onFocusProject,
  onSelectProject,
}: GameWorldProps) {
  const player = useRef<THREE.Group>(null);
  const playerPosition = useRef(new THREE.Vector3(WORLD_MIN, 0.58, 0.75));
  const velocity = useRef(0);
  const lastNearbyId = useRef<string | null>(null);
  const pressed = useGameControls();
  const nodes = useMemo(
    () => projects.map((project, index) => ({
      project,
      x: (index - (projects.length - 1) / 2) * 3.2,
    })),
    [projects],
  );
  const energyCurve = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(-9, 0.08, 0),
      new THREE.Vector3(-4, 0.16, -0.15),
      new THREE.Vector3(0, 0.09, 0.12),
      new THREE.Vector3(4, 0.2, -0.1),
      new THREE.Vector3(9, 0.1, 0),
    ]),
    [],
  );

  useFrame((state, delta) => {
    const actor = player.current;
    if (!actor) return;
    const keys = pressed.current;
    const keyboardAxis = Number(keys.has('ArrowRight') || keys.has('KeyD')) - Number(keys.has('ArrowLeft') || keys.has('KeyA'));
    const axis = keyboardAxis || inputAxis;
    velocity.current = THREE.MathUtils.damp(velocity.current, axis * 3.5, 7, delta);
    actor.position.x = THREE.MathUtils.clamp(actor.position.x + velocity.current * delta, WORLD_MIN, WORLD_MAX);
    actor.rotation.z = THREE.MathUtils.damp(actor.rotation.z, -velocity.current * 0.06, 8, delta);
    if (!reduced) actor.position.y = 0.58 + Math.sin(state.clock.elapsedTime * 4.0) * 0.025;
    playerPosition.current.copy(actor.position);

    const cameraX = THREE.MathUtils.damp(state.camera.position.x, actor.position.x + 0.82, 4.2, delta);
    state.camera.position.x = cameraX;
    state.camera.lookAt(cameraX, 1.25, 0);

    let nearby: Project | null = null;
    let distance = Number.POSITIVE_INFINITY;
    for (const node of nodes) {
      const nextDistance = Math.abs(actor.position.x - node.x);
      if (nextDistance < distance) {
        distance = nextDistance;
        nearby = node.project;
      }
    }
    if (distance > 1.25) nearby = null;
    const nearbyId = nearby?.id ?? null;
    if (nearbyId !== lastNearbyId.current) {
      lastNearbyId.current = nearbyId;
      onFocusProject(nearby);
    }
  });

  return (
    <group>
      <GrassField count={grassCount} reduced={reduced} playerPosition={playerPosition} />

      <mesh>
        <tubeGeometry args={[energyCurve, energySegments, 0.025, 6, false]} />
        <meshBasicMaterial color="#e3c6d6" transparent opacity={0.78} toneMapped={false} />
      </mesh>

      {nodes.map(({ project, x }) => (
        <MemoryNode
          key={project.id}
          project={project}
          position={[x, 1.45, 0]}
          onFocus={onFocusProject}
          onSelect={onSelectProject}
        />
      ))}

      <group ref={player} position={[WORLD_MIN, 0.58, 0.75]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.13, 0.34, 5, 8]} />
          <meshStandardMaterial color="#d3e9f1" emissive="#a9d6e5" emissiveIntensity={0.3} roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.34, 0]} castShadow>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color="#e9eef2" roughness={0.75} />
        </mesh>
        <pointLight position={[0.25, 0.2, 0.3]} color="#eedce7" intensity={2.4} distance={2.5} />
      </group>
    </group>
  );
}
