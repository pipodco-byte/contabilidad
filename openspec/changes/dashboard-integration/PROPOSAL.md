# Proposal: Dashboard Integration — Modular + Features

## Context

Synchronize `main` (modular structure) with `develop` (Donut + Balance Line) while preserving:
- Modular dashboard structure from `main`
- Donut Chart + Balance Line from `develop`
- Buttons on dashboard (Gema, Nueva Transacción, Informe Anual, Informe Mensual)
- NO Quick Links
- NO ✨ Admin Badge

## Vision

Clean modular dashboard with action buttons in the right places:
- `/dashboard` — Main page with KPI Cards + buttons
- `/dashboard/transacciones` — Nueva Transacción button
- `/dashboard/informes` — Existing ReportsTabs
- `/dashboard/config` — Gema Import

## Approach

1. Rebase develop on main (get modular structure)
2. Cherry-pick Donut + Balance Line
3. Cherry-pick Sidebar routes (may need manual fix)
4. Modify pages to add buttons where needed
5. Remove Quick Links and Admin Badge

## Scope

**In Scope:**
- Modular dashboard from main
- Donut + Balance Line charts
- Sidebar routes
- Action buttons on dashboard
- Botón Nueva Transacción on transacciones page

**Out of Scope:**
- Quick Links (eliminated)
- Admin Badge (eliminated)
- New features

## Commits to Bring

| Commit | Description | From |
|--------|-------------|-------|
| `b65afa0` | Donut + Balance Line | develop |
| `876c58e` | Sidebar routes | develop |
| `1c2268e` | active:scale-95 | main |
| `0ee1e4a` | Modular structure | main |

## Status

- [x] PROPOSAL.md
- [ ] SPEC.md
- [ ] DESIGN.md
- [ ] TASKS.md
- [ ] Apply changes
- [ ] Verify
- [ ] Push to develop
- [ ] Merge to main
