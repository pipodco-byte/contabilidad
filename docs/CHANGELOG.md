# Changelog — Copilot V2

**Versión:** 2.0
**Fecha:** Abril 2026
**Cambios principales:** Voice input, Image upload, CSV generation, localStorage persistence, Delete chat

---

## V2.0 (Abril 2026)

### Nuevas Features

#### 1. Voice Input (Mic Button)
- Botón de micrófono en el input del chat
- Usa Web Speech API del navegador
- Estados: idle, listening, disabled
- Si el navegador no soporta Web Speech API, el botón aparece deshabilitado

#### 2. Image Upload (Screenshots)
- Botón para subir imágenes/screenshot bancarios
- Preview de imagen adjunta
- Extracción de datos: monto, fecha, medio_pago, referencia
- Formato compatible para enviar al chat

#### 3. CSV Generation (Compatible con Gema)
- Comando: "Dame el CSV", "Genera CSV", "Exportar CSV"
- Formato:
  ```
  DD/MM/YYYY;descripcion;categoria;sub_categoria;monto;tipo;medio_pago;estado_iva[;comentarios]
  ```
- Sin headers (para copiar y pegar en botón Gema)
- Muestra transacciones del día

#### 4. localStorage Persistence
- Chat persiste en localStorage del navegador
- Límite: 40 mensajes (20 exchanges)
- Al recargar,Restore mensajes previos
- Borra automáticamente oldest al alcanzar límite

#### 5. Delete Chat
- Botón 🗑️ en header del sheet
- Confirmación antes de borrar
- Toast notification: "Historial eliminado"

#### 6. Auto-Reset After INSERT
- Después de INSERT exitoso, muestra "¿Nueva transacción?"
- Mantiene contexto limpio para siguientes transacciones

### Archivos Nuevos
- `src/lib/voice-utils.ts` — Web Speech API wrapper
- `src/components/assistant/AssistantMicButton.tsx` — Mic button component
- `src/components/assistant/ImageUpload.tsx` — Image upload component
- `src/lib/image-extract.ts` — Regex patterns para extraer datos de screenshots

### Modificados
- `src/hooks/useAssistantChat.ts` — Añadido requestCSV, localStorage, detectCSV
- `src/components/assistant/AssistantSheet.tsx` — Mic button, Image button, Delete button, Confirmation modal

---

## V1.0 (Anterior)

- FAB bottom-right para activar asistente
- Sheet lateral derecho con chat stateful
- Sidebar colapsa a 64px cuando asistente está activo
- API route usa DeepSeek en lugar de Gemini
- react-markdown para renderizar formato (bold, italic, tables, blockquotes)

---

## Formato CSV (Compatibilidad Gema)

El CSV generado es **100% compatible** con el botón "Gema" en Configuración.

### Formato exacto:
```
DD/MM/YYYY;descripcion;categoria;sub_categoria;monto;tipo;medio_pago;estado_iva[;comentarios]
```

### Ejemplo:
```
24/04/2026;Venta iPhone 15 Pro Max;Venta Equipos Nuevos;iPhones;5800000;Ingreso;Bold;Exento;Cliente nuevo
```

### Campos:
| # | Campo | Ejemplo |
|---|-------|---------|
| 1 | fecha | 24/04/2026 |
| 2 | descripcion | Venta iPhone 15 Pro Max |
| 3 | categoria | Venta Equipos Nuevos |
| 4 | sub_categoria | iPhones |
| 5 | monto | 5800000 (sin decimales) |
| 6 | tipo | Ingreso |
| 7 | medio_pago | Bold |
| 8 | estado_iva | Exento |
| 9 | comentarios | Cliente nuevo (opcional) |

---

## Notas Importantes

- **Solo español** — Copilot responde solo en español
- **Sin Supabase** — Persistencia solo en localStorage (ese navegador)
- **No edita transacciones** — Solo registra nuevas
- **No alertas** — No hay notificaciones push