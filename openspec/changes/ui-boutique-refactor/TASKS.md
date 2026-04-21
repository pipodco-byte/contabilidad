# TASKS: UI Boutique Refactor - Pipod Contabilidad

## Estado
- **Versión:** 1.0.0
- **Fecha:** 2025-04-20
- **Cambio:** ui-boutique-refactor
- **Total estimado:** 20-26 horas

---

## Phase 1: Setup & Foundation (2-3 horas)

### 1.1 Inicializar shadcn/ui

**Tarea:** Inicializar shadcn/ui en el proyecto existente.

**Pasos:**
```bash
# 1. Crear components.json
npx shadcn@latest init

# 2. Configurar:
#    - Style: default
#    - Base color: neutral/slate
#    - CSS variables: yes
#    - Tailwind: existing (don't overwrite)
#    - Alias: @/components

# 3. Instalar dependencias base
npm install clsx tailwind-merge class-variance-authority

# 4. Agregar cn() utility a lib/utils.ts
```

**Archivos a crear/modificar:**
- `components.json` (nuevo)
- `src/lib/utils.ts` (modificar - agregar cn())

**Verify:**
- [ ] `components.json` existe
- [ ] `cn()` function works

**Riesgo:** Bajo - Solo configuración

---

### 1.2 Configurar CSS Variables (Globals)

**Tarea:** Actualizar globals.css con variables de tema Obsidian.

**Pasos:**
1. Leer archivo actual `src/app/globals.css`
2. Reemplazar/aggiornare con variables CSS del tema
3. Mantener variables existentes si las hay

**Archivo a modificar:**
- `src/app/globals.css`

**Contenido esperado:**
```css
@layer base {
  :root {
    /* Light mode variables */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 238.7 83.5% 66.7%;
    /* ... resto de variables */
  }

  .dark {
    /* Dark mode (Obsidian) variables */
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --primary: 263.4 70% 50.4%;
    /* ... resto */
  }
}
```

**Verify:**
- [ ] Variables CSS definidas
- [ ] Dark mode toggle funciona

**Riesgo:** Medio - Puede afectar estilos existentes

---

### 1.3 Actualizar Tailwind Config

**Tarea:** Extender tailwind.config.js con configuración boutique.

**Pasos:**
1. Leer archivo actual `tailwind.config.js`
2. Agregar font family (Inter)
3. Agregar colores custom si es necesario
4. Mantener configuración existente

**Archivo a modificar:**
- `tailwind.config.js`

**Verify:**
- [ ] Tailwind compila sin errores
- [ ] Font family disponible

**Riesgo:** Bajo - Solo configuración

---

### 1.4 Instalar Componentes Core

**Tarea:** Instalar componentes shadcn/ui esenciales.

**Comandos:**
```bash
npx shadcn add button input label card badge separator skeleton
```

**Verify:**
- [ ] Componentes instalados en `src/components/ui/`
- [ ] Imports funcionan

**Riesgo:** Bajo

---

### 1.5 Agregar cn() Utility

**Tarea:** Agregar función cn() a lib/utils.ts.

**Archivo a modificar:**
- `src/lib/utils.ts`

**Código a agregar:**
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Verify:**
- [ ] Función exportada
- [ ] TypeScript no da errores

**Riesgo:** Bajo

---

## Phase 2: Layout & Navigation (3-4 horas)

### 2.1 Crear Sidebar Component

**Tarea:** Crear componente Sidebar con navegación.

**Pasos:**
1. Crear `src/components/layout/sidebar.tsx`
2. Implementar estructura con Logo + Nav items
3. Implementar estado collapsed/expanded
4. Agregar transiciones con Framer Motion

**Archivo a crear:**
- `src/components/layout/sidebar.tsx`

**Componente interno:**
- `src/components/layout/sidebar-item.tsx`

**Dependencies:**
- framer-motion
- lucide-react icons
- shadcn: collapsible

**Verify:**
- [ ] Sidebar renderiza
- [ ] Toggle funciona (expand/collapse)
- [ ] Animación suave

**Riesgo:** Medio - Componente nuevo

---

### 2.2 Crear Header Component

**Tarea:** Actualizar header existente con estilo boutique.

**Pasos:**
1. Leer `src/components/header.tsx` o `src/app/dashboard/page.tsx` (header section)
2. Extraer a componente `src/components/layout/header.tsx`
3. Agregar: Logo, search trigger, theme toggle, user menu

**Archivo a crear:**
- `src/components/layout/header.tsx`

**Dependencies:**
- shadcn: dropdown-menu, button
- lucide-react: Search, Sun, Moon, User, LogOut

