'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StrategyData,
  StoredStrategyData,
  ManualInputs,
  Goal,
  CalculatedMetrics,
  DEFAULT_STORED_DATA,
  StrategyChatMessage,
} from '@/lib/strategy-types';
import { calculateMetrics } from '@/lib/strategy-calculations';
import { Transaccion } from '@/types';
import { supabase } from '@/lib/supabase';

const STRATEGY_STORAGE_KEY = 'pipod_strategy';
const MAX_CHAT_MESSAGES = 40;
const CURRENT_VERSION = 1;

interface UseStrategyDataReturn {
  strategyData: StrategyData;
  chatHistory: StrategyChatMessage[];
  isLoading: boolean;
  updateManualInputs: (inputs: Partial<ManualInputs>) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  recalculateMetrics: (transactions: Transaccion[]) => void;
  addChatMessage: (message: StrategyChatMessage) => void;
  clearChat: () => void;
  resetStrategyData: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function migrateIfNeeded(data: StoredStrategyData): StoredStrategyData {
  if (!data.version || data.version < CURRENT_VERSION) {
    return { ...data, version: CURRENT_VERSION };
  }
  return data;
}

function saveToLocalStorage(data: StoredStrategyData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STRATEGY_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('[StrategyData] Save error:', err);
  }
}

function loadFromLocalStorage(): StoredStrategyData {
  if (typeof window === 'undefined') return DEFAULT_STORED_DATA;
  try {
    const stored = localStorage.getItem(STRATEGY_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as StoredStrategyData;
      const migrated = migrateIfNeeded(parsed);
      return migrated;
    }
  } catch (err) {
    console.error('[StrategyData] Load error:', err);
  }
  return DEFAULT_STORED_DATA;
}

export function useStrategyData(): UseStrategyDataReturn {
  const [storedData, setStoredData] = useState<StoredStrategyData>(DEFAULT_STORED_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaccion[]>([]);

  useEffect(() => {
    const loaded = loadFromLocalStorage();
    setStoredData(loaded);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveToLocalStorage(storedData);
    }
  }, [storedData, isLoading]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('transacciones')
          .select('*')
          .eq('user_id', user.id)
          .order('fecha', { ascending: false })
          .limit(1000);

        if (error) throw error;
        setTransactions(data || []);
      } catch (err) {
        console.error('[StrategyData] Fetch transactions error:', err);
      }
    }
    fetchTransactions();
  }, []);

  const calculatedMetrics: CalculatedMetrics = useMemo(() => {
    if (storedData.calculatedMetrics && transactions.length === 0) {
      return storedData.calculatedMetrics;
    }
    return calculateMetrics({
      transactions,
      fixedCosts: storedData.manualInputs.fixedCosts,
      currentCash: storedData.manualInputs.currentCash,
      targetMargin: storedData.manualInputs.targetMargin,
      burnRateMonths: storedData.settings.burnRateMonths,
    });
  }, [
    transactions,
    storedData.manualInputs.fixedCosts,
    storedData.manualInputs.currentCash,
    storedData.manualInputs.targetMargin,
    storedData.settings.burnRateMonths,
    storedData.calculatedMetrics,
    isLoading,
  ]);

  const strategyData: StrategyData = useMemo(() => ({
    manualInputs: storedData.manualInputs,
    calculatedMetrics,
    lastUpdated: new Date().toISOString(),
    period: {
      quarterly: {
        start: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1).toISOString(),
        end: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3 + 3, 0).toISOString(),
      },
      monthly: {
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
      },
    },
    goals: storedData.goals,
    settings: storedData.settings,
  }), [storedData, calculatedMetrics]);

  const updateManualInputs = useCallback((inputs: Partial<ManualInputs>) => {
    setStoredData((prev) => ({
      ...prev,
      manualInputs: {
        ...prev.manualInputs,
        ...inputs,
      },
    }));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: generateId(),
    };
    setStoredData((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setStoredData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setStoredData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  }, []);

  const recalculateMetrics = useCallback((newTransactions: Transaccion[]) => {
    setTransactions(newTransactions);
  }, []);

  const addChatMessage = useCallback((message: StrategyChatMessage) => {
    setStoredData((prev) => {
      const newHistory = [...prev.chatHistory, message].slice(-MAX_CHAT_MESSAGES);
      return {
        ...prev,
        chatHistory: newHistory,
      };
    });
  }, []);

  const clearChat = useCallback(() => {
    setStoredData((prev) => ({
      ...prev,
      chatHistory: [],
    }));
  }, []);

  const resetStrategyData = useCallback(() => {
    setStoredData(DEFAULT_STORED_DATA);
  }, []);

  return {
    strategyData,
    chatHistory: storedData.chatHistory,
    isLoading,
    updateManualInputs,
    addGoal,
    updateGoal,
    deleteGoal,
    recalculateMetrics,
    addChatMessage,
    clearChat,
    resetStrategyData,
  };
}
