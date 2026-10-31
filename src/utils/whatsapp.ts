// WhatsApp click-to-chat. The browser can only *open* WhatsApp with a
// prefilled message; the guest still taps send. Silent owner notifications
// need the WhatsApp Business API on a backend (see services/notificationService).

export function normalizeWhatsAppNumber(raw: string): string {
  return raw.replace(/\D/g, '').replace(/^00/, '')
}

export function whatsappLink(number: string, message?: string): string {
  const n = normalizeWhatsAppNumber(number)
  const base = `https://wa.me/${n}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export interface EnquiryMessageInput {
  propertyName: string
  name?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  estimate?: string
  reference?: string
  phone?: string
  requests?: string
}

export function enquiryMessage(i: EnquiryMessageInput): string {
  const lines = [`Hello! I am interested in booking ${i.propertyName}.`]
  if (i.reference) lines.push(`Enquiry ref: ${i.reference}`)
  if (i.name) lines.push(`Name: ${i.name}`)
  if (i.phone) lines.push(`Phone: ${i.phone}`)
  if (i.checkIn) lines.push(`Check-in: ${i.checkIn}`)
  if (i.checkOut) lines.push(`Check-out: ${i.checkOut}`)
  if (i.guests) lines.push(`Guests: ${i.guests}`)
  if (i.estimate) lines.push(`Estimated Price: ${i.estimate}`)
  if (i.requests) lines.push(`Special requests: ${i.requests}`)
  lines.push('Please share availability and further details.')
  return lines.join('\n')
}

/**
 * Link to message a guest. If they typed a local 10-digit number, assume the
 * same country code as the business number.
 */
export function guestWhatsAppLink(guestPhone: string, businessNumber: string, message: string): string {
  let n = normalizeWhatsAppNumber(guestPhone).replace(/^0+/, '')
  const biz = normalizeWhatsAppNumber(businessNumber)
  if (n.length === 10 && biz.length > 10) n = biz.slice(0, biz.length - 10) + n
  return whatsappLink(n, message)
}
