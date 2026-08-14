# 交接记录 · fofoSpace

> 跨设备 / 跨人接手时**先读本文件**。
> 完整文档见 `Notes/README.md`（索引）与 `ARCHITECTURE.md` / `CONTENT.md` / `THREE.md`。

## ⚠️ 强制约束（每次更改必须执行）

1. 每次对本项目做任何更改后，必须同步更新 `Notes/` 对应文档，并在**本文件「变更记录」追加一行**。
2. 每次回答 / 交付前运行一次检查（见 `Notes/README.md` 检查清单），有问题先修复再交付。

## 这是什么

「浮光 · FOFO 的空间」—— 游戏旅程式个人作品集网页。
滚动推进四幕连续场景：**封面（归墟）→ 简介（水镜）→ 作品（心核）→ 技术文档（脉髓）**，
粉白色能量线贯穿全站，文字融入场景并与场景物体互相遮挡。3D 舞台（three.js）可配置外部模型。

## 当前状态快照

- 技术栈：React 19 + TS + Vite 6 + Tailwind v4 + Motion + React Router + three（懒加载）
- 四幕旅程：`src/journey/`（桌面横版探索 / 移动端纵向叙事）
- 内容层：`src/content/` + `public/content.json`（已提交）+ 编辑器 `/admin`
- 3D 框架：`src/three/`
- 性能：路由级分包、three 懒加载、rAF 后台暂停、dpr 限制
- 已清理：旧 Neon 组件、`src/game/`、多余依赖

## 可替换项清单（白盒 / 占位 / 内容）

| 可替换项 | 位置 | 说明 |
| --- | --- | --- |
| 个人资料 / 简介 / 技能 / 联系方式 | `src/content/data.ts` → `PROFILE`；或 `/admin` | 编辑器可视化修改 |
| 作品（标题/封面/简介/技术栈/详情） | `src/content/data.ts` → `MY_PROJECTS`；或 `/admin` | 封面支持图片/视频 URL |
| 技术文章 | `src/content/data.ts` → `TECH_THOUGHTS`；或 `/admin` | 正文纯文本 |
| 章节文字 | `/admin` 章节文字；默认在 `content.defaults` | 四幕 chapter/title/sub |
| 界面文案 | `/admin` 界面文案 | 品牌名 / 首页提示 |
| 3D 舞台模型（GLTF/GLB） | `/admin` → 3D 舞台 | 自动加载，失败回退占位 |
| 沉睡神兽（SVG 白盒） | `src/journey/scene/Beast.tsx` | 可整块替换 |
| 记忆水镜（SVG 白盒） | `src/journey/scene/Mirror.tsx` | 同上 |
| 三颗心核（SVG 白盒） | `src/journey/scene/HeartCores.tsx` | 可交互 |
| 神经主干 + 知识节点（SVG 白盒） | `src/journey/scene/DocNodes.tsx` | 可交互 |
| 探索者角色（SVG 白盒） | `src/journey/scene/Character.tsx` | 统一尺寸/地面高度 |
| 视差层（山/柱/草/花瓣） | `src/journey/scene/ParallaxLayers.tsx` | 三层不同速度 |
| 3D 占位场景 | `src/three/SceneContent.tsx` | Instancing 写法示例 |
| 头像 | `PROFILE.avatar`（留空用占位剪影） | |

## 常用命令

```bash
pnpm dev            # http://localhost:3000
pnpm build          # 产物 dist/
pnpm preview        # 预览生产构建
pnpm lint           # tsc --noEmit
pnpm gen:content    # 从默认内容重新生成 public/content.json
```

## 注意事项

- `public/content.json` 已提交且被运行时加载：用编辑器或 `pnpm gen:content` 修改，不要手改结构
- 编辑器 API 仅开发服务器可用；纯静态部署用「导出 JSON」
- 视觉参考：`Vision/1.png`、`Vision/2.png`、`Vision/AI-Coding-Prompt.md`

## 变更记录

- 2026-08-14：按 `Vision/AI-Coding-Prompt.md` 重构为四幕旅程；新增 `src/journey/`、`Notes/HANDOFF.md`、内容编辑系统 `/admin`（`src/content/`、`src/pages/Admin.tsx`、vite 内容 API）、Three.js 框架 `src/three/`；清理旧组件与 `src/game/`，精简依赖；全站性能优化（分包/懒加载/后台暂停）。
- 2026-08-14（同日跟进）：`public/content.json` 改为提交常驻（避免 404）；「恢复默认」写回默认值；新增 `scripts/gen-content.mjs` + `pnpm gen:content`。
- 2026-08-15：文档架构优化 —— 拆分 `Notes/` 为 README（入口+约束）/ ARCHITECTURE / CONTENT / THREE / HANDOFF；根 README 精简为概览+链接；新增「每次回答前检查一次」约束；清理 3 处未使用变量；全路由无报错验证通过。
- 2026-08-15：新增根目录 `AGENTS.md`（agent 自动读取的约束 + 检查清单 + 文档索引）；完成首次 git 提交（b0b736d）。
- 2026-08-15：整体文件架构优化 —— 新增 `src/shared/`（types/hooks/cn）；内容层自包含（`src/content/acts.ts`、`src/content/data.ts`）；`content` 不再反向依赖 `journey`；删除根目录 `data.ts` / `utils.ts` / `journey/hooks.ts`；34 个文件全部可达、无死代码。
- 2026-08-15：git 仓库管理 —— 新增 `.gitignore`（node_modules / dist / .env / .workbuddy）；解除 node_modules（5894）与 .workbuddy 的跟踪；删除陈旧 package-lock.json、vite.config.js；纳入 FOR_GEMINI.md；提交按模块拆分（feat / refactor / docs / chore），当前工作区干净、60 个跟踪文件。推送 origin 需网络（本机暂被阻断）。
