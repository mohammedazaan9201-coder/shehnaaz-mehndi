# Shehnaaz's Mehndi — E-Commerce Website

A mobile-first e-commerce site for Shehnaaz's Mehndi (Hyderabad), built with Next.js 14
(App Router), TypeScript, and Tailwind CSS.

---

## 1. Quick Start (local development)

**Requirements:** Node.js 18.18+ (Node 20 LTS recommended) and npm. No database, no
external accounts, and no API keys are required to run this locally — the project ships
with a small JSON-file data store so it works immediately.

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment file
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Open **http://localhost:3000**.

- Storefront: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login

### Admin login (development only)

No `ADMIN_PASSWORD_HASH` is set by default, so the app falls back to a plain-text dev
password so you can get into the admin panel immediately:

- **Email:** `admin@shehnaazsmehndi.com` (or whatever you set `ADMIN_EMAIL` to)
- **Password:** `shehnaaz-admin` (or whatever you set `ADMIN_DEV_PASSWORD` to)

**Change this before putting the site anywhere public.** See section 4.

---

## 2. What's included

### Customer-facing site
- Homepage: hero, category cards, featured products, "Why Choose Us", customer reviews
  (only admin-approved reviews are shown), FAQ accordion, contact CTA
- Full catalog seeded from your product list (Mehndi Cones, Instant Products, Stencils,
  Powders & Hair Care, Skincare, Fragrance & Lifestyle) with live stock status
- Product search, category filtering, and sorting (price/name)
- Product detail pages with gallery, related products, wishlist toggle
- Cart (drawer + full page), guest checkout with:
  - Home Delivery or Store Pickup
  - UPI or Bank Transfer (manual confirmation via WhatsApp — see note below)
  - Optional transaction ID and payment screenshot upload
- Order confirmation page + order tracking (by order number + phone)
- Contact page (WhatsApp, Instagram, city-level location — no exact address published)
- Fully responsive, mobile-first layout

### Admin panel (`/admin`)
- Secure login (JWT session cookie, `httpOnly`)
- Dashboard: total orders, revenue, pending orders, product count, customers, low/out of
  stock counts, pending reviews, recent orders
- Products: list, add, edit, delete, inline stock editing, active/hidden toggle
- Orders: list with status filter chips, detail view (customer info, items, payment
  screenshot, status history), status updates (Pending → Confirmed → Processing →
  Shipped/Ready for Pickup → Delivered, or Cancelled)
- Reviews: pending queue and approved list, approve / unpublish / delete
  (**reviews are never public until an admin approves them**)

Cancelling an order automatically restores the stock that was reserved when the order
was placed.

### Data layer
- `src/lib/db.ts` — a small JSON-file store (`/data/*.json`) used for local development.
  It seeds itself from `src/lib/products-data.ts` on first run.
- `prisma/schema.prisma` — the production schema (Postgres). See section 5 to switch to
  a real database.

---

## 3. Product photos

The catalog currently uses **branded placeholder illustrations** (one per category, in
`/public/products/*.svg`) — no real product photography was invented. To add your own
photos:

1. Drop images into `/public/products/` (e.g. `natural-box-12.jpg`).
2. Open `src/lib/products-data.ts` and update the `images: [...]` array for each product
   to point at your new file.
3. Delete `/data/products.json` (the persisted admin store) and restart the dev server
   so it re-seeds from the updated catalog — **or** just edit each product's image via
   the admin panel (Products → Edit → upload an image), which doesn't require a restart.

---

## 4. Before you put this anywhere public

A few things intentionally were **not** invented, per your instructions — you need to
supply these yourself:

| What | Where | Why you must supply it |
|---|---|---|
| `JWT_SECRET` | `.env.local` | Signs admin session cookies. Use a long random string. |
| `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` | `.env.local` | Real admin login. Generate a bcrypt hash (see below) — don't ship the dev fallback password. |
| UPI ID | `.env.local` (`NEXT_PUBLIC_UPI_ID`) | Your real payment UPI handle. Left blank by default — checkout tells customers to get payment details via WhatsApp instead of showing a fake ID. |
| Bank transfer details | Not stored anywhere in the code | No bank account/IFSC info was invented. The checkout page tells customers you'll share these manually via WhatsApp. Add a real flow here once you decide how you want to handle it. |
| Payment gateway (Razorpay/Stripe/etc.) | Not integrated | Checkout currently records "intent to pay" (UPI or Bank Transfer) and lets the customer attach a screenshot/transaction ID; an admin confirms manually. Wire up a real gateway here when you're ready to accept live automated payments. |
| Production database | `DATABASE_URL` in `.env` + `prisma/schema.prisma` | The JSON file store is for local development only — see section 5. |
| Image hosting (S3/Cloudinary/etc.) | Not integrated | Admin-uploaded images are currently stored as base64 data URLs in the JSON store, which does not scale. Swap in real object storage before production. |
| Domain / hosting | N/A | Deploy to Vercel, or any Node.js host, once the above is in place. |

**To generate a bcrypt password hash** for `ADMIN_PASSWORD_HASH`:

```bash
node -e "console.log(require('bcryptjs').hashSync('your-new-password', 10))"
```

Paste the output into `.env.local` as `ADMIN_PASSWORD_HASH`, then remove/ignore
`ADMIN_DEV_PASSWORD`.

---

## 5. Moving from the JSON store to a real database

The JSON store (`src/lib/db.ts`) and the Prisma schema (`prisma/schema.prisma`) use
matching shapes on purpose. To switch to Postgres:

1. Provision a Postgres database and set `DATABASE_URL` in `.env`.
2. `npx prisma migrate dev --name init`
3. Rewrite the functions in `src/lib/db.ts` (e.g. `getAllOrders`, `createOrder`,
   `updateOrderStatus`, `getAllProducts`, `createProduct`, etc.) to use
   `@prisma/client` instead of reading/writing JSON files. Every call site elsewhere in
   the app (API routes, server components) stays the same, since they only import from
   `@/lib/db`.

---

## 6. Project structure

```
src/
  app/                    # Next.js App Router pages & API routes
    admin/
      login/              # public admin login page
      (protected)/        # dashboard, products, orders, reviews — auth-gated layout
    api/                  # route handlers (orders, products, reviews, auth)
    products/, category/, cart/, checkout/, track-order/, wishlist/, contact/
  components/
    layout/               # Header, Footer
    home/                 # homepage sections
    product/               # product cards, gallery, add-to-cart, sort
    cart/                 # cart drawer
    admin/                # admin sidebar, tables, forms
    order/                # order status tracker
    ui/                   # shared UI primitives
  lib/
    types.ts              # shared TypeScript types
    products-data.ts      # category list + seed catalog
    db.ts                 # JSON-file data store (swap for Prisma in production)
    auth.ts                # admin session helpers
    cart-context.tsx, wishlist-context.tsx
    utils.ts
prisma/schema.prisma      # production database schema
data/                     # JSON store (gitignored except .gitkeep)
public/products/          # placeholder category images
```

---

## 7. Known limitations (by design, for this stage)

- No live payment gateway — payments are confirmed manually via WhatsApp.
- No real product photography — SVG placeholders per category.
- No transactional email/SMS notifications (order confirmations are shown on-screen
  and via the order tracking page only).
- Admin file uploads (product photos, payment screenshots) are stored as base64 in the
  JSON store — fine for local testing, not for production scale.
- Category management (add/edit/delete categories) isn't wired into the admin UI yet;
  categories are defined in `src/lib/products-data.ts`.

None of the above involved inventing credentials, business details, reviews, or claims
— they're flagged here so you know exactly what to wire up next.
