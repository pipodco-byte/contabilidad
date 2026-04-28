# Proposal: IA Strategy - Visual Storytelling (Fase 4 + Fase 5)

## Intent

Transformar IA Strategy de un dashboard con datos a un **instrumento de navegación** que combina visuales y narrativa estratégica.

**Visión:**
> "Los números son el mapa, pero la narrativa es la brújula."

---

## Scope

### Fase 4: Visual Insights (Data Viz)
- Crear `MiniComboChart` para StrategyChat
- Integrar gráficos minimalistas con estética Zinc
- Mostrar: Ingresos vs Egresos + Gastos Fijos + Break-even

### Fase 5: The Captain's Log (Narrativa)
- Inyectar "Capitán's Log" tone en system prompt
- Narrativa estratégica basada en datos reales (ya de Fase 2)
- Humanizar los números con contexto y prognosis

---

## Fast Track: Narrativa Primero

### Por qué funciona:
1. **Valor inmediato** - Usa infraestructura de Fase 2 (SQL View + Prompt injection)
2. **Feedback temprano** - Validamos tono antes de invertir en gráficos
3. **Iteración lógica** - Voz (narrativa) → Ojos (data viz)

### Implementación hoy:
1. Ajustar `STRATEGY_ADVISOR_SYSTEM_PROMPT` con instrucciones de narrativa
2. IA ya tiene datos de `getFinancialContext()` - solo debe **interpretarlos narrativamente**

---

## The Captain's Log - Tono y Estilo

### Sistema de Prompt para Narrativa Estratégica

```
ROL: Eres el Capitán del navío empresarial de Felipe.

PERSONALIDAD:
- Tono: Profesional pero cálido, como un capitán que respeta a su tripulación
- analogies marítimas permitted para explicar conceptos financieros
- Siempre orientado a la acción y el rumbo

REGLAS DE NARRATIVA:

1. DATOS A NARRATIVA:
Cuando analices números, no solo los reportes; **cuéntales la historia**:
- "El viento de los ingresos sopló fuerte hoy [subieron X%]"
- "Las mareas de gastos inesperada[s] amenazan el rumbo"
- "Tu barco navega [bien/mal] - we're [arriba/abajo] del punto de equilibrio"

2. CONTEXTO TEMPORAL:
- Usar fechas específicas para anchored memories
- "Esta semana el viento[X]..."
- "A este ritmo, el cierre de mes se ve [optimista/optimizado]"

3. PROGNOSIS Y RUMBO:
- Siempre dar next recommended action
- No solo decir qué pasó, sino qué hacer al respecto

4. STRUCTURE DEL RESPONSE:
- Apertura: Situación general (buenos/malos vientos)
- Desarrollo: Los números en contexto narrativo
- Cierre: Rumbo recomendado (siguiente acción)
```

### Ejemplo de Output

```
┌─────────────────────────────────────────────────────────┐
│ Capitán: Reporte del 15 de Abril                        │
├─────────────────────────────────────────────────────────┤
│ Los vientos fueron favorables hoy, Felipe.              │
│                                                     │
│ Tu vela de ingresos capturó [15M COP], un 12%       │
│ más que tu promedio semanal. Las corrientes de        │
│ egresos trajeron [2M COP], dentro de lo esperado.    │
│                                                     │
│ El viento a tu espalda: Llevas [85%] de tu meta       │
│ de [50M COP] para un negocio sano.                  │
│                                                     │
│ La sombra en el horizonte: Tu burn rate aceleró       │
│ ligeramente. Si la tendencia continúa, el cierre     │
│ de mes estaría [6%] debajo del punto de equilibrio.  │
│                                                     │
│ Rumbo recomendado: Considera ajustar las velas        │
│ de gastos operacionales esta semana.                  │
└─────────────────────────────────────────────────────────┘
```

---

## Data Viz - Componentes (Fase 4)

### Hero Metric: MiniComboChart

```
┌────────────────────────────────────────────┐
│  Combo Chart: Ingresos vs Egresos          │
│  ──────────────────────────────────────── │
│  Área Emerald: Ingresos (fill opacity)     │
│  Área Rose: Egresos (fill opacity)      │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│  Línea Indigo: Break-even ($40.5M)        │
│  Línea Zinc: Gastos Fijos ($12.1M)        │
└────────────────────────────────────────────┘
```

### Estética Zinc (Boutique)
- Líneas finas (1px)
- Sin bordes多余的
- Paleta: zinc-400, zinc-200, emerald-500, rose-400, indigo-500
- Tooltips minimalistas

---

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/strategy-prompt.ts` | Modified | Add Captain's Log tone |
| `src/components/strategy/StrategyMiniChart.tsx` | New | MiniComboChart component |
| `src/components/strategy/StrategyChat.tsx` | Modified | Integrate mini chart |
| `src/app/api/strategy/chat/route.ts` | Reference | Already has context |

---

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| AI tone too flowery | Med | Fine-tune prompt, limit metaphors |
| Charts slow load | Low | Lazy load, skeleton |
| Data stale | Low | Real-time from View |

---

## Success Criteria

- [ ] IA responds with narrative tone (Capitán voice)
- [ ] Response includes data interpretation
- [ ] MiniComboChart visible in StrategyChat
- [ ] Charts match Zinc aesthetic
- [ ] Build passes