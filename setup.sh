#!/bin/bash

# ============================================
# PIPOD CONTABILIDAD - SETUP SCRIPT
# ============================================

echo "🚀 Iniciando configuración de Pipod Contabilidad..."
echo ""

# 1. Verificar que .env.local existe
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local no encontrado"
    echo "Por favor, crea el archivo .env.local con las credenciales de Supabase"
    exit 1
fi

echo "✅ Archivo .env.local encontrado"
echo ""

# 2. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas"
echo ""

# 3. Instrucciones para ejecutar migraciones
echo "🗄️  PRÓXIMO PASO: Ejecutar migraciones SQL"
echo ""
echo "Opción 1: Usar Supabase Dashboard (Recomendado)"
echo "  1. Ve a https://app.supabase.com"
echo "  2. Selecciona tu proyecto"
echo "  3. Ve a SQL Editor"
echo "  4. Copia el contenido de migrations.sql"
echo "  5. Pega en el editor y ejecuta"
echo ""
echo "Opción 2: Usar Supabase CLI"
echo "  1. npm install -g supabase"
echo "  2. supabase link --project-ref pjdjalqzmkkdthjqekdm"
echo "  3. supabase db push"
echo ""

# 4. Instrucciones para completar .env.local
echo "🔑 CONFIGURAR VARIABLES DE ENTORNO"
echo ""
echo "Edita .env.local y reemplaza:"
echo "  - <anon_key> con tu NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  - <service_role_key> con tu SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "Puedes encontrar estas claves en:"
echo "  https://app.supabase.com → Settings → API"
echo ""

# 5. Iniciar desarrollo
echo "🎯 PARA INICIAR DESARROLLO:"
echo ""
echo "  npm run dev"
echo ""
echo "Luego abre: http://localhost:3000"
echo ""

echo "✨ ¡Configuración completada!"
