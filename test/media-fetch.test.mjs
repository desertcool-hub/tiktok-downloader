import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveAllowedRedirect } from '../lib/media-fetch.mjs';

test('keeps redirects on allowed media hosts', () => {
  const next = resolveAllowedRedirect(
    'https://www.tikwm.com/video/abc.mp4',
    '/cdn/video.mp4'
  );

  assert.equal(next, 'https://www.tikwm.com/cdn/video.mp4');
});

test('rejects redirects to non-media hosts', () => {
  assert.equal(
    resolveAllowedRedirect('https://www.tikwm.com/video/abc.mp4', 'http://127.0.0.1/admin'),
    null
  );
});

test('rejects unsupported redirect schemes', () => {
  assert.equal(
    resolveAllowedRedirect('https://www.tikwm.com/video/abc.mp4', 'file:///etc/passwd'),
    null
  );
});
