# DealVerse Tracking System — Deep Audit Report

> **Status note (current checkout):** this report is a historical audit. Several findings below have since been fixed, and one recommendation (POST-only webhook) was deliberately not adopted because Impact/Admitad pass macros in the query string. See the status table at the end and [`README.md`](README.md) for the verified current behaviour.

## System Overview

The tracking system works as a **click → affiliate redirect → postback → cashback** pipeline. Here is how each piece connects:

```
User clicks "Activate" 
  → Frontend generates click_id (UUID) via POST /server/session/generate-click/
  → click_id appended as SubID to affiliate URL
  → User redirected to affiliate network (e.g. impact.com)
  → User purchases/converts
  → Affiliate network fires POST /server/webhooks/affiliate/ with sub_id + commission
  → Backend finds ClickTrack by click_id → creates CashbackTransaction for user
  → Signal fires confirmation email when status → CONFIRMED
```

---

## ✅ What Works Correctly

### 1. Click Generation (`POST /server/session/generate-click/`)
- Creates a `ClickTrack` record with `click_id` UUID, user, IP, user-agent, referrer, item metadata
- Returns the full serialized record including `click_id` to the frontend
- Frontend appends `click_id` as `subId1`/`subId2` to the affiliate URL
- Requires authentication (`IsAuthenticated`) ✅

### 2. SubID Mapping per Network ([activate/page.tsx](file:///run/media/md-ajim/Linux_Data/Repo/DealVerse/frontend/app/activate/page.tsx#L103))
| Network | Parameter |
|---|---|
| Impact / pxf.io / sjv.io | `subId1` + `subId2` |
| CJ Affiliate | `sid` |
| Rakuten/LinkSynergy | `u1` |
| Awin | `clickref` + `clickref2` |
| ShareASale | `afftrack` |
| Partnerize | `pubref` |
| TradeDoubler | `epi` + `epi2` |
| Admitad | `subid` + `subid1` |
| FlexOffers | `foid` |
| PepperJam | `sid` |
| Generic fallback | `sub_id` |

### 3. Webhook Postback (`POST /server/webhooks/affiliate/`)
- Accepts both HMAC signature (`X-Affiliate-Signature`) and simple `Authorization: Token` header
- Reads `sub_id` or `SubId1` from POST/GET params
- Looks up `ClickTrack` by `click_id` using `select_for_update()` (race-condition safe ✅)
- Applies user revenue share via `PlatformSettings.user_cashback_percentage` (default 50%)
- Maps affiliate states: `APPROVED/CLEARED` → `CONFIRMED`, `REVERSED` → `REJECTED`
- Creates or updates `CashbackTransaction` atomically ✅
- Blocklist check on prohibited categories ✅

### 4. Anti-Fraud System
- **Rate limiting**: 5 clicks per user per IP per minute via Django cache
- Flagged clicks still create a `ClickTrack` with `status='FLAGGED'` (audit trail ✅)
- Returns HTTP 429 to frontend, which treats it gracefully (generates random UUID fallback)

### 5. Signals (Post-Save on CashbackTransaction)
- `send_cashback_confirmation_email` fires when status → `CONFIRMED` ✅
- `unlock_pending_bonuses` unlocks Sign-up Bonus + Referral Bonus when user hits $15 confirmed cashback threshold ✅

### 6. Fallback Polling Task (`poll_affiliate_networks`)
- A fully implemented Celery task queries the Impact Radius API hourly for missed webhooks, reads from PlatformSettings for dynamic commission calculations, and updates the user's CashbackTransaction record accordingly. ✅

### 7. Unauthenticated Guest Flow
- Guest users bypass `/server/session/generate-click/` (no auth token)
- Falls back to `/server/session/record-click/` (triggers email if session is active, no user attribution)
- A random UUID is still generated client-side and appended as SubID
- Cookie `rshq_click_id` is set for potential first-party fallback ✅

---

## 🐛 Bugs & Issues Found

### 🔴 Critical

#### 1. Webhook default secret key vulnerability
The `WEBHOOK_SECRET` defaults to `'super-secret-key-for-webhooks'` (defined in `settings.py`) or `'default-secret-token'` (fallback in `webhook_views.py`). If the environment variable `AFFILIATE_WEBHOOK_SECRET` is not set in production, these default values will be active, presenting a security vulnerability if an attacker knows the default keys.

