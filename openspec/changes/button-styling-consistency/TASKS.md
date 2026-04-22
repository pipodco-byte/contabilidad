# Tasks: Button Styling Consistency

## Phase 1: Dashboard Page

### T1.1: Reorder buttons above KPI Cards
**File:** `src/app/dashboard/page.tsx`

- [ ] Move buttons section BEFORE `<DashboardCards>`
- [ ] Verify order: Gema, Nueva Transacción, Anual, Mensual

### T1.2: Apply violet gradient to Gema button
**File:** `src/app/dashboard/page.tsx`

- [ ] Add violet gradient classes to Gema button
- [ ] Add icon: `<Gem className="mr-2 h-4 w-4" />`

### T1.3: Apply emerald to Nueva Transacción button
**File:** `src/app/dashboard/page.tsx`

- [ ] Add `className="bg-emerald-600 hover:bg-emerald-500 text-white"`

### T1.4: Verify outline on Informe buttons
**File:** `src/app/dashboard/page.tsx`

- [ ] Confirm `variant="outline"` is set
- [ ] Add icon: `<FileText className="mr-2 h-4 w-4" />`

## Phase 2: Config Page

### T2.1: Remove Admin Badge
**File:** `src/app/dashboard/config/page.tsx`

- [ ] Delete lines 61-67 (Admin Badge section)
- [ ] Verify no other Admin Badge references remain

## Phase 3: Verify

### T3.1: Build
```bash
npm run build
```

### T3.2: Verify no errors

## Phase 4: Commit

### T4.1: Commit
```bash
git add -A
git commit -m "feat: consolidate button styles and reorder

- Move action buttons above KPI Cards in dashboard
- Apply violet gradient to Gema button
- Apply emerald to Nueva Transaccion button
- Remove Admin Badge from config page
- Maintain outline for Informe buttons"
```

### T4.2: Push
```bash
git push origin develop
```
