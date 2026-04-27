# Chat Input Enhancement - Technical Design

## 1. Files to Modify

### `src/components/assistant/AssistantSheet.tsx`

---

## 2. Changes

### 2.1 Agregar refs y state

```typescript
const textareaRef = useRef<HTMLTextAreaElement>(null)
```

### 2.2 Agregar useEffect para altura dinámica

```typescript
useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = 'inherit'
    const scrollHeight = textareaRef.current.scrollHeight
    textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`
  }
}, [input])
```

### 2.3 Agregar handler onKeyDown

```typescript
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
```

### 2.4 Cambiar input a textarea

**ANTES:**
```tsx
<input
  type="text"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  placeholder="Escribe tu transacción..."
  disabled={isLoading}
  className="flex-1 px-4 py-2.5 ..."
/>
```

**DESPUÉS:**
```tsx
<textarea
  ref={textareaRef}
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={handleKeyDown}
  placeholder="Dicta o escribe tu transacción..."
  disabled={isLoading}
  rows={1}
  className="flex-1 px-4 py-3 min-h-[44px] max-h-40 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 transition-all resize-none overflow-y-auto"
/>
```

---

## 3. CSS Classes Detalladas

```css
flex-1              /* Ocupa el espacio disponible */
min-h-[44px]        /* Altura mínima (una línea) */
max-h-40            /* Altura máxima (160px, 10rem) */
bg-zinc-900         /* Fondo oscuro */
border border-zinc-700  /* Borde sutil */
rounded-xl          /* Bordes redondeados */
text-zinc-100       /* Texto claro */
placeholder:text-zinc-500  /* Placeholder gris */
focus:border-indigo-500/50 /* Borde indigo al focus */
resize-none         /* No permite redimensionar manualmente */
overflow-y-auto     /* Scroll vertical si excede */
transition-all      /* Transición suave de altura */
```

---

## 4. Flujo de la Altura Dinámica

```
1. input cambia (usuario digita o dicta)
2. useEffect se dispara
3. textareaRef.current.style.height = 'inherit' (reset)
4. Se lee scrollHeight (altura real del contenido)
5. Se establece height = min(scrollHeight, 160px)
6. Si excede 160px → overflow-y-auto → scroll vertical
```

---

## 5. Flujo del Enter Key

```
1. Usuario presiona Enter en textarea
2. handleKeyDown se ejecuta
3. Si Enter sin Shift → e.preventDefault() + handleSend()
4. Si Enter con Shift → comportamiento default (nueva línea)
```

---

## 6. Comportamiento Visual

| Estado | Altura | Scroll |
|--------|-------|--------|
| Vacío | ~44px (1 línea) | No |
| Poco texto | Crece según contenido | No |
| Mucho texto | 160px máximo | Sí (overflow) |

---

## 7. Testing Checklist

- [ ] Textarea inicia pequeño (1 línea)
- [ ] Textarea crece mientras escribo
- [ ] Textarea no excede 160px
- [ ] Scroll aparece si hay overflow
- [ ] Enter envía mensaje
- [ ] Shift+Enter crea nueva línea
- [ ] Click en botón enviar funciona
- [ ] Build pasa