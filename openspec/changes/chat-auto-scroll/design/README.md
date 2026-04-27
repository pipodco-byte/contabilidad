# Chat Auto-Scroll - Technical Design

## 1. File to Modify

### `src/components/assistant/AssistantSheet.tsx`

---

## 2. Changes

### 2.1 Agregar state para detectar primer load

```typescript
const [isFirstLoad, setIsFirstLoad] = useState(true)
```

### 2.2 Agregar ref para el final de mensajes

```typescript
const messagesEndRef = useRef<HTMLDivElement>(null)
```

### 2.3 Agregar useEffect para auto-scroll

```typescript
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({
      behavior: isFirstLoad ? 'instant' : 'smooth'
    })
  }
  setIsFirstLoad(false)
}, [messages])
```

### 2.4 Agregar div invisible al final del contenedor de mensajes

```tsx
<div className="flex-1 overflow-y-auto p-4 space-y-4">
  {messages.map((msg, idx) => (...))}
  <div ref={messagesEndRef} />
</div>
```

---

## 3. Component Location

El contenedor de mensajes está en la línea ~179-236 de AssistantSheet.tsx:

```tsx
<div className="flex-1 overflow-y-auto p-4 space-y-4">
  {messages.map((msg, idx) => (...))}
  {/* Agregar div aquí */}
  <div ref={messagesEndRef} />
</div>
```

---

## 4. Flow Diagram

```
1. Chat se abre → isFirstLoad = true
2. messages se actualiza
3. useEffect dispara scrollIntoView con behavior: 'instant'
4. setIsFirstLoad(false)

5. Nuevo mensaje llega → messages cambia
6. useEffect dispara scrollIntoView con behavior: 'smooth'
7. isFirstLoad ya es false → sigue smooth
```

---

## 5. Implementation Details

### State inicial:
```typescript
const [isFirstLoad, setIsFirstLoad] = useState(true)
```

### useEffect deps:
```typescript
useEffect(() => {
  // scroll logic
}, [messages]) // Solo cuando messages cambian
```

### El div invisible:
```tsx
<div ref={messagesEndRef} className="h-0" />
```

---

## 6. Testing Checklist

- [ ] Al abrir chat, scroll instantáneo al final
- [ ] Al enviar mensaje, scroll suave al final
- [ ] Al recibir respuesta de IA, scroll suave al final
- [ ] No hay scroll manual requerido
- [ ] Build pasa