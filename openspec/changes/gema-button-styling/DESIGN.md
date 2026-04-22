# Design: Gema Button Styling

## Technical Approach

Aplicar estilo "violet gradient boutique" al botón de Gema en el dashboard modular.

## Visual Spec

**Clase final:**
```
bg-gradient-to-br from-violet-500 to-violet-600
text-white
shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)]
border-t border-white/20
active:scale-95
transition-all duration-200
```

## File Changes

| File | Change |
|------|--------|
| `src/app/dashboard/config/page.tsx` | Apply violet gradient to Gema Button |

## Open Questions

None - styling agreed in previous sessions.