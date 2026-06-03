# Tasks: IA Strategy Minimalist Redesign

## Change: `ia-strategy-minimalist-redesign`

---

## Phase: Apply

---

## T1: Refactor Layout Principal (page.tsx)

**Archivo:** `src/app/dashboard/ia-strategy/page.tsx`

**Cambios:**
1. Cambiar distribución de `flex h-full w-full` con hijos `flex-1` y `w-[380px]` a:
   - Chat: `flex-[0.65] min-w-0` (65% flexible)
   - DataPanel: `w-[380px] flex-shrink-0` (ancho fijo, no se encoge)
2. Eliminar `border-r border-border` del contenedor del chat (ya no es necesario, el panel tiene su propio estilo)
3. Verificar que el contenedor del chat siga siendo `flex flex-col`

**Antes:**
```tsx
<div className="flex h-full w-full">
  <div className="flex-1 border-r border-border flex flex-col">
    <ChatWorkspace ... />
  </div>
  <DataPanel ... />
</div>
```

**Después:**
```tsx
<div className="flex h-full w-full">
  <div className="flex-[0.65] min-w-0 flex flex-col">
    <ChatWorkspace ... />
  </div>
  <DataPanel ... />
</div>
```

**Verificación:** Navegar a `/dashboard/ia-strategy` y confirmar que el chat ocupa más espacio que el panel.

---

## T2: Minimalizar Header (ChatWorkspace.tsx)

**Archivo:** `src/components/strategy/ChatWorkspace.tsx`

**Cambios:**
1. Eliminar contenedor con `border-b border-border`
2. Reducir padding a `px-6 py-3`
3. Header alineado al centro (`justify-center`) en lugar de `items-center gap-2`
4. Eliminar fondo separado (hereda del workspace)
5. Mantener icono + título pero más sutil

**Antes:**
```tsx
<div className="flex items-center gap-2 px-6 py-4 border-b border-border">
  <Sparkles className="h-5 w-5 text-violet-400" />
  <h1 className="text-lg font-semibold text-foreground">Asesor Estratégico Gema</h1>
</div>
```

**Después:**
```tsx
<div className="flex items-center justify-center gap-2 px-6 py-3">
  <Sparkles className="h-5 w-5 text-violet-400" />
  <h1 className="text-lg font-semibold text-foreground">Asesor Estratégico Gema</h1>
</div>
```

**Verificación:** El header debe verse "flotante" sin borde inferior.

---

## T3: Rediseñar Chat y Mensajes (StrategyChat.tsx)

**Archivo:** `src/components/strategy/StrategyChat.tsx`

**Cambios:**

### 3.1: Eliminar contenedor card de mensajes
**Antes:**
```tsx
<div className="bg-card border rounded-lg p-3 space-y-3 max-h-64 overflow-y-auto">
```
**Después:**
```tsx
<div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
```

### 3.2: Aumentar espaciado y aire
- Cambiar `space-y-3` a `space-y-6` entre mensajes
- Aumentar padding del contenedor a `px-4 py-4`
- Eliminar `max-h-64` (dejar que ocupe el espacio disponible con `flex-1`)

### 3.3: Rediseñar input
**Antes:**
```tsx
<div className="flex gap-2">
  <StrategyVoiceButton ... />
  <textarea
    className="flex-1 px-4 py-3 min-h-[44px] max-h-40 bg-input border border-border rounded-xl ..."
  />
  <Button onClick={handleSend} ...>
    <Send className="h-4 w-4" />
  </Button>
</div>
```

**Después:**
```tsx
<div className="px-4 py-3">
  <div className="flex items-end gap-2 rounded-2xl bg-muted/30 border border-border/20 p-2 focus-within:ring-1 focus-within:ring-primary/20">
    <StrategyVoiceButton 
      disabled={isLoading}
      onTranscript={handleVoiceTranscript}
      onError={handleVoiceError}
    />
    <textarea
      ref={textareaRef}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="¿Cuánto puedo gastar?"
      disabled={isLoading}
      rows={1}
      className="flex-1 px-3 py-2 min-h-[44px] max-h-40 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:opacity-50 transition-all resize-none overflow-y-auto"
    />
    <Button 
      onClick={handleSend} 
      disabled={isLoading || !input.trim()}
      size="icon"
      className="rounded-full h-9 w-9 shrink-0"
    >
      <Send className="h-4 w-4" />
    </Button>
  </div>
</div>
```