**Verify:**
- [ ] Header renderiza correctamente
- [ ] Dropdown de usuario funciona
- [ ] Theme toggle funciona

**Riesgo:** Medio - Refactor de existente

---

### 2.3 Crear AppShell (Layout Principal)

**Tarea:** Crear shell que contiene sidebar + header + main content.

**Pasos:**
1. Crear `src/components/layout/app-shell.tsx`
2. Integrar Sidebar + Header
3. Manejar responsive: sidebar en desktop, drawer en mobile

**Archivo a crear:**
- `src/components/layout/app-shell.tsx`

**Dependencies:**
- Sidebar
- Header
- shadcn: sheet (para mobile drawer)

**Verify:**
- [ ] Layout se adapta a breakpoints
- [ ] Mobile: sheet drawer abre/cierra
- [ ] Desktop: sidebar visible

**Riesgo:** Medio - Estructura nueva

---

### 2.4 Actualizar Dashboard Layout

**Tarea:** Envolver dashboard page con AppShell.

**Pasos:**
1. Leer `src/app/dashboard/page.tsx`
2. Crear wrapper con AppShell
3. Mover header actual al AppShell

**Archivo a modificar:**
- `src/app/dashboard/page.tsx`

**Verify:**
- [ ] Dashboard renderiza dentro de AppShell
- [ ] Sidebar + Header presentes
- [ ] Contenido principal visible

**Riesgo:** Medio - Integración

---

### 2.5 Agregar shadcn Navigation Components

**Tarea:** Instalar componentes de navegación de shadcn.

**Comandos:**
```bash
npx shadcn add tabs tooltip sheet
```

**Verify:**
- [ ] Componentes instalados

**Riesgo:** Bajo

---

### 2.6 Implementar Command Palette (CMD+K)

**Tarea:** Crear command palette para búsqueda y navegación.

**Pasos:**
1. Crear `src/components/command-palette.tsx`
2. Implementar con cmdk library
3. Agregar acciones: nueva transacción, dashboard, informes
4. Agregar búsqueda de transacciones
5. Integrar en AppShell (keyboard shortcut)

**Archivo a crear:**
- `src/components/command-palette.tsx`

**Dependencies:**
- cmdk
- framer-motion (para animación)

**Verify:**
- [ ] CMD+K abre palette
- [ ] Búsqueda funciona
- [ ] Acciones ejecutan correctamente
- [ ] Escape cierra

**Riesgo:** Medio - Componente nuevo con lógica

---

## Phase 3: Dashboard Cards (KPIs) (2-3 horas)

### 3.1 Actualizar Card Component

**Tarea:** Asegurar que card shadcn tiene estilos boutique.

**Pasos:**
1. Revisar `src/components/ui/card.tsx`
2. Ajustar si necesario (border radius, shadows)

**Archivo existente:**
- `src/components/ui/card.tsx`

**Verify:**
- [ ] Card tiene border-radius correcto (0.75rem)
- [ ] Shadows funcionan

**Riesgo:** Bajo

---

### 3.2 Crear KPI Card Component

**Tarea:** Crear componente reutilizable para KPI cards.

**Pasos:**
1. Crear `src/components/kpi-card.tsx`
2. Props: title, value, trend, type (ingreso/egreso/balance)
3. Aplicar estilo con border-left semántico
4. Agregar icon

**Archivo a crear:**
- `src/components/kpi-card.tsx`

**Props:**
```typescript
interface KPICardProps {
  title: string
  value: string
  trend?: number // percentage
  type: 'ingreso' | 'egreso' | 'balance'
  icon: LucideIcon
}
```

**Verify:**
- [ ] Card renderiza con datos
- [ ] Colores semánticos correctos
- [ ] Trend muestra flecha + porcentaje

**Riesgo:** Bajo - Componente nuevo

---

### 3.3 Integrar KPI Cards en Dashboard

**Tarea:** Reemplazar cards actuales con KPI Cards.

**Pasos:**
1. Leer sección de cards en dashboard
2. Importar KPICard component
3. Mapear datos de useResumen a props

**Archivo a modificar:**
- `src/app/dashboard/page.tsx`

**Verify:**
- [ ] Cards muestran Ingresos, Egresos, Balance
- [ ] Formato de número correcto (font-mono tabular-nums)
- [ ] Colores semánticos

**Riesgo:** Medio - Reemplazo

---

### 3.4 Agregar Framer Motion a KPI Cards

**Tarea:** Agregar animación staggered a las cards.

**Pasos:**
1. Agregar framer-motion a KPI cards
2. Configurar entrance animation

