import assert from 'node:assert/strict';
import test from 'node:test';

import { pickClientIp } from '../lib/request-ip.mjs';

function headers(entries) {
  return {
    get(name) {
      return entries[name.toLowerCase()] || null;
    },
  };
}

test('uses the first valid forwarded IP', () => {
  assert.equal(
    pickClientIp(headers({ 'x-forwarded-for': '203.0.113.10, 198.51.100.2' })),
    '203.0.113.10'
  );
});

test('falls back to x-real-ip when forwarded IP is invalid', () => {
  assert.equal(
    pickClientIp(headers({ 'x-forwarded-for': 'not-an-ip', 'x-real-ip': '198.51.100.9' })),
    '198.51.100.9'
  );
});

test('returns local when no trusted-looking IP is present', () => {
  assert.equal(pickClientIp(headers({ 'x-forwarded-for': 'a'.repeat(200) })), 'local');
});
