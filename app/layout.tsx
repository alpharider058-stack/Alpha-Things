import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'classroom',
  description: 'classroom',
  icons: {
    icon: [
      { url: '/classroom-logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/classroom-logo.svg',
    apple: '/classroom-logo.svg',
  },
  openGraph: {
    title: 'classroom',
    description: 'classroom',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'classroom',
    description: 'classroom',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/classroom-logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/classroom-logo.svg" />
        <link rel="apple-touch-icon" href="/classroom-logo.svg" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