**Archivo a modificar:**
- `src/components/kpi-card.tsx`

**Verify:**
- [ ] Cards entran con stagger animation
- [ ] Suave al cargar

**Riesgo:** Bajo

---

### 3.5 Responsive de KPI Cards

**Tarea:** Asegurar KPI cards responsive.

**Pasos:**
1. Testear en diferentes breakpoints
2. Ajustar grid si necesario

**Verify:**
- [ ] Mobile: 1 columna
- [ ] Tablet: 3 columnas
- [ ] Desktop: 3 columnas

**Riesgo:** Bajo

---

## Phase 4: Formularios (3-4 horas)

### 4.1 Instalar Form Components

**Tarea:** Instalar componentes de formulario de shadcn.

**Comandos:**
```bash
npx shadcn add form select calendar popover switch
```

**Verify:**
- [ ] Componentes instalados

**Riesgo:** Bajo

---

### 4.2 Actualizar AuthForm

**Tarea:** Migrar AuthForm a shadcn components.

**Pasos:**
1. Leer `src/components/auth-form.tsx`
2. Reemplazar inputs con shadcn Input
3. Reemplazar button con shadcn Button
4. Mantener lógica de signIn

**Archivo a modificar:**
- `src/components/auth-form.tsx`

**Verify:**
- [ ] Login funciona igual
- [ ] Estilo actualizado
- [ ] Focus states correctos

**Riesgo:** Medio - Migración

---

### 4.3 Actualizar TransaccionForm

**Tarea:** Migrar TransaccionForm a shadcn components.

**Pasos:**
1. Leer `src/components/transaccion-form.tsx`
2. Reemplazar inputs con shadcn
3. Reemplazar selects con shadcn Select
4. Reemplazar button con shadcn Button
5. Mantener lógica de crearTransaccion

**Archivo a modificar:**
- `src/components/transaccion-form.tsx`

**Verify:**
- [ ] Formulario funciona igual
- [ ] Selects con shadcn style
- [ ] Validation visual correcta

**Riesgo:** Medio - Migración

---

### 4.4 Actualizar Date Picker

**Tarea:** Migrar input type="date" a shadcn Calendar.

**Pasos:**
1. Evaluar si Calendar es necesario o mantener native
2. Si se usa: integrar Popover + Calendar

**Nota:** Si el date input actual funciona bien, mantenerlo. El cambio a Calendar es opcional.

**Verify:**
- [ ] Date selection funciona

**Riesgo:** Bajo

---

## Phase 5: Tabla Transacciones (3-4 horas)

### 5.1 Instalar Table Components

**Tarea:** Instalar table y pagination de shadcn.

**Comandos:**
```bash
npx shadcn add table pagination scroll-area
```

**Verify:**
- [ ] Componentes instalados

**Riesgo:** Bajo

---

### 5.2 Crear Transaction Table Component

**Tarea:** Crear tabla de transacciones con shadcn Table.

**Pasos:**
1. Crear `src/components/transaction-table.tsx`
2. Usar shadcn Table components
3. Integrar con usePaginatedTransactions
4. Mantener filtros existentes

**Archivo a crear:**
- `src/components/transaction-table.tsx`

**Dependencies:**
- shadcn: table, badge, button
- lucide-react: icons para acciones

**Verify:**
- [ ] Tabla renderiza transacciones
- [ ] Paginación funciona
- [ ] Filtros funcionan

**Riesgo:** Medio - Componente nuevo

---

### 5.3 Integrar Transaction Table en Dashboard

**Tarea:** Reemplazar ListaTransacciones con Transaction Table.

**Pasos:**
1. Leer donde se usa ListaTransacciones
2. Importar TransactionTable
3. Reemplazar

**Archivos a modificar:**
- `src/app/dashboard/page.tsx`

**Verify:**
- [ ] Tabla visible y funcional
- [ ] Mismos datos que antes

**Riesgo:** Medio - Reemplazo

---

### 5.4 Responsive: Tabla a Cards en Mobile

**Tarea:** En mobile, transformar rows en cards.

**Pasos:**
1. Agregar breakpoint logic
2. Mobile: mostrar como cards vertical
3. Desktop: mantener tabla horizontal

**Archivo a modificar:**
- `src/components/transaction-table.tsx`

**Verify:**
- [ ] Mobile: cards
- [ ] Desktop: tabla

**Riesgo:** Medio

---

### 5.5 Empty State para Transacciones

**Tarea:** Crear empty state cuando no hay transacciones.

**Pasos:**
1. Crear `src/components/empty-state.tsx`
2. SVG minimalista con stroke 1.0
3. Copy invitando a acción
4. CTA button

