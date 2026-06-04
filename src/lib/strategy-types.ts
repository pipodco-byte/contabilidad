export interface FixedCost {
  id: string;
  label: string;
  amount: number;
}

export interface ManualInputs {
  fixedCosts: FixedCost[];
  currentCash: number;
  targetMargin: number;
}

export interface CalculatedMetrics {
  burnRate: number;
  breakEven: number;
  runway: number;
  profitMarginQuarterly: number;
  profitMarginMonthly: number;
  avgRevenue: number;
  avgVariableCosts: number;
  marginTrend: number;
  safetyBuffer: number;
  historicalMargins: Array<{ month: string; margin: number }>;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  status: 'on_track' | 'at_risk' | 'completed';
  category: 'savings' | 'investment' | 'debt_payment';
}

export interface StrategySettings {
  burnRateMonths: number;
  currency: string;
}

export interface Period {
  quarterly: { start: string; end: string };
  monthly: { start: string; end: string };
}

export interface StrategyData {
  manualInputs: ManualInputs;
  calculatedMetrics: CalculatedMetrics;
  lastUpdated: string;
  period: Period;
  goals: Goal[];
  settings: StrategySettings;
}

export interface StrategyChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface StoredStrategyData extends Omit<StrategyData, 'calculatedMetrics'> {
  calculatedMetrics: CalculatedMetrics | null;
  chatHistory: StrategyChatMessage[];
  version: number;
}

function getQuarterStart(): string {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3);
  const start = new Date(now.getFullYear(), quarter * 3, 1);
  return start.toISOString();
}

function getQuarterEnd(): string {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3);
  const end = new Date(now.getFullYear(), quarter * 3 + 3, 0);
  return end.toISOString();
}

function getMonthStart(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

function getMonthEnd(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
}

export const DEFAULT_STRATEGY_DATA: StrategyData = {
  manualInputs: {
    fixedCosts: [],
    currentCash: 0,
    targetMargin: 20,
  },
  calculatedMetrics: {
    burnRate: 0,
    breakEven: 0,
    runway: 0,
    profitMarginQuarterly: 0,
    profitMarginMonthly: 0,
    avgRevenue: 0,
    avgVariableCosts: 0,
    marginTrend: 0,
    safetyBuffer: 0,
    historicalMargins: [],
  },
  lastUpdated: new Date().toISOString(),
  period: {
    quarterly: {
      start: getQuarterStart(),
      end: getQuarterEnd(),
    },
    monthly: {
      start: getMonthStart(),
      end: getMonthEnd(),
    },
  },
  goals: [],
  settings: {
    burnRateMonths: 3,
    currency: 'MXN',
  },
};

export const DEFAULT_STORED_DATA: StoredStrategyData = {
  ...DEFAULT_STRATEGY_DATA,
  calculatedMetrics: null,
  chatHistory: [],
  version: 1,
};

export function getRunwayBadge(runway: number): { color: 'success' | 'warning' | 'danger'; label: string; emoji: string } {
  if (runway > 12) return { color: 'success', label: 'SALUDABLE', emoji: '🟢' };
  if (runway >= 6) return { color: 'warning', label: 'CUIDADO', emoji: '🟡' };
  if (runway >= 3) return { color: 'warning', label: 'RIESGO', emoji: '🟠' };
  return { color: 'danger', label: 'CRÍTICO', emoji: '🔴' };
}
