# Design: IA Strategy - Voice Input (Fase 3)

## 1. Architecture

```
StrategyChat.tsx
┌─────────────────────────────────────────────────┐
│ Voice States:                                   │
│ - idle: zinc-400                               │
│ - recording: zinc-50 + pulse/scale "breathing" │
│ - transcribing: indigo-500 Loader2             │
│ - success: emerald-500 Check flash             │
│ - error: rose-400 + toast                     │
│                                                   │
│ Web Speech API (browser built-in)               │
└─────────────────────────────────────────────────┘
```

---

## 2. File Changes

### 2.1 New Component: `src/components/strategy/StrategyVoiceButton.tsx`

**Zinc Minimalist Design:**

```tsx
'use client';

import * as React from 'react';
import { Mic, Loader2, Check, X } from 'lucide-react';

type VoiceState = 'idle' | 'recording' | 'transcribing' | 'success' | 'error';

interface StrategyVoiceButtonProps {
  disabled?: boolean;
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
}

export function StrategyVoiceButton({ disabled, onTranscript, onError }: StrategyVoiceButtonProps) {
  const [state, setState] = React.useState<VoiceState>('idle');
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current || disabled) return;

    setState('recording');

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      if (event.results[event.results.length - 1].isFinal) {
        setState('transcribing');
        setTimeout(() => {
          setState('success');
          onTranscript(transcript);
          setTimeout(() => setState('idle'), 500);
        }, 300);
      }
    };

    recognitionRef.current.onerror = (event) => {
      setState('error');
      onError?.(event.error);
      setTimeout(() => setState('idle'), 1000);
    };

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
  };

  const toggleRecording = () => {
    if (state === 'idle') {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const getIcon = () => {
    switch (state) {
      case 'recording': return <Mic className="h-5 w-5" />;
      case 'transcribing': return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'success': return <Check className="h-5 w-5" />;
      case 'error': return <X className="h-5 w-5" />;
      default: return <Mic className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (state) {
      case 'recording':
        return 'text-zinc-50 bg-zinc-800/50 animate-pulse scale-105';
      case 'transcribing':
        return 'text-indigo-500';
      case 'success':
        return 'text-emerald-500';
      case 'error':
        return 'text-rose-400';
      default:
        return 'text-zinc-400 hover:text-zinc-100';
    }
  };

  return (
    <button
      onClick={toggleRecording}
      disabled={disabled}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${getStyles()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {getIcon()}
    </button>
  );
}
```

### 2.2 Modified: `src/components/strategy/StrategyChat.tsx`

**Add imports:**
```tsx
import { StrategyVoiceButton } from './StrategyVoiceButton';
```

**Add handlers:**
```tsx
const handleVoiceTranscript = (text: string) => {
  setInput(text);
};

const handleVoiceError = (error: string) => {
  switch (error) {
    case 'not-allowed':
      toast.error('Micrófono no disponible');
      break;
    case 'no-speech':
      toast.error('No detecté voz');
      break;
    case 'network':
      toast.error('Error de conexión');
      break;
    default:
      toast.error('Error con el micrófono');
  }
};
```

**Add component:**
```tsx
<StrategyVoiceButton
  disabled={isLoading}
  onTranscript={handleVoiceTranscript}
  onError={handleVoiceError}
/>
```

---

## 3. CSS Animation (Tailwind extend)

```typescript
// tailwind.config.ts
extend: {
  animation: {
    'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'scale-breathe': 'scale-breathe 2s ease-in-out infinite',
  },
  keyframes: {
    'scale-breathe': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
    },
  },
}
```

---

## 4. Testing Checklist

- [ ] Mic button appears in zinc-400 idle state
- [ ] Click → zinc-50 + pulse/scale breathing animation
- [ ] Speak → transcript auto-fills input
- [ ] Indigo spinner shows during transcribing
- [ ] Emerald flash on success
- [ ] Error toasts work
- [ ] Strategic context included
- [ ] Build passes