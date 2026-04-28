# Design: UI Polish G3 Final — Complete Theme System Completion

## Technical Approach

Batch-replace hardcoded zinc colors with semantic CSS tokens across all 16+ broken components. Use the existing token mapping from `globals.css` and `tailwind.config.js`. Each component will be refactored following this pattern:

1. Replace `bg-zinc-950/80` → `bg-card/80`
2. Replace `bg-zinc-900/50` → `bg-secondary` or `bg-muted`
3. Replace `text-zinc-100` → `text-foreground`
4. Replace `text-zinc-400` → `text-muted-foreground`
5. Replace `border-zinc-800/50` → `border-border`

## Architecture Decisions

### Decision: Token Priority

**Choice**: Map to Tailwind utilities (`bg-card`, `text-foreground`) over raw CSS variables
**Alternatives considered**: Using raw `var(--background)` — less maintainable, less readable
**Rationale**: Tailwind utilities already consume the CSS tokens; using utilities keeps classNames readable and consistent

### Decision: Component-by-Component Verification

**Choice**: Verify light mode after each component refactor
**Alternatives considered**: Batch all changes then verify — riskier
**Rationale**: Catches issues early; easier to identify which change caused a problem

### Decision: Non-UI Content Exclusions

**Choice**: Some components (e.g., markdown renderers, code blocks) intentionally use hardcoded colors
**Rationale**: Markdown/Code content is author-generated and should maintain consistent styling regardless of theme

## File Changes

### Priority 1 (Critical)
| File | Change | Token Mapping |
|------|--------|--------------|
| `auth-form.tsx` | Full refactor | `bg-zinc-950/80` → `bg-card`, `text-white` → `text-foreground` |
| `AssistantSheet.tsx` | Full refactor | All `bg-zinc-9xx`, `text-zinc-1xx` → tokens |
| `Graficas.tsx` | Container + empty state | `bg-white dark:bg-zinc-900/50` → `bg-card` |
| `dashboard/page.tsx` | Gema textarea | `bg-zinc-900` → `bg-input` |

### Priority 2 (Major)
| File | Change | Token Mapping |
|------|--------|--------------|
| `reports-tabs.tsx` | Container + cards | `bg-zinc-950/80` → `bg-card` |
| `transaction-table.tsx` | Table + pagination | `bg-zinc-950/80` → `bg-card` |
| `command-palette.tsx` | Full refactor | Dark-only → theme tokens |
| `PaginationControls.tsx` | Full refactor | All hardcoded → tokens |
| `FilterCarousel.tsx` | Container + buttons | `bg-white dark:bg-zinc-900/50` → `bg-card` |

### Priority 3 (Minor)
| File | Change | Token Mapping |
|------|--------|--------------|
| `empty-state.tsx` | Icon + title | `text-zinc-600` → `text-muted-foreground` |
| `StrategyMessage.tsx` | Message bubbles | `bg-zinc-900/50` → `bg-secondary` |
| `ui/skeleton.tsx` | Skeleton backgrounds | `bg-zinc-900/50` → `bg-muted` |
| `kpi-card.tsx` | Card background | `bg-white dark:bg-zinc-950/80` → `bg-card` |
| `DataPanel.tsx` | Panel background | `bg-zinc-900/10` → `bg-secondary` |
| `config/page.tsx` | Containers | `bg-zinc-950/80` → `bg-card` |

### Additional
| File | Change | Token Mapping |
|------|--------|--------------|
| `app/layout.tsx` | Root background | `bg-slate-50 dark:bg-slate-950` → `bg-background` |
| `app/page.tsx` | Landing background | `bg-slate-50` → `bg-background` |
| `globals.css` | Scrollbar (verify) | Already added in ui-polish-g3 |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | Components in light mode | Toggle `dark` class on `<html>` |
| Visual | Components in dark mode | Ensure dark behavior preserved |
| Build | No TS errors | `npm run build` |
| Grep | Reduced hardcoded count | `grep -r "bg-zinc-9[0-5]" src/components/` count |
| A11y | Chart aria-label | Inspect element for `aria-label` |

## Migration / Rollback

No migration needed. Rollback via `git stash` or `git revert`.

## Open Questions

- [ ] Should command-palette.tsx be light-mode capable, or is it always triggered from dark contexts?
- [ ] Are there any markdown/code components that intentionally need dark-only styling?