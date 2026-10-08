import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET() {
  return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', padding: '80px', color: '#f0f2fa', background: '#06070c', fontFamily: 'sans-serif' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: 32, color: '#25f4ee' }}>VidSaveNow</div>
    <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, marginTop: 32 }}>X / Twitter</div>
    <div style={{ display: 'flex', fontSize: 58, fontWeight: 700 }}>Video Downloader</div>
    <div style={{ display: 'flex', fontSize: 28, color: '#a7adc4', marginTop: 30 }}>Free · Original quality · MP4 · No login</div>
    <div style={{ display: 'flex', width: '100%', height: 5, marginTop: 50, background: 'linear-gradient(115deg, #25f4ee, #7b5cff, #fe2c55)' }} />
  </div>, { width: 1200, height: 630 });
}
