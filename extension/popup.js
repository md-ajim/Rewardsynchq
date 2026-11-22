// ============================================================
// RewardSyncHQ — Popup Script v2.1
// ============================================================

const API_BASE_URL = globalThis.REWARDSYNC_CONFIG.API_BASE_URL;
const FRONTEND_URL = globalThis.REWARDSYNC_CONFIG.FRONTEND_URL;

// ── DOM refs ─────────────────────────────────────────────────
const heroWrap      = document.getElementById('hero-wrap');
const statStores    = document.getElementById('stat-stores');
const statSaved     = document.getElementById('stat-saved');
const statWishlist  = document.getElementById('stat-wishlist');
const btnWishlist   = document.getElementById('btn-wishlist');
const btnAI         = document.getElementById('btn-ai');
const btnDeals      = document.getElementById('btn-deals');
const btnExplore    = document.getElementById('btn-explore');
const btnSettings   = document.getElementById('btn-settings');
const linkDashboard = document.getElementById('link-dashboard');
const linkSettings  = document.getElementById('link-settings-footer');

// ── Navigation ───────────────────────────────────────────────
btnDeals.href    = `${FRONTEND_URL}/brands-deals`;
btnExplore.href  = `${FRONTEND_URL}/brands-deals`;
[btnSettings, linkSettings].forEach(el =>
  el.addEventListener('click', () => chrome.tabs.create({ url: `${FRONTEND_URL}/dashboard/settings` }))
);
linkDashboard.addEventListener('click', () =>
  chrome.tabs.create({ url: `${FRONTEND_URL}/dashboard` })
);

// ── Hero: Active (cashback found) ────────────────────────────
function renderHeroActive(store, tabUrl) {
  heroWrap.innerHTML = `
    <div class="hero-card hero-active" style="animation: scaleIn .4s cubic-bezier(.34,1.56,.64,1) both;">
      <div class="hero-eyebrow">💰 Cashback Available</div>
      <div class="hero-rate-block">
        <span class="hero-rate">${store.rate}</span>
        <span class="hero-rate-suffix">%</span>
      </div>
      <div class="hero-store">on <strong>${store.name || store.domain}</strong> · via RewardSyncHQ</div>
      <button class="activate-btn" id="popup-activate-btn">
        <span>🚀</span>
        <span>Activate Cashback Now</span>
        <span class="activate-btn-badge">GO →</span>
      </button>
    </div>
  `;
  document.getElementById('popup-activate-btn').addEventListener('click', () => {
    chrome.tabs.create({
      url: `${FRONTEND_URL}/activate?brand=${store.slug}&direct_url=${encodeURIComponent(tabUrl)}`
    });
  });
}

// ── Hero: Idle (no cashback on this page) ────────────────────
function renderHeroIdle() {
  heroWrap.innerHTML = `
    <div class="hero-card hero-idle" style="animation: scaleIn .4s cubic-bezier(.34,1.56,.64,1) both;">
      <div class="hero-eyebrow">No Cashback on This Page</div>
      <div class="hero-rate-block">
        <span class="hero-rate">500+</span>
      </div>
      <p class="idle-sub">Stores with cashback available. Browse them below or visit a supported store.</p>
      <button class="idle-cta" id="btn-see-stores">
        🌐 See All Supported Stores
      </button>
    </div>
  `;
  document.getElementById('btn-see-stores').addEventListener('click', () => {
    chrome.tabs.create({ url: `${FRONTEND_URL}/brands-deals` });
  });
}

// ── Hero: Loading skeleton ────────────────────────────────────
function renderHeroLoading() {
  heroWrap.innerHTML = `
    <div class="hero-card hero-idle">
      <div class="hero-eyebrow">Checking page…</div>
      <div class="skel-line" style="height:52px;width:140px;margin-bottom:10px;border-radius:14px;"></div>
      <div class="skel-line" style="height:13px;width:100px;margin-bottom:16px;"></div>
      <div class="skel-line" style="height:42px;width:100%;border-radius:12px;"></div>
    </div>
  `;
}

// ── Detect store on current tab ───────────────────────────────
async function detectCurrentStore() {
  renderHeroLoading();

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.startsWith('http')) { renderHeroIdle(); return; }

  const { hostname } = new URL(tab.url);
  chrome.storage.local.get(['supportedStores'], ({ supportedStores = [] }) => {
    const match = supportedStores.find(s => hostname.includes(s.domain));
    match ? renderHeroActive(match, tab.url) : renderHeroIdle();
  });
}

// ── Animated counter ─────────────────────────────────────────
function animateCount(el, target, prefix = '', suffix = '') {
  const duration = 700;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ── Load stats ────────────────────────────────────────────────
async function loadStats() {
  // Store count
  chrome.storage.local.get(['supportedStores'], ({ supportedStores }) => {
    if (supportedStores?.length) {
      animateCount(statStores, supportedStores.length);
    }
  });

  // Savings
  chrome.storage.local.get(['totalSaved'], ({ totalSaved }) => {
    if (totalSaved) statSaved.textContent = `$${Math.round(totalSaved)}`;
  });

  // Wishlist count from API (non-blocking)
  try {
    const res = await fetch(`${API_BASE_URL}/extension/wishlist/`);
    if (res.ok) {
      const data = await res.json();
      const count = Array.isArray(data) ? data.length : (data.count ?? 0);
      animateCount(statWishlist, count);
    }
  } catch { /* offline — keep zero */ }
}

// ── Send action to page content script ───────────────────────
function sendToTab(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab) return;
    chrome.tabs.sendMessage(tab.id, { action }, () => {
      // Suppress "no listener" error when on non-product pages
      void chrome.runtime.lastError;
    });
  });
}

btnWishlist.addEventListener('click', () => { sendToTab('TRIGGER_WISHLIST');   window.close(); });
btnAI.addEventListener('click',       () => { sendToTab('TRIGGER_AI_REVIEW'); window.close(); });

// ── Boot ──────────────────────────────────────────────────────
detectCurrentStore();
loadStats();
