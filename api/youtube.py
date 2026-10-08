"""Vercel Python function: small public YouTube MP4 downloads using yt-dlp."""
import base64
import hashlib
import hmac
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import shutil
import signal
import stat
import subprocess
import sys
import tempfile
import threading
import time
from urllib.parse import parse_qs, quote, urlsplit

MAX_BYTES = 4 * 1024 * 1024
ID_RE = re.compile(r'[A-Za-z0-9_-]{11}')
FORMAT_RE = re.compile(r'\d{1,5}(?:-drc)?(?:\+\d{1,5}(?:-drc)?)?')
SLOTS = threading.BoundedSemaphore(2)
RATE_LOCK = threading.Lock()
REQUESTS = {}


class ApiError(Exception):
    def __init__(self, message, code='PARSE_FAILED', status=502):
        super().__init__(message)
        self.message, self.code, self.status = message, code, status


def parse_url(raw):
    try:
        if not isinstance(raw, str) or len(raw) > 2048:
            raise ValueError()
        u = urlsplit(raw.strip())
        if u.scheme != 'https' or u.username or u.password or u.port:
            raise ValueError()
        if u.hostname == 'youtu.be':
            video_id = u.path.removeprefix('/').removesuffix('/')
        elif u.hostname in ('youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com'):
            if u.path == '/watch':
                values = parse_qs(u.query).get('v', [])
                if len(values) != 1:
                    raise ValueError()
                video_id = values[0]
            else:
                match = re.fullmatch(r'/(?:shorts|embed|live)/([A-Za-z0-9_-]{11})/?', u.path)
                video_id = match[1] if match else ''
        else:
            raise ValueError()
        if not ID_RE.fullmatch(video_id):
            raise ValueError()
        return video_id, f'https://www.youtube.com/watch?v={video_id}'
    except (ValueError, TypeError):
        raise ApiError('请输入有效的 YouTube 视频链接', 'INVALID_URL', 400)


def signing_secret():
    secret = os.environ.get('YOUTUBE_SIGNING_SECRET', '')
    if len(secret) < 32:
        raise ApiError('YouTube 下载通道尚未配置，请稍后再试', 'YOUTUBE_NOT_CONFIGURED', 503)
    return secret


def sign_token(payload, secret):
    content = base64.urlsafe_b64encode(json.dumps(payload, separators=(',', ':')).encode()).decode().rstrip('=')
    signature = hmac.new(secret.encode(), content.encode(), hashlib.sha256).hexdigest()
    return f'{content}.{signature}'


def verify_token(token, secret, now=None):
    try:
        if not isinstance(token, str) or len(token) > 1024:
            raise ValueError()
        content, signature = token.split('.')
        expected = hmac.new(secret.encode(), content.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected):
            raise ValueError()
        payload = json.loads(base64.urlsafe_b64decode(content + '=' * (-len(content) % 4)))
        if not ID_RE.fullmatch(payload.get('id', '')) or not FORMAT_RE.fullmatch(payload.get('format', '')):
            raise ValueError()
        if type(payload.get('exp')) is not int:
            raise ValueError()
        if payload['exp'] <= (time.time() if now is None else now):
            raise ApiError('下载链接已过期，请重新解析', 'TOKEN_EXPIRED', 410)
        return payload
    except (ValueError, TypeError, KeyError, AttributeError):
        raise ApiError('下载链接无效，请重新解析', 'INVALID_TOKEN', 400)


def estimated_size(fmt, duration):
    size = fmt.get('filesize') or fmt.get('filesize_approx')
    if not size and fmt.get('tbr') and duration:
        size = float(fmt['tbr']) * 1000 * duration / 8
    return int(size or 0)


