# AirBNB.ai: boutique stays in Gurgaon

A premium, owner-run short-stay site for a few homes in Gurgaon (near DLF Cyber City, Golf Course Road and Sector 29) with a public booking-enquiry website and a separate owner dashboard at `/admin`.
Built with React, TypeScript, Tailwind CSS v4, React Router and Lucide icons on Vite.

> **This is a frontend-only prototype.** Data is saved in the browser's localStorage and the admin login is a demo. See "Before going live" below.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

**Demo admin login:** go to `/admin` and use `admin@demo.com` / `demo1234` (there is also a "Fill demo details" button).

When deploying the static build (Netlify, Vercel, Cloudflare Pages…), add an SPA fallback so routes like `/stays/casa-ivory-villa` serve `index.html`.

## What's included

### Gurgaon focus and Airbnb
- **Homepage photo**: meant to be DLF Cyber City Building 9A & 9B. Upload your own photo in Admin → Settings → Homepage photo (a placeholder glass-tower image is used until then). Only use photos you took or have permission to use.
- **Airbnb links**: each property has an optional Airbnb listing link (Admin → Properties → edit → Airbnb listing). When set, cards show "Also on Airbnb" and a "Book on Airbnb" button, and the property page shows "Book instantly on Airbnb" with the guest's dates and guest count passed through.
- **Layout ideas from cozycozy**: stay-type tiles under the hero, a listing grid with promo banners, neighbourhood tiles, an FAQ accordion, "Find a stay near…" link clusters (Cyber Hub, Building 9A & 9B, Golf Course Road, the airport…), saved stays (heart icon) and an app-style bottom tab bar on phones.
- Local content (areas, landmarks, FAQs) lives in `src/data/gurgaon.ts`. The three sample homes in `src/data/properties.ts` are placeholders; replace them with your real listings from the admin.

