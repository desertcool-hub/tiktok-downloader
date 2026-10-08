# YouTube: Pure Vercel Trial

The Next.js pages `/youtube` (Chinese) and `/youtube/en` (English) use the same
layout and interactions as the TikTok and X tools. The existing TikTok APIs remain unchanged.

`api/youtube.py` is a file-based Vercel Python function at `/api/youtube`.
It uses yt-dlp for extraction and download, bundled Deno + yt-dlp-ejs for JavaScript
challenges, and the FFmpeg binary packaged by imageio-ffmpeg for MP4 audio/video merging.
No external parsing service or VPS is configured.

## Deploy

1. Deploy the repository with the **Next.js** framework preset, not the Python preset.
2. Keep `requirements.txt`, `.python-version` and `vercel.json` in the project root,
   and include `vendor/vidsavenow-youtube-runtime` in the repository. Do not override the Python install command.
   Its isolated package build copies pinned Deno into package data, rather than relying on
   a console executable outside `site-packages` that Vercel may omit. No binary is committed.
3. Add `YOUTUBE_SIGNING_SECRET` to the Vercel project's environment variables for
   each environment being tested. Use at least 32 random characters; do not use `NEXT_PUBLIC_`.
   Generate a value locally with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
4. Enable Fluid Compute for the configured 300-second maximum duration.
5. Redeploy and verify that Vercel builds `api/youtube.py` as a Python function alongside Next.js.
6. Test a short, public video from the deployed site. Local success is not proof of cloud success.

No personal YouTube cookies, browser credentials or login tokens are requested.
Signing secrets stay on the server. Download tokens expire after 15 minutes and
contain only the video ID, allowed format selector and expiration, never a CDN URL.

## Deployment File Scope

- `.vercelignore` omits tests, docs, local preview scripts, environments, caches and
  generated package artifacts from CLI uploads. Git deployments may still check out these
  files; the function-level exclusions below control the Python runtime bundle either way.
  Next.js source, public assets, lockfiles,
  configuration and the local Python package source remain available for building.
- The Python function's `excludeFiles` separately omits frontend source and the entire
  project `vendor/` directory **after dependency installation**. The package build creates
  a duplicate Deno executable under `vendor/.../build/`; Git ignores do not remove it
  from a function built on Vercel. It must not enter the runtime bundle.
- Installed runtime dependencies under Vercel's `_vendor/` remain intact, including
  yt-dlp, EJS, Deno, FFmpeg and their licenses. Do not exclude `_vendor/`.
- The pinned Linux x86_64 Deno and FFmpeg wheels contain approximately 91.4 MiB and
  76.2 MiB uncompressed. Removing duplicate build files avoids paying for Deno twice.
  A clean Linux dependency installation plus Deno measures 192.2 MiB before Vercel's
  runtime overhead. These measurements are not a confirmed cloud deployment size.
- Redeploy the updated commit without the existing build cache after a size-limit failure.

## Trial Limits

- MP4 with video and audio only; adaptive H.264 + M4A sources are merged with FFmpeg.
- **4 MiB maximum final file**, below Vercel's documented 4.5 MB response payload cap.
  This is deliberately a small-file trial, not a general long-video download solution.
  Streaming is not assumed to bypass the platform's documented size limit.
- Metadata extraction has a 45-second application deadline; downloading/merging has 180 seconds.
- Known oversized formats are filtered; estimates may be inaccurate, so final size is checked again.
- Downloads are re-extracted within the download invocation rather than relying on cached,
  IP-bound or expiring Google video links from a different function instance.
- Temporary files are unique per request and removed after success or failure. Subprocess
  groups (including FFmpeg) are killed on timeouts and disk/output budget violations.
- Private, age-restricted, upcoming and live videos are not supported.
- Per-instance rate/concurrency protection is best-effort, not a distributed quota.
  Configure Vercel Firewall and spend limits before public rollout.
- YouTube can still reject Vercel's egress IP or require verification/PO tokens.
  Deno/EJS support does not eliminate those checks.

## Local Preview

Requires Python 3.12. Use an isolated environment:

```sh
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
npm run dev:youtube -- --port 3001
```

The preview runner starts the same Python handler on local port 8061 and proxies
`/api/youtube` only in development. It uses an ephemeral signing secret when none
is configured. This local proxy is not an external backend in production.
Change `YOUTUBE_DEV_PORT` if port 8061 is occupied.

```sh
npm test
.venv/bin/python test/youtube_python_test.py
npm run build
```

## References

- https://github.com/yt-dlp/yt-dlp
- https://github.com/yt-dlp/yt-dlp/wiki/PO-Token-Guide
- https://github.com/cshuangyy/videdown
- https://vercel.com/docs/functions/runtimes/python/api-directory
- https://vercel.com/docs/functions/limitations

Videdown's desktop source was consulted for format selection and merging patterns;
no Electron code, account cookies or desktop filesystem access is copied into the web app.

## Verification (2026-10-08)

- A local Python 3.12 run with the exact pinned dependencies parsed public video
  `jNQXAC9IVRw` and downloaded a 633,710-byte MP4. ffprobe confirmed H.264 320x240
  video and AAC audio, duration 19.06 seconds.
- The same file downloaded through the Next.js webpage using the Python handler;
  paste, Enter, loading states, cover, copy and download interactions passed.
- 46 Node tests and 11 Python tests passed, including deployment-file scope, dependency-path propagation,
  missing runtime detection, merge-file rename monitoring and development proxy timing.
- This is a real upstream/local test, not a Vercel egress test.
- The local Vercel CLI authentication token is invalid; no cloud preview has been
  deployed or tested during this change. Production remains unchanged.
