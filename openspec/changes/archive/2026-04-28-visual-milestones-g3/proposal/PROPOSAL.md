# PROPOSAL: G3 - Visual Milestones (Líneas de Meta en Gráficos)

## Intent

Integrar **líneas de referencia de metas financieras** en los gráficos de Pipod para transformar datos en "ruta de navegación" -> visualizar el progreso hacia el Break-even y Meta de Negocio Sano.

**Visión del Capitán:**
> "Sin las líneas de meta en los gráficos, los datos son solo puntos en el espacio; con ellas, se convierten en una ruta de navegación."

---

## Context

### Single Source of Truth
`PLAN_FINANCIERO_PIPOD_2026.md` define 3 metas financieras:

| Concepto | Valor (COP) | Representación |
|----------|-------------|----------------|
| Gastos Fijos | $12,149,400 | "Suelo volcánico" - no tocar |
| Break-even | $40,498,000 | "Línea de flotación" - estabilidad |
| Meta Negocio Sano | $50,000,000 | "El Norte" - 15% utilidad neta |

### Por qué G3 > G4-G6

| Métrica | Tipo | Descripción |
|---------|------|-------------|
| **G3 (Metas)** | Conquista | "Destino" - el objetivo |
| G4 (Profit Margin) | Estado | Derivado, ya visible en DataPanel |
| G5 (Burn Rate) | Estado | Supervivencia, ya visible en DataPanel |
| G6 (Runway) | Estado | Supervivencia, ya visible en DataPanel |

G3 es la métrica que da **sentido y dirección** a G4-G6.

---

## Scope

### Fase 1: Core Reference Lines
- [ ] Agregar 3 ReferenceLines a AreaChart (Evolución Temporal)
- [ ] Agregar 3 ReferenceLines a BalanceLine (Balance Neto)
- [ ] No modificar Bar Chart (categorías individuales)

### Fase 2: Tooltip Intelligence
- [ ] Micro-insights proactivos en hover
- [ ] Distancia a meta en tiempo real

### Fase 3: DataPanel Integration
- [ ] ReferenceLines en TrendChart (IA Strategy)

---

## 3 Detalles de Alta Precisión

### 1. Dominio Visual (Y-Axis)
Recharts escala por defecto según datos existentes. Si Pipod lleva $5M, la meta de $50M podría quedar "clipeada".

**Fórmula:**
```
Ydomain = [0, max(Dmax, Gtarget * 1.2)]
```
Donde:
- `Dmax` = valor máximo de datos actuales
- `Gtarget * 1.2` = Meta ($50M) + 20% buffer overhead

**Por qué 20% buffer:**
> "El espacio negativo (aire) es sinónimo de lujo y claridad."

### 2. Smart Labels
3 líneas con etiquetas pueden amontonarse.

**Implementación:**
- Posición: `position="insideTopRight"`
- Tipografía: Monoespaciada pequeña
- Opacidad: `fillOpacity={0.6}`
- Smart collapse: En hover reveals, para evitar solapamiento

### 3. Mobile Guardrails
En `sm` (celular), 3 líneas + datos = ruido visual.

**Regla:** En pantallas pequeñas, mostrar solo la **"Siguiente Boya"** (próxima meta por alcanzar).

---

## Estilo de Líneas: "Radar de Navegación"

| Meta | Color | Estilo | isFront |
|------|-------|--------|---------|
| Gastos Fijos | `rose-400` | `strokeDasharray="3 3"` | `false` |
| Break-even | `indigo-500` | Sólida | `false` |
| Meta Sana | `emerald-500` | `strokeDasharray="5 5"`, `strokeWidth={2}` | `false` |

**Jerarquía:** ReferenceLines `isFront={false}` para que el dato real siempre sea protagonista.

---

## Tooltip Logic (Micro-Insights)

```
SI valorActual < $40.5M:
  → "Faltan $X para el Break-even"

SI valorActual >= $40.5M Y < $50M:
  → "Superaste el Break-even. Vas Y% camino a la Meta Sana"

SI valorActual >= $50M:
  → "¡Meta de Negocio Sano alcanzada! Excediste por $X"
```

---

## File Changes

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/lib/strategy-constants.ts` | Reference | Single Source of Truth (ya existe) |
| `src/components/Graficas.tsx` | Modify | ReferenceLines en AreaChart y BalanceLine |
| `src/components/strategy/TrendChart.tsx` | Modify | ReferenceLines en DataPanel |
| Tooltip | Modify | Micro-insights proactivos |

---

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Líneas ensucian visualización | Med | isFront={false}, opacidad baja |
| Y-axis con datos muy bajos | Low | Fórmula dinámica con buffer 1.2 |
| Mobile overflow | Med | Mobile Guardrails - "Siguiente Boya" |

---

## Success Criteria

- [ ] AreaChart muestra 3 ReferenceLines sin obstruct data
- [ ] BalanceLine muestra "línea de flotación" claramente
- [ ] Tooltip muestra distancia a meta correcta
- [ ] Mobile muestra solo "Siguiente Boya"
- [ ] Build pasa sin errores