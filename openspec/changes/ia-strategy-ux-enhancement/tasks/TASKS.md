# Tasks: IA Strategy - UX Enhancement (Fase 1)

## Phase: Apply - Fase 1 Quick Wins UX

---

## Task 1: Install Dependencies

**Command:**
```bash
npm install react-markdown remark-gfm
```

**Verify:** Check package.json for new dependencies.

---

## Task 2: Update StrategyMessage.tsx

**File:** `src/components/strategy/StrategyMessage.tsx`

**Changes:**
- [ ] Add imports: `ReactMarkdown`, `remarkGfm`
- [ ] Add `markdownComponents` object with zinc-compatible styles
- [ ] Update message rendering: user = plain text, assistant = markdown

**Styling Reference:**
```typescript
const markdownComponents = {
  p: ({ children }) => <p className="text-sm text-zinc-100 mb-2">{children}</p>,
  strong: ({ children }) => <strong className="text-indigo-400">{children}</strong>,
  // ... full implementation in DESIGN.md
};
```

---

## Task 3: Update StrategyChat.tsx

**File:** `src/components/strategy/StrategyChat.tsx`

**Changes:**

### 3.1 Textarea Auto-grow
- [ ] Replace `Input` with `textarea`
- [ ] Add `textareaRef`
- [ ] Add auto-grow `useEffect`
- [ ] Add `handleKeyDown` for Enter/Shift+Enter

### 3.2 Hybrid Scrolling
- [ ] Add `isFirstLoad` state
- [ ] Update scroll `useEffect` with instant/smooth logic

### 3.3 Delete Modal Enhancement
- [ ] Wrap modal in backdrop overlay
- [ ] Add scale animation
- [ ] Style consistently with Gema

---

## Task 4: Build Verification

**Command:**
```bash
npm run build
```

**Expected:** Build passes without errors.

---

## Task 5: Manual Testing

**Checklist:**
- [ ] Open IA Strategy page
- [ ] Type multi-line message - textarea grows
- [ ] Press Enter - message sends
- [ ] Press Shift+Enter - new line in textarea
- [ ] Delete chat - modal has blur backdrop
- [ ] First load scroll is instant
- [ ] New messages scroll smoothly

---

## Files Summary

| File | Action |
|------|--------|
| `src/components/strategy/StrategyMessage.tsx` | Modify |
| `src/components/strategy/StrategyChat.tsx` | Modify |
| `package.json` | Modify (add deps) |

---

## Effort Estimate

- Task 1: 5 min
- Task 2: 30 min
- Task 3: 45 min
- Task 4: 5 min
- Task 5: 10 min

**Total: ~1.5 hours**