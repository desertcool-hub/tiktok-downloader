import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Vercel Analytics is installed and rendered in the root layout', async () => {
  const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
  const layout = await readFile('app/layout.js', 'utf8');

  assert.ok(packageJson.dependencies['@vercel/analytics']);
  assert.match(layout, /from ['"]@vercel\/analytics\/next['"]/);
  assert.match(layout, /<Analytics\s*\/>/);
});
