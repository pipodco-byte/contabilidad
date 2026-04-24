# Tasks: Copilot Assistant — Implementation Checklist

## Phase 1: Foundation (API + Schemas)

### 1.1 Environment Setup
- [ ] 1.1.1 Verify `GEMINI_API_KEY` in `.env.local`
- [ ] 1.1.2 Dependencies already installed: `ai`, `@ai-sdk/google`, `zod`

### 1.2 Supabase Schema
- [ ] 1.2.1 Add `parent_id` column to `transacciones` table
- [ ] 1.2.2 Create index on `parent_id`
- [ ] 1.2.3 Test ON DELETE CASCADE

### 1.3 Zod Schemas (Already done: src/lib/gema-tools.ts)
- [ ] 1.3.1 Verify `RegistrarTransaccionSchema`
- [ ] 1.3.2 Verify `BoldComisionSchema`
- [ ] 1.3.3 Verify tool definition

### 1.4 System Prompt (Already done: src/lib/gema-prompt.ts)
- [ ] 1.4.1 Verify personality rules
- [ ] 1.4.2 Verify 9 datos rules
- [ ] 1.4.3 Verify Bold rule
- [ ] 1.4.4 Verify micro-feedback rules
- [ ] 1.4.5 Verify output CSV format

---

## Phase 2: API Route

### 2.1 Chat Endpoint (Already done: src/app/api/gema/chat/route.ts)
- [ ] 2.1.1 Rename to `/api/assistant/chat/route.ts`
- [ ] 2.1.2 Update imports if needed
- [ ] 2.1.3 Test streaming response

### 2.2 Tool Execution (Already done)
- [ ] 2.2.1 Verify `registrar_transaccion` tool call
- [ ] 2.2.2 Verify Zod validation (firewall)
- [ ] 2.2.3 Verify date parsing (DD/MM/YYYY → YYYY-MM-DD)
- [ ] 2.2.4 Verify Bold rule (generate child transaction)
- [ ] 2.2.5 Verify INSERT with `parent_id`

---

## Phase 3: UI Components — NEW DESIGN

### 3.1 AssistantFAB
- [ ] 3.1.1 Create `src/components/assistant/AssistantFAB.tsx`
- [ ] 3.1.2 Position: fixed, bottom-right (24px margin)
- [ ] 3.1.3 Size: 48x48px, rounded-full
- [ ] 3.1.4 Icon: 💎 (placeholder)
- [ ] 3.1.5 States: default, hover (scale), active (scale)
- [ ] 3.1.6 Tooltip: "Asistente" on hover

### 3.2 AssistantSheet
- [ ] 3.2.1 Create `src/components/assistant/AssistantSheet.tsx`
- [ ] 3.2.2 Width: 400px (desktop), 100% (mobile)
- [ ] 3.2.3 Position: fixed right-0, top-0, bottom-0
- [ ] 3.2.4 Overlay backdrop (click to close)
- [ ] 3.2.5 Close button (X)
- [ ] 3.2.6 Contains: AssistantChat + AssistantInput
- [ ] 3.2.7 Animation: slide-in-from-right

### 3.3 AssistantChat
- [ ] 3.3.1 Create `src/components/assistant/AssistantChat.tsx`
- [ ] 3.3.2 Message list with scroll
- [ ] 3.3.3 User message bubbles (right, indigo)
- [ ] 3.3.4 Assistant message bubbles (left, zinc)
- [ ] 3.3.5 Streaming text display
- [ ] 3.3.6 Typing indicator

### 3.4 AssistantInput
- [ ] 3.4.1 Create `src/components/assistant/AssistantInput.tsx`
- [ ] 3.4.2 Textarea with auto-resize
- [ ] 3.4.3 Placeholder: "Escribe tu transacción..."
- [ ] 3.4.4 Send button
- [ ] 3.4.5 Microphone button (V2 placeholder)

### 3.5 AssistantPreVizCard
- [ ] 3.5.1 Create `src/components/assistant/AssistantPreVizCard.tsx`
- [ ] 3.5.2 Display 9 datos parsed
- [ ] 3.5.3 "Confirmar" button → INSERT
- [ ] 3.5.4 "Corregir" button → clear and ask

### 3.6 Assistant Index
- [ ] 3.6.1 Create `src/components/assistant/index.ts`
- [ ] 3.6.2 Export all components

---

## Phase 4: Dashboard Integration — FAB + Sidebar Collapse

### 4.1 Sidebar Layout Modifications
- [ ] 4.1.1 Add `isAssistantOpen` state to layout
- [ ] 4.1.2 Sidebar width conditional: 240px default, 64px collapsed
- [ ] 4.1.3 Animation: 300ms ease-out
- [ ] 4.1.4 Toggle button to manually expand/collapse

