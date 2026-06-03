const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function migrate() {
  // 1. Add josue and marcelo to cont_usuarios if not exist
  const newUsers = [
    { username: 'josue', password: 'password123', nombre: 'Josue', rol: 'admin' },
    { username: 'marcelo', password: 'password123', nombre: 'Marcelo', rol: 'admin' },
  ];

  for (const nu of newUsers) {
    const { data: existing } = await supabaseAnon
      .from('cont_usuarios')
      .select('id')
      .eq('username', nu.username)
      .single();

    if (!existing) {
      const { error } = await supabaseAnon.from('cont_usuarios').insert({
        username: nu.username,
        password_hash: nu.password,
        nombre: nu.nombre,
        rol: nu.rol,
        activo: true,
      });
      console.log('Added to cont_usuarios:', nu.username, error ? error.message : 'OK');
    } else {
      console.log('Already in cont_usuarios:', nu.username);
    }
  }

  // 2. Read all cont_usuarios
  const { data: users } = await supabaseAnon.from('cont_usuarios').select('*');
  console.log('\ncont_usuarios:', users.length, 'users');

  // 3. Delete all auth.users
  const { data: list } = await supabaseAdmin.auth.admin.listUsers();
  for (const u of (list?.users || [])) {
    console.log('Deleting auth.user:', u.email);
    await supabaseAdmin.auth.admin.deleteUser(u.id);
  }

  // 4. Create auth.users from cont_usuarios
  for (const u of users) {
    const email = `${u.username}@pipod.co`;
    console.log('Creating auth.user:', email, '| cont_id:', u.id);

    const { error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: u.password_hash,
      email_confirm: true,
      user_metadata: {
        cont_usuario_id: u.id,
        nombre: u.nombre,
        rol: u.rol,
        username: u.username,
      },
    });

    console.log('  ', error ? error.message : 'OK');
  }

  // 5. Verify
  const { data: final } = await supabaseAdmin.auth.admin.listUsers();
  console.log('\nFinal auth.users:');
  final?.users?.forEach(au =>
    console.log(`  ${au.email} | cont_id: ${au.user_metadata?.cont_usuario_id} | ${au.user_metadata?.nombre}`)
  );
}

migrate();
