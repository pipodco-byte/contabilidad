import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const contUsuarioId = user.user_metadata.cont_usuario_id as string;
    if (!contUsuarioId) {
      return NextResponse.json({ error: 'Usuario sin ID contable' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('cont_configuracion')
      .select('*')
      .eq('user_id', contUsuarioId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) {
      return NextResponse.json({
        saldo_inicial: 0,
        fecha_saldo: null,
        costos_fijos: [],
        margen_objetivo: 18,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ error: 'Error al obtener configuracion' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const contUsuarioId = user.user_metadata.cont_usuario_id as string;
    if (!contUsuarioId) {
      return NextResponse.json({ error: 'Usuario sin ID contable' }, { status: 400 });
    }

    const body = await request.json();
    const { saldo_inicial, fecha_saldo, costos_fijos, margen_objetivo } = body;

    const { data, error } = await supabase
      .from('cont_configuracion')
      .upsert({
        user_id: contUsuarioId,
        saldo_inicial: saldo_inicial ?? 0,
        fecha_saldo: fecha_saldo || null,
        costos_fijos: costos_fijos || [],
        margen_objetivo: margen_objetivo ?? 18,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json({ error: 'Error al guardar configuracion' }, { status: 500 });
  }
}
