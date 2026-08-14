# FOFO 技术美术作品集网站 — 项目交接文档（供美化）

> 这是一份自包含文档，包含项目全部源代码、设计意图、架构说明和美化需求。请基于这些代码进行视觉与交互美化，但遵守文末「不可改动」清单。

---

## 一、项目概述

- **站点**：技术美术（Technical Artist）个人作品集，作者 FOFO（盘欣瑜）
- **定位**：PC 优先的暗色系单页应用，克制、高级、不像 PPT 式分块
- **线上地址**：fofo.space（已部署到 Cloudflare Pages）
- **技术栈**：React 19 + Vite 8 + Framer Motion + lucide-react，JSX（非 TS）
- **当前状态**：功能完整，需视觉/交互层面的美化提升

---

## 二、技术栈与依赖

```json
{
  "dependencies": {
    "framer-motion": "^12.42.2",
    "lucide-react": "^1.26.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.4",
    "vite": "^8.1.5"
  }
}
```

- 动画全部用 Framer Motion（motion.div / AnimatePresence / spring / stagger）
- 图标用 lucide-react
- 字体：Inter（英文）+ Noto Sans SC（中文）+ JetBrains Mono（等宽），通过 Google Fonts 引入
- 无路由库，用 App 层 `view` 状态切换两个视图

---

## 三、设计语言与硬约束（美化时必须遵守）

### 色彩
- 主背景 `#0a0a0a`，次级 `#111111`，卡片 `#161616`
- 文字主 `#f5f5f5` / 次 `#a0a0a0` / 三级 `#666666` / 静默 `#444444`
- 当前是**单色灰阶**，无强调色。美化时可引入一个克制的强调色（如冷青/暖琥珀），但不要花哨
- 边框极细：`#222222` / `#1a1a1a`

### 版式
- 版心 `1700px`（`--max-width`）
- 导航高度 `64px`
- 一条**贯穿全站的竖线**（`body::after`）连接各模块，宽屏居中、中屏左移 24px、窄屏隐藏。美化时保留这条竖线
- 字体层级：标题 300 字重（轻），大标题 FOFO 用 600；等宽字用于标签/编号/代码

### 间距
- 用 CSS 变量 `--space-xs` 到 `--space-5xl`（4px → 128px）
- 模块间留白大，节奏松弛

### 性能约束（重要）
- **不要在全屏 fixed 遮罩上使用 `backdrop-filter: blur()`** —— 曾因此导致弹窗卡顿，已移除
- 弹窗已加 `will-change: transform, opacity` 和 `contain: layout style paint`，美化时保留
- 图片/视频字段目前多为空（占位），美化时确保占位态好看

### 交互约束
- 视图切换：home ↔ tech 用左右滑动（`x` 方向位移），duration 0.5s
- 弹窗：精选项目详情、技术点详情都用全屏 overlay + 面板上浮

---

## 四、架构概览与数据流

### 双视图结构
```
App (维护 view: 'home' | 'tech')
├─ Navbar (固定，根据 currentView 切换"技术库"高亮)
├─ AnimatePresence mode="wait"
│  ├─ home 视图
│  │  ├─ Hero
│  │  ├─ About
│  │  ├─ FeaturedProjects (含详情弹窗 + 技术库入口)
│  │  └─ Footer
│  └─ tech 视图
│     └─ TechLibrary (搜索 + 标签 + 博客列表 → TechBlockDetail)
```

### 关键状态流（不可破坏）
1. **顶部导航"技术库"** → 右滑进入 TechLibrary
2. **精选项目底部"关于我的技术库"按钮** → 右滑进入 TechLibrary
3. **精选项目详情弹窗里点某个技术点** → 关闭弹窗 → 右滑进入 TechLibrary + 自动打开该技术点的 TechBlockDetail，且 TechBlockDetail 顶部显示"返回精选项目"按钮
4. **点"返回精选项目"** → 右滑回 home + 恢复之前那个精选项目的详情弹窗
5. **从精选跳来的 TechBlockDetail 关闭后** → `techInitialBlock` 被清空，再浏览其他技术点不显示"返回精选项目"按钮

> 状态 `selectedProject` 和 `techInitialBlock` 提升在 App 层，不要下放回组件内部。

### 数据驱动
- **所有内容集中在 `src/data.js`**，组件只负责渲染。美化时不要把内容写死到组件里
- `techBlocks` 每项有 `detailSections` 数组，类型包括 `h2 / h3 / text / code / video / gif / image / comparison`

---

## 五、文件清单

| 文件 | 作用 | 行数 |
|------|------|------|
| `index.html` | 入口，引入字体、favicon | 17 |
| `package.json` | 依赖 | 24 |
| `src/main.jsx` | React 挂载 | 11 |
| `src/index.css` | 全局变量、reset、竖线、动画 keyframes | 218 |
| `src/data.js` | **所有数据**（hero/about/projects/techBlocks/tags/footer） | 342 |
| `src/App.jsx` | 视图切换 + 状态中枢 | 103 |
| `src/components/Navbar.jsx` | 固定导航，毛玻璃，Logo "FOFO." | 257 |
| `src/components/Hero.jsx` | 颜文字眼动跟随 + 跳动字母标题 | 320 |
| `src/components/About.jsx` | 经历 Tabs + 软件左右两列常驻 | 339 |
| `src/components/FeaturedProjects.jsx` | 错落布局 + 详情弹窗 + 技术库入口 | 630 |
| `src/components/TechLibrary.jsx` | 独立技术库界面（搜索+标签+博客列表） | 410 |
| `src/components/TechBlockDetail.jsx` | 技术点全屏详情（左索引+右富内容+对比滑块） | 297 |
| `src/components/Footer.jsx` | 全屏收尾 + 社交链接 | 237 |

> 注：`src/components/TechBlocks.jsx` 已废弃（被 TechLibrary 取代），不在使用中，可忽略。

---

## 六、完整源代码

### `index.html`

````html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>FOFO</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
````

### `src/main.jsx`

````jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
````

### `src/index.css`

````css
/* ========== Reset & Base ========== */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Colors */
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-card: #161616;
  --bg-card-hover: #1c1c1c;
  --bg-elevated: #1e1e1e;
  --border-default: #222222;
  --border-subtle: #1a1a1a;

  --text-primary: #f5f5f5;
  --text-secondary: #a0a0a0;
  --text-tertiary: #666666;
  --text-muted: #444444;

  --accent: #e8e8e8;
  --accent-dim: #888888;
  --accent-glow: rgba(232, 232, 232, 0.08);

  /* Typography */
  --font-sans: 'Inter', 'Noto Sans SC', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Layout */
  --max-width: 1700px;
  --nav-height: 64px;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
  --space-5xl: 128px;

  /* Transitions */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 600ms;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}

img,
video {
  max-width: 100%;
  display: block;
}

button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
  color: inherit;
}

::selection {
  background: rgba(232, 232, 232, 0.2);
  color: var(--text-primary);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-default);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

/* ========== Vertical Line ========== */
body::after {
  content: '';
  position: fixed;
  left: calc((100vw - var(--max-width)) / 2 + 0px);
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--border-default) 10%,
    var(--border-default) 90%,
    transparent 100%
  );
  z-index: 0;
  pointer-events: none;
}

@media (max-width: 1780px) {
  body::after {
    left: var(--space-xl);
  }
}

@media (max-width: 900px) {
  body::after {
    display: none;
  }
}

/* ========== Utils ========== */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-xl);
}

.section-label {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: var(--space-md);
}

.section-title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
}

