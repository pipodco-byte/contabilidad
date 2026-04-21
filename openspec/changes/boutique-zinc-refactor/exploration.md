# Exploration: Theme Toggle Not Working on KPI Cards

## Current State

### Theme Architecture
- **Tailwind dark mode**: Controlled via `class` (adds `dark` class to `<html>`)
- **useTema hook**: Manages theme state in React and localStorage
- **Hook behavior**:
  - Initializes from localStorage or system preference
  - Adds/removes `dark` class on `<html>` when toggling
  - Returns `{ tema, toggleTema, mounted }`

### How Dark Mode Should Work
1. User clicks toggle → `toggleTema()` called
2. `tema` state changes to `'dark'`
3. `document.documentElement.classList.add('dark')` adds class
4. Tailwind's `dark:` prefix classes activate
5. All components using `tema === 'dark'` show dark variants

### Current KPI Card Implementation
```tsx
const { tema } = useTema();
const cardBg = tema === 'dark' ? 'bg-zinc-950/80' : 'bg-white';
const cardBorder = tema === 'dark' ? 'border-zinc-800/50' : 'border-zinc-200/50';
```

This should work but appears to not be responding to theme changes.

## Affected Areas

| File | Issue |
|------|-------|
| `src/hooks/useTema.ts` | May have stale closure or state update issue |
| `src/components/dashboard/kpi-card.tsx` | Uses `useTema` - may not re-render on toggle |
| `src/components/tables/transaction-table.tsx` | Uses FilterSelectors (no tema hook) |
| `src/components/Graficas.tsx` | Uses `useTema` hook internally |

## Root Cause Hypothesis

The issue is likely one of:

1. **Stale closure**: `useTema` hook captures initial state and doesn't trigger re-render
2. **State not triggering re-render**: `setTema` in hook doesn't cause component to update
3. **CSS variable conflict**: Tailwind's `dark:` prefix conflicts with manual `tema === 'dark'` logic
4. **Toggle not connected properly**: The header toggle button may not be calling `toggleTema` correctly

## Recommended Approach

**Option A: Simplify - Use Tailwind dark: prefix exclusively**
- Remove manual `tema === 'dark' ? 'bg-zinc-950/80' : 'bg-white'` logic
- Use `dark:bg-zinc-950/80 bg-white` class pattern
- Rely entirely on Tailwind's `darkMode: ['class']`

**Effort**: Low
**Pros**: Simpler code, leverages Tailwind properly
**Cons**: All components must use `dark:` pattern consistently

**Option B: Debug useTema hook**
- Add console.log to verify `tema` state changes
- Verify toggle is actually calling `setTema`
- Check if re-render is happening

**Effort**: Medium
**Pros**: Find actual root cause
**Cons**: Time consuming

**Option C: Force re-render with key**
- Add a `key` prop that changes with theme to force component remount

**Effort**: Low
**Pros**: Quick fix
**Cons**: Hacky solution

## Immediate Fix for KPI Cards

Replace the manual tema check with Tailwind dark: prefix:

```tsx
// BEFORE
const cardBg = tema === 'dark' ? 'bg-zinc-950/80' : 'bg-white';
const cardBorder = tema === 'dark' ? 'border-zinc-800/50' : 'border-zinc-200/50';

// AFTER
className="bg-white dark:bg-zinc-950/80 border-zinc-200/50 dark:border-zinc-800/50"
```

This leverages Tailwind's dark mode which is controlled by the `dark` class on `<html>`.

## Files to Check

1. `src/hooks/useTema.ts` - Verify toggle actually changes state
2. `src/components/layout/header.tsx` - Verify toggle button calls `toggleTema`
3. `src/components/dashboard/kpi-card.tsx` - Apply fix

## Next Steps

1. Verify header toggle button is connected to `toggleTema`
2. Apply Tailwind `dark:` prefix fix to kpi-card
3. Apply same fix to other components with manual tema checks
4. Test toggle behavior end-to-end