### 3.4: Ajustar estado vacío y loading
**Estado vacío:**
```tsx
<p className="text-sm text-muted-foreground text-center py-12">
  Pregunta sobre tu estrategia de negocio...
</p>
```

**Loading:**
```tsx
<div className="flex items-center gap-2 text-muted-foreground py-4">
  <Loader2 className="h-4 w-4 animate-spin" />
  <span className="text-sm">Pensando...</span>
</div>
```

### 3.5: Eliminar mini chart del chat (si es visualmente ruidoso)
El `StrategyMiniChart` en el chat puede ser removido o movido al panel derecho. Para este rediseño, **eliminarlo** del chat:

```tsx
{/* Eliminar este bloque: */}
<div className="px-4 py-3 border-b border-border">
  <StrategyMiniChart data={[]} />
</div>
```

**Verificación:** 
- Enviar mensaje y verificar que el input se ve limpio y redondeado
- Verificar que el botón de envío es circular
- Confirmar que no hay bordes pesados en el área de mensajes

---

## T4: Aumentar Espaciado en Mensajes (StrategyMessage.tsx)

**Archivo:** `src/components/strategy/StrategyMessage.tsx`

**Cambios:**
1. Aumentar padding interno de cada mensaje
2. Aumentar line-height para mensajes de la IA
3. Asegurar que las burbujas de mensaje no tengan bordes pesados

**Buscar y ajustar:**
- Si hay `py-2` → cambiar a `py-4`
- Si hay `space-y-2` → cambiar a `space-y-3`
- Agregar `leading-relaxed` o `leading-7` al contenido de mensajes de assistant

**Verificación:** Mensajes deben sentirse "respirables" con espacio entre líneas.

---

## T5: Suavizar Panel Derecho (DataPanel.tsx)

**Archivo:** `src/components/strategy/DataPanel.tsx`

**Cambios:**
1. Eliminar `border-l border-border` como separador principal
2. Usar fondo ligeramente diferente para crear jerarquía
3. Aumentar padding a `p-5`

**Antes:**
```tsx
<div
  className={cn(
    'w-[380px] h-full border-l border-border',
    'bg-muted/10 overflow-y-auto'
  )}
>
```

**Después:**
```tsx
<div
  className={cn(
    'w-[380px] h-full',
    'bg-muted/5 overflow-y-auto'
  )}
>
```

**Verificación:** El panel debe verse integrado sin borde de separación agresivo.

---

## T6: Ajustar Contenedor Principal (ChatWorkspace.tsx)

**Archivo:** `src/components/strategy/ChatWorkspace.tsx`

**Cambios:**
1. El contenedor `max-w-3xl mx-auto` debe tener más padding horizontal (`px-8` en lugar de `px-6`)
2. Asegurar que el área de mensajes ocupe todo el espacio disponible (`flex-1`)

**Ajustar:**
```tsx
<div className="h-full max-w-3xl mx-auto px-8 py-4 flex flex-col">
```

**Verificación:** Contenido centrado con buen margen lateral.

---

## T7: Build y Verificación Final

**Comandos:**
```bash
npm run build
```

**Verificaciones manuales:**
1. Navegar a `/dashboard/ia-strategy`
2. Verificar layout asimétrico (chat más ancho que panel)
3. Enviar mensaje de prueba
4. Verificar que el input es redondeado y limpio
5. Verificar que el panel derecho muestra métricas
6. Probar voice input
7. Probar eliminar chat
8. Verificar responsive (reducir ancho de ventana)

---

## Files Summary

| Archivo | Cambio |
|---------|--------|
| `src/app/dashboard/ia-strategy/page.tsx` | Layout asimétrico 65/35 |
| `src/components/strategy/ChatWorkspace.tsx` | Header sin borde, más padding |
| `src/components/strategy/StrategyChat.tsx` | Input rediseñado, messages sin card, eliminar mini chart |
| `src/components/strategy/StrategyMessage.tsx` | Más espaciado, mejor line-height |
| `src/components/strategy/DataPanel.tsx` | Sin border-l, bg más sutil |

---

## Checklist

- [ ] T1: Layout asimétrico implementado
- [ ] T2: Header minimalista
- [ ] T3: Input estilo ChatGPT
- [ ] T3: Messages sin contenedor card
- [ ] T3: StrategyMiniChart eliminado del chat
- [ ] T4: Espaciado aumentado en mensajes
- [ ] T5: Panel derecho suavizado
- [ ] T6: Padding ajustado en workspace
- [ ] T7: Build exitoso
- [ ] T7: Funcionalidad completa verificada
