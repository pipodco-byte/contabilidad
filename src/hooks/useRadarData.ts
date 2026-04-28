import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface RadarData {
  subject: string;
  Ingresos: number;
  Egresos: number;
  fullMark: number;
}

const normalizar = (valor: number): number => {
  return Math.round((valor / 1000000) * 10) / 10;
};

export function useRadarData(userId: string, userRole: string = 'usuario') {
  const [data, setData] = useState<RadarData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || userId.length < 5) {
      setLoading(false)
      setData([])
      return
    }

    const cargarDatos = async () => {
      try {
        let query = supabase.from('transacciones').select('monto, categoria, tipo');

        if (userRole !== 'admin') {
          query = query.eq('user_id', userId);
        }

        const { data: transacciones } = await query;

        // B4 FIX: Dynamic categories from data
        const categoriasUnicas = [...new Set(
          transacciones?.map(t => t.categoria?.trim() || 'Otros') || []
        )];

        // B4 FIX: Build map only with actual categories
        const mapa = categoriasUnicas.reduce(
          (acc, cat) => {
            acc[cat] = { Ingresos: 0, Egresos: 0 };
            return acc;
          },
          {} as Record<string, { Ingresos: number; Egresos: number }>
        );

        if (transacciones) {
          transacciones.forEach(t => {
            const categoria = t.categoria?.trim() || 'Otros';
            if (mapa[categoria]) {
              if (t.tipo === 'Ingreso') {
                mapa[categoria].Ingresos += t.monto || 0;
              } else {
                mapa[categoria].Egresos += t.monto || 0;
              }
            }
          });
        }

        // B3 FIX: Simple fullMark calculation (removed corrupted outlier detection)
        const mapaValues = Object.values(mapa) as Array<{ Ingresos: number; Egresos: number }>;
        const maxValor = Math.max(...mapaValues.flatMap(v => [v.Ingresos, v.Egresos]), 0);
        const fullMark = Math.ceil(normalizar(maxValor) * 1.2) || 1;

        // B4 FIX: Only categories with data
        const radarData = categoriasUnicas
          .filter(cat => mapa[cat].Ingresos > 0 || mapa[cat].Egresos > 0)
          .map(cat => ({
            subject: cat,
            Ingresos: normalizar(mapa[cat].Ingresos) || 0,
            Egresos: normalizar(mapa[cat].Egresos) || 0,
            fullMark,
          }));

        setData(radarData);
      } catch (error) {
        console.error('Error loading radar data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [userId, userRole]);

  return { data, loading };
}
