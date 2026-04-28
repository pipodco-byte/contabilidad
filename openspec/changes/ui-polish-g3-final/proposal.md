# Proposal: UI Polish G3 Final — Complete Theme System Completion

## Intent

Fix the remaining 231+ instances of hardcoded dark-mode Tailwind classes across 16+ components, making the application fully functional in both light AND dark mode. The CSS design tokens are already defined in `globals.css`, but most components don't use them. This is the final push to achieve theme parity across the entire application.

## Scope

### In Scope
- Fix ALL remaining hardcoded `bg-zinc-9[0-5]`, `text-zinc-1xx`, `border-zinc-8xx` in components
- Replace with semantic CSS tokens (`bg-background`, `bg-card`, `text-foreground`, `border-border`, `bg-input`, `text-muted-foreground`)
- Ensure all 16+ "light mode broken" components render correctly in both themes
- Add light/dark mode scrollbar consistency
- Add `aria-label` attributes to chart containers for accessibility
- Add `sr-only` labels to trend arrows where missing

### Out of Scope
- New features or business logic
- Mobile-first layout refactor
- Database schema changes
- API contract changes

## Approach

**Batch Refactor by Priority Group:**

1. **Priority 1 (Critical):** auth-form, AssistantSheet, Graficas, dashboard textarea
2. **Priority 2 (Major):** reports-tabs, transaction-table, command-palette, PaginationControls, FilterCarousel
3. **Priority 3 (Minor):** empty-state, StrategyMessage, skeleton, kpi-card

**Token Mapping Reference:**
| Hardcoded | Token | Purpose |
|----------|-------|---------|
| `bg-zinc-950` | `bg-background` | Page background |
| `bg-zinc-950/80` | `bg-card/80` | Translucent card |
| `bg-zinc-900` | `bg-card` | Card surface |
| `bg-zinc-900/50` | `bg-secondary` | Secondary surface |
| `text-zinc-100` | `text-foreground` | Primary text |
| `text-zinc-400` | `text-muted-foreground` | Muted text |
| `border-zinc-800` | `border-border` | Borders |
| `border-zinc-800/50` | `border-border` | Translucent borders |

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/forms/auth-form.tsx` | Modified | Login form light mode |
| `src/components/assistant/AssistantSheet.tsx` | Modified | Copilot sheet light mode |
| `src/components/assistant/BatchCard.tsx` | Modified | Batch card light mode |
| `src/components/Graficas.tsx` | Modified | Chart containers + empty state |
| `src/components/reports/reports-tabs.tsx` | Modified | Reports tabs light mode |
| `src/components/tables/transaction-table.tsx` | Modified | Table container + pagination |
| `src/components/PaginationControls.tsx` | Modified | All pagination hardcoded colors |
| `src/components/FilterCarousel.tsx` | Modified | Carousel light mode |
| `src/components/command/command-palette.tsx` | Modified | CMD+K palette light mode |
| `src/components/empty-state.tsx` | Modified | Empty state icon + title |
| `src/components/strategy/StrategyMessage.tsx` | Modified | Chat message bubbles |
| `src/components/strategy/DataPanel.tsx` | Modified | Data panel background |
| `src/components/ui/skeleton.tsx` | Modified | Loading skeletons |
| `src/components/dashboard/kpi-card.tsx` | Modified | Card background |
| `src/app/dashboard/page.tsx` | Modified | Gema textarea |
| `src/app/dashboard/config/page.tsx` | Modified | Config page containers |
| `src/app/layout.tsx` | Modified | Root layout background |
| `src/app/page.tsx` | Modified | Landing page background |
| `tailwind.config.js` | Modify | Verify duration tokens |
| `src/app/globals.css` | Modify | Light scrollbar |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking dark mode during refactor | Medium | Test both modes after each component |
| Missing token for specific color | Low | Add missing tokens to globals.css |
| Performance regression | Low | Verify build passes after each phase |

## Rollback Plan

```bash
git stash
# or
git revert <commit>
```

## Dependencies

- `tailwindcss` with `darkMode: 'class'`
- `lucide-react` icons

## Success Criteria

- [ ] `grep -r "bg-zinc-9[0-5]" src/components/` returns < 10 instances (only in non-UI components like markdown renderers)
- [ ] All 16 "light mode broken" components render correctly in both modes
- [ ] `npm run build` passes
- [ ] All chart containers have `aria-label`
- [ ] All trend arrows have `sr-only` labels