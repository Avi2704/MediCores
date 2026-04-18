import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import ApiKeyGuard from '@/components/layout/ApiKeyGuard';

export const metadata: Metadata = {
  title: 'Health Brain — Your AI Health Companion',
  description: 'Upload medical records and get AI-powered insights about your health.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background font-sans antialiased min-h-screen">
        <ApiKeyGuard>
          <Navbar />
          <main>{children}</main>
        </ApiKeyGuard>
      </body>
    </html>
  );
}
