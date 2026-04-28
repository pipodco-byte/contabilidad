'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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
      toast.error(err.message);
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
            <Gem size={40} className="text-primary drop-shadow-sm" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/60 rounded-full blur-lg opacity-30 -z-10" />
          </div>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
          Pipod Contabilidad
        </h1>
        <p className="text-muted-foreground">Inicia sesión para continuar</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-muted-foreground uppercase text-xs tracking-wider block">
              Usuario
            </label>
            <Input
              type="text"
              placeholder="tu usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border-border focus:border-primary/50 placeholder:text-muted-foreground text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground uppercase text-xs tracking-wider block">
              Contraseña
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-input border-border focus:border-primary/50 placeholder:text-muted-foreground text-foreground"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary disabled:opacity-50 text-primary-foreground font-medium shadow-glow hover:scale-[1.02] transition-transform"
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}