import type { Enquiry } from '../types'

// Integration point for owner notifications.
//
// A browser can't send WhatsApp messages on its own. To notify the owner
// automatically when an enquiry arrives, implement this on a backend, e.g.:
//   - WhatsApp Business Cloud API (Meta) with an approved message template
//   - A Supabase Edge Function / serverless function triggered on insert
//   - An automation tool (Zapier, Make, n8n) receiving a webhook
// Then call that endpoint from here.

export const notificationService = {
  async newEnquiry(_enquiry: Enquiry): Promise<void> {
    // Intentionally empty in the frontend-only demo.
  },
}
