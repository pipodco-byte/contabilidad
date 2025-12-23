import { useState } from 'react';
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
}

export function useEditarTransaccion(userId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const editarTransaccion = async (id: string, data: Omit<Transaccion, 'id'>) => {
    setLoading(true);
    setError('');

    try {
      const { error: err } = await supabase
        .from('transacciones')
        .update({
          ...data,
          updated_at: new Date(),
        })
        .eq('id', id)
        .eq('user_id', userId);

      if (err) throw err;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { editarTransaccion, loading, error };
}
