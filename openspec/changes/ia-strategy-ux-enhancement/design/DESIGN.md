# Design: IA Strategy - UX Enhancement (Fase 1)

## 1. Architecture

```
StrategyChat.tsx                    StrategyMessage.tsx
┌─────────────────────────┐       ┌─────────────────────────┐
│ State:                  │       │ markdownComponents:      │
│ - input                 │──────▶│ - p, strong, em        │
│ - isLoading             │       │ - ul, ol, li           │
│ - showDeleteConfirm     │       │ - h1, h2, h3           │
│ - isFirstLoad           │       │ - blockquote            │
│                         │       │ - code, pre            │
│ Refs:                   │       │ - table elements       │
│ - messagesEndRef        │       └─────────────────────────┘
│ - textareaRef           │
│                         │
│ Components:             │
│ - Textarea (auto-grow)  │
│ - DeleteModal (blur)     │
└─────────────────────────┘
```

---

## 2. File Changes

### 2.1 New Dependencies

```bash
npm install react-markdown remark-gfm
```

### 2.2 StrategyMessage.tsx

**Before:**
```tsx
<p className="whitespace-pre-wrap">{message.content}</p>
```

**After:**
```tsx
{isUser ? (
  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
) : (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={markdownComponents}
  >
    {message.content}
  </ReactMarkdown>
)}
```

### 2.3 StrategyChat.tsx

**Textarea replacement:**
```tsx
<textarea
  ref={textareaRef}
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={handleKeyDown}
  placeholder="¿Cuánto puedo gastar?"
  disabled={isLoading}
  rows={1}
  className="flex-1 px-4 py-3 min-h-[44px] max-h-40 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 transition-all resize-none overflow-y-auto"
/>
```

**Auto-grow effect:**
```tsx
useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = 'inherit';
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
  }
}, [input]);
```

**Hybrid scroll:**
```tsx
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({
      behavior: isFirstLoad ? 'instant' : 'smooth'
    });
  }
  setIsFirstLoad(false);
}, [chatHistory, isFirstLoad]);
```

**Enhanced delete modal:**
```tsx
{showDeleteConfirm && (
  <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
    <div
      className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm mx-4"
      style={{ animation: 'scaleIn 0.2s ease-out' }}
    >
      <h3 className="text-lg font-semibold text-zinc-100 mb-2">
        ¿Eliminar conversación?
      </h3>
      <p className="text-sm text-zinc-400 mb-4">
        Se eliminará toda la conversación.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600..."
        >
          Cancelar
        </button>
        <button
          onClick={handleDeleteChat}
          className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-500..."
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}
```

---

## 3. CSS Animation (if needed)

```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 4. Testing Checklist

- [ ] Tablas Markdown se renderizan correctamente
- [ ] Code blocks tienen fondo oscuro
- [ ] Textarea crece al escribir múltiples líneas
- [ ] Enter envía, Shift+Enter hace nueva línea
- [ ] Delete modal tiene blur de fondo
- [ ] Primer scroll no parpadea
- [ ] Build pasa