.gradient-text {
  background: linear-gradient(135deg, #e8e8e8 0%, #888 50%, #e8e8e8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ========== Animations ========== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* For Framer Motion reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
````

### `src/data.js`

````js
// ========== Hero Data ==========
export const heroData = {
  greeting: "HELLO",
  namePrefix: 'HERE IS',
  nameHighlight: 'FOFO',
  subtitle: '',
  desc: ``,
  label: 'welcome to my space',
  videoSrc: '',
  scrollLabel: 'Scroll',
  emoji: {
    left: '(\u00B4',
    leftEye: '\uFF65',
    mouth: '\u1D17',
    rightEye: '\uFF65',
    right: '` )',
  },
}

// ========== Navigation ==========
export const navLinks = [
  { label: '作品', href: '#featured' },
  { label: '关于', href: '#about' },
  { label: '技术库', href: '#tech-blocks' },
  { label: '联系', href: '#contact' },
]

// ========== About Data ==========
export const aboutData = {
  name: '\u76D8\u6B23\u745C',
  title: 'FOFO PAN',
  avatar: '',
  bio: '致力于成为六边形战士',
  contact: {
    email: 'hello@example.com',
    location: '深圳 / 中国',
  },
  software: {
    left: [
      { name: 'Unreal Engine 5', years: '3 年' },
      { name: 'Unity', years: '2 年' },
      { name: 'Houdini', years: '2 年' },
      { name: 'Substance Designer', years: '2 年' },
    ],
    right: [
      { name: 'Niagara VFX', years: '' },
      { name: 'Blueprint', years: '' },
      { name: 'Shader Graph / HLSL', years: '' },
      { name: 'Blender', years: '' },
      { name: 'Python / C++', years: '' },
      { name: 'PDG / HDA 管线', years: '' },
      { name: '材质函数库', years: '' },
      { name: '后处理 / 特效', years: '' },
    ],
  },
  experienceSections: [
    {
      title: '工作经历',
      items: [
        {
          role: '特效向技术美术 实习生',
          company: '腾讯 魔方工作室群',
          period: '2027.06 - 2027.',
          description: '全流程特效设计制作+技术方案框架搭建+性能优化。包括但不限于角色特效，技能特效，场景特效，枪械特效，动效，交互特效，材质定制，性能优化等',
        },
      ],
    },
    {
      title: '项目经历',
      items: [
        {
          role: '点击类解谜游戏',
          company: '光子 Gamejam',
          period: '2027',
          description: '实现视觉化效果。使用 shader graph 按照需求给游戏制作后处理 shader，动效，蒙版等。',
        },
        {
          role: '文字类模拟类经营游戏',
          company: 'GAFA Gamejam',
          period: '2024',
          description: '制定整体的游戏画风，使用三渲二技术定制效率出图，绘制 UI，制作动效。',
        },
      ],
    },
    {
      title: '游戏经历',
      items: [],
    },
  ],
}

// ========== Featured Projects ==========
export const featuredProjects = [
  {
    id: 'fp-volumetric-cloud',
    title: '体积云渲染系统',
    subtitle: 'Volumetric Cloud Rendering',
    description: '基于 Unreal Engine 5 的体积云渲染系统，采用 Ray Marching 技术与物理模拟结合，实现逼真的大气散射效果。项目涵盖多个技术方向，从底层算法到最终画面呈现。',
    thumbnail: '', videoSrc: '', featuredImage: '',
    techKeywords: ['UE5', 'Ray Marching', '体积渲染', '大气散射'],
    techPoints: [
      { id: 'tp-cloud-raymarch', title: 'Ray Marching 核心算法', summary: '基于物理的体积云采样算法，支持多层云叠加与自阴影计算。', blockId: 'pb-cloud-raymarch' },
      { id: 'tp-cloud-atmosphere', title: '大气散射模拟', summary: 'Rayleigh & Mie 散射模型实现，日夜循环与自定义大气参数。', blockId: 'pb-cloud-atmosphere' },
      { id: 'tp-cloud-lighting', title: '云层光照系统', summary: '多级散射光照近似 + Beer\'s Law 吸收，实现真实云层光照。', blockId: 'pb-cloud-lighting' },
      { id: 'tp-cloud-optimization', title: '性能优化方案', summary: 'Temporal Reprojection + 降采样 + 分帧更新策略，稳定 60fps。', blockId: 'pb-cloud-optimization' },
    ],
  },
  {
    id: 'fp-procedural-building',
    title: '程序化建筑生成',
    subtitle: 'Procedural Building Generator',
    description: 'Houdini + UE5 联动的程序化建筑生成管线。支持参数化调整建筑风格、楼层数量、窗户分布等，大幅提升关卡搭建效率。',
    thumbnail: '', videoSrc: '', featuredImage: '',
    techKeywords: ['Houdini', '程序化', '工具开发', 'PDG'],
    techPoints: [
      { id: 'tp-building-hda', title: 'Houdini HDA 资产设计', summary: '参数化建筑 HDA 的节点网络设计，支持风格切换与细节层级控制。', blockId: 'pb-building-hda' },
      { id: 'tp-building-pdg', title: 'PDG 批量生成管线', summary: '基于 PDG 的批量城市生成，支持分区风格配置与自动化导出。', blockId: 'pb-building-pdg' },
      { id: 'tp-building-ue5', title: 'UE5 集成工作流', summary: 'HDA → DataTable → 自动放置的完整 UE5 关卡搭建流程。', blockId: 'pb-building-ue5' },
    ],
  },
  {
    id: 'fp-stylized-water',
    title: '风格化水面 Shader',
    subtitle: 'Stylized Water Shader',
    description: '多层 Gerstner 波叠加 + 屏幕空间反射 + 次表面散射近似的风格化水面着色器。',
    thumbnail: '', videoSrc: '', featuredImage: '',
    techKeywords: ['Shader', 'HLSL', 'Gerstner Wave', 'SSR'],
    techPoints: [
      { id: 'tp-water-gerstner', title: 'Gerstner 波形算法', summary: '多层 Gerstner 波叠加实现风格化水面运动，支持自定义波长、振幅与方向。', blockId: 'pb-water-gerstner' },
      { id: 'tp-water-sss', title: '次表面散射近似', summary: '基于深度与视角的 SSS 近似计算，实现浅水/深水颜色过渡。', blockId: 'pb-water-sss' },
      { id: 'tp-water-foam', title: '动态泡沫生成', summary: '基于深度检测与波峰分析的动态泡沫遮罩，支持岸边与波浪泡沫。', blockId: 'pb-water-foam' },
    ],
  },
]

// ========== Tech Blocks ==========
// detailSections: [{ type: 'h2'|'h3'|'video'|'gif'|'comparison'|'image'|'code'|'text', ... }]
export const techBlocks = [
  {
    id: 'pb-cloud-raymarch', title: 'Ray Marching 核心算法',
    description: '基于物理的体积云采样算法。使用自定义 Ray Marching 循环，支持多层云叠加与自阴影计算。',
    tags: ['rendering', 'shader', 'ue5'], year: '2024', mediaType: 'code',
    thumbnail: '', featuredId: 'fp-volumetric-cloud',
    detailSections: [
      { type: 'h2', text: '算法概述' },
      { type: 'text', content: 'Ray Marching（光线步进）是体积渲染的核心技术。通过在视线方向逐步采样云密度，累积颜色和透明度来模拟光线在云层中的散射与吸收过程。' },
      { type: 'h3', text: '核心思想' },
      { type: 'text', content: '从相机出发，沿视线方向发射射线，在最大距离内等距采样。每个采样点计算云密度，结合光照模型，累加最终颜色。当累积透明度接近 1 时提前终止。' },
      { type: 'h3', text: '优化技巧' },
      { type: 'text', content: '使用 Blue Noise Dithering 替代均匀采样，用更少的采样点获得相同质量。Temporal Reprojection 复用上一帧信息，进一步减少 50% 采样开销。' },
      { type: 'h2', text: '核心代码' },
      { type: 'code', language: 'HLSL', snippet: `float4 RayMarchClouds(float3 rayOrigin, float3 rayDir, float maxDist, int steps) {
  float stepSize = maxDist / steps;
  float3 pos = rayOrigin;
  float4 result = float4(0,0,0,0);
  for (int i=0; i<steps; i++) {
    float density = SampleCloudDensity(pos);
    if (density > 0.001) {
      float3 light = EvaluateLighting(pos, rayDir);
      float transmittance = exp(-density * stepSize * 0.01);
      result.rgb += light * density * result.a * stepSize;
      result.a *= transmittance;
    }
    pos += rayDir * stepSize;
    if (result.a < 0.01) break;
  }
  return result;
}`, caption: 'Ray Marching 核心循环' },
      { type: 'h2', text: '效果展示' },
      { type: 'comparison', images: [{ before: '', label: '无体积云' }, { after: '', label: '开启体积云' }], caption: '体积云开关对比' },
    ],
  },
  {
    id: 'pb-cloud-atmosphere', title: '大气散射模拟',
    description: '模拟 Rayleigh 与 Mie 散射的后期特效，支持日夜循环与自定义大气参数。',
    tags: ['rendering', 'vfx', 'shader'], year: '2024', mediaType: 'comparison',
    thumbnail: '', featuredId: 'fp-volumetric-cloud',
    detailSections: [
      { type: 'h2', text: '散射模型' },
      { type: 'text', content: '大气散射分为两种主要类型：Rayleigh 散射（小粒子，如空气分子）和 Mie 散射（大粒子，如气溶胶）。两者共同决定了天空的颜色、雾感和光晕效果。' },
      { type: 'h3', text: 'Rayleigh 散射' },
      { type: 'text', content: '负责天空的蓝色调和日落时分的红色调。短期光波（蓝光）比长波光（红光）散射更强，因此天空呈现蓝色。' },
      { type: 'h3', text: 'Mie 散射' },
      { type: 'text', content: '产生雾感和光晕效果。在大气中悬浮的较大粒子（灰尘、水滴）引起，散射在各个方向均等。' },
      { type: 'h2', text: '性能优化' },
      { type: 'text', content: '通过预计算查找表（LUT）将复杂的散射计算离线烘焙到 2D/3D 纹理中，运行时只需一次纹理采样即可获得精确结果，将 GPU 开销降低 90%。' },
      { type: 'h2', text: '对比演示' },
      { type: 'comparison', images: [{ before: '', label: '关闭散射' }, { after: '', label: '开启散射' }], caption: '大气散射开关对比' },
    ],
  },
  {
    id: 'pb-cloud-lighting', title: '云层光照系统',
    description: '多级散射光照近似 + Beer\'s Law 吸收，实现云层明暗过渡。',
    tags: ['rendering', 'shader', 'ue5'], year: '2024', mediaType: 'image',
    thumbnail: '', featuredId: 'fp-volumetric-cloud',
    detailSections: [
      { type: 'h2', text: '光照模型' },
      { type: 'text', content: '云层光照采用多级散射近似算法。顶层的云朵受到太阳直射光，而深层云体则通过多次散射和环境光来照亮。结合 Beer\'s Law 吸收定律，实现从明亮云顶到暗色云底的自然过渡。' },
      { type: 'h3', text: 'Beer\'s Law' },
      { type: 'text', content: '光在介质中的衰减符合指数规律。云层越厚、密度越高，光衰减越显著，产生自然的光照梯度。' },
      { type: 'h2', text: '实时动态' },
      { type: 'text', content: '光照系统完全支持动态时间变化（TOD），太阳方向可实时改变，所有光照计算在 GPU 端完成，无需预烘焙。' },
    ],
  },
  {
    id: 'pb-cloud-optimization', title: '性能优化方案',
    description: 'Temporal Reprojection + 降采样 + 分帧更新，4K 下稳定 60fps。',
    tags: ['ue5', 'rendering', 'tool'], year: '2024', mediaType: 'text',
    thumbnail: '', featuredId: 'fp-volumetric-cloud',
    detailSections: [
      { type: 'h2', text: '优化策略概览' },
      { type: 'text', content: '体积云渲染是 GPU 密集型操作，在 4K 分辨率下每一帧需要数百万次密度采样。以下三个核心策略将性能提升了 3 倍以上。' },
      { type: 'h3', text: '1. Temporal Reprojection' },
      { type: 'text', content: '利用上一帧的渲染结果，通过深度重投影将历史数据映射到当前帧。可减少 50% 的新采样需求，同时提高有效采样密度。' },
      { type: 'h3', text: '2. 降采样渲染' },
      { type: 'text', content: '云层以半分辨率（1080p）渲染，然后通过 Joint Bilateral Upsampling 上采样到 4K。利用全分辨率深度缓冲作为引导，保持边缘锐度。' },
      { type: 'h3', text: '3. 分帧更新' },
      { type: 'text', content: '将 Ray Marching 步数分摊到 2-4 帧。每帧只计算部分采样点，利用 Temporal 累积保持画面质量。' },
      { type: 'h2', text: '性能数据' },
      { type: 'text', content: '优化前：4K 约 28fps，GPU 占用 95%\n优化后：4K 稳定 60fps，GPU 占用约 60%\n性能提升：2.1x，GPU 负载降低 35%' },
    ],
  },
  {
    id: 'pb-building-hda', title: 'Houdini HDA 资产设计',
    description: '参数化建筑 HDA 的节点网络设计，支持古典/现代/未来三种风格切换。',
    tags: ['procedural', 'tool'], year: '2024', mediaType: 'gif',
    thumbnail: '', featuredId: 'fp-procedural-building',
    detailSections: [
      { type: 'h2', text: 'HDA 架构设计' },
      { type: 'text', content: 'Houdini Digital Asset（HDA）将复杂的程序化生成逻辑封装为可参数化调用的资产。本方案设计了支持三种建筑风格、20+ 可调参数的 HDA。' },
      { type: 'h3', text: '节点网络' },
      { type: 'text', content: '基础几何体 → 楼层分割 → 墙体生成 → 窗户分布 → 阳台/装饰添加 → UV 展开 → 材质分配。每个阶段通过 Switch 节点支持多风格分支。' },
      { type: 'h2', text: '可调参数' },
      { type: 'text', content: '建筑宽度/深度、楼层数、层高、窗户密度、窗户样式（3种）、阳台概率、屋顶样式（平顶/坡顶）、装饰复杂度等 20+ 参数。' },
    ],
  },
  {
    id: 'pb-building-pdg', title: 'PDG 批量生成管线',
    description: '基于 Houdini PDG 的批量城市建筑生成，支持分区配置与自动化导出。',
    tags: ['procedural', 'tool'], year: '2024', mediaType: 'video',
    thumbnail: '', featuredId: 'fp-procedural-building',
    detailSections: [
      { type: 'h2', text: 'PDG 工作流' },
      { type: 'text', content: 'Procedural Dependency Graph（PDG）是 Houdini 的批量处理框架。通过定义任务节点和依赖关系，可并行生成数百栋建筑。' },
      { type: 'h3', text: '分区配置' },
      { type: 'text', content: '每个城市区块通过 CSV/JSON 配置文件定义：建筑风格分布比例、高度限制范围、密度参数、LOD 要求等。PDG 自动分配任务到多核/多机。' },
      { type: 'h2', text: '自动化导出' },
      { type: 'text', content: '生成完成后自动执行：碰撞体生成 → LOD 减面 → 材质烘焙 → FBX/USD 导出 → UE5 DataTable 写入。全流程无人值守。' },
    ],
  },
  {
    id: 'pb-building-ue5', title: 'UE5 集成工作流',
    description: 'HDA 参数表 → UE5 DataTable → 自动放置的完整关卡搭建流程。',
    tags: ['ue5', 'tool', 'procedural'], year: '2024', mediaType: 'image',
    thumbnail: '', featuredId: 'fp-procedural-building',
    detailSections: [
      { type: 'h2', text: '数据流' },
      { type: 'text', content: 'Houdini 导出 JSON/CSV → UE5 导入为 DataTable → 关卡 Blueprint 读取 DataTable → 自动生成 Actor 并放置到对应位置。' },
      { type: 'h3', text: '一键更新' },
      { type: 'text', content: '修改 Houdini 参数后重新导出 → UE5 检测 DataTable 变化 → 自动重建关卡中的建筑。无需手动操作，迭代效率提升 10 倍。' },
    ],
  },
  {
    id: 'pb-water-gerstner', title: 'Gerstner 波形算法',
    description: '多层 Gerstner 波叠加实现风格化水面运动，每层独立配置波长、振幅、速度与方向。',
    tags: ['shader', 'rendering'], year: '2023', mediaType: 'code',
    thumbnail: '', featuredId: 'fp-stylized-water',
    detailSections: [
      { type: 'h2', text: 'Gerstner Wave 原理' },
      { type: 'text', content: 'Gerstner 波是正弦波的扩展，每个顶点不仅有垂直位移，还有水平位移（向波峰汇聚），从而产生更真实的尖锐波峰和宽阔波谷。' },
      { type: 'h3', text: '公式' },
      { type: 'text', content: 'X = X0 - Σ(Qi * Ai * Di.x * cos(...))\nY = Σ(Ai * cos(...))\nZ = Z0 - Σ(Qi * Ai * Di.y * cos(...))\n其中 Q 为陡度参数，A 为振幅，D 为方向向量。' },
      { type: 'h2', text: '核心代码' },
      { type: 'code', language: 'HLSL', snippet: `float3 GerstnerWave(float3 pos, float amp, float dirX, float dirY, float speed, float waveLen) {
  float freq = 2.0 / waveLen;
  float phase = speed * freq;
  float2 dir = normalize(float2(dirX, dirY));
  float cosVal = dot(dir, pos.xz) * freq + _Time.y * phase;
  float sinVal = sin(cosVal);
  pos.x += dir.x * amp * sinVal;
  pos.z += dir.y * amp * sinVal;
  pos.y += amp * cos(cosVal);
  return pos;
}`, caption: '单层 Gerstner Wave 实现' },
      { type: 'h2', text: '多层叠加' },
      { type: 'text', content: '通过叠加 8 层不同波长、振幅和方向的 Gerstner 波，产生丰富的海面细节。长波定义大尺度起伏，短波添加细节波纹。' },
    ],
  },
  {
    id: 'pb-water-sss', title: '次表面散射近似',
    description: '基于深度与视角的 SSS 近似计算，实现浅水/深水自然颜色过渡。',
    tags: ['shader', 'rendering'], year: '2023', mediaType: 'comparison',
    thumbnail: '', featuredId: 'fp-stylized-water',
    detailSections: [
      { type: 'h2', text: 'SSS 近似方法' },
      { type: 'text', content: '次表面散射（Subsurface Scattering）是光进入半透明介质后内部散射再出射的现象。水体的 SSS 使浅水呈现青绿色，深水呈现深蓝色。' },
      { type: 'h3', text: '深度驱动' },
      { type: 'text', content: '通过场景深度差计算水体厚度，薄水区（岸边）青色偏绿，厚水区（深海）深蓝。过渡区域的色彩由深度值插值决定。' },
      { type: 'h2', text: '效果对比' },
      { type: 'comparison', images: [{ before: '', label: '无 SSS' }, { after: '', label: '有 SSS' }], caption: 'SSS 开关对比' },
    ],
  },
  {
    id: 'pb-water-foam', title: '动态泡沫生成',
    description: '基于深度检测与波峰分析的动态泡沫遮罩，支持岸边与波浪泡沫。',
    tags: ['shader', 'vfx'], year: '2023', mediaType: 'gif',
    thumbnail: '', featuredId: 'fp-stylized-water',
    detailSections: [
      { type: 'h2', text: '泡沫生成机制' },
      { type: 'text', content: '水面泡沫主要分为两种类型：岸边泡沫（由水深渐变触发）和波浪泡沫（由波峰检测触发）。通过不同遮罩叠加产生最终效果。' },
      { type: 'h3', text: '岸边泡沫' },
      { type: 'text', content: '基于场景深度差检测水深。当水深小于阈值时生成泡沫遮罩，遮罩强度随水深线性衰减，产生自然的岸边过渡。' },
      { type: 'h3', text: '波浪泡沫' },
      { type: 'text', content: '检测 Gerstner 波的波峰位置（sinVal > 0.85 的区域），在波峰处生成泡沫条纹。泡沫随波形运动自然消散，加入噪声扰动避免规律感。' },
    ],
  },
]

// ========== Tag Categories ==========
export const tagCategories = [
  { id: 'all', label: '全部' },
  { id: 'ue5', label: 'UE5' },
  { id: 'rendering', label: '渲染研究' },
  { id: 'vfx', label: 'VFX' },
  { id: 'procedural', label: '程序化生成' },
  { id: 'shader', label: 'Shader' },
  { id: 'tool', label: '工具开发' },
]

// ========== Footer Contact ==========
export const footerData = {
  title: "Let's Build\nSomething Together",
  subtitle: '如果你对技术美术有同样的热情，欢迎联系我。',
  email: 'hello@example.com',
  social: [
    { label: 'GitHub', href: '#' },
    { label: 'ArtStation', href: '#' },
    { label: 'Bilibili', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
}
````

### `src/App.jsx`

````jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import FeaturedProjects from './components/FeaturedProjects'
import TechLibrary from './components/TechLibrary'
import Footer from './components/Footer'
import { featuredProjects } from './data'

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'tech'
  const [techInitialBlock, setTechInitialBlock] = useState(null)
  const [lastFeaturedId, setLastFeaturedId] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)

  // 导航到技术库
  const goToTech = (block = null) => {
    if (block) setTechInitialBlock(block)
    setView('tech')
  }

  // 返回首页
  const goHome = (sectionId) => {
    setTechInitialBlock(null)
    setView('home')
    if (sectionId && sectionId !== '#top') {
      setTimeout(() => {
        const el = document.querySelector(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 550)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // 从精选项目点技术点 → 跳转技术库
  const handleOpenTechBlock = (block, fid) => {
    setLastFeaturedId(fid)
    setSelectedProject(null) // 关闭弹窗
    goToTech(block)
  }

  // 从技术库返回精选项目（恢复弹窗）
  const backToFeatured = () => {
    setTechInitialBlock(null)
    setView('home')
    const proj = featuredProjects.find(p => p.id === lastFeaturedId)
    if (proj) setSelectedProject(proj)
  }

  return (
    <>
      <Navbar currentView={view} onNavigate={(sectionId) => {
        if (sectionId === '#tech-blocks') {
          goToTech()
        } else {
          goHome(sectionId)
        }
      }} />

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div
            key="home"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <main>
              <Hero />
              <About />
              <FeaturedProjects
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                onOpenTechLibrary={() => goToTech()}
                onOpenTechBlock={handleOpenTechBlock}
              />
            </main>
            <Footer />
          </motion.div>
        ) : (
          <motion.div
            key="tech"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <TechLibrary
              onBackHome={() => goHome(null)}
              initialBlock={techInitialBlock}
              openedFromFeatured={!!techInitialBlock}
              onBackToFeatured={backToFeatured}
              onConsumeInitial={() => setTechInitialBlock(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
````

### `src/components/Navbar.jsx`

````jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navLinks } from '../data'

export default function Navbar({ currentView = 'home', onNavigate }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (link, e) => {
    e.preventDefault()
    setMobileOpen(false)
    onNavigate?.(link.href)
  }

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="navbar"
      style={{
        '--nav-bg': scrolled || currentView === 'tech' ? 'rgba(10,10,10,0.9)' : 'transparent',
        '--nav-border': scrolled || currentView === 'tech' ? 'rgba(255,255,255,0.06)' : 'transparent',
      }}
    >
      <div className="container navbar-inner">
        {/* Logo */}
        <a href="#" className="navbar-logo" onClick={(e) => { e.preventDefault(); onNavigate?.('#top') }}>
          <span className="logo-text">FOFO</span>
          <span className="logo-dot">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="navbar-links">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${currentView === 'tech' && link.href === '#tech-blocks' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(link, e)}
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" className="nav-cta" onClick={(e) => handleNavClick({ href: '#contact' }, e)}>
            <span className="nav-cta-text">Contact</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button className="navbar-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="navbar-mobile-menu"
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="mobile-nav-link" onClick={(e) => handleNavClick(link, e)}>
                {link.label}
              </a>
            ))}
            <a href="#contact" className="mobile-nav-cta" onClick={(e) => handleNavClick({ href: '#contact' }, e)}>
              Contact
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: var(--nav-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--nav-border);
          transition: background 0.3s, border-color 0.3s;
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--nav-height);
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 2px;
          z-index: 100;
          cursor: pointer;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .logo-dot {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-tertiary);
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: var(--space-xl);
        }

        .nav-link {
          font-size: 14px;
          font-weight: 400;
          color: var(--text-secondary);
          transition: color 0.2s;
          position: relative;
          cursor: pointer;
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .nav-link.active {
          color: var(--text-primary);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 100%;
          height: 1px;
          background: var(--text-primary);
          transition: right 0.3s var(--ease-out);
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          right: 0;
        }

        .nav-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border: 1px solid var(--border-default);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          transition: all 0.3s var(--ease-out);
          cursor: pointer;
        }

        .nav-cta:hover {
          border-color: var(--text-secondary);
          background: rgba(255,255,255,0.05);
        }

        .nav-cta svg {
          transition: transform 0.3s var(--ease-out);
        }

        .nav-cta:hover svg {
          transform: translateX(3px);
        }

        .navbar-mobile-btn {
          display: none;
          z-index: 100;
          padding: 8px;
          color: var(--text-primary);
        }

        .navbar-mobile-menu {
          position: fixed;
          top: var(--nav-height);
          left: 0;
          right: 0;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-default);
          padding: var(--space-lg) var(--space-xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .mobile-nav-link {
          font-size: 18px;
          color: var(--text-secondary);
          padding: 12px 0;
          border-bottom: 1px solid var(--border-subtle);
          transition: color 0.2s;
          cursor: pointer;
        }

        .mobile-nav-link:hover {
          color: var(--text-primary);
        }

        .mobile-nav-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          border: 1px solid var(--border-default);
          border-radius: 100px;
          font-size: 15px;
          font-weight: 500;
          color: var(--text-primary);
          margin-top: var(--space-sm);
          transition: all 0.3s;
          cursor: pointer;
        }

        .mobile-nav-cta:hover {
          background: rgba(255,255,255,0.05);
        }

        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .navbar-mobile-btn { display: flex; align-items: center; justify-content: center; }
        }
      `}</style>
    </motion.header>
  )
}
````

### `src/components/Hero.jsx`

````jsx
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { heroData } from '../data'

// ========== 眼动颜文字 ==========
function EyeTrackingEmoji() {
  const containerRef = useRef(null)
  const [eyeOffset, setEyeOffset] = useState({ leftX: 0, leftY: 0, rightX: 0, rightY: 0 })

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    // 眼睛相对于光标的偏移，限制在 ±4px
    const maxMove = 4
    const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 80)) * maxMove
    const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 80)) * maxMove
    setEyeOffset({ leftX: dx, leftY: dy, rightX: dx, rightY: dy })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <motion.div
      ref={containerRef}
      className="hero-emoji"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="emoji-part">{heroData.emoji.left}</span>
      <span
        className="emoji-eye"
        style={{ transform: `translate(${eyeOffset.leftX}px, ${eyeOffset.leftY}px)` }}
      >
        {heroData.emoji.leftEye}
      </span>
      <span className="emoji-part">{heroData.emoji.mouth}</span>
      <span
        className="emoji-eye"
        style={{ transform: `translate(${eyeOffset.rightX}px, ${eyeOffset.rightY}px)` }}
      >
        {heroData.emoji.rightEye}
      </span>
      <span className="emoji-part">{heroData.emoji.right}</span>
    </motion.div>
  )
}

// ========== 跳动字母 ==========
function BouncingText({ text, delay = 0 }) {
  return (
    <span className="bouncing-text">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className={`bouncing-char ${char === ' ' ? 'space' : ''}`}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: delay + i * 0.04,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          // 持续的微浮动
          whileHover={{
            y: -8,
            transition: { type: 'spring', stiffness: 400, damping: 10 },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

export default function Hero() {
  const videoRef = useRef(null)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => setVideoError(true))
    }
  }, [])

  return (
    <section className="hero-section" id="home">
      {/* Background */}
      <div className="hero-bg">
        {!videoError && (
          <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline onError={() => setVideoError(true)}>
            {heroData.videoSrc && <source src={heroData.videoSrc} type="video/mp4" />}
          </video>
        )}
        <div className="hero-bg-overlay" />
        <div className="hero-bg-grain" />
      </div>

      {/* Content */}
      <div className="container hero-content">
        {/* 颜文字 */}
        <EyeTrackingEmoji />

        {/* 标题 */}
        <div className="hero-text">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hero-welcome"
          >
            {heroData.subtitle}
          </motion.p>

          {/* 跳动标题 */}
          <h1 className="hero-title">
            <div className="hero-title-line">
              <BouncingText text={heroData.greeting} delay={0.4} />
            </div>
            <div className="hero-title-prefix">
              <BouncingText text={heroData.namePrefix} delay={0.7} />
            </div>
            <div className="hero-title-name">
              <BouncingText text={heroData.nameHighlight} delay={1.0} />
            </div>
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="hero-desc"
          >
            {heroData.label}
            <span className="hero-desc-dot"> · </span>
            {heroData.desc}
          </motion.p>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 700px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.5;
        }

        .hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% 40%,
            rgba(30, 30, 30, 0.3) 0%,
            rgba(10, 10, 10, 0.7) 60%,
            rgba(10, 10, 10, 0.95) 100%
          );
        }

        .hero-bg-grain {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 256px 256px;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        /* ===== 颜文字 ===== */
        .hero-emoji {
          display: inline-flex;
          align-items: center;
          gap: 0;
          font-size: 52px;
          font-weight: 300;
          color: var(--text-primary);
          margin-bottom: var(--space-2xl);
          line-height: 1;
          user-select: none;
          cursor: default;
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.08));
        }

        .emoji-part {
          display: inline-block;
          transition: none;
        }

        .emoji-eye {
          display: inline-block;
          transition: transform 0.08s ease-out;
          will-change: transform;
        }

        /* ===== Title ===== */
        .hero-text {
          max-width: 1000px;
        }

        .hero-welcome {
          font-size: 16px;
          font-weight: 400;
          color: var(--text-tertiary);
          text-transform: lowercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-md);
        }

        .hero-title {
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: -0.03em;
          margin-bottom: var(--space-lg);
        }

        .hero-title-line {
          display: flex;
          flex-wrap: wrap;
          font-size: clamp(40px, 6vw, 80px);
          color: var(--text-primary);
          font-weight: 300;
        }

        .hero-title-prefix {
          display: flex;
          flex-wrap: wrap;
          font-size: clamp(36px, 5vw, 64px);
          color: var(--text-primary);
          font-weight: 300;
        }

        .hero-title-name {
          font-size: clamp(90px, 16vw, 200px);
          color: var(--text-primary);
          font-weight: 600;
          line-height: 0.9;
          margin-top: -0.02em;
        }

        /* Bouncing chars */
        .bouncing-text {
          display: inline-flex;
          flex-wrap: wrap;
        }

        .bouncing-char {
          display: inline-block;
          cursor: default;
          transition: color 0.2s;
        }

        .bouncing-char:hover {
          color: #fff;
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }

        .bouncing-char.space {
          width: 0.3em;
        }

        /* Description */
        .hero-desc {
          font-size: clamp(14px, 1.5vw, 16px);
          font-weight: 400;
          line-height: 1.6;
          color: var(--text-secondary);
          max-width: 520px;
        }

        .hero-desc-dot {
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .hero-emoji {
            font-size: 36px;
          }
          .hero-title-line {
            font-size: clamp(36px, 10vw, 60px);
          }
        }
      `}</style>
    </section>
  )
}
````

### `src/components/About.jsx`

````jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aboutData } from '../data'
import { Mail, MapPin } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

