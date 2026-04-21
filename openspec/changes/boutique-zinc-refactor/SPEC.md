# Spec: boutique-zinc-refactor

## Palette

### Light Mode (Zinc Boutique)
| Elemento | Color | Hex | Tailwind |
|----------|-------|-----|----------|
| Fondo | Blanco hueso | `#fafafa` | `bg-zinc-50` |
| Foreground | Zinc oscuro | `#18181b` | `text-zinc-900` |
| Card BG | Zinc muy claro | `#f4f4f5` | `bg-zinc-100` |
| Bordes | Zinc medio | `#e4e4e7` | `border-zinc-200/60` |
| Sombras | Shadow violeta | ultra-light | `shadow-violet-500/5` |

### Dark Mode (Obsidian - existente)
| Elemento | Color | Hex | Tailwind |
|----------|-------|-----|----------|
| Fondo | Zinc-950 | `#09090b` | `bg-zinc-950` |
| Card BG | Zinc-900 | `#18181b` | `bg-zinc-900/80` |
| Bordes | Ghost | rgba white 5% | `border-zinc-800/50` |

### Semantic Colors (ambos modos)
| Tipo | Color | Hex | Tailwind |
|------|-------|-----|----------|
| Income | Emerald | `#10b981` | `text-emerald-500` |
| Expense | Rose | `#fb7185` | `text-rose-500` |
| Balance | Violet | `#8b5cf6` | `text-violet-500` |

## Requirements

### 1. Slate → Zinc
Todos los `slate-*` en componentes deben ser `zinc-*`:
- Selects, buttons, inputs
- Cards, containers
- Text colors

### 2. Header Glassmorphism
```tsx
className="bg-white/70 backdrop-blur-md border-b border-zinc-200/50"
```

### 3. Ghost Buttons
```tsx
className="border border-zinc-200/50 hover:border-violet-500/50 text-zinc-700"
```

## Scenarios

### Scenario: User sees header in light mode
- GIVEN el usuario está en modo light
- WHEN la página carga
- THEN el header tiene fondo semi-transparente blanco con blur
- AND los elementos del background se ven difuminados

### Scenario: User sees transaction table
- GIVEN el usuario está en la lista de transacciones
- WHEN la tabla renderiza
- THEN los selects usan `bg-zinc-100` y `border-zinc-200`
- NOT `bg-slate-100` ni `border-slate-200`