# 🚀 SETUP PIPOD CONTABILIDAD - GUÍA PASO A PASO

## ✅ Estado Actual

- ✅ Proyecto Next.js creado
- ✅ Dependencias instaladas
- ✅ Archivo `.env.local` creado
- ✅ Archivo `migrations.sql` creado
- ⏳ **PENDIENTE:** Ejecutar migraciones SQL
- ⏳ **PENDIENTE:** Completar variables de entorno

---

## 📋 PASO 1: Obtener Credenciales de Supabase

### 1.1 Ir a Supabase Dashboard
1. Abre https://app.supabase.com
2. Inicia sesión con tu cuenta
3. Selecciona el proyecto con URL: `https://pjdjalqzmkkdthjqekdm.supabase.co`

### 1.2 Obtener las Claves API
1. En el menú lateral, ve a **Settings** → **API**
2. Copia estas dos claves:
   - **Project URL** (ya tienes: `https://pjdjalqzmkkdthjqekdm.supabase.co`)
   - **anon public** (copia este valor)
   - **service_role secret** (copia este valor)

---

## 🗄️ PASO 2: Ejecutar Migraciones SQL

### Opción A: Supabase Dashboard (Recomendado - Más Fácil)

1. En Supabase Dashboard, ve a **SQL Editor** (en el menú lateral)
2. Haz clic en **New Query**
3. Abre el archivo `migrations.sql` en tu editor de código
4. Copia TODO el contenido del archivo
5. Pega en el editor SQL de Supabase
6. Haz clic en **Run** (botón azul)
7. Espera a que se complete (verás un ✅ verde)

### Opción B: Supabase CLI (Alternativa)

```bash
# Instalar CLI
npm install -g supabase

# Conectar con tu proyecto
supabase link --project-ref pjdjalqzmkkdthjqekdm

# Ejecutar migraciones
supabase db push
```

---

## 🔑 PASO 3: Completar Variables de Entorno

1. Abre el archivo `.env.local` en tu editor
2. Reemplaza los valores:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pjdjalqzmkkdthjqekdm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<PEGA_AQUI_LA_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<PEGA_AQUI_LA_SERVICE_ROLE_KEY>

# App Configuration (estos ya están bien)
NEXT_PUBLIC_APP_NAME=Pipod Contabilidad
NEXT_PUBLIC_CURRENCY=COP
NEXT_PUBLIC_BOLD_COMMISSION=5.0
```

**Ejemplo de cómo se vería:**
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 PASO 4: Iniciar Servidor de Desarrollo

```bash
# Navega a la carpeta del proyecto
cd /Users/calderonjosue_/Contabilidad_pipod/pipod-contabilidad

# Inicia el servidor
npm run dev
```

**Resultado esperado:**
```
> pipod-contabilidad@1.0.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

---

## 🌐 PASO 5: Acceder a la Aplicación

1. Abre tu navegador
2. Ve a: **http://localhost:3000**
3. Deberías ver la página de inicio de Pipod Contabilidad

---

## 🧪 PASO 6: Verificar que Todo Funciona

### Prueba 1: Crear Cuenta
1. Haz clic en **Registrarse**
2. Ingresa un email y contraseña
3. Deberías recibir un email de confirmación

### Prueba 2: Acceder al Dashboard
1. Inicia sesión con tu cuenta
2. Deberías ver el dashboard vacío
3. Los botones **➕ INGRESO** y **➖ GASTO** deben estar disponibles

### Prueba 3: Crear una Transacción
1. Haz clic en **➕ INGRESO**
2. Completa el formulario:
   - Descripción: "Venta de prueba"
   - Monto: 100000
   - Categoría: Ventas
   - Sub-categoría: Venta Equipos
   - Medio de Pago: Efectivo
   - Estado IVA: Exento
3. Haz clic en **Guardar Transacción**
4. Deberías ver la transacción en la lista

---

## 🐛 Troubleshooting

### Error: "Invalid Supabase URL"
**Solución:** Verifica que las variables en `.env.local` sean correctas

### Error: "No autorizado" al crear transacción
**Solución:** Asegúrate de estar autenticado. Inicia sesión primero.

### Error: "Tabla no existe"
**Solución:** Las migraciones SQL no se ejecutaron. Vuelve al PASO 2.

### El servidor no inicia
**Solución:** 
```bash
# Limpia caché
rm -rf .next
npm run dev
```

### Puerto 3000 ya está en uso
**Solución:**
```bash
npm run dev -- -p 3001
```

---

## 📁 Estructura de Archivos Creados

```
pipod-contabilidad/
├── .env.local              ✅ Configuración (EDITAR CON CLAVES)
├── migrations.sql          ✅ Migraciones SQL (EJECUTAR EN SUPABASE)
├── setup.sh               ✅ Script de setup
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dashboard/route.ts
│   │   │   └── transacciones/route.ts
│   │   ├── dashboard/page.tsx
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── constants.ts
│   │   ├── validations.ts
│   │   └── utils.ts
│   └── types/index.ts
└── package.json
```

---

## 🎓 Próximos Pasos (Después de Verificar)

1. **Crear componentes UI** (Botones, Modales, Formularios)
2. **Implementar formulario de transacciones** con validación
3. **Conectar dashboard** con datos reales
4. **Agregar gráficas** con Recharts
5. **Implementar exportación** a Excel

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que todas las variables de entorno estén correctas
2. Asegúrate de que las migraciones SQL se ejecutaron sin errores
3. Revisa la consola del navegador (F12) para errores
4. Revisa la terminal donde corre `npm run dev`

---

## ✨ ¡Listo!

Una vez completados estos pasos, tendrás:
- ✅ Base de datos configurada en Supabase
- ✅ Autenticación funcionando
- ✅ API conectada
- ✅ Servidor de desarrollo corriendo
- ✅ Aplicación lista para desarrollar

**¡Ahora puedes empezar a construir las funcionalidades!** 🚀
