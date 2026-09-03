# Gujju Forex — Divyashtra Landing Page + Admin Dashboard

A Next.js 16 app for selling the **Divyashtra — Crypto & Forex Mastery Course** at
**₹19**, with Razorpay checkout and an admin dashboard for leads and orders.

- **Landing page** — `/`
- **Admin dashboard** — `/admin` (password protected)

## The funnel

1. Visitor clicks any **Enroll** button and fills the form (name, WhatsApp, email,
   city, experience).
2. `POST /api/enroll` **saves the lead first**, then creates a Razorpay order.
   Because the lead is saved before payment, **people who never pay still show up
   in the dashboard** and can be followed up on WhatsApp.
3. Razorpay Checkout opens. On success the handler calls
   `POST /api/payment/verify`, which validates the
   `HMAC_SHA256(order_id|payment_id)` signature server-side before marking the
   lead and order as **PAID**.
4. Dismissed or failed checkouts hit `POST /api/payment/failed` and are recorded
   as **FAILED** with the reason.
5. `POST /api/webhook/razorpay` is the server-to-server source of truth and will
   reconcile any payment the browser failed to report.

Lead statuses: `PENDING` (form filled, never paid) · `PAID` · `FAILED`.

## Getting started

```bash
npm install
npm run db:migrate     # creates the SQLite database
npm run dev            # http://localhost:3000
```

Optional demo data for the dashboard:

```bash
npm run db:seed
```

## Configuration — `.env`

| Variable | What it does |
| --- | --- |
| `DATABASE_URL` | Database connection. Defaults to local SQLite `file:./dev.db`. |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | From [dashboard.razorpay.com/app/keys](https://dashboard.razorpay.com/app/keys). |
| `RAZORPAY_WEBHOOK_SECRET` | Secret you set when creating the webhook. |
| `ADMIN_USERNAME` | Username for `/admin/login`. |
| `ADMIN_PASSWORD` | Password for `/admin/login`. **Change this.** |
| `AUTH_SECRET` | Long random string used to sign the admin session cookie. |
| `COURSE_PRICE_PAISE` | Price in paise. `1900` = ₹19. |

> **Razorpay keys are required to take enrollments.** Without them the form
> still saves the lead (nothing is lost) but returns a 503 and shows the visitor
> an error rather than pretending the enrollment succeeded. The admin Overview
> page shows a warning banner whenever the gateway is unconfigured.
>
> Environment variables are read at server start — **restart `npm run dev`
> after editing `.env`**.

### Razorpay setup

1. Create keys in the Razorpay dashboard and paste them into `.env`.
2. Add a webhook at **Settings → Webhooks** pointing to
   `https://yourdomain.com/api/webhook/razorpay`.
3. Subscribe to the `payment.captured` and `payment.failed` events.
4. Put the webhook secret in `RAZORPAY_WEBHOOK_SECRET`.

Test with Razorpay test-mode keys first — UPI id `success@razorpay` simulates a
successful payment.

## Admin dashboard

Sign in at `/admin/login` with `ADMIN_USERNAME` and `ADMIN_PASSWORD`. The session is a signed JWT in an
httpOnly cookie, valid 7 days; every `/admin` route is gated in `src/proxy.ts`.

- **Overview** — revenue (total and today), paid enrollments, conversion rate,
  unpaid leads, plus latest leads and orders.
- **Leads** — every form submission, paid or not. Search by name/phone/email/city,
  filter by status (including **All unpaid** and **Not contacted**), expand a row
  to see payment attempts, add internal notes, mark as contacted, override the
  status, message on WhatsApp in one click, or delete.
- **Orders** — every Razorpay order with payment id, method, amount, status and
  failure reason.
- **Export CSV** on both pages.

## Editing the content

Almost all copy lives in [`src/lib/site.ts`](src/lib/site.ts) — course modules,
highlights, FAQs, price, and the contact details
(`Info@gujjuforex.com`, WhatsApp `9327167437`). Images are in `public/images/`.

## Deploying

SQLite is fine locally but most hosts have a read-only filesystem. For production:

1. In `prisma/schema.prisma` change the datasource `provider` to `"postgresql"`.
2. Point `DATABASE_URL` at a hosted Postgres (Neon, Supabase, RDS).
3. `npx prisma migrate deploy`.
4. Set every environment variable from the table above on the host.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
Prisma · Razorpay · jose (admin sessions) · zod (validation)
