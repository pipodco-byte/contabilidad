# Mic Visual & UX Fix - Task Breakdown

## Meta
1. Reemplazar `animate-pulse` rojo feo por wave animation custom
2. Mostrar transcript en tiempo real en el input para edición antes de enviar

---

## T1: Modificar voice-utils.ts - Agregar interimTranscript
**Archivo:** `src/lib/voice-utils.ts`
**Status:** Pending

**Descripción:**
Separar finalTranscript e interimTranscript para poder mostrar el texto provisional en el input.

**Checklist:**
- [ ] Renombrar transcript state a `finalTranscript`
- [ ] Agregar `interimTranscript` state
- [ ] Actualizar onresult para separar final vs interim
- [ ] Agregar `interimTranscript` al return object

---

## T2: Modificar AssistantMicButton.tsx - Wave Animation + Props
**Archivo:** `src/components/assistant/AssistantMicButton.tsx`
**Status:** Pending

**Descripción:**
1. Agregar CSS para wave animation
2. Agregar props `currentInput` y `onInterimChange`
3. Cuando está escuchando, actualizar el input con interim results

**Checklist:**
- [ ] Agregar estilo CSS para wave animation
- [ ] Agregar props `currentInput?: string` y `onInterimChange?: (text: string) => void`
- [ ] useEffect que llama `onInterimChange` con `currentInput + interimTranscript`
- [ ] Cambiar className de `animate-pulse` a `mic-recording` (wave)
- [ ] Quitar el icono duplicado (líneas 62-66)

---

## T3: Modificar AssistantSheet.tsx - Integrar input state
**Archivo:** `src/components/assistant/AssistantSheet.tsx`
**Status:** Pending

**Descripción:**
Pasar el input state actual al mic button y actualizar cuando llega interim.

**Checklist:**
- [ ] Agregar state `inputValue` (si no existe) o verificar que existe
- [ ] Pasar `currentInput={inputValue}` al AssistantMicButton
- [ ] Pasar `onInterimChange={(text) => setInputValue(text)}`
- [ ] Verificar que el Input tiene `value={inputValue}` y `onChange` normal

---

## T4: Build & TypeCheck
**Dependencias:** T1, T2, T3
**Status:** Pending

**Descripción:**
Verificar que todo compila.

**Checklist:**
- [ ] `npm run build` pasa
- [ ] No hay errores de TypeScript

---

## T5: Commit (sin push)
**Dependencias:** T4
**Status:** Pending

**Descripción:**
Commit los cambios en develop, sin push.

**Checklist:**
- [ ] git add -A
- [ ] git commit con mensaje descriptivo
- [ ] Sin git push

---

## Orden de ejecución

```
T1 (voice-utils) → T2 (MicButton) → T3 (Sheet) → T4 (Build) → T5 (Commit)
```

---

## Notas

- Fix UX优先级高 - el usuario necesita poder editar antes de enviar
- Wave animation es visual solamente - debería ser suave, no agresivo
- El input ahora funciona COMO input normal además de recibir voice
- El usuario tiene CONTROL total sobre el texto final