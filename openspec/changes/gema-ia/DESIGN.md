# Design: Gema IA — Technical Architecture

## Technical Approach

Implementar Gema como asistente contable con Vercel AI SDK, Gemini Flash, y Zod para type-safe Tool Calling. La UI es un fixed bottom bar que expande a un sheet lateral con chat stateful.

## Architecture Decisions

### Decision: Vercel AI SDK over raw API

**Choice:** Vercel AI SDK for all AI interactions
**Rationale:**
- Streaming responses out-of-box
- Built-in Tool Calling support
- Zod integration for schema validation
- Unified API for future model swaps

### Decision: Zod + Tool Calling as contract

**Choice:** Define `registrar_transaccion` tool with Zod schema
**Alternatives:** Regex parsing, string manipulation
**Rationale:**
- Type safety from Gemini output to Supabase INSERT
- Validation at the boundary (firewall)
- Self-documenting schema

### Decision: Sheet over Modal

**Choice:** Sheet (right side drawer)
**Alternatives:** Modal centrado, full-page
**Rationale:**
- Context visible (dashboard KPIs)
- Feels like tool panel, not popup
- Easier to close and continue working

### Decision: Stateless API, Stateful Client

**Choice:** API doesn't store conversation, client does
**Rationale:**
- Simpler API (stateless)
- Conversation persists only while sheet open
- No DB complexity for temp data
- Privacy: conversations not stored server-side

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT                                    │
│  ┌──────────────┐    ┌──────────────────────────────────────┐ │
│  │ Bottom Bar   │───▶│ Sheet (GemaChat)                      │ │
│  │ (collapsed)  │    │  ┌──────────────────────────────────┐ │ │
│  └──────────────┘    │  │ Messages[] (stateful)             │ │ │
│                       │  │ ─────────────────────────────────│ │ │
│                       │  │ PreVizCard (confirmar/corregir)  │ │ │
│                       │  │ ─────────────────────────────────│ │ │
│                       │  │ Input + Send                      │ │ │
│                       │  └──────────────────────────────────┘ │ │
│                       └──────────────┬───────────────────────────┘ │
└───────────────────────────────────────┼───────────────────────────┘
                                        │
                                        ▼ POST /api/gema/chat
┌─────────────────────────────────────────────────────────────────┐
│                         API ROUTE                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Vercel AI SDK                                               ││
│  │  - messages[] (from client)                               ││
│  │  - system: GEMA_PROMPT (personality only)                  ││
│  │  - tools: [registrar_transaccion]                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                    │
│              ┌───────────────┴───────────────┐                 │
│              ▼                               ▼                   │
│  ┌─────────────────────┐         ┌─────────────────────────┐  │
│  │ Gemini Tool Call    │         │ Text Response           │  │
│  │ { typed object }   │         │ (micro-feedback, etc)   │  │
│  └─────────┬───────────┘         └─────────────────────────┘  │
│            │                                                      │
│            ▼                                                      │
│  ┌─────────────────────┐                                        │
│  │ Zod Validation      │ ◀── FIREWALL                          │
│  │ (parse, validate)   │                                        │
│  └─────────┬───────────┘                                        │
│            │ IF VALID                                             │
│            ▼                                                      │
│  ┌─────────────────────┐                                        │
│  │ Supabase INSERT     │                                        │
│  │ + Bold parent_id    │                                        │
│  └─────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx              # Modified: GemaBottomBar
│   └── api/
│       └── gema/
│           └── chat/
│               └── route.ts       # NEW: AI chat endpoint
├── components/
│   └── gema/
│       ├── GemaSheet.tsx         # NEW: Sheet container
│       ├── GemaChat.tsx          # NEW: Chat messages
│       ├── GemaInput.tsx         # NEW: Input (shared)
│       ├── GemaPreVizCard.tsx    # NEW: Confirmation card
│       └── GemaBottomBar.tsx     # NEW: Fixed bottom bar
├── hooks/
│   └── useGemaChat.ts            # NEW: Chat state management
└── lib/
    ├── gema-tools.ts             # NEW: Zod schemas + tools
    └── gema-prompt.ts            # NEW: System prompt builder
