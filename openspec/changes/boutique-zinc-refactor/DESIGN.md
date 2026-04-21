# Design: boutique-zinc-refactor

## Design Decisions

### 1. Palette Refactor

**Decision:** Usar Zinc en lugar de Slate para toda la UI.

**Rationale:** El tema Obsidian Boutique usa Zinc como base. Slate es "frío" y no combina con la paleta violet/emerald/rose. Zinc es más "cálido" y premium.

### 2. Glassmorphism en Header

**Decision:** `bg-white/70 backdrop-blur-md`

**Rationale:** El sweet spot de opacidad. El contenido de atrás mantiene su color sin contaminar la legibilidad del header.

**Alternative considered:** `bg-white/80` - demasiado sólido, pierde el efecto glass.
**Alternative considered:** `bg-white/60` - demasiado translúcido, contenido se mezcla.

### 3. Ghost Borders

**Decision:** `border-zinc-200/50 hover:border-violet-500/50`

**Rationale:**
- Light mode: `border-zinc-200/50` es sutil pero visible
- Hover: `border-violet-500/50` da el acento violet sin ser aggressive
- Dark mode: ya tenemos `border-zinc-800/50` que es el ghost original

## Implementation

### Header Component
```tsx
// src/components/layout/header.tsx
<header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-zinc-200/50">
```

### Buttons
```tsx
// Ghost style
<button className="border border-zinc-200/50 hover:border-violet-500/50 text-zinc-700">
```

### Selects (Light mode)
```tsx
<select className="bg-zinc-100 border-zinc-200 text-zinc-900">
```

## Files to Modify

| File | Change |
|------|--------|
| `header.tsx` | Add backdrop-blur |
| `transaction-table.tsx` | slate → zinc |
| `FilterSelectors.tsx` | slate → zinc |
| `transaccion-form.tsx` | slate → zinc |
| Any component with slate-* | Replace with zinc-* |