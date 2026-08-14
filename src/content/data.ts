// ============================================================
// FOFO'S SPACE - Content Data
// MY_PROJECTS / TECH_THOUGHTS
// ============================================================

export interface ProjectBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'code' | 'compare' | 'mixed' | 'thoughtRef';
  heading?: string;
  headingLevel?: 'h2' | 'h3';
  content?: string;
  mediaType?: 'image' | 'video' | 'code' | 'compare';
  mediaUrl?: string;
  mediaUrl2?: string;
  codeString?: string;
  thoughtId?: string;
}

export interface Project {
  id: string;
  title: string;
  coverMedia: string;
  shortDesc: string;
  techStack: string[];
  details: ProjectBlock[];
}

export interface TechThought {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  relatedProjects: string[];
}

// ------------------------------------------------------------
// CREATIONS
// ------------------------------------------------------------

export const MY_PROJECTS: Project[] = [
  {
    id: 'volumetric-cloud',
    title: 'VOLUMETRIC CLOUD: 体积云渲染系统',
    coverMedia: '/covers/cover-cloud.svg',
    shortDesc: '基于 Unreal Engine 5 的体积云渲染系统，采用 Ray Marching 与物理模拟结合，实现逼真的大气散射与光影层次。',
    techStack: ['UE5', 'Ray Marching', 'HLSL', 'Niagara'],
    details: [
      {
        id: 'vc-intro',
        type: 'mixed',
        heading: '01 // RAY MARCHING CORE',
        content:
          '从底层出发实现基于物理的体积云采样算法：自定义 Ray Marching 循环、多层云叠加与自阴影计算。每一步步长与抖动策略都针对性能与质量做了平衡。',
        mediaType: 'image',
        mediaUrl: '/covers/cover-cloud.svg',
      },
      {
        id: 'vc-atmosphere',
        type: 'text',
        heading: '02 // ATMOSPHERE SCATTERING',
        content:
          "基于 Rayleigh 与 Mie 散射模型实现大气散射模拟，支持日夜循环与自定义大气参数。配合 Beer's Law 吸收，让云层在逆光下呈现真实的明暗过渡。",
      },
      {
        id: 'vc-performance',
        type: 'text',
        headingLevel: 'h3',
        heading: '03 // PERFORMANCE OPTIMIZATION',
        content:
          '通过 Temporal Reprojection、降采样与分帧更新策略，在 4K 分辨率下稳定保持 60fps，让体积云可以进入实际生产管线。',
      },
      {
        id: 'vc-thought',
        type: 'thoughtRef',
        heading: 'RELATED INSIGHT',
        thoughtId: 'ray-marching-notes',
      },
    ],
  },
  {
    id: 'procedural-building',
    title: 'PROCEDURAL BUILDING: 程序化建筑生成',
    coverMedia: '/covers/cover-building.svg',
    shortDesc: 'Houdini + UE5 联动的程序化建筑生成管线，参数化控制建筑风格、楼层数量与窗墙分布，大幅提升关卡搭建效率。',
    techStack: ['Houdini', 'PDG', 'UE5', 'Python'],
    details: [
      {
        id: 'pb-hda',
        type: 'mixed',
        heading: '01 // HDA ASSET DESIGN',
        content:
          '设计参数化建筑 HDA 的节点网络，支持古典 / 现代 / 未来三种风格切换与细节层级控制，艺术家可以直接在 UE5 中拖入使用。',
        mediaType: 'image',
        mediaUrl: '/covers/cover-building.svg',
      },
      {
        id: 'pb-pdg',
        type: 'text',
        heading: '02 // PDG BATCH PIPELINE',
        content:
          '基于 Houdini PDG 的批量城市生成：分区风格配置、自动化导出，配合 DataTable 与自动摆放，形成完整的 UE5 关卡搭建流程。',
      },
      {
        id: 'pb-ue5',
        type: 'code',
        heading: '03 // UE5 INTEGRATION',
        codeString: `// HDA -> DataTable -> Auto Placement
UPROPERTY(EditAnywhere)
UDataTable* BuildingParams;

void ABuildingSpawner::Generate() {
  for (auto& Row : BuildingParams->GetRowMap()) {
    SpawnBuilding(Row.Value);
  }
}`,
      },
      {
        id: 'pb-thought',
        type: 'thoughtRef',
        heading: 'RELATED INSIGHT',
        thoughtId: 'procedural-pipelines',
      },
    ],
  },
  {
    id: 'stylized-water',
    title: 'STYLIZED WATER: 风格化水面 Shader',
    coverMedia: '/covers/cover-water.svg',
    shortDesc: '多层 Gerstner 波叠加 + 屏幕空间反射 + 次表面散射近似的风格化水面着色器，兼顾风格表现与实时性能。',
    techStack: ['Shader', 'HLSL', 'Gerstner Wave', 'SSR'],
    details: [
      {
        id: 'sw-gerstner',
        type: 'mixed',
        heading: '01 // GERSTNER WAVES',
        content:
          '多层 Gerstner 波叠加实现风格化水面运动，每层独立配置波长、振幅、速度与方向，让水面既有手绘质感又不失流动感。',
        mediaType: 'image',
        mediaUrl: '/covers/cover-water.svg',
      },
      {
        id: 'sw-sss',
        type: 'text',
        heading: '02 // SUBSURFACE SCATTERING',
        content:
          '基于深度与视角的 SSS 近似计算，实现浅水 / 深水颜色自然过渡；深度检测与波峰分析驱动的动态泡沫遮罩，支持岸边与浪花泡沫。',
      },
      {
        id: 'sw-reflect',
        type: 'text',
        headingLevel: 'h3',
        heading: '03 // SCREEN SPACE REFLECTION',
        content:
          '结合屏幕空间反射与菲涅尔混合，在保持风格化基调的同时补充环境反射细节，让水面与场景融为一体。',
      },
      {
        id: 'sw-thought',
        type: 'thoughtRef',
        heading: 'RELATED INSIGHT',
        thoughtId: 'shader-tradeoffs',
      },
    ],
  },
];