```

## API Contract

### POST /api/gema/chat

**Request:**
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  pendingTransaction?: TransaccionData  // From PreViz confirm
}
```

**Response (streaming):**
```typescript
// Text chunks
data: "Excelente"
data: " Felipe"
data: ", registrado"

// Or Tool Call
data: { type: "tool_call", name: "registrar_transaccion", args: {...} }

// Or Complete
data: [DONE]
```

### Tool: registrar_transaccion

**Definition (Zod):**
```typescript
const RegistrarTransaccionSchema = z.object({
  fecha: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
  descripcion: z.string().min(1),
  categoria: z.enum([
    'Venta Equipos Nuevos',
    'Venta Equipos Usados',
    'Venta Accesorios',
    'Reparación',
    'Publicidad',
    'Costos Venta',
    'Infraestructura',
    'Nómina',
    'Impuestos',
    'Servicios',
    'Retiros Felipe'
  ]),
  sub_categoria: z.string().optional(),
  monto: z.number().positive(),
  tipo: z.enum(['Ingreso', 'Egreso']),
  medio_pago: z.enum(['Davivienda', 'Bold', 'Efectivo', 'Nequi', 'Daviplata', 'Transferencia']),
  estado_iva: z.enum(['Exento', 'Incluido', 'Externo']),
  comentarios: z.string().optional()
})

const BoldComisionSchema = z.object({
  monto_original: z.number(),
  monto_comision: z.number(),  // 5% del original
  descripcion: z.string(),
  categoria: z.literal('Costos Venta'),
  tipo: z.literal('Egreso'),
  medio_pago: z.string(),
  comentarios: z.string()
})
```

## Database Schema

### Supabase: transacciones (modified)

```sql
ALTER TABLE transacciones ADD COLUMN parent_id UUID REFERENCES transacciones(id) ON DELETE CASCADE;

-- Index for faster lookups
CREATE INDEX idx_transacciones_parent_id ON transacciones(parent_id);
```

**Rationale:** `ON DELETE CASCADE` ensures that when parent (venta) is deleted, child (comisión Bold) is also deleted automatically.

## Component Specifications

### GemaBottomBar
- Fixed position: `bottom-0, left-0, right-0`
- Height: 56px
- Background: `bg-zinc-900/95 backdrop-blur`
- Border-top: `border-t border-zinc-800`
- Contains: GemaInput (flex-1)

### GemaSheet
- Width: `w-[400px]` (mobile: `w-full`)
- Position: `fixed right-0 top-0 bottom-0`
- Animation: slide-in from right
- Overlay: `bg-black/50` (click to close)
- Contains: GemaChat + GemaInput + Close button

### GemaPreVizCard
- Border: `border border-indigo-500/50`
- Background: `bg-zinc-900`
- Sections:
  - Header: "Verifica los datos"
  - Body: List of 9 fields
  - Footer: [Confirmar] [Corregir]

### GemaChat
- ScrollArea for messages
- Message bubbles:
  - User: `bg-indigo-600/20 ml-auto`
  - Assistant: `bg-zinc-800`
- Typing indicator while streaming

## Environment Variables

```env
GEMINI_API_KEY=           # Gemini API key (from Google AI Studio)
```

## Migration

1. Create new files (no existing data modified)
2. Add `parent_id` column to Supabase (nullable, backwards compatible)
3. Deploy API route
4. Deploy components
5. No downtime

## Open Questions

None — all decisions finalized per user confirmation.

## Testing Strategy

| Layer | What | How |
|-------|------|-----|
| Unit | Zod schemas | Jest/Zod validation tests |
| Integration | API route | Test with sample conversations |
| E2E | Full flow | User submits → confirms → verifies in table |
