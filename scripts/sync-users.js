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
  const { data: users } = await supabaseAnon.from('cont_usuarios').select('*');
  console.log('cont_usuarios:', users.length, 'users');

  const { data: list } = await supabaseAdmin.auth.admin.listUsers();
  for (const u of (list?.users || [])) {
    const exists = users.find(cu => cu.id === u.user_metadata?.cont_usuario_id);
    if (!exists) {
      console.log('Deleting orphan auth.user:', u.email);
      await supabaseAdmin.auth.admin.deleteUser(u.id);
    }
  }

  for (const u of users) {
    const email = `${u.username}@pipod.co`;
    const { data: list2 } = await supabaseAdmin.auth.admin.listUsers();
    const found = list2?.users?.find(au => au.user_metadata?.cont_usuario_id === u.id);

    if (found) {
      console.log('Updating:', email);
      await supabaseAdmin.auth.admin.updateUserById(found.id, {
        password: u.password_hash,
        email_confirm: true,
        user_metadata: {
          cont_usuario_id: u.id,
          nombre: u.nombre,
          rol: u.rol,
          username: u.username,
        },
      });
    } else {
      console.log('Creating:', email);
      await supabaseAdmin.auth.admin.createUser({
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
    }
  }

  const { data: final } = await supabaseAdmin.auth.admin.listUsers();
  console.log('\nFinal auth.users:', final?.users?.length);
  final?.users?.forEach(au =>
    console.log(`  ${au.email} | ${au.user_metadata?.nombre} (${au.user_metadata?.rol})`)
  );
}

migrate();
