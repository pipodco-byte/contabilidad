# DESIGN: UI Boutique Refactor - Pipod Contabilidad

## Estado
- **Versión:** 1.0.0
- **Fecha:** 2025-04-20
- **Cambio:** ui-boutique-refactor

---

## 1. Decisiones Arquitectónicas

### 1.1 Por qué shadcn/ui sobre componentes custom

**Decisión:** Usar shadcn/ui como base de componentes.

**Alternativas consideradas:**
| Alternativa | Pros | Contras |
|-------------|------|---------|
| shadcn/ui | Componentes accesibles, copy-paste ownership, muy customizable | Requiere setup inicial |
| MUI | Gran comunidad, muchos componentes | Over-engineered para este caso, estilo "Material" |
| Chakra UI | Buen DX, accesible | Bundle size grande |
| Componentes custom | Control total | Más trabajo, menos accesible |

**Rationale:** shadcn/ui ofrece el mejor balance entre calidad, customización y ownership. Los componentes se copian al proyecto, dando control total sobre el código.

### 1.2 Por qué Framer Motion

**Decisión:** Usar Framer Motion para animaciones.

**Alternativas:**
| Alternativa | Pros | Contras |
|-------------|------|---------|
| Framer Motion | Spring physics, API declarativa, SSR support | Dependencia adicional (~15KB) |
| CSS transitions | Sin dependencia, rápido | Menos control, interpolación limitada |
| GSAP | Potente, profesional | Overkill, sintaxis diferente a React |
| Motion (formerly Motion One) | Pequeño, moderno | Menor comunidad que Framer |

**Rationale:** Las spring physics de Framer dan ese feeling "iOS-like" que queremos. El API es declarativo y funciona bien con React. El tradeoff de ~15KB vale la pena para la UX.

### 1.3 Por qué Command Palette (CMDK)

**Decisión:** Implementar CMD+K command palette.

**Alternativas:**
| Alternativa | Pros | Contras |
|-------------|------|---------|
| CMDK | lightweight, accessible, Combobox pattern | Requiere setup |
| Kbar | Robusto, acciones configurables | Más complejo |
| Sin command palette | Simple | Menos "power user" friendly |

**Rationale:** Apps como Linear, Notion, VS Code usan command palettes porque incrementan productividad. Para una app de contabilidad, poder buscar transacciones rápido es invaluable.

---

## 2. Sistema de Diseño

### 2.1 Filosofía Visual: "Obsidian Boutique"

**Concepto:** Profundidad y contraste sutil, inspirado en interfaces de Apple/Linear/Vercel.

**Principios:**
1. **Less is more:** 60-30-10 rule para colores
2. **Ghost borders:** Separación casi invisible
3. **Tipografía tabular:** Números perfectamente alineados
4. **Micro-animaciones:** Feedback sutil, no decorativas

### 2.2 Jerarquía Visual

```
┌────────────────────────────────────────────────────────────┐
│  HEADER (56px)                                              │
│  ├─ Logo (24px)                                            │
│  ├─ Search trigger (CMD+K hint)                             │
│  └─ User menu + Theme toggle                               │
├──────────┬─────────────────────────────────────────────────┤
│ SIDEBAR  │  MAIN CONTENT                                    │
│ (240px)  │                                                  │
│          │  ┌─────────────────────────────────────────┐    │
│ [Nav]    │  │ KPI CARDS (grid, gap-6)                 │    │
│          │  │ ├─ Ingresos (emerald)                   │    │
│          │  │ ├─ Egresos (rose)                       │    │
│          │  │ └─ Balance (violet)                     │    │
│          │  └─────────────────────────────────────────┘    │
│          │                                                  │
│          │  ┌─────────────────────────────────────────┐    │
│          │  │ ACTION BUTTONS (flex, gap-3)            │    │
│          │  │ [Primary CTA] [Secondary] [Secondary]   │    │
│          │  └─────────────────────────────────────────┘    │
│          │                                                  │
│          │  ┌───────────────────┬───────────────────┐    │
│          │  │ CHART (2/3)       │ TABLE (1/3)       │    │
│          │  │                   │                    │    │
│          │  │                   │                    │    │
│          │  └───────────────────┴───────────────────┘    │
│          │                                                  │
│          │  ┌─────────────────────────────────────────┐    │
│          │  │ QUICK ACTIONS (flex, justify-end)       │    │
│          │  └─────────────────────────────────────────┘    │
├──────────┴─────────────────────────────────────────────────┤
│  FOOTER (optional, hidden on mobile)                        │
└────────────────────────────────────────────────────────────┘
```

