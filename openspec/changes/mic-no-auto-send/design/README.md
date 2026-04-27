# Mic No Auto-Send - Technical Design

## 1. Files to Modify

### 1.1 `src/lib/voice-utils.ts`

**Current behavior (problematic):**
```typescript
recognitionRef.current.onend = () => {
  setIsListening(false)
  // onend callback allows browser to trigger on transcript
}
```

**New behavior:**
```typescript
recognitionRef.current.onend = () => {
  setIsListening(false)
  // NO onTranscript call here - user decides when to send
}
```

### 1.2 `src/components/assistant/AssistantMicButton.tsx`

**Current handleClick:**
```typescript
const handleClick = () => {
  if (isListening) {
    stopListening()
    const finalText = transcript.trim() || interimTranscript.trim()
    if (finalText) {
      onTranscript(finalText)  // ← AUTO-SEND
      resetTranscript()
    }
  } else {
    startListening()
  }
}
```

**New handleClick:**
```typescript
const handleClick = () => {
  if (isListening) {
    stopListening()
    // NO onTranscript here - let user review and send manually
    // Just stop recording, text stays in textarea via interimUpdate
  } else {
    startListening()
  }
}
```

**Key change:** Remove the `onTranscript(finalText)` call from the listening-stop flow.

---

## 2. Flow Diagram

### Before (BAD):
```
User speaks → onresult → transcript updated
User stops → onend → setIsListening(false)
  ↓
onend callback → onTranscript(finalText) ← AUTO-SEND!
  ↓
Message sent without user review
```

### After (GOOD):
```
User speaks → onresult → interimTranscript → textarea
User stops → onend → setIsListening(false)
  ↓
NO AUTO-SEND - text stays in textarea
  ↓
User reviews/edits
  ↓
Enter pressed OR Send clicked → handleSend() ← USER DECIDES
```

---

## 3. The textarea is the Buffer

The textarea (already implemented in chat-input-enhancement) serves as the buffer:

1. **Live preview**: `onInterimChange` updates textarea while speaking
2. **Persistence**: Text stays after mic stops
3. **Editing**: User can correct any errors
4. **Sending**: User presses Enter or clicks Send

---

## 4. Why this is better

| Aspecto | Before | After |
|--------|--------|-------|
| **Control** | Browser decides when to send | User decides |
| **Errors** | Noises/muletillas get sent | User reviews first |
| **Anxiety** | "Run against the mic" | User can think and pause |
| **Consistency** | Breaks textarea UX | Textarea and Mic work together |

---

## 5. Testing Checklist

- [ ] Mic stops when user stops speaking
- [ ] Text stays in textarea after micropausa
- [ ] User can edit text before sending
- [ ] Enter sends the message
- [ ] Send button sends the message
- [ ] No auto-send when browser auto-stops