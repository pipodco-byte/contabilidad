# Design: informes-premium-upgrade

## Technical Approach

Upgrade the BarChart and LineChart in `reports-tabs.tsx` to premium boutique style, following the same visual patterns from `Graficas.tsx` v4.2. Use glassmorphism cards, Framer Motion animations, and SVG gradients with unique IDs prefixed by `informe-*`.

## Architecture Decisions

### Decision: Gradient ID Prefixing Strategy

**Choice**: Use `informe-bar-*` and `informe-line-*` prefixes for all gradient IDs
**Alternative**: Use global counter or dynamic IDs
**Rationale**: Static prefixed IDs avoid conflicts when both Graficas.tsx and reports-tabs.tsx render simultaneously in same browser session.

### Decision: Animation Implementation

**Choice**: Framer Motion `motion.div` with `fadeIn` variants and `spring` config
**Alternative**: CSS animations with Tailwind
**Rationale**: Consistent with Graficas.tsx pattern. Spring animations (stiffness: 260, damping: 20) match the existing premium aesthetic.

### Decision: Card Container

**Choice**: Replace `Card` with `motion.div` using glassmorphism classes
**Alternative**: Wrap existing Card in backdrop-blur div
**Rationale**: Simpler implementation with fewer nesting levels. Backdrop blur applied directly to chart container.

## Data Flow

No data flow changes. Charts receive same props from `useInformeMensual` and `useInformeAnual` hooks.

```
useInformeMensual → datosMensuales → BarChart (reports-tabs.tsx)
useInformeAnual → datosAnuales → LineChart (reports-tabs.tsx)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/reports/reports-tabs.tsx` | Modify | BarChart + LineChart premium upgrade |

## Chart Implementation Details

### BarChart (Informe Mensual)

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
  className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-xl p-6"
>
  <defs>
    <linearGradient id="informe-bar-ingresos" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#10b981" stopOpacity="0.9"/>
      <stop offset="100%" stopColor="#10b981" stopOpacity="0.4"/>
    </linearGradient>
    <linearGradient id="informe-bar-egresos" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9"/>
      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4"/>
    </linearGradient>
  </defs>
  <Bar dataKey="ingresos" fill="url(#informe-bar-ingresos)" radius={[8, 8, 0, 0]} />
  <Bar dataKey="egresos" fill="url(#informe-bar-egresos)" radius={[8, 8, 0, 0]} />
</motion.div>
```

### LineChart (Informe Anual)

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
  className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-xl p-6"
>
  <defs>
    <linearGradient id="informe-line-ingresos" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#10b981"/>
      <stop offset="100%" stopColor="#34d399"/>
    </linearGradient>
    <linearGradient id="informe-line-egresos" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#6366f1"/>
      <stop offset="100%" stopColor="#818cf8"/>
    </linearGradient>
    <linearGradient id="informe-line-balance" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#f59e0b"/>
      <stop offset="100%" stopColor="#fbbf24"/>
    </linearGradient>
  </defs>
  <Line type="monotone" dataKey="ingresos" stroke="url(#informe-line-ingresos)" strokeWidth={2} activeDot={{ r: 8, strokeWidth: 0, style: { filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.8))' } }} />
  <Line type="monotone" dataKey="egresos" stroke="url(#informe-line-egresos)" strokeWidth={2} activeDot={{ r: 8, strokeWidth: 0, style: { filter: 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.8))' } }} />
  <Line type="monotone" dataKey="balance" stroke="url(#informe-line-balance)" strokeWidth={2} activeDot={{ r: 8, strokeWidth: 0, style: { filter: 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.8))' } }} />
</motion.div>
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | Charts render with correct gradients | Manual verification |
| Build | No TypeScript errors | `npm run build` |
| Navigation | No visual glitches between pages | Manual test |

## Migration / Rollout

No migration required. This is a visual-only change with no data or structural modifications.

## Open Questions

None.