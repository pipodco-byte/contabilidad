'use client';

import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/AuthForm';
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
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-300 text-xl">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 -z-10" />
      
      {/* Theme Toggle */}
      <button
        onClick={toggleTema}
        className="absolute top-6 right-6 p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors text-slate-600 dark:text-slate-300"
      >
        {tema === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </main>
  );
}