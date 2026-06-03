# Proposal: IA Strategy Minimalist Redesign

## Change: `ia-strategy-minimalist-redesign`

---

## 1. Intent

Rediseñar la interfaz de `/dashboard/ia-strategy` para adoptar un estética **minimalista tipo ChatGPT** — limpia, centrada, con énfasis en el contenido y espacio negativo — mientras se **preserva el panel de datos derecho** que el usuario considera valioso.

---

## 2. Scope

### In Scope
- Refactor del layout principal (`page.tsx`) para distribución asimétrica chat/panel
- Rediseño del área de chat (`ChatWorkspace.tsx`, `StrategyChat.tsx`)
  - Input estilo ChatGPT (flotante, redondeado, sin bordes pesados)
  - Mensajes con más espaciado y tipografía limpia
  - Header minimalista (icono + título sin caja contenedora)
- Suavizado del `DataPanel` (menos bordes visuales, integración más orgánica)
- Mejoras de espaciado y jerarquía visual

### Out of Scope
- Funcionalidad del chat (lógica de mensajes, API calls, voice input)
- Contenido del DataPanel (métricas, gráficos, metas)
- Persistencia de chat (localStorage)
- Navegación o sidebar

---

## 3. Approach

### Layout: "Focused Workspace"
- **Chat**: 65-70% del ancho, contenido centrado con `max-w-3xl` (~768px) para legibilidad
- **Panel**: 30-35% fijo, integrado sin bordes agresivos
- Separación sutil mediante `bg-muted/5` en lugar de `border-l` pesado

### Estética Minimalista
- **Bordes**: Reducir a `border-border/50` o eliminar donde sea posible
- **Sombras**: Ninguna en contenedores principales (flat design)
- **Input**: Estilo "pill" o redondeado amplio (`rounded-2xl`), sin fondo de input visible (`bg-transparent` o `bg-muted/20`)
- **Espaciado**: Incrementar `py` entre mensajes de 12px a 20-24px
- **Tipografía**: Mantener tamaños actuales pero con mejor `line-height` (1.6-1.7)

### Panel Derecho (Preservado)
- Mantener ancho de ~380px
- Suavizar separador: de `border-l border-border` a `bg-muted/5` o separación por espacio
- Fondo ligeramente diferente (`bg-background` vs `bg-muted/10`) para jerarquía sutil

---

## 4. Files to Modify

| File | Change |
|------|--------|
| `src/app/dashboard/ia-strategy/page.tsx` | Asymmetric flex ratio (chat 65% / panel 35%) |
| `src/components/strategy/ChatWorkspace.tsx` | Remove header box, increase max-width spacing |
| `src/components/strategy/StrategyChat.tsx` | Redesign input, message spacing, remove card container |
| `src/components/strategy/StrategyMessage.tsx` | Increase spacing, cleaner bubbles |
| `src/components/strategy/DataPanel.tsx` | Soften borders, subtler background |

---

## 5. Risks

| Risk | Mitigation |
|------|------------|
| Panel derecho se sienta "aplastado" con más espacio para chat | Probar 65/35, ajustar a 60/40 si es necesario |
| Input flotante puede tapar últimos mensajes | Asegurar `pb-24` o similar en contenedor de mensajes |
| Menos bordes = menos jerarquía visual | Usar diferencias de fondo (`bg-background` vs `bg-muted/5`) |

---

## 6. Success Criteria

- [ ] Chat se siente "aireado" y centrado, no estirado
- [ ] Input se parece estéticamente al de ChatGPT/Claude
- [ ] Panel derecho sigue siendo legible y útil
- [ ] Sin funcionalidad rota (chat, voice, delete, etc.)
- [ ] Build pasa sin errores
