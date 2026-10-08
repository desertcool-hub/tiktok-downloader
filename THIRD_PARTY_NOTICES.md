# Third-Party Notices

`lib/weixin-decrypt.mjs` adapts the ISAAC64 implementation from
[nobiyou/wx_channel](https://github.com/nobiyou/wx_channel/blob/main/pkg/util/isaac64.go).

MIT License

Copyright (c) 2025 nobiyou

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

X post retrieval uses the installed `react-tweet` package (MIT, Vercel) and
the public [FxEmbed API](https://docs.fxembed.com/api/introduction/).
No FxEmbed source code is bundled.

[qiye45/wechatVideoDownload](https://github.com/qiye45/wechatVideoDownload)
was consulted for its capture and decrypt workflow. No code or binaries
from that repository are bundled.

The YouTube function installs `yt-dlp` (Unlicense) and `yt-dlp-ejs` through
Python package dependencies. Deno is MIT-licensed. `imageio-ffmpeg` is
BSD-2-Clause licensed and includes an FFmpeg executable with its own license
terms; retain the dependency packages' accompanying licenses when distributing.
See https://github.com/yt-dlp/yt-dlp/blob/master/LICENSE,
https://github.com/denoland/deno/blob/main/LICENSE, and
https://github.com/imageio/imageio-ffmpeg/blob/main/LICENSE.

[cshuangyy/videdown](https://github.com/cshuangyy/videdown) was consulted
for yt-dlp format selection and FFmpeg merging. No source code or desktop
binaries from that project are bundled.
