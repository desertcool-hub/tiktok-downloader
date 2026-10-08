import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import net from 'node:net';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd(), true);
const python = process.env.YOUTUBE_PYTHON || (existsSync('.venv/bin/python') ? '.venv/bin/python' : 'python3');
const port = process.env.YOUTUBE_DEV_PORT || '8061';
if (!/^\d{4,5}$/.test(port) || Number(port) > 65535) throw new Error('Invalid YOUTUBE_DEV_PORT');
// An ephemeral local secret is never saved or used in deployed functions.
const env = { ...process.env, YOUTUBE_DEV_PORT: port,
  YOUTUBE_SIGNING_SECRET: process.env.YOUTUBE_SIGNING_SECRET || randomBytes(32).toString('hex') };
const children = [];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (!child.killed) child.kill('SIGTERM');
  process.exitCode = code;
}
function start(command, args) {
  const child = spawn(command, args, { env, stdio: 'inherit' });
  children.push(child);
  child.on('error', error => { console.error(error.message); stop(1); });
  child.on('exit', code => stop(code || 0));
  return child;
}
async function waitForPython() {
  for (let attempt = 0; attempt < 50; attempt++) {
    if (stopping) throw new Error('Python function did not start');
    const ready = await new Promise(resolve => {
      const socket = net.connect(Number(port), '127.0.0.1');
      socket.on('connect', () => { socket.destroy(); resolve(true); });
      socket.on('error', () => resolve(false));
    });
    if (ready) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Python function did not start');
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => stop());
start(python, ['api/youtube.py']);
try {
  await waitForPython();
  start(process.execPath, ['node_modules/next/dist/bin/next', 'dev', ...process.argv.slice(2)]);
} catch (error) { console.error(error.message); stop(1); }
