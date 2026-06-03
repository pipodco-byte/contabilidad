import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';
import { buildStrategyContextMessage, STRATEGY_ADVISOR_SYSTEM_PROMPT } from '@/lib/strategy-prompt';
import { StrategyData, StrategyChatMessage } from '@/lib/strategy-types';
import { FINANCIAL_PLAN } from '@/lib/strategy-constants';
import { createServerClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function getFinancialContext(userId: string) {
  try {
    const supabase = createServerClient();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('vw_monthly_financial_summary')
      .select('ventas_totales, egresos_totales')
      .eq('user_id', userId)
      .gte('mes', monthStart)
      .lte('mes', monthEnd)
      .single();

    if (error || !data) {
      console.log('[Strategy] No financial data for current month');
      return null;
    }

    const ventas = data.ventas_totales || 0;
    const egresos = data.egresos_totales || 0;
    const utilidadNeta = ventas - egresos - FINANCIAL_PLAN.fixedCosts;

    return {
      ventas,
      egresos,
      gastos_fijos: FINANCIAL_PLAN.fixedCosts,
      utilidad_neta: utilidadNeta,
      mes: now.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }),
      break_even: FINANCIAL_PLAN.breakEven,
      meta: FINANCIAL_PLAN.businessGoal,
      pct_vs_meta: Math.round((ventas / FINANCIAL_PLAN.businessGoal) * 100),
      pct_vs_break_even: Math.round((ventas / FINANCIAL_PLAN.breakEven) * 100),
    };
  } catch (error) {
    console.error('[Strategy] Error fetching financial context:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, strategyData, history, userId } = await request.json() as {
      message: string;
      strategyData: StrategyData;
      history: StrategyChatMessage[];
      userId?: string;
    };

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const contextMessage = buildStrategyContextMessage(strategyData);

    const financialContext = userId ? await getFinancialContext(userId) : null;
    let financialContextMessage = '';
    if (financialContext) {
      financialContextMessage = `
## 📊 Contexto Financiero Real (${financialContext.mes})
\`\`\`json
${JSON.stringify(financialContext, null, 2)}
\`\`\`

Usa estos datos reales para tu análisis. Si no hay transacciones (todo en 0), indica que no hay datos registrados aún.
`;
    }

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: STRATEGY_ADVISOR_SYSTEM_PROMPT },
      { role: 'system', content: contextMessage },
    ];

    if (financialContextMessage) {
      messages.push({ role: 'system', content: financialContextMessage });
    }

    if (history && history.length > 0) {
      history.forEach((msg) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    messages.push({ role: 'user', content: message });

    const result = await streamText({
      model: deepseek('deepseek-v4-flash'),
      system: STRATEGY_ADVISOR_SYSTEM_PROMPT + financialContextMessage,
      messages: messages.filter(m => m.role !== 'system'),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[/api/strategy/chat] Error:', error);
    return NextResponse.json(
      { error: 'Error communicating with DeepSeek' },
      { status: 500 }
    );
  }
}
