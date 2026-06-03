import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  username: string;
  nombre: string;
  rol: string;
}

function extractUser(session: Session | null): AuthUser | null {
  if (!session) return null;
  const meta = session.user.user_metadata;
  return {
    id: meta.cont_usuario_id as string,
    username: meta.username as string,
    nombre: meta.nombre as string,
    rol: meta.rol as string,
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(extractUser(session));
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(extractUser(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const { data: { session } } = await supabase.auth.getSession();
    const authUser = extractUser(session);

    if (authUser) {
      setUser(authUser);
      router.push('/dashboard');
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return { user, loading, signIn, signOut };
}
