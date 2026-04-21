# Proposal: boutique-zinc-refactor

## Intent

Refactorizar la paleta de colores de Slate a Zinc en toda la aplicación, aplicar backdrop-blur glassmorphism en el Header, y asegurar consistencia visual con ghost borders en botones. El objetivo es entregar una interfaz de "nivel internacional" con el menor esfuerzo técnico.

## Scope

### In Scope
- **Slate → Zinc**: Reemplazar todas las clases `slate-*` por `zinc-*` según contexto
- **Header glassmorphism**: Aplicar `bg-white/70 backdrop-blur-md` con ajuste de opacidad
- **Ghost borders**: Asegurar que todos los botones usen ghost style con hover violeta

### Out of Scope
- Cambios en la lógica de negocio
- Nuevas funcionalidades
- Cambios en API o backend

## Approach

### Step 1: Slate → Zinc Masivo
Buscar todos los archivos `.tsx` con `slate-*` y reemplazar según:
- `bg-slate-100` → `bg-zinc-100` (light) / `bg-zinc-900` (dark)
- `bg-slate-800` → `bg-zinc-800`
- `border-slate-200` → `border-zinc-200`
- `border-slate-700` → `border-zinc-700`
- `text-slate-*` → `text-zinc-*`

### Step 2: Header Glassmorphism
```tsx
<header className="bg-white/70 backdrop-blur-md border-b border-zinc-200/50">
```

### Step 3: Ghost Buttons
```tsx
<button className="border border-zinc-200/50 hover:border-violet-500/50 text-zinc-700">
```

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/layout/header.tsx` | Modified | Add backdrop-blur glassmorphism |
| `src/components/tables/transaction-table.tsx` | Modified | Slate → Zinc |
| `src/components/FilterSelectors.tsx` | Modified | Slate → Zinc |
| `src/components/**` | Modified | Global slate cleanup |

## Success Criteria

- [ ] Todos los `slate-*` reemplazados por `zinc-*`
- [ ] Header tiene glassmorphism con `bg-white/70 backdrop-blur-md`
- [ ] Botones usan ghost borders con hover violeta
- [ ] Build pasa sin errores
- [ ] UI se ve consistente en light mode