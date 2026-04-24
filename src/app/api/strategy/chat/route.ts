import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';
import { buildStrategyContextMessage, STRATEGY_ADVISOR_SYSTEM_PROMPT } from '@/lib/strategy-prompt';
import { StrategyData, StrategyChatMessage } from '@/lib/strategy-types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { message, strategyData, history } = await request.json() as {
      message: string;
      strategyData: StrategyData;
      history: StrategyChatMessage[];
    };

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const contextMessage = buildStrategyContextMessage(strategyData);

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: STRATEGY_ADVISOR_SYSTEM_PROMPT },
      { role: 'system', content: contextMessage },
    ];

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
      model: deepseek('deepseek-chat'),
      system: STRATEGY_ADVISOR_SYSTEM_PROMPT,
      messages: [
        { role: 'system', content: contextMessage },
        ...messages.filter(m => m.role !== 'system'),
      ],
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
