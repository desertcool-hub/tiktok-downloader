import importlib.util
import json
import os
import sys
from http.server import ThreadingHTTPServer
from http.client import HTTPConnection
from pathlib import Path
import tempfile
import unittest
import threading
import time
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('youtube', ROOT / 'api/youtube.py')
youtube = importlib.util.module_from_spec(spec)
spec.loader.exec_module(youtube)

ID = 'BaW_jenozKc'
SECRET = 'test-secret-with-at-least-32-characters'

def sample_info():
    return {'id': ID, 'title': 'test video', 'uploader': 'tester', 'duration': 10, 'formats': [
        {'format_id': '18', 'ext': 'mp4', 'vcodec': 'avc1', 'acodec': 'mp4a', 'height': 360, 'filesize': 200000, 'protocol': 'https'},
        {'format_id': '137', 'ext': 'mp4', 'vcodec': 'avc1', 'acodec': 'none', 'height': 1080, 'filesize': 600000, 'protocol': 'https'},
        {'format_id': '140', 'ext': 'm4a', 'vcodec': 'none', 'acodec': 'mp4a', 'filesize': 100000, 'protocol': 'https'},
        {'format_id': '999', 'ext': 'mp4', 'vcodec': 'avc1', 'acodec': 'mp4a', 'height': 720, 'filesize': 50000000, 'protocol': 'https'},
    ]}

