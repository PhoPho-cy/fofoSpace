# 浮光 · FOFO 的空间

游戏旅程式个人作品集网页：滚动推进四幕连续场景（封面 → 简介 → 作品 → 技术文档），
粉白色能量线贯穿全站，文字融入场景并互相遮挡；另含 three.js 3D 舞台与内容编辑器。

## 快速开始

```bash
pnpm dev            # http://localhost:3000
pnpm build          # 产物 dist/
pnpm preview        # 预览生产构建
pnpm lint           # tsc --noEmit
pnpm gen:content    # 从默认内容重新生成 public/content.json
```

## 常用入口

- 内容编辑器：`http://localhost:3000/admin`（首页左下角「内容编辑」）
- 3D 舞台：首页左下角「3D 舞台」（Esc 关闭）
- 深链：`/?act=cover|about|work|docs`

## 文档

| 文档 | 内容 |
| --- | --- |
| `Notes/README.md` | ★ 文档索引 + 强制约束 + 检查清单（每次更改/回答必须执行） |
| `Notes/HANDOFF.md` | 交接现状：结构 / 可替换项 / 命令 / 变更记录 |
| `Notes/ARCHITECTURE.md` | 技术栈 / 目录 / 数据流 / 性能 |
| `Notes/CONTENT.md` | 内容层与编辑器指南 |
| `Notes/THREE.md` | 3D 舞台框架 |

## 目录

```
src/
├── shared/    # 跨模块共享（types / hooks / cn）
├── content/   # 内容层（types / data / acts / defaults / store）
├── pages/     # Home / ProjectDetail / TechThoughts / Admin
├── components/# GlobalNav / SciFiHeading
├── journey/   # 四幕旅程
└── three/     # 3D 舞台框架
public/content.json   # 编辑器保存的内容（已提交）
Notes/                # 文档中心（本仓库的唯一文档源）
```

## 备注

- 视觉参考：`Vision/1.png`、`Vision/2.png`、`Vision/AI-Coding-Prompt.md`
- 本项目每次更改后必须同步更新 `Notes/`，每次回答前运行检查清单