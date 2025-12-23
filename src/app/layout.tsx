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
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <div className="fixed inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 -z-10" />
        {children}
      </body>
    </html>
  );
}
