import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface AuthUser {
  id: string;
  username: string;
  nombre: string;
  rol: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
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

    const data = await response.json();

    if (data.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    }

    const userData = { id: data.id, username: data.username, nombre: data.nombre, rol: data.rol };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);
    router.push('/dashboard');
  };

  const signOut = async () => {
    localStorage.removeItem('auth_user');
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return { user, loading, signIn, signOut };
}
