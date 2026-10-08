import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const match = createRequire(import.meta.url)('minimatch');
const options = { dot: true };

test('Python function excludes project sources and generated duplicate binaries but retains its handler and installed runtime', async () => {
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  const pattern = config.functions['api/youtube.py'].excludeFiles;
  for (const file of ['app/(zh)/youtube/page.js', 'components/YoutubeClient.jsx', 'lib/youtube-copy.mjs',
    'public/og.png', 'docs/youtube-vercel.md', 'test/youtube_python_test.py', 'scripts/dev-youtube.mjs',
    'vendor/vidsavenow-youtube-runtime/setup.py',
    'vendor/vidsavenow-youtube-runtime/build/lib/vidsavenow_runtime/deno',
    'vendor/vidsavenow-youtube-runtime/vidsavenow_youtube_runtime.egg-info/PKG-INFO',
    'node_modules/next/index.js', '.next/server/app/youtube.html', '.venv/bin/python', '.env.local', 'README.md']) {
    assert.equal(match(file, pattern, options), true, `Unnecessary Python bundle file: ${file}`);
  }
  for (const file of ['api/youtube.py', '_vendor/vidsavenow_runtime/deno', '_vendor/vidsavenow_runtime/LICENSE-DENO',
    '_vendor/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2', '_vendor/yt_dlp/__main__.py',
    '_vendor/yt_dlp_ejs/__init__.py']) {
    assert.equal(match(file, pattern, options), false, `Required Python runtime file: ${file}`);
  }
});

test('Deployment upload omits development-only files without removing build inputs or public assets', async () => {
  const patterns = (await readFile('.vercelignore', 'utf8')).split(/\r?\n/).filter(line => line && !line.startsWith('#'));
  const excluded = file => patterns.some(pattern => match(file, pattern, options));
  for (const file of ['docs/youtube-vercel.md', 'test/youtube_python_test.py', 'scripts/dev-youtube.mjs',
    '.env.local', '.env.example', '.venv/bin/python', 'node_modules/next/index.js', '.next/server/app/youtube.html',
    'vendor/vidsavenow-youtube-runtime/build/lib/vidsavenow_runtime/deno']) assert.equal(excluded(file), true, file);
  for (const file of ['package.json', 'package-lock.json', 'next.config.mjs', 'jsconfig.json', 'vercel.json',
    '.python-version', 'requirements.txt', '.eslintrc.json', 'api/youtube.py', 'app/(zh)/youtube/page.js',
    'components/YoutubeClient.jsx', 'public/og.png', 'lib/youtube-copy.mjs',
    'vendor/vidsavenow-youtube-runtime/pyproject.toml', 'vendor/vidsavenow-youtube-runtime/setup.py',
    'vendor/vidsavenow-youtube-runtime/vidsavenow_runtime/__init__.py']) assert.equal(excluded(file), false, file);
});
