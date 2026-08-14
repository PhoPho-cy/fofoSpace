import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Plugin, ViteDevServer } from 'vite';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 内容编辑 API（仅开发服务器）：
 * - PUT  /api/content  写入 public/content.json
 * - DELETE /api/content 删除 content.json（恢复默认）
 * 静态部署时编辑器会退化为「下载 JSON」模式。
 */
function contentApiPlugin(): Plugin {
  const contentFile = () => path.resolve(__dirname, 'public/content.json');
  return {
    name: 'content-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/content', (req, res) => {
        if (req.method === 'PUT' || req.method === 'POST') {
          let body = '';
          req.on('data', (c) => (body += c));
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              fs.writeFileSync(contentFile(), JSON.stringify(parsed, null, 2), 'utf8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
            } catch (e) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: String(e) }));
            }
          });
        } else if (req.method === 'DELETE') {
          try {
            if (fs.existsSync(contentFile())) fs.unlinkSync(contentFile());
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: String(e) }));
          }
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), contentApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});