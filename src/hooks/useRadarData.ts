import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface RadarData {
  subject: string;
  Ingresos: number;
  Egresos: number;
  fullMark: number;
}

const CATEGORIAS = [
  'Venta Equipos Nuevos',
  'Servicios Técnicos',
  'Operación',
  'Nómina',
  'Venta Accesorios',
  'Plan Retoma',
  'Compra Equipos',
  'Marketing',
];

const normalizar = (valor: number): number => {
  return Math.round((valor / 1000000) * 10) / 10;
};

const detectarOutliers = (valores: number[]): number[] => {
  const valoresNoZero = valores.filter(v => v > 0);
  if (valoresNoZero.length === 0) return valores;
  
  const promedio = valoresNoZero.reduce((a, b) => a + b, 0) / valoresNoZero.length;
  const umbral = promedio * 10;
  
  return valores.map(v => (v > umbral ? promedio : v));
};

export function useRadarData(userId: string, userRole: string = 'usuario') {
  const [data, setData] = useState<RadarData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        let query = supabase.from('transacciones').select('monto, categoria, tipo');

        if (userRole !== 'admin') {
          query = query.eq('user_id', userId);
        }

        const { data: transacciones } = await query;

        const mapa = CATEGORIAS.reduce(
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

        // Detectar outliers
        const todosValores = Object.values(mapa).flatMap(v => [v.Ingresos, v.Egresos]);
        const valoresLimpios = detectarOutliers(todosValores);
        let idx = 0;
        Object.keys(mapa).forEach(cat => {
          mapa[cat].Ingresos = valoresLimpios[idx++];
          mapa[cat].Egresos = valoresLimpios[idx++];
        });

        // Calcular fullMark dinámico
        const maxValor = Math.max(...Object.values(mapa).flatMap(v => [v.Ingresos, v.Egresos]));
        const fullMark = Math.max(normalizar(maxValor) * 1.15, 1);

        const radarData = CATEGORIAS.map(cat => ({
          subject: cat,
          Ingresos: normalizar(mapa[cat].Ingresos) || 0,
          Egresos: normalizar(mapa[cat].Egresos) || 0,
          fullMark,
        }));

        setData(radarData);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [userId, userRole]);

  return { data, loading };
}
