import YoutubeClient from '@/components/YoutubeClient';
import { youtubeMetadata, youtubeFaqJsonLd } from '@/lib/youtube-copy.mjs';

export const metadata = youtubeMetadata('zh');

export default function Page() {
  return <><YoutubeClient locale="zh" /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(youtubeFaqJsonLd('zh')).replace(/</g, '\\u003c') }} /></>;
}
