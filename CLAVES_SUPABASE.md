# 🔑 CÓMO OBTENER LAS CLAVES DE SUPABASE

## 📍 Ubicación: https://app.supabase.com

### PASO 1: Acceder a Supabase Dashboard

1. Abre https://app.supabase.com en tu navegador
2. Inicia sesión con tu cuenta
3. Verás una lista de proyectos

### PASO 2: Seleccionar el Proyecto Correcto

Busca el proyecto con esta URL:
```
https://pjdjalqzmkkdthjqekdm.supabase.co
```

Haz clic en él para abrirlo.

### PASO 3: Ir a Settings → API

En el menú lateral izquierdo:
1. Haz clic en **Settings** (engranaje)
2. Luego haz clic en **API** (en el submenu)

Deberías ver una pantalla como esta:

```
┌─────────────────────────────────────────────────────┐
│ API Settings                                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Project URL                                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ https://pjdjalqzmkkdthjqekdm.supabase.co       │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Project API keys                                    │
│                                                     │
│ anon public                                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...       │ │
│ │                                    [Copiar]     │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ service_role secret                                 │
│ ┌─────────────────────────────────────────────────┐ │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...       │ │
│ │                                    [Copiar]     │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### PASO 4: Copiar las Claves

#### 4.1 Copiar `anon public`
1. Haz clic en el botón **[Copiar]** al lado de "anon public"
2. Abre el archivo `.env.local` en tu editor
3. Reemplaza `<anon_key>` con el valor copiado

**Antes:**
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
```

**Después:**
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 4.2 Copiar `service_role secret`
1. Haz clic en el botón **[Copiar]** al lado de "service_role secret"
2. En el archivo `.env.local`, reemplaza `<service_role_key>` con el valor copiado

**Antes:**
```bash
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

**Después:**
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### PASO 5: Guardar el Archivo

1. Guarda el archivo `.env.local`
2. Verifica que se vea así:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pjdjalqzmkkdthjqekdm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
NEXT_PUBLIC_APP_NAME=Pipod Contabilidad
NEXT_PUBLIC_CURRENCY=COP
NEXT_PUBLIC_BOLD_COMMISSION=5.0
```

---

## 🗄️ EJECUTAR MIGRACIONES SQL

### Opción A: Supabase Dashboard (Recomendado)

1. En Supabase Dashboard, ve a **SQL Editor** (menú lateral)
2. Haz clic en **New Query**
3. Abre el archivo `migrations.sql` en tu editor
4. Copia TODO el contenido
5. Pega en el editor SQL de Supabase
6. Haz clic en **Run** (botón azul)
7. Espera a que se complete

**Resultado esperado:**
```
✓ Query executed successfully
```

### Opción B: Supabase CLI

```bash
# Instalar CLI (si no lo tienes)
npm install -g supabase

# Conectar con tu proyecto
supabase link --project-ref pjdjalqzmkkdthjqekdm

# Ejecutar migraciones
supabase db push
```

---

## ✅ VERIFICAR QUE TODO ESTÁ BIEN

### 1. Verificar Variables de Entorno

```bash
# En la carpeta del proyecto
cat .env.local
```

Deberías ver:
```
NEXT_PUBLIC_SUPABASE_URL=https://pjdjalqzmkkdthjqekdm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 2. Verificar Migraciones

En Supabase Dashboard:
1. Ve a **SQL Editor**
2. Haz clic en **New Query**
3. Ejecuta:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

Deberías ver estas tablas:
- `transacciones`
- `configuracion`
- `categorias`
- `productos`
- `plantillas_transacciones`

### 3. Iniciar Servidor

```bash
cd /Users/calderonjosue_/Contabilidad_pipod/pipod-contabilidad
npm run dev
```

Deberías ver:
```
✓ Ready in 2.5s
- Local: http://localhost:3000
```

### 4. Acceder a la App

Abre http://localhost:3000 en tu navegador.

Deberías ver la página de inicio de Pipod Contabilidad.

---

## 🆘 PROBLEMAS COMUNES

### Problema: "Invalid Supabase URL"

**Causa:** Las variables de entorno no están correctas

**Solución:**
1. Verifica que `.env.local` tenga las claves correctas
2. Reinicia el servidor: `npm run dev`
3. Limpia caché: `rm -rf .next && npm run dev`

### Problema: "No se puede conectar a Supabase"

**Causa:** Las claves son inválidas o expiradas

**Solución:**
1. Ve a https://app.supabase.com
2. Copia las claves nuevamente
3. Actualiza `.env.local`
4. Reinicia el servidor

### Problema: "Tabla no existe"

**Causa:** Las migraciones SQL no se ejecutaron

**Solución:**
1. Ve a Supabase Dashboard → SQL Editor
2. Copia el contenido de `migrations.sql`
3. Pega y ejecuta
4. Verifica que no hay errores

### Problema: "Error: listen EADDRINUSE :::3000"

**Causa:** El puerto 3000 ya está en uso

**Solución:**
```bash
# Usar otro puerto
npm run dev -- -p 3001

# O matar el proceso que usa el puerto
lsof -ti:3000 | xargs kill -9
```

---

## 📞 CONTACTO Y SOPORTE

Si tienes problemas:

1. **Verifica el archivo `.env.local`**
   - Las claves deben ser exactas
   - No deben tener espacios extras

2. **Verifica las migraciones**
   - Abre Supabase Dashboard → SQL Editor
   - Ejecuta: `SELECT COUNT(*) FROM transacciones;`
   - Deberías obtener un resultado (0 filas es normal)

3. **Revisa los logs**
   - Terminal: `npm run dev`
   - Navegador: F12 → Console

4. **Reinicia todo**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run dev
   ```

---

## ✨ ¡LISTO!

Una vez completados estos pasos:
- ✅ Claves de Supabase configuradas
- ✅ Migraciones SQL ejecutadas
- ✅ Servidor de desarrollo corriendo
- ✅ Aplicación lista para usar

**Próximo paso:** Crear la primera transacción en el dashboard 🚀
