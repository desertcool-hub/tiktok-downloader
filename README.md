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

新增微信视频号 `/weixin` 与 X / Twitter `/x` 下载页。视频号支持带密钥下载、
JSON 记录导入及本地文件解密；X 支持公开帖子、多视频与清晰度选择。
部署选项、分享链接限制和测试说明见 [下载平台说明](docs/download-platforms.md)。

新增 YouTube 下载页 `/youtube`（中文）与 `/youtube/en`（英文），复用相同交互与 SEO。
纯 Vercel 试运行使用 yt-dlp、Deno 与 FFmpeg，仅支持 4 MiB 以内的带声音 MP4。
需要额外安装 Python 依赖并配置服务端签名密钥，详见 [YouTube 部署说明](docs/youtube-vercel.md)。

TikTok、X 和 YouTube 提供中文、英文、日文、印尼语、西班牙语、巴西葡萄牙语和越南语版本，顶部语言菜单切换时保留当前平台。
默认首页 `/` 仍为 TikTok 英文下载页，首页描述与关键词也涵盖 X.com / Twitter 和 YouTube。
日文页面为 `/ja`、`/x/ja` 和 `/youtube/ja`；新语言分别使用 `id`、`es`、`pt`、`vi`，
例如 `/es`、`/x/es`、`/youtube/es`。各平台七种语言均提供独立标题、描述、关键词、canonical、
hreflang、FAQ 结构化数据并列入 sitemap；葡萄牙语的 HTML / hreflang 标记为 `pt-BR`。
所有 YouTube 语言页均保留 4 MB 试用限制说明。视频号暂时仅提供中文。
实现与验证记录见 [多语言说明](docs/multilingual.md)。

```bash
npm install
npm run dev        # 开发模式，http://localhost:3000
```

生产模式：

```bash
npm run build
npm run start
```

> 注意：本机直连 TikTok/TikWM 可能返回 403 或超时。浏览器能访问并不表示 Node 服务已使用系统代理。
> 本机使用 Node 24.13.0 时，需要在启动进程前同时开启代理支持并设置代理地址；Clash 需已运行且监听对应端口：
>
> ```bash
> NODE_USE_ENV_PROXY=1 HTTPS_PROXY=http://127.0.0.1:7897 HTTP_PROXY=http://127.0.0.1:7897 NO_PROXY=localhost,127.0.0.1,::1 npm run dev -- --port 3002
> ```
>
> 生产模式本地测试可将最后的命令换成 `npm run start -- --port 3002`。
> 这是本机启动配置，不要在 Vercel 设置 `127.0.0.1:7897`；修改代理环境后需重启服务。
> [Node 官方代理说明](https://nodejs.org/en/learn/http/enterprise-network-configuration)。

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
└── HomeClient.jsx         # TikTok 七种语言共用的客户端页面组件
lib/
├── i18n.js                # TikTok 文案词典入口
├── translations/         # id / es / pt / vi 三个平台与文档译文
├── locales.mjs           # 语言、平台地址和 hreflang 注册表
├── providers.js           # 解析层：短链还原 + TikWM / 页面提取双 Provider + 域名白名单
└── ratelimit.js           # 内存滑动窗口限流
server.js                  # Node 入口（读 PORT/HOST），用于 QW Pages 等动态部署
```

### 多语言与 SEO

- `/` 默认英文，`/zh` 中文；已有中英日地址保持不变。新增语言拥有独立地址，用 `alternates.languages` 和语言菜单互链，不按 IP 强制跳转。
- 每个路由各自输出本页语言的 FAQPage JSON-LD 与 canonical。
- 信息架构对齐工具站打法：首屏只做转化（标题→副标题→输入框→信任行），SEO 正文与长尾 FAQ 全部下沉到首屏之下。
- 新语言正文、错误提示、FAQ 和隐私等文档集中在 `lib/translations/`；语言注册表、平台词典入口和路由共同接入。
- sitemap 包含 21 个下载页、21 个文档页和 1 个中文视频号页。上线后需在搜索站长工具提交 sitemap；翻译本身不保证收录、排名或流量。

## 已知限制与后续方向

- **MP3 暂时下线**：服务端抽音轨需要 ffmpeg、临时文件、视频下载与转码队列，早期版本先移除该能力，避免额外运维和资源风险。
- **解析层会失效**：TikTok 反爬与 TikWM 接口都会变化，`lib/providers.js` 里新增一个 Provider 函数加入数组即可扩展（这正是多源容错设计的目的）。
- **内存限流仅适用于单实例**：多实例部署请换成 Redis 或 Vercel KV。
- **TikWM 免费接口限速约 1 次/秒**：流量上来后建议自建解析或购买商用 API。
- 后续可扩展：抖音链接支持、译文母语复核、解析成功率监控。

## 合规提醒

页面提供隐私政策、使用条款和联系页：英文为 `/privacy`、`/terms`、`/contact`，
其他语言分别添加 `/zh`、`/ja`、`/id`、`/es`、`/pt`、`/vi` 后缀。TikTok、X、YouTube 页的底部链接保留当前语言。
联系邮箱为 `desertcool@gmail.com`，内容和修订日期集中在 `lib/site-documents.mjs`。
页面说明当前数据处理、第三方服务、访问统计和内容授权要求，不构成特定地区法律合规的保证。
