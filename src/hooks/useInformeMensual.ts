import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface DatosMensuales {
  categoria: string;
  ingresos: number;
  egresos: number;
}

export function useInformeMensual(userId: string, userRole: string = 'usuario') {
  const [datosMensuales, setDatosMensuales] = useState<DatosMensuales[]>([]);
  const [loading, setLoading] = useState(true);
  const [mes, setMes] = useState(new Date().toISOString().split('T')[0].slice(0, 7));

  useEffect(() => {
    const cargarDatosMensuales = async () => {
      try {
        let query = supabase
          .from('transacciones')
          .select('categoria, tipo, monto, fecha');

        if (userRole !== 'admin') {
          query = query.eq('user_id', userId);
        }

        const { data } = await query;

        if (data) {
          const mapa = new Map<string, { ingresos: number; egresos: number }>();

          data.forEach((t) => {
            const fecha = new Date(t.fecha);
            const fechaMes = fecha.toISOString().split('T')[0].slice(0, 7);

            if (fechaMes === mes) {
              if (!mapa.has(t.categoria)) {
                mapa.set(t.categoria, { ingresos: 0, egresos: 0 });
              }
              const actual = mapa.get(t.categoria)!;
              if (t.tipo === 'Ingreso') {
                actual.ingresos += t.monto;
              } else {
                actual.egresos += t.monto;
              }
            }
          });

          const datos = Array.from(mapa.entries()).map(([categoria, valores]) => ({
            categoria,
            ingresos: valores.ingresos,
            egresos: valores.egresos,
          }));

          setDatosMensuales(datos);
        }
      } finally {
        setLoading(false);
      }
    };

    cargarDatosMensuales();
  }, [userId, mes, userRole]);

  return { datosMensuales, loading, mes, setMes };
}
