# Proposal: TIM to Tailwind CSS Migration

## Intent

Migrate from Creative Tim SCSS to Tailwind CSS using existing Pipod design tokens, achieving visual fidelity while gaining full control over the codebase.

## Approach: CSS Tokens Bridge (Approach C)

Leverage the existing 206 CSS design tokens (`--pipod-*`) as the bridge between current styles and Tailwind CSS. This avoids a full redesign and preserves visual consistency.

## Scope

### In Scope
- Install Tailwind CSS with `p-` prefix to avoid conflicts
- Configure Tailwind using existing `--pipod-*` CSS tokens from `_tokens.css`
- Migrate Bootstrap grid system (`.row`, `.col-*`, `.container`) to CSS Grid/Tailwind
- Keep existing custom component CSS (navbar, cards, buttons) as-is
- Delete SCSS files after successful migration
- Benchmark: CSS bundle size reduction, Lighthouse score maintenance

### Out of Scope
- Rewriting custom component CSS that already works
- Adding new visual features
- Changing color palette or design tokens

## Phases

### Phase 0: Setup
1. Install Tailwind CSS via `npx astro add tailwind`
2. Configure `p-` prefix in `tailwind.config.mjs`
3. Map `--pipod-*` tokens to Tailwind theme using CSS variables

### Phase A: Grid/Layout
1. Migrate `.container` → Tailwind container utilities
2. Migrate `.row` → CSS Grid or Tailwind grid utilities
3. Migrate `.col-*` → Tailwind column utilities

### Phase B: UI Components
1. Replace Bootstrap utility classes with Tailwind `p-` prefixed utilities
2. Handle 259+ Bootstrap class instances across 8 pages

### Phase C: Cleanup
1. Remove SCSS imports from all 8 pages
2. Delete SCSS files once 100% confidence achieved
3. Final visual QA verification

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `tailwind.config.mjs` | New | Tailwind configuration with Pipod tokens |
| `src/styles/_tokens.css` | Read-only | Source of truth for design tokens |
| Layout components | Modified | Grid system migration |
| All pages (8) | Modified | SCSS import removed |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Bootstrap vs Tailwind breakpoint mismatch | Medium | Configure custom screens (576px, 768px, 992px) |
| Visual drift during migration | Low | Component-by-component migration with visual checks |
| SCSS deletion breaks something | Low | Keep SCSS until 100% confident |

## Rollback Plan

If visual issues arise:
1. Uncomment SCSS imports in 8 pages
2. All custom CSS is preserved
3. Tailwind can be removed via `npm uninstall tailwindcss`

## Dependencies

- `npx astro add tailwind` must succeed
- Visual QA environment (local dev server)

## Success Criteria

- [ ] `npm run build` passes without errors
- [ ] CSS bundle size reduced by >50%
- [ ] Lighthouse Performance score ≥ 90
- [ ] No visual regressions vs current production
- [ ] All 259+ Bootstrap class instances replaced with Tailwind equivalents
