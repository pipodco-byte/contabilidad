# Design: Import Validation (F2)

## Technical Approach

Add Zod schema validation to the Gema import API route to validate transaction data before inserting into Supabase.

## Architecture Decisions

### Decision: Validation Location

**Choice:** API route validation (not client-side)
**Rationale:** Single source of truth, no bypass possible

### Decision: Schema Location

**Choice:** `src/lib/validations.ts`
**Alternatives:** Inline in route.ts, separate file
**Rationale:** Reusable, consistent with existing `transaccionSchema`

### Decision: All-or-Nothing Strategy

**Choice:** If any transaction fails validation, reject entire batch
**Rationale:** Simpler, no partial state

### Decision: Date Format Handling

**Choice:** Accept DD/MM/YYYY, parse to YYYY-MM-DD in API
**Rationale:** Gema exports in DD/MM/YYYY, Supabase stores YYYY-MM-DD

## Data Flow

```
Client (DD/MM/YYYY format)
    ↓ POST /api/gema/import
API Route
    ↓ Parse body
    ↓ Validate with Zod schema
    ↓ Parse dates to YYYY-MM-DD
    ↓ Insert to Supabase
Supabase (YYYY-MM-DD format)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/lib/validations.ts` | Modify | Add `gemaImportSchema` with Zod |
| `src/app/api/gema/import/route.ts` | Modify | Add Zod validation, date parsing |

## Implementation Details

### Schema Structure

```typescript
export const gemaImportSchema = z.object({
  fecha: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  descripcion: z.string().min(1, 'Descripción requerida'),
  categoria: z.string().min(1),
  sub_categoria: z.string().optional(),
  monto: z.number().positive(),
  tipo: z.enum(['Ingreso', 'Egreso']),
  medio_pago: z.string().min(1),
  estado_iva: z.string(),
  comentarios: z.string().optional(),
})
```

### Error Response Format

```json
{
  "error": "Validation failed",
  "details": [
    { "index": 2, "field": "fecha", "message": "Invalid date format" }
  ]
}
```

## Migration

No migration needed — adds validation layer without changing existing data.

## Open Questions

None.