### 2.3 Sistema de Colores Detallado

#### Light Mode

```css
/* Backgrounds */
--background: #ffffff           /* Fondo principal */
--card: #ffffff                 /* Cards, ligeramente elevado */
--popover: #ffffff              /* Dropdowns, tooltips */

/* Textos */
--foreground: #0f172a            /* Slate 900 - texto principal */
--muted-foreground: #64748b      /* Slate 500 - texto secundario */

/* Bordes */
--border: #e2e8f0                /* Slate 200 */
--input: #e2e8f0                /* Inputs, igual que border */

/* Primary (Accent) */
--primary: #4338ca              /* Indigo 600 */
--primary-foreground: #ffffff     /* Texto sobre primary */

/* Secondary */
--secondary: #f1f5f9             /* Slate 100 */
--secondary-foreground: #0f172a   /* Texto sobre secondary */

/* Semantic */
--success: #10b981               /* Emerald 500 - Ingresos */
--destructive: #dc2626           /* Red 600 */
--destructive-soft: #fb7185     /* Rose 400 - Egresos */

--ring: #4338ca                  /* Focus ring */
```

#### Dark Mode (Obsidian)

```css
/* Backgrounds - Obsidian profundo */
--background: #09090b            /* Zinc 950 - NO es negro puro */
--card: #18181b                  /* Zinc 900 - para cards */
--popover: #18181b               /* Zinc 900 */
--secondary: #27272a              /* Zinc 800 */

/* Textos */
--foreground: #fafafa             /* Zinc 50 - alto contraste */
--muted-foreground: #a1a1aa       /* Zinc 400 */

/* Bordes Ghost - EL SECRETO */
--border: rgba(255,255,255,0.05)   /* Invisible pero presente */
--input: rgba(255,255,255,0.05)    /* Mismo que border */

/* Primary (Violet Electric) */
--primary: #8b5cf6               /* Violet 500 */
--primary-foreground: #ffffff

/* Secondary */
--secondary-foreground: #fafafa

/* Semantic - Igual que light pero más vibrante */
--success: #10b981
--destructive: #dc2626
--destructive-soft: #fb7185

--ring: #8b5cf6
```

### 2.4 Tipografía

**Font Family:** Inter (variable font)

```css
/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

/* Tailwind config */
font-family: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['Geist Mono', 'Menlo', 'monospace'],
}
```

**Escala Tipográfica:**

| Elemento | Size | Weight | Line Height |
|----------|------|--------|-------------|
| H1 | 2xl (24px) | 700 (bold) | 1.2 |
| H2 | xl (20px) | 600 (semibold) | 1.3 |
| H3 | lg (18px) | 600 | 1.4 |
| Body | sm (14px) | 400 | 1.5 |
| Small | xs (12px) | 400 | 1.5 |
| KPI Number | 3xl (30px) | 700 | 1.1 |

**Tabular Nums para Números Monetarios:**
```tsx
<span className="font-mono tabular-nums tracking-tighter">
  $1.250.000
</span>
```

### 2.5 Espaciado

Sistema de 4px base:

```
xs:   4px   (0.25rem)
sm:   8px   (0.5rem)
md:  16px   (1rem)
lg:  24px   (1.5rem)
xl:  32px   (2rem)
2xl: 48px   (3rem)
3xl: 64px   (4rem)
```

