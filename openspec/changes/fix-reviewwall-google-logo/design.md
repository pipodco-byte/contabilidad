# Design: Fix Google Logo Appears Huge in ReviewWall

## Context

The Google logo SVG (sourced from Wikimedia) renders at enormous size in the ReviewWall component (`pipodGoogleReviews.jsx`) due to CSS cascade conflicts when Tailwind v4 is imported via `src/styles/global.css` in the develop branch. The goal is to restore the 16px height rendering from main branch.

## Technical Approach

Add a targeted inline style to the Google logo `<img>` element to explicitly constrain height to 16px. This surgical fix bypasses Tailwind v4 cascade issues without modifying the global CSS or affecting other components.

## CSS Specificity Strategy

| Method | Specificity | Use Case |
|--------|-------------|----------|
| Inline style (`style="..."`) | Highest (1000) | SVG img elements — guaranteed override |
| `!important` in external CSS | Origin + important | Fallback if inline doesn't work |
| Tailwind class + arbitrary value `h-[16px]` | 10 + 10 | Alternative approach |

**Chosen approach**: Inline style — highest specificity, no conflicts with Tailwind utilities, self-contained in component.

## Exact Change

**File**: `src/components/promo/pipodGoogleReviews.jsx`
**Location**: Google logo `<img>` tag (approximately line 95)

```jsx
// BEFORE (affected by Tailwind v4 cascade)
<img
  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/256px-Google_2015_logo.svg.png"
  alt="Google"
  className="w-full h-auto"
/>

// AFTER (targeted fix)
<img
  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/256px-Google_2015_logo.svg.png"
  alt="Google"
  className="w-full h-auto"
  style={{ height: '16px', width: 'auto' }}
/>
```

## Aspect Ratio Preservation

The `width: auto` ensures the SVG scales proportionally. The Google logo SVG is approximately 256x91 pixels (roughly 2.8:1 ratio), so 16px height will render at approximately 45px width.

## Implementation Notes

1. **No existing `style` prop** — if the `<img>` has no existing `style` attribute, simply add it
2. **Preserve existing `className`** — do not remove Tailwind classes, they may be needed for positioning
3. **Do not add `!important`** — inline styles are specific enough
4. **Verify no duplicate** — if `height` already exists in `className` via Tailwind, the inline style still wins due to higher specificity

## Rollback

Single line removal — delete the `style={{ height: '16px', width: 'auto' }}` attribute from the img element.

## Testing Checklist

- [ ] Logo renders at exactly 16px height
- [ ] Width scales proportionally (no distortion)
- [ ] No visual regressions in surrounding `reviews-text` container
- [ ] Build passes without errors