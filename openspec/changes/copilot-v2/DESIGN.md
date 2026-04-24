# Design: Copilot V2 — Technical Architecture

## Technical Approach

Extender Copilot V1 con voice, analytics, image extract, y auto-reset. Persistencia solo en localStorage.

## Architecture Decisions

### Decision: localStorage for Chat History

**Choice:** localStorage with 20-exchange limit (40 messages)
**Rationale:**
- Simple, no backend needed
- Browser-only (not shared)
- Limit prevents hallucination context growth
- Auto-reset after INSERT adds more headroom

### Decision: Web Speech API for Voice

**Choice:** Native browser SpeechRecognition
**Rationale:**
- Free, built-in browser API
- No external dependencies
- Good enough for short transaction dictation

### Decision: Image Extract - Regex + AI

**Choice:** Regex parsing first → fallback to AI
**Rationale:**
- Regex es más rápido y predecible para formatos conocidas
- AI como fallback para casos complejos
- Reduces tokens vs full AI parse

**Regex patterns:**
```
monto: /\$?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)\s*(?:COP)?/i
fecha: /(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i
referencia: /n[úu]mero\s+de\s+aprobaci[óo]n:?\s*(\d+)/i
medio_pago: /(daviplata|nequi|bre-b|davivienda|efectivo)/i
```

### Decision: Auto-Reset After INSERT

**Choice:** Clear chat after successful INSERT
**Rationale:**
- Keeps context clean
- Saves tokens
- Prevents chat from filling up during bulk entry
- User can still see previous transaction in the transactions table

### Decision: CSV without Context

**Choice:** Generate CSV as standalone response
**Rationale:**
- No need to maintain conversation context
- Just fetch data → format → display
- Much less tokens than maintaining full chat

## Data Flow

### Voice Input Flow
```
Mic Button → SpeechRecognition → transcript → input field → send
```

### Image Extract Flow
```
User: [upload image]
→ readAsDataURL() → base64
→ Regex parse (monto, fecha, referencia, medio_pago)
→ If success: PreVizCard with extracted data + ask categoria/IVA
→ If fail: AI fallback or error message
→ User confirms → INSERT → auto-reset
```

### Analytics Flow
```
User: "resumen de febrero"
→ detect keywords (resumen, mes, total)
→ call useResumen(userId, rol, '02', year)
→ format response as markdown table
→ display in chat
```

### CSV Flow
```
User: "Dame el CSV de hoy"
→ detect "CSV" keyword
→ fetch transacciones of the day
→ format as CSV (no headers)
→ display in chat (no context saved)
```

### Persistence Flow
```
Send message → save to localStorage
Open sheet → load from localStorage
INSERT success → auto-reset (clear messages)
Delete → clear localStorage
```

## File Structure

```
src/
├── components/assistant/
│   ├── AssistantSheet.tsx          # Modified: delete button, image handling
│   ├── AssistantInput.tsx          # Modified: mic + image buttons
│   ├── AssistantMicButton.tsx      # NEW: voice input
│   └── ImageUpload.tsx             # NEW: screenshot upload
├── hooks/
│   ├── useAssistantChat.ts         # Modified: auto-reset, image handling
│   └── useCopilotHistory.ts        # NEW: localStorage wrapper
└── lib/
    ├── voice-utils.ts              # NEW: SpeechRecognition wrapper
    └── image-extract.ts            # NEW: regex patterns for extract
```

## Component Specifications

### AssistantMicButton
```tsx
// States:
//   - idle: Mic icon, clickable
//   - listening: Mic icon + pulse animation + "Escuchando..."
//   - disabled: Mic icon grayed, tooltip "No disponible"
// Props: onTranscript: (text: string) => void
```

### ImageUpload
```tsx
// Button: image icon
// Click: opens file picker (accept="image/*")
// Max size: 5MB
// Preview: thumbnail in chat
// On extract: call regex + generate PreVizCard
```

### ImageExtract (lib)
```typescript
interface ExtractedData {
  monto?: number
  fecha?: string
  medio_pago?: string
  referencia?: string
}

// Regex patterns for:
// - monto: $150.000,00 COP → 150000
// - fecha: 13 de abril de 2026 → 13/04/2026
// - referencia: Número de aprobación: 252476 → 252476
// - medio_pago: DaviPlata / Nequi / Bre-B
```

### useCopilotHistory Hook
```typescript
interface HistoryItem {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// Methods:
//   save(item: HistoryItem): void
//   load(): HistoryItem[]
//   clear(): void
//   limit: 40 items (20 exchanges)
```

## Auto-Reset Logic

```typescript
// After INSERT success in handleConfirm:
setMessages(prev => [
  ...prev,
  { role: 'assistant', content: '✅ Transacción registrada. ¿Nueva transacción?' }
])
// Optional: clear history or show "Nueva sesión" button
```

## API Changes

Ninguna. El API route permanece igual.

## Environment Variables

Ninguna. localStorage + browser APIs.

## Migration from V1

1. Add voice-utils.ts
2. Add image-extract.ts
3. Add AssistantMicButton.tsx
4. Add ImageUpload.tsx
5. Modify AssistantInput.tsx
6. Modify AssistantSheet.tsx
7. Create useCopilotHistory hook
8. Modify useAssistantChat.ts (auto-reset)
9. No API route changes
10. No Supabase changes

## Testing Strategy

| Layer | What | How |
|-------|------|-----|
| Unit | Regex patterns | Test with sample screenshots |
| Unit | localStorage save/load/clear | Mock localStorage |
| Unit | keyword detection | Test cases |
| Integration | Analytics flow | Test with real data |
| Integration | Image extract | Test with real screenshots |
| E2E | Full flow | Manual test |
| Browser | Web Speech API | Test in Chrome/Safari/Firefox |