**Tokens Tailwind:**
```js
spacing: {
  '18': '4.5rem',  // 72px - KPI card height
  '22': '5.5rem',  // 88px - sidebar expanded
}
```

### 2.6 Sombras y Depth

```css
/* Card shadow - sutil, como flotando */
shadow-sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)'

/* Hover shadow - más profundo */
shadow-md: '0 4px 6px -1px rgb(0 0 0 / 0.1)'

/* Dialog/Modal - el más profundo */
shadow-lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'

/* Glow violet para botones primarios */
shadow-glow: '0 0 20px -5px rgba(139, 92, 246, 0.3)'
```

### 2.7 Border Radius

```css
/* Input, Button default */
rounded-md: '0.375rem'  /* 6px */

/* Card */
rounded-xl: '0.75rem'   /* 12px */

/* Dialog, Sheet */
rounded-2xl: '1rem'     /* 16px */

/* Avatar, Badge pequeño */
rounded-full: '9999px'
```

---

## 3. Componente: Sidebar

### 3.1 Estructura

```
┌──────────────────────────┐
│ 🟪 Pipod                  │  ← Logo
├──────────────────────────┤
│                          │
│ [📊] Dashboard           │
│ [💰] Transacciones       │
│ [📈] Gráficas           │
│ [📄] Informes            │
│ [⚙️] Configuración      │
│                          │
├──────────────────────────┤
│                          │
│ [🔔] Notificaciones (f) │  ← Futuro
│ [👤] Perfil              │
│                          │
├──────────────────────────┤
│ [🚪] Cerrar Sesión      │
├──────────────────────────┤
│ [<<] Colapsar           │  ← Toggle
└──────────────────────────┘
```

### 3.2 Estados

**Expanded (240px):**
- Icon + Text visible
- Tooltip hidden
- Nav items: `px-3 py-2`

**Collapsed (64px):**
- Only icon visible
- Text as tooltip on hover
- Nav items: `p-3 justify-center`

**Item States:**
```tsx
// Default
bg-transparent text-muted-foreground

// Hover
hover:bg-accent hover:text-foreground

// Active
bg-accent text-primary border-l-2 border-primary
```

### 3.3 Animación

```tsx
// Sidebar collapse animation
<motion.div
  animate={{ width: isCollapsed ? 64 : 240 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
>
```

### 3.4 Mobile Drawer

```tsx
// Sheet component from shadcn
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-64">
    {/* Same nav content */}
  </SheetContent>
</Sheet>
```

---

## 4. Componente: KPI Card

### 4.1 Estructura

```
┌────────────────────────────────┐
│ 💰                    ↗ +12%  │  ← Icon + trend indicator
│                                │
│ $150.250.000                   │  ← Amount (font-mono tabular-nums)
│                                │
│ Ingresos                       │  ← Label (muted)
└────────────────────────────────┘
```

### 4.2 Variantes Semánticas

```tsx
// Ingresos - Emerald left border
<Card className="border-l-4 border-emerald-500">
  {/* content */}
</Card>

// Egresos - Rose left border
<Card className="border-l-4 border-rose-400">
  {/* content */}
</Card>

// Balance - Violet left border
<Card className="border-l-4 border-violet-500">
  {/* content */}
</Card>
```

### 4.3 Animación de Entrada

```tsx
// Staggered entrance animation
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

// Usage
<KPICard>
  <motion.div custom={0} variants={cardVariants}>
  <motion.div custom={1} variants={cardVariants}>
  <motion.div custom={2} variants={cardVariants}>
```

### 4.4 Responsive

```tsx
// Desktop: 3 columns
<Grid cols={3} className="gap-6">
  {kpis.map(kpi => <KPICard {...kpi} />)}
</Grid>

// Tablet: 3 columns
<Grid cols={3} className="gap-4">

// Mobile: 1 column, horizontal scroll option
<ScrollArea orientation="horizontal" className="w-full">
  <Flex gap={4} className="pb-4">
    {kpis.map(kpi => <KPICard {...kpi} className="min-w-[280px]" />)}
  </Flex>
</ScrollArea>
```

