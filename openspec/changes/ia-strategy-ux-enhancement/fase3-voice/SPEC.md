# Specification: IA Strategy - Voice Input (Fase 3)

## 1. Overview

**Change:** Fase 3 - Voice Input
**Type:** Feature Enhancement
**Status:** Spec Draft
**Created:** 2026-04-28

---

## 2. Problem Statement

IA Strategy needs hands-free voice input for strategic queries. While Gema's `AssistantMicButton` exists, voice interaction in a strategic context requires defined states and elegant error handling.

---

## 3. Voice States

| State | Description | UI |
|-------|-------------|-----|
| **Idle** | Mic button ready | Default mic icon |
| **Recording** | User is speaking | Pulsing red dot + waveform |
| **Transcribing** | Converting speech to text | "Escuchando..." text |
| **Generating** | AI processing | "Pensando..." with pulse |
| **Error** | Something failed | Toast error + back to Idle |

---

## 4. UX Flow

```
Felipe taps mic
        ↓
State: Idle → Recording
        ↓
Visual: Mic turns red + waveform animation
        ↓
Felipe speaks (Web Speech API captures audio)
        ↓
State: Recording → Transcribing
        ↓
Visual: "Escuchando..." with pulse
        ↓
Transcript ready → auto-fill input
        ↓
User reviews/corrects if needed
        ↓
User taps Send (or auto-send option)
        ↓
State: Generating
        ↓
AI responds with strategic advice
        ↓
State: Idle
```

---

## 5. Requirements

### 5.1 Component Integration

- Import `AssistantMicButton` from Gema
- Integrate into `StrategyChat.tsx`
- Handle voice → text → submit flow

### 5.2 Visual Feedback

- Mic icon with red recording state
- Waveform animation during recording
- "Escuchando..." text with pulse
- Consistent with zinc theme

### 5.3 Error Handling

| Scenario | Handling |
|----------|----------|
| Mic permission denied | Show toast: "Micrófono no disponible" |
| Empty transcript | Show toast: "No detecté voz" |
| Network error | Show toast: "Error de conexión" |
| Browser doesn't support Web Speech | Hide mic button |

### 5.4 Context Integration

- Voice message should trigger same `getFinancialContext()` flow
- Ensure real data is included in strategic queries

---

## 6. Dependencies

- `AssistantMicButton` component (exists in Gema)
- `useAssistantChat` hook (for reference)
- Web Speech API (browser built-in)

---

## 7. Success Criteria

- [ ] Mic button visible in StrategyChat
- [ ] Recording shows visual feedback
- [ ] Transcript auto-fills input
- [ ] Errors handled gracefully
- [ ] Strategic context included in voice queries
- [ ] Build passes