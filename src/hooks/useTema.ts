import { useEffect, useState } from 'react';

export function useTema() {
  const [tema, setTema] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('tema') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const inicial = stored || (prefersDark ? 'dark' : 'light');
    
    setTema(inicial);
    setMounted(true);
    
    if (inicial === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTema = () => {
    const nuevoTema = tema === 'light' ? 'dark' : 'light';
    setTema(nuevoTema);
    localStorage.setItem('tema', nuevoTema);
    
    if (nuevoTema === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return { tema, toggleTema, mounted };
}
