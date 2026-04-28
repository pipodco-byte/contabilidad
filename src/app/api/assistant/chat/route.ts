import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { deepseek } from '@ai-sdk/deepseek'
import { buildSystemPrompt } from '@/lib/assistant-prompt'
import {
  RegistrarTransaccionSchema,
  LoteTransaccionesSchema,
  generarTransaccionBold,
  calcularComisionBold,
} from '@/lib/assistant-tools'
import { zodSchema } from 'ai'

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

    const today = new Date()

    console.log('[Gema] Request received:', messages.length, 'messages')
    console.log('[Gema] Today:', today.toISOString())

    const tools = {
      registrar_lote_transacciones: {
        description: 'Registra múltiples transacciones a partir de un dictamen',
        inputSchema: zodSchema(LoteTransaccionesSchema),
        execute: async ({ transacciones }: { transacciones: any[] }) => {
          console.log('[Gema] execute called with', transacciones)
          return await handleLoteTransaction(transacciones)
        },
      },
    }

    const result = await generateText({
      model: deepseek('deepseek-chat'),
      system: buildSystemPrompt(today),
      messages,
      tools,
      toolChoice: 'auto',
    })

    console.log('[Gema] text response:', result.text?.substring(0, 100), '...')
    console.log('[Gema] toolCalls:', result.toolCalls)
    console.log('[Gema] toolResults:', result.toolResults)

    return Response.json({
      role: 'assistant',
      content: result.text,
      toolResults: result.toolResults,
    })
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
    .from('cont_transacciones')
    .insert({
      user_id: request.headers.get('x-user-id') || 'ca85a0bc-2e6e-4887-bf75-930f4dd34880',
      fecha: parseDate(data.fecha),
      descripcion: data.descripcion,
      categoria: data.categoria,
      sub_categoria: data.sub_categoria || 'N/A',
      monto: data.monto,
      tipo: data.tipo,
      medio_pago: data.medio_pago,
      estado_iva: data.estado_iva,
      comentarios: data.comentarios || null,
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
      .from('cont_transacciones')
      .insert({
        user_id: request.headers.get('x-user-id') || 'ca85a0bc-2e6e-4887-bf75-930f4dd34880',
        fecha: parseDate(data.fecha),
        descripcion: boldData.descripcion,
        categoria: boldData.categoria,
        sub_categoria: boldData.sub_categoria || 'N/A',
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

async function handleLoteTransaction(
  transacciones: Array<{
    fecha?: string
    descripcion: string
    monto: number
    tipo: 'Ingreso' | 'Egreso'
    medio_pago?: string
    categoria?: string
    sub_categoria?: string
    estado_iva?: string
    comentarios?: string
  }>
) {
  console.log('[Gema] handleLoteTransaction called with', transacciones.length, 'items')

  const results = []

  for (const transaccion of transacciones) {
    try {
      const { data, error } = await supabase
        .from('cont_transacciones')
        .insert({
          user_id: 'ca85a0bc-2e6e-4887-bf75-930f4dd34880',
          fecha: transaccion.fecha ? parseDate(transaccion.fecha) : new Date().toISOString().split('T')[0],
          descripcion: transaccion.descripcion,
          monto: transaccion.monto,
          tipo: transaccion.tipo,
          medio_pago: transaccion.medio_pago || 'Efectivo',
          categoria: transaccion.categoria || 'Otros',
          sub_categoria: (transaccion.sub_categoria && transaccion.sub_categoria.trim()) 
            ? transaccion.sub_categoria 
            : 'N/A',
          estado_iva: transaccion.estado_iva || 'Exento',
          comentarios: transaccion.comentarios || null,
        })
        .select()
        .single()

      if (error) {
        console.error('[Gema] Insert error:', error)
        results.push({ error: error.message })
      } else {
        console.log('[Gema] Inserted:', data.id)
        results.push({ success: true, transaction: data })
      }
    } catch (err) {
      console.error('[Gema] Exception:', err)
      results.push({ error: 'Excepción' })
    }
  }

  return results
}

function parseDate(dateStr: string): string {
  const [day, month, year] = dateStr.split('/')
  return `${year}-${month}-${day}`
}