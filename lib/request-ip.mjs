import net from 'node:net';

function firstForwarded(value) {
  return String(value || '').split(',')[0].trim();
}

function cleanIp(value) {
  const ip = firstForwarded(value);
  if (ip.length > 64) return '';
  return net.isIP(ip) ? ip : '';
}

export function pickClientIp(headers) {
  return (
    cleanIp(headers.get('x-forwarded-for')) ||
    cleanIp(headers.get('x-real-ip')) ||
    'local'
  );
}
