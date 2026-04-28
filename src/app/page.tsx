'use client';

import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/forms/auth-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTema } from '@/hooks/useTema';

export default function Home() {
  const { user, loading } = useAuth();
  const { tema, toggleTema, mounted } = useTema();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !mounted) {
    return (
      <main className="min-h-screen bg-background dark:bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-xl">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background dark:bg-background flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-to-br from-background via-muted to-muted dark:from-background dark:via-background dark:to-background -z-10" />
      
      {/* Theme Toggle */}
      <button
        onClick={toggleTema}
        className="absolute top-6 right-6 p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-muted-foreground"
      >
        {tema === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </main>
  );
}