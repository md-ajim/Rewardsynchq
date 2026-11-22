# DealVerse (RewardSyncHQ) — System Architecture Guide & Improvements Roadmap

This document provides a comprehensive technical overview of how the DealVerse (RewardSyncHQ) platform currently operates and details the necessary security, feature, and architectural improvements required for a production-ready deployment.

---

## Section 1: How the System Currently Works

The platform is designed as a decoupled system containing three core components: the **Next.js Frontend**, the **Django REST Framework (DRF) Backend**, and the **Chrome Browser Extension**.

```text
+------+             +------------------+             +-------------------+             +----------------+             +-------------------+
| User |             | Chrome Extension |             | Next.js Frontend  |             | Django Backend |             | Affiliate Network |
+--+---+             +--------+---------+             +---------+---------+             +-------+--------+             +---------+---------+
   |                          |                                 |                               |                               |
   | 1. Visits Partner Store  |                                 |                               |                               |
   |------------------------->|                                 |                               |                               |
   |                          | 2. Show popup & click Activate  |                               |                               |
   |                          |-------------------------------->|                               |                               |
   |                          |                                 | 3. POST /session/generate...  |                               |
   |                          |                                 |------------------------------>|                               |
   |                          |                                 |                               |                               |
   |                          |                                 | 4. Returns click_id (UUID)    |                               |
   |                          |                                 |<------------------------------|                               |
   |                          |                                 |                               |                               |
   |                          | 5. Redirects to Affiliate URL   |                               |                               |
   |                          |<--------------------------------|                               |                               |
   |                          |                                 |                               |                               |
   | 6. Completes Purchase    |                                 |                               |                               |
   |--------------------------------------------------------------------------------------------------------------------------->|
   |                          |                                 |                               |                               |
   |                          |                                 |                               | 7. Webhook Postback (sub_id)   |
   |                          |                                 |                               |<------------------------------|
   |                          |                                 |                               |                               |
   |                          |                                 |                               | 8. Verifies HMAC & blocklist  |
   |                          |                                 |                               |---┐                           |
   |                          |                                 |                               |   |                           |
   |                          |                                 |                               |<--┘                           |
   |                          |                                 |                               |                               |
   |                          |                                 |                               | 9. Updates wallet & sends mail|
   |                          |<----------------------------------------------------------------|                               |
   |                          |                                 |                               |                               |
```

### 1. End-to-End Cashback Tracking Pipeline
* **Click Generation**: When a logged-in user clicks "Activate Cashback", the frontend hits `/api/session/generate-click/` on the Django backend. The backend generates a unique `click_id` (UUID4) and saves a `ClickTrack` record in the database.
* **SubID Parameter Mapping**: The frontend appends this `click_id` as the SubID tracking parameter (e.g. `subId1` for Impact, `sid` for CJ, `clickref` for Awin) before redirecting the user to the merchant store via their affiliate link.
* **Webhook Postback Processing**: Upon a successful sale, the affiliate network triggers the `/api/webhooks/affiliate/` postback endpoint. The backend extracts the `sub_id`, queries the `ClickTrack` record, calculates the user's portion of the commission based on platform revenue share settings, and creates a `CashbackTransaction` record.
* **Signals**: A post-save signal triggers a Celery task to email the user and checks if the user has reached the $15 confirmed threshold to unlock sign-up or referral bonuses.

### 2. Anti-Fraud & Compliance Checks
* **Click Rate Limiting**: Restricts users to 5 click activations per user/IP per minute using a cache tracker. Excess clicks generate a `FLAGGED` record for auditing and return a 429 status.
* **Multi-Account Sign-up Checks**: If more than 3 accounts register from the same IP address in 24 hours, the accounts are marked as `UNDER_REVIEW` and their signup/referral cashbacks are set to `FROZEN`.
* **Islamic Guidelines Blocklist**: Webhook transactions and product queries are matched against `blocklist.py` categories (e.g., alcohol, interest banking, pork, conventional credit cards, conventional loans, gambling). Violations set the cashback status to `REJECTED` and commission to 0.

