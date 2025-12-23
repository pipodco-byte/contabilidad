import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');

    let query = supabase
      .from('transacciones')
      .select('*')
      .eq('user_id', user.id);

    if (fechaInicio) {
      query = query.gte('fecha', fechaInicio);
    }
    if (fechaFin) {
      query = query.lte('fecha', fechaFin);
    }

    const { data: transacciones, error } = await query.order('fecha', { ascending: false });

    if (error) throw error;

    const totalIngresos = transacciones
      .filter((t: any) => t.tipo === 'Ingreso')
      .reduce((sum: number, t: any) => sum + t.monto, 0);

    const totalEgresos = transacciones
      .filter((t: any) => t.tipo === 'Egreso')
      .reduce((sum: number, t: any) => sum + t.monto, 0);

    const balance = totalIngresos - totalEgresos;

    // Calcular proyección mensual
    const ahora = new Date();
    const primerDia = startOfMonth(ahora);
    const ultimoDia = endOfMonth(ahora);
    const diasTranscurridos = differenceInDays(ahora, primerDia) + 1;
    const diasTotales = differenceInDays(ultimoDia, primerDia) + 1;

    const ingresosHastaHoy = transacciones
      .filter((t: any) => t.tipo === 'Ingreso' && new Date(t.fecha) <= ahora)
      .reduce((sum: number, t: any) => sum + t.monto, 0);

    const proyeccionMensual = Math.round((ingresosHastaHoy / diasTranscurridos) * diasTotales);

    return NextResponse.json({
      totalIngresos,
      totalEgresos,
      balance,
      proyeccionMensual,
      transaccionesRecientes: transacciones.slice(0, 10),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener dashboard' }, { status: 500 });
  }
}
