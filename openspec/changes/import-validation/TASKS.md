# Tasks: Import Validation (F2)

## Phase 1: Schema Foundation

- [x] 1.1 Add `gemaImportSchema` to `src/lib/validations.ts` with Zod

## Phase 2: API Validation

- [x] 2.1 Modify `/api/gema/import/route.ts` to validate each transaction with Zod
- [x] 2.2 Return 400 with field-specific errors on validation failure

## Phase 3: Testing / Verification

- [ ] 3.1 Test valid import succeeds
- [ ] 3.2 Test invalid fecha fails with error
- [ ] 3.3 Test invalid monto fails with error
- [ ] 3.4 Test invalid tipo fails with error

## Phase 4: Cleanup

- [ ] 4.1 Remove console.log statements from validation (if any)
- [ ] 4.2 Update SPEC if needed