// ------------------------------------------------------------
// TECH THOUGHTS
// ------------------------------------------------------------

export const TECH_THOUGHTS: TechThought[] = [
  {
    id: 'ray-marching-notes',
    title: 'RAY MARCHING NOTES',
    date: '2025.11',
    summary: '关于体积云 Ray Marching 的工程笔记：步长、抖动与自阴影如何平衡质量与性能。',
    content:
      'Ray Marching 的核心是把"采样"变成一种可控的工程权衡。\n\n1. 步长策略\n固定步长最稳定，但浪费；自适应步长质量好，但容易在薄云处漏光。最终方案：主步长 + 抖动偏移 + 半分辨率重投影。\n\n2. 自阴影\n每帧多跑一次 march 做自阴影代价太高，改用低分辨率 shadow map 缓存，配合 Beer-Lambert 吸收，逆光时云层暗部立刻有了层次。\n\n3. 时间稳定性\nTemporal Reprojection + 分帧更新，让 4K 下也能稳定 60fps。代价是快速移动时会有轻微拖影，需要加入深度权重抑制。',
    relatedProjects: ['volumetric-cloud'],
  },
  {
    id: 'procedural-pipelines',
    title: 'PROCEDURAL PIPELINES',
    date: '2025.08',
    summary: 'Houdini 程序化资产如何真正进入游戏引擎：从 HDA 设计到 PDG 批量的完整链路。',
    content:
      '程序化管线最容易死在自己手里：参数太多，艺术家不敢动；参数太少，又失去程序化的意义。\n\n1. 参数收敛\nHDA 只暴露 5-8 个核心参数（风格、密度、高度、窗墙比…），其余全部收敛为预设。\n\n2. PDG 作为批处理层\n单栋建筑用 HDA 交互生成，城市级别用 PDG 批量调度，产出 DataTable + 自动摆放数据。\n\n3. 可回放性\n每一次生成都要可复现：种子、版本、参数快照全部落盘，这样回溯问题才不用靠猜。',
    relatedProjects: ['procedural-building'],
  },
  {
    id: 'shader-tradeoffs',
    title: 'SHADER TRADEOFFS',
    date: '2025.05',
    summary: '风格化渲染里那些"看起来简单"的取舍：水面、泡沫与次表面散射。',
    content:
      '风格化不等于简单，而是把复杂度藏在观众注意不到的地方。\n\n水面：多层 Gerstner 波只是骨架，真正的质感来自法线扰动与深度混合。\n\n泡沫：深度检测 + 波峰分析生成动态泡沫遮罩，比贴图泡沫更"活"，代价是每帧多几次采样。\n\nSSS：基于深度与视角的近似，浅水发亮、深水发暗，颜色过渡自然了，物理正确性并不重要。',
    relatedProjects: ['stylized-water'],
  },
];

// ------------------------------------------------------------
// PROFILE —— 个人资料（可在下方替换为你的信息）
// ------------------------------------------------------------

export interface Profile {
  name: string;
  enName: string;
  role: string;
  intro: string[];
  school: string;
  year: string;
  email: string;
  wechat: string;
  location: string;
  /** 头像图片地址；留空时使用内置占位剪影 */
  avatar: string;
  skills: string[];
  experiences: { role: string; company: string; year: string }[];
}

export const PROFILE: Profile = {
  name: 'FOFO',
  enName: "FOFO'S SPACE",
  role: '游戏技术美术 · 数字艺术家',
  intro: [
    '你好，我是 FOFO —— 一位把东方工艺的温度，编织进实时渲染世界的游戏技术美术。',
    '就读于广州美术学院 · 工艺美术学院 · 漆艺专业（2027 届）。在 UE5 / Houdini 的管线里，我寻找程序化与手作感之间的平衡。',
  ],
  school: '广州美术学院 · 工艺美术学院 · 漆艺专业',
  year: '2027 届',
  email: 'hello@fofospace.dev',
  wechat: 'fofo_design',
  location: '中国 · 广州',
  avatar: '',
  skills: ['UE5', 'Houdini', 'Niagara', 'HLSL', '程序化', '实时渲染', '漆艺', '数字艺术'],
  experiences: [
    { role: 'Tech Art Intern', company: 'TENCENT GAMES', year: '2025' },
    { role: 'VFX Artist', company: 'INDIE STUDIO X', year: '2024' },
  ],
};
