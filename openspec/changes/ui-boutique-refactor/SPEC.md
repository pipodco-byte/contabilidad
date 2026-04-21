# SPEC: UI Boutique Refactor - Pipod Contabilidad

## Estado
- **Versión:** 1.0.0
- **Fecha:** 2025-04-20
- **Estado:** Propuesta
- **Cambio:** ui-boutique-refactor

---

## 1. Propósito

Refactorizar la interfaz de usuario de Pipod Contabilidad para lograr un diseño "Obsidian Boutique" profesional y moderno, usando shadcn/ui como base de componentes, sin modificar la funcionalidad existente.

### 1.1 Objetivos

| Objetivo | Descripción | Prioridad |
|----------|-------------|-----------|
| Modernización visual | Aplicar paleta Obsidian + Violet con estética boutique | MUST |
| Mejorar UX | Sidebar navegable + Command Palette | MUST |
| Responsive | Mobile-first con breakpoints definidos | MUST |
| Performance | Mantener o mejorar tiempos de carga | SHOULD |
| Accesibilidad | WCAG 2.1 AA compliance | SHOULD |

### 1.2 Alcance

**Incluido:**
- Sistema de diseño (colores, tipografía, espaciado)
- Layout principal con sidebar
- Todos los componentes UI existentes migrados a shadcn/ui
- Command Palette (CMD+K)
- Empty States
- Animaciones con Framer Motion

**Excluido:**
- Funcionalidad de negocio (hooks, API routes)
- Estructura de datos
- Lógica de validación
- Backend y base de datos

---

## 2. Convenciones

### 2.1 Paleta de Colores - Obsidian Boutique

```css
/* Light Mode */
--background: #ffffff
--foreground: #0f172a
--card: #ffffff
--card-foreground: #0f172a
--popover: #ffffff
--popover-foreground: #0f172a
--primary: #4338ca (indigo-600)
--primary-foreground: #ffffff
--secondary: #f1f5f9 (slate-100)
--secondary-foreground: #0f172a
--muted: #f1f5f9
--muted-foreground: #64748b
--accent: #f1f5f9
--accent-foreground: #0f172a
--destructive: #dc2626 (red-600)
--destructive-foreground: #ffffff
--border: #e2e8f0 (slate-200)
--input: #e2e8f0
--ring: #4338ca
--success: #10b981 (emerald-500) - Ingresos
--destructive-soft: #fb7185 (rose-400) - Egresos

/* Dark Mode (Obsidian) */
--background: #09090b (zinc-950)
--foreground: #fafafa (zinc-50)
--card: #18181b (zinc-900)
--card-foreground: #fafafa
--popover: #18181b
--popover-foreground: #fafafa
--primary: #8b5cf6 (violet-500)
--primary-foreground: #ffffff
--secondary: #27272a (zinc-800)
--secondary-foreground: #fafafa
--muted: #27272a
--muted-foreground: #a1a1aa
--accent: #27272a
--accent-foreground: #fafafa
--destructive: #dc2626
--destructive-foreground: #ffffff
--border: rgba(255,255,255,0.05) (ghost border)
--input: rgba(255,255,255,0.05)
--ring: #8b5cf6
--success: #10b981
--destructive-soft: #fb7185
```

### 2.2 Tipografía

| Uso | Font | Fallback | Weight |
|-----|------|----------|--------|
| Cuerpo | Inter | system-ui, sans-serif | 400, 500 |
| Headings | Inter | system-ui, sans-serif | 600, 700 |
| Números/Moneda | Geist Mono | monospace | 400, 500 |

**Clases Tailwind:**
- Body: `text-sm text-slate-600 dark:text-zinc-400`
- Headings: `text-lg font-semibold text-slate-900 dark:text-zinc-50`
- KPI Numbers: `font-mono tabular-nums text-3xl font-bold`

### 2.3 Espaciado

Sistema de 4px base:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

### 2.4 Bordes y Sombras

- **Border radius:** `0.75rem` (12px) para cards, `0.5rem` (8px) para inputs
- **Ghost borders:** `border border-white/5 dark:border-white/5`
- **Card shadow:** `shadow-sm`
- **Glow effect:** `shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]` para botones primarios

---

## 3. Componentes

### 3.1 Layout Principal

```
┌──────────────────────────────────────────────────────────────┐
│  Header: Logo + Search + Theme Toggle + User Menu         │
├──────────┬─────────────────────────────────────────────────┤
│          │                                                  │
│ Sidebar  │  Main Content Area                              │
│ (240px)  │  - KPI Cards (3 columnas)                       │
│          │  - Action Buttons                                │
│ [Nav]    │  - Charts + Table (2 columnas)                   │
│ [Items]  │  - Quick Actions                                │
│          │                                                  │
│ [Toggle] │                                                  │
└──────────┴─────────────────────────────────────────────────┘
```

