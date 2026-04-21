import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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

    // Support both bcryptjs hashes and plain text for migration
    const isBcryptHash = user.password_hash.startsWith('$2')
    let isValidPassword = false
    
    if (isBcryptHash) {
      isValidPassword = await bcrypt.compare(password, user.password_hash)
    } else {
      // Plain text fallback for migration
      isValidPassword = user.password_hash === password
    }
    
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Usuario o contraseña incorrectos' },
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
