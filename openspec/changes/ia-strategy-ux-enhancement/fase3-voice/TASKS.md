# Tasks: IA Strategy - Voice Input (Fase 3)

## Phase: Apply - Fase 3 Voice Input

---

## Task 1: Update StrategyChat.tsx

**File:** `src/components/strategy/StrategyChat.tsx`

**Changes:**
- [ ] Import `AssistantMicButton`
- [ ] Add voice state: `isRecording`, `isTranscribing`
- [ ] Add handlers: `handleInterimChange`, `handleFinalChange`, `handleMicError`
- [ ] Add `AssistantMicButton` component in input area
- [ ] Add visual indicators (recording, transcribing)
- [ ] Handle microphone errors gracefully

---

## Task 2: Check AssistantMicButton Props

**File:** `src/components/assistant/AssistantMicButton.tsx`

**Verify props:**
```typescript
interface AssistantMicButtonProps {
  disabled?: boolean;
  onInterimChange?: (text: string) => void;
  onFinalChange?: (text: string) => void;
  onError?: (error: string) => void;
}
```

**If props differ, adjust StrategyChat handlers accordingly.**

---

## Task 3: Build Verification

```bash
npm run build
```

---

## Task 4: Manual Testing

**Checklist:**
- [ ] Open IA Strategy page
- [ ] Click mic button
- [ ] Speak: "Cómo voy este mes?"
- [ ] Verify transcript appears
- [ ] Verify "Escuchando..." indicator shows while recording
- [ ] Tap send → AI responds
- [ ] Test error cases (mic blocked, no speech)

---

## Files Summary

| File | Action |
|------|--------|
| `src/components/strategy/StrategyChat.tsx` | Modify |

---

## Effort Estimate

- Task 1: 45 min
- Task 2: 10 min
- Task 3: 5 min
- Task 4: 15 min

**Total: ~1.25 hours**