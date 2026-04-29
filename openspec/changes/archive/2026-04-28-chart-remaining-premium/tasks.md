# Tasks: chart-remaining-premium

## Phase 1: Implement PieChart #3

- [x] 1.1 Update motion.div to spring animation (stiffness:180, damping:22, delay:0.2)
- [x] 1.2 Apply glassmorphism card classes
- [x] 1.3 Add indigo glow div (bottom-right)
- [x] 1.4 Update header with "Resource Allocation" label
- [x] 1.5 Apply PieChart props: innerRadius:105, cornerRadius:6, paddingAngle:5, cy:45%
- [x] 1.6 Apply hover opacity to cells

## Phase 2: Implement LineChart #5

- [x] 2.1 Update motion.div to spring animation (stiffness:180, damping:25, delay:0.4)
- [x] 2.2 Apply glassmorphism card classes
- [x] 2.3 Add violet gradient line (top-center)
- [x] 2.4 Update header with "Financial Health" label + "Live Analysis" badge
- [x] 2.5 Define linearGradient id="balanceGradientUnique" with green→red
- [x] 2.6 Apply YAxis domain with Math.max for Milestones
- [x] 2.7 Apply Line props: strokeWidth:4, dot:false, activeDot with shadow-2xl
- [x] 2.8 Set ReferenceLine y=0 with reduced opacity

## Phase 3: Implement Tabla #6

- [x] 3.1 Add imports: TrendingUp, TrendingDown from lucide-react
- [x] 3.2 Update motion.div to spring animation (delay:0.5)
- [x] 3.3 Apply glassmorphism card classes
- [x] 3.4 Update header with "Data Snapshot" label + "Delta Analysis" badge
- [x] 3.5 Apply table styling: uppercase headers, hover states
- [x] 3.6 Add TrendingUp/Down icons to each row
- [x] 3.7 Apply balance row highlight

## Phase 4: Verification

- [x] 4.1 Run `npm run build` - verify no TypeScript errors
- [x] 4.2 Verify PieChart cornerRadius and glow visible
- [x] 4.3 Verify LineChart gradient stroke
- [x] 4.4 Verify Tabla icons render correctly

---

**Implementation Complete**: 2026-04-28

**Build Status**: Passing

**Files Modified**:
- `src/components/Graficas.tsx` — Charts #3, #5, #6 upgraded
- Removed unused `axisStroke` and `gridStroke` variables