---

## 5. Componente: Command Palette (CMD+K)

### 5.1 Arquitectura

```tsx
// Using cmdk library
import { Command } from "cmdk"

<Command.Dialog open={open} onOpenChange={setOpen}>
  <Command.Input placeholder="Buscar transacciones, acciones..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>

    <Command.Group heading="Comandos">
      <Command.Item onSelect={() => navigate('/dashboard')}>
        <DollarSign className="mr-2 h-4 w-4" />
        Nueva Transacción
        <span className="ml-auto text-xs">⌘N</span>
      </Command.Item>
      {/* ... more items */}
    </Command.Group>

    <Command.Separator />

    <Command.Group heading="Transacciones">
      {/* Search results from transactions */}
    </Command.Group>
  </Command.List>
</Command.Dialog>
```

### 5.2 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘K / Ctrl+K | Open command palette |
| Escape | Close palette |
| ↑ / ↓ | Navigate items |
| Enter | Execute selected |
| ⌘N | New transaction |
| ⌘D | Go to dashboard |
| ⌘M | Monthly report |
| ⌘A | Annual report |

### 5.3 Búsqueda de Transacciones

```tsx
// Search transactions
const searchTransactions = async (query: string) => {
  const results = await supabase
    .from('transacciones')
    .select('id, fecha, descripcion, monto, tipo')
    .ilike('descripcion', `%${query}%`)
    .limit(5)

  return results.data
}
```

---

## 6. Componente: Empty State

### 6.1 Diseño SVG

```tsx
// Minimalist line illustration
<svg
  width="120"
  height="120"
  viewBox="0 0 120 120"
  fill="none"
  stroke="currentColor"
  strokeWidth="1"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  {/* Chart lines */}
  <path d="M20 80 L40 60 L60 70 L80 40 L100 30" />
  {/* Axis */}
  <path d="M20 90 L20 30 M20 90 L100 90" />
  {/* Data points */}
  <circle cx="40" cy="60" r="3" fill="currentColor" />
  <circle cx="60" cy="70" r="3" fill="currentColor" />
  <circle cx="80" cy="40" r="3" fill="currentColor" />
</svg>
```

### 6.2 Copywriting

```tsx
const emptyStateConfig = {
  title: "Sin transacciones aún",
  description: "Comienza a registrar tus ingresos y egresos para ver tu panorama financiero completo.",
  action: {
    label: "Tu primera transacción",
    icon: Plus
  }
}
```

---

## 7. Animaciones con Framer Motion

### 7.1 Sidebar Collapse

```tsx
<motion.div
  animate={{ width: isCollapsed ? 64 : 240 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
  className="hidden lg:block"
>
```

### 7.2 Page Transitions

```tsx
// layout.tsx or page wrapper
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
}

<motion.main
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
>
```

### 7.3 Card Stagger

```tsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {/* Card content */}
    </motion.div>
  ))}
</motion.div>
```

### 7.4 Dialog/Sheet Animation

```tsx
// shadcn Dialog already has animations built-in
// But we can customize

<Dialog>
  <DialogContent className="sm:max-w-[500px]">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Content */}
    </motion.div>
  </DialogContent>
</Dialog>
```

---

## 8. Responsive Strategy

### 8.1 Breakpoints

```css
/* Tailwind default breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### 8.2 Layout Shifts by Breakpoint

| Element | <768px (Mobile) | 768-1023px (Tablet) | ≥1024px (Desktop) |
|---------|-----------------|---------------------|-------------------|
| Sidebar | Sheet drawer | Collapsed (64px) | Expanded (240px) |
| KPI Cards | 1 column, horizontal scroll | 3 columns | 3 columns |
| Chart+Table | Stacked | Side by side | Side by side |
| Actions | Stacked | Inline | Inline |

### 8.3 Mobile-First Approach

```tsx
// Mobile first, then add larger breakpoints
<div className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2
  lg:grid-cols-3
">
  {/* KPI Cards */}
