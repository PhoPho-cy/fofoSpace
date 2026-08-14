# 内容与编辑器

## 入口

- 首页左下角「内容编辑」，或直接访问 `http://localhost:3000/admin`
- 3D 舞台入口：首页左下角「3D 舞台」（Esc 关闭）

## 可编辑内容

| 分区 | 字段 |
| --- | --- |
| 个人资料 | 姓名、英文名、头衔、学校、届别、所在地、邮箱、微信、头像（图片 URL + 预览）、简介段落、技能标签、经历 |
| 作品 | 标题、封面（图片/视频 URL + 预览）、简介、技术栈标签、详情章节（JSON 高级编辑） |
| 技术文章 | 标题、日期、摘要、正文、关联作品 |
| 章节文字 | 四幕的章节号 / 名称 / 副标题 |
| 3D 舞台 | 模型 URL（GLTF/GLB）、说明 |
| 界面文案 | 品牌名、首页提示 |

## 保存机制

- 开发环境：保存 → 写入 `public/content.json`（vite 中间件 `PUT /api/content`）
- 纯静态部署：自动降级为**下载 content.json**，手动放入 `public/`
- 恢复默认：写回默认内容（文件常驻）
- 重新生成默认文件：`pnpm gen:content`

## 生效

保存后刷新任意页面即生效（运行时 fetch `/content.json` 与默认值合并）。`public/content.json` 已随仓库提交，换设备拉代码即同步内容。

## 注意事项

- 不要手改 `public/content.json` 结构，请用编辑器或 `pnpm gen:content`
- 作品/文章详情 JSON 块类型：`text / image / video / code / compare / mixed / thoughtRef`（见 `src/data.ts` 的 `ProjectBlock`）
- 模型 URL 无效时，3D 舞台自动回退占位场景（不报错）