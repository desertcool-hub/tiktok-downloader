import LocalizedRootLayout, { localizedLayoutMetadata } from '@/components/LocalizedRootLayout';
import '../globals.css';

export const metadata = localizedLayoutMetadata('pt');
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#06070c' };
export default function Layout({ children }) { return <LocalizedRootLayout locale="pt">{children}</LocalizedRootLayout>; }
