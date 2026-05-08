# SDD Tasks: Fix Google Logo Appears Huge in ReviewWall

## Change Name
`fix-reviewwall-google-logo`

## Context

From the design:
- **File to modify:** `src/components/promo/pipodGoogleReviews.jsx`
- **Fix:** Add inline style `height: 16px !important; width: auto;` to the Google logo img tag (line 95)
- **Approach:** Use inline style for highest CSS specificity to override Tailwind v4 cascade

## Tasks

### Phase 1: Implementation
- [ ] 1.1 Add inline style to Google logo img in pipodGoogleReviews.jsx: `style={{height: "16px", width: "auto"}}`
- [ ] 1.2 Remove any conflicting class that might affect sizing (align-middle mb-1 should be fine)

### Phase 2: Verification
- [ ] 2.1 Build project: `npm run build`
- [ ] 2.2 Run dev server and verify logo renders at correct size on ReviewWall
- [ ] 2.3 Test on both /servicio-tecnico-apple and /home pages

### Phase 3: Commit
- [ ] 3.1 Commit with descriptive message: "fix(reviews): constrain Google logo to 16px height"
- [ ] 3.2 Push to origin