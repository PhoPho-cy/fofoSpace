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
