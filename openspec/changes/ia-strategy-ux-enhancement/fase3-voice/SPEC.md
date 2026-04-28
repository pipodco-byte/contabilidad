# Specification: IA Strategy - Voice Input (Fase 3)

## 1. Overview

**Change:** Fase 3 - Voice Input
**Type:** Feature Enhancement
**Status:** Spec Draft
**Created:** 2026-04-28

---

## 2. Problem Statement

IA Strategy needs hands-free voice input for strategic queries. Design must be **Zinc minimalist** - no competing colors, just functional micro-feedback.

---

## 3. Voice States (Zinc Minimalist Design)

| State | Icon | Color | Effect |
|-------|------|-------|--------|
| **Idle** | `Mic` | zinc-400 | None |
| **Recording** | `Mic` | zinc-50 + bg-zinc-800/50 | Pulse + scale "breathing" |
| **Transcribing** | `Loader2` | indigo-500 | Spin |
| **Success** | `Check` | emerald-500 | Flash quick |
| **Error** | `X` | rose-400 | Toast error |

---

## 4. UX Flow

```
Felipe taps mic
        ↓
State: Idle → Recording
        ↓
Visual: Zinc-50 + pulse scale "breathing"
        ↓
Felipe speaks (Web Speech API captures audio)
        ↓
State: Recording → Transcribing
        ↓
Visual: Indigo-500 Loader2 spinning
        ↓
Transcript ready → auto-fill input
        ↓
Flash emerald-500 Check briefly
        ↓
User reviews/corrects if needed
        ↓
User taps Send
        ↓
AI responds with strategic advice (context from Fase 2)
        ↓
State: Idle
```

---

## 5. Requirements

### 5.1 Component Integration

- Custom voice button (not Gema's AssistantMicButton - different design)
- Integrate into `StrategyChat.tsx`
- Handle voice → text → submit flow

### 5.2 Visual Feedback (Zinc Minimalist)

- **Idle:** zinc-400 outline only, no background
- **Recording:** zinc-50 text + bg-zinc-800/50 + scale pulse
- **Transcribing:** indigo-500 Loader2 spinner
- **Success:** emerald-500 Check flash (200ms)

### 5.3 Micro-Feedback (Indigo/Emerald)

- Indigo-500 for "thinking/processing" states
- Emerald-500 for successful actions
- No red - zinc theme is sober, not alarming

### 5.4 Error Handling

| Scenario | Handling |
|----------|----------|
| Mic permission denied | Show toast: "Micrófono no disponible" |
| Empty transcript | Show toast: "No detecté voz" |
| Network error | Show toast: "Error de conexión" |
| Browser doesn't support Web Speech | Hide mic button |

### 5.5 Context Integration

- Voice message should trigger same `getFinancialContext()` flow
- Ensure real data is included in strategic queries

---

## 6. Dependencies

- Web Speech API (browser built-in)
- Lucide icons (already in use)
- Sonner toast (already in use)

---

## 7. Success Criteria

- [ ] Mic button visible in StrategyChat (zinc-400 idle)
- [ ] Recording shows zinc-50 + pulse/scale "breathing"
- [ ] Transcribing shows indigo-500 spinner
- [ ] Success flash emerald-500
- [ ] Transcript auto-fills input
- [ ] Errors handled gracefully
- [ ] Strategic context included in voice queries
- [ ] Build passes