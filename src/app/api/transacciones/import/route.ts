import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { transacciones, userId } = await request.json();

    if (!Array.isArray(transacciones) || transacciones.length === 0) {
      return NextResponse.json({ error: 'No hay transacciones para importar' }, { status: 400 });
    }

    const { error } = await supabase.from('transacciones').insert(
      transacciones.map((t) => ({
        user_id: userId,
        fecha: t.fecha,
        descripcion: t.descripcion,
        categoria: t.categoria,
        sub_categoria: t.sub_categoria,
        monto: t.monto,
        tipo: t.tipo,
        medio_pago: t.medio_pago,
        estado_iva: t.estado_iva,
        comentarios: t.comentarios,
      }))
    );

    if (error) throw error;

    return NextResponse.json({ count: transacciones.length });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al importar transacciones' },
      { status: 500 }
    );
  }
}