#### 2. `CashbackTransaction.STATUS_CHOICES` is missing `'REJECTED'`
**File:** [finance_models.py L5-L9](file:///run/media/md-ajim/Linux_Data/Repo/DealVerse/backend/dealvers/finance_models.py#L5)
```python
STATUS_CHOICES = [
    ('PENDING', 'Pending'),
    ('CONFIRMED', 'Confirmed'),
    ('CANCELLED', 'Cancelled'),   # ← 'REJECTED' is not in choices
]
```
But the webhook sets `status='REJECTED'`. Django won't enforce this at the DB level but it will show as invalid in the admin panel.

---

### 🟡 Medium Issues

#### 3. Anonymous users: random UUID click_id is never stored on the server
Guest users get a random UUID appended to the affiliate URL, but since no `ClickTrack` record is created for them, when the affiliate network fires a postback with that `sub_id`, the webhook returns **404 "Click record not found"** and cashback is silently lost. Guests can never receive cashback.

> This is *by design* but is a UX issue — the activate page shows a fake "SECURE CONNECTION" ID box even for guests, which is misleading.

#### 4. Rate limiter uses `cache` — resets on server restart / Redis flush
**File:** [views.py L83](file:///run/media/md-ajim/Linux_Data/Repo/DealVerse/backend/dealvers/views.py#L83)
```python
click_count = cache.get(cache_key, 0)
```
If using the default Django memory cache (not Redis), this resets on every deploy. Rate limiting provides no protection in serverless environments (Lambda/Zappa) where each request may spin up a new process with a cold cache.

#### 5. `referrer` field has `max_length=500` but may be truncated silently
**File:** [tracking_models.py L22](file:///run/media/md-ajim/Linux_Data/Repo/DealVerse/backend/dealvers/tracking_models.py#L22)
Some referrer URLs (e.g., with long query strings) can exceed 500 chars and will either throw a DB error or be silently truncated.

#### 6. Frontend sends `expected_cashback` but backend field is `expected_cashback_percentage`
**Frontend** ([activate/page.tsx](file:///run/media/md-ajim/Linux_Data/Repo/DealVerse/frontend/app/activate/page.tsx)):
```ts
expected_cashback: target.cashback,  // field name sent
```
**Backend** ([views.py L109](file:///run/media/md-ajim/Linux_Data/Repo/DealVerse/backend/dealvers/views.py#L109)):
```python
expected_cashback_percentage=data.get('expected_cashback'),  # ✅ matches
```
This actually matches — no bug, but the naming is inconsistent and confusing.

#### 7. For APP type, `cashback` is an **amount** (e.g. `10.0`) not a **percentage**
**File:** [activate/page.tsx](file:///run/media/md-ajim/Linux_Data/Repo/DealVerse/frontend/app/activate/page.tsx)
```ts
cashback: data.reward_amount,  // e.g. 10.0 USD, not a %
```
But the UI renders it as `10%`. This is misleading for app rewards where the reward is a fixed dollar amount, not a percentage. The `ClickTrack.expected_cashback_percentage` field also stores this amount as if it were a percentage.

---

### 🟢 Minor / Polish

#### 8. `urls.py` has duplicate imports (entire import block repeated twice)
**File:** [urls.py L1-L49](file:///run/media/md-ajim/Linux_Data/Repo/DealVerse/backend/dealvers/urls.py)
Lines 1–18 and lines 19–49 are the same imports duplicated. Harmless but messy.

#### 9. `send_click_tracked_email` fires on every click (including guests on `record-click/`)
Unauthenticated users hit `/api/session/record-click/` which checks `user.is_authenticated` before firing, but the email fires a Celery task synchronously (`.delay()`). If Celery is not running, this raises an exception silently caught in `TrackingAPIView` but **not in `track_click_view`** — it would 500.

---

## Complete Data Flow Diagram

```
[User] → clicks Activate
    ↓
[Frontend: activate/page.tsx]
    → POST /api/session/generate-click/  (if logged in)
    → Returns: { click_id: "uuid-..." }
    → click_id appended to affiliate URL as subId1, subId2
    ↓
[Browser] → window.location.href = affiliateUrl
    → Redirects to: https://hop-skip-drive.pxf.io/6kxyEK?subId1=<uuid>&subId2=<uuid>
    ↓
[Affiliate Network (Impact)]
    → Tracks the click (subId1 stored against session)
    → User completes required action (install, sign up, purchase)
    ↓
[Affiliate Network fires Postback]
    → POST /api/webhooks/affiliate/
      Body: { sub_id: "<uuid>", commission: "10.00", status: "APPROVED" }
      Header: Authorization: Token <AFFILIATE_WEBHOOK_SECRET>
    ↓
[Backend: webhook_views.py]
    → verify_signature() → authenticate postback
    → ClickTrack.objects.filter(click_id=sub_id)  → find original click
    → Blocklist check  → skip prohibited categories
    → user_commission = commission × PlatformSettings.user_cashback_percentage
    → CashbackTransaction.objects.create(user, amount, status='CONFIRMED')
    ↓
[Django Signal: signals.py]
    → send_cashback_earned_email (Celery task)
    → unlock_pending_bonuses ($15 threshold check)
```

---

## Priority Fix Recommendations

| Priority | Issue | Status / Recommendation |
|---|---|---|
| 🔴 P0 | `AFFILIATE_WEBHOOK_SECRET` default value | ✅ Fixed — production startup fails without a strong value; dev/test uses an explicit insecure fallback |
| 🔴 P0 | `ClickTrackViewSet` exposes all users' data | ✅ Done (`get_queryset` restricts standard users) |
| 🔴 P0 | GET allowed on webhook endpoint | ⚠️ Kept intentionally — GET and POST are both accepted because Impact/Admitad can pass macros in the URL; authentication is still required |
| 🔴 P1 | `poll_affiliate_networks` is a stub | ✅ Done (functional Impact API poll) and now scheduled hourly |
| 🔴 P1 | `process_quarterly_payouts` never pays | ✅ Done (creates PENDING manual payouts) |
| 🟡 P2 | `REJECTED` not in `CashbackTransaction.STATUS_CHOICES` | ✅ Fixed — `REJECTED` and `FROZEN` added; `ClickTrack` also declares `REJECTED` (migration `0041`) |
| 🟡 P2 | APP cashback shown as `%` but is fixed `$` amount | ✅ Already correct in current UI — `apps-cashback` renders `reward_currency` + `reward_amount` |
| 🟡 P2 | Rate limiter broken in serverless/Redis-less env | ✅ Redis is used when `REDIS_URL`/`CACHE_URL` is set (Compose sets it); LocMem remains the fallback. Window is still fixed at 60s |
| 🟢 P3 | Duplicate imports in `urls.py` | ✅ Not present in the current file |
| 🟡 P2 | Guest attribution | ❌ Not implemented — click generation still requires auth |
| 🟡 P2 | Real payout gateway | ❌ Not implemented — withdrawals are manual rows |
