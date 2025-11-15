import type { Metadata } from 'next';
import { QueryProvider } from '@/providers/QueryProvider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'HDS Pseudo',
  description: 'Happy Day Services - Clean Architecture Monorepo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
