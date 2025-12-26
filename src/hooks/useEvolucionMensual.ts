import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface MesData {
  mes: string;
  Ingresos: number;
  Egresos: number;
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function useEvolucionMensual(userId: string, userRole: string = 'usuario') {
  const [data, setData] = useState<MesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const year = new Date().getFullYear();
        let query = supabase
          .from('transacciones')
          .select('monto, tipo, fecha');

        if (userRole !== 'admin') {
          query = query.eq('user_id', userId);
        }

        const { data: transacciones } = await query;

        const mapa = MESES.reduce(
          (acc, mes) => {
            acc[mes] = { Ingresos: 0, Egresos: 0 };
            return acc;
          },
          {} as Record<string, { Ingresos: number; Egresos: number }>
        );

        if (transacciones) {
          transacciones.forEach(t => {
            const fecha = new Date(t.fecha);
            if (fecha.getFullYear() === year) {
              const mes = MESES[fecha.getMonth()];
              if (t.tipo === 'Ingreso') {
                mapa[mes].Ingresos += t.monto || 0;
              } else {
                mapa[mes].Egresos += t.monto || 0;
              }
            }
          });
        }

        const mesData = MESES.map(mes => ({
          mes,
          Ingresos: Math.round((mapa[mes].Ingresos / 1000000) * 10) / 10 || 0,
          Egresos: Math.round((mapa[mes].Egresos / 1000000) * 10) / 10 || 0,
        }));

        setData(mesData);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [userId, userRole]);

  return { data, loading };
}
