import { env } from './env'

export function whatsappLink(message: string): string {
  return `https://wa.me/${env.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export function whatsappLinkFromLead(data: {
  name: string
  phone: string
  city: string
  neighborhood: string
  serviceType: string
  description: string
  budgetRange: string
  desiredTimeline: string
  notes: string
}): string {
  const message = [
    `Olá! Acabei de solicitar um orçamento pelo site da ${env.companyName}.`,
    ``,
    `*Nome:* ${data.name}`,
    `*Telefone:* ${data.phone}`,
    `*Cidade:* ${data.city}`,
    `*Bairro:* ${data.neighborhood}`,
    `*Tipo de serviço:* ${data.serviceType}`,
    `*Faixa de orçamento:* ${data.budgetRange}`,
    `*Prazo desejado:* ${data.desiredTimeline}`,
    `*Descrição:* ${data.description}`,
    data.notes ? `*Observações:* ${data.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return whatsappLink(message)
}

export function whatsappLinkForLead(phone: string, name: string): string {
  const number = phone.replace(/\D/g, '')
  const message = `Olá, ${name}! Sou da ${env.companyName} e estou entrando em contato sobre sua solicitação de orçamento.`
  return `https://wa.me/55${number}?text=${encodeURIComponent(message)}`
}