// 筛选出不含"软件"的 tab 用于 tab 切换
const tabs = aboutData.experienceSections.filter(s => !s.title.includes('软件'))

export default function About() {
  const [activeTab, setActiveTab] = useState(0)

  // 软件数据
  const software = aboutData.software || { left: [], right: [] }

  return (
    <section className="about-section" id="about">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="about-grid"
        >
          {/* Left: Avatar & Quick Info */}
          <motion.div className="about-left" variants={fadeInUp} custom={0}>
            <div className="about-avatar-wrapper">
              {aboutData.avatar ? (
                <img src={aboutData.avatar} alt={aboutData.name} className="about-avatar" />
              ) : (
                <div className="about-avatar-placeholder">
                  <span>FP</span>
                </div>
              )}
            </div>

            <h2 className="about-name">{aboutData.name}</h2>
            <p className="about-role">{aboutData.title}</p>

            <div className="about-contact-links">
              <a href={`mailto:${aboutData.contact.email}`} className="about-contact-item">
                <Mail size={15} />
                <span>{aboutData.contact.email}</span>
              </a>
              <div className="about-contact-item">
                <MapPin size={15} />
                <span>{aboutData.contact.location}</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Bio + Tabs + Software */}
          <motion.div className="about-right" variants={fadeInUp} custom={0.1}>
            <p className="section-label">About Me</p>
            <p className="about-bio">{aboutData.bio}</p>

            {/* Experience Tabs */}
            <div className="experience-section">
              <div className="experience-tabs">
                {tabs.map((section, i) => (
                  <button
                    key={i}
                    className={`experience-tab ${activeTab === i ? 'active' : ''}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {section.title}
                    {activeTab === i && (
                      <motion.div
                        className="experience-tab-indicator"
                        layoutId="tab-indicator"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  className="experience-content"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {tabs[activeTab].items.map((item, j) => (
                    <div key={j} className="experience-item">
                      <div className="experience-item-header">
                        <span className="experience-role">{item.role}</span>
                        <span className="experience-period">{item.period}</span>
                      </div>
                      {item.company && (
                        <span className="experience-company">{item.company}</span>
                      )}
                      <p className="experience-desc">{item.description}</p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Software — always visible */}
            <div className="software-section">
              <p className="software-label">擅长软件</p>
              <div className="software-grid">
                {/* Left: Main Software */}
                <div className="software-col">
                  <p className="software-col-title">软件</p>
                  <div className="software-list">
                    {software.left.map((s, i) => (
                      <div key={i} className="software-item">
                        <span className="software-name">{s.name}</span>
                        {s.years && <span className="software-years">{s.years}</span>}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Right: Modules */}
                <div className="software-col">
                  <p className="software-col-title">擅长模块</p>
                  <div className="software-modules">
                    {software.right.map((s, i) => (
                      <span key={i} className="software-module-tag">{s.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        .about-section {
          padding: var(--space-5xl) 0;
          background: var(--bg-primary);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: var(--space-5xl);
          align-items: start;
        }

        /* Left Column */
        .about-left {
          position: sticky;
          top: calc(var(--nav-height) + var(--space-2xl));
        }

        .about-avatar-wrapper {
          width: 240px; height: 240px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: var(--space-xl);
          border: 1px solid var(--border-default);
        }

        .about-avatar {
          width: 100%; height: 100%; object-fit: cover;
        }

        .about-avatar-placeholder {
          width: 100%; height: 100%;
          background: var(--bg-card);
          display: flex; align-items: center; justify-content: center;
          font-size: 56px; font-weight: 300;
          color: var(--text-muted); letter-spacing: -.02em;
        }

        .about-name {
          font-size: 28px; font-weight: 400;
          letter-spacing: -.02em; color: var(--text-primary); margin-bottom: 4px;
        }

        .about-role {
          font-size: 14px; color: var(--text-tertiary); margin-bottom: var(--space-lg);
        }

        .about-contact-links {
          display: flex; flex-direction: column; gap: var(--space-sm);
        }

        .about-contact-item {
          display: flex; align-items: center; gap: var(--space-sm);
          font-size: 13px; color: var(--text-secondary); transition: color .2s;
        }

        a.about-contact-item:hover { color: var(--text-primary); }

        /* Right Column */
        .about-bio {
          font-size: 15px; line-height: 1.75;
          color: var(--text-secondary); margin-bottom: var(--space-lg); max-width: 600px;
        }

        /* Experience Tabs */
        .experience-section { margin-bottom: var(--space-2xl); }

        .experience-tabs {
          display: flex; gap: 0; margin-bottom: var(--space-xl);
          border-bottom: 1px solid var(--border-default);
        }

        .experience-tab {
          position: relative; padding: 12px 20px;
          font-size: 13px; font-weight: 400;
          color: var(--text-tertiary); transition: color .25s;
        }

        .experience-tab:hover { color: var(--text-secondary); }
        .experience-tab.active { color: var(--text-primary); }

        .experience-tab-indicator {
          position: absolute; bottom: -1px; left: 0; right: 0;
          height: 1px; background: var(--text-primary);
        }

        .experience-content {
          display: flex; flex-direction: column; gap: var(--space-lg);
        }

        .experience-item {
          padding-bottom: var(--space-lg); border-bottom: 1px solid var(--border-subtle);
        }

        .experience-item:last-child { border-bottom: none; padding-bottom: 0; }

        .experience-item-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;
        }

        .experience-role { font-size: 14px; font-weight: 500; color: var(--text-primary); }
        .experience-period { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
        .experience-company { font-size: 13px; color: var(--text-tertiary); }
        .experience-desc {
          font-size: 13px; line-height: 1.65; color: var(--text-secondary); margin-top: var(--space-sm);
        }

        /* Software — always visible */
        .software-section {
          border-top: 1px solid var(--border-default);
          padding-top: var(--space-2xl);
        }

        .software-label {
          font-family: var(--font-mono);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-tertiary);
          margin-bottom: var(--space-lg);
        }

        .software-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-2xl);
        }

        .software-col-title {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: var(--space-md);
        }

        .software-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .software-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--border-subtle);
        }

        .software-name {
          font-size: 14px;
          color: var(--text-primary);
        }

        .software-years {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-muted);
        }

        .software-modules {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .software-module-tag {
          font-family: var(--font-mono);
          font-size: 12px;
          padding: 8px 16px;
          border: 1px solid var(--border-default);
          border-radius: 8px;
          color: var(--text-secondary);
          transition: all .2s;
        }

        .software-module-tag:hover {
          border-color: var(--text-muted);
          color: var(--text-primary);
          background: rgba(255,255,255,.02);
        }

        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr; gap: var(--space-2xl); }
          .about-left { position: static; text-align: center; }
          .about-avatar-wrapper { margin: 0 auto var(--space-xl); }
          .about-contact-links { align-items: center; }
          .experience-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .experience-tab { white-space: nowrap; flex-shrink: 0; }
          .software-grid { grid-template-columns: 1fr; gap: var(--space-xl); }
        }
      `}</style>
    </section>
  )
}
````

### `src/components/FeaturedProjects.jsx`

````jsx
import { motion } from 'framer-motion'
import { Play, ArrowDownRight, X, ArrowRight } from 'lucide-react'
import { featuredProjects, techBlocks } from '../data'

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

// 精选项目卡片（错落布局的一项）
function FeaturedCard({ project, index, onClick }) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      className={`featured-card ${isEven ? 'left-media' : 'right-media'}`}
      variants={fadeInUp}
      custom={index * 0.12}
    >
      {/* Media Side */}
      <div className="featured-media" onClick={() => onClick(project)}>
        {project.featuredImage ? (
          <img src={project.featuredImage} alt={project.title} className="featured-img" />
        ) : (
          <div className="featured-placeholder">
            {project.videoSrc ? (
              <video src={project.videoSrc} muted loop playsInline className="featured-video" />
            ) : (
              <Play size={32} />
            )}
          </div>
        )}
        <div className="featured-media-overlay">
          <div className="featured-view-btn">
            <span>查看详情</span>
            <ArrowDownRight size={18} />
          </div>
        </div>
      </div>

      {/* Text Side */}
      <div className="featured-info" onClick={() => onClick(project)}>
        <p className="featured-number">{String(index + 1).padStart(2, '0')}</p>
        <h3 className="featured-title">{project.title}</h3>
        <p className="featured-subtitle">{project.subtitle}</p>
        <p className="featured-desc">{project.description}</p>
        <div className="featured-keywords">
          {project.techKeywords.map((kw) => (
            <span key={kw} className="featured-keyword">{kw}</span>
          ))}
        </div>
        <div className="featured-tech-count">
          {project.techPoints.length} 个技术点
        </div>
      </div>
    </motion.div>
  )
}

