# Spec: IA Strategy Minimalist Redesign

## Change: `ia-strategy-minimalist-redesign`

---

## 1. Overview

Rediseño visual de `/dashboard/ia-strategy` hacia estética minimalista tipo ChatGPT. El objetivo es reducir la carga visual, aumentar el espacio negativo, y hacer que el chat se sienta más "limpio" y centrado. El panel de datos derecho se preserva como funcionalidad clave.

---

## 2. Current State

```
┌─ dashboard/ia-strategy/page.tsx ─────────────────────────────┐
│ ┌──────────────────────────┐ ┌───────────────────────────┐│
│ │ ChatWorkspace            │ │ DataPanel (380px)         ││
│ │ ┌─────────────────────┐  │ │ ┌───────────────────────┐ ││
│ │ │ Header (border-b)   │  │ │ │ MetricsGrid           │ ││
│ │ ├─────────────────────┤  │ │ ├───────────────────────┤ ││
│ │ │ StrategyChat (card) │  │ │ │ TrendChart            │ ││
│ │ │ ┌─────────────────┐ │  │ │ ├───────────────────────┤ ││
│ │ │ │ Messages (tight)│ │  │ │ │ GoalsList             │ ││
│ │ │ ├─────────────────┤ │  │ │ └───────────────────────┘ ││
│ │ │ │ Input (border)  │ │  │ │                           ││
│ │ │ └─────────────────┘ │  │ │                           ││
│ │ └─────────────────────┘  │ │                           ││
│ └──────────────────────────┘ └───────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Problemas actuales:**
- Split exacto 50/50 sin max-width en el contenedor del chat
- Header con borde inferior que crea "caja" visual
- Chat dentro de una "card" (`bg-card border rounded-lg`) que lo encierra
- Input con bordes visibles y estilo tradicional de formulario
- Mensajes con poco espaciado vertical (py-3)
- Separador del panel derecho muy marcado (`border-l border-border`)

---

## 3. Target State

```
┌─ dashboard/ia-strategy/page.tsx ─────────────────────────────┐
│ ┌──────────────────────────────────┐ ┌────────────────────┐│
│ │ ChatWorkspace (flex-1, ~65%)     │ │ DataPanel (~35%)   ││
│ │                                  │ │  bg-muted/5        ││
│ │   ┌──────────────────────────┐   │ │ ┌────────────────┐ ││
│ │   │  ✨ Asesor Estratégico   │   │ │ │ MetricsGrid    │ ││
│ │   │     Gema               │   │ │ │ ├────────────────┤ ││
│ │   └──────────────────────────┘   │ │ │ TrendChart     │ ││
│ │                                  │ │ │ ├────────────────┤ ││
│ │   ┌──────────────────────────┐   │ │ │ GoalsList      │ ││
│ │   │                          │   │ │ └────────────────┘ ││
│ │   │  User message            │   │ │                    ││
│ │   │                          │   │ │                    ││
│ │   │      AI response         │   │ │                    ││
│ │   │      with more           │   │ │                    ││
│ │   │      line-height         │   │ │                    ││
│ │   │                          │   │ │                    ││
│ │   │                          │   │ │                    ││
│ │   │                          │   │ └────────────────────┘│
│ │   └──────────────────────────┘   ││
│ │                                  ││
│ │   ┌──────────────────────────┐   ││
│ │   │  [🎤]  Escribe...    [→] │   ││
│ │   └──────────────────────────┘   ││
│ │     (rounded-2xl, subtle bg)     ││
│ └──────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Requirements

### R1: Layout Asimétrico
- Chat debe ocupar ~65-70% del ancho (`flex-[0.65]` o similar)
- Panel derecho mantiene ~380px pero sin borde de separación pesado
- Contenedor del chat usa `max-w-3xl mx-auto` para evitar texto estirado

