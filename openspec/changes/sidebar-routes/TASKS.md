# Tasks: Sidebar Navigation Routes Fix

## Implementation

### T1: Update navItems hrefs
**File:** `src/components/layout/sidebar.tsx`

- [ ] Line 46: Change `/dashboard#transacciones` → `/dashboard/transacciones`
- [ ] Line 51: Change `/dashboard#graficas` → `/dashboard/graficas`
- [ ] Line 56: Change `/dashboard#informes` → `/dashboard/informes`

### T2: Update bottomNavItems hrefs
**File:** `src/components/layout/sidebar.tsx`

- [ ] Line 64: Change `/dashboard#config` → `/dashboard/config`

### T3: Verify Build
- [ ] Run `npm run build`
- [ ] Ensure no errors

### T4: Commit and Push
- [ ] Commit with message: `fix: update sidebar links from anchors to routes`
- [ ] Push to develop
