import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface DatosCategoria {
  categoria: string;
  ingresos: number;
  egresos: number;
}

export function useGraficas(userId: string, userRole: string = 'usuario') {
  const [datosPorCategoria, setDatosPorCategoria] = useState<DatosCategoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        let query = supabase
          .from('transacciones')
          .select('categoria, tipo, monto');

        if (userRole !== 'admin') {
          query = query.eq('user_id', userId);
        }

        const { data } = await query;

        if (data) {
          const mapa = new Map<string, { ingresos: number; egresos: number }>();

          data.forEach((t) => {
            if (!mapa.has(t.categoria)) {
              mapa.set(t.categoria, { ingresos: 0, egresos: 0 });
            }
            const actual = mapa.get(t.categoria)!;
            if (t.tipo === 'Ingreso') {
              actual.ingresos += t.monto;
            } else {
              actual.egresos += t.monto;
            }
          });

          const datos = Array.from(mapa.entries()).map(([categoria, valores]) => ({
            categoria,
            ...valores,
          }));

          setDatosPorCategoria(datos);
        }
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [userId, userRole]);

  return { datosPorCategoria, loading };
}
