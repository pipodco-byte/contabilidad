# Legacy CSS Cleanup - Task Breakdown

## Phase 1: Create Replacement CSS File

- [ ] Create `src/styles/_pipod-utilities.css`
- [ ] Copy design tokens from spec
- [ ] Copy utility classes from spec
- [ ] Copy button system from spec
- [ ] Copy component overrides from spec

## Phase 2: Integrate into Layout

- [ ] Import `_pipod-utilities.css` in Layout.astro
- [ ] Test page loads without SCSS import

## Phase 3: Test Low Risk Pages First

1. [ ] terminos-condiciones-pipod.astro - comment SCSS import, verify
2. [ ] shopping-cart.astro - comment SCSS import, verify
3. [ ] pipod-blog.astro - comment SCSS import, verify

## Phase 4: Test Medium Risk Pages

4. [ ] tienda-pipod.astro - comment SCSS import, verify
5. [ ] servicio-tecnico-apple.astro - comment SCSS import, verify

## Phase 5: Test High Risk Pages

6. [ ] contacto-pipod.astro - comment SCSS import, verify
7. [ ] producto/[slug].astro - comment SCSS import, verify
8. [ ] index.astro - comment SCSS import, verify

## Phase 6: Cleanup

- [ ] Verify no remaining SCSS imports
- [ ] Delete `assets/scss/astro-ecommerce/` directory
- [ ] Delete `assets/js/astro-ecommerce.js`
- [ ] Update LICENSE.MD if needed
- [ ] Commit and push

## Verification Checkpoints

For each page test, verify:
- [ ] Buttons look correct
- [ ] Shadows appear correctly
- [ ] Gradients render properly
- [ ] No layout breaks