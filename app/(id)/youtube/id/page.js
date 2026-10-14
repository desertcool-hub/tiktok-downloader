import YoutubeClient from '@/components/YoutubeClient';
import { youtubeMetadata, youtubeFaqJsonLd } from '@/lib/youtube-copy.mjs';

export const metadata = youtubeMetadata('id');
export default function Page() {
  return <><YoutubeClient locale="id" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(youtubeFaqJsonLd('id')).replace(/</g, '\\u003c') }} />
  </>;
}
