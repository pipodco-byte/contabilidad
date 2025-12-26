import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  return NextResponse.json({ message: 'El endpoint existe' });
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API] POST /api/gema/import - Iniciando');
    const body = await request.json();
    console.log('[API] Body recibido:', JSON.stringify(body).substring(0, 200));
    
    const { transacciones, userId } = body;
    console.log('[API] Parsed:', { transactionCount: transacciones?.length, userId });

    if (!Array.isArray(transacciones) || transacciones.length === 0) {
      console.log('[API] Error: transacciones no es array o está vacío');
      return NextResponse.json({ error: 'No hay transacciones para importar' }, { status: 400 });
    }

    console.log('[API] Preparando datos para Supabase...');
    const dataToInsert = transacciones.map((t) => {
      console.log('[API] Transacción raw:', { fecha: t.fecha, monto: t.monto });
      return {
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
      };
    });

    console.log('[API] Insertando', dataToInsert.length, 'registros en Supabase...');
    const { error } = await supabase.from('transacciones').insert(dataToInsert);
    
    if (error) {
      console.error('[API] Error de Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log('[API] ✅ Éxito - Retornando respuesta');
    return NextResponse.json({ count: transacciones.length });
  } catch (error) {
    console.error('[API] ❌ Error capturado:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
