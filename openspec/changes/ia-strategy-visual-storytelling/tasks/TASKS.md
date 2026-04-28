# TASKS: IA Strategy - Visual Storytelling

## Change: `ia-strategy-visual-storytelling`

---

## Fase 5: The Captain's Log (Narrative) - Fast Track

### T5.1: Update Strategy Prompt with Captain's Voice

**File:** `src/lib/strategy-prompt.ts`
**Type:** Modify
**Priority:** High (Fast Track - immediate value)

#### Tasks:
- [ ] T5.1.1: Read current `STRATEGY_ADVISOR_SYSTEM_PROMPT`
- [ ] T5.1.2: Add "Capitán del navío" role definition
- [ ] T5.1.3: Add narrative rules (Apertura → Desarrollo → Cierre)
- [ ] T5.1.4: Add tone guidelines (profesional, cálido, action-oriented)
- [ ] T5.1.5: Add example response with Capitán voice
- [ ] T5.1.6: Verify build passes

**Verification:** Send test message to IA Strategy → response should have Captain's tone

---

## Fase 4: Visual Insights (Data Viz)

### T5.2: Create StrategyMiniChart Component

**File:** `src/components/strategy/StrategyMiniChart.tsx`
**Type:** New
**Priority:** High

#### Tasks:
- [ ] T5.2.1: Create component with recharts AreaChart
- [ ] T5.2.2: Add 4 data series:
  - [ ] Area: Ingresos (emerald-500 stroke, emerald-900 fill)
  - [ ] Area: Egresos (rose-400 stroke, rose-900 fill)
  - [ ] Line: Gastos Fijos (zinc-400, dashed 4 4)
  - [ ] Line: Break-even (indigo-500, solid)
- [ ] T5.2.3: Add XAxis and YAxis hidden
- [ ] T5.2.4: Add minimal Tooltip (zinc-900 bg, 12px font)
- [ ] T5.2.5: Set height to 120px, overflow hidden
- [ ] T5.2.6: Add proper TypeScript types

**Verification:** Component renders without errors in isolation

---

### T5.3: Integrate StrategyMiniChart in StrategyChat

**File:** `src/components/strategy/StrategyChat.tsx`
**Type:** Modify
**Priority:** High

#### Tasks:
- [ ] T5.3.1: Import StrategyMiniChart
- [ ] T5.3.2: Get monthly data from getFinancialContext()
- [ ] T5.3.3: Add chart above input area (border-b, py-3)
- [ ] T5.3.4: Style container: px-4, border-zinc-800

**Verification:** Chart visible in StrategyChat above input

---

### T5.4: Verify Build

**Priority:** Critical

#### Tasks:
- [ ] T5.4.1: Run `npm run build`
- [ ] T5.4.2: Fix any TypeScript errors
- [ ] T5.4.3: Verify no console errors

---

## Task Checklist Summary

| Task | Description | Status |
|------|-------------|--------|
| T5.1 | Update strategy-prompt.ts with Captain's voice | ⬜ |
| T5.2 | Create StrategyMiniChart.tsx | ⬜ |
| T5.3 | Integrate chart in StrategyChat | ⬜ |
| T5.4 | Verify build passes | ⬜ |

---

## Effort Estimate

| Phase | Tasks | Effort |
|-------|-------|--------|
| Fase 5 (Narrative) | T5.1 | ~15 min |
| Fase 4 (Viz) | T5.2, T5.3 | ~30 min |
| Verification | T5.4 | ~10 min |
| **Total** | **4 tasks** | **~55 min** |

---

## Implementation Order

1. **T5.1** - Fast Track: Just prompt changes, no new files
2. **T5.2** - Create chart component
3. **T5.3** - Integrate in StrategyChat
4. **T5.4** - Verify everything works