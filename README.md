# VidSaveNow · TikTok 视频下载工具（中文工具站 MVP）

一个 Next.js 全栈实现的 TikTok 视频在线下载工具：粘贴 TikTok 链接 → 自动解析封面/作者/标题/时长 → 提供 MP4（高清无水印/无水印/带水印）下载。

## 功能

- ✅ 支持 TikTok 完整链接与 vt. / vm. / /t/ 分享短链（自动还原）
- ✅ 多解析源容错：TikWM 公共 API（主力）→ TikTok 页面内嵌 JSON 提取（兜底），任一可用即出结果
- ✅ 服务端代理下载：绕过跨域，自动适配 TikTok CDN 请求头（失败自动换请求头重试），支持 Range 断点续传
- ✅ 媒体域名白名单：下载代理只允许 TikTok/TikWM 相关 CDN 域名，防止被当作任意代理（SSRF）
- ✅ 内存限流：单 IP 解析 15 次/分钟、下载 40 次/分钟
- ✅ 手机端优先的极简界面，FAQ（含 JSON-LD 结构化数据，利于 SEO 收录）
- ✅ 页面显著位置免责声明：仅限下载本人拥有版权或已获授权的内容

## 本地运行

```bash
npm install
npm run dev        # 开发模式，http://localhost:3000
```

生产模式：

```bash
npm run build
npm run start
```

> 注意：本机在国内网络下访问 TikTok/TikWM 需要走代理。启动时带上代理环境变量即可：
>
> ```bash
> HTTPS_PROXY=http://127.0.0.1:7897 HTTP_PROXY=http://127.0.0.1:7897 npm run start
> ```

## 部署架构（当前：家庭后端 + QW Pages 前端）

TikTok 与 TikWM 的反爬会拦截数据中心出口 IP（QW Pages / Vercel 等云端运行时解析与回源全部 403），
因此采用前后端分离：

```
用户浏览器
   ↓
QW Pages 前端（standalone 构建，构建期烘入 BACKEND_URL / SITE_URL）
   ↓ /api/parse、/api/download 原样转发
cloudflared 隧道（trycloudflare.com 临时域名）
   ↓
家庭 Mac 后端（localhost:3000，住宅 IP 出口，自行解析与回源）
```

- 同一份代码两种角色：设 `BACKEND_URL` = 接入层（只限流/校验/转发）；不设 = 后端（真解析）。
- 隧道运维：`bash scripts/tunnel.sh` 重启并打印新地址；**quick tunnel 地址每次重启都变**，
  变更后需重烘发布副本并重发（脚本头部有命令）。终态是自有域名 + cloudflared 命名隧道。
- 家庭 Mac 关机/休眠 = 公网站解析不可用；正式运营请迁海外 VPS 作后端。

## 部署（Vercel）

1. 把项目推到 GitHub 仓库
2. 在 [vercel.com](https://vercel.com) 导入仓库，框架自动识别为 Next.js，直接部署
3. Vercel 节点在海外，可直连 TikTok/TikWM，无需代理配置
4. **设置环境变量 `SITE_URL=https://你的域名`**：canonical、hreflang、Open Graph 的绝对 URL 都由它生成（本地默认 `http://localhost:3000`）

也可以部署到任何支持 Node.js 的服务器（`npm run build && npm run start`，默认 3000 端口，用 Nginx/Caddy 反代 + HTTPS）。

## 项目结构

```
app/
├── layout.js              # 根布局 + 基础 meta（深色主题色）
├── globals.css            # 全站样式（移动端优先，无 UI 依赖库）
├── page.js                # / 英文路由：meta + FAQ JSON-LD + <HomeClient locale="en">
├── zh/
│   └── page.js            # /zh 中文路由：meta + FAQ JSON-LD + <HomeClient locale="zh">
└── api/
    ├── parse/route.js     # POST /api/parse  解析视频信息（限流 15 次/分/IP）
    └── download/route.js  # GET  /api/download?u=&name=&inline=1  流式代理下载
components/
└── HomeClient.jsx         # 双语言共用的客户端页面组件（首屏→SEO正文→Why→How to→Mobile→PC→FAQ）
lib/
├── i18n.js                # en / zh 文案词典（改文案只动这里）
├── providers.js           # 解析层：短链还原 + TikWM / 页面提取双 Provider + 域名白名单
└── ratelimit.js           # 内存滑动窗口限流
server.js                  # Node 入口（读 PORT/HOST），用于 QW Pages 等动态部署
```

### 双语与 SEO

- `/` 默认英文（吃 Google 长尾词），`/zh` 中文；两路由互相用 `alternates.languages` + 导航语言按钮互链。
- 每个路由各自输出本页语言的 FAQPage JSON-LD 与 canonical。
- 信息架构对齐工具站打法：首屏只做转化（标题→副标题→输入框→信任行），SEO 正文与长尾 FAQ 全部下沉到首屏之下。
- 改文案只需编辑 `lib/i18n.js`；新增语言 = 加一份词典 + 一个路由目录。

## 已知限制与后续方向

- **MP3 暂时下线**：服务端抽音轨需要 ffmpeg、临时文件、视频下载与转码队列，早期版本先移除该能力，避免额外运维和资源风险。
- **解析层会失效**：TikTok 反爬与 TikWM 接口都会变化，`lib/providers.js` 里新增一个 Provider 函数加入数组即可扩展（这正是多源容错设计的目的）。
- **内存限流仅适用于单实例**：多实例部署请换成 Redis 或 Vercel KV。
- **TikWM 免费接口限速约 1 次/秒**：流量上来后建议自建解析或购买商用 API。
- 后续可扩展：抖音链接支持、多语言版本、解析成功率监控。

## 合规提醒

页面已内置免责声明。正式上线前建议补齐：服务条款、隐私政策、版权投诉（DMCA）页面——工具类站点接广告（如 AdSense）前这些是硬性要求。
