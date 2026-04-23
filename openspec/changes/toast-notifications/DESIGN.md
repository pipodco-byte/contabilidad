# Design: Toast Notifications (F5)

## Technical Approach

Replace React state-based error/success messages with Sonner toast notifications for better UX visibility.

## Architecture Decisions

### Decision: Toast Library

**Choice:** Sonner (via shadcn)
**Alternatives:** react-hot-toast, notistack
**Rationale:** Already integrated with shadcn/ui, lightweight, good UX

### Decision: Toaster Placement

**Choice:** Dashboard layout (not root layout)
**Rationale:** Toasts only needed in dashboard context, not login page

### Decision: Migration Strategy

**Choice:** Replace state setters with toast calls, keep state only where needed for form logic
**Rationale:** Minimal refactoring, preserves form reset logic

## Data Flow

```
User Action (submit form, import data)
    ↓
API Call
    ↓ Success/Error
    ↓
toast.success() / toast.error()
    ↓
Sonner Toaster (rendered in layout)
    ↓
Toast notification (auto-dismiss 5s)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add sonner dependency |
| `src/components/ui/sonner.tsx` | Create | Sonner component (shadcn) |
| `src/app/dashboard/layout.tsx` | Modify | Add `<Toaster />` |
| `src/app/dashboard/config/page.tsx` | Modify | Replace `gemaMessage` state with toasts |
| `src/components/forms/transaccion-form.tsx` | Modify | Replace state messages with toasts |

## Implementation Details

### Toaster in Layout

```tsx
import { Toaster } from '@/components/ui/sonner'

// In JSX:
<Toaster richColors />
```

### Toast Usage

```typescript
import { toast } from 'sonner'

// Success
toast.success('Transacción creada exitosamente')

// Error
toast.error('Error al importar: datos inválidos')
```

### State Replacement

```tsx
// Before:
const [gemaMessage, setGemaMessage] = useState<...>()
setGemaMessage({ type: 'success', text: '...' })

// After:
import { toast } from 'sonner'
toast.success('...')
```

## Migration

No migration needed — UI improvement only, preserves all functionality.

## Open Questions

None.
