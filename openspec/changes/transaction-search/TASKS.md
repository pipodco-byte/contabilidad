# Tasks: Transaction Search (F1)

## Phase 1: Hook Enhancement

- [x] 1.1 Add `searchQuery` parameter to `usePaginatedTransactions` hook
- [x] 1.2 Add `.ilike('descripcion', searchQuery)` to Supabase query when searchQuery exists

## Phase 2: UI Search Input

- [x] 2.1 Add search state (useState) to transacciones page
- [x] 2.2 Add debounced search input above table
- [x] 2.3 Wire search state to hook parameter

## Phase 3: Empty State

- [ ] 3.1 Show empty state when search yields 0 results
- [ ] 3.2 Test search with no results

## Phase 4: Testing

- [ ] 4.1 Test search filters correctly
- [ ] 4.2 Test debounce timing (300ms)
- [ ] 4.3 Test empty search shows all