</div>
```

---

## 9. Accesibilidad

### 9.1 Color Contrast

| Element | Light | Dark | WCAG |
|---------|-------|------|------|
| Text on background | #0f172a on #fff | #fafafa on #09090b | ✓ AAA |
| Text on secondary | #0f172a on #f1f5f9 | #fafafa on #27272a | ✓ AA |
| Primary button | #fff on #4338ca | #fff on #8b5cf6 | ✓ AA |

### 9.2 Focus States

```css
/* Visible focus ring */
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

### 9.3 Keyboard Navigation

- All interactive elements focusable
- Logical tab order
- Skip links for main content
- ARIA labels on icon-only buttons

---

## 10. Performance Considerations

### 10.1 Bundle Size

| Component | Estimated Size |
|-----------|---------------|
| framer-motion | ~15KB gzipped |
| cmdk | ~4KB gzipped |
| shadcn components | ~20KB (tree-shaken) |
| **Total added** | ~40KB gzipped |

### 10.2 Code Splitting

```tsx
// Lazy load command palette
const CommandPalette = dynamic(() => import('@/components/command-palette'), {
  ssr: false,
  loading: () => null
})
```

### 10.3 Image Optimization

- Use Next.js `<Image>` for any images
- SVG preferred for icons (Lucide already SVG)
- No heavy illustrations

---

## 11. ADRs (Architecture Decision Records)

### ADR-001: Sistema de Colores

**Decisión:** Usar CSS variables con fallback a Tailwind classes.

**Contexto:** Necesitábamos un sistema que funcione tanto en light como dark mode de forma consistente.

**Consecuencias:**
- Positivo: Cambio de tema instantáneo, no hay "flash"
- Positivo: shadcn/ui ya usa este patrón
- Negativo: Requiere configurar globals.css correctamente

### ADR-002: Animaciones

**Decisión:** Framer Motion para animaciones complejas, CSS para transiciones simples.

**Contexto:** Queríamos animaciones "premium" pero sin cargar demasiado el bundle.

**Consecuencias:**
- Positivo: Spring physics se ven mejor que CSS
- Positivo: API declarativo es fácil de mantener
- Negativo: ~15KB adicional

### ADR-003: Sidebar Collapsible

**Decisión:** Collapsible con estado persistente en localStorage.

**Contexto:** Los usuarios pueden preferir sidebar colapsado o expandido.

**Consecuencias:**
- Positivo: Preferencia del usuario preservada
- Positivo: Más espacio en desktop
- Negativo: Estado adicional a manejar

---

## 12. Testing Strategy

### 12.1 Visual Regression

- Usar Storybook para desarrollar componentes aisladamente
- Chromatic para visual regression testing (opcional)

### 12.2 Responsive Testing

- Chrome DevTools mobile emulation
- Test real en móvil si es posible
- Focus en: iPhone SE, iPad, Laptop resolutions

### 12.3 Accessibility Testing

- axe DevTools plugin
- Keyboard-only navigation
- Screen reader testing (VoiceOver)

---

## 13. Roadmap de Implementación Visual

```
Phase 1: Foundation
  → CSS variables + Tailwind config
  → shadcn/ui initialization
  → Base components (button, input, card)

Phase 2: Layout
  → Sidebar component
  → Header
  → Responsive shell

Phase 3: Dashboard
  → KPI Cards
  → Command Palette
  → Empty States

Phase 4: Content
  → Tables (block-02)
  → Charts (block-03)
  → Forms

Phase 5: Polish
  → Framer Motion animations
  → Dark mode toggle
  → Final refinements
```

---

## 14. Referencias

- [shadcn/ui Docs](https://ui.shadcn.com)
- [Framer Motion Docs](https://www.framer.com/motion)
- [CMDK Docs](https://github.com/pacocoursey/cmdk)
- [Radix UI](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel Design](https://vercel.com/design)
- [Linear App](https://linear.app)

---

**Documento creado:** 2025-04-20
**Última actualización:** 2025-04-20
