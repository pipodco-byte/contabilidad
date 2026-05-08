# Tasks: informes-premium-upgrade

## Phase 1: Setup and Imports

- [x] 1.1 Verify `motion` import from `framer-motion` is available in `reports-tabs.tsx`
- [x] 1.2 Confirm existing recharts components (BarChart, LineChart, etc.) are imported

## Phase 2: BarChart Premium Upgrade (Informe Mensual)

- [x] 2.1 Wrap BarChart Card in `motion.div` with glassmorphism: `backdrop-blur-xl bg-card/60 border-border/50`
- [x] 2.2 Add Framer Motion `initial={{ opacity: 0, scale: 0.95 }}` and `animate={{ opacity: 1, scale: 1 }}`
- [x] 2.3 Apply spring transition: `transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}`
- [x] 2.4 Add `<defs>` with `linearGradient id="informe-bar-ingresos"` (emerald gradient top→bottom)
- [x] 2.5 Add `<defs>` with `linearGradient id="informe-bar-egresos"` (indigo gradient top→bottom)
- [x] 2.6 Update Bar `fill` to use `url(#informe-bar-ingresos)` and `url(#informe-bar-egresos)`
- [x] 2.7 Set axes to minimalist: `axisLine={false} tickLine={false}`

## Phase 3: LineChart Premium Upgrade (Informe Anual)

- [x] 3.1 Wrap LineChart Card in `motion.div` with glassmorphism classes
- [x] 3.2 Add Framer Motion fade-in + scale animation (same config as BarChart)
- [x] 3.3 Add `<defs>` with `linearGradient id="informe-line-ingresos"` (green→emerald horizontal)
- [x] 3.4 Add `<defs>` with `linearGradient id="informe-line-egresos"` (purple→indigo horizontal)
- [x] 3.5 Add `<defs>` with `linearGradient id="informe-line-balance"` (amber→orange horizontal)
- [x] 3.6 Update Line `stroke` to use `url(#informe-line-*)` for each line
- [x] 3.7 Add `activeDot` with `shadow-2xl` glow effect to each Line
- [x] 3.8 Set axes to minimalist: `axisLine={false} tickLine={false}`

## Phase 4: Header Enhancement

- [x] 4.1 Add uppercase label above chart title (e.g., "INFORME MENSUAL" or "ANÁLISIS ANUAL")
- [x] 4.2 Apply text-muted-foreground for label styling

## Phase 5: Verification

- [x] 5.1 Run `npm run build` to verify no TypeScript errors
- [ ] 5.2 Test navigation between `/dashboard/informes` and `/dashboard/graficas` for ID conflicts
- [ ] 5.3 Verify glassmorphism effect visible on chart cards