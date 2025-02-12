import type { Metadata } from 'next';
import { Source_Sans_3, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/layout/main-layout';
import { cookies } from 'next/headers';
import { Toaster } from '@/components/ui/sonner';

const fontSans = Source_Sans_3({
  variable: '--font-sans',
  subsets: ['latin'],
});

const fontMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Gollama',
    default: 'Untitled Page',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = await cookies();
  const sidebarDocked = cookie.get('sidebarDocked')?.value === 'true';

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'development' && (
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          />
        )}
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <MainLayout sidebarFromCookie={sidebarDocked}>{children}</MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
