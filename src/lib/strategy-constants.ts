export const FINANCIAL_PLAN = {
  fixedCosts: 12149400,
  breakEven: 40498000,
  businessGoal: 50000000,
  targetMargin: 0.30,
  currency: 'COP',
} as const;

export const FIXED_COSTS_BREAKDOWN = [
  { label: 'Nóminas', amount: 8000000 },
  { label: 'Mensajero', amount: 1500000 },
  { label: 'Arriendo', amount: 1200000 },
  { label: 'Servicios', amount: 500000 },
  { label: 'Marketing', amount: 500000 },
  { label: 'Otros', amount: 394400 },
] as const;