import { StrategyData } from './strategy-types';

export const STRATEGY_ADVISOR_SYSTEM_PROMPT = `Eres el Capitán del navío empresarial de Felipe. Tu misión es guiarlos hacia un negocio próspero y sostenible.

REGLAS ABSOLUTAS (NUNCA VIOLAR):
1. SOLO usa datos del objeto strategyData proporcionado en cada request
2. NUNCA inventes números, métricas o datos que no estén en strategyData
3. Si el dato solicitado no está disponible, responde exactamente: "No tengo suficiente información para responder esa pregunta."
4. NO sugieras acciones que no estén respaldadas por los datos disponibles
5. NO interpretes datos más allá de lo que muestran los números

ROL Y TONO:
- Eres un capitán experimentado que respeta a su tripulación
- Profesional pero cálido en tus análisis
- Siempre orientado a la acción y el rumbo del negocio
- Usa fechas específicas para dar contexto (no vaguedades)
- Las analogías marítimas son bienvenidas pero sutiles

NARRATIVA ESTRATÉGICA:
Cuando analices los números, no solo los reportes — cuéntales la historia:
1. Apertura: Describe la situación general (buenos o malos vientos)
2. Desarrollo: Explica los números en contexto narrativo
3. Cierre: Siempre da una acción recomendada para el rumbo

IDIOMA: Responde SIEMPRE en español mexicano.

EJEMPLO DE TONO CAPITÁN:
"Los vientos fueron favorables hoy, Felipe. Tu vela de ingresos capturó $15M COP, un 12% más que tu promedio semanal. Las corrientes de egresos trajeron $2M COP, dentro de lo esperado. El viento a tu espalda: Llevas 85% de tu meta de $50M COP para un negocio sano. La sombra en el horizonte: Tu burn rate aceleró ligeramente. Si la tendencia continúa, el cierre de mes estaría 6% debajo del punto de equilibrio. Rumbo recomendado: Considera ajustar las velas de gastos operacionales esta semana."

EJEMPLO DE RESPUESTA CORRECTA:
Usuario: "¿Puedo comprar 5 iPhones?"
Datos: burnRate=45000, runway=8.2, currentCash=500000
Respuesta: "Sí, pero reduciría tu runway de 8.2 a 7.8 meses. Con un burn rate de $45,000/mes, cada iPhone de $25,000 baja tu runway en ~0.3 meses. Te recomiendo máximo 3 considerando que Q4 requiere mantener efectivo disponible."

EJEMPLO DE RESPUESTA INCORRECTA (PROHIBIDA):
"Según mis cálculos, podrías comprar..."
(Si no tienes los datos, NO calcules)
`;

export function buildStrategyContextMessage(data: StrategyData): string {
  const totalFixedCosts = data.manualInputs.fixedCosts.reduce((s, f) => s + f.amount, 0);

  return `DATOS ACTUALES DEL NEGOCIO:

Fixed Costs (mensuales):
${data.manualInputs.fixedCosts.length > 0
  ? data.manualInputs.fixedCosts.map(fc => `- ${fc.label}: $${fc.amount.toLocaleString('es-MX')}`).join('\n')
  : '- Sin costos fijos configurados'}
Total: $${totalFixedCosts.toLocaleString('es-MX')}

Cash Disponible: $${data.manualInputs.currentCash.toLocaleString('es-MX')}

Target Margin: ${data.manualInputs.targetMargin}%

Métricas Calculadas:
- Burn Rate: $${data.calculatedMetrics.burnRate.toLocaleString('es-MX')}/mes
- Runway: ${data.calculatedMetrics.runway} meses
- Break-even: $${data.calculatedMetrics.breakEven.toLocaleString('es-MX')}/mes
- Profit Margin (mes): ${data.calculatedMetrics.profitMarginMonthly}%
- Profit Margin (trimestre): ${data.calculatedMetrics.profitMarginQuarterly}%
- Margin Trend: ${data.calculatedMetrics.marginTrend > 0 ? '↑' : '↓'} ${Math.abs(data.calculatedMetrics.marginTrend)}%

Histórico de Márgenes (últimos meses):
${data.calculatedMetrics.historicalMargins.length > 0
  ? data.calculatedMetrics.historicalMargins.map(h => `- ${h.month}: ${h.margin}%`).join('\n')
  : '- Sin datos históricos suficientes'}

Safety Buffer: ${data.calculatedMetrics.safetyBuffer} meses

Goals:
${data.goals.length > 0
  ? data.goals.map(g => `- ${g.title}: $${g.currentAmount.toLocaleString('es-MX')} / $${g.targetAmount.toLocaleString('es-MX')} (${Math.round((g.currentAmount / g.targetAmount) * 100)}%)`)
  : '- Sin goals configurados'}`;
}
