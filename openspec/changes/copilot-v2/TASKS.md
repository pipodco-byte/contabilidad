# Tasks: Copilot V2 — Implementation Checklist

## Phase 1: Voice Input

### 1.1 Create voice-utils.ts
- [ ] 1.1.1 Create `src/lib/voice-utils.ts`
- [ ] 1.1.2 Wrap SpeechRecognition API
- [ ] 1.1.3 Handle browser compatibility
- [ ] 1.1.4 Export `useSpeechRecognition` hook

### 1.2 Create AssistantMicButton
- [ ] 1.2.1 Create `src/components/assistant/AssistantMicButton.tsx`
- [ ] 1.2.2 States: idle, listening, disabled
- [ ] 1.2.3 Animation: pulse when listening
- [ ] 1.2.4 onTranscript callback

### 1.3 Modify AssistantInput
- [ ] 1.3.1 Add mic button left of input
- [ ] 1.3.2 Connect to useSpeechRecognition
- [ ] 1.3.3 Insert transcript into input field

---

## Phase 2: Analytics Chat

### 2.1 Create Analytics Keywords
- [ ] 2.1.1 Define keywords array: ["resumen", "total", "mes", "año", "balance"]
- [ ] 2.1.2 Create detection function
- [ ] 2.1.3 Export from assistant-utils.ts

### 2.2 Modify useAssistantChat
- [ ] 2.2.1 Detect analytics keywords in user message
- [ ] 2.2.2 If detected: call appropriate hook (useResumen, useGraficas)
- [ ] 2.2.3 Format response as markdown table
- [ ] 2.2.4 Display in chat as assistant message

---

## Phase 3: Image Upload + Extract

### 3.1 Create image-extract.ts
- [ ] 3.1.1 Create `src/lib/image-extract.ts`
- [ ] 3.1.2 Regex for monto: `\$?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)`
- [ ] 3.1.3 Regex for fecha: `(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})`
- [ ] 3.1.4 Regex for referencia: `n[úu]mero\s+de\s+aprobaci[óo]n:?\s*(\d+)`
- [ ] 3.1.5 Regex for medio_pago: `(daviplata|nequi|bre-b|davivienda|efectivo)`
- [ ] 3.1.6 Export function: `extractDataFromScreenshot(text)`

### 3.2 Create ImageUpload Component
- [ ] 3.2.1 Create `src/components/assistant/ImageUpload.tsx`
- [ ] 3.2.2 Button with image icon
- [ ] 3.2.3 File picker (accept="image/*")
- [ ] 3.2.4 Preview thumbnail in chat
- [ ] 3.2.5 Max size: 5MB validation

### 3.3 Integrate into AssistantInput/Sheet
- [ ] 3.3.1 Add image button next to mic
- [ ] 3.3.2 Handle image selection
- [ ] 3.3.3 Call extractDataFromScreenshot
- [ ] 3.3.4 Show PreVizCard with extracted data
- [ ] 3.3.5 Ask for categoria + IVA

### 3.4 Default Values for Screenshots
- [ ] 3.4.1 tipo: "Ingreso" (default)
- [ ] 3.4.2 descripcion: "Ref: [referencia]"
- [ ] 3.4.3 estado: "Exitosa"

---

## Phase 4: CSV Generation

### 4.1 Add CSV Keywords
- [ ] 4.1.1 Define CSV keywords: ["csv", "dame el csv", "genera csv", "descargar csv"]
- [ ] 4.1.2 Add to detection function

### 4.2 Implement CSV Generation
- [ ] 4.2.1 Fetch transacciones del período (hoy/semana/mes)
- [ ] 4.2.2 Format as CSV (no headers)
- [ ] 4.2.3 Display in chat as code block
- [ ] 4.2.4 No context saved (standalone response)

---

## Phase 5: Auto-Reset After INSERT

### 5.1 Modify useAssistantChat
- [ ] 5.1.1 After successful INSERT in handleConfirm
- [ ] 5.1.2 Show message: "✅ Registrada. ¿Nueva transacción?"
- [ ] 5.1.3 Optional: clear messages or show "Nueva sesión" button

