# 3D 舞台框架（src/three/）

## 分层

| 文件 | 职责 |
| --- | --- |
| `config.ts` | 质量档位 low/medium/high：dpr、抗锯齿、阴影、粒子数预算 |
| `Experience.tsx` | Canvas 封装：gl 配置、色调映射、`PerformanceMonitor` 自动降级、reduced-motion 时 `frameloop=demand` |
| `SceneContent.tsx` | 场景内容：星空（InstancedMesh）、记忆之核、浮尘光点、山影、地面；支持加载编辑器配置的外部模型（带错误兜底） |
| `ThreeStage.tsx` | 全屏舞台：入口 / 画质档显示 / Esc 关闭 |

## 性能策略（内置）

- `dpr: [1, 2]` 限制，关闭 alpha/stencil，`powerPreference: high-performance`
- 帧率下降自动降级（只降不升，避免震荡）
- 星空用 InstancedMesh（数千颗星一次 draw call）
- 卸载时几何/材质由 R3F 自动释放
- three 通过 `React.lazy` 按需加载，不进首屏包

## 替换真实内容

- 修改 `SceneContent.tsx` 中的 `Stars / Motes / Core / Mountains` 或整体替换
- 外部模型：编辑器「3D 舞台 → 模型 URL」填入 GLTF/GLB 地址即可（加载失败自动回退）