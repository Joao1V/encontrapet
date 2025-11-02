import type { Metadata, Viewport } from 'next';
import { Fredoka, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { Providers } from '@/config/layout/providers';

const geistSans = Geist({
   variable: '--font-geist-sans',
   subsets: ['latin'],
});

const geistMono = Geist_Mono({
   variable: '--font-geist-mono',
   subsets: ['latin'],
});

const fredoka = Fredoka({
   variable: '--font-fredoka',
   subsets: ['latin'],
   weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
   title: 'EncontraPet',
   description:
      'Encontre ou ajude a encontrar pets perdidos. Uma plataforma dedicada a reunir pets com suas famílias.',
   keywords: [
      'pets perdidos',
      'encontrar pets',
      'animais perdidos',
      'cachorros perdidos',
      'gatos perdidos',
      'ajuda animal',
   ],
   authors: [{ name: 'EncontraPet Team' }],
   creator: 'EncontraPet',
   publisher: 'EncontraPet',
   formatDetection: {
      email: false,
      telephone: false,
   },
   robots: {
      index: true,
      follow: true,
   },
};

export const viewport: Viewport = {
   width: 'device-width',
   initialScale: 1,
};
export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="pt-BR">
         <body
            className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} antialiased`}
         >
            <Providers>{children}</Providers>
         </body>
      </html>
   );
}
