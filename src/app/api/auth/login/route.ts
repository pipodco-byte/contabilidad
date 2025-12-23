import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Usuario y contraseña requeridos' },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from('usuarios_permitidos')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      console.error('Usuario no encontrado:', username, error);
      return NextResponse.json(
        { message: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    if (user.password_hash !== password) {
      console.error('Contraseña incorrecta para:', username);
      return NextResponse.json(
        { message: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    if (!user.activo) {
      return NextResponse.json(
        { message: 'Usuario desactivado' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
      nombre: user.nombre,
      rol: user.rol,
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { message: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
