# Gema Atomic Response - Technical Design

## 1. Backend Change: route.ts

### Before (streamText - broken)
```typescript
const result = await streamText({
  model: deepseek('deepseek-chat'),
  system: buildSystemPrompt(),
  messages,
  // tools: tools as any,
  // toolChoice: 'auto',
})

return result.toTextStreamResponse()
```

### After (generateText - working)
```typescript
import { generateText } from 'ai'
import { tools } from '@/lib/assistant-tools'

const { text, toolResults } = await generateText({
  model: deepseek('deepseek-chat'),
  system: buildSystemPrompt(),
  messages,
  tools,
})

return Response.json({
  role: 'assistant',
  content: text,
  toolResults,
})
```

---

## 2. Frontend Change: useAssistantChat.ts

### Changes to handleSend

```typescript
const handleSend = useCallback(
  async (text?: string) => {
    const textToSend = text || input
    if (!textToSend.trim()) return

    setInput('')
    setError(null)
    setPendingTransaction(null)

    const userMessage: Message = { role: 'user', content: textToSend }
    setMessages((prev) => [...prev, userMessage])

    // ... CSV/analytics detection remains same ...

    setIsLoading(true)

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'anonymous',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: result.content }
      ])

      // Handle tool results (if any transactions were registered)
      if (result.toolResults && result.toolResults.length > 0) {
        // Parse and show BatchCard with results
      }

    } catch (err) {
      // ... error handling ...
    } finally {
      setIsLoading(false)
    }
  },
  [input, messages, user?.id]
)
```

---

## 3. Skeleton Premium State

### In useAssistantChat.ts

```typescript
const [isThinking, setIsThinking] = useState(false)
const [thinkingMessage, setThinkingMessage] = useState('')

const THINKING_MESSAGES = [
  'Analizando montos...',
  'Sincronizando con Supabase...',
  'Validando categorías...',
  'Preparando confirmación...',
]

// Rotate messages while loading
useEffect(() => {
  if (isLoading) {
    const interval = setInterval(() => {
      setThinkingMessage(
        THINKING_MESSAGES[Math.floor(Math.random() * THINKING_MESSAGES.length)]
      )
    }, 2000)
    return () => clearInterval(interval)
  }
}, [isLoading])
```

### In AssistantSheet.tsx

```typescript
{isLoading && (
  <div className="flex justify-start">
    <div className="bg-zinc-800/80 px-4 py-3 rounded-2xl rounded-bl-md border border-zinc-700/50">
      <div className="space-y-2">
        <div className="h-4 bg-gradient-to-r from-indigo-500/20 via-zinc-700/50 to-indigo-500/20 rounded animate-pulse w-48" />
        <p className="text-xs text-zinc-500 italic">{thinkingMessage}</p>
      </div>
    </div>
  </div>
)}
```

---

## 4. Fade-in Animation

### CSS (globals.css)

```css
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.message-appear {
  animation: fadeInScale 0.3s ease-out forwards;
}
```

### Usage in AssistantSheet.tsx

```typescript
<div className="message-appear">
  {/* assistant message */}
</div>
```

---

## 5. Tool Result Handling

When `generateText` executes a tool, the result comes back in `toolResults`:

```typescript
if (result.toolResults && result.toolResults.length > 0) {
  const transactions = result.toolResults.map((tr: any) => tr.args)
  setPendingLote(transactions)
}
```

The `handleConfirmLote` will already be wired to BatchCard.

---

## 6. Testing Checklist

- [ ] Backend returns JSON with `content` and `toolResults`
- [ ] Frontend displays skeleton while waiting
- [ ] Thinking message rotates
- [ ] Response appears with fade-in animation
- [ ] Transactions register in Supabase
- [ ] `npm run build` passes