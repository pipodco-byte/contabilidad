const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function migrate() {
  // 1. Delete all existing auth users
  const { data: list } = await supabaseAdmin.auth.admin.listUsers();
  for (const u of (list?.users || [])) {
    console.log('Deleting:', u.email, u.id);
    await supabaseAdmin.auth.admin.deleteUser(u.id);
  }
  console.log('All deleted');

  // 2. Read cont_usuarios for correct data
  const { createClient: anon } = require('@supabase/supabase-js');
  const supabaseAnon = anon(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const { data: users } = await supabaseAnon.from('cont_usuarios').select('*');
  
  // 3. Create users with cont_usuario_id in metadata
  for (const u of users) {
    const email = u.username + '@pipod.co';
    console.log('Creating:', email, '| cont_id:', u.id);
    
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

  // 4. Verify
  const { data: final } = await supabaseAdmin.auth.admin.listUsers();
  console.log('\nFinal auth.users:');
  final?.users?.forEach(au => console.log(' ', au.email, au.id, 'cont_id:', au.user_metadata?.cont_usuario_id));
}

migrate();