class YoutubeTests(unittest.TestCase):
    def test_url_validation_canonicalizes_video_only(self):
        for url in [f'https://youtu.be/{ID}?si=a', f'https://m.youtube.com/shorts/{ID}', f'https://www.youtube.com/watch?v={ID}&list=foo']:
            self.assertEqual(youtube.parse_url(url), (ID, f'https://www.youtube.com/watch?v={ID}'))
        for url in [f'https://youtube.com.evil.test/watch?v={ID}', f'https://user@youtube.com/watch?v={ID}', 'http://youtube.com/watch?v=' + ID, 'https://youtube.com/playlist?list=foo', f'https://youtube.com/watch?v={ID}&v={ID}']:
            with self.assertRaises(youtube.ApiError): youtube.parse_url(url)

    def test_format_selection_excludes_audio_only_and_oversized_and_merges_with_audio(self):
        video = youtube.normalize_info(sample_info(), ID, SECRET, now=1000, ffmpeg=True)
        self.assertEqual(len(video['formats']), 2)
        top = video['formats'][0]
        self.assertEqual(top['label'], '1080p')
        token = top['url'].split('token=')[1]
        self.assertEqual(youtube.verify_token(token, SECRET, now=1001)['format'], '137+140')
        self.assertNotIn('googlevideo', json.dumps(video))
        self.assertNotIn(SECRET, json.dumps(video))
        self.assertEqual(len(youtube.normalize_info(sample_info(), ID, SECRET, ffmpeg=False)['formats']), 1)

    def test_signed_tokens_are_expiring_and_tamper_proof(self):
        token = youtube.sign_token({'id': ID, 'format': '18', 'exp': 2000}, SECRET)
        self.assertEqual(youtube.verify_token(token, SECRET, now=1000)['id'], ID)
        for bad in [token + 'x', 'garbage', token[:-10], youtube.sign_token({'id': ID, 'format': '--exec evil', 'exp': 2000}, SECRET)]:
            with self.assertRaises(youtube.ApiError): youtube.verify_token(bad, SECRET, now=1000)
        with self.assertRaises(youtube.ApiError) as ctx: youtube.verify_token(token, SECRET, now=2000)
        self.assertEqual(ctx.exception.code, 'TOKEN_EXPIRED')

    def test_invalid_results_and_live_streams_do_not_produce_downloads(self):
        for info in [{**sample_info(), 'id': 'bad'}, {**sample_info(), 'is_live': True}, {**sample_info(), 'formats': []}]:
            with self.assertRaises(youtube.ApiError): youtube.normalize_info(info, ID, SECRET)

    def test_runner_uses_fixed_argv_not_shell_and_timeout(self):
        with patch.object(youtube, 'deno_path', return_value='/bundled/deno'), patch.object(youtube, 'run_process', return_value=json.dumps(sample_info())) as run:
            youtube.extract_info(ID)
            args = run.call_args.args[0]
            self.assertIn('--ignore-config', args)
            self.assertIn('--no-playlist', args)
            self.assertEqual(args[-1], f'https://www.youtube.com/watch?v={ID}')
            self.assertEqual(run.call_args.kwargs['timeout'], 45)

    def test_runtime_is_explicit_and_missing_runtime_fails_closed(self):
        with patch.object(youtube, 'deno_path', return_value='/bundled/deno'):
            args = youtube.base_command()
            self.assertEqual(args[args.index('--js-runtimes') + 1], 'deno:/bundled/deno')
        with patch.dict('sys.modules', {'vidsavenow_runtime': None}):
            with self.assertRaises(youtube.ApiError) as ctx: youtube.base_command()
            self.assertEqual(ctx.exception.code, 'YOUTUBE_NOT_CONFIGURED')

    def test_disk_budget_ignores_inputs_removed_during_merge(self):
        with tempfile.TemporaryDirectory() as tmp:
            file = Path(tmp) / 'video.mp4'
            file.write_bytes(b'test')
            self.assertEqual(youtube.directory_size(tmp), 4)
            with patch.object(Path, 'glob', return_value=[file]), patch.object(Path, 'stat', side_effect=FileNotFoundError):
                self.assertEqual(youtube.directory_size(tmp), 0)

    def test_child_process_can_import_vendored_dependencies(self):
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / 'vidsavenow_dependency_probe.py').write_text('print("vendored-import-ok")', encoding='utf-8')
            with patch.object(sys, 'path', [tmp, *sys.path]):
                result = youtube.run_process([sys.executable, '-m', 'vidsavenow_dependency_probe'], timeout=5)
                self.assertEqual(result.strip(), 'vendored-import-ok')

    def test_download_checks_file_bytes_and_size(self):
        with tempfile.TemporaryDirectory() as tmp:
            file = Path(tmp) / 'video.mp4'
            file.write_bytes(b'\x00\x00\x00\x18ftypisom' + b'0' * 20)
            self.assertEqual(youtube.validate_file(file), 32)
            file.write_bytes(b'<html>challenge page</html>')
            with self.assertRaises(youtube.ApiError): youtube.validate_file(file)
            with file.open('wb') as out: out.truncate(youtube.MAX_BYTES + 1)
            with self.assertRaises(youtube.ApiError) as ctx: youtube.validate_file(file)
            self.assertEqual(ctx.exception.code, 'TOO_LARGE')

    def test_errors_are_actionable_without_leaking_upstream_details(self):
        error = youtube.map_upstream_error('Sign in to confirm you are not a bot secret cookie')
        self.assertEqual(error.code, 'YOUTUBE_BLOCKED')
        self.assertNotIn('secret', error.message)
        self.assertEqual(youtube.map_upstream_error('This video is unavailable').code, 'VIDEO_UNAVAILABLE')

    def test_http_parse_download_and_invalid_token(self):
        youtube.REQUESTS.clear()
        server = ThreadingHTTPServer(('127.0.0.1', 0), youtube.handler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        mp4 = b'\x00\x00\x00\x18ftypisom' + b'0' * 20
        directories = []
        def download(_payload, directory):
            directories.append(directory)
            path = Path(directory) / 'video.mp4'
            path.write_bytes(mp4)
            return path
        try:
            with patch.dict(os.environ, {'YOUTUBE_SIGNING_SECRET': SECRET}), patch.object(youtube, 'extract_info', return_value=sample_info()), patch.object(youtube, 'ffmpeg_path', return_value=None), patch.object(youtube, 'download_file', side_effect=download) as run:
                conn = HTTPConnection('127.0.0.1', server.server_port)
                conn.request('POST', '/api/youtube', json.dumps({'url': f'https://youtu.be/{ID}'}), {'Content-Type': 'application/json'})
                response = conn.getresponse()
                self.assertEqual(response.status, 200)
                result = json.loads(response.read())
                href = result['videos'][0]['formats'][0]['url']
                conn.request('GET', href + '&name=test.mp4')
                response = conn.getresponse()
                self.assertEqual(response.status, 200)
                self.assertEqual(response.getheader('Content-Type'), 'video/mp4')
                self.assertEqual(response.read(), mp4)
                deadline = time.monotonic() + 1
                while any(Path(path).exists() for path in directories) and time.monotonic() < deadline:
                    time.sleep(0.01)
                self.assertTrue(all(not Path(path).exists() for path in directories))
                conn.request('GET', '/api/youtube?token=malicious')
                response = conn.getresponse()
                self.assertEqual(response.status, 400)
                self.assertEqual(json.loads(response.read())['code'], 'INVALID_TOKEN')
                self.assertEqual(run.call_count, 1)
                conn.close()
        finally:
            server.shutdown(); server.server_close(); thread.join()

if __name__ == '__main__': unittest.main()
