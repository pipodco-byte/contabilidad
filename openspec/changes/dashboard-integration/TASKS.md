# Tasks: Dashboard Integration

## Phase 1: Rebase and Cherry-pick

### T1.1: Prepare
```bash
git fetch origin
git checkout develop
git branch backup-develop-integrated
```

### T1.2: Reset to main (modular base)
```bash
git reset --hard origin/main
```

### T1.3: Cherry-pick Donut + Balance
```bash
git cherry-pick b65afa0
```

### T1.4: Cherry-pick Sidebar routes
```bash
git cherry-pick 876c58e
# ⚠️ EXPECTED: May have conflicts - resolve manually
```

### T1.5: Cherry-pick active:scale-95
```bash
git cherry-pick 1c2268e
```

## Phase 2: Modify Pages

### T2.1: Modify /dashboard/page.tsx
- [ ] Remove ✨ Admin Badge
- [ ] Remove Quick Links section
- [ ] Add action buttons (Gema, Nueva Transacción, Anual, Mensual)
- [ ] Add state: showGema, showForm, showInforme
- [ ] Import: TransaccionForm, Gem, FileText

### T2.2: Modify /dashboard/transacciones/page.tsx
- [ ] Add state: showForm
- [ ] Add Button: Nueva Transacción
- [ ] Add TransaccionForm conditionally
- [ ] Import: TransaccionForm, Button

### T2.3: Verify config/page.tsx has Gema
- [ ] Should already have Gema from main's 0ee1e4a

### T2.4: Verify informes/page.tsx has ReportsTabs
- [ ] Should already have ReportsTabs from main's 0ee1e4a

## Phase 3: Verify

### T3.1: Install dependencies
```bash
npm install
```

### T3.2: Build
```bash
npm run build
```

### T3.3: Verify no errors

## Phase 4: Push and Merge

### T4.1: Commit
```bash
git add -A
git commit -m "feat: integrate modular dashboard with action buttons

- Base: origin/main (modular structure)
- Cherry-pick: b65afa0 (Donut + Balance Line)
- Cherry-pick: 876c58e (Sidebar routes)
- Cherry-pick: 1c2268e (active:scale-95)
- Add: Action buttons on dashboard
- Add: Nueva Transaccion button on transacciones page
- Remove: Quick Links, Admin Badge"
```

### T4.2: Push to develop
```bash
git push --force origin develop
```

### T4.3: Merge to main
```bash
git checkout main
git merge develop
git push origin main
```

### T4.4: Return to develop
```bash
git checkout develop
```

## Files to Modify

| File | Changes |
|------|---------|
| `src/app/dashboard/page.tsx` | Add buttons, remove quick links + admin |
| `src/app/dashboard/transacciones/page.tsx` | Add Nueva Transaccion button + form |
| `src/app/dashboard/config/page.tsx` | Already correct (Gema) |
| `src/app/dashboard/informes/page.tsx` | Already correct (ReportsTabs) |
| `src/components/Graficas.tsx` | Donut + Balance (from b65afa0) |
| `src/hooks/useEvolucionMensual.ts` | Fix precision (from b65afa0) |
| `src/components/layout/sidebar.tsx` | Routes (from 876c58e) |
