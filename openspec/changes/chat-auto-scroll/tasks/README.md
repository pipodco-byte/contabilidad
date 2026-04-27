# Chat Auto-Scroll - Task Breakdown

## Meta
Implementar auto-scroll en el chat para que siempre se vea el último mensaje.

---

## T1: Implementar scroll en AssistantSheet
**Archivo:** `src/components/assistant/AssistantSheet.tsx`
**Status:** Pending

**Descripción:**
1. Agregar `isFirstLoad` state
2. Agregar `messagesEndRef` useRef
3. Agregar useEffect con scrollIntoView
4. Agregar div invisible al final del contenedor de mensajes

**Checklist:**
- [ ] Agregar `const [isFirstLoad, setIsFirstLoad] = useState(true)`
- [ ] Agregar `const messagesEndRef = useRef<HTMLDivElement>(null)`
- [ ] Agregar useEffect con scrollIntoView
- [ ] Agregar div con ref al final del contenedor de mensajes

---

## T2: Build & TypeCheck
**Dependencias:** T1
**Status:** Pending

**Descripción:**
Verificar build pasa.

**Checklist:**
- [ ] npm run build pasa
- [ ] No hay errores de TypeScript

---

## T3: Verify
**Dependencias:** T2
**Status:** Pending

**Descripción:**
Verificar manualmente.

**Checklist:**
- [ ] Abrir chat → scroll instantáneo al final
- [ ] Enviar mensaje → scroll suave al final
- [ ] Recibir respuesta IA → scroll suave al final
- [ ] No necesito scroll manual

---

## T4: Commit (sin push)
**Dependencias:** T3
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
T1 → T2 → T3 → T4
```