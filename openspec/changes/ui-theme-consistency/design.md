# Design: UI Theme Consistency — Dark Mode Tokens Migration

## Technical Approach

Migrar clases `dark:` hardcodeadas a tokens semánticos del sistema de temas existente. El approach es find-and-replace sistemático con validación en cada paso.

## Architecture Decisions

### Decision: Replace dark: classes vs CSS variables

**Choice**: Reemplazar `dark:bg-zinc-*` con `bg-card` directamente
**Alternatives considered**: Mantener `dark:` y añadir CSS overrides
**Rationale**: El sistema de temas ya interpreta `bg-card` correctamente en ambos modos. Reemplazo directo es más simple y mantenible.

### Decision: Chart colors stay as hex

**Choice**: Colores de charts (emerald, rose, violet) permanecen como hex
**Alternatives considered**: Crear tokens para cada color de chart
**Rationale**: Emerald=positivo, rose=negativo son convenciones semánticas. Crear tokens añadiría complejidad sin beneficio práctico.

### Decision: Scrollbar hiding

**Choice**: Usar ambos `scrollbar-width: none` y `[&::-webkit-scrollbar]:hidden`
**Alternatives considered**: Solo WebKit, solo Firefox
**Rationale**: Cobertura cross-browser completa. Firefox usa scrollbar-width.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/Graficas.tsx` | Modify | 228+ dark: → tokens, tooltipStyle theming |
| `src/components/dashboard/kpi-card.tsx` | Modify | shadow-black → shadow-foreground, dark: → tokens |
| `src/components/tables/transaction-table.tsx` | Modify | bg-emerald-500 → bg-primary en filtros |
| `src/components/FilterCarousel.tsx` | Modify | scrollbar-width, bg tokens |
| `src/components/reports/reports-tabs.tsx` | Modify | dark: → tokens en containers |
| `src/app/dashboard/loading.tsx` | Modify | Remover admin badge skeleton |
| `src/app/dashboard/graficas/loading.tsx` | Modify | 4 charts skeleton |
| `src/app/dashboard/informes/loading.tsx` | Modify | Tabs skeleton |
| `src/app/dashboard/transacciones/loading.tsx` | Modify | Table skeleton |

## Migration Pattern

### Pattern for dark: classes

```tsx
// ANTES:
className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800"

// DESPUÉS:
className="bg-card border-border backdrop-blur-md"
```

### Pattern for text classes

```tsx
// ANTES:
className="text-zinc-900 dark:text-zinc-100"

// DESPUÉS:
className="text-foreground"
```

### Pattern for scrollbar

```tsx
// ANTES:
className="[&::-webkit-scrollbar]:hidden"

// DESPUÉS:
className="[&::-webkit-scrollbar]:hidden scrollbar-none"
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | Compila sin errores | `npm run build` |
| Visual | Light/Dark mode | Verificar manualmente en dev |
| Components | Sin regresiones | Revisar cada archivo modificado |

## Migration / Rollout

**No migration required** — cambios son puramente de styling, no afectan datos ni lógica.

Ejecución por fases:
1. Quick fixes: loading states, shadow, filtros (30 min)
2. Graficas.tsx: 228+ ocurrencias (2-3 hrs)
3. Otros archivos: kpi-card, FilterCarousel, reports-tabs (30 min)
4. Validación: build + visual check

## Open Questions

- [ ] Ninguno — el scope está claramente definido
