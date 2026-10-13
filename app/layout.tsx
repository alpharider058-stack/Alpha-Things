import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Alpha-Things | Hacker Portal',
  description: 'Portal cyberpunk con introducción cinemática Alpha-Things, lluvia de código binario y accesos directos a Cine-OS y herramientas Alpha.',
  openGraph: {
    title: 'Alpha-Things | Hacker Portal',
    description: 'Portal cyberpunk con introducción cinemática Alpha-Things, lluvia de código binario y accesos directos a Cine-OS y herramientas Alpha.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alpha-Things | Hacker Portal',
    description: 'Portal cyberpunk con introducción cinemática Alpha-Things, lluvia de código binario y accesos directos a Cine-OS y herramientas Alpha.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
