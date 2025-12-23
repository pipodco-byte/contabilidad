import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Transaccion {
  id: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  sub_categoria: string;
  monto: number;
  tipo: 'Ingreso' | 'Egreso';
  medio_pago: string;
  estado_iva: string;
  comentarios?: string;
  created_at: string;
}

export function useListaTransacciones(userId: string, userRole: string = 'usuario') {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarTransacciones = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('transacciones')
        .select('*');

      if (userRole !== 'admin') {
        query = query.eq('user_id', userId);
      }

      const { data, error: err } = await query.order('fecha', { ascending: false });

      if (err) throw err;
      setTransacciones(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarTransaccion = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('transacciones')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setTransacciones(transacciones.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    cargarTransacciones();
  }, [userId, userRole]);

  return { transacciones, loading, error, cargarTransacciones, eliminarTransaccion };
}