**Sidebar:**
- Ancho expandido: 240px
- Ancho colapsado: 64px
- Toggle button en footer
- Transición: 200ms ease-out
- Hover en item cerrado: tooltip con label

**Responsive:**
- **Desktop (≥1024px):** Sidebar visible
- **Tablet (768px-1023px):** Sidebar colapsado por defecto
- **Mobile (<768px):** Sidebar como drawer (slide desde izquierda)

### 3.2 KPI Cards

Estructura:
```
┌─────────────────────────┐
│ [Icon]                  │
│ $150.000.000           │  ← font-mono tabular-nums
│ Ingresos               │  ← text-sm muted
│ +12.5%                 │  ← text-xs success/destructive
└─────────────────────────┘
```

**Variantes:**
- Ingresos: borde-left `border-l-4 border-emerald-500`
- Egresos: borde-left `border-l-4 border-rose-400`
- Balance: borde-left `border-l-4 border-violet-500`

**Shadow:** `shadow-sm hover:shadow-md transition-shadow`

### 3.3 Botones

| Variante | Uso | Clases |
|----------|-----|--------|
| Primary | CTA principal | `bg-primary text-primary-foreground shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]` |
| Secondary | Acciones secundarias | `bg-secondary text-secondary-foreground` |
| Ghost | Hover states, navegación | `hover:bg-accent` |
| Destructive | Eliminar | `bg-destructive text-destructive-foreground` |

**Tamaños:**
- `sm`: `h-8 px-3 text-xs`
- `default`: `h-10 px-4 text-sm`
- `lg`: `h-12 px-6 text-base`
- `icon`: `h-10 w-10`

### 3.4 Inputs

- Altura: `h-10`
- Border: `border border-input`
- Background: `bg-background`
- Focus: `focus:ring-2 focus:ring-ring focus:ring-offset-2`
- Placeholder: `text-muted-foreground`

### 3.5 Tabla de Transacciones

```
┌────────────────────────────────────────────────────────────┐
│ [Filtros] [Búsqueda]                    [CSV] [PDF]      │
├────────────────────────────────────────────────────────────┤
│ Fecha    │ Descripción    │ Categoría  │ Tipo  │ Monto  │
├────────────────────────────────────────────────────────────┤
│ 15/04/25 │ Venta iPhone   │ Venta Eq.. │ Ingreso│ $4.5M │
│ 14/04/25 │ Compra MacBook │ Compra Eq..│ Egreso │ -$3.2M │
└────────────────────────────────────────────────────────────┘
│                     [Anterior] 1 2 3 [Siguiente]          │
└────────────────────────────────────────────────────────────┘
```

**Features:**
- Header: `bg-muted/50 uppercase text-xs tracking-wide`
- Rows: `hover:bg-accent transition-colors`
- Zebra striping: NO (clean look)
- Pagination: shadcn pagination component

### 3.6 Command Palette (CMD+K)

```
┌─────────────────────────────────────────┐
│  🔍 Buscar transacciones, acciones...   │
├─────────────────────────────────────────┤
│  COMANDOS                              │
│  💰 Nueva Transacción          ⌘+N    │
│  📊 Ver Dashboard              ⌘+D    │
│  📄 Informe Mensual            ⌘+M    │
│  📈 Informe Anual              ⌘+A    │
├─────────────────────────────────────────┤
│  RESULTADOS                            │
│  🔍 "iPhone 15"                       │
│     → 3 transacciones encontradas      │
└─────────────────────────────────────────┘
```

**Funcionalidades:**
- Búsqueda de transacciones por descripción/monto
- Comandos rápidos (nueva transacción, dashboard, informes)
- Navegación con flechas
- Enter para ejecutar
- Escape para cerrar

### 3.7 Empty States

```
┌─────────────────────────────────────────┐
│                                         │
│         ┌─────────────────┐           │
│         │   ╱╲    ╱╲      │           │
│         │  ╱  ╲  ╱  ╲     │  stroke 1 │
│         │ ╱────╲╱────╲    │           │
│         │╱      ╲    ╲    │           │
│         └─────────────────┘           │
│                                         │
│    Sin transacciones aún                │
│                                         │
│   Comienza a registrar tus ingresos    │
│   y egresos para ver tu panorama       │
│   financiero completo.                  │
│                                         │
│   [🟪 + Tu primera transacción]        │
│                                         │
└─────────────────────────────────────────┘
```

### 3.8 Gráficas

