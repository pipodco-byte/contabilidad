# Tasks: IA Strategy - Voice Input (Fase 3)

## Phase: Apply - Fase 3 Voice Input

---

## Task 1: Create StrategyVoiceButton.tsx

**File:** `src/components/strategy/StrategyVoiceButton.tsx`

**Design:** Zinc minimalist with micro-feedback
- Idle: zinc-400
- Recording: zinc-50 + pulse/scale breathing
- Transcribing: indigo-500 Loader2
- Success: emerald-500 flash
- Error: rose-400 + toast

**Features:**
- Web Speech API integration
- SpeechRecognition with continuous mode
- Auto-stop after final transcript

---

## Task 2: Update StrategyChat.tsx

**File:** `src/components/strategy/StrategyChat.tsx`

**Changes:**
- [ ] Import `StrategyVoiceButton`
- [ ] Add handlers: `handleVoiceTranscript`, `handleVoiceError`
- [ ] Replace mic with `StrategyVoiceButton` component
- [ ] Position next to textarea

---

## Task 3: Update Tailwind Config (Optional)

**File:** `tailwind.config.ts`

Add custom animations if pulse/scale breathing not smooth enough:
```typescript
extend: {
  animation: {
    'scale-breathe': 'scale-breathe 2s ease-in-out infinite',
  },
}
```

---

## Task 4: Build Verification

```bash
npm run build
```

---

## Task 5: Manual Testing

**Checklist:**
- [ ] Open IA Strategy page
- [ ] Click mic → zinc-50 + breathing animation
- [ ] Speak: "Cómo voy este mes?"
- [ ] Verify transcript appears in input
- [ ] Indigo spinner during transcribing
- [ ] Emerald flash on success
- [ ] Tap send → AI responds with real data
- [ ] Test error cases

---

## Files Summary

| File | Action |
|------|--------|
| `src/components/strategy/StrategyVoiceButton.tsx` | Create |
| `src/components/strategy/StrategyChat.tsx` | Modify |

---

## Effort Estimate

- Task 1: 45 min
- Task 2: 20 min
- Task 3: 5 min (optional)
- Task 4: 5 min
- Task 5: 15 min

**Total: ~1.5 hours**