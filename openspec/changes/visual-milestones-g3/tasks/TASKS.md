# TASKS: G3 - Visual Milestones (Líneas de Meta en Gráficos)

## Change: `visual-milestones-g3`

---

## T6.1: Create MilestoneLine Component

**File:** `src/components/MilestoneLine.tsx`
**Type:** New (optional reusable)
**Priority:** High

#### Tasks:
- [x] T6.1.1: Create `MilestoneLine` component with recharts `ReferenceLine`
- [x] T6.1.2: Support 3 types: `fixed`, `breakEven`, `meta`
- [x] T6.1.3: Apply correct colors:
  - [x] `fixed`: rose-400, strokeDasharray="3 3"
  - [x] `breakEven`: indigo-500, solid
  - [x] `meta`: emerald-500, strokeDasharray="5 5", strokeWidth={2}
- [x] T6.1.4: Smart Label: `position="insideTopRight"`, `fillOpacity={0.6}`, `fontSize={10}`, monospace
- [x] T6.1.5: Set `isFront={false}` (datos reales siempre protagonistas)

**Verification:** Component renders without errors

---

## T6.2: Update Graficas.tsx - AreaChart

**File:** `src/components/Graficas.tsx`
**Type:** Modify
**Priority:** High

#### Tasks:
- [x] T6.2.1: Import `MilestoneLine` component
- [x] T6.2.2: Calculate Y-axis domain: `[0, Math.max(dataMax, businessGoal * 1.2)]`
- [x] T6.2.3: Add 3 `MilestoneLine` components after Areas
- [x] T6.2.4: Apply same domain logic to Balance Line Chart

**Verification:** AreaChart shows 3 ReferenceLines, Y-axis has 20% buffer

---

## T6.3: Update Graficas.tsx - BalanceLine Chart

**File:** `src/components/Graficas.tsx`
**Type:** Modify
**Priority:** High

#### Tasks:
- [x] T6.3.1: Add same Y-axis domain formula
- [x] T6.3.2: Add 3 `MilestoneLine` components
- [x] T6.3.3: Keep existing ReferenceLine for y=0 (break-even base)

**Verification:** BalanceLine shows "línea de flotación" clearly

---

## T6.4: Implement Mobile Guardrails

**File:** `src/components/Graficas.tsx`
**Type:** Modify
**Priority:** Medium

#### Tasks:
- [ ] T6.4.1: Add `useMediaQuery` hook or window.innerWidth check
- [ ] T6.4.2: Implement `getSiguienteBoya(currentValue)` logic
- [ ] T6.4.3: In `sm` screens, show only next milestone (not all 3)
- [ ] T6.4.4: If meta alcanzada, hide milestone lines

**Verification:** Resize to `sm` → only "Siguiente Boya" visible

---

## T6.5: Enhance Tooltip with Micro-Insights

**File:** `src/components/Graficas.tsx`
**Type:** Modify
**Priority:** Medium

#### Tasks:
- [ ] T6.5.1: Create custom tooltip or enhance existing
- [ ] T6.5.2: Implement `formatTooltipInsight(value)` logic:
  - [ ] If value < $40.5M → "Faltan $X para el Break-even"
  - [ ] If value >= $40.5M AND < $50M → "Vas Y% camino a la Meta Sana"
  - [ ] If value >= $50M → "¡Meta alcanzada! Excediste por $X"
- [ ] T6.5.3: Apply emerald success color for exceeded insights

**Verification:** Hover tooltip shows distance to goal

---

## T6.6: Integrate in TrendChart (DataPanel)

**File:** `src/components/strategy/TrendChart.tsx`
**Type:** Modify
**Priority:** Medium

#### Tasks:
- [ ] T6.6.1: Import `MilestoneLine`
- [ ] T6.6.2: Add ReferenceLines for consistency with main charts
- [ ] T6.6.3: Consider mobile guardrails for DataPanel

**Verification:** DataPanel mini-chart matches main charts

---

## T6.7: Verify Build

**Priority:** Critical

#### Tasks:
- [x] T6.7.1: Run `npm run build`
- [x] T6.7.2: Fix any TypeScript errors
- [x] T6.7.3: Verify no console errors

---

## Task Checklist Summary

| Task | Description | Status |
|------|-------------|--------|
| T6.1 | Create MilestoneLine component | ✅ |
| T6.2 | AreaChart with 3 ReferenceLines | ✅ |
| T6.3 | BalanceLine with 3 ReferenceLines | ✅ |
| T6.4 | Mobile Guardrails | ⬜ |
| T6.5 | Tooltip Micro-Insights | ⬜ |
| T6.6 | TrendChart integration | ⬜ |
| T6.7 | Verify build | ✅ |

---

## Effort Estimate

| Phase | Tasks | Effort |
|-------|-------|--------|
| Core | T6.1, T6.2, T6.3 | ~30 min |
| Enhancement | T6.4, T6.5 | ~25 min |
| Integration | T6.6 | ~10 min |
| Verification | T6.7 | ~10 min |
| **Total** | **7 tasks** | **~75 min** |

---

## Implementation Order

1. **T6.1** - Create reusable MilestoneLine component
2. **T6.2** - AreaChart with ReferenceLines + Y-axis domain
3. **T6.3** - BalanceLine with ReferenceLines
4. **T6.4** - Mobile Guardrails
5. **T6.5** - Tooltip Micro-Insights
6. **T6.6** - TrendChart integration
7. **T6.7** - Build verification