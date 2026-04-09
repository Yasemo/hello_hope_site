# Meta Pixel + Luma Tracking Status (Current)

This document explains the current implementation on `hellohope.ca`, what is possible right now, and what is blocked until Luma webhook access is available.

## Current Situation (In Code)

- Meta Pixel base code is installed on core pages and currently fires `PageView`.
- Luma checkout is embedded on the conference page via an iframe:
  - `conference.html` uses `https://luma.com/embed/event/...`
- "Buy Tickets" buttons currently scroll users to the CTA section and send a Google Analytics event.
- A dedicated thank-you page is not present yet.
- Backend is Deno (`server.ts`), not Node.js.

## Key Limitation

Because Luma is embedded as a cross-domain iframe, site JavaScript on `hellohope.ca` cannot reliably listen to click or purchase actions that happen inside the Luma checkout UI.

In practical terms:

- We can track pre-checkout behavior on our site.
- We cannot directly track Luma-internal "Register" or payment clicks from parent-page JS.

## What We Can Do Without Luma Webhooks

### 1) Pre-Purchase Event Tracking (Website)

- Keep `PageView` (already active).
- Add `ViewContent` on conference/event page load.
- Add `InitiateCheckout` when users click visible pre-Luma CTA buttons (e.g., "Buy Tickets").

This captures the user journey before checkout.

### 2) Browser Purchase Tracking via Redirect

Configure Luma success redirect back to site, for example:

`https://hellohope.ca/thank-you?value=275.00&event_id=12345`

On `/thank-you`, fire Meta `Purchase` in browser with:

- `value`
- `currency` (CAD)
- `eventID` (from query param, fallback generated if missing)

This is the best available purchase signal without webhook access.

### 3) Optional: Server-Side CAPI From Thank-You Page

Even without webhook access, the thank-you page can call our own backend endpoint and forward a matching event to Meta CAPI using:

- same `event_id` (for dedup if browser + CAPI both sent)
- `client_ip_address`
- `client_user_agent`
- `fbp`/`fbc` if present

This improves resilience, but is still weaker than webhook-confirmed purchase data.

## What Is Not Possible Yet (Without Webhooks)

- No authoritative server-to-server purchase payload sent directly from Luma.
- No guaranteed purchase email/order metadata feed from Luma to our backend.
- No full-fidelity CAPI pipeline sourced from payment confirmation events inside Luma.

## Recommended Phase Plan

## Phase 1 (Available Now)

1. Add `ViewContent` and `InitiateCheckout` on the website.
2. Create `/thank-you` page and track browser `Purchase`.
3. Test in Meta Events Manager (Test Events):
   - `ViewContent` fires
   - `InitiateCheckout` fires
   - `Purchase` fires on redirect
   - value/currency are correct

## Phase 2 (When Luma Webhooks/Plan Is Enabled)

1. Receive purchase webhook from Luma on backend.
2. Send `Purchase` to Meta CAPI from server with hashed user data.
3. Keep browser purchase event on thank-you page.
4. Deduplicate with shared `event_id` across browser + CAPI.

## Security / Implementation Notes

- Do not hardcode Meta access tokens in code snippets or commits.
- Keep Pixel ID, CAPI token, and test codes in environment variables.
- Rotate any token that was previously shared in plain text.
- Since backend is Deno, webhook/CAPI examples should be implemented in Deno TypeScript (not Node `require(...)` style).

---

Prepared for freelancer handoff: current architecture supports strong pre-purchase tracking and redirect-based purchase tracking now; full server-confirmed CAPI accuracy depends on Luma webhook availability.