def normalize_info(info, video_id, secret, now=None, ffmpeg=False):
    if not isinstance(info, dict) or info.get('id') != video_id:
        raise ApiError('解析服务返回了无效的视频信息', 'INVALID_RESULT')
    if info.get('is_live') or info.get('live_status') in ('is_live', 'is_upcoming'):
        raise ApiError('暂不支持直播或尚未发布的视频', 'NO_VIDEO', 422)
    duration = float(info.get('duration') or 0)
    formats = [f for f in info.get('formats', []) if re.fullmatch(r'\d{1,5}(?:-drc)?', str(f.get('format_id', '')))
               and f.get('protocol') in ('https', 'http', 'http_dash_segments')]
    audios = sorted([f for f in formats if f.get('ext') == 'm4a' and f.get('vcodec') == 'none'
                     and f.get('acodec') not in (None, 'none')], key=lambda f: f.get('abr') or 0, reverse=True)
    candidates = []
    for fmt in formats:
        if fmt.get('ext') != 'mp4' or not str(fmt.get('vcodec', '')).startswith(('avc', 'h264')):
            continue
        height = int(fmt.get('height') or 0)
        selector = str(fmt['format_id'])
        size = estimated_size(fmt, duration)
        if fmt.get('acodec') in (None, 'none'):
            if not ffmpeg:
                continue
            audio = next((a for a in audios if not size or not estimated_size(a, duration)
                          or (size + estimated_size(a, duration)) * 1.05 + 16384 <= MAX_BYTES), None)
            if not audio:
                continue
            selector += '+' + str(audio['format_id'])
            size += estimated_size(audio, duration)
        if size and size * 1.05 + 16384 > MAX_BYTES:
            continue
        candidates.append((height, size, selector))
    if not candidates:
        code = 'TOO_LARGE' if any(f.get('ext') == 'mp4' and f.get('vcodec') not in (None, 'none') for f in formats) else 'NO_VIDEO'
        raise ApiError('当前试运行仅支持 4 MB 以内的 MP4 视频，请尝试更短的视频' if code == 'TOO_LARGE'
                       else '此视频没有可下载的带声音 MP4 格式', code, 422)
    selected = {}
    for height, size, selector in sorted(candidates, key=lambda f: (-f[0], '+' in f[2], f[1])):
        if height in selected:
            continue
        token = sign_token({'id': video_id, 'format': selector, 'exp': int(time.time() if now is None else now) + 900}, secret)
        selected[height] = {'id': selector, 'label': f'{height}p' if height else 'MP4', 'url': f'/api/youtube?token={token}'}
    return {'id': video_id, 'title': str(info.get('title') or 'YouTube video')[:1000],
            'author': {'name': str(info.get('uploader') or info.get('channel') or '')[:200]}, 'duration': duration,
            'cover': f'https://i.ytimg.com/vi/{video_id}/hqdefault.jpg', 'formats': list(selected.values())}


def ffmpeg_path():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except (ImportError, RuntimeError):
        return shutil.which('ffmpeg')


def deno_path():
    try:
        from vidsavenow_runtime import deno_binary
        path = deno_binary()
        if os.path.isfile(path) and os.access(path, os.X_OK):
            return path
    except ImportError:
        pass
    raise ApiError('YouTube 解析运行组件缺失，请检查部署配置', 'YOUTUBE_NOT_CONFIGURED', 503)


def base_command():
    args = [sys.executable, '-m', 'yt_dlp', '--ignore-config', '--no-playlist', '--no-cache-dir',
            '--socket-timeout', '10', '--retries', '1', '--extractor-retries', '1', '--no-warnings', '--quiet']
    args += ['--js-runtimes', f'deno:{deno_path()}']
    return args


