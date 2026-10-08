# 微信视频号与 X 下载

TikTok 的 `/`、`/zh` 仅更新顶部导航，新增 X 平台入口；正文、下载流程及 `/api/parse`、`/api/download` 保持原样。
X 与 TikTok 复用现有全局样式及平台导航；新增下载页面之间共享媒体校验、下载进度和取消操作。

## X / Twitter：`/x`（中文）、`/x/en`（英文）

- 输入 `x.com` 或 `twitter.com` 帖子链接。
- 布局、链接状态、分步解析提示、复制信息和结果卡片与 TikTok 页面保持一致；多个视频分别显示。
- 页面包含介绍、产品能力、操作步骤、手机/电脑说明及 FAQ；FAQ 结构化数据与可见正文来自同一份双语文案。
- 配置独立 Title/Description、canonical、双向 hreflang、Open Graph、Twitter Card 和 `/x/social-image` 分享图，两个语言页面均加入 sitemap。
- 主通道使用 Vercel 的 `react-tweet/api`（公开 syndication 接口）。
- 失败时调用 FxEmbed 的公开 `GET /2/status/{id}` 接口。
- 每条帖子可返回多个视频，MP4 按码率降序排列；HLS 播放列表不会当作视频文件提供。
- 不需要配置 X 登录 Cookie、浏览器自动化、ffmpeg 或本地服务；可部署在 Vercel。
- 外部服务不承诺永久可用。私密内容、需要登录的内容、直播及仅有 HLS 的内容不支持。
- `/api/xdownload` 只允许 `video.twimg.com` 的 MP4，图片预览允许 `pbs.twimg.com`；每次重定向重新校验。

## 视频号：`/weixin`

视频号与 X 的公开链接机制不同。研究的两个项目依赖电脑端微信获取媒体信息。
`qiye45/wechatVideoDownload` 在 GitHub 主要提供说明与发布包，没有可直接移植的网页解析器。
`nobiyou/wx_channel` 提供了桌面代理、页面注入、JSON 浏览记录导出与 ISAAC64 解密实现。
本项目不安装系统证书、监听微信流量或打包其桌面程序。

### 当前无需分享解析服务也能使用的功能

1. **链接下载**：粘贴视频号 CDN 直链；加密视频同时填写对应的十进制 `decodeKey`。
2. **导入记录**：支持 `wx_channel` 导出的 JSON 浏览记录、分享解析结果，以及以下格式。
   单次最多 100 条、1 MB。重复地址合并，优先保留非空密钥。
3. **本地解密**：选择已下载的原始视频文件并填写密钥，只在浏览器处理前 128 KiB，
   文件其余部分直接复用，不上传视频，也不把整个视频读入内存。

```json
[
  {
    "videoUrl": "https://finder.video.qq.com/your-signed-video-url",
    "decryptKey": "12345678901234567890",
    "title": "视频标题",
    "author": "作者"
  }
]
```

密钥必须保留为字符串。超过 JavaScript 安全整数范围的数字型密钥会被拒绝，
因为解析后的数字可能已经丢失精度，无法还原原始密钥。

下载前以文件头验证 MP4，而非只依赖 `Content-Type`。加密视频缺少密钥、密钥不匹配、
返回 HTML 验证页时，会返回具体错误，不会把不可播放的文件作为成功下载。
密钥通过 POST 请求体发送，不放进下载 URL。

### 以后启用分享链接解析

推荐接入已运行的 `wx_channel` 实例，环境变量为：

```text
WX_CHANNEL_URL=https://可访问的下载助手地址
WX_CHANNEL_TOKEN=下载助手的secret_token
```

服务端调用 `POST /api/channels/share/resolve`，请求体为 `{"urls":["分享链接"]}`，
使用 `Authorization: Bearer` 携带配置的 token。
电脑端微信须登录，视频号页面与下载助手须保持连接；离线时返回 `WECHAT_OFFLINE`。
Vercel 的 `127.0.0.1` 指向 Vercel 自己，不能填写家中电脑的 localhost 地址。
只使用有访问控制的 HTTPS 接入口，不要把桌面助手管理端直接公开。

原 `MEDIA_PARSER_URL` 方式保留为替代通道，需要该服务有效的登录凭证。
若设置 `BACKEND_URL`，微信相关请求会转发到运行同一新版代码的后端；后端自身不要设置该变量。

### 测试结果与限制

- 2026-10-08，分享链接 `https://weixin.qq.com/sph/Ap5gU9QdOP` 的公开网页未直接提供媒体地址。
  现有本机 `media-parser` 返回 `WECHAT_CHANNELS_COOKIE_REQUIRED`，因此这条真实视频未完成解析与下载。
- ISAAC64 输出已与微信 `decrypt-video-core/1.3.0` WASM 解码器对照，包括完整 64 位种子。
- 已通过分块、Range 偏移、128 KiB 解密边界、错误密钥、JSON 导入去重和浏览器本地解密测试。
- 本地解密浏览器测试使用生成的测试文件，不能替代真实视频号内容的端到端测试。
- 不支持图集、直播、无密钥的加密视频，也不会承诺任何分享链接都能在纯网页中解析。

## 下载与部署

电脑 Chromium 浏览器在支持时使用 File System Access API，将文件流式写入用户所选位置。
其他浏览器使用 Blob 下载，上限为 256 MB，超过上限会提示改用电脑浏览器。
下载代理设置 60 秒执行上限；大文件仍受 Vercel 套餐时限、带宽及微信 CDN 签名过期影响。
本地文件解密不受代理执行时限限制。

新增页面已加入 sitemap，中文根布局已有的 Vercel Analytics 会统计这两个页面。
客户端仅在页面内保留导入记录，服务端不持久化链接或密钥。
X 解析会把公开帖子 ID 发给 X 的 syndication 服务，必要时发给 FxEmbed。

## 参考与许可证

- https://github.com/qiye45/wechatVideoDownload
- https://github.com/nobiyou/wx_channel
- https://github.com/vercel/react-tweet
- https://docs.fxembed.com/api/twitter/operations/2statusid/

ISAAC64 实现改编自 `wx_channel` 的 MIT 源码，许可证及署名见 `THIRD_PARTY_NOTICES.md`。