### Public website
- **Home**: full-screen hero, search (destination, dates, guests), featured homes, why book with us, experiences, testimonials (clearly labelled as samples), a "plan ahead" section that only uses real availability and real seasonal prices, footer with contact, WhatsApp, socials and policies.
- **Explore stays** (`/stays`): search by destination, filter by guests, max price and property type, sort by featured / price / capacity. When dates are chosen, each card shows whether it's free for those dates and the estimated total. Every card shows open nights in the next 30 days, straight from the calendar.
- **Property page** (`/stays/:slug`): mosaic gallery, thumbnails and full-screen lightbox (keyboard + swipe), overview, description, highlights, amenities with icons, live availability calendar (pick check-in/out; booked or blocked nights can't be selected), house rules, check-in/out times, map + nearby attractions, full pricing table, enquiry form, sticky booking card on desktop and sticky enquire bar on mobile.
- **Pricing engine** (`src/utils/pricing.ts`): per-night price with priority *special date price → seasonal price → weekend (Fri/Sat) → base*, plus extra-guest fees above the included guests and a one-time cleaning fee, all shown as separate lines.
- **Enquiry form** (`/enquire`, property page, contact page): validates name, phone, email, dates (no past check-in, check-out after check-in, min nights, no clashes with booked/blocked nights) and guest capacity. On submit it saves the enquiry, shows a reference and a clear "pending, not confirmed" message, and offers a prefilled WhatsApp message.
- **WhatsApp everywhere**: floating button, navbar, each property card, property page, enquiry success. Uses `https://wa.me/<number>?text=<url-encoded message>`; the number comes from Admin → Settings.
- About, Contact, Policies and 404 pages. Responsive from 360px up with no horizontal scroll.

### Owner dashboard (`/admin`)
- **Dashboard**: total properties, enquiries, awaiting action, confirmed and cancelled bookings, estimated revenue, enquiries-per-month chart, booking status breakdown, recent enquiries, upcoming bookings, per-property performance.
- **Properties**: add, edit, delete, publish/unpublish, feature. The editor covers name, type, location, descriptions, photos (upload with in-browser resizing or paste URLs, reorder, choose cover, alt text), guests/bedrooms/beds/bathrooms, amenities, highlights, house rules, check-in/out times, location and nearby places, base/weekend/seasonal pricing, included guests, extra-guest fee, cleaning fee and minimum nights.
- **Availability**: per-property calendar with colour coding. Select dates (Shift-click for ranges) to mark available, block, mark booked (for offline bookings) or set a special nightly price. Confirmed bookings hold their dates automatically.
- **Enquiries**: inbox with status filters and search, detail view with status changes (New, Contacted, Pending, Confirmed, Rejected, Cancelled), internal notes, WhatsApp/call/email the guest, calendar-conflict check, and convert to booking.
- **Bookings**: list with filters, detail view with price breakdown, confirm / cancel / complete / reopen, modify dates, guests, property and amount (with "recalculate from rates"), and add bookings manually. **Overlapping confirmed bookings are rejected**, as are confirmations over blocked dates. Booking status changes update the linked enquiry.
- **Settings**: business name, logo, tagline, WhatsApp number (with a test link), phone, email, address, social links, currency, default check-in/out times, booking/cancellation/privacy policies, and tools to remove the demo data or reset everything.

Changes in the dashboard show on the public site immediately, and across open tabs.

## Project structure

```
src/
  components/        shared UI: Navbar, Footer, PropertyCard, SearchBar, BookingWidget,
    ui/              EnquiryForm, Gallery, Calendar, AvailabilityCalendar…
    admin/           Button, Field, Modal, Badge, Stepper, SmartImage…
  context/           DataContext (single data layer for the UI), AuthContext, ToastContext
  data/              sample properties, settings, testimonials, demo enquiries/bookings
  hooks/             useMoney, useWhatsApp, useDocumentTitle, useScrollToTop
  layouts/           PublicLayout, AdminLayout (+ route guard)
  pages/
    Home/  Properties/  PropertyDetails/  Booking/  Info/
    Admin/           Dashboard, Properties, PropertyEditor, Calendar, Enquiries, Bookings, Settings, Login
  services/          storage, propertyService, enquiryService, bookingService,
                     availabilityService, settingsService, authService, notificationService
  types/             typed data model
  utils/             dates, pricing, availability, whatsapp, validation, format, image
```

## What uses localStorage today

All of it, under keys starting with `wss:v1:`: properties (including uploaded photos as compressed data URLs), enquiries, bookings, calendar overrides (blocked/booked dates and special prices) and settings. The admin session uses sessionStorage.

That means data lives in **one browser on one device**: guests' enquiries are saved in *their* browser, not yours, so in this prototype you'll only see enquiries in the dashboard if they were made on the same browser. WhatsApp is the channel that actually reaches you today.

## Before going live

1. **Database + API**: replace the internals of `src/services/*Service.ts` with Supabase (or Firebase / your own API). The functions are already async and the UI only talks to them through `DataContext`, so pages don't need to change. Enforce "no overlapping confirmed bookings" in the database too (e.g. a Postgres exclusion constraint on `daterange(check_in, check_out)` per property).
2. **Real authentication**: replace `src/services/authService.ts` (demo credentials are visible in the bundle) with Supabase Auth, Clerk or similar, and protect admin data with server-side rules (e.g. Supabase RLS).
3. **Owner notifications**: a browser can only open WhatsApp with a prefilled message; it can't send one silently. Implement `src/services/notificationService.ts` on a backend using the WhatsApp Business Cloud API (approved template), or an email/automation webhook (Zapier, Make, n8n), triggered when an enquiry is saved.
4. **Photo storage**: move uploads to Supabase Storage / Cloudinary / S3. localStorage holds only about 5 MB.
5. **Content**: replace sample properties, Unsplash placeholder photos and the sample testimonials (`src/data/testimonials.ts`, set `isSample: false`) with your own. Set your real WhatsApp number, contact details and policies in Admin → Settings, then use "Remove demo enquiries & bookings".
6. **Optional**: online payments/deposits (Razorpay, Stripe), email confirmations, analytics, SEO meta per page (or move to a framework with server rendering).
