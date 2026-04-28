# 💎 Pipod Contabilidad

Sistema de gestión contable simple y eficiente para Pipod.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build para Producción

```bash
npm run build
npm start
```

## 📋 Estructura del Proyecto

```
src/
├── app/              # Rutas y páginas
├── components/       # Componentes React
├── lib/             # Utilidades y configuración
├── hooks/           # Custom hooks
└── types/           # Tipos TypeScript
```

## 🔧 Configuración de Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar las migraciones SQL del documento `proyecto.md`
3. Copiar credenciales a `.env.local`

## 📚 Documentación

Ver `proyecto.md` para documentación completa del proyecto.

---

## 🔍 Discoveries Importantes

### Tablas de Supabase

| Tabla | Uso |
|-------|-----|
| `cont_transacciones` | Transacciones financieras (principal) |
| `cont_usuarios` | Usuarios relacionados con transacciones |
| `usuarios` | Tabla de autenticación (auth) |

### Arquitectura de IA

- **Gema (IA Lote):** `/dashboard` - Registra transacciones por voz/lote usando tool calling
  - Endpoint: `/api/assistant/chat`
  - Usa AI SDK 6+ con `generateText` + `execute` handler
- **IA Estrategia:** `/dashboard/ia-strategy` - Análisis y estrategia financiera
  - Endpoint: `/api/strategy/chat`

### Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `invalid input syntax for type uuid: ""` | Query con userId vacío | Agregar guard clause `if (!userId \|\| userId.length < 5)` |
| Tabla no existe / datos vacíos | Nombre incorrecto de tabla | Usar `cont_transacciones` (no `transacciones`) |

### Gema Lote v2.0 - Tool Calling

Gema usa tool calling para insertar transacciones:

```typescript
// Tool schema en assistant-tools.ts
handleLoteTransaction: insertions directas a cont_transacciones
```

Constraints de Supabase:
- `sub_categoria` no permite NULL → usar `'N/A'`
- `user_id` requiere UUID válido con FK a `cont_usuarios`

### UUIDs Importantes

| UUID | Descripción |
|------|-------------|
| `ca85a0bc-2e6e-4887-bf75-930f4dd34880` | Felipe (cont_usuarios) |

## 📁 SDDs Completados

| SDD | Fecha | Descripción |
|-----|-------|-------------|
| `gema-lote-v2` | 2026-04-28 | Schema + API + BatchCard + confirmation UI |
| `gema-atomic-response` | 2026-04-28 | streamText → generateText |
| `gema-stream-stability` | 2026-04-28 | Fix indentación, disable tools temp |
| `gema-tool-unification` | 2026-04-28 | Single tool + dynamic date + silencio clause |
| `gema-execute-handler` | 2026-04-28 | handleLoteTransaction function |
| `gema-table-name-fix` | 2026-04-28 | route.ts: transacciones → cont_transacciones |
| `gema-subcategoria-fix` | 2026-04-28 | NULL handling para sub_categoria |
| `gema-cont-usuarios-fix` | 2026-04-28 | UUID correcto de cont_usuarios |
| `gema-confirmation-ui` | 2026-04-28 | Confirmation en chat cuando toolResults existe |
| `table-name-consistency-fix` | 2026-04-28 | 18 archivos: transacciones → cont_transacciones |
| `empty-userid-query-fix` | 2026-04-28 | Guard clause contra userId vacío |

## 🔄 Workflow de Desarrollo

1. **Explorar** → Investigar problema
2. **SDD Init** → `sdd-init` o crear directorio en `openspec/changes/`
3. **Spec → Design → Tasks → Apply → Verify → Archive**
4. **Commit** (sin push hasta estar listo)
5. **Push** cuando todo esté verificado

### Commits Recientes (develop)

```
44ad60b fix: guard clause against empty userId in transaction hooks
51925d4 fix: use cont_transacciones table consistently across all hooks and APIs
8ed3a55 feat(gema-lote-v2): implement Gema batch transactions with tool calling
8b6dda9 feat(gema-lote-v2): add batch transactions with BatchCard UI
```

## ⚠️ Notas Importantes

- **NO usar** `.from('transacciones')` - usar `.from('cont_transacciones')`
- **NO usar** `.from('usuarios')` para transacciones - es solo para auth
- **Usar** `cont_usuarios` para FK de user_id en transacciones
- **UserId vacío** causa error 400 en Supabase - siempre validar antes de query