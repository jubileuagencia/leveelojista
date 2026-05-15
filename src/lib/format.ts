export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatCNPJ(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '')
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) {
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  }
  return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
}

export function formatCEP(cep: string): string {
  return cep.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

export function formatOrderNumber(num: number): string {
  return `#${num}`
}

// Fractional quantities (kg) — adaptive g/kg unit:
//   < 1kg → grams ("500g", "100g", "50g")
//   ≥ 1kg → kilograms with pt-BR decimal ("1kg", "1,5kg", "20kg")
// No trailing zero on whole kilos, no space between number and unit.
// Non-fractional quantities are not handled here — call sites keep their own integer formatting.
export function formatFractionalQty(qty: number): string {
  if (qty < 1) {
    const grams = Math.round(qty * 1000)
    return `${grams}g`
  }
  const isWhole = Number.isInteger(qty)
  const kg = isWhole ? String(qty) : qty.toFixed(1).replace('.', ',')
  return `${kg}kg`
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
