# Proposal: Sidebar Navigation Routes Fix

## Context

Sidebar currently uses `#anchors` (`/dashboard#transacciones`) instead of proper routes. This was discussed during dashboard modularization session but anchors were kept for simplicity. Now we need to update to proper routes for better deep linking and SEO.

## Vision

Clean URL structure with proper route-based navigation:
- `/dashboard/transacciones`
- `/dashboard/graficas`
- `/dashboard/informes`
- `/dashboard/config`

## Approach

1. Update `navItems` in `sidebar.tsx` to use routes instead of anchors
2. Verify all routes exist or create as needed
3. Test navigation works correctly

## Scope

**In Scope:**
- Update sidebar links from `#anchors` to routes
- Update `bottomNavItems` if needed

**Out of Scope:**
- Creating new page components (already exist or use main page with sections)
- Changing URL structure beyond sidebar links

## Status

- [x] PROPOSAL.md
- [ ] SPEC.md
- [ ] DESIGN.md
- [ ] TASKS.md
- [ ] Apply changes
- [ ] Build verify