def map_upstream_error(stderr):
    text = stderr.lower()
    if any(s in text for s in ('not a bot', 'sign in', 'po token', 'http error 403', 'captcha')):
        return ApiError('YouTube 要求验证或暂时拒绝请求，请稍后重试', 'YOUTUBE_BLOCKED')
    if any(s in text for s in ('private video', 'video unavailable', 'video is unavailable', 'removed', 'not available', 'members-only', 'age-restricted')):
        return ApiError('视频不可用、需要登录或存在地区限制', 'VIDEO_UNAVAILABLE', 422)
    if 'larger than max-filesize' in text:
        return ApiError('当前试运行仅支持 4 MB 以内的视频', 'TOO_LARGE', 413)
    if 'no module named yt_dlp' in text:
        return ApiError('YouTube 下载依赖未安装，请检查部署配置', 'YOUTUBE_NOT_CONFIGURED', 503)
    return ApiError('解析或下载暂时失败，请稍后重试', 'UPSTREAM_ERROR')


def stop_process(proc):
    try:
        os.killpg(proc.pid, signal.SIGKILL)
    except ProcessLookupError:
        pass
    proc.wait()


def directory_size(directory):
    total = 0
    for path in Path(directory).glob('*'):
        try:
            entry = path.stat()
        except FileNotFoundError:
            # FFmpeg may rename the output or remove an input during merging.
            continue
        if stat.S_ISREG(entry.st_mode):
            total += entry.st_size
    return total


def run_process(args, *, timeout, directory=None):
    # Keep stderr/stdout off the response, and kill FFmpeg descendants on timeout.
    with tempfile.TemporaryFile() as out, tempfile.TemporaryFile() as err:
        env = {**os.environ, 'DENO_DIR': os.path.join(tempfile.gettempdir(), 'vidsavenow-deno')}
        # Vercel adds vendored dependencies to the parent path, not the child's default path.
        env['PYTHONPATH'] = os.pathsep.join(path for path in sys.path if path)
        proc = subprocess.Popen(args, stdout=out, stderr=err, start_new_session=True, env=env)
        deadline = time.monotonic() + timeout
        try:
            while proc.poll() is None:
                if time.monotonic() > deadline:
                    raise ApiError('解析超时，请稍后重试' if directory is None else '下载处理超时，请尝试更短的视频',
                                   'PARSE_TIMEOUT' if directory is None else 'DOWNLOAD_TIMEOUT', 504)
                if directory and directory_size(directory) > MAX_BYTES * 2 + 65536:
                    raise ApiError('视频超过试运行的 4 MB 下载上限', 'TOO_LARGE', 413)
                if out.tell() + err.tell() > 8 * 1024 * 1024:
                    raise ApiError('解析结果过大，请尝试其他视频', 'INVALID_RESULT')
                time.sleep(0.1)
            out.seek(0); err.seek(0)
            stderr = err.read(65536).decode('utf-8', errors='replace')
            if proc.returncode:
                raise map_upstream_error(stderr)
            return out.read(8 * 1024 * 1024).decode('utf-8', errors='replace')
        finally:
            # The parent may exit while a spawned FFmpeg child is still running.
            stop_process(proc)


def extract_info(video_id):
    text = run_process(base_command() + ['--dump-single-json', '--skip-download', '--',
                       f'https://www.youtube.com/watch?v={video_id}'], timeout=45)
    try:
        return json.loads(text)
    except ValueError:
        raise ApiError('解析服务未返回有效的视频信息', 'INVALID_RESULT')


def validate_file(path):
    size = path.stat().st_size
    if size > MAX_BYTES:
        raise ApiError('视频超过试运行的 4 MB 下载上限', 'TOO_LARGE', 413)
    with path.open('rb') as file:
        prefix = file.read(12)
    if len(prefix) < 12 or prefix[4:8] != b'ftyp':
        raise ApiError('下载源没有返回有效 MP4 视频', 'INVALID_MEDIA')
    return size


def download_file(payload, directory):
    args = base_command() + ['--no-part', '--max-filesize', str(MAX_BYTES), '--format', payload['format'],
                            '--merge-output-format', 'mp4', '--output', str(Path(directory) / 'video.%(ext)s')]
    ffmpeg = ffmpeg_path()
    if ffmpeg:
        args += ['--ffmpeg-location', ffmpeg]
    args += ['--', f'https://www.youtube.com/watch?v={payload["id"]}']
    run_process(args, timeout=180, directory=directory)
    path = Path(directory) / 'video.mp4'
    if not path.is_file():
        raise ApiError('没有生成可下载的 MP4 视频，文件可能超出 4 MB 上限', 'TOO_LARGE', 413)
    validate_file(path)
    return path