**Archivo a crear:**
- `src/components/empty-state.tsx`

**Props:**
```typescript
interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: 'chart' | 'table' | 'search'
}
```

**Verify:**
- [ ] Empty state se muestra cuando no hay datos
- [ ] Ilustración visible
- [ ] CTA funciona

**Riesgo:** Bajo

---

### 5.6 Agregar Empty State a Tabla

**Tarea:** Integrar EmptyState en TransactionTable.

**Pasos:**
1. Importar EmptyState
2. Mostrar cuando transacciones.length === 0

**Archivo a modificar:**
- `src/components/transaction-table.tsx`

**Verify:**
- [ ] Empty state visible

**Riesgo:** Bajo

---

## Phase 6: Gráficas (2-3 horas)

### 6.1 Actualizar Colors de Charts

**Tarea:** Actualizar colores de Recharts al tema.

**Pasos:**
1. Leer `src/components/graficas.tsx`
2. Cambiar colores hardcodeados a variables del tema

**Archivo a modificar:**
- `src/components/graficas.tsx`

**Nuevos colores:**
```typescript
const colors = {
  income: '#10b981',    // emerald-500
  expense: '#fb7185',   // rose-400
  primary: '#8b5cf6',   // violet-500 (para balance u otros)
  grid: 'rgba(255,255,255,0.05)', // ghost border
}
```

**Verify:**
- [ ] Gráficas usan colores del tema
- [ ] Dark mode colors correctos

**Riesgo:** Bajo

---

### 6.2 Responsive de Gráficas

**Tarea:** Asegurar gráficas responsive.

**Pasos:**
1. Testear en diferentes tamaños
2. Ajustar ResponsiveContainer

**Archivo a modificar:**
- `src/components/graficas.tsx`

**Verify:**
- [ ] Gráficas escalan correctamente
- [ ] Tooltips visibles

**Riesgo:** Bajo

---

### 6.3 Empty State para Gráficas

**Tarea:** Agregar empty state cuando no hay datos para gráficas.

**Pasos:**
1. En Graficas.tsx, verificar si datos.length === 0
2. Mostrar EmptyState

**Archivo a modificar:**
- `src/components/graficas.tsx`

**Verify:**
- [ ] Empty state visible sin datos

**Riesgo:** Bajo

---

## Phase 7: Informes (2-3 horas)

### 7.1 Instalar Tabs

**Tarea:** Instalar tabs de shadcn.

**Comandos:**
```bash
npx shadcn add tabs
```

**Verify:**
- [ ] Componente instalado

**Riesgo:** Bajo

---

### 7.2 Actualizar Informe Mensual

**Tarea:** Migrar InformeMensual a shadcn components.

**Pasos:**
1. Leer `src/components/informe-mensual.tsx`
2. Usar Card para contenedor
3. Usar Button para acciones

**Archivo a modificar:**
- `src/components/informe-mensual.tsx`

**Verify:**
- [ ] Informe funciona igual
- [ ] Estilo actualizado

**Riesgo:** Medio

---

### 7.3 Actualizar Informe Anual

**Tarea:** Migrar InformeAnual a shadcn components.

**Pasos:**
1. Leer `src/components/informe-anual.tsx`
2. Aplicar mismo proceso que Informe Mensual

**Archivo a modificar:**
- `src/components/informe-anual.tsx`

**Verify:**
- [ ] Informe funciona igual

**Riesgo:** Medio

---

### 7.4 Responsive de Informes

**Tarea:** Asegurar informes responsive.

**Verify:**
- [ ] Funciona en mobile
- [ ] Funciona en tablet
- [ ] Funciona en desktop

**Riesgo:** Bajo

---

## Phase 8: Polish & Animation (2-3 horas)

### 8.1 Agregar Framer Motion Dependencies

**Tarea:** Instalar framer-motion.

**Comandos:**
```bash
npm install framer-motion
```

**Verify:**
- [ ] Framer motion instalado

**Riesgo:** Bajo

---

### 8.2 Spring Animations en Sidebar

**Tarea:** Agregar animaciones con spring physics.

**Pasos:**
1. En sidebar.tsx, agregar motion components
2. Configurar spring para collapse/expand

**Archivo a modificar:**
- `src/components/layout/sidebar.tsx`

**Verify:**
- [ ] Animación suave
- [ ] iOS-like feel

**Riesgo:** Bajo

---

### 8.3 Page Transitions

**Tarea:** Agregar transiciones de página.

**Pasos:**
1. Crear page transition wrapper
2. Aplicar a dashboard page

