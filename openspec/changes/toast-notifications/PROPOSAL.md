# Proposal: Toast Notifications (F5)

## Intent

Replace React state-based error/success messages with Sonner toast notifications for cleaner UX and better visibility.

## Scope

### In Scope
- Install Sonner via `npx shadcn@latest add sonner`
- Add Toaster component to dashboard layout
- Replace state-based messages in:
  - `/dashboard/config/page.tsx` (gemaMessage state)
  - `/components/forms/transaccion-form.tsx` (success/error state)
  - `/components/forms/auth-form.tsx` (login errors)

### Out of Scope
- Replace `alert()` calls (none exist in this project)
- Add toasts to every action - focus on existing error/success paths
- Modify business logic

## Approach

1. Run `npx shadcn@latest add sonner` to install Sonner
2. Add `<Toaster richColors />` to dashboard layout
3. Import `toast` from `sonner` in affected components
4. Replace `setGemaMessage()` calls with `toast.success()` / `toast.error()`
5. Remove unused state variables

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Add sonner dependency |
| `src/app/dashboard/layout.tsx` | Modified | Add Toaster component |
| `src/app/dashboard/config/page.tsx` | Modified | Replace gemaMessage with toasts |
| `src/components/forms/transaccion-form.tsx` | Modified | Replace state messages with toasts |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking UX pattern | Low | Toasts are better UX |
| Bundle size increase (~15KB) | Low | Minimal impact |

## Rollback Plan

Remove Toaster from layout, remove toast imports, restore state-based messages.

## Dependencies

- `sonner` package (via shadcn)

## Success Criteria

- [ ] Sonner installed via shadcn
- [ ] Toaster component renders in dashboard
- [ ] Import success shows toast
- [ ] Import error shows toast
- [ ] Form submission success shows toast
- [ ] Form validation errors show toast
