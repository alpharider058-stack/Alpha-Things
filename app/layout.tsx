import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Inicio - Classroom',
  description: 'Inicio - Classroom',
  icons: {
    icon: [
      { url: '/classroom-logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Inicio - Classroom',
    description: 'Inicio - Classroom',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Inicio - Classroom',
    description: 'Inicio - Classroom',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es">
      <head>
        <title>Inicio - Classroom</title>
        <link rel="icon" href="/classroom-logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