### R2: Header Minimalista
- Eliminar contenedor con `border-b`
- Icono + título centrados o alineados sutilmente
- Padding reducido (`py-3` en lugar de `py-4`)
- Sin fondo diferente (hereda del contenedor padre)

### R3: Chat Messages - Aireado
- Eliminar contenedor "card" (`bg-card border rounded-lg`)
- Mensajes directamente sobre el fondo del workspace
- Incrementar espaciado entre mensajes de `space-y-3` a `space-y-6`
- Aumentar padding interno de mensajes (`py-4` en lugar de `py-2`)
- `line-height` de 1.6 para textos de la IA
- Estados empty y loading con más aire

### R4: Input Estilo ChatGPT
- Contenedor del input: `rounded-2xl bg-muted/30 border-0` o `border-border/20`
- Textarea: sin borde visible (`border-0`), `bg-transparent`
- Foco: `ring-1 ring-primary/20` en lugar de `focus:border-primary/50`
- Altura mínima: `min-h-[52px]` (ligeramente más alto)
- Botón de enviar: `rounded-full` (círculo) con `bg-primary text-primary-foreground`
- Botón de voz: integrado dentro del input container, no fuera
- Layout: `[Voice] [Textarea .............] [Send]` en una sola fila

### R5: Panel Derecho - Integración Sutil
- Eliminar `border-l border-border` como separador principal
- Usar `bg-muted/5` o `bg-background` con sombra muy sutil (`shadow-sm`) para separar
- O alternativa: dejar que el espacio y el fondo ligeramente diferente creen la separación
- Mantener padding interno (`p-4` o `p-5`)
- Métricas y gráficos sin cambios funcionales

### R6: Scroll y Espaciado
- Área de mensajes debe tener `pb-24` para que el input flotante no tape el último mensaje
- Scroll suave (`scroll-smooth`) en el contenedor de mensajes
- Input debe estar "pegado" al fondo pero con padding (`px-4 py-3`)

---

## 5. Scenarios

### S1: Chat Vacío (Estado Inicial)
**Given** el usuario entra a IA Strategy sin historial
**When** la página carga
**Then** ve el header minimalista y el área de mensajes vacía con hint centrado
**And** el input está visible y listo en la parte inferior

### S2: Conversación Activa
**Given** el usuario ha enviado 3 mensajes
**When** recibe una respuesta larga de la IA
**Then** el texto tiene buen line-height y no se siente denso
**And** hay espacio adecuado entre cada burbuja de mensaje
**And** el scroll automático funciona suavemente

### S3: Panel Derecho Visible
**Given** el usuario está en una conversación
**When** mira al panel derecho
**Then** las métricas son legibles
**And** el panel no compite visualmente con el chat (está "apartado" sutilmente)

### S4: Input de Voz
**Given** el usuario presiona el botón de micrófono
**When** habla
**Then** el texto aparece en el input con la misma estética limpia
**And** el botón de voz muestra estado activo sin romper el layout

---

## 6. Non-Functional Requirements

- **Performance**: Sin cambios en lógica, solo CSS/Tailwind. No debe afectar bundle size.
- **Accessibility**: Mantener focus rings visibles (aunque más sutiles)
- **Responsive**: En pantallas < 1024px, el panel derecho debe ocultarse o colapsar (comportamiento actual, verificar que siga funcionando)

---

## 7. Acceptance Criteria

- [ ] Layout asimétrico implementado (chat ~65%, panel ~35%)
- [ ] Header sin `border-b`, centrado/alineado sutil
- [ ] Chat messages sin contenedor card, con `space-y-6`
- [ ] Input redondeado tipo ChatGPT (`rounded-2xl`, sin bordes pesados)
- [ ] Botón de envío circular (`rounded-full`)
- [ ] Panel derecho sin `border-l` pesado, integración sutil
- [ ] Build exitoso (`npm run build` sin errores)
- [ ] Chat funcional: enviar mensaje, recibir respuesta, voice input, eliminar chat
- [ ] Panel derecho muestra datos correctamente
