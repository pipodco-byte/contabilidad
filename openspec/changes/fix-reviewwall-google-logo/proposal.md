# Proposal: Fix Google Logo Appears Huge in ReviewWall

## Intent

Fix the Google logo (SVG from Wikimedia) rendering at enormous size in the ReviewWall component due to CSS cascade conflicts from Tailwind v4 imported via `src/styles/global.css` in the develop branch. The logo should render at 16px height matching main branch behavior.

## Scope

### In Scope
- Constrain Google logo SVG to 16px height in `pipodGoogleReviews.jsx`
- Preserve Tailwind v4 import in develop branch

### Out of Scope
- Removing Tailwind v4 from the project
- Fixing other CSS cascade issues

## Approach

Add targeted CSS fix in `src/components/promo/pipodGoogleReviews.jsx` to explicitly constrain the Google logo image to 16px height. This is a surgical fix that addresses only the logo sizing without affecting the broader Tailwind v4 implementation.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/promo/pipodGoogleReviews.jsx` | Modified | Add `height: 16px` to Google logo img element |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CSS specificity conflict | Low | Use inline style or `!important` if needed |
| Logo gets cropped | Low | Verify aspect ratio is preserved with width:auto |

## Rollback Plan

Remove the added CSS property from the Google logo img element in `pipodGoogleReviews.jsx`. Single line change, instant revert.

## Dependencies

None.

## Success Criteria

- [ ] Google logo renders at 16px height in ReviewWall
- [ ] No visual regressions in other components
- [ ] Build passes without errors