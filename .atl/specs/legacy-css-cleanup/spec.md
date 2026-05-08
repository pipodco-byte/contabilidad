# Legacy CSS Cleanup Specification

## Purpose

Replace the `astro-ecommerce.scss` dependency with native CSS utilities and design tokens in the Pipod Contabilidad project. This specification defines exact CSS values for shadows, gradients, buttons, and utility classes.

## Design Tokens

### Shadows

| Token | Value |
|-------|-------|
| `--pipod-shadow-sm` | `0 2px 8px rgba(0,0,0,0.08)` |
| `--pipod-shadow-md` | `0 4px 15px rgba(0,0,0,0.08)` |
| `--pipod-shadow-lg` | `0 8px 25px rgba(0,0,0,0.1)` |
| `--pipod-shadow-none` | `none` |

### Gradients

| Token | Value |
|-------|-------|
| `--pipod-gradient-dark` | `linear-gradient(310deg, #141727 0%, #3a416f 100%)` |
| `--pipod-gradient-secondary` | `linear-gradient(310deg, #627594 0%, #a8b8d8 100%)` |
| `--pipod-gradient-text` | `linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)` |

### Colors

| Token | Value |
|-------|-------|
| `--pipod-btn-dark` | `#1a1a1a` |
| `--pipod-btn-dark-hover` | `#000000` |
| `--pipod-pagination-active` | `#ffffff` |

## Utility Classes

### `.text-gradient`

```css
.text-gradient {
  background: var(--pipod-gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### `.z-index-10`

```css
.z-index-10 {
  z-index: 10;
}
```

### Shadow Utilities

```css
.shadow-sm { box-shadow: var(--pipod-shadow-sm); }
.shadow-md { box-shadow: var(--pipod-shadow-md); }
.shadow-lg { box-shadow: var(--pipod-shadow-lg); }
.shadow-none { box-shadow: var(--pipod-shadow-none); }
```

## Button System

### `.btn` Base

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:focus {
  outline: 2px solid var(--pipod-btn-dark);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### `.btn-dark`

```css
.btn-dark {
  background: var(--pipod-btn-dark);
  color: #ffffff;
}

.btn-dark:hover {
  background: var(--pipod-btn-dark-hover);
}

.btn-dark:active {
  transform: scale(0.98);
}

.btn-dark:focus {
  outline-color: var(--pipod-btn-dark);
}
```

### `.btn-white`

```css
.btn-white {
  background: #ffffff;
  color: var(--pipod-btn-dark);
  border: 1px solid #e5e7eb;
}

.btn-white:hover {
  background: #f9fafb;
}
```

### `.btn-lg`

```css
.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}
```

### `.btn-round`

```css
.btn-round {
  border-radius: 9999px;
}
```

## Component Overrides

### `heroBentoCarousel.astro`

```css
.hero-bento-carousel .card {
  box-shadow: var(--pipod-shadow-md);
  border-radius: 0.75rem;
}

.hero-bento-carousel .card:hover {
  box-shadow: var(--pipod-shadow-lg);
}
```

### `complexNavbar.tsx` and `complexNavbarDark.tsx`

```css
.nav-gradient {
  background: var(--pipod-gradient-dark);
}

.bg-gradient-secondary {
  background: var(--pipod-gradient-secondary);
}
```

### `checkoutOrderSummary.tsx`

```css
.order-summary-gradient {
  background: var(--pipod-gradient-dark);
}
```

## Implementation Location

**Option B (RECOMMENDED):** Create `src/styles/_pipod-utilities.css` and import in `src/app/globals.css`:

```css
@import './_pipod-utilities.css';
```

## Scenarios

### Scenario: Apply shadow utility to card component

- GIVEN a card component needs elevation
- WHEN `.shadow-md` class is applied
- THEN card MUST display `0 4px 15px rgba(0,0,0,0.08)` shadow

### Scenario: Text gradient renders correctly

- GIVEN an element with `.text-gradient` class
- WHEN rendered in browser
- THEN text MUST display blue-to-cyan gradient using `-webkit-text-fill-color: transparent`

### Scenario: Button dark hover state

- GIVEN a button with `.btn-dark` class
- WHEN user hovers over button
- THEN background MUST change from `#1a1a1a` to `#000000`

### Scenario: Remove astro-ecommerce.scss dependency

- GIVEN all utility classes and tokens are implemented
- WHEN verified all components work correctly
- THEN the `astro-ecommerce.scss` import MUST be removed from Layout.astro