**Archivo a crear/modificar:**
- `src/components/layout/page-transition.tsx`
- `src/app/dashboard/page.tsx`

**Verify:**
- [ ] Transiciones suaves entre páginas

**Riesgo:** Bajo

---

### 8.4 Agregar Skeleton Loaders

**Tarea:** Agregar skeleton mientras cargan datos.

**Pasos:**
1. Importar Skeleton de shadcn
2. Agregar a componentes que cargan datos:
   - KPI Cards
   - Transaction Table
   - Gráficas

**Verify:**
- [ ] Skeletons visibles mientras carga
- [ ] Mejor UX percibida

**Riesgo:** Bajo

---

### 8.5 Polish de UI

**Tarea:** Ajustes finales de UI.

**Pasos:**
1. Verificar spacing consistente
2. Verificar alineación
3. Verificar hover states
4. Verificar focus states

**Verify:**
- [ ] UI se ve pulida

**Riesgo:** Bajo

---

## Phase 9: Dark Mode & Theme (1-2 horas)

### 9.1 Verificar Dark Mode Toggle

**Tarea:** Asegurar theme toggle funciona correctamente.

**Pasos:**
1. Testear toggle en header
2. Verificar que cambia CSS variables
3. Verificar persistencia en localStorage

**Verify:**
- [ ] Toggle cambia tema
- [ ] localStorage preserva preferencia

**Riesgo:** Bajo

---

### 9.2 Ajustes Obsidian Dark

**Tarea:** Ajustes finales para dark mode Obsidian.

**Pasos:**
1. Verificar contraste en dark mode
2. Ajustar ghost borders
3. Verificar shadows en dark

**Verify:**
- [ ] Dark mode se ve premium
- [ ] Contraste WCAG AA

**Riesgo:** Bajo

---

### 9.3 prefers-reduced-motion

**Tarea:** Respetar preferencia del usuario.

**Pasos:**
1. Agregar CSS para reduced motion
2. Framer Motion: agregar `motion.reduce`

**Verify:**
- [ ] Animaciones reducidas para quienes prefieren

**Riesgo:** Bajo

---

## Phase 10: Verification (2-3 horas)

### 10.1 Test Functional

**Tarea:** Verificar que toda funcionalidad sigue igual.

**Checklist:**
- [ ] Login funciona
- [ ] Crear transacción funciona
- [ ] Lista transacciones funciona
- [ ] Filtros funcionan
- [ ] Paginación funciona
- [ ] Export CSV funciona
- [ ] Export PDF funciona
- [ ] Gráficas muestran datos
- [ ] Informes funcionan
- [ ] Import Gema funciona

**Riesgo:** N/A - Es verification

---

### 10.2 Test Responsive

**Tarea:** Verificar en todos los breakpoints.

**Dispositivos/Breakpoints:**
- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (≥ 1024px)

**Riesgo:** N/A

---

### 10.3 Test Accessibility

**Tarea:** Verificar accesibilidad.

**Checklist:**
- [ ] Navegación por teclado funciona
- [ ] Focus visible
- [ ] Contraste suficiente
- [ ] Screen reader basic test

**Riesgo:** N/A

---

### 10.4 Test Performance

**Tarea:** Verificar performance no degradó.

**Checklist:**
- [ ] Lighthouse score > 90
- [ ] Bundle size < 250KB
- [ ] No console errors

**Riesgo:** N/A

---

## Resumen de Tasks

| Phase | Tasks | Estimated |
|-------|-------|-----------|
| 1 | 5 | 2-3h |
| 2 | 6 | 3-4h |
| 3 | 5 | 2-3h |
| 4 | 4 | 3-4h |
| 5 | 6 | 3-4h |
| 6 | 3 | 2-3h |
| 7 | 4 | 2-3h |
| 8 | 5 | 2-3h |
| 9 | 3 | 1-2h |
| 10 | 4 | 2-3h |
| **Total** | **45** | **20-26h** |

---

## Dependencies Graph

```
Phase 1 (Foundation)
    ↓
Phase 2 (Layout) ← necesita Phase 1
    ↓
Phase 3 (KPIs) ← necesita Phase 2
Phase 4 (Forms) ← necesita Phase 1
    ↓
Phase 5 (Table) ← necesita Phase 1, 3
Phase 6 (Charts) ← necesita Phase 1
    ↓
Phase 7 (Reports) ← necesita Phase 1
Phase 8 (Polish) ← necesita Phase 2, 3, 5, 6
    ↓
Phase 9 (Theme) ← necesita todo lo anterior
    ↓
Phase 10 (Verify)
```

---

**Documento creado:** 2025-04-20
**Última actualización:** 2025-04-20