### 5.2 Add Nueva Sesión Button
- [ ] 5.2.1 Add button in sheet header after close button
- [ ] 5.2.2 Click → clear messages + clear localStorage
- [ ] 5.2.3 Show greeting again

---

## Phase 6: localStorage Persistence (20 exchanges = 40 mensajes)

### 6.1 Create useCopilotHistory Hook
- [ ] 6.1.1 Create `src/hooks/useCopilotHistory.ts`
- [ ] 6.1.2 localStorage key: "copilot_history"
- [ ] 6.1.3 Methods: save, load, clear
- [ ] 6.1.4 Limit: 40 items (20 exchanges)
- [ ] 6.1.5 JSON serialize/deserialize

### 6.2 Integrate into useAssistantChat
- [ ] 6.2.1 On send: save to localStorage via useCopilotHistory
- [ ] 6.2.2 On mount: load history from localStorage
- [ ] 6.2.3 On clear: reset messages + clear localStorage

---

## Phase 7: Delete Chat + Notification

### 7.1 Add Delete Button to Sheet Header
- [ ] 7.1.1 Add 🗑️ button in header (next to X close)
- [ ] 7.1.2 Click → show confirmation dialog

### 7.2 Create Confirmation Dialog
- [ ] 7.2.1 Title: "¿Borrar historial?"
- [ ] 7.2.2 Description: "Se eliminará toda la conversación"
- [ ] 7.2.3 Buttons: [Cancelar] [Borrar] (red)
- [ ] 7.2.4 Cancel → close dialog
- [ ] 7.2.5 Borrar → clear + close + toast notification

### 7.3 Add Toast Notification
- [ ] 7.3.1 After delete: "Historial eliminado"
- [ ] 7.3.2 Show via existing toast system (sonner)

---

## Phase 8: Cleanup + Testing

### 8.1 Remove Unused Code
- [ ] 8.1.1 Remove any V1 temporary code
- [ ] 8.1.2 Clean up imports

### 8.2 Build Test
- [ ] 8.2.1 `npm run build` passes
- [ ] 8.2.2 No TypeScript errors
- [ ] 8.2.3 No lint errors

### 8.3 Manual Testing
- [ ] 8.3.1 Voice input works (Chrome)
- [ ] 8.3.2 Image upload + extract works
- [ ] 8.3.3 CSV generation works
- [ ] 8.3.4 Analytics keywords trigger data
- [ ] 8.3.5 Auto-reset after INSERT
- [ ] 8.3.6 History persists after close/reopen
- [ ] 8.3.7 Delete clears everything

---

## Phase 9: Documentation

### 9.1 Create CHANGELOG.md
- [ ] 9.1.1 Create `docs/CHANGELOG.md`
- [ ] 9.1.2 Document V2 features added
- [ ] 9.1.3 Document V1 unchanged

---

## Dependencies

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9
```

## Success Criteria

- [ ] Mic button visible and functional
- [ ] Image upload + extract (monto, fecha, medio_pago, referencia)
- [ ] CSV generation works
- [ ] Analytics commands return data
- [ ] Auto-reset after INSERT
- [ ] Chat history persists in localStorage (40 mensajes max)
- [ ] Delete button works with confirmation + toast
- [ ] Build passes
- [ ] No Supabase changes
- [ ] Solo español
- [ ] No PDF export

---

## Files to Create

| File | Phase |
|------|-------|
| `src/lib/voice-utils.ts` | 1 |
| `src/components/assistant/AssistantMicButton.tsx` | 1 |
| `src/lib/image-extract.ts` | 3 |
| `src/components/assistant/ImageUpload.tsx` | 3 |
| `src/hooks/useCopilotHistory.ts` | 6 |
| `docs/CHANGELOG.md` | 9 |

## Files to Modify

| File | Phase |
|------|-------|
| `src/components/assistant/AssistantSheet.tsx` | 5, 7 |
| `src/components/assistant/AssistantInput.tsx` | 1, 3 |
| `src/hooks/useAssistantChat.ts` | 2, 4, 5, 6 |

## Nothing to Delete

V2 es completamente aditivo. No hay archivos V1 a eliminar.