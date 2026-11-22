// ============================================================
// RewardSyncHQ Extension — Background Service Worker v2.0
// ============================================================

importScripts('config.js');

// API configuration is centralised in config.js.
const API_URL = `${globalThis.REWARDSYNC_CONFIG.API_BASE_URL}/extension/stores/`;

const CACHE_KEY = 'supportedStores';
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
const RETRY_DELAYS_MS = [3000, 10000, 30000]; // 3s, 10s, 30s

let supportedStores = [];

// ============================================================
// FETCH WITH RETRY (exponential back-off)
// ============================================================
async function fetchWithRetry(url, retries = RETRY_DELAYS_MS.length) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      const isLastAttempt = attempt === retries;
      if (isLastAttempt) throw err;

      const delay = RETRY_DELAYS_MS[attempt];
      console.warn(`[RewardSyncHQ] Fetch attempt ${attempt + 1} failed. Retrying in ${delay / 1000}s…`, err.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// ============================================================
// LOAD FROM CACHE (on startup, to avoid empty-stores problem)
// ============================================================
async function loadFromCache() {
  return new Promise(resolve => {
    chrome.storage.local.get([CACHE_KEY, `${CACHE_KEY}_timestamp`], result => {
      const stores = result[CACHE_KEY];
      const timestamp = result[`${CACHE_KEY}_timestamp`];
      const isFresh = timestamp && (Date.now() - timestamp < CACHE_TTL_MS);

      if (stores && Array.isArray(stores) && stores.length > 0) {
        supportedStores = stores;
        console.log(
          `[RewardSyncHQ] Loaded ${stores.length} stores from cache` +
          (isFresh ? ' (fresh).' : ' (stale — will refresh).')
        );
        resolve(isFresh);
      } else {
        console.log('[RewardSyncHQ] No cached stores found.');
        resolve(false);
      }
    });
  });
}

// ============================================================
// SAVE TO CACHE
// ============================================================
function saveToCache(stores) {
  chrome.storage.local.set({
    [CACHE_KEY]: stores,
    [`${CACHE_KEY}_timestamp`]: Date.now(),
  }, () => {
    console.log(`[RewardSyncHQ] Cached ${stores.length} stores.`);
  });
}

// ============================================================
// UPDATE STORES FROM API
// ============================================================
async function updateSupportedStores(force = false) {
  try {
    console.log('[RewardSyncHQ] Fetching stores from API…');
    const stores = await fetchWithRetry(API_URL);

    if (!Array.isArray(stores) || stores.length === 0) {
      console.warn('[RewardSyncHQ] API returned empty or invalid store list. Keeping cached data.');
      return;
    }

    supportedStores = stores;
    saveToCache(stores);
    console.log(`[RewardSyncHQ] ✅ Updated ${stores.length} stores from API.`);
  } catch (err) {
    console.error('[RewardSyncHQ] ❌ All fetch retries failed. Using cached stores as fallback.', err.message);
    // supportedStores is already populated from cache (loadFromCache ran at startup)
  }
}

// ============================================================
// MATCH URL TO STORE
// ============================================================
function findStoreForUrl(urlString) {
  try {
    const { hostname } = new URL(urlString);
    return supportedStores.find(s => hostname.includes(s.domain)) || null;
  } catch {
    return null;
  }
}

// ============================================================
// SEND MESSAGE TO TAB (with retry if content script isn't ready)
// ============================================================
function sendCashbackMessage(tabId, store, attempt = 0) {
  chrome.tabs.sendMessage(
    tabId,
    { action: 'SHOW_CASHBACK_BANNER', cashback: store.rate, slug: store.slug, domain: store.domain },
    response => {
      if (chrome.runtime.lastError) {
        // Content script might not be injected yet — retry up to 3×
        if (attempt < 3) {
          setTimeout(() => sendCashbackMessage(tabId, store, attempt + 1), 500);
        }
      }
    }
  );
}

// ============================================================
// TAB LISTENER
// ============================================================
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  if (!tab.url.startsWith('http')) return; // skip chrome://, file://, etc.

  const store = findStoreForUrl(tab.url);
  if (store) {
    console.log(`[RewardSyncHQ] 🛍️ Matched store: ${store.domain} (${store.rate}% cashback)`);
    sendCashbackMessage(tabId, store);
  }
});

// ============================================================
// STARTUP SEQUENCE
// ============================================================
(async () => {
  // 1. Immediately load cached stores so tab listeners work right away
  const cacheIsFresh = await loadFromCache();

  // 2. If cache is stale or missing, fetch from API
  if (!cacheIsFresh) {
    await updateSupportedStores();
  }

  // 3. Schedule periodic refresh every hour
  setInterval(() => updateSupportedStores(), CACHE_TTL_MS);
})();
