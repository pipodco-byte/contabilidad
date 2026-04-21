'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Gem size={40} className="text-violet-500 dark:text-violet-400 drop-shadow-sm" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-violet-600 rounded-full blur-lg opacity-30 -z-10" />
          </div>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-violet-600 dark:from-violet-400 to-violet-600 dark:to-violet-400 bg-clip-text text-transparent mb-2">
          Pipod Contabilidad
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">Inicia sesión para continuar</p>
      </div>

      <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800/50 rounded-xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-zinc-400 uppercase text-xs tracking-wider block">
              Correo electrónico
            </label>
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-900/50 border-zinc-800/50 focus:border-violet-500/50 placeholder:text-zinc-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-zinc-400 uppercase text-xs tracking-wider block">
              Contraseña
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-900/50 border-zinc-800/50 focus:border-violet-500/50 placeholder:text-zinc-600 text-white"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:opacity-50 text-white font-medium shadow-glow hover:scale-[1.02] transition-transform"
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}