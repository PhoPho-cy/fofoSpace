# AGENTS.md

本文件供 AI 编码助手 / 开发者在接手本项目时自动读取。

## ⚠️ 强制约束

1. **每次对本项目做任何更改后，必须同步更新 `Notes/`**：
   - 更新对应主题文档（ARCHITECTURE / CONTENT / THREE / HANDOFF）；
   - 在 `Notes/HANDOFF.md` 的「变更记录」追加一行（日期 + 改了什么 + 相关文件）。
2. **每次回答 / 交付前运行一次检查清单**（详见 `Notes/README.md`）：
   - `pnpm lint`（tsc --noEmit）
   - `tsc --noEmit --noUnusedLocals --noUnusedParameters`
   - `pnpm build`
   - 浏览器全路由（含 3D 舞台）无 console error / 失败请求
   - 死代码扫描：`src/` 下无未被入口引用的文件
   - 确认 Notes 已同步、有未提交变更时提示提交
3. 不要手改 `public/content.json` 结构：用 `/admin` 编辑器或 `pnpm gen:content`。
4. `node_modules` 被 git 跟踪（历史遗留）：提交时**只 stage 项目路径**（src / public / Notes / scripts / 配置 / README / AGENTS.md），不要提交 node_modules 的变更。

## 文档索引

| 文件 | 内容 |
| --- | --- |
| `Notes/README.md` | 入口 + 强制约束 + 检查清单 |
| `Notes/HANDOFF.md` | 交接现状 + 变更记录 |
| `Notes/ARCHITECTURE.md` | 技术栈 / 目录 / 数据流 / 性能 |
| `Notes/CONTENT.md` | 内容层与编辑器指南 |
| `Notes/THREE.md` | 3D 舞台框架 |

## 常用命令

```bash
pnpm dev            # http://localhost:3000
pnpm build          # 产物 dist/
pnpm preview        # 预览生产构建
pnpm lint           # tsc --noEmit
pnpm gen:content    # 从默认内容重新生成 public/content.json
```

## 内容入口

- 编辑器：`http://localhost:3000/admin`（首页左下角「内容编辑」）
- 3D 舞台：首页左下角「3D 舞台」（Esc 关闭）
- 深链：`/?act=cover|about|work|docs`

## 分工约定

- **本 Agent 负责本地管理**：代码/文档修改、每次回答前运行检查清单、保持工作区干净、按模块做逻辑提交、同步 `Notes/`。
- **推送（`git push`）由用户执行**；除非用户明确要求，否则不主动 push。
- 完成本地提交后，可汇总 `git log --oneline` 供用户参考。
