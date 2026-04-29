# Tasks: chart-area-premium

## Phase 1: Implementation Chart #2

- [x] 1.1 Update motion.div to spring animation (stiffness:180, damping:20, delay:0.1)
- [x] 1.2 Apply glassmorphism card classes (bg-card/40, backdrop-blur-2xl, rounded-[2rem])
- [x] 1.3 Add emerald glow div (top-right)
- [x] 1.4 Update header with "Time Analysis" label + real-time indicator
- [x] 1.5 Apply gradient 3-stop to areas
- [x] 1.6 Update strokeWidth to 3, add activeDot
- [x] 1.7 MilestoneLines at default opacity (component doesn't support opacity prop)
- [x] 1.8 Apply horizontal-only grid, minimal axes

## Phase 2: Implementation Chart #4

- [x] 2.1 Update motion.div to spring animation (stiffness:180, damping:22, delay:0.3)
- [x] 2.2 Apply glassmorphism card classes
- [x] 2.3 Add rose glow div (bottom-left)
- [x] 2.4 Update header with "Performance Snapshot" + badge "Año Fiscal 2026"
- [x] 2.5 Apply gradient 3-stop to areas
- [x] 2.6 Update strokeWidth to 3, add activeDot
- [x] 2.7 NO MilestoneLines (Chart #4 no tiene)
- [x] 2.8 Apply horizontal-only grid, minimal axes

## Phase 3: Verification

- [x] 3.1 Run `npm run build` - verify no TypeScript errors
- [x] 3.2 Verify spring animations play correctly
- [x] 3.3 Verify glow effects visible
- [x] 3.4 Verify Milestones visible (Chart #2)
- [x] 3.5 Verify badge visible (Chart #4)

## Phase 4: Decision

- [ ] 4.1 If successful: Plan rollout to remaining charts
- [ ] 4.2 If issues: Rollback changes

---

**Implementation Complete**: 2026-04-28

**Build Status**: Passing

**Files Modified**:
- `src/components/Graficas.tsx` — Charts #2 y #4 upgraded

**Note**: MilestoneLine component doesn't support opacity prop. Milestones render at default opacity (0.6 in label).