**Colores semánticos:**
- Ingresos: `emerald-500` (#10b981)
- Egresos: `rose-400` (#fb7185)
- Balance: `violet-500` (#8b5cf6)

**Tooltip:** Personalizado con fondo `card` y borde sutil

---

## 4. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| `sm` | 640px | Cards 1 columna, tabla → cards |
| `md` | 768px | Sidebar drawer, acciones stacking |
| `lg` | 1024px | Sidebar visible, 2 columnas content |
| `xl` | 1280px | Layout completo |

### 4.1 Mobile (< 768px)

- Sidebar como Sheet drawer
- KPI cards: 1 columna, swipe horizontal
- Gráficas: simplificadas, scroll horizontal
- Tabla: transformada a cards con layout vertical
- Actions: stacked vertically

### 4.2 Tablet (768px - 1023px)

- Sidebar colapsado (solo iconos)
- KPI cards: 3 columnas
- Gráficas: lado a lado
- Tabla: horizontal scroll

### 4.3 Desktop (≥ 1024px)

- Sidebar expandido (240px)
- KPI cards: 3 columnas
- Gráficas: lado a lado
- Tabla: completa con pagination

---

## 5. Animaciones

### 5.1 Framer Motion

| Elemento | Animación | Config |
|---------|-----------|--------|
| Sidebar expand/colaps | x: -240 → 0 | `ease-out, duration: 200ms` |
| Page transitions | opacity + y | `ease-out, duration: 300ms` |
| Cards entrance | opacity + y (staggered) | `0.1s delay between cards` |
| Dialog open | scale + opacity | `spring: stiffness 300, damping 30` |
| Hover states | scale: 1.02 | `duration: 150ms` |
| Command palette | y: -20 → 0 + opacity | `spring: stiffness 400, damping 30` |

### 5.2 CSS Fallback

Para usuarios con `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Componentes shadcn/ui a Instalar

### Core
- [ ] button
- [ ] input
- [ ] label
- [ ] select
- [ ] card
- [ ] dialog
- [ ] table
- [ ] badge
- [ ] separator
- [ ] skeleton

### Navegación
- [ ] sidebar (shadcn)
- [ ] dropdown-menu
- [ ] collapsible
- [ ] tooltip
- [ ] sheet (mobile drawer)
- [ ] command

### Forms
- [ ] form (react-hook-form integration)
- [ ] calendar
- [ ] popover
- [ ] switch

### Extras
- [ ] scroll-area
- [ ] pagination
- [ ] tabs
- [ ] avatar
- [ ] dropdown (block-05 for settings reference)

### Blocks
- [ ] block-01 (dashboard analytics layout)
- [ ] block-02 (data tables)
- [ ] block-03 (charts)
- [ ] block-05 (settings - reference only)

---

## 7. Dependencias a Agregar

```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "cmdk": "^0.2.0",
    "@radix-ui/react-collapsible": "^1.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^1.0.0",
    "@radix-ui/react-select": "^1.0.0",
    "@radix-ui/react-separator": "^1.0.0",
    "@radix-ui/react-slot": "^1.0.0",
    "@radix-ui/react-sheet": "^1.0.0",
    "@radix-ui/react-tooltip": "^1.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-avatar": "^1.0.0",
    "@radix-ui/react-scroll-area": "^1.0.0"
  }
}
```

---

## 8.不走 (No Regression)

### 8.1 Funcionalidad Invariante

| Funcionalidad | Comportamiento |
|---------------|----------------|
| Login | Funciona igual, solo cambia estilo |
| Crear transacción | Mismo flujo, solo UI actualizada |
| Lista transacciones | Mismos filtros, paginación, búsqueda |
| Gráficas | Mismos datos, estilo actualizado |
| Informes | Misma lógica, layout actualizado |
| Export CSV/PDF | Funciona igual |
| Import Gema | Funciona igual |

### 8.2 Datos Invariantes

| Dato | Preservación |
|------|--------------|
| localStorage (auth_user) | No modificado |
| Theme preference | Preservado |
| Session | No afectada |

### 8.3 Performance

| Métrica | Target | Minimum |
|---------|--------|---------|
| First Contentful Paint | < 1.2s | < 1.5s |
| Time to Interactive | < 2.5s | < 3.0s |
| Bundle size (gzipped) | < 200KB | < 250KB |

---

## 9. Glosario

| Término | Definición |
|---------|-----------|
| Obsidian | Paleta de colores oscura basada en zinc-950 |
| Ghost border | Borde casi invisible (border-white/5) |
| Tabular nums | Números monospace alineados en columnas |
| Command palette | Menú de búsqueda/comandos estilo Spotlight |
| Sheet | Drawer lateral para mobile |
| Block | Componente pre-diseñado de shadcn/ui |

---

## 10. Referencias

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI Primitives](https://www.radix-ui.com/)

---

## 11. Autores

- **Creado:** 2025-04-20
- **Última actualización:** 2025-04-20

---

## 12. Historial de Cambios

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0.0 | 2025-04-20 | Versión inicial |
