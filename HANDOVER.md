# Hello Hope site handover

Production site: [https://hellohope.ca](https://hellohope.ca)

This is a Deno (not Node) site: static HTML/CSS/JS served by a single backend file, `server.ts`. There is no `package.json` and no CI/CD.

You received this project as a **zip of the source**, not GitHub access. Put it on your own GitHub (or any git host) and deploy from there.

### First steps with the zip

1. Unzip the folder.
2. Confirm there is **no** `.env` file. Secrets are not in the zip. If one is present, delete it and rotate every key that was in it.
3. Copy `.env.example` to `.env` and fill in values from the accounts you now own (or new accounts you create).
4. Create a new empty GitHub repo on your account, then:

```bash
cd hello_hope_site
git init
git add .
git commit -m "Initial commit from handover zip"
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git branch -M main
git push -u origin main
```

5. Add `.env` to `.gitignore` if it is not already there. Never commit secrets.

GitHub “Download ZIP” does not include `.env` or git history. If the previous owner zipped their local folder instead, they must exclude `.env`.

---

## What you are taking over

Hello Hope is a Canadian education / conference site with:

- Marketing pages (home, programs, contact, conference)
- A merch shop (Airtable catalog + PayPal checkout)
- Conference ticket sales (Luma, not PayPal)
- A markdown blog with a simple admin CMS at `/admin`
- Contact and program-schedule emails (EmailJS)

Contact emails go to `aubrey@hellohope.ca`.

---

## Live vs dormant services

Transfer accounts for **live** services. Do not spend time setting up the dormant ones unless you plan to delete that leftover code.

### Live (in use)

| Service | What it does |
|---|---|
| **Google Cloud Run** | Hosts the Docker/Deno app |
| **Google Cloud Storage** bucket `hello-hope` | Public images and videos (`https://storage.googleapis.com/hello-hope/...`) |
| **Airtable** | Merch product catalog |
| **PayPal** (live, CAD) | Merch checkout only |
| **EmailJS** | Contact form + schedule-builder emails |
| **Luma** | Conference tickets (iframe embed) |
| **Meta Pixel + Conversions API** | Ads tracking. Pixel ID `1497149528035279` |
| **Google Analytics** | Property `G-4W2D1MV9MZ` |
| **Calendly** | Contact page booking: `https://calendly.com/hellohope/chat` |

### Dormant (leftover, not used by the live site)

| Service | Evidence |
|---|---|
| **Shopify** | `SHOPIFY_*` env vars and `GET /api/shopify/products` exist. The shop page calls Airtable, not Shopify. |
| **SMTP / Gmail** | `SMTP_USERNAME` / `SMTP_PASSWORD` are read into config and never used. `sendEmail()` only logs to stdout. |
| **`POST /api/contact`** | Backend endpoint exists. The UI sends mail through EmailJS instead. `scripts/contact-form.js` is empty. |
| **`data/posts.json`** | Old JSON blog store. Live posts are `posts/*.md`. |

Stripe, SendGrid, and Firebase are **not** in this project.

---

## Accounts you need

The zip is code only. Live site still depends on these services. Either take ownership of the existing accounts or recreate them and update env vars / hardcoded IDs.

1. **Your GitHub** — new repo; upload the unzipped project
2. **Google Cloud** — Cloud Run service, GCS bucket `hello-hope` (or a new bucket + updated image URLs), domain mapping for `hellohope.ca`
3. **Airtable** — merch catalog base
4. **PayPal** developer app (live, CAD)
5. **EmailJS** — service + contact template + schedule template
6. **Luma** — conference event + webhook URL
7. **Meta Business / Ads** — pixel + CAPI token
8. **Google Analytics**
9. **Calendly**
10. **Domain / DNS** for `hellohope.ca`

Skip Shopify and Gmail SMTP. They are leftover and not required.

---

## Stack and layout

```
server.ts                 Whole backend: routes, APIs, PayPal, Airtable, admin, webhooks
deno.json                 deno task dev / start
Dockerfile                Cloud Run image
.env                      Local secrets (gitignored). Production uses Cloud Run env vars.
index.html, conference.html, contact.html, programs.html,
shop.html, articles.html, post.html, admin.html, thank-you.html
scripts/                  Client JS
styles/                   CSS
components/               Header/footer HTML+JS+CSS (fetched at runtime)
posts/                    Live blog markdown
data/                     discount_codes.json at runtime (gitignored)
media/, logos/, fonts/    Local assets
```

Key client files:

- `scripts/main.js` — site chrome, contact EmailJS
- `scripts/shop.js` — product grid from `/api/airtable/products`
- `scripts/cart.js` / `scripts/cart-modal.js` — cart + PayPal buttons
- `scripts/schedule-builder.js` — programs scheduler + EmailJS
- `scripts/admin.js` — blog + discount admin
- `scripts/articles.js` / `scripts/post.js` — public blog

---

## Local development

1. Install [Deno](https://deno.land/).
2. Copy `.env.example` to `.env` and fill in real values (get them from the previous owner / Cloud Run env).
3. From the repo root:

```bash
deno task dev
```

That runs `deno run -A --watch --env=.env server.ts`. Open [http://localhost:8000](http://localhost:8000).

`deno task start` is the same without watch.

---

## Environment variables

All read in `server.ts` via `Deno.env.get(...)`. Locally they come from `.env`. On Cloud Run they must be set on the service — the image does **not** load `.env` (it is dockerignored, and the container CMD is `deno run -A server.ts` with no `--env` flag).

| Variable | Required for | Notes |
|---|---|---|
| `PORT` | Server listen port | Local default `8000`. Cloud Run sets this (image exposes `8080`). |
| `EMAILJS_PUBLIC_KEY` | Contact + schedule emails | Exposed to the browser via `/api/config` (normal for EmailJS). |
| `EMAILJS_SERVICE_ID` | same | |
| `EMAILJS_TEMPLATE_ID` | Contact form | |
| `EMAILJS_SCHEDULE_TEMPLATE_ID` | Schedule builder | Falls back to `EMAILJS_TEMPLATE_ID` if empty. |
| `AIRTABLE_API_KEY` | Shop + PayPal pricing | |
| `AIRTABLE_BASE_ID` | same | |
| `AIRTABLE_TABLE_ID` | same | |
| `PAYPAL_CLIENT_ID` | Merch checkout | Also sent to the browser for the PayPal JS SDK. |
| `PAYPAL_CLIENT_SECRET` | Merch checkout | Server only. |
| `PAYPAL_ENVIRONMENT` | `live` or `sandbox` | Default `sandbox`. Production must be `live`. |
| `ADMIN_USERNAME` | `/admin` | Defaults to `admin` if unset. |
| `ADMIN_PASSWORD` | `/admin` | Defaults to `password` if unset. Set this in Cloud Run. |
| `META_PIXEL_ID` | CAPI | Fallback in code is `1497149528035279`. HTML still hardcodes that ID. |
| `META_CAPI_ACCESS_TOKEN` | Server-side Purchase events | |
| `META_TEST_EVENT_CODE` | Optional CAPI test events | Leave empty in production. |
| `LUMA_WEBHOOK_SECRET` | `/api/luma/webhook` | If empty, signature check is skipped. |
| `SMTP_USERNAME` / `SMTP_PASSWORD` | Unused | Leave empty. |
| `SHOPIFY_STORE_DOMAIN` / `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Unused | Leave empty. |

Do not commit `.env`.

---

## How the live features work

### Shop (Airtable + PayPal)

1. `/shop` loads products from `GET /api/airtable/products`.
2. Cart is `localStorage` key `hellohope_cart`. Size (XS–XXL) is client-only, not an Airtable variant.
3. Checkout uses PayPal Buttons in `scripts/cart-modal.js`.
4. `POST /api/paypal/create-order` re-fetches prices from Airtable (cart prices are not trusted), applies a discount if any, adds **$15 CAD shipping** unless pickup or a free-shipping code.
5. `POST /api/paypal/capture-order` captures payment.
6. Discount codes are **deactivated when the order is created**, not when it is captured. An abandoned PayPal popup can burn a code.

Airtable fields the code expects:

- `Title`
- `Type`
- `Variant Price` or `Price`
- `Image Src`
- `Description`
- `Variant Inventory Qty` (available if `> 0`)

Currency is hardcoded CAD. Products are edited in Airtable, not in `/admin`.

### Conference tickets (Luma)

Not PayPal. `conference.html` embeds:

`https://luma.com/embed/event/evt-AdbQgJIckYpFYYs/simple`

After purchase, Luma should redirect to `/thank-you`. That page fires Meta Pixel `Purchase` and `POST /api/meta/capi/purchase`.

`POST /api/luma/webhook` also forwards `ticket.registered` to Meta CAPI. Configure the webhook in Luma to `https://hellohope.ca/api/luma/webhook`.

The parent page cannot see clicks inside the Luma iframe. See `META_PIXEL_LUMA_TRACKING_STATUS.md` (partly stale: it still says the thank-you page does not exist; it does).

### Contact and schedule emails (EmailJS)

Browser EmailJS, recipient `aubrey@hellohope.ca`.

- Contact form: `scripts/main.js`
- Schedule builder: `scripts/schedule-builder.js` on `/programs`

Ignore `POST /api/contact` and SMTP. Contact page also has Calendly and `mailto:aubrey@hellohope.ca`.

### Blog

Markdown in `posts/*.md` with YAML front matter, rendered with `marked`. Public routes: `/articles`, `/articles/:id`, `GET /api/posts`.

Create/edit/publish from `/admin` (Toast UI Editor). Writes go to the container filesystem.

### Admin (`/admin`)

- Login: `POST /api/admin/login` → HttpOnly cookie `session` (24h, no `Secure` flag).
- Sessions live in an in-memory `Map`. Restarts and extra Cloud Run instances log everyone out.
- Can manage blog posts and discount codes.
- Cannot manage products (Airtable) or orders (PayPal / Luma dashboards).
- Image insert in the editor is base64 only; there is no upload API.

### Discount codes

Stored in `./data/discount_codes.json` (gitignored). If the file is missing, the server seeds `HELLOHOPE001`–`010` at 15% off.

Percentage or free-shipping codes, generated in bulk from admin (max 50).

### Analytics

- GA `G-4W2D1MV9MZ` on most pages. **Shop does not include gtag**, so `add_to_cart` calls in `shop.js` do nothing.
- Meta Pixel `1497149528035279` hardcoded in HTML. CAPI Purchase is for Luma/thank-you, **not** merch PayPal orders.

---

## Deploy (Google Cloud Run)

There is no GitHub Action or `cloudbuild.yaml`. Deploy is a Docker image to Cloud Run.

```bash
gcloud run deploy SERVICE_NAME \
  --source . \
  --region YOUR_REGION \
  --allow-unauthenticated
```

Or build/push the `Dockerfile` and deploy that image. Confirm the real GCP project, region, and service name in the Cloud Console.

Cloud Run must have the env vars from the table above. Set `PAYPAL_ENVIRONMENT=live` and a real `ADMIN_PASSWORD`.

### Cloud Run caveats

1. **Ephemeral disk.** Admin blog writes and `data/discount_codes.json` do not survive new revisions unless you add a volume. Treat `posts/` as git-managed content and redeploy after publishing, or you will lose posts.
2. **`.dockerignore` excludes `*.md`.** Blog markdown in `posts/` may not be copied into the image. If production is missing articles, fix that ignore rule (exclude `posts/` from the `*.md` pattern) and redeploy.
3. **In-memory sessions and webhook dedup** do not share across instances.
4. **No `.env` in the image.** Missing env vars fail Airtable/PayPal/EmailJS; missing admin password falls back to `password`.

---

## API surface

| Method | Path | Auth | Live? |
|---|---|---|---|
| GET | `/api/config` | public | Yes (EmailJS + PayPal client ID) |
| GET | `/api/airtable/products` | public | Yes |
| POST | `/api/paypal/create-order` | public | Yes |
| POST | `/api/paypal/capture-order` | public | Yes |
| GET | `/api/posts`, `/api/posts/:id` | public | Yes |
| POST | `/api/discounts/validate` | public | Yes |
| POST | `/api/meta/capi/purchase` | public | Yes |
| POST | `/api/luma/webhook` | HMAC if secret set | Yes |
| POST | `/api/admin/login` | — | Yes |
| GET/POST | `/api/admin/posts` | session | Yes |
| GET/PUT/DELETE | `/api/admin/posts/:id` | session | Yes |
| GET/POST | `/api/admin/discounts` | session | Yes |
| DELETE | `/api/admin/discounts/:code` | session | Yes |
| GET | `/api/shopify/products` | public | **No** |
| POST | `/api/contact` | public | **No** |

HTML routes: `/`, `/home`, `/conference`, `/thank-you`, `/contact`, `/programs`, `/shop`, `/articles`, `/articles/:id`, `/admin`, `/testimonials` (serves homepage).

---

## Day-one checklist

- [ ] Unzip, confirm no `.env` in the zip, copy `.env.example` → `.env`
- [ ] Push to your own GitHub repo (see First steps above)
- [ ] Get or recreate GCP, Airtable, PayPal, EmailJS, Luma, Meta, GA, Calendly, and DNS
- [ ] Fill `.env` / Cloud Run env from those accounts (never commit `.env`)
- [ ] Run `deno task dev` and load `/`, `/shop`, `/conference`, `/contact`, `/admin`
- [ ] Confirm shop products load from Airtable
- [ ] Confirm PayPal is `live` on production
- [ ] Send a test contact form and a test schedule email
- [ ] Point Luma webhook + thank-you redirect at the production URL
- [ ] Set a real `ADMIN_PASSWORD` in Cloud Run
- [ ] Ignore Shopify and SMTP unless you are deleting that code

---

## Known issues worth knowing

- Shopify leftover can be deleted later; it is not serving the shop.
- Discount codes burn on PayPal **create**, not capture.
- Merch purchases are not sent to Meta CAPI.
- Admin cookie has no `Secure` flag; CORS is `*` on several APIs.
- Footer social links and some speaker Instagram/Facebook links are still `href="#"`.
- Header has Shop but not Conference; footer has Conference but not Shop.
