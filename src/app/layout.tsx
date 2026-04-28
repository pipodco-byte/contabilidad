import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pipod Contabilidad',
  description: 'Sistema de gestión contable para Pipod',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-background text-foreground transition-colors">
        <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted -z-10" />
        {children}
      </body>
    </html>
  );
}