### 4.2 Dashboard Page Modifications
- [ ] 4.2.1 Import AssistantFAB in `dashboard/page.tsx`
- [ ] 4.2.2 Position FAB fixed bottom-right
- [ ] 4.2.3 FAB click → setAssistantOpen(true)
- [ ] 4.2.4 Sheet open → setAssistantOpen(true) + sidebar collapses
- [ ] 4.2.5 Sheet close → setAssistantOpen(false) + sidebar expands

### 4.3 Layout Integration
- [ ] 4.3.1 Pass `isAssistantOpen` and `setAssistantOpen` to layout
- [ ] 4.3.2 Sidebar respects collapsed state
- [ ] 4.3.3 Sheet mounts when `isAssistantOpen` is true

---

## Phase 5: Chat Logic

### 5.1 useAssistantChat Hook (Rename from useGemaChat)
- [ ] 5.1.1 Rename `src/hooks/useGemaChat.ts` to `useAssistantChat.ts`
- [ ] 5.1.2 Update API endpoint to `/api/assistant/chat`
- [ ] 5.1.3 Verify messages state
- [ ] 5.1.4 Verify streaming from API
- [ ] 5.1.5 Verify pending transaction state
- [ ] 5.1.6 Verify reset on sheet close

### 5.2 Conversation Flow
- [ ] 5.2.1 Send message → get streaming response
- [ ] 5.2.2 If tool call → show PreVizCard
- [ ] 5.2.3 On confirm → INSERT → show success
- [ ] 5.2.4 On correction → allow re-entry
- [ ] 5.2.5 Reset conversation on close

---

## Phase 6: Cleanup (Remove Old Gema)

### 6.1 Remove Old Gema Components
- [ ] 6.1.1 Delete `src/components/gema/` folder
- [ ] 6.1.2 Delete `src/hooks/useGemaChat.ts`
- [ ] 6.1.3 Delete `src/lib/gema-tools.ts` (or rename to assistant)
- [ ] 6.1.4 Delete `src/lib/gema-prompt.ts` (or rename)

### 6.2 Remove Old API Route
- [ ] 6.2.1 Delete `src/app/api/gema/chat/route.ts`
- [ ] 6.2.2 Confirm new route works

### 6.3 Remove Old Dashboard Code
- [ ] 6.3.1 Remove old Gema bottom bar from dashboard/page.tsx
- [ ] 6.3.2 Remove old Gema state variables
- [ ] 6.3.3 Clean up imports

---

## Phase 7: Testing

### 7.1 Manual Testing
- [ ] 7.1.1 Test FAB visible in dashboard
- [ ] 7.1.2 Test FAB click opens sheet
- [ ] 7.1.3 Test sidebar collapses
- [ ] 7.1.4 Test "Empezemos" greeting
- [ ] 7.1.5 Test transaction parsing
- [ ] 7.1.6 Test Bold rule (5% auto-egreso)
- [ ] 7.1.7 Test PreVizCard confirm
- [ ] 7.1.8 Test CSV output
- [ ] 7.1.9 Test micro-feedback
- [ ] 7.1.10 Test sheet close → sidebar expands

### 7.2 Edge Cases
- [ ] 7.2.1 Invalid date format
- [ ] 7.2.2 Negative monto
- [ ] 7.2.3 Empty description
- [ ] 7.2.4 Bold without sale (edge case)
- [ ] 7.2.5 Very long conversation (memory)

---

## Phase 8: Polish

### 8.1 Animations
- [ ] 8.1.1 FAB hover animation
- [ ] 8.1.2 Sheet slide-in animation
- [ ] 8.1.3 Sidebar collapse animation
- [ ] 8.1.4 Message fade-in

### 8.2 Styling
- [ ] 8.2.1 Match design system (zinc palette)
- [ ] 8.2.2 Indigo accents for assistant
- [ ] 8.2.3 Consistent with rest of app

### 8.3 Documentation
- [ ] 8.3.1 Update ESTADO_PROYECTO.md
- [ ] 8.3.2 Update GEMA_PROMPT.md if needed

---

## Dependencies Between Phases

```
Phase 1 (Foundation)
    ↓
Phase 2 (API Route)
    ↓
Phase 3 (UI Components)
    ↓
Phase 4 (Dashboard Integration)
    ↓
Phase 5 (Chat Logic)
    ↓
Phase 6 (Cleanup Old Code)
    ↓
Phase 7 (Testing)
    ↓
Phase 8 (Polish)
```

## Success Metrics

- [ ] FAB visible in dashboard bottom-right
- [ ] Click FAB → sheet opens + sidebar collapses
- [ ] Chat is stateful (remembers context)
- [ ] Transaction inserts to Supabase
- [ ] Bold rule generates child transaction
- [ ] PreVizCard shows before INSERT
- [ ] CSV output correct format
- [ ] Micro-feedback appears
- [ ] Sheet close → sidebar expands
- [ ] Build passes without errors
- [ ] Old Gema code fully removed
