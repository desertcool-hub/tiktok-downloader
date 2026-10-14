import YoutubeClient from '@/components/YoutubeClient';
import { youtubeMetadata, youtubeFaqJsonLd } from '@/lib/youtube-copy.mjs';

export const metadata = youtubeMetadata('es');
export default function Page() {
  return <><YoutubeClient locale="es" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(youtubeFaqJsonLd('es')).replace(/</g, '\\u003c') }} />
  </>;
}
