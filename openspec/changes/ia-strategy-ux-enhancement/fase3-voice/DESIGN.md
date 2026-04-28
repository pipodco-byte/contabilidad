# Design: IA Strategy - Voice Input (Fase 3)

## 1. Architecture

```
StrategyChat.tsx                    AssistantMicButton (reused)
┌─────────────────────────┐       ┌─────────────────────────┐
│ Voice States:            │       │ Props:                   │
│ - idle                  │──────▶│ - disabled               │
│ - recording             │       │ - onInterimChange       │
│ - transcribing         │       │ - onFinalChange         │
│ - generating           │       └─────────────────────────┘
│ - error                │
│                         │
│ Handlers:               │
│ - handleVoiceStart      │
│ - handleVoiceEnd        │
│ - handleTranscript      │
└─────────────────────────┘
```

---

## 2. File Changes

### 2.1 Modified: `src/components/strategy/StrategyChat.tsx`

**New imports:**
```typescript
import { AssistantMicButton } from '@/components/assistant/AssistantMicButton';
```

**New state:**
```typescript
const [isRecording, setIsRecording] = useState(false);
const [isTranscribing, setIsTranscribing] = useState(false);
```

**New handlers:**
```typescript
const handleInterimChange = (interimText: string) => {
  setInput((current) => `${current} ${interimText}`.trim());
  setIsRecording(true);
};

const handleFinalChange = (finalText: string) => {
  setInput(finalText);
  setIsRecording(false);
  setIsTranscribing(false);
};

const handleMicError = (error: string) => {
  toast.error(error);
  setIsRecording(false);
  setIsTranscribing(false);
};
```

**UI Changes:**
```tsx
{/* Replace simple mic with AssistantMicButton */}
<AssistantMicButton
  disabled={isLoading}
  onInterimChange={handleInterimChange}
  onFinalChange={handleFinalChange}
  onError={handleMicError}
/>
```

### 2.2 Visual States

```tsx
{/* Recording indicator */}
{isRecording && (
  <div className="flex items-center gap-2 text-red-400 animate-pulse">
    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
    <span className="text-xs">Escuchando...</span>
  </div>
)}

{/* Transcribing indicator */}
{isTranscribing && (
  <div className="flex items-center gap-2 text-muted-foreground">
    <Loader2 className="h-4 w-4 animate-spin" />
    <span className="text-xs">Transcribiendo...</span>
  </div>
)}
```

---

## 3. Web Speech API Usage

```typescript
// Check support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  // Hide mic button
  return null;
}

// Usage is handled by AssistantMicButton component
// We just need to handle the callbacks
```

---

## 4. Error Handling Flow

```typescript
const handleMicError = (error: string) => {
  switch (error) {
    case 'not-allowed':
      toast.error('Micrófono no disponible. Permisos denegados.');
      break;
    case 'no-speech':
      toast.error('No detecté voz. Intenta de nuevo.');
      break;
    case 'network':
      toast.error('Error de conexión. Verifica tu red.');
      break;
    default:
      toast.error('Error con el micrófono.');
  }
  setIsRecording(false);
};
```

---

## 5. Testing Checklist

- [ ] Mic button appears in StrategyChat
- [ ] Click mic → visual recording indicator
- [ ] Speak → transcript appears in input
- [ ] Mic auto-stops after silence
- [ ] Error toasts show correctly
- [ ] Strategic context included in voice queries
- [ ] Build passes