# Proposal: Import Validation (F2)

## Intent

Add Zod schema validation to the Gema import API endpoint (`/api/gema/import`) to reject malformed data and return field-specific error messages.

## Scope

### In Scope
- Create `gemaImportSchema` Zod schema in `src/lib/validations.ts`
- Validate fecha (date format), monto (number), descripcion (non-empty), tipo (Ingreso/Egreso)
- Return structured 400 errors with field-specific messages
- All-or-nothing validation (if any transaction fails, none insert)

### Out of Scope
- Client-side validation (focus on API)
- Partial imports (all-or-nothing for simplicity)
- Modifying client parsing logic

## Approach

1. Create `gemaImportSchema` in `src/lib/validations.ts` with Zod
2. Modify API route to validate each transaction
3. Parse DD/MM/YYYY date format to YYYY-MM-DD for Supabase
4. Return 400 with detailed errors on validation failure

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/validations.ts` | Modified | Add gemaImportSchema |
| `src/app/api/gema/import/route.ts` | Modified | Add Zod validation |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking change: existing bad data rejected | Low | Data should be valid; document expected format |
| Migration needed | None | No data migration - adds validation layer |

## Rollback Plan

Revert changes to `src/app/api/gema/import/route.ts` to remove Zod validation.

## Dependencies

- `zod` package (should already be installed)

## Success Criteria

- [ ] Invalid fecha rejected with clear error
- [ ] Invalid monto (NaN) rejected
- [ ] Empty descripcion rejected
- [ ] Invalid tipo rejected
- [ ] API returns 400 with field-specific errors
