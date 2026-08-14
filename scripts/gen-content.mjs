// 从默认内容（src/content/defaults.ts）重新生成 public/content.json
// 用法：pnpm gen:content
import { createServer } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});
try {
  const mod = await server.ssrLoadModule('/src/content/defaults.ts');
  const out = path.join(root, 'public/content.json');
  fs.writeFileSync(out, JSON.stringify(mod.DEFAULT_CONTENT, null, 2) + '\n', 'utf8');
  console.log('generated public/content.json (' + fs.statSync(out).size + ' bytes)');
} finally {
  await server.close();
}