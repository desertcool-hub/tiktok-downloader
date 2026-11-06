export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function forward(req) {
  const backend = process.env.YOUTUBE_BACKEND_URL || process.env.BACKEND_URL;
  if (!backend) return Response.json({ success: false, error: 'YouTube 服务尚未配置，请稍后重试' }, { status: 503 });
  const target = new URL('/api/youtube', backend);
  target.search = new URL(req.url).search;
  if (target.origin === new URL(req.url).origin) return Response.json({ success: false, error: 'YouTube 后端配置错误' }, { status: 503 });
  try {
    const headers = new Headers();
    for (const name of ['content-type', 'range']) {
      if (req.headers.has(name)) headers.set(name, req.headers.get(name));
    }
    const upstream = await fetch(target, {
      method: req.method, headers,
      body: req.method === 'POST' ? await req.text() : undefined,
      redirect: 'error', signal: AbortSignal.timeout(120_000),
    });
    const responseHeaders = new Headers();
    for (const name of ['content-type', 'content-length', 'content-disposition', 'content-range', 'accept-ranges']) {
      if (upstream.headers.has(name)) responseHeaders.set(name, upstream.headers.get(name));
    }
    responseHeaders.set('Cache-Control', 'no-store');
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch {
    return Response.json({ success: false, error: 'YouTube 后端暂时不可用，请稍后重试' }, { status: 502 });
  }
}
export const GET = forward;
export const POST = forward;
