import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Transaccion {
  id?: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  sub_categoria: string;
  monto: number;
  tipo: 'Ingreso' | 'Egreso';
  medio_pago: string;
  estado_iva: string;
  comentarios?: string;
}

export function useTransacciones(userId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const crearTransaccion = async (data: Transaccion) => {
    setLoading(true);
    setError('');

    try {
      const { error: err } = await supabase
        .from('transacciones')
        .insert({
          ...data,
          user_id: userId,
          created_at: new Date(),
          updated_at: new Date(),
        });

      if (err) throw err;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { crearTransaccion, loading, error };
}
