# Design: Transaction Search (F1)

## Technical Approach

Add debounced search input that filters transactions by descripcion using Supabase's `.ilike()` operator.

## Architecture Decisions

### Decision: Debounce Location

**Choice:** Debounce in page component (not in hook)
**Rationale:** Keeps hook reusable for non-search use cases

### Decision: Empty Search Handling

**Choice:** When searchQuery is empty/whitespace, don't apply filter
**Rationale:** User can clear search to see all transactions

### Decision: Search Input Placement

**Choice:** Above filters, before table
**Rationale:** Standard UX pattern, visible without scrolling

### Decision: Case Sensitivity

**Choice:** Case-insensitive via Supabase `.ilike()`
**Rationale:** More user-friendly search

## Data Flow

```
Search Input (user types)
    ↓ onChange (immediate)
Search State (useState)
    ↓ useEffect (300ms delay)
Debounced Query
    ↓ usePaginatedTransactions(searchQuery)
Supabase
    ↓ .ilike('descripcion', '%query%')
Filtered Results
    ↓
Transaction Table
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/usePaginatedTransactions.ts` | Modify | Add searchQuery param + ilike filter |
| `src/app/dashboard/transacciones/page.tsx` | Modify | Add search state + debounce + UI |

## Implementation Details

### Hook Parameter

```typescript
export function usePaginatedTransactions(
  userId: string,
  startDate: string,
  endDate: string,
  searchQuery?: string  // NEW
)
```

### Supabase Query

```typescript
if (searchQuery && searchQuery.trim()) {
  query = query.ilike('descripcion', `%${searchQuery}%`)
}
```

### Debounce Implementation

```typescript
const [searchInput, setSearchInput] = useState('')

useEffect(() => {
  const timer = setTimeout(() => {
    setSearchQuery(searchInput)
  }, 300)
  return () => clearTimeout(timer)
}, [searchInput])
```

## Testing Strategy

1. Type "arriendo" → verify only matching transactions
2. Type rapidly → verify single query after 300ms pause
3. Clear search → verify all transactions shown
4. Search "xyz" → verify empty state shown

## Migration

No migration needed — adds filtering without changing data structure.

## Open Questions

- Should we add index on `descripcion` column for performance? (defer to future if needed)
