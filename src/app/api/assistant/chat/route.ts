import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { streamText } from 'ai'
import { deepseek } from '@ai-sdk/deepseek'
import { buildSystemPrompt } from '@/lib/assistant-prompt'
import {
  RegistrarTransaccionSchema,
  generarTransaccionBold,
  calcularComisionBold,
  tools,
} from '@/lib/assistant-tools'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { messages, pendingTransaction } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    if (pendingTransaction) {
      const result = await handleTransaction(pendingTransaction, request)
      return result
    }

    const result = await streamText({
      model: deepseek('deepseek-chat'),
      system: buildSystemPrompt(),
      messages,
      tools: tools as any,
      toolChoice: 'auto',
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('[Copilot API Error]:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    )
  }
}

async function handleTransaction(
  transaction: unknown,
  request: NextRequest
): Promise<NextResponse> {
  const parseResult = RegistrarTransaccionSchema.safeParse(transaction)

  if (!parseResult.success) {
    return NextResponse.json(
      {
        type: 'error',
        message: `Datos inválidos: ${parseResult.error.errors.map((e) => e.message).join(', ')}`,
      },
      { status: 400 }
    )
  }

  const data = parseResult.data

  const { data: insertedParent, error: parentError } = await supabase
    .from('transacciones')
    .insert({
      user_id: request.headers.get('x-user-id') || 'anonymous',
      fecha: parseDate(data.fecha),
      descripcion: data.descripcion,
      categoria: data.categoria,
      sub_categoria: data.sub_categoria,
      monto: data.monto,
      tipo: data.tipo,
      medio_pago: data.medio_pago,
      estado_iva: data.estado_iva,
      comentarios: data.comentarios,
    })
    .select()
    .single()

  if (parentError) {
    return NextResponse.json(
      {
        type: 'error',
        message: `Error al registrar transacción: ${parentError.message}`,
      },
      { status: 500 }
    )
  }

  let boldTransaction = null
  let comisionMonto = 0

  if (data.medio_pago === 'Bold') {
    comisionMonto = calcularComisionBold(data.monto)
    const boldData = generarTransaccionBold(data, insertedParent.id)

    const { data: insertedBold, error: boldError } = await supabase
      .from('transacciones')
      .insert({
        user_id: request.headers.get('x-user-id') || 'anonymous',
        fecha: parseDate(data.fecha),
        descripcion: boldData.descripcion,
        categoria: boldData.categoria,
        sub_categoria: boldData.sub_categoria,
        monto: comisionMonto,
        tipo: 'Egreso',
        medio_pago: data.medio_pago,
        estado_iva: 'N/A',
        comentarios: boldData.comentarios,
        parent_id: insertedParent.id,
      })
      .select()
      .single()

    if (boldError) {
      console.error('[Copilot] Bold insert error:', boldError)
    } else {
      boldTransaction = insertedBold
    }
  }

  return NextResponse.json({
    type: 'success',
    message: `Transacción registrada${boldTransaction ? ` y comisión Bold del 5% ($${comisionMonto.toLocaleString('es-CO')})` : ''}`,
    transaction: insertedParent,
    boldTransaction,
  })
}

function parseDate(dateStr: string): string {
  const [day, month, year] = dateStr.split('/')
  return `${year}-${month}-${day}`
}