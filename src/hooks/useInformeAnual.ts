import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface DatosAnuales {
  mes: string;
  ingresos: number;
  egresos: number;
  balance: number;
}

export function useInformeAnual(userId: string, userRole: string = 'usuario') {
  const [datosAnuales, setDatosAnuales] = useState<DatosAnuales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosAnuales = async () => {
      try {
        let query = supabase
          .from('transacciones')
          .select('fecha, tipo, monto');

        if (userRole !== 'admin') {
          query = query.eq('user_id', userId);
        }

        const { data } = await query;

        if (data) {
          const mapa = new Map<string, { ingresos: number; egresos: number }>();

          data.forEach((t) => {
            const fecha = new Date(t.fecha);
            const mes = fecha.toLocaleDateString('es-CO', { year: 'numeric', month: 'long' });

            if (!mapa.has(mes)) {
              mapa.set(mes, { ingresos: 0, egresos: 0 });
            }
            const actual = mapa.get(mes)!;
            if (t.tipo === 'Ingreso') {
              actual.ingresos += t.monto;
            } else {
              actual.egresos += t.monto;
            }
          });

          const datos = Array.from(mapa.entries()).map(([mes, valores]) => ({
            mes,
            ingresos: valores.ingresos,
            egresos: valores.egresos,
            balance: valores.ingresos - valores.egresos,
          }));

          setDatosAnuales(datos);
        }
      } finally {
        setLoading(false);
      }
    };

    cargarDatosAnuales();
  }, [userId, userRole]);

  return { datosAnuales, loading };
}
