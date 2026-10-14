import YoutubeClient from '@/components/YoutubeClient';
import { youtubeMetadata, youtubeFaqJsonLd } from '@/lib/youtube-copy.mjs';

export const metadata = youtubeMetadata('pt');
export default function Page() {
  return <><YoutubeClient locale="pt" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(youtubeFaqJsonLd('pt')).replace(/</g, '\\u003c') }} />
  </>;
}
