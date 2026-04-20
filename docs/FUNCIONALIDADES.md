# 📊 Pipod Contabilidad - Funcionalidades Completas

> Documentación técnica detallada de todas las funcionalidades del sistema
> **Versión:** 2.0 | **Fecha:** Abril 2025 | **Nivel:** SDD Level 2

---

## 🗺️ Índice de Contenido

1. [Visión General del Sistema](#visión-general)
2. [Diagrama de Flujo de Datos](#diagrama-de-flujo)
3. [Módulos por Categoría](#módulos)
4. [Hooks Personalizados](#hooks)
5. [Componentes UI](#componentes)
6. [API Endpoints](#api-endpoints)
7. [Base de Datos](#base-de-datos)
8. [Matriz de Dependencias](#matriz-de-dependencias)
9. [Flujo de Autenticación](#flujo-de-autenticación)
10. [Flujo de Datos Contables](#flujo-de-datos-contables)

---

## 📋 Visión General del Sistema

**Pipod Contabilidad** es un sistema de gestión contable diseñado para la empresa Pipod, especializada en venta y reparación de equipos Apple y tecnología.

### Propósito Principal
- Registrar y categorizar transacciones financieras (Ingresos/Egresos)
- Generar informes mensuales y anuales con gráficas interactivas
- Exportar datos en CSV y PDF
- Importar transacciones desde sistema Gema
- Control de acceso por roles (Admin/Contador/Usuario)

### Stack Tecnológico
| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 + React 18 + TypeScript |
| Estilos | Tailwind CSS + Dark/Light Theme |
| Estado | React Hooks + localStorage |
| Backend | Supabase (PostgreSQL) |
| Gráficas | Recharts |
| Deploy | Vercel |
| Auth | bcryptjs + Custom JWT (localStorage) |

---

## 🔄 Diagrama de Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            USUARIO                                     │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        PÁGINAS (Next.js)                              │
├─────────────────────────────────────────────────────────────────────────┤
│  / (Login)                    /dashboard (Principal)                   │
│  ├── AuthForm.tsx            ├── KPI Cards (Resumen)                    │
│  │   └── useAuth.ts          ├── ListaTransacciones                   │
│  │       └── POST /api/auth/      └── usePaginatedTransactions.ts      │
│  │           /login           ├── Graficas                             │
│  └── useTema.ts                   ├── useGraficas.ts                   │
│                               ├── InformeMensual                      │
│                               │   └── useInformeMensual.ts             │
│                               └── InformeAnual                        │
│                                   └── useInformeAnual.ts               │
└────────────────────────────┬──────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      HOOKS DE DATOS                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│   │ useAuth.ts       │    │ useTransacciones │    │ useResumen.ts    │  │
│   │ ───────────────  │    │ ───────────────  │    │ ───────────────  │  │
│   │ signIn()         │    │ crearTransaccion │    │ cargarResumen()  │  │
│   │ signOut()        │    │ loading          │    │ totalIngresos    │  │
│   │ user (stored)    │    │ error            │    │ totalEgresos     │  │
│   └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘  │
│            │                       │                       │            │
│            └───────────────────────┼───────────────────────┘            │
│                                    │                                    │
│                                    ▼                                    │
│                         ┌──────────────────┐                           │
│                         │   SUPABASE       │                           │
│                         │  (PostgreSQL)    │                           │
│                         └────────┬─────────┘                           │
│                                  │                                      │
└──────────────────────────────────┼──────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         TABLAS DE BASE DE DATOS                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│   │ usuarios_permit  │  │  transacciones   │  │ categorias       │    │
│   │ ───────────────  │  │ ───────────────  │  │ ───────────────  │    │
│   │ id (UUID)        │  │ id (UUID)        │  │ id (UUID)        │    │
│   │ username         │  │ user_id (FK)     │──│ user_id (FK)     │    │
│   │ password_hash    │  │ fecha            │  │ tipo             │    │
│   │ nombre           │  │ descripcion      │  │ nombre           │    │
│   │ rol              │  │ categoria        │  │ sub_categorias[] │    │
│   │ activo           │  │ sub_categoria    │  └──────────────────┘    │
│   └──────────────────┘  │ monto            │                          │
│                         │ tipo             │  ┌──────────────────┐    │
│                         │ medio_pago       │  │ configuracion    │    │
│                         │ estado_iva       │  │ ───────────────  │    │
│                         │ comentarios      │  │ clave/valor      │    │
│                         └──────────────────┘  └──────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────┐
                    │   API ROUTES (Next.js)  │
                    ├─────────────────────────┤
                    │                         │
│   POST /api/auth/login          POST /api/gema/import       │
│   ├── Valida credenciales       ├── Parsea CSV              │
│   ├── bcrypt compare            ├── Batch insert            │
│   └── Retorna user data         └── Retorna count           │
│                                                             │
│   POST /api/dashboard           (Otras rutas pendientes)   │
│   └── Resumen de datos                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Módulos por Categoría

### 1. 🔐 Módulo de Autenticación

**Archivos:**
- `src/hooks/useAuth.ts`
- `src/components/AuthForm.tsx`
- `src/app/api/auth/login/route.ts`

**Funciones:**

#### `useAuth()` - Hook de autenticación
```typescript
interface AuthUser {
  id: string;
  username: string;
  nombre: string;
  rol: string; // 'admin' | 'contador' | 'usuario'
}

// Returns:
{
  user: AuthUser | null;      // Usuario logueado
  loading: boolean;            // Estado de carga inicial
  signIn: (username, password) => Promise<void>;
  signOut: () => void;
}
```

**Flujo de Login:**
1. Usuario ingresa credenciales en `AuthForm.tsx`
2. `signIn()` hace POST a `/api/auth/login`
3. API valida con bcryptjs (soporta hashes y plain text)
4. Si éxito: guarda en `localStorage` como `auth_user`
5. Redirecciona a `/dashboard`

**Roles y Permisos:**
| Rol | Permisos |
|-----|----------|
| `admin` | Ver todas las transacciones, enviar reportes, acceso total |
| `contador` | Ver todas las transacciones, crear/editar |
| `usuario` | Solo ver sus propias transacciones |

---

### 2. 📊 Módulo de Dashboard

**Archivo:** `src/app/dashboard/page.tsx`

**Funcionalidades:**

#### KPI Cards (Tarjetas de Resumen)
- **Ingresos:** Total de ingresos formateados en COP
- **Egresos:** Total de egresos formateados en COP
- **Balance:** Ingresos - Egresos (color verde si positivo, rojo si negativo)

#### Botones de Acción
| Botón | Función | Color |
|-------|---------|-------|
| Gema | Importar desde CSV | Verde (Emerald) |
| Nueva Transacción | Abrir formulario | Verde (Emerald) |
| Informe Anual | Toggle informe | Ámbar/Naranja |
| Informe Mensual | Toggle informe | Azul/Cyan |

#### Tema Dark/Light
- Toggle en header
- Persistente en localStorage
- Clases Tailwind: `dark:bg-slate-950`, `bg-white`

---

### 3. 💰 Módulo de Transacciones

**Archivos:**
- `src/components/TransaccionForm.tsx`
- `src/components/ListaTransacciones.tsx`
- `src/hooks/useTransacciones.ts`
- `src/hooks/usePaginatedTransactions.ts`

#### TransaccionForm - Crear Transacción

**Categorías Definidas (hardcoded):**

**Ingresos:**
- Venta Equipos Nuevos: Computadoras, MacBooks, iMacs, iPhones, iPads, AirPods, Smartwatches, Otros
- Venta Equipos Usados: Mismo subconjunto
- Venta Accesorios: Accesorios
- Servicios Técnicos: Computadoras, MacBooks, iMacs, iPhones, iPads, AirPods, Smartwatches, Otros
- Otros Servicios: Consultoría, Soporte, Otros

**Egresos:**
- Plan Retoma: iPhone, MacBooks, iMacs, iPad, AirPods, Portátiles, Smartphones, Otros
- Compra Equipos: Equipos Nuevos, Equipos Usados, Accesorios
- Marketing: Publicidad Digital, Redes Sociales, Otros
- Operación: Alquiler, Servicios, Suministros
- Nómina: Pago Samuel, Pago Josué, Otros Empleados
- Otros Gastos: Varios

**Medios de Pago:**
`['Bancolombia', 'Davivienda', 'Bre-B', 'Bold', 'Efectivo', 'Transferencia']`

**Estados IVA:**
`['Exento', 'Incluido', 'Discriminado', 'N/A']`

**Validaciones:**
- Monto > 0 (validado en BD)
- Fecha requerida
- Descripción requerida
- Bold muestra warning de comisión 5.0%

#### ListaTransacciones - Listado con Paginación

**Filtros:**
- Año selector (default: actual)
- Mes selector (default: actual)
- Tipo: Todos | Ingreso | Egreso

**Paginación:**
- 20 items por página
- Controles: Primera, Anterior, Página actual, Siguiente, Última
- Total de items mostrado

**Acciones por fila:**
- Editar (ícono lápiz) - Toggle inline
- Eliminar (ícono trash) - No implementado completamente

**Exportación:**
- CSV (useExportarExcel)
- PDF (useExportarPDF)

---

### 4. 📈 Módulo de Gráficas

**Archivos:**
- `src/components/Graficas.tsx`
- `src/hooks/useGraficas.ts`
- `src/hooks/useInformeAnual.ts`
- `src/hooks/useInformeMensual.ts`
- `src/hooks/useRadarData.ts`
- `src/hooks/useEvolucionMensual.ts`

#### Tipos de Gráficas

**1. Barras - Ingresos vs Egresos por Categoría**
- X: Categorías (rotadas -45°)
- Y: Montos en COP compactos
- Series: Ingresos (verde #10b981), Egresos (indigo #6366f1)

**2. Área - Evolución Temporal**
- X: Meses ordenados cronológicamente
- Y: Montos acumulados
- Fill con opacidad 0.6

**3. Radar - Análisis Multicategoría (Millones COP)**
- Dimensiones: Todas las categorías
- 2 series: Ingresos, Egresos
- Escala automática

**4. Área con Gradientes - Evolución Mensual Año Actual**
- Gradiente de opacidad 0.8 → 0
- Ingresos: Verde
- Egresos: Púrpura (#a855f7)

**5. Tabla Comparativa - Mes Actual vs Anterior**
- Ingresos con variación %
- Egresos con variación %
- Balance con variación %
- Colores: Verde (mejor), Rojo (peor)

#### Hooks de Datos para Gráficas

**useGraficas(userId, userRole)**
```typescript
{
  datosPorCategoria: Array<{
    categoria: string;
    ingresos: number;
    egresos: number;
  }>;
  loading: boolean;
}
```

**useInformeAnual(userId, userRole)**
```typescript
{
  datosAnuales: Array<{
    mes: string;        // "Enero", "Febrero", etc.
    ingresos: number;
    egresos: number;
    balance: number;
  }>;
  loading: boolean;
}
```

**useInformeMensual(userId, userRole)**
```typescript
{
  datosMensuales: Array<{
    categoria: string;
    ingresos: number;
    egresos: number;
  }>;
  mes: string;         // "YYYY-MM" para input type="month"
  setMes: (mes: string) => void;
  loading: boolean;
}
```

**useRadarData(userId, userRole)**
```typescript
{
  data: Array<{
    subject: string;   // Categoría
    Ingresos: number;    // En millones
    Egresos: number;     // En millones
    fullMark: number;
  }>;
  loading: boolean;
}
```

**useEvolucionMensual(userId, userRole)**
```typescript
{
  data: Array<{
    mes: string;       // "Ene", "Feb", etc.
    Ingresos: number;    // En millones
    Egresos: number;     // En millones
  }>;
  loading: boolean;
}
```

---

### 5. 📄 Módulo de Informes

**Archivos:**
- `src/components/InformeMensual.tsx`
- `src/components/InformeAnual.tsx`
- `src/hooks/useEnviarReporteMensual.ts`

#### Informe Mensual

**Características:**
- Selector de mes (input type="month")
- Botón "Enviar a Felipe" (solo admin)
- 3 KPIs: Ingresos, Egresos, Balance del mes
- Gráfica de barras por categoría
- Tabla detallada

#### Informe Anual

**Características:**
- 3 KPIs: Totales anuales
- Gráfica de línea temporal
- Líneas: Ingresos, Egresos, Balance
- Tabla mensual completa

#### Envío de Reportes

**useEnviarReporteMensual()**
```typescript
{
  enviarReporte: (mes: string) => Promise<void>;
  loading: boolean;
}
```

> Nota: La implementación real del envío dependerá del servicio configurado (email, WhatsApp, etc.)

---

### 6. 📥 Módulo de Importación (Gema)

**Archivos:**
- `src/app/dashboard/page.tsx` (handleGemaImport)
- `src/app/api/gema/import/route.ts`

#### Funcionamiento

**Formato CSV Esperado (delimitado por punto y coma):**
```
fecha;descripcion;categoria;sub_categoria;monto;tipo;medio_pago;estado_iva;comentarios
```

**Ejemplo:**
```
15/04/2025;Venta iPhone 15;Venta Equipos Nuevos;iPhones;4500000;Ingreso;Bold;Incluido;Cliente: Juan
```

**Proceso de Importación:**
1. Usuario pega datos en textarea
2. `handleGemaImport()` parsea línea por línea
3. Transforma fechas de `DD/MM/YYYY` a `YYYY-MM-DD`
4. Valida y estructura cada transacción
5. POST a `/api/gema/import`
6. API hace batch insert en Supabase
7. Retorna count de transacciones importadas
8. UI refresca lista automáticamente

**Manejo de Errores:**
- Timeout de 10s (AbortController)
- Mensajes de éxito/error
- Debug logs en consola

---

### 7. 📤 Módulo de Exportación

**Archivos:**
- `src/hooks/useExportarExcel.ts`
- `src/hooks/useExportarPDF.ts`

#### Exportar a CSV (Excel)

**useExportarExcel()**
```typescript
{
  exportarTransacciones: (userId: string) => Promise<void>;
}
```

**Campos exportados:**
- Fecha, Descripción, Categoría, Sub-categoría, Tipo, Monto, Medio de Pago, Estado IVA, Comentarios

#### Exportar a PDF

**useExportarPDF()**
```typescript
{
  exportarTransaccionesPDF: (userId: string, userRole: string) => Promise<void>;
}
```

**Contenido PDF:**
- Logo/header
- Tabla de transacciones
- Totales
- Fecha de generación

---

## 🔧 Hooks Personalizados - Referencia Completa

| Hook | Props | Returns | Descripción |
|------|-------|---------|-------------|
| `useAuth.ts` | - | `{user, loading, signIn, signOut}` | Auth con localStorage |
| `useTema.ts` | - | `{tema, toggleTema, mounted}` | Dark/light mode |
| `useTransacciones.ts` | `userId: string` | `{crearTransaccion, loading, error}` | Crear transacciones |
| `usePaginatedTransactions.ts` | `userId, userRole` | `{transacciones, loading, selectedYear, selectedMonth, currentPage, totalPages, totalCount, setSelectedYear, setSelectedMonth, nextPage, prevPage, goToPage, firstPage, lastPage}` | Lista paginada con filtros |
| `useResumen.ts` | `userId, userRole` | `{resumen: {totalIngresos, totalEgresos, balance}, loading}` | KPIs del dashboard |
| `useGraficas.ts` | `userId, userRole` | `{datosPorCategoria: Array, loading}` | Datos para gráfica de barras |
| `useInformeAnual.ts` | `userId, userRole` | `{datosAnuales: Array, loading}` | Datos anuales mensuales |
| `useInformeMensual.ts` | `userId, userRole` | `{datosMensuales: Array, mes, setMes, loading}` | Datos mensuales por categoría |
| `useRadarData.ts` | `userId, userRole` | `{data: Array, loading}` | Datos para radar chart |
| `useEvolucionMensual.ts` | `userId, userRole` | `{data: Array, loading}` | Evolución mes a mes |
| `useExportarExcel.ts` | - | `{exportarTransacciones}` | Export CSV |
| `useExportarPDF.ts` | - | `{exportarTransaccionesPDF}` | Export PDF |
| `useEnviarReporteMensual.ts` | - | `{enviarReporte, loading}` | Enviar reporte (admin) |
| `useEditarTransaccion.ts` | `userId` | `{editarTransaccion, loading, error}` | Editar transacciones |
| `useListaTransacciones.ts` | `userId, userRole` | `{transacciones, loading}` | Lista simple (legacy) |

---

## 🎨 Componentes UI - Referencia Completa

| Componente | Props | Descripción |
|------------|-------|-------------|
| `AuthForm.tsx` | - | Formulario de login con logo y validación |
| `TransaccionForm.tsx` | `{userId, onSuccess?}` | Formulario completo con categorías anidadas |
| `ListaTransacciones.tsx` | `{userId, userRole, onRefresh?}` | Tabla paginada con filtros y acciones |
| `TransaccionesSection.tsx` | `{userId, userRole}` | Tabla simple con export (legacy) |
| `Graficas.tsx` | `{userId, userRole}` | Dashboard de 4+ tipos de gráficas |
| `InformeMensual.tsx` | `{userId, userRole}` | Informe mensual con selector y envío |
| `InformeAnual.tsx` | `{userId, userRole}` | Informe anual con evolución temporal |
| `FilterSelectors.tsx` | `{selectedYear, selectedMonth, onYearChange, onMonthChange, onApply, onReset}` | Selectores de fecha |
| `FilterCarousel.tsx` | - | Carousel de filtros (no usado actualmente) |
| `PaginationControls.tsx` | `{currentPage, totalPages, totalItems, onPrevPage, onNextPage, onGoToPage, onFirstPage, onLastPage}` | Controles de paginación |

---

## 🌐 API Endpoints

### POST `/api/auth/login`

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response Success (200):**
```json
{
  "id": "uuid",
  "username": "string",
  "nombre": "string",
  "rol": "admin" | "contador" | "usuario"
}
```

**Response Error (401):**
```json
{
  "message": "Usuario o contraseña incorrectos" | "Usuario desactivado"
}
```

**Validación:**
- Verifica tabla `usuarios_permitidos`
- Compara password con bcrypt o plain text
- Verifica `activo = true`

---

### POST `/api/gema/import`

**Request:**
```json
{
  "transacciones": [
    {
      "fecha": "YYYY-MM-DD",
      "descripcion": "string",
      "categoria": "string",
      "sub_categoria": "string",
      "monto": number,
      "tipo": "Ingreso" | "Egreso",
      "medio_pago": "string",
      "estado_iva": "Exento" | "Incluido" | "Discriminado" | "N/A",
      "comentarios": "string"
    }
  ],
  "userId": "uuid"
}
```

**Response Success (200):**
```json
{
  "count": number,
  "message": "X transacciones importadas"
}
```

**Response Error (400/500):**
```json
{
  "error": "string"
}
```

---

### GET `/api/dashboard`

**Query Params:**
- `userId`: UUID
- `userRole`: string

**Response:**
```json
{
  "resumen": {
    "totalIngresos": number,
    "totalEgresos": number,
    "balance": number
  }
}
```

---

## 🗄️ Base de Datos - Esquema Detallado

### Tabla: `usuarios_permitidos`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID PRIMARY KEY | Identificador único |
| `username` | VARCHAR(50) UNIQUE | Nombre de usuario |
| `password_hash` | VARCHAR(255) | Hash bcrypt o plain text |
| `nombre` | VARCHAR(100) | Nombre completo |
| `rol` | VARCHAR(20) | 'admin' \| 'contador' \| 'usuario' |
| `activo` | BOOLEAN DEFAULT true | Estado de la cuenta |
| `created_at` | TIMESTAMP | Fecha de creación |

**Índices:**
- PRIMARY KEY en `id`
- UNIQUE en `username`

---

### Tabla: `transacciones`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID PRIMARY KEY | Identificador único |
| `user_id` | UUID NOT NULL FK | Referencia a usuarios_permitidos |
| `fecha` | DATE NOT NULL | Fecha de la transacción |
| `descripcion` | TEXT NOT NULL | Descripción detallada |
| `categoria` | VARCHAR(50) NOT NULL | Categoría principal |
| `sub_categoria` | VARCHAR(50) NOT NULL | Sub-categoría |
| `monto` | DECIMAL(15,2) NOT NULL | Monto en COP |
| `tipo` | VARCHAR(20) NOT NULL CHECK | 'Ingreso' \| 'Egreso' |
| `medio_pago` | VARCHAR(50) NOT NULL | Método de pago |
| `estado_iva` | VARCHAR(20) NOT NULL CHECK | 'Exento' \| 'Incluido' \| 'Discriminado' \| 'N/A' |
| `comentarios` | TEXT | Notas adicionales |
| `es_automatico` | BOOLEAN DEFAULT FALSE | Transacción automática |
| `transaccion_padre_id` | UUID FK | Para transacciones relacionadas |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

**Índices:**
- `idx_transacciones_user_fecha` (user_id, fecha DESC)
- `idx_transacciones_tipo` (tipo)
- `idx_transacciones_categoria` (categoria)
- `idx_transacciones_automatico` (es_automatico)

**Triggers:**
- `update_transacciones_updated_at` - Auto-actualiza updated_at

**RLS:**
- Deshabilitado (usar autenticación a nivel de aplicación)

---

### Tabla: `categorias`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID PRIMARY KEY | Identificador único |
| `user_id` | UUID NOT NULL FK | Propietario |
| `tipo` | VARCHAR(20) NOT NULL CHECK | 'Ingreso' \| 'Egreso' |
| `nombre` | VARCHAR(100) NOT NULL | Nombre de categoría |
| `sub_categorias` | TEXT[] NOT NULL | Array de sub-categorías |
| `orden` | INT DEFAULT 0 | Orden de visualización |
| `activo` | BOOLEAN DEFAULT TRUE | Estado |
| `created_at` | TIMESTAMP | Fecha de creación |

**Constraints:**
- UNIQUE(user_id, tipo, nombre)

---

### Tablas Adicionales (No implementadas completamente)

- `configuracion` - Settings por usuario
- `productos` - Inventario (schema creado, no UI)
- `plantillas_transacciones` - Templates recurrentes

---

## 🔗 Matriz de Dependencias

### Dependencias entre Componentes

```
Dashboard
├── AuthForm ──────► useAuth
│                    └── POST /api/auth/login
├── TransaccionForm ─► useTransacciones
│                      └── supabase.from('transacciones').insert()
├── ListaTransacciones ─► usePaginatedTransactions
│                         ├── FilterSelectors
│                         ├── PaginationControls
│                         ├── useExportarExcel
│                         └── useExportarPDF
├── Graficas ──────► useGraficas
│                    ├── useInformeAnual
│                    ├── useRadarData
│                    └── useEvolucionMensual
├── InformeMensual ─► useInformeMensual
│                     └── useEnviarReporteMensual
├── InformeAnual ───► useInformeAnual
└── useResumen (KPIs) ──► supabase.from('transacciones')
```

### Dependencias de Datos

| Componente/Hook | Tabla BD | Operación |
|-----------------|----------|-----------|
| useAuth + login | `usuarios_permitidos` | SELECT |
| useTransacciones | `transacciones` | INSERT |
| usePaginatedTransactions | `transacciones` | SELECT con filtros |
| useResumen | `transacciones` | SELECT + SUM |
| useGraficas | `transacciones` | SELECT + GROUP BY |
| useInformeAnual | `transacciones` | SELECT + DATE_TRUNC |
| useInformeMensual | `transacciones` | SELECT + filtros mes |
| gema/import | `transacciones` | INSERT batch |

---

## 🔐 Flujo de Autenticación Detallado

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuario   │────▶│  AuthForm   │────▶│  useAuth.ts │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                           │                     │
                           │  1. onSubmit()      │
                           │────────────────────▶│
                           │                     │
                           │                     │ 2. signIn()
                           │                     │    ├── POST /api/auth/login
                           │                     │    │   ├── SELECT usuarios_permitidos
                           │                     │    │   ├── bcrypt.compare()
                           │                     │    │   └── Return user data
                           │                     │    ├── localStorage.setItem()
                           │                     │    └── setUser()
                           │                     │
                           │  3. Redirect       │
                           │◀────────────────────│
                           │                     │
                           ▼                     ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Dashboard  │◀────│ localStorage│
                    │  (logueado) │     │  auth_user  │
                    └─────────────┘     └─────────────┘
```

**Persistencia de Sesión:**
- User guardado en `localStorage` como JSON
- Middleware no implementado (usar `useAuth` en cada página)
- SignOut: limpia localStorage y redirige a `/`

---

## 📊 Flujo de Datos Contables

### Crear Transacción

```
Usuario
  │
  ▼
TransaccionForm ──► Validación local ──► useTransacciones.crearTransaccion()
  │                                          │
  │                                          ▼
  │                              supabase.from('transacciones').insert()
  │                                          │
  │                                          ▼
  │                              Retorna success/error
  │                                          │
  ▼                                          ▼
Dashboard (onSuccess) ◀─────────────────── Refresca datos automáticamente
  │
  ├── useResumen() recalcula KPIs
  ├── ListaTransacciones recarga
  └── Graficas actualizan
```

### Filtrar y Paginar

```
ListaTransacciones
  │
  ├── Estado inicial:
  │   ├── selectedYear = new Date().getFullYear()
  │   ├── selectedMonth = new Date().getMonth() + 1
  │   └── currentPage = 1
  │
  ├── Usuario cambia filtro (año/mes)
  │   ├── setSelectedYear() → resetPage = 1
  │   └── useEffect dispara fetch
  │
  ├── Usuario cambia página
  │   └── nextPage()/prevPage()/goToPage()
  │
  └── Fetch:
      ├── Calcula rango de fechas
      ├── Query Supabase con .range(offset, limit)
      ├── Aplica filtro de rol (admin = all, user = own)
      └── Actualiza transacciones[] + totalCount
```

---

## 📝 Notas Técnicas Adicionales

### Seguridad
- **bcryptjs:** Soporta hashes bcrypt y plain text (para migración)
- **Sin RLS:** Autenticación manejada a nivel de aplicación
- **Sin JWT:** Usa localStorage (considerar httpOnly cookies para prod)
- **Validación:** Monto > 0 en BD, campos requeridos en UI

### Performance
- **Paginación:** 20 items por página
- **Índices:** 4 índices en transacciones
- **React Query:** No implementado (usar para caché en futuro)
- **Lazy loading:** Informes se cargan bajo demanda (toggle)

### UX/UI
- **Loading states:** Todos los hooks tienen `loading`
- **Error handling:** Mensajes amigables, no técnicos
- **Responsive:** Tailwind responsive (falta mobile optimization)
- **Dark mode:** Completo con transiciones suaves
- **Feedback visual:** Toasts/colores para éxito/error

### Código
- **TypeScript:** Strict mode activado
- **Componentes:** Funcionales con hooks
- **Estilos:** Tailwind + CSS-in-JS mínimo
- **Imports:** Alias `@/` configurado

---

## 🚀 Roadmap Sugerido (Level 3)

### Alto Impacto / Baja Complejidad
1. Tests unitarios para hooks críticos (useAuth, useTransacciones)
2. Tests de integración para API routes
3. Validación más estricta de inputs
4. Manejo de errores mejorado (toast notifications)

### Alto Impacto / Media Complejidad
5. React Query para caché y estado global
6. Formularios con react-hook-form + zod
7. Implementar edición completa de transacciones
8. Implementar eliminación con confirmación

### Alto Impacto / Alta Complejidad
9. Migrar a JWT httpOnly cookies
10. Implementar RLS en Supabase
11. Offline mode con PWA
12. Notificaciones push

### Bajo Impacto / Baja Complejidad
13. Animaciones con Framer Motion
14. Mejorar responsive mobile
15. Agregar más opciones de exportación
16. Implementar dark mode automático por hora

---

**Fin del Documento**

*Para actualizar este documento, seguir el proceso SDD estándar.*
