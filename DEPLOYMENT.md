# 🚀 Guía de Deployment en Vercel

## Pasos para desplegar en Vercel

### 1. Conectar repositorio
1. Ir a [vercel.com](https://vercel.com)
2. Hacer clic en "New Project"
3. Seleccionar el repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Next.js

### 2. Configurar variables de entorno
En la sección "Environment Variables" del proyecto en Vercel, agregar:

```
NEXT_PUBLIC_SUPABASE_URL=https://pjdjalqzmkkdthjqekdm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_NAME=Pipod Contabilidad
NEXT_PUBLIC_CURRENCY=COP
NEXT_PUBLIC_BOLD_COMMISSION=5.0
RESEND_API_KEY=re_JynNFUF7_6qzw8rmzZVkYxGKB15MHzEer
RESEND_FROM_EMAIL=noreply@pipod.co
FELIPE_EMAIL=pipod.co@gmail.com
```

### 3. Desplegar
1. Hacer clic en "Deploy"
2. Vercel compilará y desplegará automáticamente
3. El sitio estará disponible en `https://[project-name].vercel.app`

### 4. Configurar dominio personalizado (opcional)
1. Ir a "Settings" → "Domains"
2. Agregar tu dominio personalizado
3. Seguir las instrucciones de DNS

## Variables de entorno requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase | `eyJhbGc...` |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la aplicación | `Pipod Contabilidad` |
| `NEXT_PUBLIC_CURRENCY` | Moneda | `COP` |
| `NEXT_PUBLIC_BOLD_COMMISSION` | Comisión Bold | `5.0` |
| `RESEND_API_KEY` | API key de Resend (email) | `re_xxx` |
| `RESEND_FROM_EMAIL` | Email remitente | `noreply@pipod.co` |
| `FELIPE_EMAIL` | Email de Felipe | `pipod.co@gmail.com` |

## Troubleshooting

### Error: "supabaseUrl is required"
- Verificar que `NEXT_PUBLIC_SUPABASE_URL` esté configurada en Vercel
- Las variables deben estar en "Environment Variables" del proyecto

### Build falla
- Revisar los logs en Vercel
- Asegurar que todas las variables de entorno estén configuradas
- Ejecutar `npm run build` localmente para verificar

## Monitoreo

Vercel proporciona:
- Analytics automático
- Logs en tiempo real
- Alertas de errores
- Rollback automático si hay problemas

## CI/CD

Cada push a `main` en GitHub:
1. Vercel detecta el cambio
2. Ejecuta `npm run build`
3. Si es exitoso, despliega automáticamente
4. Si falla, mantiene la versión anterior
