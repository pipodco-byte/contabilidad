# Mic No Auto-Send - Task Breakdown

## Meta
El Mic botón SOLO detiene la grabación, no envía automáticamente.
El usuario tiene control total: revisa/edita y luego envía con Enter.

---

## T1: Update voice-utils.ts - onend clean
**Archivo:** `src/lib/voice-utils.ts`
**Status:** Pending

**Descripción:**
onend solo hace setIsListening(false), no llama a ningún callback.

**Checklist:**
- [ ] onend solo hace setIsListening(false)
- [ ] No hay onTranscript callback

---

## T2: Update AssistantMicButton.tsx - remove auto-send
**Archivo:** `src/components/assistant/AssistantMicButton.tsx`
**Status:** Pending

**Descripción:**
Remover onTranscript del flujo de detener.

**Checklist:**
- [ ] handleClick solo llama stopListening cuando está listening
- [ ] NO llama a onTranscript(finalText)
- [ ] resetTranscript si hay texto para limpiar después de enviar (en otro lugar)

---

## T3: Build & TypeCheck
**Dependencias:** T1, T2
**Status:** Pending

**Descripción:**
Verificar build pasa.

**Checklist:**
- [ ] npm run build pasa
- [ ] No hay errores TypeScript

---

## T4: Verify Manual
**Dependencias:** T3
**Status:** Pending

**Descripción:**
Verificar manualmente que el fix funciona.

**Checklist:**
- [ ] Hablar → texto aparece en textarea
- [ ] Dejar de hablar → mic se apaga
- [ ] Texto QUEDA en textarea
- [ ] Puedo editar el texto
- [ ] Enter envía el mensaje
- [ ] Botón Send envía el mensaje
- [ ] NO hay auto-send

---

## T5: Commit (sin push)
**Dependencias:** T4
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
T1 → T2 → T3 → T4 → T5
```