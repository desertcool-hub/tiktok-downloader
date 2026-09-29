/**
 * Node 入口：读取 PORT / HOST 启动 Next 生产服务。
 * 用于 QW Pages 动态部署或任意 Node 主机（npm run start 仍走 next CLI）。
 */
const { createServer } = require('http');
const next = require('next');

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

const app = next({ dev: false, dir: __dirname });

app
  .prepare()
  .then(() => {
    const handler = app.getRequestHandler();
    createServer((req, res) => handler(req, res)).listen(port, host, () => {
      console.log(`> VidSaveNow ready on http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error('failed to start:', err);
    process.exit(1);
  });
