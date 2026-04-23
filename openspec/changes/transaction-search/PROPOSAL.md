# Proposal: Transaction Search (F1)

## Intent

Add text search functionality to the transacciones page, allowing users to filter transactions by description using a debounced search input.

## Scope

### In Scope
- Add search input UI above transaction table
- Add `searchQuery` parameter to `usePaginatedTransactions` hook
- Implement Supabase `.ilike()` filter on `descripcion` field
- Debounce search input by 300ms
- Show empty state when search yields 0 results

### Out of Scope
- Search on other fields (categoria, medio_pago) - future work
- Advanced filters
- Search highlighting in results

## Approach

1. Add search state (`useState`) to transacciones page
2. Add debounced search with `useEffect` (300ms delay)
3. Pass `searchQuery` to `usePaginatedTransactions` hook
4. Conditionally add `.ilike('descripcion', '%searchQuery%')` when searchQuery exists
5. Show empty state when results are empty

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/hooks/usePaginatedTransactions.ts` | Modified | Add searchQuery param + ilike filter |
| `src/app/dashboard/transacciones/page.tsx` | Modified | Add search UI + debounce |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Performance on large tables | Medium | Index on descripcion column |
| Scope creep | Low | Clearly scope to descripcion only |

## Rollback Plan

Remove searchQuery parameter from hook, remove search input from page.

## Dependencies

- None

## Success Criteria

- [ ] Search input appears above table
- [ ] Typing filters transactions by descripcion
- [ ] Debounce prevents excessive queries
- [ ] Empty search shows all transactions
- [ ] No results shows empty state message
