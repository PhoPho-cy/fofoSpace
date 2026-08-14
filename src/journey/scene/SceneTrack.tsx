import { useTransform, motion, type MotionValue } from 'motion/react';
import { COLORS, GROUND_Y, TRACK_WIDTH, type ActId } from '../config';
import { useContent } from '../../content/store';
import WorldText from './WorldText';
import ParallaxLayers, { Ground } from './ParallaxLayers';
import EnergyLine from './EnergyLine';
import Beast from './Beast';
import Mirror from './Mirror';
import HeartCores from './HeartCores';
import DocNodes from './DocNodes';
import CharacterArt from './Character';

interface SceneTrackProps {
  cameraX: MotionValue<number>;
  activeAct: ActId;
  lit: MotionValue<number>;
  progress: MotionValue<number>;
  charX: MotionValue<string>;
  hoveredWork: string | null;
  onWorkHover: (id: string | null) => void;
  onJump: (act: ActId) => void;
  onOpenProject: (id: string) => void;
  hoveredDoc: string | null;
  onDocHover: (id: string | null) => void;
  onOpenDoc: (thoughtId: string | undefined) => void;
}

/**
 * 游戏层：由视差背景 + 世界轨道（场景对象、能量线、地面）组成。
 * 世界轨道随相机平移；角色以固定步幅沿轨道前行。
 */
export default function SceneTrack(props: SceneTrackProps) {
  const {
    cameraX,
    activeAct,
    lit,
    progress,
    charX,
    hoveredWork,
    onWorkHover,
    onJump,
    onOpenProject,
    hoveredDoc,
    onDocHover,
    onOpenDoc,
  } = props;

  const { content } = useContent();
  const { profile, projects, thoughts, actCopy } = content;

  const trackX = useTransform(cameraX, (v) => `${-v}vw`);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 视差层 */}
      <ParallaxLayers cameraX={cameraX} />

      {/* 世界轨道 */}
      <motion.div
        className="absolute left-0 top-0 h-full"
        style={{ width: `${TRACK_WIDTH}vw`, x: trackX }}
      >
        <Ground />
        <EnergyLine lit={lit} />
        <WorldText
          progress={progress}
          activeAct={activeAct}
          profile={profile}
          projects={projects}
          actCopy={actCopy}
          hoveredWork={hoveredWork}
          onWorkHover={onWorkHover}
          onJump={onJump}
          onOpenProject={onOpenProject}
          onOpenDoc={onOpenDoc}
        />
        <Beast />
        <Mirror />
        <HeartCores
          projects={projects}
          hoveredId={hoveredWork}
          active={activeAct === 'work'}
          onHover={onWorkHover}
          onOpen={onOpenProject}
        />
        <DocNodes
          thoughts={thoughts}
          hoveredId={hoveredDoc}
          active={activeAct === 'docs'}
          onHover={onDocHover}
          onOpen={onOpenDoc}
        />

        {/* 探索者 */}
        <motion.div
          className="absolute"
          style={{ left: charX, top: `${GROUND_Y}vh`, width: '6.2vw' }}
          aria-hidden="true"
        >
          <div className="relative" style={{ transform: 'translate(-50%, -100%)' }}>
            <CharacterArt className="block w-full" />
            {/* 角色身边微尘 */}
            <span
              className="absolute -right-2 top-6 h-1 w-1 rounded-full bg-petal/60 animate-float"
              style={{ boxShadow: `0 0 8px ${COLORS.glowPetal}` }}
            />
            <span
              className="absolute -left-1 top-12 h-0.5 w-0.5 rounded-full bg-ice/70 animate-float"
              style={{ animationDelay: '1.4s', boxShadow: `0 0 6px ${COLORS.glowIce}` }}
            />
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
}


