# Chat Input Enhancement - Task Breakdown

## Meta
Mejorar el input del Copilot con textarea dinámico y Enter para enviar.

---

## T1: Agregar ref y useEffect de altura dinámica
**Archivo:** `src/components/assistant/AssistantSheet.tsx`
**Status:** Pending

**Descripción:**
1. Agregar `textareaRef` con useRef
2. Agregar useEffect que ajusta altura basado en scrollHeight

**Checklist:**
- [ ] Agregar `const textareaRef = useRef<HTMLTextAreaElement>(null)`
- [ ] Agregar useEffect con adjustHeight logic

---

## T2: Agregar handler onKeyDown
**Archivo:** `src/components/assistant/AssistantSheet.tsx`
**Status:** Pending

**Descripción:**
Agregar handler para Enter (enviar) y Shift+Enter (nueva línea).

**Checklist:**
- [ ] Agregar `handleKeyDown` function
- [ ] Enter sin shift → handleSend()
- [ ] Enter con shift → default behavior (nueva línea)

---

## T3: Cambiar input a textarea
**Archivo:** `src/components/assistant/AssistantSheet.tsx`
**Status:** Pending

**Descripción:**
Reemplazar el `<input>` por `<textarea>` con las nuevas props.

**Checklist:**
- [ ] Cambiar `<input>` a `<textarea>`
- [ ] Agregar `ref={textareaRef}`
- [ ] Agregar `onKeyDown={handleKeyDown}`
- [ ] Agregar `rows={1}`
- [ ] Actualizar className con min-h, max-h, resize-none

---

## T4: Build & TypeCheck
**Dependencias:** T1, T2, T3
**Status:** Pending

**Descripción:**
Verificar que build pasa.

**Checklist:**
- [ ] `npm run build` pasa
- [ ] No hay errores de TypeScript

---

## T5: Verify
**Dependencias:** T4
**Status:** Pending

**Descripción:**
Verificar manualmente los criterios de éxito.

**Checklist:**
- [ ] Textarea inicia pequeño
- [ ] Crece mientras escribo
- [ ] Scroll si excede 160px
- [ ] Enter envía
- [ ] Shift+Enter nueva línea

---

## T6: Commit (sin push)
**Dependencias:** T5
**Status:** Pending

**Descripción:**
Commit sin push.

**Checklist:**
- [ ] git add -A
- [ ] git commit
- [ ] No git push

---

## Orden de ejecución

```
T1 → T2 → T3 → T4 → T5 → T6
```