def allow_request(ip, mode):
    now = time.monotonic()
    with RATE_LOCK:
        expired = [key for key, value in REQUESTS.items() if value[0] + 60 < now]
        for key in expired:
            del REQUESTS[key]
        key = (ip, mode)
        started, count = REQUESTS.get(key, (now, 0))
        if count >= (8 if mode == 'parse' else 12) or len(REQUESTS) > 2000:
            raise ApiError('请求太频繁，请稍后重试', 'RATE_LIMITED', 429)
        REQUESTS[key] = (started, count + 1)


class handler(BaseHTTPRequestHandler):
    def log_message(self, *_args):
        pass

    def json_response(self, status, data):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.end_headers()
        self.response_started = True
        self.wfile.write(body)

    def guarded(self, mode, action):
        acquired = False
        try:
            ip = self.headers.get('x-forwarded-for', self.client_address[0]).split(',')[0].strip()[:64]
            allow_request(ip, mode)
            if not SLOTS.acquire(blocking=False):
                raise ApiError('下载服务繁忙，请稍后重试', 'RATE_LIMITED', 429)
            acquired = True
            action(signing_secret())
        except (BrokenPipeError, ConnectionResetError):
            pass
        except ApiError as error:
            if not getattr(self, 'response_started', False):
                self.json_response(error.status, {'success': False, 'code': error.code, 'error': error.message})
        except Exception:
            if not getattr(self, 'response_started', False):
                self.json_response(502, {'success': False, 'code': 'UPSTREAM_ERROR', 'error': '解析或下载暂时不可用，请稍后重试'})
        finally:
            if acquired:
                SLOTS.release()

    def do_POST(self):
        def parse(secret):
            try:
                length = int(self.headers.get('Content-Length', '0'))
                if length < 1 or length > 4096:
                    raise ValueError()
                data = json.loads(self.rfile.read(length))
                video_id, _url = parse_url(data.get('url'))
            except (ValueError, AttributeError):
                raise ApiError('请提交有效的视频链接', 'INVALID_URL', 400)
            info = extract_info(video_id)
            video = normalize_info(info, video_id, secret, ffmpeg=bool(ffmpeg_path()))
            self.json_response(200, {'success': True, 'videos': [video]})
        self.guarded('parse', parse)

    def do_GET(self):
        def download(secret):
            query = parse_qs(urlsplit(self.path).query)
            payload = verify_token(query.get('token', [''])[0], secret)
            with tempfile.TemporaryDirectory(prefix='vidsavenow-youtube-') as directory:
                path = download_file(payload, directory)
                name = re.sub(r'[\x00-\x1f\x7f\\/:*?"<>|]', ' ', query.get('name', ['YouTube-video'])[0]).strip()[:100] or 'video'
                if not name.lower().endswith('.mp4'):
                    name += '.mp4'
                self.send_response(200)
                self.send_header('Content-Type', 'video/mp4')
                self.send_header('Content-Length', str(path.stat().st_size))
                self.send_header('Content-Disposition', f"attachment; filename=video.mp4; filename*=UTF-8''{quote(name, safe='')}")
                self.send_header('Cache-Control', 'no-store')
                self.send_header('X-Content-Type-Options', 'nosniff')
                self.end_headers()
                self.response_started = True
                with path.open('rb') as file:
                    shutil.copyfileobj(file, self.wfile, length=65536)
        self.guarded('download', download)


if __name__ == '__main__':
    ThreadingHTTPServer(('127.0.0.1', int(os.environ.get('YOUTUBE_DEV_PORT', '8061'))), handler).serve_forever()
