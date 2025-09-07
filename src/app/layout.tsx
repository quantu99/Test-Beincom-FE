import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/layouts';
import { QueryProviders } from '@/contexts';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Test Beincom',
  description: 'Test Beincom implements',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProviders>
          <MainLayout>{children}</MainLayout>
        </QueryProviders>
      </body>
    </html>
  );
}
