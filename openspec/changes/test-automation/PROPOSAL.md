# Proposal: Test Automation Setup

## Context

Proyecto sin tests automatizados. Cambios recientes en gráficos (Donut, Balance Line) necesitan verificación. Setup de Vitest + Testing Library beneficiaría desarrollo futuro.

## Vision

Infraestructura de tests que permita:
- Verificación automática de hooks críticos
- Tests de componentes UI
- Detección temprana de regresiones
- Pre-push validation automática

---

## Approach

### Fase 1: Setup
1. Instalar Vitest + Testing Library + jsdom
2. Configurar vitest.config.ts
3. Crear script `npm run test`

### Fase 2: Hook Tests
- `useEvolucionMensual.test.ts` (fix precisión)
- `useGraficas.test.ts` (Donut, Balance Line)

### Fase 3: Component Tests
- `Graficas.test.tsx` (snapshot)

### Fase 4: API Tests
- `/api/auth/login.test.ts`

### Fase 5: Pre-Push Hook
- Crear `.git/hooks/pre-push`
- Validar build + tests antes de push

---

## Dependencies

```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jsdom": "^24.0.0"
  }
}
```

---

## Pre-Push Hook Plan

### Opción Elegida: Pre-Push Hook Local

**Ubicación:** `.git/hooks/pre-push`

**Script:**
```bash
#!/bin/bash
echo "🔍 Running pre-push validation..."
npm run build || { echo "❌ Build failed"; exit 1; }
npm run test || { echo "❌ Tests failed"; exit 1; }
echo "✅ All checks passed!"
```

**Beneficios:**
- $0 en tokens IA
- No frena workflow (solo al push)
- Validación automática

---

## Estructura de Archivos a Crear

```
src/__tests__/
├── hooks/
│   ├── useEvolucionMensual.test.ts
│   └── useGraficas.test.ts
├── components/
│   └── Graficas.test.tsx
└── api/
    └── auth.test.ts

vitest.config.ts
.husky/
└── pre-push (symlink or copy)
```

---

## Success Metrics

- `npm run test` pasa sin errores
- Hooks críticos con tests
- Pre-push hook funciona
- Zero regressions en CI (cuando se active)

---

## Budget Consideration

- **GitHub Actions:** ~2000 min/mes gratis (repo público)
- **Local only:** $0 tokens
- **Recomendado:** Local pre-push + GitHub Actions cuando sea necesario

---

## Status

- [x] PROPOSAL.md creado
- [ ] vitest.config.ts
- [ ] Dependencies instaladas
- [ ] Hook tests
- [ ] Component tests
- [ ] API tests
- [ ] Pre-push hook
