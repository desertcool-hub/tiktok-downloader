import YoutubeClient from '@/components/YoutubeClient';
import { youtubeMetadata, youtubeFaqJsonLd } from '@/lib/youtube-copy.mjs';

export const metadata = youtubeMetadata('vi');
export default function Page() {
  return <><YoutubeClient locale="vi" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(youtubeFaqJsonLd('vi')).replace(/</g, '\\u003c') }} />
  </>;
}
