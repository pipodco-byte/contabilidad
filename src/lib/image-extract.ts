export interface ExtractedData {
  monto?: number
  fecha?: string
  medio_pago?: string
  referencia?: string
  estado?: string
}

const MONTHS: Record<string, string> = {
  'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
  'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
  'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
}

function parseMonth(monthStr: string): string {
  const lower = monthStr.toLowerCase().trim()
  return MONTHS[lower] || '01'
}

export function extractDataFromText(text: string): ExtractedData {
  const result: ExtractedData = {}

  const montoMatch = text.match(/\$\s*([\d.]+(?:,\d{2})?)/)
  if (montoMatch) {
    const montoStr = montoMatch[1].replace(/\./g, '').replace(',', '.')
    result.monto = Math.round(parseFloat(montoStr))
  }

  const fechaMatch = text.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i)
  if (fechaMatch) {
    const day = fechaMatch[1].padStart(2, '0')
    const month = parseMonth(fechaMatch[2])
    const year = fechaMatch[3]
    result.fecha = `${day}/${month}/${year}`
  }

  const medioPagoMatch = text.match(/(daviplata|nequi|bre-b|davivienda|efectivo|transferencia|banco)/i)
  if (medioPagoMatch) {
    const mp = medioPagoMatch[1].toLowerCase()
    if (mp.includes('nequi') || mp.includes('daviplata') || mp.includes('bre-b')) {
      result.medio_pago = mp.charAt(0).toUpperCase() + mp.slice(1)
    } else if (mp.includes('davivienda')) {
      result.medio_pago = 'Davivienda'
    } else if (mp.includes('efectivo')) {
      result.medio_pago = 'Efectivo'
    } else if (mp.includes('transferencia') || mp.includes('banco')) {
      result.medio_pago = 'Transferencia'
    }
  }

  const referenciaMatch = text.match(/(?:n[úu]mero\s+de\s+aprobaci[óo]n|n[úu]mero\s+referencia|ref|aprobaci[óo]n)[:\s]*(\d+)/i)
  if (referenciaMatch) {
    result.referencia = referenciaMatch[1]
  }

  if (text.includes('exitosa') || text.includes('exitoso') || text.includes('completada') || text.includes('completado')) {
    result.estado = 'Exitosa'
  }

  return result
}

export function generateDescriptionFromReference(referencia?: string): string {
  if (referencia) {
    return `Ref: ${referencia}`
  }
  return 'Screenshot bancario'
}

export function formatFechaAsDDMMYYYY(fechaStr: string): string {
  return fechaStr
}