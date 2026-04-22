# Spec: Fix Radar Data Bugs (B3, B4)

## Goal

Corrección de bugs en `useRadarData.ts`

## Problems

### B3: Outlier Detection Corrupts Data
- Algoritmo mezcla valores de todas las categorías
- Reasigna valores a categorías incorrectas
- Gráfico muestra datos wrong

### B4: Hardcoded Categories
- Lista fija de 8 categorías
- Nuevas categorías no aparecen
- Categorías sin transacciones muestran "0"

## Solutions

### B3 Fix
- Eliminar outlier detection
- O: usar mediana para normalización simple

### B4 Fix
- Generar lista de categorías dinámicamente desde datos
- Solo mostrar categorías con datos

## Acceptance Criteria

- [ ] Categorías dinámicas desde BD
- [ ] Sin outlier detection corrupta
- [ ] Gráfico muestra solo categorías con datos