// 精选项目详情弹窗
function FeaturedDetail({ project, onClose, onOpenTechBlock }) {
  const handleTechPointClick = (blockId) => {
    const block = techBlocks.find(b => b.id === blockId)
    if (block) {
      onClose()
      setTimeout(() => onOpenTechBlock(block, project.id), 300)
    }
  }

  if (!project) return null

  const relatedBlocks = techBlocks.filter(b => b.featuredId === project.id)

  return (
    <motion.div
      className="detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="detail-panel"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Header */}
        <div className="detail-header">
          <button className="detail-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Video / Image */}
        <div className="detail-media">
          {project.videoSrc ? (
            <video src={project.videoSrc} controls autoPlay muted loop playsInline className="detail-video" />
          ) : project.featuredImage ? (
            <img src={project.featuredImage} alt={project.title} className="detail-image" />
          ) : (
            <div className="detail-media-placeholder">
              <span>Drop your video or image here</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="detail-body">
          <h2 className="detail-title">{project.title}</h2>
          <p className="detail-subtitle">{project.subtitle}</p>
          <p className="detail-desc">{project.description}</p>

          {/* Tech Points */}
          <div className="detail-tech-section">
            <h3 className="detail-tech-heading">技术点</h3>
            <div className="detail-tech-list">
              {project.techPoints.map((tp) => {
                const block = relatedBlocks.find(b => b.id === tp.blockId)
                return (
                  <button
                    key={tp.id}
                    className="detail-tech-item"
                    onClick={() => handleTechPointClick(tp.blockId)}
                  >
                    <div className="detail-tech-item-header">
                      <span className="detail-tech-title">{tp.title}</span>
                      <ArrowDownRight size={16} />
                    </div>
                    <p className="detail-tech-summary">{tp.summary}</p>
                    <span className="detail-tech-jump">点击查看详情 → 跳转至下方项目块</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .detail-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0, 0, 0, 0.92);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: var(--space-3xl) var(--space-xl);
          overflow-y: auto;
          contain: layout style paint;
        }

        .detail-panel {
          width: 100%;
          max-width: 1000px;
          background: var(--bg-primary);
          border: 1px solid var(--border-default);
          border-radius: 16px;
          overflow: hidden;
          margin: auto;
          will-change: transform, opacity;
        }

        .detail-header {
          display: flex;
          justify-content: flex-end;
          padding: var(--space-md) var(--space-xl);
        }

        .detail-close {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid var(--border-default);
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .detail-close:hover {
          color: var(--text-primary);
          border-color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
        }

        .detail-media {
          width: 100%;
          aspect-ratio: 16/9;
          background: var(--bg-primary);
          overflow: hidden;
        }

        .detail-video,
        .detail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-media-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 14px;
        }

        .detail-body {
          padding: var(--space-2xl);
        }

        .detail-title {
          font-size: 28px;
          font-weight: 400;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .detail-subtitle {
          font-size: 14px;
          color: var(--text-tertiary);
          margin-bottom: var(--space-lg);
        }

        .detail-desc {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: var(--space-2xl);
        }

        .detail-tech-heading {
          font-family: var(--font-mono);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-tertiary);
          margin-bottom: var(--space-lg);
        }

        .detail-tech-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .detail-tech-item {
          text-align: left;
          padding: var(--space-lg);
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          transition: all 0.3s;
        }

        .detail-tech-item:hover {
          border-color: var(--text-muted);
          background: var(--bg-card-hover);
          transform: translateX(4px);
        }

        .detail-tech-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-sm);
        }

        .detail-tech-title {
          font-size: 15px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .detail-tech-item-header svg {
          color: var(--text-tertiary);
          flex-shrink: 0;
        }

        .detail-tech-summary {
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: var(--space-sm);
        }

        .detail-tech-jump {
          font-size: 11px;
          color: var(--text-muted);
        }
      `}</style>
    </motion.div>
  )
}

export default function FeaturedProjects({ selectedProject, setSelectedProject, onOpenTechLibrary, onOpenTechBlock }) {
  return (
    <>
      <section className="featured-section" id="featured">
        <div className="container">
          {/* Section Header */}
          <motion.div
            className="featured-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <p className="section-label">Featured Works</p>
            <h2 className="section-title">精选项目</h2>
            <p className="featured-header-desc">
              每个项目是一段完整的探索，点击可查看涉及的所有技术点细节。
            </p>
          </motion.div>

          {/* Project Cards - Staggered Layout */}
          <motion.div
            className="featured-list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {featuredProjects.map((project, index) => (
              <FeaturedCard
                key={project.id}
                project={project}
                index={index}
                onClick={setSelectedProject}
              />
            ))}
          </motion.div>

          {/* 技术库入口 */}
          <motion.div
            className="featured-tech-entry"
            initial={{ opacity: 0, y: 30 }}
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
          >
            <button className="tech-entry-btn" onClick={() => onOpenTechLibrary?.()}>
              <div className="tech-entry-left">
                <span className="tech-entry-label">Technical Library</span>
                <span className="tech-entry-title">关于我的技术库</span>
                <span className="tech-entry-desc">{techBlocks.length} 个技术点的完整笔记</span>
              </div>
              <div className="tech-entry-arrow">
                <span>进入技术库</span>
                <ArrowRight size={18} />
              </div>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedProject && (
        <FeaturedDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenTechBlock={onOpenTechBlock}
        />
      )}

      <style>{`
        .featured-section {
          padding: var(--space-5xl) 0;
          background: var(--bg-primary);
        }

        .featured-header {
          margin-bottom: var(--space-4xl);
        }

        .featured-header-desc {
          font-size: 14px;
          color: var(--text-tertiary);
          max-width: 500px;
        }

        .featured-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-5xl);
        }

        /* Featured Card */
        .featured-card {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: var(--space-4xl);
          align-items: center;
          cursor: pointer;
        }

        .featured-card.right-media {
          grid-template-columns: 1fr 1.1fr;
        }

        .featured-card.right-media .featured-media {
          order: 2;
        }

        .featured-card.right-media .featured-info {
          order: 1;
        }

        /* Media */
        .featured-media {
          position: relative;
          aspect-ratio: 16/10;
          border-radius: 12px;
          overflow: hidden;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
        }

        .featured-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s var(--ease-out);
        }

        .featured-card:hover .featured-img {
          transform: scale(1.03);
        }

        .featured-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
        }

        .featured-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.6;
        }

        .featured-media-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s var(--ease-out);
        }

        .featured-card:hover .featured-media-overlay {
          opacity: 1;
        }

        .featured-view-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 100px;
          color: white;
          font-size: 14px;
        }

        /* Info */
        .featured-info {
          padding: var(--space-lg) 0;
        }

        .featured-number {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-tertiary);
          margin-bottom: var(--space-sm);
        }

        .featured-title {
          font-size: 32px;
          font-weight: 400;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .featured-subtitle {
          font-size: 14px;
          color: var(--text-tertiary);
          margin-bottom: var(--space-lg);
        }

        .featured-desc {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: var(--space-lg);
        }

        .featured-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
        }

        .featured-keyword {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 4px 10px;
          border: 1px solid var(--border-default);
          border-radius: 4px;
          color: var(--text-tertiary);
        }

        .featured-tech-count {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .featured-card,
          .featured-card.right-media {
            grid-template-columns: 1fr;
            gap: var(--space-xl);
          }

          .featured-card.right-media .featured-media {
            order: 1;
          }

          .featured-card.right-media .featured-info {
            order: 2;
          }
        }

        /* 技术库入口 */
        .featured-tech-entry {
          margin-top: var(--space-5xl);
          padding-top: var(--space-4xl);
          border-top: 1px solid var(--border-subtle);
        }
        .tech-entry-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-xl);
          padding: var(--space-2xl) var(--space-3xl);
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 16px;
          transition: all 0.4s var(--ease-out);
          text-align: left;
        }
        .tech-entry-btn:hover {
          border-color: var(--text-muted);
          background: var(--bg-card-hover);
          transform: translateY(-2px);
        }
        .tech-entry-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .tech-entry-label {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
        }
        .tech-entry-title {
          font-size: 24px;
          font-weight: 400;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }
        .tech-entry-desc {
          font-size: 13px;
          color: var(--text-tertiary);
        }
        .tech-entry-arrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-tertiary);
          transition: all 0.3s var(--ease-out);
          white-space: nowrap;
        }
        .tech-entry-btn:hover .tech-entry-arrow {
          color: var(--text-primary);
          gap: 12px;
        }
        @media (max-width: 768px) {
          .tech-entry-btn {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-lg);
          }
        }
      `}</style>
    </>
  )
}
````

### `src/components/TechLibrary.jsx`

````jsx
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Play, Code, Image, GitCompare, FileText, ArrowLeft, ArrowRight } from 'lucide-react'
import { techBlocks, tagCategories } from '../data'
import TechBlockDetail from './TechBlockDetail'

const mediaIcons = {
  video: <Play size={13} />, gif: <Play size={13} />,
  comparison: <GitCompare size={13} />, image: <Image size={13} />,
  code: <Code size={13} />, text: <FileText size={13} />,
}
const mediaLabels = {
  video: '视频', gif: '动图', comparison: '对比',
  image: '图片', code: '代码', text: '文字',
}

// 从 block 的 detailSections 中提取所有文本用于搜索
function getSearchableText(block) {
  const parts = [block.title, block.description, ...(block.tags || [])]
  if (block.detailSections) {
    block.detailSections.forEach(s => {
      if (s.text) parts.push(s.text)
      if (s.content) parts.push(s.content)
      if (s.snippet) parts.push(s.snippet)
      if (s.caption) parts.push(s.caption)
    })
  }
  return parts.join(' ').toLowerCase()
}

function BlogCard({ block, index, onClick }) {
  return (
    <motion.article
      className="tl-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      onClick={() => onClick(block)}
    >
      <div className="tl-card-left">
        <div className="tl-card-media-type">
          {mediaIcons[block.mediaType]}
          <span>{mediaLabels[block.mediaType]}</span>
        </div>
        <span className="tl-card-year">{block.year}</span>
      </div>

      <div className="tl-card-body">
        <h3 className="tl-card-title">{block.title}</h3>
        <p className="tl-card-desc">{block.description}</p>
        <div className="tl-card-tags">
          {block.tags.map(t => <span key={t} className="tl-card-tag">{t}</span>)}
        </div>
      </div>

      <div className="tl-card-arrow">
        <ArrowRight size={16} />
      </div>
    </motion.article>
  )
}

export default function TechLibrary({ onBackHome, initialBlock, openedFromFeatured, onBackToFeatured, onConsumeInitial }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState('all')
  const [openBlock, setOpenBlock] = useState(initialBlock || null)

  // 过滤逻辑：标签 + 搜索关键词
  const filtered = useMemo(() => {
    let result = techBlocks
    if (activeTag !== 'all') {
      result = result.filter(b => b.tags.includes(activeTag))
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(b => getSearchableText(b).includes(q))
    }
    return result
  }, [searchQuery, activeTag])

  return (
    <>
      <section className="tl-page">
        <div className="tl-container">
          {/* Header */}
          <div className="tl-header">
            <button className="tl-back" onClick={onBackHome}>
              <ArrowLeft size={16} />
              <span>返回首页</span>
            </button>
            <p className="section-label">Technical Library</p>
            <h1 className="tl-title">关于我的技术库</h1>
            <p className="tl-subtitle">
              {techBlocks.length} 篇技术笔记 · 涵盖渲染、Shader、程序化、工具开发等方向
            </p>
          </div>

          {/* Search + Tags */}
          <div className="tl-controls">
            <div className="tl-search-wrap">
              <Search size={16} className="tl-search-icon" />
              <input
                type="text"
                className="tl-search-input"
                placeholder="搜索关键词、技术、代码片段…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="tl-search-clear" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>

            <div className="tl-tags">
              {tagCategories.map(c => (
                <button
                  key={c.id}
                  className={`tl-tag-btn ${activeTag === c.id ? 'active' : ''}`}
                  onClick={() => setActiveTag(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          <div className="tl-result-count">
            {searchQuery || activeTag !== 'all'
              ? `找到 ${filtered.length} 篇`
              : `共 ${filtered.length} 篇`}
          </div>

          {/* Blog list */}
          <div className="tl-list">
            {filtered.map((b, i) => (
              <BlogCard key={b.id} block={b} index={i} onClick={setOpenBlock} />
            ))}
            {filtered.length === 0 && (
              <motion.div
                className="tl-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Search size={32} />
                <p>没有找到相关内容</p>
                <span>试试其他关键词或标签</span>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Detail */}
      {openBlock && (
        <TechBlockDetail
          block={openBlock}
          onClose={() => {
            // 如果是从精选跳转来的，关闭时消费掉 initialBlock
            if (initialBlock && openBlock.id === initialBlock.id) {
              onConsumeInitial?.()
            }
            setOpenBlock(null)
          }}
          openedFromFeatured={openedFromFeatured || !!initialBlock}
          onBackToFeatured={onBackToFeatured}
        />
      )}

      <style>{`
        .tl-page {
          min-height: 100vh;
          padding: var(--space-5xl) 0 var(--space-4xl);
          background: var(--bg-primary);
        }
        .tl-container {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 var(--space-xl);
        }

        /* Header */
        .tl-header { margin-bottom: var(--space-3xl); }
        .tl-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-tertiary);
          margin-bottom: var(--space-2xl);
          transition: color 0.2s;
        }
        .tl-back:hover { color: var(--text-primary); }
        .tl-title {
          font-size: clamp(36px, 6vw, 56px);
          font-weight: 300;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: var(--space-sm);
        }
        .tl-subtitle {
          font-size: 14px;
          color: var(--text-tertiary);
        }

        /* Controls */
        .tl-controls { margin-bottom: var(--space-xl); }
        .tl-search-wrap {
          position: relative;
          margin-bottom: var(--space-lg);
        }
        .tl-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .tl-search-input {
          width: 100%;
          padding: 14px 44px 14px 44px;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          font-size: 14px;
          font-family: var(--font-sans);
          color: var(--text-primary);
          transition: border-color 0.3s;
          outline: none;
        }
        .tl-search-input::placeholder { color: var(--text-muted); }
        .tl-search-input:focus { border-color: var(--text-muted); }
        .tl-search-clear {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 12px;
          color: var(--text-muted);
          transition: color 0.2s;
        }
        .tl-search-clear:hover { color: var(--text-primary); }

        .tl-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
        }
        .tl-tag-btn {
          font-family: var(--font-mono);
          font-size: 12px;
          padding: 7px 16px;
          border: 1px solid var(--border-default);
          border-radius: 100px;
          color: var(--text-tertiary);
          transition: all 0.3s;
        }
        .tl-tag-btn:hover {
          color: var(--text-primary);
          border-color: var(--text-muted);
        }
        .tl-tag-btn.active {
          color: var(--bg-primary);
          background: var(--text-primary);
          border-color: var(--text-primary);
        }

        .tl-result-count {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-lg);
          border-bottom: 1px solid var(--border-subtle);
        }

        /* Blog cards */
        .tl-list {
          display: flex;
          flex-direction: column;
        }
        .tl-card {
          display: grid;
          grid-template-columns: 140px 1fr 24px;
          gap: var(--space-lg);
          align-items: start;
          padding: var(--space-xl) 0;
          border-bottom: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all 0.3s var(--ease-out);
        }
        .tl-card:hover {
          padding-left: var(--space-md);
          padding-right: var(--space-md);
          background: rgba(255, 255, 255, 0.015);
        }
        .tl-card:hover .tl-card-arrow {
          color: var(--text-primary);
          transform: translateX(4px);
        }
        .tl-card:hover .tl-card-title {
          color: #fff;
        }

        .tl-card-left {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .tl-card-media-type {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
          padding: 4px 10px;
          border: 1px solid var(--border-default);
          border-radius: 100px;
          width: fit-content;
        }
        .tl-card-year {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .tl-card-body {
          min-width: 0;
        }
        .tl-card-title {
          font-size: 20px;
          font-weight: 400;
          letter-spacing: -0.01em;
          color: var(--text-primary);
          margin-bottom: var(--space-sm);
          transition: color 0.3s;
        }
        .tl-card-desc {
          font-size: 13px;
          line-height: 1.65;
          color: var(--text-tertiary);
          margin-bottom: var(--space-md);
        }
        .tl-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tl-card-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          padding: 3px 8px;
          background: var(--bg-card);
          border-radius: 4px;
          color: var(--text-muted);
        }

        .tl-card-arrow {
          color: var(--text-muted);
          display: flex;
          align-items: center;
          padding-top: 2px;
          transition: all 0.3s var(--ease-out);
        }

        /* Empty state */
        .tl-empty {
          text-align: center;
          padding: var(--space-5xl) 0;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
        }
        .tl-empty p {
          font-size: 16px;
          color: var(--text-tertiary);
        }
        .tl-empty span {
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .tl-card {
            grid-template-columns: 1fr;
            gap: var(--space-md);
          }
          .tl-card-left {
            flex-direction: row;
            align-items: center;
          }
          .tl-card-arrow { display: none; }
        }
      `}</style>
    </>
  )
}
````

### `src/components/TechBlockDetail.jsx`

````jsx
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ArrowUp, Play, Code, Image, GitCompare, FileText } from 'lucide-react'

// 对比拖动滑块
function CompareSlider({ images, caption }) {
  const [pos, setPos] = useState(50)
  const ref = useRef(null)
  const drag = useRef(false)
  const onMove = (cx) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos(Math.max(0, Math.min((cx - r.left) / r.width, 1)) * 100)
  }
  return (
    <div className="bd-compare" ref={ref}
      onMouseDown={() => drag.current=true}
      onMouseUp={() => drag.current=false}
      onMouseLeave={() => drag.current=false}
      onMouseMove={e => drag.current && onMove(e.clientX)}>
      <div className="bd-c-bg" style={{backgroundImage:`url(${images[1]?.after||''})`}}/>
      <div className="bd-c-fg" style={{backgroundImage:`url(${images[0]?.before||''})`,clipPath:`inset(0 ${100-pos}% 0 0)`}}/>
      <div className="bd-c-line" style={{left:`${pos}%`}}><div className="bd-c-knob"><GitCompare size={14}/></div></div>
      <div className="bd-c-labels"><span>{images[0]?.label||'Before'}</span><span>{images[1]?.label||'After'}</span></div>
      {caption && <div className="bd-caption">{caption}</div>}
    </div>
  )
}

// 渲染单个 detailSection
function SectionBlock({ section, index }) {
  switch (section.type) {
    case 'h2':
      return <h2 className="bd-h2" id={`s-${index}`}>{section.text}</h2>
    case 'h3':
      return <h3 className="bd-h3" id={`s-${index}`}>{section.text}</h3>
    case 'text':
      return <p className="bd-text">{section.content}</p>
    case 'video':
      return section.src
        ? <div className="bd-media"><video src={section.src} controls muted loop className="bd-video"/>{section.caption && <div className="bd-caption">{section.caption}</div>}</div>
        : <div className="bd-placeholder"><Play size={24}/><span>视频区域</span></div>
    case 'gif':
      return section.src
        ? <div className="bd-media"><img src={section.src} alt="" className="bd-img"/>{section.caption && <div className="bd-caption">{section.caption}</div>}</div>
        : <div className="bd-placeholder"><Play size={24}/><span>动图区域</span></div>
    case 'comparison':
      return <CompareSlider images={section.images} caption={section.caption}/>
    case 'image':
      return section.src
        ? <div className="bd-media"><img src={section.src} alt="" className="bd-img"/>{section.caption && <div className="bd-caption">{section.caption}</div>}</div>
        : <div className="bd-placeholder"><Image size={24}/><span>图片区域</span></div>
    case 'code':
      return (
        <div className="bd-code-wrap">
          <div className="bd-code-bar"><span className="bd-code-lang">{section.language||'Code'}</span></div>
          <pre className="bd-code-pre"><code>{section.snippet}</code></pre>
          {section.caption && <div className="bd-caption">{section.caption}</div>}
        </div>
      )
    default:
      return null
  }
}

export default function TechBlockDetail({ block, onClose, openedFromFeatured, onBackToFeatured }) {
  const contentRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState('')

  // 提取 h2/h3 生成索引
  const headings = (block?.detailSections || [])
    .filter(s => s.type === 'h2' || s.type === 'h3')
    .map((s, i) => ({ id: `s-${i}`, text: s.text, level: s.type }))

  // Scroll spy
  useEffect(() => {
    const el = contentRef.current
    if (!el || headings.length === 0) return
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { setActiveIdx(e.target.id); break }
      }
    }, { rootMargin: '-20% 0px -70% 0px' })
    headings.forEach(h => {
      const target = el.querySelector('#' + h.id)
      if (target) obs.observe(target)
    })
    return () => obs.disconnect()
  }, [headings])

  if (!block) return null

  return (
    <motion.div className="bd-overlay"
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}
      onClick={onClose}>
      <motion.div className="bd-panel"
        initial={{y:60,opacity:0}} animate={{y:0,opacity:1}} exit={{y:60,opacity:0}}
        transition={{duration:0.45,ease:[0.16,1,0.3,1]}}
        onClick={e=>e.stopPropagation()}
        style={{ willChange: 'transform, opacity' }}>

        {/* Top bar */}
        <div className="bd-topbar">
          <div className="bd-topbar-left">
            {openedFromFeatured && (
              <button className="bd-back-btn" onClick={() => { onClose(); setTimeout(onBackToFeatured, 300); }}>
                <ArrowUp size={14}/><span>返回精选项目</span>
              </button>
            )}
          </div>
          <button className="bd-close" onClick={onClose}><X size={20}/></button>
        </div>

        <div className="bd-layout">
          {/* Left sidebar */}
          {headings.length > 0 && (
            <nav className="bd-sidebar">
              <p className="bd-sidebar-label">目录</p>
              {headings.map(h => (
                <button key={h.id}
                  className={`bd-sidebar-link ${h.level} ${activeIdx === h.id ? 'active' : ''}`}
                  onClick={() => {
                    contentRef.current?.querySelector('#' + h.id)?.scrollIntoView({behavior:'smooth',block:'start'})
                  }}>
                  {h.text}
                </button>
              ))}
            </nav>
          )}

          {/* Right content */}
          <div className="bd-content" ref={contentRef}>
            <div className="bd-meta">
              <span className="bd-meta-year">{block.year}</span>
              <span className="bd-meta-type">{block.mediaType}</span>
            </div>
            <h1 className="bd-title">{block.title}</h1>
            <p className="bd-desc">{block.description}</p>

            <div className="bd-tags">
              {block.tags.map(t=><span key={t} className="bd-tag">{t}</span>)}
            </div>

            {block.detailSections.map((s, i) => <SectionBlock key={i} section={s} index={i}/>)}
          </div>
        </div>
      </motion.div>

      <style>{`
        .bd-overlay {
          position:fixed;inset:0;z-index:3000;
          background:rgba(0,0,0,0.94);
          display:flex;align-items:flex-start;justify-content:center;
          padding:var(--space-xl);overflow-y:auto;
          contain:layout style paint;
        }
        .bd-panel {
          width:100%;max-width:1200px;
          background:var(--bg-secondary);
          border:1px solid var(--border-default);border-radius:16px;
          overflow:hidden;margin:auto;
          will-change:transform,opacity;
        }
        .bd-topbar {
          display:flex;align-items:center;justify-content:space-between;
          padding:var(--space-md) var(--space-xl);
          border-bottom:1px solid var(--border-default);
        }
        .bd-topbar-left { display:flex;align-items:center;gap:var(--space-md); }
        .bd-back-btn {
          display:inline-flex;align-items:center;gap:6px;
          padding:6px 14px;border:1px solid var(--border-default);border-radius:100px;
          font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary);transition:all .2s;
        }
        .bd-back-btn:hover { color:var(--text-primary);border-color:var(--text-muted); }
        .bd-back-btn svg { flex-shrink:0; }
        .bd-close {
          width:36px;height:36px;display:flex;align-items:center;justify-content:center;
          border-radius:50%;border:1px solid var(--border-default);
          color:var(--text-secondary);transition:all .2s;
        }
        .bd-close:hover { color:#fff;border-color:var(--text-muted);background:rgba(255,255,255,.05); }

        .bd-layout { display:grid;grid-template-columns:200px 1fr;min-height:0; }

        /* Sidebar */
        .bd-sidebar {
          position:sticky;top:0;
          padding:var(--space-xl);border-right:1px solid var(--border-default);
          max-height:calc(100vh - 80px);overflow-y:auto;align-self:start;
        }
        .bd-sidebar-label {
          font-family:var(--font-mono);font-size:11px;text-transform:uppercase;
          letter-spacing:.1em;color:var(--text-muted);margin-bottom:var(--space-lg);
        }
        .bd-sidebar-link {
          display:block;font-size:13px;color:var(--text-tertiary);
          padding:6px 0;transition:color .2s;text-decoration:none;
          line-height:1.5;border-left:1px solid transparent;padding-left:0;
          text-align:left;width:100%;background:none;border-top:none;border-right:none;border-bottom:none;
          cursor:pointer;font-family:var(--font-sans);
          border-radius:0;
        }
        .bd-sidebar-link.h3 { padding-left:12px;font-size:12px; }
        .bd-sidebar-link:hover { color:var(--text-primary); }
        .bd-sidebar-link.active { color:var(--text-primary); }
        .bd-sidebar-link.active.h3 { border-left-color:var(--text-muted); }

        /* Content */
        .bd-content {
          padding:var(--space-2xl);
          max-height:calc(100vh - 80px);overflow-y:auto;
        }
        .bd-meta {
          display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-sm);
        }
        .bd-meta-year {
          font-family:var(--font-mono);font-size:12px;color:var(--text-tertiary);
        }
        .bd-meta-type {
          font-family:var(--font-mono);font-size:11px;text-transform:uppercase;
          color:var(--text-muted);padding:2px 8px;border:1px solid var(--border-default);border-radius:4px;
        }
        .bd-title {
          font-size:28px;font-weight:400;letter-spacing:-.02em;color:#fff;margin-bottom:var(--space-md);
        }
        .bd-desc {
          font-size:14px;line-height:1.7;color:var(--text-secondary);margin-bottom:var(--space-lg);
        }
        .bd-tags {
          display:flex;flex-wrap:wrap;gap:6px;margin-bottom:var(--space-2xl);
          padding-bottom:var(--space-2xl);border-bottom:1px solid var(--border-default);
        }
        .bd-tag {
          font-family:var(--font-mono);font-size:10px;
          padding:3px 8px;background:var(--bg-primary);border-radius:4px;color:var(--text-muted);
        }

        /* Headings */
        .bd-h2 {
          font-size:20px;font-weight:500;color:#fff;
          margin:var(--space-2xl) 0 var(--space-md);
          padding-top:var(--space-md);
        }
        .bd-h2:first-child { margin-top:0; }
        .bd-h3 {
          font-size:15px;font-weight:500;color:var(--text-primary);
          margin:var(--space-lg) 0 var(--space-sm);
        }
        .bd-text {
          font-size:14px;line-height:1.75;color:var(--text-secondary);margin-bottom:var(--space-md);
          white-space:pre-line;
        }

        /* Media */
        .bd-media { margin:var(--space-lg) 0; }
        .bd-video,.bd-img {
          width:100%;max-height:60vh;object-fit:contain;
          background:var(--bg-primary);border-radius:8px;
        }
        .bd-placeholder {
          aspect-ratio:16/9;display:flex;flex-direction:column;
          align-items:center;justify-content:center;gap:var(--space-sm);
          background:var(--bg-primary);border-radius:8px;
          color:var(--text-muted);font-size:14px;margin:var(--space-lg) 0;
        }
        .bd-caption {
          font-family:var(--font-mono);font-size:12px;color:var(--text-muted);
          text-align:center;margin-top:var(--space-sm);
        }
        .bd-code-wrap { margin:var(--space-lg) 0;background:#0a0a0a;border-radius:8px;overflow:hidden; }
        .bd-code-bar { padding:10px 16px;border-bottom:1px solid #1a1a1a; }
        .bd-code-lang { font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary); }
        .bd-code-pre { padding:var(--space-lg);overflow-x:auto;font-family:var(--font-mono);font-size:12px;line-height:1.6;color:#c0c0c0;max-height:400px;overflow-y:auto; }
        .bd-code-pre code { white-space:pre; }

        /* Compare */
        .bd-compare {
          position:relative;aspect-ratio:16/9;overflow:hidden;cursor:ew-resize;user-select:none;
          margin:var(--space-lg) 0;border-radius:8px;
        }
        .bd-c-bg,.bd-c-fg { position:absolute;inset:0;background-size:cover;background-position:center; }
        .bd-c-line { position:absolute;top:0;bottom:0;width:2px;background:#fff;transform:translateX(-50%);z-index:2; }
        .bd-c-knob { position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:36px;height:36px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#111;box-shadow:0 2px 8px rgba(0,0,0,.3); }
        .bd-c-labels { position:absolute;bottom:10px;left:0;right:0;display:flex;justify-content:space-between;padding:0 12px;z-index:3;pointer-events:none; }
        .bd-c-labels span { font-size:11px;color:rgba(255,255,255,.6);background:rgba(0,0,0,.4);padding:3px 10px;border-radius:100px; }

        @media (max-width:768px) {
          .bd-layout { grid-template-columns:1fr; }
          .bd-sidebar { display:none; }
        }
      `}</style>
    </motion.div>
  )
}
````

### `src/components/Footer.jsx`

````jsx
import { motion } from 'framer-motion'
import { Mail, ArrowRight } from 'lucide-react'
import { footerData } from '../data'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

export default function Footer() {
  return (
    <footer className="footer-section" id="contact">
      <div className="container footer-container">
        <motion.div
          className="footer-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Left - Big Text */}
          <motion.div className="footer-text" variants={fadeInUp}>
            <p className="section-label">Contact</p>
            <h2 className="footer-title">
              {footerData.title.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h2>
            <p className="footer-subtitle">{footerData.subtitle}</p>

            {/* CTA */}
            <a href={`mailto:${footerData.email}`} className="footer-cta">
              <span>Get in Touch</span>
              <ArrowRight size={18} />
            </a>
          </motion.div>

          {/* Right - Links */}
          <motion.div className="footer-right" variants={fadeInUp} custom={0.15}>
            {/* Social Links */}
            <div className="footer-social">
              <p className="footer-social-label">Social</p>
              <div className="footer-social-links">
                {footerData.social.map((s) => (
                  <a key={s.label} href={s.href} className="footer-social-link" target="_blank" rel="noopener noreferrer">
                    {s.label}
                    <ArrowRight size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="footer-contact">
              <a href={`mailto:${footerData.email}`} className="footer-email">
                <Mail size={16} />
                <span>{footerData.email}</span>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="footer-bottom"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          custom={0.3}
        >
          <span className="footer-copy">&copy; {new Date().getFullYear()} Technical Artist. All rights reserved.</span>
        </motion.div>
      </div>

      <style>{`
        .footer-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: var(--bg-primary);
          border-top: 1px solid var(--border-default);
        }

        .footer-container {
          width: 100%;
          padding-top: var(--space-5xl);
          padding-bottom: var(--space-2xl);
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: var(--space-5xl);
          align-items: start;
          margin-bottom: var(--space-5xl);
        }

        .footer-title {
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin-bottom: var(--space-lg);
        }

        .footer-subtitle {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: var(--space-2xl);
          max-width: 400px;
        }

        .footer-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 28px;
          border: 1px solid var(--border-default);
          border-radius: 100px;
          font-size: 15px;
          font-weight: 500;
          color: var(--text-primary);
          transition: all 0.3s var(--ease-out);
        }

        .footer-cta:hover {
          border-color: var(--text-secondary);
          background: rgba(255,255,255,0.05);
          gap: 16px;
        }

        .footer-cta svg {
          transition: transform 0.3s var(--ease-out);
        }

        .footer-cta:hover svg {
          transform: translateX(4px);
        }

        .footer-right {
          padding-top: var(--space-4xl);
        }

        .footer-social-label {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-tertiary);
          margin-bottom: var(--space-md);
        }

        .footer-social-links {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          margin-bottom: var(--space-3xl);
        }

        .footer-social-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid var(--border-default);
          font-size: 15px;
          color: var(--text-secondary);
          transition: all 0.3s;
        }

        .footer-social-link:hover {
          color: var(--text-primary);
          border-bottom-color: var(--text-tertiary);
        }

        .footer-social-link svg {
          opacity: 0;
          transform: translateX(-8px);
          transition: all 0.3s var(--ease-out);
        }

        .footer-social-link:hover svg {
          opacity: 1;
          transform: translateX(0);
        }

        .footer-email {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--text-secondary);
          transition: color 0.2s;
        }

        .footer-email:hover {
          color: var(--text-primary);
        }

        .footer-bottom {
          padding-top: var(--space-lg);
          border-top: 1px solid var(--border-default);
        }

        .footer-copy {
          font-size: 12px;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: var(--space-2xl);
          }
          .footer-right {
            padding-top: 0;
          }
          .footer-title {
            font-size: clamp(32px, 10vw, 48px);
          }
        }
      `}</style>
    </footer>
  )
}
````

---

## 七、美化需求方向（建议 Gemini 重点关注）

### 1. 视觉氛围
- 当前是纯灰阶，可在保持克制的前提下引入一个**低饱和强调色**（如冷青 `#5eead4` 或暖琥珀 `#f5b942` 的极少量点缀），用于 hover/激活态/关键数据
- Hero 背景目前是径向渐变 + 噪点，可增强氛围感（微光晕、视差、缓慢飘动的光斑），但不要喧宾夺主
- 占位态（图片/视频字段为空时）目前较单调，可做成更有设计感的骨架屏或带网格纹理的占位

