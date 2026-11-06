# Cloudflare Workers 部署

使用 OpenNext 部署 Next.js，仓库已包含 wrangler.jsonc 和 open-next.config.ts。

- 构建命令：`npm run build:cloudflare`
- 部署命令：`npx wrangler deploy`（配置会自动执行 OpenNext 构建；控制台原有 `npm run build` 也可保留）
- 本地预览：`npm run preview`
- 环境变量：`SITE_URL=https://你的域名`，在构建环境和 Worker 运行环境均设置。
- 如需家庭/VPS TikTok 后端，设置 `BACKEND_URL`。
- YouTube 使用独立 Python 后端（现有 api/youtube.py）；设置 `YOUTUBE_BACKEND_URL=https://后端域名`，也可复用 BACKEND_URL。后端需处理 `/api/youtube` 的 GET/POST，并配置原有签名密钥。Workers 本身不会执行 Python、Deno 或 FFmpeg；未配置后端时接口返回 503。

Worker 名称为 video-downloader（与现有 Cloudflare 项目一致）；如 Cloudflare 项目已有不同名称，请同步修改 wrangler.jsonc 的 name。
Python requirements.txt 保留给现有后端部署使用，Cloudflare 自动安装它们不代表这些程序可在 Worker 中执行。

本项目未启用 ISR/R2 缓存；修改静态内容后重新构建发布。
