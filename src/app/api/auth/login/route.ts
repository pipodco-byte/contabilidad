import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@/lib/supabase-server';
import bcrypt from 'bcryptjs';

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
      .from('usuarios')
      .select('id, username, password_hash, nombre, rol, activo, acceso_contabilidad')
      .eq('username', username)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { message: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    if (!user.activo) {
      return NextResponse.json(
        { message: 'Usuario desactivado' },
        { status: 401 }
      );
    }

    if (!user.acceso_contabilidad) {
      return NextResponse.json(
        { message: 'Sin acceso a Contabilidad' },
        { status: 401 }
      );
    }

    const isBcryptHash = user.password_hash.startsWith('$2')
    let isValidPassword = false
    
    if (isBcryptHash) {
      isValidPassword = await bcrypt.compare(password, user.password_hash)
    } else {
      isValidPassword = user.password_hash === password
    }
    
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    const supabaseServer = createServerClient();
    const { error: authError } = await supabaseServer.auth.signInWithPassword({
      email: `${username}@pipod.co`,
      password,
    });

    if (authError) {
      console.error('Supabase Auth sign-in failed:', authError.message);
      return NextResponse.json(
        { message: 'Error de autenticación' },
        { status: 401 }
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
