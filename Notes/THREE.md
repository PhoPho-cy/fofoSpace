# GLSL 互动作品舞台（src/three/）

## 分层

| 文件 | 职责 |
| --- | --- |
| `config.ts` | low/medium/high 质量预算：DPR、阴影、Shader 细节、能量线分段、草叶实例数 |
| `Experience.tsx` | R3F Canvas 边界：WebGL 配置、色调映射、性能自动降级、游戏/作品事件桥接 |
| `SceneContent.tsx` | 场景总装配：Shader 背景、GameWorld、灯光、三维地面、外部 GLTF/GLB |
| `ShaderBackdrop.tsx` | `ShaderMaterial` 与 `uTime/uPointer/uResolution/uDetail` uniform 生命周期 |
| `shaders/fullscreen.vert.glsl` / `memory.frag.glsl` | 全屏记忆洞穴背景 |
| `shaders/grass.vert.glsl` / `grass.frag.glsl` | 三维草叶风摆、角色压草、根尖渐变和 Z 深度色阶 |
| `game/GrassField.tsx` | 自定义收尖草叶几何 + InstancedMesh；真实 XYZ 分布与深度遮挡 |
| `game/useGameControls.ts` | A/D 与方向键输入状态；失焦自动清理 |
| `game/GameWorld.tsx` | 玩家移动、相机跟随、三维草场、能量线、作品心核拾取和选择事件 |
| `ThreeStage.tsx` | 全屏游戏 HUD：作品信息、详情跳转、键盘/触控移动、Esc 关闭 |

## 数据与交互流

1. `Home` 懒加载 `ThreeStage`；点击「进入记忆」后将舞台作为默认主体验打开。
2. `Experience` 建立 Canvas；`SceneContent` 组合 GLSL 背景和游戏世界。
3. `GameWorld` 直接读取 `content.projects` 生成作品节点，并把角色 XYZ 同步给 `GrassField` 的压草 uniform。
4. 草叶实例沿 X/Z 分布，WebGL 深度缓冲让近景草自然遮挡角色、光脉和远景草；靠近或点击节点后把项目状态回传给 DOM HUD。
5. HUD 的「查看作品」跳转至 `/project/:id`；移动支持 A/D、方向键和移动端按住左右按钮。
6. 编辑器中的 `stage.modelUrl` 仍可叠加外部 GLTF/GLB；加载失败由错误边界回退。

## Shader 扩展约定

- GLSL 文件统一放在 `src/three/shaders/`，使用 Vite `?raw` 导入。
- uniform 在 React 中只初始化一次，在 `useFrame` 内原位更新，不每帧创建对象。
- 新增全屏 pass 时保持 `depthTest=false`、`depthWrite=false`，并明确 `renderOrder`。
- 作品节点/角色等游戏实体放在 `src/three/game/`，避免把业务和 Shader 写入 `SceneContent`。

## 性能与无障碍

- DPR 上限为 2；关闭 alpha/stencil；优先高性能 GPU；掉帧只降不升，避免震荡。
- 低画质关闭 Shader 细节层并减少能量线分段；阴影只在高画质开启。
- `prefers-reduced-motion` 时冻结时间与漂移动画，但保留输入、拾取和可操作性。
- Three chunk 独立懒加载（当前 gzip 约 267KB），不进入首屏主包。
- Canvas 卸载时由 R3F 释放几何/材质；窗口失焦时自动清空移动输入。