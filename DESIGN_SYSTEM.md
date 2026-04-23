# Design System — Pipod Contabilidad

**Proyecto:** Pipod Contabilidad
**Tema:** Obsidian Boutique
**Versión:** 1.0
**Última actualización:** Abril 2025

---

## 🎨 Sistema de Colores

### Dark Mode (Principal)

```css
/* Backgrounds - Obsidian profundo */
--background: #09090b      /* Zinc 950 */
--card: #18181b            /* Zinc 900 */
--popover: #18181b         /* Zinc 900 */
--secondary: #27272a       /* Zinc 800 */

/* Textos */
--foreground: #fafafa       /* Zinc 50 - alto contraste */
--muted-foreground: #a1a1aa /* Zinc 400 */

/* Bordes Ghost - EL SECRETO */
--border: rgba(255,255,255,0.05)
--input: rgba(255,255,255,0.05)

/* Primary (Indigo — USAR ESTE para botones primarios) */
--primary: #6366f1          /* Indigo 500 */
--primary-foreground: #ffffff

/* Semantic */
--success: #10b981         /* Emerald 500 - Ingresos */
--destructive: #dc2626     /* Red 600 */
--destructive-soft: #fb7185 /* Rose 400 - Egresos */

/* Ring */
--ring: #6366f1            /* Indigo 500 */
```

### Light Mode

```css
/* Backgrounds */
--background: #ffffff
--card: #ffffff

/* Textos */
--foreground: #0f172a       /* Slate 900 */
--muted-foreground: #64748b /* Slate 500 */

/* Bordes */
--border: #e2e8f0          /* Slate 200 */

/* Primary */
--primary: #4338ca        /* Indigo 600 */
```

---

## 🔤 Tipografía

**Font:** Inter (variable)

```css
font-family: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['Geist Mono', 'Menlo', 'monospace'],
}
```

| Elemento | Size | Weight |
|----------|------|--------|
| H1 | 2xl (24px) | 700 |
| H2 | xl (20px) | 600 |
| H3 | lg (18px) | 600 |
| Body | sm (14px) | 400 |
| Small | xs (12px) | 400 |
| KPI Number | 3xl (30px) | 700 |

**Monetary numbers:** `font-mono tabular-nums tracking-tighter`

---

## 📐 Espaciado

Sistema de 4px base:

| Token | px | rem |
|-------|-----|-----|
| xs | 4 | 0.25 |
| sm | 8 | 0.5 |
| md | 16 | 1 |
| lg | 24 | 1.5 |
| xl | 32 | 2 |
| 2xl | 48 | 3 |

---

## 🌑 Sombras

```css
/* Cards */
shadow-sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
shadow-md: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
shadow-lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'

/* Botón Primary */
shadow-glow: '0 0 20px -5px rgba(99, 102, 241, 0.3)'
```

---

## 🔲 Border Radius

| Uso | Token | Valor |
|-----|-------|-------|
| Input, Button | rounded-md | 6px |
| Card | rounded-xl | 12px |
| Dialog, Sheet | rounded-2xl | 16px |
| Avatar, Badge | rounded-full | 9999px |

---

## 🎯 Componentes

### KPI Card (semantic borders)

```tsx
// Ingresos - Emerald left border
<Card className="border-l-4 border-emerald-500">

// Egresos - Rose left border
<Card className="border-l-4 border-rose-400">

// Balance - Indigo left border
<Card className="border-l-4 border-indigo-500">
```

### Botón Primario (Indigo gradient)

```tsx
className="bg-gradient-to-br from-indigo-500 to-indigo-600
          text-white
          shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)]
          border-t border-white/20
          active:scale-95
          transition-all duration-200"
```

### Botón Secundario (Emerald)

```tsx
className="bg-emerald-600 hover:bg-emerald-500 text-white"
```

### Botón Outline

```tsx
variant="outline"
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Valor |
|------------|-------|
| Mobile | < 640px |
| Tablet | 640px - 1023px |
| Desktop | ≥ 1024px |

---

## ✨ Animaciones

**Sidebar collapse:**
```tsx
<motion.div
  animate={{ width: isCollapsed ? 64 : 240 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
>
```

**KPI Card entrance:**
```tsx
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 }
  })
}
```

**Hover effects:** `hover:scale-[1.02] transition-transform`

---

## 🔌 Librerías

| Librería | Uso |
|---------|-----|
| shadcn/ui | Componentes base |
| Tailwind CSS | Estilos |
| Framer Motion | Animaciones |
| Lucide React | Iconos |
| Sonner | Toast notifications |
| Zod | Validación |
| Supabase | Base de datos |
| Gemini AI | IA conversacional (Gema) |

---

## 📁 Estructura de Archivos de Diseño

```
src/
├── components/
│   ├── ui/              # Componentes shadcn
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   └── header.tsx
│   ├── tables/
│   │   └── transaction-table.tsx
│   └── forms/
├── hooks/
├── lib/
│   └── validations.ts
└── app/
    └── dashboard/
```

---

_Referencia: `openspec/changes/ui-boutique-refactor/DESIGN.md`_