### 3. Background Jobs (Celery & Redis)
* **API Polling Fallback (`poll_affiliate_networks`)**: Runs hourly to poll the Impact Radius API for conversions that failed to report via webhooks. It matches SubIDs and dynamically calculates commissions.
* **Quarterly Payouts (`process_quarterly_payouts`)**: Sweeps user accounts quarterly and creates `PENDING` manual payout request files for users with more than $5.00 in confirmed earnings.
* **Wishlist Price Tracking (`check_wishlist_prices`)**: Crawls saved item links daily to monitor price drops and emails users when the price drops below their configured target price.

### 4. Frontend & Chrome Extension Mechanics
* **Ad-Blocker Guard**: Injects a bait DOM element with common ad classes. If the element is blocked, the frontend pauses redirection and displays an alert warning the user to disable it to ensure cashback tracking functions.
* **WebSocket Integration**: Connects to `ws://localhost:8000/ws/cashback/` to receive instant transaction update signals, triggering TanStack React Query cache invalidations.
* **Extension Scraper**: Scrapes page selectors for reviews and prices, passing them to the AI review analyzer to detect fake review probabilities and map price trends using Recharts.

### 5. AI Shopping Recommendation Assistant (`AIAssistant.tsx` & `/api/chat/route.ts`)
* **Dynamic Catalog Feeding**: Prior to sending chat prompts to AI engines, the Next.js API route (`/api/chat/route.ts`) fetches active brands (`/api/brands/`), products (`/api/products/`), and categories (`/api/categories/`) in parallel with a 300-second cache TTL. It falls back to hardcoded database snapshots if the Django backend is offline.
* **System Prompt Formatting**: The fetched catalog is fed directly into a structured system prompt, teaching the AI assistant real cashback percentages and partner details to make genuine recommendations.
* **Robust Multi-Model Support**: Checks for `GEMINI_API_KEY` or `DEEPSEEK_API_KEY` environment variables. If Gemini is active, it dynamically queries the Google models API list, selecting the optimal model (e.g. `gemini-1.5-flash` or `gemini-1.5-pro`) and formatting history context. For DeepSeek, it formats completions matching `deepseek-chat`.
* **Global Floating UI FAB**: Rendered as a premium animated floating action bubble (`Bot` icon) on the bottom right of the Next.js layout (`layout.tsx`). Clicking reveals a chat sidebar featuring quick suggestions (e.g., "Best tech deals right now?").


---

## Section 2: Required System Improvements

To transition the current codebase into a fully hardened, production-ready environment, the following improvements should be implemented:

### Implementation status (this checkout)

| # | Item | Status | Evidence / note |
|---|---|---|---|
| 1a | Webhook secret startup check | **Implemented** | `backend/settings/settings.py` raises `ImproperlyConfigured` in production when `AFFILIATE_WEBHOOK_SECRET` is missing or a known default. Development/tests get an explicit insecure fallback. |
| 1b | Owner restrictions on payment methods, wishlist, withdrawals | **Already implemented** | `PaymentMethodViewSet`, `WithdrawalRequestViewSet`, and `CashbackClaimViewSet` filter `get_queryset()` by `request.user` and set `user` on create (`backend/dealvers/views.py`). |
| 2a | Add `REJECTED` to cashback status choices | **Implemented** | `CashbackTransaction.STATUS_CHOICES` now includes `REJECTED` and `FROZEN`; `ClickTrack.STATUS_CHOICES` now includes `REJECTED`. Migration `0041_alter_cashbacktransaction_status.py`. |
| 2b | Correct `DJANGO_SETTINGS_MODULE` in utility scripts | **Implemented** | `backend/clean_db.py` and `backend/fix_db_placeholders.py` now use `settings.settings`. |
| 2c | Fix `CashbackClaim.__str__` | **Implemented** | `backend/dealvers/claim_models.py` uses `self.store_name`. |
| 3 | Guest attribution | **Not implemented** | Click generation still requires authentication; no cookie-based claim-on-register flow exists. |
| 4 | Payment gateway | **Not implemented** | Withdrawals remain `WithdrawalRequest` records processed manually; no payout SDK is integrated. |
| 5 | Persistent Redis cache | **Implemented when configured** | `CACHES` switches to `django.core.cache.backends.redis.RedisCache` when `REDIS_URL`/`CACHE_URL` is set (Compose sets `REDIS_URL`), with a LocMem fallback. The limiter is still a fixed 60-second window. |
| 6a | App rewards shown as fixed amounts | **Already implemented** | `frontend/app/apps-cashback/*` renders `reward_currency` + `reward_amount` (e.g. `$10`), not percentages. |
| 6b | Central extension API configuration | **Implemented** | `extension/config.js` holds `API_BASE_URL` and `FRONTEND_URL`; the manifest/content script, service worker, and popup load it. Popup links now target `/brands-deals` and `/dashboard/settings`. |

