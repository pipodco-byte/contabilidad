# Proposal: Copilot V2 — Voice + Analytics + Image Extract

## Intent

Extender el asistente Copilot con capacidades de voz, análisis de datos, y extracción de datos de imágenes (screenshots bancarios). Mantener la simplicidad del chat sin persistencia en servidor.

## Scope

### In Scope (V2)
- Voice input (microphone button → speech to text)
- Analytics chat ("Dame el resumen de febrero", "Total de ventas Bold")
- Image Upload + Extract (subir screenshot → extraer monto, fecha, medio_pago, referencia)
- CSV generation ("Dame el CSV de hoy")
- Auto-reset after INSERT (nueva sesión después de registrar)
- Persistencia localStorage (últimos 20 exchanges = 40 mensajes)
- Delete chat con confirmación + toast
- Solo idioma: Español

### Out of Scope
- Persistencia en Supabase
- Edición de transacciones via chat
- Alertas/notificaciones push
- Multi-idioma
- Export PDF

## UX Decisions

### Decision: localStorage over Supabase

**Choice:** localStorage para persistencia de chat
**Rationale:**
- Más simple, sin backend adicional
- Solo ese browser (no compartida entre dispositivos)
- Sin costo, sin riesgo de datos sensibles en servidor
- Límite de 40 mensajes elimina problemas de alucinaciones

### Decision: 20 Exchanges Limit (40 mensajes)

**Choice:** 20 exchanges in localStorage
**Rationale:**
- Suficiente para conversaciones de un día
- Límite mantiene performance sin alucinaciones
- Auto-reset after INSERT evita saturación

### Decision: Image Extract - Screenshots Bancarios

**Choice:** Subir imagen → extraer datos → PreVizCard
**Data extraído del screenshot:**
- monto: "$150.000" → 150000
- fecha: "13 de abril de 2026" → 13/04/2026
- medio_pago: "DaviPlata / Nequi / Bre-B"
- referencia: "252476" → auto en descripción

**Defaults para screenshots:**
- tipo: Ingreso (asumimos que les pagaron)
- descripcion: "Ref: [número_aprobación]"
- estado: Exitosa (no se pregunta)

**Usuario debe confirmar:**
- categoria: Dropdown (requerido)
- estado_iva: Dropdown (Exento/Incluido/Externo)

### Decision: Auto-Reset After INSERT

**Choice:** Después de INSERT exitoso → limpiar chat
**Rationale:**
- Evita que el chat se llene rápido
- Mantiene contexto limpio para siguiente transacción
- Token savings (menos contexto acumulado)

### Decision: CSV Option

**Choice:** "Dame el CSV" genera texto plano sin contexto
**Rationale:**
- Gasta menos tokens que mantener conversación
- Usuario puede copiar y usar en otros sistemas
- Formato: DD/MM/YYYY;descripcion;categoria;monto;tipo;medio_pago

## Technical Approach

### Voice Input
- Browser Web Speech API (`SpeechRecognition`)
- Button states: idle, listening, processing
- Fallback: si browser no soporta, button disabled

### Analytics Chat
```
Usuario: "¿Total de ventas en febrero?"
→ detect keyword "resumen", "total", "mes", "año"
→ query useResumen / useGraficas
→ format response como markdown
→ display en Copilot chat
```

### Image Extract
```
Usuario: [sube screenshot]
→ Copilot extrae: monto, fecha, medio_pago, referencia
→ PreVizCard con datos extraídos
→ Usuario selecciona: categoria + IVA
→ Confirmar → INSERT → auto-reset
```

### CSV Generation
```
Usuario: "Dame el CSV de hoy"
→ query transacciones del día
→ format: DD/MM/YYYY;descripcion;categoria;monto;tipo;medio_pago
→ display en chat (sin guardar en contexto)
```

## File Structure (V2 additions)

```
src/
├── components/assistant/
│   ├── AssistantInput.tsx       # Modified: mic + image buttons
│   ├── AssistantMicButton.tsx  # NEW: voice input
│   └── ImageUpload.tsx         # NEW: screenshot upload
├── hooks/
│   ├── useCopilotHistory.ts    # NEW: localStorage persistence
│   └── useAssistantChat.ts     # Modified: auto-reset, image handling
└── lib/
    └── voice-utils.ts          # NEW: Web Speech API wrapper
```

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `AssistantSheet` | Modified | Add delete button, image handling |
| `AssistantInput` | Modified | Add mic + image buttons |
| `useAssistantChat` | Modified | Auto-reset, image extract handling |
| `docs/CHANGELOG.md` | Created | V2 release notes |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Browser no soporta Web Speech API | Low | Button disabled, fallback to text |
| Image extract falla | Medium | Mostrar datos extras como "comentarios" |
| localStorage lleno | Low | Auto-reset after INSERT + límite 40 msgs |

## Rollback Plan

1. Remover voice button
2. Remover image upload
3. Remover localStorage hook
4. Deshabilitar auto-reset
5. Restaurar a V1 sin features nuevas

## Dependencies

- `react-markdown` (ya instalado)
- `remark-gfm` (ya instalado)
- Ninguna adicional

## Success Criteria

- [ ] Mic button visible en input (si browser soporta)
- [ ] Click mic → speech recognition start/stop
- [ ] Analytics keywords triggers data fetch
- [ ] Image upload shows preview + extract data
- [ ] CSV generation works
- [ ] Auto-reset after INSERT exitoso
- [ ] Chat persists en localStorage (40 mensajes max)
- [ ] Delete button works with confirmation + toast
- [ ] Build pasa sin errores
- [ ] Solo español

## V2 Release Checklist

- [ ] Voice input button (Web Speech API)
- [ ] Analytics detection ("resumen", "total", "mes")
- [ ] Image upload + extract (monto, fecha, medio_pago, referencia)
- [ ] CSV generation
- [ ] Auto-reset after INSERT
- [ ] localStorage hook (40 mensajes)
- [ ] Delete chat button + confirmation
- [ ] Docs: CHANGELOG.md