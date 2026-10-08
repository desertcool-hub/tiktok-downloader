import assert from 'node:assert/strict';
import test from 'node:test';
import { parseXUrl, normalizeXTweet, parseXVideo } from '../lib/x-provider.mjs';

const media = (id) => ({ id_str: id, type: 'video', media_url_https: 'https://pbs.twimg.com/cover.jpg',
  video_info: { variants: [
    { content_type: 'application/x-mpegURL', url: 'https://video.twimg.com/v.m3u8' },
    { content_type: 'video/mp4', bitrate: 256000, url: `https://video.twimg.com/${id}/vid/320x180/low.mp4` },
    { content_type: 'video/mp4', bitrate: 1024000, url: `https://video.twimg.com/${id}/vid/1280x720/high.mp4` },
    { content_type: 'video/mp4', url: 'https://evil.com/a.mp4' },
  ] } });

test('X URLs accept legacy, mobile, i/status and pasted text without losing ID precision', () => {
  for (const url of ['https://x.com/test/status/2013626968386765291?s=20',
    'https://mobile.twitter.com/test/status/2013626968386765291/video/1',
    'https://x.com/i/status/2013626968386765291']) {
    assert.equal(parseXUrl(`看看 ${url}`).id, '2013626968386765291');
  }
  for (const url of ['https://x.com.evil.com/a/status/123', 'http://127.0.0.1/status/123',
    'https://x.com/home', 'https://user@x.com/a/status/123']) assert.throws(() => parseXUrl(url));
});

test('X normalization includes every video, sorts MP4s and filters playlists and unsafe URLs', () => {
  const videos = normalizeXTweet({ id_str: '123', text: '标题', user: { name: '作者' },
    mediaDetails: [media('1'), media('2')] });
  assert.equal(videos.length, 2);
  assert.equal(videos[0].formats.length, 2);
  assert.equal(videos[0].formats[0].label, '720p');
  assert.equal(videos[0].formats[0].bitrate, 1024000);
});

test('FxEmbed v2 response keeps all available variants', () => {
  const videos = normalizeXTweet({ text: 'v2', author: { name: 'author' }, media: { videos: [{
    url: 'https://video.twimg.com/vid/1280x720/a.mp4', thumbnail_url: 'https://pbs.twimg.com/a.jpg',
    formats: [{ container: 'mp4', bitrate: 100, url: 'https://video.twimg.com/vid/320x180/a.mp4' },
      { container: 'mp4', bitrate: 500, url: 'https://video.twimg.com/vid/1280x720/a.mp4' }],
  }] } });
  assert.equal(videos[0].formats.length, 2);
});

test('X parsing falls back to FxEmbed when syndication is blocked', async () => {
  const result = await parseXVideo('https://x.com/test/status/12345', {
    fetchTweetImpl: async () => { throw new Error('403'); },
    fetchImpl: async (url) => {
      assert.equal(url, 'https://api.fxtwitter.com/2/status/12345');
      return Response.json({ code: 200, status: { text: '公开视频', media: { videos: [{
        url: 'https://video.twimg.com/vid/1280x720/a.mp4',
      }] } } });
    },
  });
  assert.equal(result.videos.length, 1);
});

test('empty and unavailable X posts do not return misleading success', async () => {
  await assert.rejects(parseXVideo('https://x.com/test/status/12345', {
    fetchTweetImpl: async () => ({ data: { text: 'only text' } }),
    fetchImpl: async () => Response.json({ code: 200, status: { text: 'only text' } }),
  }), e => e.code === 'NO_VIDEO');
});