### 2. 排版与节奏
- 字体层级可再拉开：大标题更轻、正文更稳
- 模块间留白节奏统一，避免某些段落过密
- 等宽字体的使用（标签/编号/代码）可更系统化

### 3. 微交互
- 卡片 hover、按钮 hover 已有基础，可增加更细腻的反馈（光标跟随光晕、磁吸效果、文字渐显）
- 视图切换动画可加一点视差或景深
- 代码块可加语法高亮（目前是纯灰文字）

### 4. 组件细节
- **About** 的经历 Tabs 可加更优雅的指示器动画；软件列表可做成更有层次的展示
- **FeaturedProjects** 错落布局可强化"错落感"（不同卡片尺寸/偏移）
- **TechLibrary** 博客列表可加 hover 时的预览缩略图或标题色变
- **TechBlockDetail** 左侧目录索引的 active 态可更醒目；对比滑块可优化手感

### 5. 性能注意
- 不要在 fixed 全屏遮罩上加 `backdrop-filter: blur()`（已踩坑）
- 动画优先用 `transform` / `opacity`，避免触发 layout
- 大量滚动监听用 `IntersectionObserver` 或 `passive` 事件

---

## 八、不可改动的功能逻辑（务必保留）

1. **数据驱动**：所有内容来自 `src/data.js`，不要把文本写死到组件
2. **双视图切换**：home ↔ tech，`view` 状态在 App 层
3. **状态流闭环**：精选项目详情 → 点技术点 → 右滑进技术库并打开 TechBlockDetail → 点"返回精选项目" → 右滑回 home 并恢复那个精选弹窗。`selectedProject` 和 `techInitialBlock` 必须留在 App 层
4. **搜索功能**：TechLibrary 的搜索要检索标题/描述/标签/以及 detailSections 里的所有正文和代码
5. **颜文字眼动 + 跳动标题**：Hero 的核心交互，保留
6. **竖线**：`body::after` 的贯穿竖线，保留
7. **favicon**：`public/favicon.svg`（颜文字 SVG）
8. **CSS 变量主题**：`--bg-primary` 等变量体系，美化时基于这套变量扩展而非推翻
9. **内联 `<style>` 模式**：各组件用内联 `<style>` 标签管理局部样式（这是当前架构选择，如需改为 CSS Modules 可在文档里说明理由）

---

> 以上为完整交接。请基于此进行视觉与交互美化，保持克制、高级、暗色的基调，不要破坏功能逻辑。
