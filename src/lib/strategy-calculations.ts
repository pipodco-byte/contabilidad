import { Transaccion } from '@/types';

export interface CalculationInput {
  transactions: Transaccion[];
  fixedCosts: Array<{ label: string; amount: number }>;
  currentCash: number;
  targetMargin: number;
  burnRateMonths?: number;
}

export interface CalculatedMetrics {
  burnRate: number;
  breakEven: number;
  runway: number;
  profitMarginMonthly: number;
  profitMarginQuarterly: number;
  avgRevenue: number;
  avgVariableCosts: number;
  marginTrend: number;
  safetyBuffer: number;
  historicalMargins: Array<{ month: string; margin: number }>;
}

function parseFechaStr(fechaStr: string): { year: number; month: number } {
  const parts = fechaStr.split('-').map(Number);
  return { year: parts[0], month: parts[1] };
}

function getLastNMonths(n: number, transactions: Transaccion[]): string[] {
  const months: string[] = [];

  let maxYear = new Date().getFullYear();
  let maxMonth = new Date().getMonth() + 1;

  if (transactions.length > 0) {
    const dates = transactions.map((t) => new Date(t.fecha + 'T12:00:00').getTime());
    const maxDate = new Date(Math.max(...dates));
    maxYear = maxDate.getFullYear();
    maxMonth = maxDate.getMonth() + 1;
  }

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(maxYear, maxMonth - 1 - i, 1);
    months.push(d.toLocaleString('es-MX', { year: 'numeric', month: 'short' }));
  }
  return months;
}

function getMonthKey(fechaStr: string): string {
  const { year, month } = parseFechaStr(fechaStr);
  return new Date(year, month - 1, 1).toLocaleString('es-MX', { year: 'numeric', month: 'short' });
}

interface MonthlyData {
  totalRevenue: number;
  totalExpenses: number;
  variableCosts: number;
  transactionCount: number;
}

function extractMonthlyData(
  transactions: Transaccion[],
  months: string[]
): Map<string, MonthlyData> {
  const monthlyMap = new Map<string, MonthlyData>();

  for (const month of months) {
    monthlyMap.set(month, {
      totalRevenue: 0,
      totalExpenses: 0,
      variableCosts: 0,
      transactionCount: 0,
    });
  }

  for (const t of transactions) {
    const monthKey = getMonthKey(t.fecha);

    if (monthlyMap.has(monthKey)) {
      const data = monthlyMap.get(monthKey)!;
      data.transactionCount++;

      if (t.tipo === 'Ingreso') {
        data.totalRevenue += t.monto;
      } else {
        data.totalExpenses += t.monto;
        data.variableCosts += t.monto;
      }
    }
  }

  return monthlyMap;
}

export function calculateMetrics(input: CalculationInput): CalculatedMetrics {
  const { transactions, fixedCosts, currentCash, targetMargin, burnRateMonths = 3 } = input;

  if (transactions.length === 0) {
    const totalFixedCosts = fixedCosts.reduce((sum, fc) => sum + fc.amount, 0);
    return {
      burnRate: 0,
      breakEven: totalFixedCosts > 0 && targetMargin > 0
        ? Math.round(totalFixedCosts / (targetMargin / 100))
        : 0,
      runway: 0,
      profitMarginMonthly: 0,
      profitMarginQuarterly: 0,
      avgRevenue: 0,
      avgVariableCosts: 0,
      marginTrend: 0,
      safetyBuffer: totalFixedCosts > 0 ? currentCash / totalFixedCosts : 0,
      historicalMargins: [],
    };
  }

  const months = getLastNMonths(6, transactions);
  const monthlyData = extractMonthlyData(transactions, months);

  const monthsForBurnRate = getLastNMonths(burnRateMonths, transactions);
  const burnRateData = extractMonthlyData(transactions, monthsForBurnRate);

  let totalExpensesForBurn = 0;
  let totalRevenueForBurn = 0;
  let count = 0;

  burnRateData.forEach((data) => {
    totalExpensesForBurn += data.totalExpenses;
    totalRevenueForBurn += data.totalRevenue;
    if (data.transactionCount > 0) count++;
  });

  const avgExpenses = count > 0 ? totalExpensesForBurn / count : 0;
  const burnRate = Math.round(avgExpenses);

  let totalRevenue = 0;
  let totalVariableCosts = 0;
  let transactionCount = 0;

  monthlyData.forEach((data) => {
    totalRevenue += data.totalRevenue;
    totalVariableCosts += data.variableCosts;
    transactionCount += data.transactionCount;
  });

  const avgRevenue = transactionCount > 0 ? totalRevenue / Math.min(transactionCount, 6) : 0;
  const avgVariableCosts = transactionCount > 0 ? totalVariableCosts / Math.min(transactionCount, 6) : 0;

  const monthlyMargins: number[] = [];
  monthlyData.forEach((data) => {
    const margin = data.totalRevenue > 0
      ? ((data.totalRevenue - data.totalExpenses) / data.totalRevenue) * 100
      : 0;
    monthlyMargins.push(margin);
  });

  const profitMarginMonthly = monthlyMargins[monthlyMargins.length - 1] || 0;
  const recentMargins = monthlyMargins.slice(-3);
  const profitMarginQuarterly = recentMargins.length > 0
    ? recentMargins.reduce((a, b) => a + b, 0) / recentMargins.length
    : 0;

  const marginTrend = monthlyMargins.length >= 2
    ? monthlyMargins[monthlyMargins.length - 1] - monthlyMargins[monthlyMargins.length - 2]
    : 0;

  const historicalMargins = months.map((month, i) => ({
    month,
    margin: Math.round((monthlyMargins[i] || 0) * 100) / 100,
  }));

  const totalFixedCosts = fixedCosts.reduce((sum, fc) => sum + fc.amount, 0);
  const profitMarginDecimal = profitMarginMonthly / 100 || targetMargin / 100;
  const breakEven = profitMarginDecimal > 0
    ? Math.round(totalFixedCosts / profitMarginDecimal)
    : totalFixedCosts * 5;

  const runway = burnRate > 0 ? currentCash / burnRate : 0;
  const safetyBuffer = totalFixedCosts > 0 ? currentCash / totalFixedCosts : 0;

  return {
    burnRate,
    breakEven,
    runway: Math.round(runway * 10) / 10,
    profitMarginMonthly: Math.round(profitMarginMonthly * 100) / 100,
    profitMarginQuarterly: Math.round(profitMarginQuarterly * 100) / 100,
    avgRevenue: Math.round(avgRevenue),
    avgVariableCosts: Math.round(avgVariableCosts),
    marginTrend: Math.round(marginTrend * 100) / 100,
    safetyBuffer: Math.round(safetyBuffer * 10) / 10,
    historicalMargins,
  };
}
