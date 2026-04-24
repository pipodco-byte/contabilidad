# Design: Copilot Assistant — Technical Architecture

## Technical Approach

Implementar asistente contable con FAB + Sheet + Sidebar collapse. UX: Floating Action Button bottom-right activa panel lateral con chat stateful.

## Architecture Decisions

### Decision: FAB over Inline Input

**Choice:** FAB (Floating Action Button) bottom-right
**Alternatives:** Bottom bar, inline input, modal
**Rationale:**
- No ocupa espacio permanente
- Minimalista y no invasivo
- Patrón UX conocido (apps móvil)

### Decision: Sidebar Collapse

**Choice:** Sidebar collapses to 64px when assistant active
**Alternatives:** Full overlay, modal
**Rationale:**
- Dashboard context still visible
- More space for chat panel
- Smooth animation (300ms)

### Decision: Sheet over Modal Centrado

**Choice:** Sheet lateral (derecha)
**Alternatives:** Modal centrado, full page
**Rationale:**
- Context visible (KPIs, charts)
- Feels like tool panel, not popup
- Easy to close and continue

### Decision: Stateless API, Stateful Client

**Choice:** API doesn't store conversation, client does
**Rationale:**
- Simpler API
- Conversation persists only while sheet open
- No DB complexity for temp data

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT                                    │
│  ┌──────────┐    ┌──────────────────────────────────────┐ │
│  │ FAB      │───▶│ Sheet (ChatPanel)                     │ │
│  │(bottom-r)│    │  ┌──────────────────────────────────┐ │ │
│  └──────────┘    │  │ Messages[] (stateful)             │ │ │
│                       │  │ ─────────────────────────────────│ │ │
│                       │  │ PreVizCard (confirmar/corregir)│ │ │
│                       │  │ ─────────────────────────────────│ │ │
│                       │  │ Input + Send                    │ │ │
│                       │  └──────────────────────────────────┘ │ │
│                       └──────────────┬───────────────────────────┘ │
└───────────────────────────────────────┼───────────────────────────┘
                                        │
                                        ▼ POST /api/assistant/chat
┌─────────────────────────────────────────────────────────────────┐
│                         API ROUTE                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Vercel AI SDK                                               ││
│  │  - messages[] (from client)                               ││
│  │  - system: ASSISTANT_PROMPT (personality)                  ││
│  │  - tools: [registrar_transaccion]                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                    │
│                              ▼                                    │
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
│   │   ├── page.tsx              # Modified: FAB + sidebar state
│   │   └── layout.tsx           # Modified: sidebar collapse logic
│   └── api/
│       └── assistant/
│           └── chat/
│               └── route.ts       # NEW: AI chat endpoint
├── components/
│   └── assistant/
│       ├── AssistantSheet.tsx    # NEW: Sheet container
│       ├── AssistantChat.tsx     # NEW: Chat messages
│       ├── AssistantFAB.tsx      # NEW: Floating Action Button
│       ├── AssistantInput.tsx    # NEW: Input component
│       └── AssistantPreVizCard.tsx # NEW: Confirmation card
├── hooks/
│   └── useAssistantChat.ts     # NEW: Chat state management
└── lib/
    ├── assistant-tools.ts        # NEW: Zod schemas + tools
    └── assistant-prompt.ts      # NEW: System prompt builder
```

## Component Specifications

### AssistantFAB
```tsx
// Position: fixed, bottom-right
// Size: 48x48px
// Margin: 24px from edges
// States:
//   - default: 💎 icon, bg-zinc-800
//   - hover: scale(1.1), bg-zinc-700
//   - active: scale(0.95)
// Animation: transition-all duration-200
```

### AssistantSheet
```tsx
// Width: 400px (desktop), 100% (mobile)
// Position: fixed right-0, top-0, bottom-0
// Background: bg-zinc-950
// Border-left: border-zinc-800
// Animation: slide-in-from-right 300ms ease-out
// Overlay: bg-black/50, click to close
```

### Sidebar Collapse Logic
```tsx
// Expanded: w-60 (240px)
// Collapsed: w-16 (64px)
// Transition: width 300ms ease-out
// Collapsed state: { isAssistantOpen: boolean }
// When isAssistantOpen → sidebar w-16
```

### AssistantPreVizCard
```tsx
// Border: border-indigo-500/50
// Background: bg-zinc-900
// Sections:
//   - Header: "Verifica los datos"
//   - Body: List of 9 fields
//   - Footer: [Confirmar] [Corregir]
```

## API Contract

### POST /api/assistant/chat

**Request:**
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  pendingTransaction?: TransaccionData
}
```

**Response:** Streaming text via `toTextStreamResponse()`

## Environment Variables

```env
GEMINI_API_KEY=  # From ~/.env
```

## Migration

1. Create new components in `src/components/assistant/`
2. Modify `dashboard/page.tsx` to add FAB and state
3. Modify `dashboard/layout.tsx` for sidebar collapse
4. Create API route
5. No existing functionality modified (additive change)

## Open Questions

1. **Name:** "Copilot" tentative - pending user confirmation
2. **FAB Icon:** 💎 placeholder - need final icon

## Testing Strategy

| Layer | What | How |
|-------|------|-----|
| Unit | Zod schemas | Validation tests |
| Integration | API route | Test with sample conversations |
| E2E | Full flow | User clicks FAB → chat → confirms → verifies in table |
