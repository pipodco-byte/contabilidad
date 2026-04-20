# 🏗️ Pipod Contabilidad - Arquitectura Técnica

> Documento de arquitectura de software - SDD Level 2
> **Versión:** 2.0 | **Fecha:** Abril 2025

---

## 📋 Índice

1. [Visión Arquitectónica](#visión)
2. [Stack Tecnológico](#stack)
3. [Diagramas de Arquitectura](#diagramas)
4. [Capas del Sistema](#capas)
5. [Flujo de Datos](#flujo-de-datos)
6. [Seguridad](#seguridad)
7. [Base de Datos](#base-de-datos)
8. [APIs y Contratos](#apis)
9. [Deployment](#deployment)
10. [Consideraciones de Performance](#performance)
11. [Escalabilidad](#escalabilidad)

---

## 🎯 Visión Arquitectónica

### Propósito
Sistema de contabilidad simple pero robusto para gestión financiera de PyMEs, específicamente diseñado para el sector de venta y servicio tecnológico (Apple products).

### Principios Arquitectónicos

| Principio | Implementación |
|-----------|---------------|
| **Simplicidad** | Arquitectura monolítica Next.js, sin microservicios |
| **Type Safety** | TypeScript en todo el stack |
| **Serverless** | Vercel + Supabase (pay-per-use) |
| **Offline-first** | localStorage para sesión y tema |
| **Zero-config** | Solo necesita env vars para funcionar |

---

## 🛠️ Stack Tecnológico Detallado

### Frontend Layer

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 14.0+ | Framework React con SSR/SSG |
| React | 18.2+ | UI Library |
| TypeScript | 5.2+ | Type safety |
| Tailwind CSS | 3.3+ | Utility-first CSS |
| Lucide React | 0.292+ | Iconos |
| Recharts | 2.10+ | Gráficas interactivas |

### Backend Layer

| Tecnología | Propósito |
|------------|-----------|
| Next.js API Routes | Endpoints serverless |
| Supabase Client | Conexión a PostgreSQL |
| bcryptjs | Hashing de passwords |

### Data Layer

| Tecnología | Propósito |
|------------|-----------|
| Supabase | PostgreSQL + Auth + Realtime |
| localStorage | Persistencia de sesión y tema |

### DevOps/Infrastructure

| Servicio | Propósito |
|----------|-----------|
| Vercel | Hosting + CI/CD + Preview Deploys |
| GitHub | Control de versiones |
| Supabase Cloud | Base de datos managed |

---

## 🏛️ Diagramas de Arquitectura

### Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO                                │
│                   (Navegador Web)                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        VERCEL EDGE                            │
│                     (CDN + Serverless)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────┐    ┌─────────────────┐                   │
│   │   Static Assets │    │   API Routes    │                   │
│   │   (CSS/JS/IMG)  │    │   (Next.js)     │                   │
│   │                 │    │                 │                   │
│   │  • _next/static │    │  • /api/auth/*  │                   │
│   │  • chunks       │    │  • /api/gema/*  │                   │
│   │  • fonts        │    │  • /api/dash/*  │                   │
│   │                 │    │                 │                   │
│   └─────────────────┘    └────────┬────────┘                   │
│                                    │                           │
│                                    │ SQL/REST                  │
│                                    ▼                           │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                    SUPABASE CLOUD                       │  │
│   │              (PostgreSQL + PostgREST)                 │  │
│   │                                                         │  │
│   │   ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │  │
│   │   │   Auth      │ │   Database  │ │   Realtime      │   │  │
│   │   │   (custom)  │ │             │ │   (optional)    │   │  │
│   │   └─────────────┘ │  • usuarios   │ └─────────────────┘   │  │
│   │                   │  • transacc   │                       │  │
│   │                   │  • categorias │                       │  │
│   │                   │  • config     │                       │  │
│   │                   └─────────────┘                       │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Diagrama de Componentes

```
┌────────────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser)                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   NEXT.JS RUNTIME                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │    App      │  │  Dashboard  │  │     Pages       │   │  │
│  │  │   Router    │  │    Page     │  │   (SSR/SSG)     │   │  │
│  │  │             │  │             │  │                 │   │  │
│  │  │  • /        │  │  • Auth     │  │  • /login       │   │  │
│  │  │  • /dash    │  │  • Forms    │  │  • /dashboard   │   │  │
│  │  │             │  │  • Charts   │  │                 │   │  │
│  │  └──────┬──────┘  └──────┬──────┘  └─────────────────┘   │  │
│  │         │                │                               │  │
│  │         └────────────────┼───────────────────────────────┘  │
│  │                          │                                   │
│  │  ┌───────────────────────┴───────────────────────────────┐   │
│  │  │                   REACT COMPONENTS                     │   │
│  │  ├───────────────────────────────────────────────────────┤   │
│  │  │                                                        │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │  │  Auth    │ │  Lista   │ │  Form    │ │  Charts  │   │   │
│  │  │  │  Form    │ │  Trans   │ │  Trans   │ │          │   │   │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  │  │                                                        │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │  │  Inf     │ │  Inf     │ │  Filter  │ │  Paginat │   │   │
│  │  │  │  Mensual │ │  Anual   │ │  Select  │ │  Controls│   │   │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  │  └───────────────────────────────────────────────────────┘   │
│  │                          │                                   │
│  │  ┌───────────────────────┴───────────────────────────────┐   │
│  │  │              CUSTOM HOOKS (15 hooks)                    │   │
│  │  ├───────────────────────────────────────────────────────┤   │
│  │  │                                                        │   │
│  │  │  useAuth()  useTransacciones()  useResumen()          │   │
│  │  │  useGraficas()  usePaginatedTrans()  useTema()       │   │
│  │  │  useInformeAnual()  useInformeMensual()  ...          │   │
│  │  └───────────────────────────────────────────────────────┘   │
│  │                          │                                   │
│  │  ┌───────────────────────┴───────────────────────────────┐   │
│  │  │              UTILITIES / LIBRARY                        │   │
│  │  ├───────────────────────────────────────────────────────┤   │
│  │  │  supabase.ts  utils.ts  filterByRole.ts  constants.ts│   │
│  │  └───────────────────────────────────────────────────────┘   │
│  │                          │                                   │
│  └──────────────────────────┼───────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   localStorage  │
                    │  (auth_user)    │
                    │  (theme)        │
                    └─────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                     API LAYER (Next.js)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  POST /api/auth/login              POST /api/gema/import        │
│  ├── Valida bcrypt                ├── Parse CSV                  │
│  ├── SELECT usuarios              ├── Batch INSERT               │
│  └── Return user                  └── Return count               │
│                                                                  │
│  GET  /api/dashboard                                             │
│  └── Resumen datos                                               │
│                                                                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               │ SQL over HTTPS
                               ▼
┌────────────────────────────────────────────────────────────────┐
│                  SUPABASE POSTGRESQL                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │ usuarios_permit  │  │  transacciones   │                   │
│  │ ───────────────  │  │ ───────────────  │                   │
│  │ id PK            │  │ id PK            │                   │
│  │ username UQ      │  │ user_id FK       │───┐               │
│  │ password_hash    │  │ fecha            │   │               │
│  │ nombre           │  │ descripcion      │   │               │
│  │ rol              │  │ categoria        │   │               │
│  │ activo           │  │ sub_categoria    │   │               │
│  └──────────────────┘  │ monto            │   │               │
│                         │ tipo             │   │               │
│                         │ medio_pago       │   │               │
│                         │ estado_iva       │   │               │
│                         │ comentarios      │   │               │
│                         └──────────────────┘   │               │
│                                                │               │
│  ┌──────────────────┐  ┌──────────────────┐   │               │
│  │  categorias      │  │  configuracion   │   │               │
│  │ ───────────────  │  │ ───────────────  │   │               │
│  │ id PK            │  │ id PK            │   │               │
│  │ user_id FK       │──┘ user_id FK       │───┘               │
│  │ tipo             │     clave            │                   │
│  │ nombre           │     valor            │                   │
│  │ sub_categorias[] │                      │                   │
│  └──────────────────┘                      └───────────────────┘
│                                                                │
│  ÍNDICES:                                                      │
│  • idx_transacciones_user_fecha (user_id, fecha DESC)         │
│  • idx_transacciones_tipo                                      │
│  • idx_transacciones_categoria                                 │
│  • idx_transacciones_automatico                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔲 Capas del Sistema

### Capa 1: Presentación (UI)

**Responsabilidades:**
- Renderizar interfaces
- Manejar interacciones del usuario
- Mostrar estados de loading/error
- Aplicar tema dark/light

**Componentes principales:**
- `AuthForm.tsx` - Login
- `Dashboard` page - Layout principal
- `TransaccionForm.tsx` - CRUD
- `ListaTransacciones.tsx` - Tabla paginada
- `Graficas.tsx` - Visualización
- `InformeMensual.tsx` / `InformeAnual.tsx` - Reportes

**Hooks de UI:**
- `useTema.ts` - Theme toggle

### Capa 2: Lógica de Negocio (Hooks)

**Responsabilidades:**
- Fetching de datos
- Transformaciones
- Validaciones
- Side effects

**Hooks de Datos:**
- `useAuth.ts` - Gestión de sesión
- `useTransacciones.ts` - CRUD
- `usePaginatedTransactions.ts` - Paginación + filtros
- `useResumen.ts` - Agregaciones
- `useGraficas.ts` - Datos para charts
- `useInformeAnual.ts` / `useInformeMensual.ts` - Reportes
- `useExportarExcel.ts` / `useExportarPDF.ts` - Export

### Capa 3: API (Next.js Routes)

**Responsabilidades:**
- Endpoints HTTP
- Validación de requests
- Orquestación de BD
- Respuestas JSON

**Routes implementadas:**
- `POST /api/auth/login` - Autenticación
- `POST /api/gema/import` - Import CSV
- `GET /api/dashboard` - Resumen

### Capa 4: Persistencia (Supabase)

**Responsabilidades:**
- Almacenamiento de datos
- Constraints e integridad
- Índices para performance
- Triggers (updated_at)

**Tablas:**
- `usuarios_permitidos` - Usuarios
- `transacciones` - Registros contables
- `categorias` - Taxonomía
- `configuracion` - Settings
- `productos` - Inventario (no usado)

---

## 🔄 Flujo de Datos Detallado

### Caso 1: Login

```
Usuario ingresa credenciales
         │
         ▼
┌─────────────────┐
│   AuthForm.tsx  │ ──► onSubmit()
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   useAuth.ts    │ ──► signIn(username, password)
└────────┬────────┘
         │
         ▼ POST /api/auth/login
┌─────────────────┐
│  login/route.ts │ ──► SELECT * FROM usuarios_permitidos
└────────┬────────┘         WHERE username = $1
         │
         ▼ bcrypt.compare()
┌─────────────────┐
│  Validation     │ ──► Si OK: retorna user
└────────┬────────┘    Si FAIL: 401
         │
         ▼
┌─────────────────┐
│ localStorage    │ ──► setItem('auth_user', JSON.stringify(user))
└────────┬────────┘
         │
         ▼ router.push('/dashboard')
┌─────────────────┐
│   Dashboard     │ ──► useAuth() lee localStorage
└─────────────────┘
```

### Caso 2: Crear Transacción

```
Usuario llena formulario
         │
         ▼
┌─────────────────────┐
│ TransaccionForm.tsx │ ──► handleSubmit()
└──────────┬──────────┘
           │
           ▼ validación local
┌─────────────────────┐
│ useTransacciones.ts │ ──► crearTransaccion(data)
└──────────┬──────────┘
           │
           ▼ supabase.from('transacciones').insert({...})
┌─────────────────────┐
│     Supabase        │ ──► INSERT INTO transacciones
└──────────┬──────────┘
           │
           ▼ success
┌─────────────────────┐
│   Dashboard         │ ──► onSuccess() refresca hooks
│   (useResumen,      │     usePaginatedTransactions)
│    ListaTrans)      │
└─────────────────────┘
```

### Caso 3: Filtrar Transacciones

```
Usuario cambia mes/año
         │
         ▼
┌─────────────────────────────┐
│ ListaTransacciones.tsx      │ ──► setSelectedMonth() / setSelectedYear()
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ usePaginatedTransactions.ts   │ ──► useEffect dispara
└──────────────┬──────────────┘
               │
               ▼ Calcula rango fechas
               ▼ Construye query
┌─────────────────────────────┐
│ Supabase                    │ ──► SELECT * FROM transacciones
│                             │     WHERE fecha BETWEEN $1 AND $2
│                             │     AND user_id = $3
│                             │     ORDER BY fecha DESC
│                             │     LIMIT 20 OFFSET $4
└──────────────┬──────────────┘
               │
               ▼ Retorna {data, count}
┌─────────────────────────────┐
│ ListaTransacciones.tsx      │ ──► Renderiza tabla + pagination controls
└─────────────────────────────┘
```

---

## 🔐 Seguridad

### Autenticación

**Implementación actual:**
- Custom auth con localStorage
- bcryptjs para passwords (con fallback a plain text)
- Sin JWT, sin cookies httpOnly

**Flujo de password:**
```
Plain text ──► bcrypt.hash() ──► Almacenar hash
     │                              │
     │                              ▼
     └──► bcrypt.compare() ◀─── DB: $2b$10$...
```

**Roles:**
- `admin` - Acceso total
- `contador` - Crear/ver transacciones
- `usuario` - Solo ver propias

**Problemas conocidos:**
- ❌ localStorage vulnerable a XSS
- ❌ Sin RLS habilitado en Supabase
- ❌ Sin rate limiting
- ❌ Sin 2FA

**Recomendaciones futuras:**
- Migrar a JWT httpOnly cookies
- Habilitar RLS en Supabase
- Implementar rate limiting
- Agregar CSRF tokens

### Datos

**Encriptación:**
- Conexión Supabase: HTTPS/TLS 1.3
- Passwords: bcrypt con salt rounds 10+
- Datos sensibles: No almacenados (no hay tarjetas, etc.)

**Backups:**
- Supabase maneja backups automáticos
- Punto de recuperación: 7 días

---

## 🗄️ Base de Datos

### Esquema Completo

```sql
-- Tabla: usuarios_permitidos
CREATE TABLE usuarios_permitidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'usuario',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: transacciones
CREATE TABLE transacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES usuarios_permitidos(id) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  descripcion TEXT NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  sub_categoria VARCHAR(50) NOT NULL,
  monto DECIMAL(15,2) NOT NULL CHECK (monto > 0),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Ingreso', 'Egreso')),
  medio_pago VARCHAR(50) NOT NULL,
  estado_iva VARCHAR(20) NOT NULL CHECK (estado_iva IN ('Exento', 'Incluido', 'Discriminado', 'N/A')),
  comentarios TEXT,
  es_automatico BOOLEAN DEFAULT FALSE,
  transaccion_padre_id UUID REFERENCES transacciones(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices optimizados
CREATE INDEX idx_transacciones_user_fecha ON transacciones(user_id, fecha DESC);
CREATE INDEX idx_transacciones_tipo ON transacciones(tipo);
CREATE INDEX idx_transacciones_categoria ON transacciones(categoria);
CREATE INDEX idx_transacciones_automatico ON transacciones(es_automatico);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transacciones_updated_at
  BEFORE UPDATE ON transacciones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Relaciones

```
┌──────────────────┐         ┌──────────────────┐
│ usuarios_permit  │1       *│  transacciones   │
│ ───────────────  │────────▶│ ───────────────  │
│ id PK            │         │ id PK            │
│ username         │         │ user_id FK       │
└──────────────────┘         │ ...              │
                             └──────────────────┘
                                    │
                                    │ self-ref
                                    ▼
                             ┌──────────────────┐
                             │ transacciones    │
                             │ (padre)          │
                             └──────────────────┘
```

### Cardinalidad

| Relación | Tipo | Descripción |
|----------|------|-------------|
| usuario → transacciones | 1:N | Un usuario tiene muchas transacciones |
| transacción → transacción | 1:N (self) | Transacciones relacionadas (padre/hijo) |

---

## 🌐 APIs y Contratos

### 1. POST /api/auth/login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response 200 OK:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "felipe",
  "nombre": "Felipe Calderón",
  "rol": "admin"
}
```

**Response 401 Unauthorized:**
```json
{
  "message": "Usuario o contraseña incorrectos"
}
```

### 2. POST /api/gema/import

**Request:**
```http
POST /api/gema/import
Content-Type: application/json

{
  "transacciones": [
    {
      "fecha": "2025-04-15",
      "descripcion": "Venta iPhone",
      "categoria": "Venta Equipos Nuevos",
      "sub_categoria": "iPhones",
      "monto": 4500000,
      "tipo": "Ingreso",
      "medio_pago": "Bold",
      "estado_iva": "Incluido",
      "comentarios": "Cliente Juan"
    }
  ],
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response 200 OK:**
```json
{
  "count": 1,
  "message": "1 transacciones importadas"
}
```

### 3. GET /api/dashboard

**Request:**
```http
GET /api/dashboard?userId=uuid&userRole=admin
```

**Response 200 OK:**
```json
{
  "resumen": {
    "totalIngresos": 150000000,
    "totalEgresos": 80000000,
    "balance": 70000000
  }
}
```

---

## 🚀 Deployment

### Pipeline CI/CD (Vercel)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Push to   │────▶│   Vercel    │────▶│   Build     │
│   GitHub    │     │   Webhook   │     │   & Deploy  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                          ┌─────────────────────┼─────────────────────┐
                          │                     │                     │
                          ▼                     ▼                     ▼
                    ┌──────────┐        ┌──────────┐          ┌──────────┐
                    │  main    │        │ develop  │          │   test   │
                    │ (prod)   │        │ (stage)  │          │  (test)  │
                    └──────────┘        └──────────┘          └──────────┘
```

### Environments

| Environment | URL | BD | Uso |
|-------------|-----|-----|-----|
| Production | https://contabilidad-pipod.vercel.app | Supabase Prod | Cliente real |
| Develop | https://contabilidad-457z.vercel.app | Supabase Prod | Testing |
| Local | http://localhost:3000 | Supabase Prod/Dev | Desarrollo |

### Variables de Entorno

```bash
# .env.local (requerido)
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Deploy Manual

```bash
# 1. Push a develop
git checkout develop
git add .
git commit -m "feat: nueva funcionalidad"
git push origin develop

# Vercel auto-deploy de develop branch

# 2. Merge a main (producción)
git checkout main
git merge develop
git push origin main
```

---

## ⚡ Consideraciones de Performance

### Optimizaciones Implementadas

| Técnica | Implementación | Impacto |
|---------|---------------|---------|
| **Índices BD** | 4 índices en transacciones | Consultas 10x más rápidas |
| **Paginación** | 20 items/página | Reduce carga inicial |
| **Lazy Loading** | Informes bajo demanda | Carga dashboard más rápido |
| **CSS Purge** | Tailwind JIT | Bundle size reducido |
| **Code Split** | Next.js automático | Carga por ruta |

### Métricas Actuales (Estimado)

| Métrica | Valor | Objetivo |
|---------|-------|----------|
| First Contentful Paint | ~1.2s | < 1.5s ✅ |
| Time to Interactive | ~2.5s | < 3.0s ✅ |
| Bundle Size (gzipped) | ~180KB | < 200KB ✅ |
| BD Query (p50) | ~50ms | < 100ms ✅ |
| BD Query (p95) | ~150ms | < 300ms ✅ |

### Optimizaciones Futuras

- [ ] React Query para caché y deduplicación
- [ ] Infinite scroll para lista de transacciones
- [ ] Virtualización para tablas grandes
- [ ] Pre-fetching de datos comunes
- [ ] CDN para assets estáticos

---

## 📈 Escalabilidad

### Límites Actuales

| Recurso | Límite Actual | Límite Supabase Free |
|---------|--------------|---------------------|
| Usuarios | 10 | ~500 |
| Transacciones/mes | ~1,000 | Ilimitado (500MB) |
| Almacenamiento | 500MB | 500MB |
| Requests/día | ~1,000 | Ilimitado |

### Escalación Horizontal

**Si se necesita escalar:**

1. **Usuarios > 500:** Migrar a Supabase Pro ($25/mes)
2. **Transacciones > 10k/mes:** Implementar particionamiento por fecha
3. **Storage > 500MB:** Agregar bucket S3/R2 para documentos
4. **Tráfico alto:** Vercel Pro + Edge Functions

### Arquitectura Futura (si escala)

```
┌─────────────────────────────────────────────────────────────┐
│                      LOAD BALANCER                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Vercel      │    │  Vercel      │    │  Vercel      │
│  Instance 1  │    │  Instance 2  │    │  Instance N  │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           ▼
                ┌────────────────────┐
                │   Supabase Pro     │
                │  (Read Replicas)   │
                └────────────────────┘
```

---

## 📝 Decisiones Arquitectónicas (ADRs)

### ADR-001: Custom Auth vs Supabase Auth

**Decisión:** Implementar auth custom con bcrypt

**Razones:**
- Mayor control sobre roles y permisos
- Sin dependencia de Supabase Auth (más flexible)
- Compatible con sistema legado

**Trade-offs:**
- + Flexibilidad
- - Menos seguro (localStorage vs cookies httpOnly)
- - Más código propio que mantener

### ADR-002: Monolito vs Microservicios

**Decisión:** Mantener monolito Next.js

**Razones:**
- Equipo pequeño (1-2 devs)
- Complejidad baja del dominio
- Deploy más simple

**Trade-offs:**
- + Simplicidad
- - Acoplamiento

### ADR-003: localStorage vs Cookies

**Decisión:** localStorage para sesión

**Razones:**
- Simplicidad de implementación
- No requiere configuración de cookies
- Funciona bien con serverless

**Trade-offs:**
- + Simple de implementar
- - Vulnerable a XSS
- - No funciona en SSR (hydration issues)

---

## 🎯 Conclusión

La arquitectura actual es **adecuada para el estado actual del proyecto**:

✅ **Fortalezas:**
- Simple y fácil de entender
- Deploy rápido en Vercel
- Costo bajo (free tier)
- TypeScript en todo el stack

⚠️ **Deudas Técnicas:**
- Auth en localStorage (seguridad)
- Sin tests automatizados
- Sin RLS en BD
- Sin caché de datos

**Recomendación:** Mantener arquitectura actual hasta ~1,000 usuarios o ~10k transacciones mensuales. Luego evaluar migración a auth más robusta y caching.

---

**Fin del Documento**

*Arquitectura documentada siguiendo prácticas SDD Level 2*
