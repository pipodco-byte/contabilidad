# Proposal: auth-usuarios-unificada

## Intent

Fix Contabilidad_pipod authentication to use the shared `usuarios` table instead of the non-existent `usuarios_permitidos` table. Also fix visual bug where login input text is invisible (black text on dark background).

## Scope

### In Scope
- Update `src/app/api/auth/login/route.ts` to query `usuarios` table
- Add `acceso_contabilidad` flag verification
- Fix visual: add `text-white` to login input fields

### Out of Scope
- Changes to Dashboard-Pipod auth (already works)
- User CRUD operations (will be done separately in Dashboard)
- Password reset flow

## Approach

1. **API Route Fix**: Change Supabase query from `usuarios_permitidos` to `usuarios`, add `acceso_contabilidad` check
2. **Visual Fix**: Add `text-white` class to Input components in `auth-form.tsx`

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/api/auth/login/route.ts` | Modified | Use `usuarios` table, verify `acceso_contabilidad` |
| `src/components/forms/auth-form.tsx` | Modified | Add `text-white` to inputs |

## Users & Access

| Usuario | acceso_contabilidad | Login permitted |
|---------|---------------------|-----------------|
| Josue | true | ✅ Yes |
| Felipe | **false** | ❌ No |
| Samuel | false | ❌ No |
| Marcelo | false | ❌ No |

**Nota:** Felipe y Marcelo necesitan `acceso_contabilidad = false` en Supabase. Esto se hará desde Dashboard-Pipod.

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking login completely | Low | Test with known credentials before deploy |
| Wrong user gets access | Low | Verify acceso_contabilidad flags in DB |

## Rollback Plan

Revert changes to `login/route.ts` to use old table reference.

## Dependencies

- Supabase table `usuarios` must exist with `acceso_contabilidad` column
- Felipe/Marcelo must have `acceso_contabilidad = false` set in DB

## Success Criteria

- [ ] Login page text is visible (not black on black)
- [ ] felipe/password123 is REJECTED (no acceso_contabilidad)
- [ ] josue/password123 can login to Contabilidad
