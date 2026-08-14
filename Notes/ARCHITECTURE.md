# 架构

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | React 19 + TypeScript |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS v4（`src/index.css` 主题变量） |
| 动画 | Motion（Framer Motion），transform/opacity，60fps |
| 路由 | React Router v7 |
| 3D | three + @react-three/fiber + @react-three/drei（懒加载） |
| 内容 | `src/content/`：默认值 + `public/content.json` 运行时覆盖 |

## 目录

```
src/
├── main.tsx / App.tsx / index.css / utils.ts
├── content/          # 内容层：types / defaults / store（ContentProvider + useContent）
├── data.ts           # ★ 默认内容（编辑器默认源）
├── pages/            # Home / ProjectDetail / TechThoughts / Admin
├── components/       # GlobalNav / SciFiHeading
├── journey/          # 四幕旅程（config / hooks / Journey / VerticalJourney / scene / ui）
└── three/            # 3D 舞台框架（详见 THREE.md）
public/
├── covers/           # 作品封面
└── content.json      # ★ 编辑器保存的内容（已提交，跨设备同步）
Notes/                # ★ 本文档中心
scripts/gen-content.mjs  # 重新生成默认 content.json
```

## 数据流（内容）

1. 默认值：`src/data.ts`（`DEFAULT_CONTENT` 在 `src/content/defaults.ts` 组装）
2. 运行时：`ContentProvider`（`src/content/store.tsx`）fetch `/content.json`，与默认值**浅合并**（对象逐键、数组整体替换）
3. 页面统一 `useContent()` 读取
4. 编辑器 `/admin`：改草稿 → `PUT /api/content`（vite 中间件）写 `public/content.json`；静态环境降级为下载 JSON

## 关键常量（唯一调节点）

- `src/journey/config.ts`：四幕坐标（`NODE_X/Y`）、文字激活区间（`ACT_RANGES`）、角色/地面尺寸、能量线路径、调色板
- `src/index.css`：`@theme` 色板与字体

## 性能优化（全站）

| 措施 | 说明 |
| --- | --- |
| 路由级分包 | 详情页 / 文档页 / 编辑器 / 3D 舞台均懒加载；主包 gzip ≈ 137KB |
| three 懒加载 | 独立 chunk（≈975KB），打开 3D 舞台才下载 |
| 能量线 rAF 暂停 | `document.hidden` 时跳过写入 |
| 图片懒加载 + 尺寸预留 | 首屏不阻塞 |
| 深链定位 | `/?act=cover|about|work|docs` |