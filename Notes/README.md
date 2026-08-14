# Notes · 文档中心

本目录是 **fofoSpace** 的文档与交接中心，供跨设备、跨人快速接手。

## ⚠️ 强制约束（必须遵守）

1. **每次对本项目做任何更改（代码 / 内容 / 配置 / 依赖）后，必须同步更新本文档**：
   - 在对应主题文件中更新相关章节；
   - 在 `HANDOFF.md` 的「变更记录」追加一行（日期 + 改了什么 + 相关文件）。
   - 更新必须在同一轮工作中完成，不允许“以后再说”。

2. **每次回答 / 交付前，运行一次检查**（检查项见下方「检查清单」），发现问题先修复再交付。

## 检查清单（每次回答时执行）

```bash
pnpm lint                                    # tsc --noEmit
npx tsc --noEmit --noUnusedLocals --noUnusedParameters   # 未使用变量/参数
pnpm build                                   # 生产构建
# 浏览器：全路由（/ /project/* /thoughts /admin + 3D 舞台）无 console error
# 死代码扫描：src 下无未被引用的文件
# 确认 Notes 各文件已同步
```

## 文件索引

| 文件 | 内容 |
| --- | --- |
| `HANDOFF.md` | ★ 交接现状：结构 / 可替换项 / 命令 / 注意事项 / 变更记录 |
| `ARCHITECTURE.md` | 技术栈 / 目录 / 数据流 / 性能优化 |
| `CONTENT.md` | 内容层与编辑器（/admin）使用指南 |
| `THREE.md` | 3D 舞台框架（src/three/） |

> 根目录 `README.md` 为快速入门（命令 + 链接），细节以上述文件为准。