# IA Strategy - Specification

## 1. Overview

**Change Name:** IA Strategy
**Type:** Feature (New Module)
**Status:** Spec Draft
**Created:** 2026-04-24
**Last Updated:** 2026-04-24

---

## 2. Executive Summary

Crear una nueva sección **"IA Strategy"** en el sidebar de Pipod que funcione como centro de comando estratégico para Felipe. Separada del Copilot (entrada de transacciones), IA Strategy combina un chat de advisor con DeepSeek y métricas calculadas automáticamente para eliminar la incertidumbre en decisiones de negocio.

**Regla fundamental:** El IA del Dashboard es SOLO para entradas de datos. Copilot = transacciones. IA Strategy = análisis estratégico.

---

## 3. Motivation

Felipe actualmente **adivina** la salud de su negocio. No tiene forma clara de saber:
- ¿Cuánto puede gastar sin agotar su runway?
- ¿Está subiendo o bajando su margen?
- ¿Está en track para sus metas?

**IA Strategy = datos + IA + métricas = decisiones informadas**

---

## 4. Business Context

> **⚠️ INFORMACIÓN DE NEGOCIO PENDIENTE**
>
> Felipe proporcionará información clave del negocio que se registrará aquí:
> - Estructura de costos fijos actual
> - Flujo de caja mensual promedio
> - Capital disponible
> - Estacionalidad del negocio
> - Metas actuales
> - Competidores y mercado
>
> **Status:** ⏳ Pendiente de recibir

---

## 5. Design Language: "Boutique Engineering"

### 5.1 Color Palette

| Token | Hex | Uso |
|-------|-----|-----|
| `bg-primary` | `#0f0f0f` | Background principal |
| `bg-secondary` | `#1a1a1a` | Cards y paneles |
| `bg-elevated` | `#242424` | Elementos hover |
| `accent-primary` | `#a78bfa` | Accent (violet-400) |
| `accent-secondary` | `#34d399` | Success/positivo (emerald-400) |
| `text-primary` | `#fafafa` | Texto principal |
| `text-secondary` | `#a1a1aa` | Texto secundario |
| `text-muted` | `#52525b` | Placeholder |
| `border-subtle` | `#27272a` | Bordes |
| `danger` | `#f87171` | Rojo (runway bajo <3 meses) |
| `warning` | `#fbbf24` | Amarillo (runway medio 3-6 meses) |
| `success` | `#34d399` | Verde (runway sano >6 meses) |

### 5.2 Typography

- **Font Family:** Inter (system fallback)
- **Monospace:** Para números y métricas
- **Sizes:** sm (12px), base (14px), lg (16px), xl (20px), 2xl (24px)

### 5.3 Spacing

- Base unit: 4px
- Common: 8px, 12px, 16px, 24px, 32px
- Card padding: 16px
- Section gap: 24px

### 5.4 Motion

- **Transitions:** 200ms ease-out (default)
- **Panel slide:** 300ms ease-in-out
- **Micro-interactions:** Hover scale 1.02 on cards

---

## 6. Data Architecture: Hybrid Model

### 6.1 Data Sources

| Origen | Datos | Método |
|--------|-------|--------|
| **Automático** | Ingresos, gastos variables, comisiones | Transacciones Pipod |
| **Manual** | Costos fijos, cash disponible, metas | Settings del usuario |
| **IA Inference** | Categorización fijo/variable, tendencias | DeepSeek analysis |

### 6.2 StrategyData Schema

```typescript
interface StrategyData {
  // INPUTS MANUALES (Usuario los define en Settings)
  manualInputs: {
    fixedCosts: Array<{ id: string; label: string; amount: number }>;
    currentCash: number;
    targetMargin: number;
  };

  // CÁLCULOS AUTOMÁTICOS (desde transacciones + manual)
  calculatedMetrics: {
    burnRate: number;              // Promedio móvil 3 meses
    breakEven: number;             // Costos Fijos / Margen de Utilidad
    runway: number;                // currentCash / burnRate (en meses)
    profitMarginQuarterly: number; // Margen del trimestre actual
    profitMarginMonthly: number;   // Margen del mes actual
    avgRevenue: number;            // Revenue promedio mensual (3 meses)
    avgVariableCosts: number;      // Costos variables promedio (3 meses)
    marginTrend: number;           // % cambio vs mes anterior
    safetyBuffer: number;          // meses sin ventas (currentCash / fixedCosts)
    historicalMargins: Array<{ month: string; margin: number }>; // últimos 6 meses
  };

  // metadata
  lastUpdated: string;
  period: {
    quarterly: { start: string; end: string };
    monthly: { start: string; end: string };
  };

  // GOALS / OBJECTIVES
  goals: Array<{
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    status: 'on_track' | 'at_risk' | 'completed';
    category: 'savings' | 'investment' | 'debt_payment';
  }>;

  // CONFIGURACIÓN
  settings: {
    burnRateMonths: number;  // default: 3
    currency: string;         // default: 'MXN'
  };
}
```

---

## 7. Metric Calculations

| Métrica | Fórmula | Fuente |
|---------|---------|--------|
| `burnRate` | `avg(gastos_ultimos_3_meses)` | Transacciones |
| `breakEven` | `sum(fixedCosts) / profitMargin` | Manual + Calc |
| `runway` | `currentCash / burnRate` | Manual + Calc |
| `profitMarginMonthly` | `(ingresos - costos) / ingresos * 100` | Transacciones |
| `marginTrend` | `margin_hoy - margin_mes_pasado` | Histórico |
| `safetyBuffer` | `currentCash / sum(fixedCosts)` | Manual |
| `historicalMargins` | Array de últimos 6 meses | Transacciones |

---

## 8. Runway Badge Logic

| Runway | Color | Emoji | Status |
|--------|-------|-------|--------|
| > 6 meses | Success | 🟢 | SALUDABLE |
| 3-6 meses | Warning | 🟡 | CUIDADO |
| < 3 meses | Danger | 🔴 | CRÍTICO |

---

## 9. Non-Functional Requirements

- **Persistencia:** localStorage (key: `pipod_strategy`)
- **Máximo mensajes chat:** 40 (20 intercambios)
- **Sin Supabase:** Chat history solo en localStorage
- **API Provider:** DeepSeek (OpenCode pendiente para después)
- **Idioma:** Español only
- **Build:** Debe pasar en todo momento

---

## 10. Success Criteria

1. IA Strategy accesible desde sidebar
2. Métricas calculadas y mostradas correctamente
3. Strategy Advisor responde con contexto real
4. Goals CRUD funcional
5. Settings permite configurar fixedCosts y cash
6. Prompt hardening impide alucinar datos
7. Build pasa sin errores

---

## 11. Open Questions

| # | Pregunta | Status |
|---|----------|--------|
| 1 | Business context completo | ⏳ Pendiente |
| 2 | OpenCode API integration | ⏳ Pendiente |
| 3 | Threshold exacto para goals | ⏳ Pendiente |

---

## 12. Related Documents

- `spec/requirements.md` - Requisitos funcionales detallados
- `spec/scenarios.md` - Casos de uso
- `design/README.md` - Arquitectura técnica
- `tasks/README.md` - Checklist de implementación
