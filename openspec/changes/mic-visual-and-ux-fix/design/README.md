# Mic Visual & UX Fix - Technical Design

## 1. Files to Modify

### 1.1 `src/lib/voice-utils.ts`

**Changes:**
- Agregar `interimTranscript` state
- Separate `finalTranscript` vs `interimTranscript`
- Expose both in return object

**Current:**
```typescript
const [transcript, setTranscript] = useState('')
```

**New:**
```typescript
const [finalTranscript, setFinalTranscript] = useState('')
const [interimTranscript, setInterimTranscript] = useState('')

// onresult handler updates both
recognitionRef.current.onresult = (event: any) => {
  let final = ''
  let interim = ''

  for (let i = 0; i < event.results.length; i++) {
    const result = event.results[i]
    if (result.isFinal) {
      final += result[0].transcript
    } else {
      interim += result[0].transcript
    }
  }

  setFinalTranscript(final || interim)
  setInterimTranscript(interim)
}
```

**Return updated:**
```typescript
return {
  transcript: finalTranscript,
  interimTranscript,  // NEW
  isListening,
  isSupported,
  startListening,
  stopListening,
  resetTranscript,
}
```

---

### 1.2 `src/components/assistant/AssistantMicButton.tsx`

**Changes:**
1. Agregar CSS para wave animation en el archivo o inline
2. Agregar props: `currentInput`, `onInterimChange`
3. Cuando está escuchando, concatenar interim al currentInput

**New Props:**
```typescript
interface AssistantMicButtonProps {
  onTranscript: (text: string) => void
  disabled?: boolean
  currentInput?: string        // NEW
  onInterimChange?: (text: string) => void  // NEW
}
```

**CSS Wave (inline styles o tailwind arbitrary):**
```css
@keyframes wave {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.75;
    transform: scale(1.08);
  }
}

.mic-active {
  animation: wave 1.4s ease-in-out infinite;
  background-color: rgba(244, 63, 94, 0.2);
  color: rgb(244, 63, 94);
}
```

**When listening, call onInterimChange:**
```typescript
// In useEffect watching interimTranscript
useEffect(() => {
  if (isListening && interimTranscript && onInterimChange) {
    onInterimChange(currentInput + ' ' + interimTranscript)
  }
}, [interimTranscript, isListening, currentInput, onInterimChange])
```

**JSX when listening:**
```tsx
<button
  className={cn(
    "p-2 rounded-lg transition-all duration-200 mic-active",
    disabled && "opacity-50 cursor-not-allowed"
  )}
>
  <Mic className="w-5 h-5" />
</button>
```

---

### 1.3 `src/components/assistant/AssistantSheet.tsx`

**Changes:**
1. State del input se pasa al mic button
2. Actualizar input cuando llega interimTranscript

**找到 el input state y pasar al mic button:**
```tsx
// En el return del AssistantSheet
<AssistantMicButton
  onTranscript={...}
  disabled={...}
  currentInput={inputValue}
  onInterimChange={(text) => setInputValue(text)}
/>
```

**Para que el input sea editable por el usuario:**
```tsx
<Input
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  // El usuario puede editar normalmente
/>
```

---

## 2. Component Hierarchy

```
AssistantSheet
├── state: inputValue (agregar)
├── onInterimChange: (text) => setInputValue(text)
│
├── Input (value={inputValue}, onChange actualiza inputValue)
│
└── AssistantMicButton
    ├── currentInput={inputValue}
    ├── onInterimChange={(text) => setInputValue(text)}
    └── voice-utils.ts
        ├── finalTranscript → enviado cuando user hace clic Send
        └── interimTranscript → va al input en tiempo real
```

---

## 3. Flow Diagram

```
Usuario hace clic Mic
    ↓
AssistantMicButton.startListening()
    ↓
voice-utils: setIsListening(true)
    ↓
Web Speech API detecta voz → onresult
    ↓
interimTranscript se actualiza
    ↓
useEffect detecta cambio → onInterimChange(input + interim)
    ↓
AssistantSheet: setInputValue(texto + interim)
    ↓
Input muestra texto en tiempo real
    ↓
Usuario puede EDITAR el texto (onChange normal)
    ↓
Usuario hace clic Send
    ↓
Se envía lo que está en inputValue (editado o no)
```

---

## 4. CSS for Wave Animation

**Ubicación:** Se puede agregar como:
- Inline style tag en `AssistantMicButton.tsx`
- O en `globals.css` / `app/globals.css`

```css
@keyframes mic-wave {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.mic-recording {
  animation: mic-wave 1.5s ease-in-out infinite;
  background-color: rgba(244, 63, 94, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem;
  color: rgb(244, 63, 94);
}
```

---

## 5. Testing Checklist

- [ ] Mic button muestra wave animation cuando graba (no pulse)
- [ ] Hablo y veo el texto en el input en tiempo real
- [ ] Puedo EDITAR el texto antes de enviar
- [ ] El texto final que se envía es el que está en el input
- [ ] Build pasa