# Tasks: Gema IA — Implementation Checklist

## Phase 1: Foundation (APIs + Schemas)

### 1.1 Environment Setup
- [ ] 1.1.1 Add `GEMINI_API_KEY` to `.env.local`
- [ ] 1.1.2 Install dependencies: `ai`, `@ai-sdk/gemini`, `zod`

### 1.2 Supabase Schema
- [ ] 1.2.1 Add `parent_id` column to `transacciones` table
- [ ] 1.2.2 Create index on `parent_id`
- [ ] 1.2.3 Test ON DELETE CASCADE

### 1.3 Zod Schemas
- [ ] 1.3.1 Create `src/lib/gema-tools.ts`
- [ ] 1.3.2 Define `RegistrarTransaccionSchema`
- [ ] 1.3.3 Define `BoldComisionSchema`
- [ ] 1.3.4 Define tool definition for Gemini

### 1.4 System Prompt
- [ ] 1.4.1 Create `src/lib/gema-prompt.ts`
- [ ] 1.4.2 Extract personality rules from GEMA_PROMPT.md
- [ ] 1.4.3 Define 9 datos rules
- [ ] 1.4.4 Define Bold rule
- [ ] 1.4.5 Define micro-feedback rules
- [ ] 1.4.6 Define output CSV format

---

## Phase 2: API Route

### 2.1 Chat Endpoint
- [ ] 2.1.1 Create `/src/app/api/gema/chat/route.ts`
- [ ] 2.1.2 Set up Vercel AI SDK with Gemini provider
- [ ] 2.1.3 Implement message streaming
- [ ] 2.1.4 Integrate system prompt
- [ ] 2.1.5 Add tool definitions

### 2.2 Tool Execution
- [ ] 2.2.1 Handle `registrar_transaccion` tool call
- [ ] 2.2.2 Validate with Zod (firewall)
- [ ] 2.2.3 Parse date format (DD/MM/YYYY → YYYY-MM-DD)
- [ ] 2.2.4 Implement Bold rule (generate child transaction)
- [ ] 2.2.5 Insert to Supabase with `parent_id`
- [ ] 2.2.6 Return success/error

### 2.3 Error Handling
- [ ] 2.3.1 Invalid Zod → return error message
- [ ] 2.3.2 Supabase error → return error message
- [ ] 2.3.3 Missing required data → return clarification question

---

## Phase 3: UI Components

### 3.1 GemaBottomBar
- [ ] 3.1.1 Create `src/components/gema/GemaBottomBar.tsx`
- [ ] 3.1.2 Fixed position at bottom
- [ ] 3.1.3 Contains GemaInput
- [ ] 3.1.4 Submit handler → opens sheet

### 3.2 GemaInput
- [ ] 3.2.1 Create `src/components/gema/GemaInput.tsx`
- [ ] 3.2.2 Textarea with auto-resize
- [ ] 3.2.3 Placeholder: "💎 Escribe tu transacción..."
- [ ] 3.2.4 Send button
- [ ] 3.2.5 Microphone button (V2 placeholder)

### 3.3 GemaSheet
- [ ] 3.3.1 Create `src/components/gema/GemaSheet.tsx`
- [ ] 3.3.2 Sheet from right side
- [ ] 3.3.3 Overlay backdrop (click to close)
- [ ] 3.3.4 Close button (X)
- [ ] 3.3.5 Contains GemaChat + GemaInput

### 3.4 GemaChat
- [ ] 3.4.1 Create `src/components/gema/GemaChat.tsx`
- [ ] 3.4.2 Message list with scroll
- [ ] 3.4.3 User message bubbles (right)
- [ ] 3.4.4 Assistant message bubbles (left)
- [ ] 3.4.5 Streaming text display
- [ ] 3.4.6 Typing indicator

### 3.5 GemaPreVizCard
- [ ] 3.5.1 Create `src/components/gema/GemaPreVizCard.tsx`
- [ ] 3.5.2 Display 9 datos parsed
- [ ] 3.5.3 "Confirmar" button → calls API
- [ ] 3.5.4 "Corregir" button → clears and asks

### 3.6 Dashboard Integration
- [ ] 3.6.1 Import GemaBottomBar in `dashboard/page.tsx`
- [ ] 3.6.2 Add above footer or in layout
- [ ] 3.6.3 Manage sheet open/close state

---

## Phase 4: Chat Logic

### 4.1 useGemaChat Hook
- [ ] 4.1.1 Create `src/hooks/useGemaChat.ts`
- [ ] 4.1.2 Manage messages state
- [ ] 4.1.3 Handle streaming from API
- [ ] 4.1.4 Manage pending transaction state
- [ ] 4.1.5 Reset on sheet close

### 4.2 Conversation Flow
- [ ] 4.2.1 Send message → get streaming response
- [ ] 4.2.2 If tool call → show PreVizCard
- [ ] 4.2.3 On confirm → INSERT → show success
- [ ] 4.2.4 On correction → allow re-entry
- [ ] 4.2.5 Reset conversation on close

---

## Phase 5: Testing

### 5.1 Manual Testing
- [ ] 5.1.1 Test bottom bar appears
- [ ] 5.1.2 Test sheet opens/closes
- [ ] 5.1.3 Test "Empezemos" greeting
- [ ] 5.1.4 Test transaction parsing (valid data)
- [ ] 5.1.5 Test missing data clarification
- [ ] 5.1.6 Test Bold rule (5% auto-egreso)
- [ ] 5.1.7 Test PreVizCard confirm
- [ ] 5.1.8 Test CSV output
- [ ] 5.1.9 Test micro-feedback

### 5.2 Edge Cases
- [ ] 5.2.1 Invalid date format
- [ ] 5.2.2 Negative monto
- [ ] 5.2.3 Empty description
- [ ] 5.2.4 Bold without sale (edge case)
- [ ] 5.2.5 Very long conversation (memory)

---

## Phase 6: Polish

### 6.1 Animations
- [ ] 6.1.1 Sheet slide-in animation
- [ ] 6.1.2 Message fade-in
- [ ] 6.1.3 PreVizCard appear animation

### 6.2 Styling
- [ ] 6.2.1 Match design system (zinc palette)
- [ ] 6.2.2 Indigo accents for Gema brand
- [ ] 6.2.3 Consistent with rest of app

### 6.3 Documentation
- [ ] 6.3.1 Update GEMA_PROMPT.md if needed
- [ ] 6.3.2 Update ESTADO_PROYECTO.md
- [ ] 6.3.3 Add comments to complex code

---

## Dependencies Between Phases

```
Phase 1 (Foundation)
    ↓
Phase 2 (API Route) ← Phase 1 must complete first
    ↓
Phase 3 (UI) ← Phase 2 must be working
    ↓
Phase 4 (Logic) ← Phase 3 must be complete
    ↓
Phase 5 (Testing) ← All previous
    ↓
Phase 6 (Polish)
```

## Recommended Implementation Order

1. **Day 1:** Phase 1 + Phase 2 (API works)
2. **Day 2:** Phase 3 + Phase 4 (UI + Logic)
3. **Day 3:** Phase 5 + Phase 6 (Testing + Polish)

---

## Success Metrics

- [ ] Build passes without errors
- [ ] Bottom bar visible on dashboard
- [ ] Sheet opens with animation
- [ ] Chat is stateful (remembers context)
- [ ] Transaction inserts to Supabase
- [ ] Bold rule generates child transaction
- [ ] PreVizCard shows before INSERT
- [ ] CSV output correct format
- [ ] Micro-feedback appears
