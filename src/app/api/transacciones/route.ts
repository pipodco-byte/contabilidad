import { NextResponse } from 'next/server';
import { z } from 'zod';
import { transaccionSchema } from '@/lib/validations';
import { createServerClient } from '@/lib/supabase';
import { BOLD_COMMISSION } from '@/lib/constants';

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    const { data, error } = await supabase
      .from('transacciones')
      .select('*')
      .eq('user_id', user.id)
      .order('fecha', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener transacciones' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = transaccionSchema.parse(body);

    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Guardar transacción principal
    const { data: transaccion, error } = await supabase
      .from('transacciones')
      .insert({
        ...validatedData,
        user_id: user.id,
        fecha: validatedData.fecha.toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;

    // Si es Bold, crear egreso automático
    if (validatedData.medio_pago === 'Bold' && validatedData.tipo === 'Ingreso') {
      const montoComision = Math.round(validatedData.monto * (BOLD_COMMISSION / 100));

      await supabase
        .from('transacciones')
        .insert({
          user_id: user.id,
          fecha: validatedData.fecha.toISOString().split('T')[0],
          descripcion: `Comisión Bold + Retenciones (CTT ${BOLD_COMMISSION}%)`,
          categoria: 'Egresos Negocio',
          sub_categoria: 'Costos Venta',
          monto: montoComision,
          tipo: 'Egreso',
          medio_pago: 'Bold',
          estado_iva: 'N/A',
          comentarios: 'Costo automático de transacción Bold',
          es_automatico: true,
          transaccion_padre_id: transaccion.id,
        });
    }

    return NextResponse.json(transaccion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al crear transacción' }, { status: 500 });
  }
}