Additional verification added: `backend/dealvers/tests.py` now covers declared status choices, `CashbackClaim.__str__`, HMAC/token verification, webhook create/update/GET/404, and the 6th-click rate limit.


### 1. Security & Configuration Hardening
* **Signature Verification Configuration Check**:
  * Currently, `WEBHOOK_SECRET` defaults to `'super-secret-key-for-webhooks'` (in `settings.py`) or `'default-secret-token'` (in `webhook_views.py`). The application should check at startup that a strong custom `AFFILIATE_WEBHOOK_SECRET` is set in the environment variables and fail to start if it is missing.
* **API Route Owner Restrictions**:
  * Ensure that API endpoints for modifying payment methods, wishlist items, or withdrawal requests explicitly check that `request.user` owns the record being accessed to prevent unauthorized modifications.

### 2. Database Models & Utility Script Bug Fixes
* **Extend `STATUS_CHOICES` for Cashback Transactions**:
  * Add `'REJECTED'` to `STATUS_CHOICES` in `finance_models.py` to prevent validation warnings when the webhook marks conversions violating the Islamic guidelines blocklist as `'REJECTED'`.
  ```python
  STATUS_CHOICES = [
      ('PENDING', 'Pending'),
      ('CONFIRMED', 'Confirmed'),
      ('CANCELLED', 'Cancelled'),
      ('REJECTED', 'Rejected'), # ← Add to match webhook state
  ]
  ```
* **Correct Django Settings Path in Utility Scripts**:
  * Update `clean_db.py` and `fix_db_placeholders.py` scripts to use `settings.settings` for `DJANGO_SETTINGS_MODULE` instead of incorrect settings paths (`backend.settings` or `dealvers.settings`) that cause execution crashes.
  ```python
  os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.settings')
  ```
* **Fix `CashbackClaim` String Conversion Bug**:
  * Fix the `__str__` attribute in `claim_models.py` which attempts to access `self.brand.name`. Since the model has no `brand` field and stores the store name as a string, this causes Django admin display pages to crash with an `AttributeError`.
  ```python
  def __str__(self):
      return f"{self.user.username} - {self.store_name} ({self.status})"
  ```

### 3. Guest Attribution Pipeline (UX Enhancement)
* **Problem**: Currently, if unauthenticated guests click affiliate links, no `ClickTrack` record is created. When the webhook postback returns, it throws a 404 error, and guest cashback is lost.
* **Solution**: 
  1. Save guest clicks in the database with `user = Null` and store the `click_id` in a secure browser cookie.
  2. If the user registers an account within 30 days, retrieve the `click_id` from the cookie and link it to the newly created user profile.

### 4. Production Payment Gateway Integration
* **PayPal Payouts & Crypto Gates**:
  * Integrate real payment gateways (such as the PayPal Payouts SDK or cryptocurrency merchant APIs) so that completing a withdrawal request automatically transfers funds to the user's wallet instead of merely changing the transaction state manually.

### 5. Persistent Caching for Serverless Limits
* **Redis Caching**:
  * Transition click rate-limiting and user tracking from local memory caches (which clear on process restarts or serverless cold starts) to persistent Redis-backed caches.

### 6. UI & Configuration Improvements
* **Fixed App Reward Representation**:
  * Modify frontend UI widgets to render mobile app task cashbacks as fixed currency amounts (e.g. `$10.00`) instead of percentages (e.g. `10%`) to avoid misleading users.
* **Extension API Configuration**:
  * Configure browser extension popup and background scripts to load API gateways dynamically from a config profile instead of hardcoding production URLs.
