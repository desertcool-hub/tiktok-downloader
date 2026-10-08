// ISAAC64 adapted from nobiyou/wx_channel (MIT), pkg/util/isaac64.go.
// Copyright (c) 2025 nobiyou. See THIRD_PARTY_NOTICES.md.
const u64 = value => BigInt.asUintN(64, value);
export const WX_ENCRYPTED_BYTES = 131072;

export function validateWxKey(raw) {
  if (typeof raw === 'number' && !Number.isSafeInteger(raw)) throw new Error('密钥数字已丢失精度，请使用字符串形式的原始密钥');
  const key = String(raw ?? '').trim();
  if (!/^\d{1,20}$/.test(key) || BigInt(key) > 0xffffffffffffffffn) throw new Error('解密密钥须为 64 位十进制数字');
  return key;
}

function mix(v) {
  let [a, b, c, d, e, f, g, h] = v;
  a = u64(a - e); f ^= h >> 9n; h = u64(h + a);
  b = u64(b - f); g ^= u64(a << 9n); a = u64(a + b);
  c = u64(c - g); h ^= b >> 23n; b = u64(b + c);
  d = u64(d - h); a ^= u64(c << 15n); c = u64(c + d);
  e = u64(e - a); b ^= d >> 14n; d = u64(d + e);
  f = u64(f - b); c ^= u64(e << 20n); e = u64(e + f);
  g = u64(g - c); d ^= f >> 17n; f = u64(f + g);
  h = u64(h - d); e ^= u64(g << 14n); g = u64(g + h);
  return [a, b, c, d, e, f, g, h];
}

export function generateWxKeystream(rawKey, length = WX_ENCRYPTED_BYTES) {
  const key = BigInt(validateWxKey(rawKey));
  if (!Number.isInteger(length) || length < 0 || length > WX_ENCRYPTED_BYTES) throw new Error('无效的解密范围');
  const memory = Array(256).fill(0n);
  const results = Array(256).fill(0n); results[0] = key;
  let state = Array(8).fill(0x9e3779b97f4a7c13n);
  for (let i = 0; i < 4; i++) state = mix(state);
  for (const source of [results, memory]) {
    for (let i = 0; i < 256; i += 8) {
      state = mix(state.map((v, j) => u64(v + source[i + j])));
      for (let j = 0; j < 8; j++) memory[i + j] = state[j];
    }
  }
  let a = 0n, b = 0n, counter = 0n, remaining = 0;
  function generate() {
    counter = u64(counter + 1n); b = u64(b + counter);
    for (let j = 0; j < 256; j++) {
      const x = memory[j];
      switch (j % 4) {
        case 0: a = u64(~(a ^ u64(a << 21n))); break;
        case 1: a ^= a >> 5n; break;
        case 2: a ^= u64(a << 12n); break;
        case 3: a ^= a >> 33n; break;
      }
      a = u64(a + memory[(j + 128) % 256]);
      const y = u64(memory[Number((x >> 3n) & 255n)] + a + b);
      memory[j] = y;
      b = u64(memory[Number((y >> 11n) & 255n)] + x);
      results[j] = b;
    }
    remaining = 256;
  }
  const output = new Uint8Array(length);
  for (let pos = 0; pos < length; pos += 8) {
    if (!remaining) generate();
    const value = results[--remaining];
    for (let j = 0; j < 8 && pos + j < length; j++) output[pos + j] = Number((value >> BigInt(56 - 8 * j)) & 255n);
  }
  return output;
}

export function decryptWxBytes(bytes, key, offset = 0) {
  const output = bytes.slice();
  const end = Math.min(WX_ENCRYPTED_BYTES, offset + bytes.length);
  if (offset >= end) return output;
  const keystream = generateWxKeystream(key, end);
  for (let i = 0; i < end - offset; i++) output[i] ^= keystream[offset + i];
  return output;
}

export function decryptWxStream(stream, key, offset = 0) {
  const keystream = offset < WX_ENCRYPTED_BYTES ? generateWxKeystream(key) : null;
  let pos = offset;
  return stream.pipeThrough(new TransformStream({ transform(chunk, c) {
    const output = chunk.slice();
    for (let i = 0; i < output.length && pos + i < WX_ENCRYPTED_BYTES; i++) output[i] ^= keystream[pos + i];
    pos += output.length;
    c.enqueue(output);
  } }));
}
