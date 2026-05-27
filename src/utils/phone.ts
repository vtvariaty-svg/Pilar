export function onlyDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function normalizeBrazilPhone(phone: string): string {
  const digits = onlyDigits(phone)
  if (digits.startsWith('55') && digits.length > 11) {
    return digits.slice(2)
  }
  return digits
}

export function formatBrazilPhone(phone: string): string {
  const digits = normalizeBrazilPhone(phone)
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return phone
}
