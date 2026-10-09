import YoutubeClient from '@/components/YoutubeClient';
import { youtubeMetadata, youtubeFaqJsonLd } from '@/lib/youtube-copy.mjs';

export const metadata = youtubeMetadata('ja');

export default function Page() {
  return <><YoutubeClient locale="ja" /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(youtubeFaqJsonLd('ja')) }} /></>;
}
