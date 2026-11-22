// ============================================================
// RewardSyncHQ Extension — Premium UI v2.0
// ============================================================

// Guard: only run in the top-level page, never inside iframes
if (window !== window.top) { throw new Error('[RewardSyncHQ] Skipping iframe.'); }

const API_BASE_URL = globalThis.REWARDSYNC_CONFIG.API_BASE_URL;
const FRONTEND_URL = globalThis.REWARDSYNC_CONFIG.FRONTEND_URL;

let storeCache = null;
let dockContainer = null;
let isMinimized = false;

// ============================================================
// INJECT GLOBAL STYLES
// ============================================================
function injectStyles() {
  if (document.getElementById('dv-styles')) return;
  const style = document.createElement('style');
  style.id = 'dv-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    #rewardsynchq-dock * {
      box-sizing: border-box;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    #rewardsynchq-popup * {
      box-sizing: border-box;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .dv-toast-wrap * {
      box-sizing: border-box;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    /* Dock shimmer on cashback button */
    @keyframes dv-shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes dv-pulse-ring {
      0%   { transform: scale(0.9); opacity: 0.7; }
      70%  { transform: scale(1.5); opacity: 0; }
      100% { transform: scale(0.9); opacity: 0; }
    }
    @keyframes dv-float {
      0%, 100% { transform: translateX(-50%) translateY(0px); }
      50%       { transform: translateX(-50%) translateY(-5px); }
    }
    @keyframes dv-slide-up {
      from { opacity: 0; transform: translateX(-50%) translateY(24px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes dv-fade-in {
      from { opacity: 0; transform: scale(0.94) translateY(8px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes dv-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes dv-confetti-fall {
      0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(80px) rotate(360deg); opacity: 0; }
    }
    @keyframes dv-toast-in {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes dv-toast-out {
      from { opacity: 1; transform: translateX(0); }
      to   { opacity: 0; transform: translateX(40px); }
    }
    @keyframes dv-tooltip-show {
      from { opacity: 0; transform: translateX(-50%) translateY(6px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes dv-progress-bar {
      from { width: 100%; }
      to   { width: 0%; }
    }
    @keyframes dv-badge-pop {
      0%   { transform: scale(0) rotate(-15deg); }
      60%  { transform: scale(1.2) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    @keyframes dv-logo-rotate {
      0%, 100% { filter: hue-rotate(0deg); }
      50%  { filter: hue-rotate(30deg); }
    }

    /* ── Cashback Top Bar ─────────────────────────────── */
    @keyframes dv-bar-in {
      from { opacity: 0; transform: translateY(-100%); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes dv-bar-out {
      from { opacity: 1; transform: translateY(0); }
      to   { opacity: 0; transform: translateY(-100%); }
    }
    @keyframes dv-bar-shimmer {
      from { background-position: -400px 0; }
      to   { background-position:  400px 0; }
    }
    @keyframes dv-rate-slide {
      from { opacity: 0; transform: translateX(-8px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes dv-banner-shimmer {
      from { background-position: -600px 0; }
      to   { background-position:  600px 0; }
    }
    /* ── Top Bar Layout ───────────────────────────────── */
    #dv-cashback-banner {
      all: initial;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 52px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      gap: 12px;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: rgba(9, 13, 24, 0.96);
      backdrop-filter: blur(20px) saturate(160%);
      -webkit-backdrop-filter: blur(20px) saturate(160%);
      border-bottom: 1.5px solid rgba(34,197,94,0.35);
      box-shadow: 0 1px 0 rgba(34,197,94,0.1), 0 4px 24px rgba(0,0,0,0.35);
      animation: dv-bar-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    /* Left: brand mark + rate info */
    .dv-bar-left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .dv-bar-gem {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }
    .dv-bar-divider {
      width: 1px;
      height: 20px;
      background: rgba(255,255,255,0.1);
      flex-shrink: 0;
    }
    .dv-bar-rate-badge {
      display: flex;
      align-items: baseline;
      gap: 1px;
      animation: dv-rate-slide 0.4s 0.1s both;
    }
    .dv-bar-rate-num {
      font-size: 22px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -1px;
      background: linear-gradient(135deg, #86efac, #22c55e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .dv-bar-rate-pct {
      font-size: 13px;
      font-weight: 800;
      color: #22c55e;
      line-height: 1;
    }
    .dv-bar-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0;
    }
    .dv-bar-title {
      font-size: 12px;
      font-weight: 700;
      color: #f1f5f9;
      line-height: 1.2;
      letter-spacing: -0.1px;
    }
    .dv-bar-sub {
      font-size: 10.5px;
      font-weight: 500;
      color: rgba(148,163,184,0.7);
      line-height: 1.2;
      margin-top: 1px;
    }

    /* Center: grows to push right group to edge */
    .dv-bar-spacer { flex: 1; }

    /* Right: action buttons */
    .dv-bar-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    .dv-bar-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 13px;
      border-radius: 8px;
      border: 1px solid;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: 'Inter', system-ui, sans-serif;
      line-height: 1;
    }
    .dv-bar-btn:hover  { transform: translateY(-1px); }
    .dv-bar-btn:active { transform: scale(0.96); }

    .dv-bar-btn-wishlist {
      background: rgba(244,63,94,0.08);
      border-color: rgba(244,63,94,0.2);
      color: #fda4af;
    }
    .dv-bar-btn-wishlist:hover {
      background: rgba(244,63,94,0.16);
      border-color: rgba(244,63,94,0.4);
    }
    .dv-bar-btn-ai {
      background: rgba(139,92,246,0.08);
      border-color: rgba(139,92,246,0.2);
      color: #c4b5fd;
    }
    .dv-bar-btn-ai:hover {
      background: rgba(139,92,246,0.16);
      border-color: rgba(139,92,246,0.4);
    }

    /* Primary activate CTA */
    .dv-bar-cta {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 8px 16px;
      border-radius: 9px;
      border: none;
      font-size: 12px;
      font-weight: 800;
      color: #fff;
      cursor: pointer;
      white-space: nowrap;
      background: linear-gradient(90deg, #22c55e, #16a34a, #22c55e);
      background-size: 200% auto;
      animation: dv-bar-shimmer 2.5s linear infinite;
      box-shadow: 0 2px 12px rgba(34,197,94,0.35);
      transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s;
      font-family: 'Inter', system-ui, sans-serif;
      line-height: 1;
    }
    .dv-bar-cta:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 18px rgba(34,197,94,0.5);
    }
    .dv-bar-cta:active { transform: scale(0.97); }

    /* Close X */
    .dv-bar-close {
      width: 26px;
      height: 26px;
      border-radius: 7px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.09);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
      color: rgba(148,163,184,0.7);
      transition: all 0.15s;
      font-family: 'Inter', system-ui, sans-serif;
      margin-left: 4px;
    }
    .dv-bar-close:hover {
      background: rgba(244,63,94,0.12);
      border-color: rgba(244,63,94,0.3);
      color: #f43f5e;
    }

    .dv-icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 14px;
      border: 1.5px solid transparent;
      cursor: pointer;
      transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      flex-shrink: 0;
    }
    .dv-icon-btn:hover {
      transform: scale(1.12) translateY(-2px);
    }
    .dv-icon-btn:active {
      transform: scale(0.95);
    }
    .dv-tooltip {
      position: absolute;
      bottom: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%) translateY(6px);
      background: #0f172a;
      color: #f1f5f9;
      font-size: 11px;
      font-weight: 600;
      padding: 5px 10px;
      border-radius: 8px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      letter-spacing: 0.3px;
      z-index: 10;
      transition: all 0.18s ease;
    }
    .dv-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: #0f172a;
    }
    .dv-icon-btn:hover .dv-tooltip {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .dv-divider {
      width: 1px;
      height: 28px;
      background: linear-gradient(to bottom, transparent, rgba(148,163,184,0.3), transparent);
      flex-shrink: 0;
    }

    /* Popup scrollbar */
    #rewardsynchq-popup ::-webkit-scrollbar { width: 5px; }
    #rewardsynchq-popup ::-webkit-scrollbar-track { background: transparent; }
    #rewardsynchq-popup ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

    /* Popup list items */
    .dv-pro-item, .dv-con-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 10px;
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 6px;
      transition: background 0.15s;
    }
    .dv-pro-item { background: #f0fdf4; color: #166534; }
    .dv-pro-item:hover { background: #dcfce7; }
    .dv-con-item { background: #fff1f2; color: #9f1239; }
    .dv-con-item:hover { background: #ffe4e6; }
    .dv-pro-icon { color: #22c55e; font-size: 14px; flex-shrink: 0; margin-top: 1px; }
    .dv-con-icon { color: #f43f5e; font-size: 14px; flex-shrink: 0; margin-top: 1px; }

    /* Minimized bubble */
    #dv-mini-bubble {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
      box-shadow: 0 8px 24px rgba(99,102,241,0.45), 0 0 0 4px rgba(99,102,241,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 2147483647;
      animation: dv-float 3s ease-in-out infinite;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-size: 24px;
    }
    #dv-mini-bubble:hover {
      transform: translateX(-50%) scale(1.12);
      box-shadow: 0 12px 32px rgba(99,102,241,0.55), 0 0 0 6px rgba(99,102,241,0.2);
    }
    .dv-pulse-ring {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid rgba(99,102,241,0.5);
      animation: dv-pulse-ring 2s ease-out infinite;
    }
  `;
  document.head.appendChild(style);
}

// ============================================================
// TOAST NOTIFICATIONS (replaces alert())
// ============================================================
function showToast(message, type = 'info', duration = 3500) {
  let wrap = document.querySelector('.dv-toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'dv-toast-wrap';
    wrap.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(wrap);
  }

  const configs = {
    success: { bg: 'linear-gradient(135deg,#22c55e,#16a34a)', icon: '✅', border: 'rgba(34,197,94,0.3)' },
    error:   { bg: 'linear-gradient(135deg,#f43f5e,#e11d48)', icon: '❌', border: 'rgba(244,63,94,0.3)' },
    info:    { bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', icon: 'ℹ️',  border: 'rgba(99,102,241,0.3)' },
    warning: { bg: 'linear-gradient(135deg,#f59e0b,#d97706)', icon: '⚠️', border: 'rgba(245,158,11,0.3)' },
  };
  const cfg = configs[type] || configs.info;

  const toast = document.createElement('div');
  toast.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(15,23,42,0.95);
    backdrop-filter: blur(16px);
    border: 1px solid ${cfg.border};
    border-radius: 14px;
    padding: 12px 16px;
    min-width: 260px;
    max-width: 340px;
    pointer-events: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    animation: dv-toast-in 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
    position: relative;
    overflow: hidden;
  `;
  toast.innerHTML = `
    <div style="width:32px;height:32px;border-radius:10px;background:${cfg.bg};display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">${cfg.icon}</div>
    <span style="color:#f1f5f9;font-size:13px;font-weight:500;line-height:1.4;flex:1;">${message}</span>
    <button style="background:none;border:none;color:#64748b;cursor:pointer;font-size:16px;padding:0;line-height:1;pointer-events:auto;flex-shrink:0;" onclick="this.closest('[style]').remove()">✕</button>
    <div style="position:absolute;bottom:0;left:0;height:2px;background:${cfg.bg};border-radius:0 0 14px 14px;animation:dv-progress-bar ${duration}ms linear forwards;"></div>
  `;

  wrap.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'dv-toast-out 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================
// CONFETTI BURST (for cashback activation)
// ============================================================
function burstConfetti(originEl) {
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#6366f1','#8b5cf6','#22c55e','#f59e0b','#f43f5e','#06b6d4'];

  for (let i = 0; i < 22; i++) {
    const dot = document.createElement('div');
    const size = 6 + Math.random() * 8;
    const angle = Math.random() * 360;
    const distance = 60 + Math.random() * 80;
    const rad = (angle * Math.PI) / 180;
    dot.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${cx}px;
      top: ${cy}px;
      z-index: 2147483647;
      pointer-events: none;
      transform-origin: center;
      animation: dv-confetti-fall 0.8s ease-out ${i * 30}ms forwards;
    `;
    // Spread in random direction
    dot.style.transform = `translate(${Math.cos(rad) * distance}px, ${Math.sin(rad) * distance}px)`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 1200 + i * 30);
  }
}

// ============================================================
// MINI BUBBLE (collapsed state)
// ============================================================
function showMiniBubble() {
  if (document.getElementById('dv-mini-bubble')) return;
  const bubble = document.createElement('div');
  bubble.id = 'dv-mini-bubble';
  bubble.innerHTML = `<div class="dv-pulse-ring"></div>💎`;
  bubble.onclick = () => {
    bubble.remove();
    isMinimized = false;
    if (dockContainer) {
      dockContainer.style.display = 'flex';
      dockContainer.style.animation = 'dv-slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards';
    }
  };
  document.body.appendChild(bubble);
}

// ============================================================
// INIT DOCK
// ============================================================
function initDock() {
  injectStyles();
  if (document.getElementById('rewardsynchq-dock')) return;

  dockContainer = document.createElement('div');
  dockContainer.id = 'rewardsynchq-dock';
  dockContainer.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(99, 102, 241, 0.25);
    border-radius: 999px;
    box-shadow:
      0 24px 48px -8px rgba(0,0,0,0.5),
      0 0 0 1px rgba(255,255,255,0.05) inset,
      0 8px 16px rgba(99,102,241,0.15);
    z-index: 2147483647;
    animation: dv-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
    pointer-events: auto;
  `;

  // Logo mark
  const logo = document.createElement('div');
  logo.style.cssText = `
    width: 34px;
    height: 34px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(99,102,241,0.4);
    animation: dv-logo-rotate 4s ease-in-out infinite;
    cursor: default;
  `;
  logo.innerHTML = '💎';
  logo.title = 'RewardSyncHQ';
  dockContainer.appendChild(logo);

  // Brand label
  const label = document.createElement('span');
  label.style.cssText = `
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: rgba(255,255,255,0.9);
    padding-right: 4px;
    white-space: nowrap;
  `;
  label.textContent = 'RewardSyncHQ';
  dockContainer.appendChild(label);

  document.body.appendChild(dockContainer);

  // Animate in
  setTimeout(() => {
    dockContainer.style.opacity = '1';
  }, 100);
}

// ============================================================
// 1. CASHBACK BUTTON
// ============================================================
function addCashbackButton(rate, slug) {
  if (!dockContainer) initDock();

  // Divider
  const div1 = document.createElement('div');
  div1.className = 'dv-divider';
  dockContainer.appendChild(div1);

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position: relative; display: flex; align-items: center;';

  // Pulse ring behind button
  const ring = document.createElement('div');
  ring.style.cssText = `
    position: absolute;
    inset: -3px;
    border-radius: 999px;
    border: 2px solid rgba(34, 197, 94, 0.5);
    animation: dv-pulse-ring 2s ease-out infinite;
    pointer-events: none;
  `;
  wrapper.appendChild(ring);

  const btn = document.createElement('button');
  btn.id = 'dv-cashback-btn';
  btn.style.cssText = `
    display: flex;
    align-items: center;
    gap: 7px;
    background: linear-gradient(90deg, #22c55e, #16a34a, #22c55e);
    background-size: 200% auto;
    color: white;
    border: none;
    padding: 9px 18px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 13px;
    cursor: pointer;
    letter-spacing: 0.3px;
    box-shadow: 0 4px 16px rgba(34, 197, 94, 0.45);
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    animation: dv-shimmer 2.5s linear infinite;
    position: relative;
    white-space: nowrap;
  `;

  btn.innerHTML = `
    <span style="font-size:16px;line-height:1;">💰</span>
    <span>Activate <strong>${rate}%</strong> Cashback</span>
    <span style="background:rgba(255,255,255,0.2);border-radius:6px;padding:2px 7px;font-size:11px;font-weight:700;letter-spacing:0.5px;">GO →</span>
  `;

  btn.onmouseover = () => {
    btn.style.transform = 'scale(1.05) translateY(-1px)';
    btn.style.boxShadow = '0 8px 24px rgba(34,197,94,0.55)';
  };
  btn.onmouseout = () => {
    btn.style.transform = 'scale(1) translateY(0)';
    btn.style.boxShadow = '0 4px 16px rgba(34,197,94,0.45)';
  };
  btn.onmousedown = () => btn.style.transform = 'scale(0.97)';

  btn.onclick = () => {
    burstConfetti(btn);
    showToast('🎉 Redirecting to activate your cashback!', 'success');
    setTimeout(() => {
      window.location.href = `${FRONTEND_URL}/activate?brand=${slug}&direct_url=${encodeURIComponent(window.location.href)}`;
    }, 600);
  };

  wrapper.appendChild(btn);
  dockContainer.appendChild(wrapper);
}

// ============================================================
// 2. WISHLIST BUTTON
// ============================================================
function addWishlistButton() {
  if (!dockContainer) initDock();

  const div = document.createElement('div');
  div.className = 'dv-divider';
  dockContainer.appendChild(div);

  const btn = document.createElement('button');
  btn.className = 'dv-icon-btn';
  btn.style.cssText += `
    background: rgba(244,63,94,0.12);
    border-color: rgba(244,63,94,0.2);
    color: #f43f5e;
    font-size: 18px;
  `;
  btn.innerHTML = `
    ❤️
    <span class="dv-tooltip">Save to Wishlist</span>
  `;

  btn.onmouseover = () => {
    btn.style.background = 'rgba(244,63,94,0.22)';
    btn.style.borderColor = 'rgba(244,63,94,0.4)';
    btn.style.boxShadow = '0 4px 16px rgba(244,63,94,0.3)';
  };
  btn.onmouseout = () => {
    btn.style.background = 'rgba(244,63,94,0.12)';
    btn.style.borderColor = 'rgba(244,63,94,0.2)';
    btn.style.boxShadow = 'none';
  };

  btn.onclick = async () => {
    btn.innerHTML = `<span style="animation:dv-spin 1s linear infinite;display:inline-block;">⏳</span><span class="dv-tooltip">Saving…</span>`;
    btn.style.pointerEvents = 'none';

    let title = document.title;
    const titleEl = document.querySelector('h1, .product-title, #productTitle');
    if (titleEl && titleEl.innerText) title = titleEl.innerText.trim();

    const priceRegex = /[\$£€]\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/;
    let currentPrice = null;
    const priceEls = document.querySelectorAll('.price, .product-price, #priceblock_ourprice, [data-price]');
    for (let el of priceEls) {
      const match = el.innerText.match(priceRegex);
      if (match) { currentPrice = parseFloat(match[1].replace(',', '')); break; }
    }
    if (!currentPrice) {
      const match = document.body.innerText.match(priceRegex);
      if (match) currentPrice = parseFloat(match[1].replace(',', ''));
    }

    if (!currentPrice) {
      showToast('Could not find a price on this page.', 'warning');
      btn.innerHTML = `❤️<span class="dv-tooltip">Save to Wishlist</span>`;
      btn.style.pointerEvents = 'auto';
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/extension/wishlist/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: window.location.href,
          title,
          current_price: currentPrice,
          target_price: currentPrice * 0.9,
        }),
      });

      if (res.ok) {
        btn.innerHTML = `✅<span class="dv-tooltip">Saved!</span>`;
        btn.style.background = 'rgba(34,197,94,0.15)';
        btn.style.borderColor = 'rgba(34,197,94,0.3)';
        showToast(`Added "${title.slice(0, 40)}…" to your wishlist!`, 'success');
      } else {
        throw new Error();
      }
    } catch {
      btn.innerHTML = `❤️<span class="dv-tooltip">Save to Wishlist</span>`;
      btn.style.pointerEvents = 'auto';
      showToast('Failed to save. Please try again.', 'error');
    }
  };

  dockContainer.appendChild(btn);
}

// ============================================================
// 3. AI REVIEW BUTTON
// ============================================================
function addAIReviewButton() {
  if (!dockContainer) initDock();

  const btn = document.createElement('button');
  btn.className = 'dv-icon-btn';
  btn.style.cssText += `
    background: rgba(139,92,246,0.12);
    border-color: rgba(139,92,246,0.2);
    color: #8b5cf6;
    font-size: 18px;
  `;
  btn.innerHTML = `
    ✨
    <span class="dv-tooltip">AI Review Summary</span>
  `;

  btn.onmouseover = () => {
    btn.style.background = 'rgba(139,92,246,0.22)';
    btn.style.borderColor = 'rgba(139,92,246,0.4)';
    btn.style.boxShadow = '0 4px 16px rgba(139,92,246,0.3)';
  };
  btn.onmouseout = () => {
    btn.style.background = 'rgba(139,92,246,0.12)';
    btn.style.borderColor = 'rgba(139,92,246,0.2)';
    btn.style.boxShadow = 'none';
  };

  btn.onclick = async () => {
    btn.innerHTML = `<span style="animation:dv-spin 1s linear infinite;display:inline-block;">⏳</span><span class="dv-tooltip">Analyzing…</span>`;

    let reviews = [];
    const selectors = ['.review-text', '.content', '[data-hook="review-body"]', '.text'];
    for (let sel of selectors) {
      document.querySelectorAll(sel).forEach(el => {
        const text = el.innerText.trim();
        if (text.length > 20 && text.length < 1000) reviews.push(text);
      });
      if (reviews.length >= 5) break;
    }

    if (reviews.length === 0) {
      showToast('No product reviews found on this page.', 'warning');
      btn.innerHTML = `✨<span class="dv-tooltip">AI Review Summary</span>`;
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/extension/analyze-reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: reviews.slice(0, 15) }),
      });

      if (res.ok) {
        const data = await res.json();
        const fakePct = data.Fake_Probability_Percentage;
        const fakeColor = fakePct > 60 ? '#f43f5e' : fakePct > 30 ? '#f59e0b' : '#22c55e';
        const fakeLabel = fakePct > 60 ? '🚨 High Risk' : fakePct > 30 ? '⚠️ Moderate' : '✅ Trustworthy';
        const fakeGrade = fakePct > 60 ? 'D' : fakePct > 30 ? 'C' : fakePct > 10 ? 'B' : 'A';

        showPopup('✨ AI Review Analysis', `
          <div style="display:flex;gap:12px;margin-bottom:16px;">
            <div style="flex:1;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.15);border-radius:14px;padding:14px;text-align:center;">
              <div style="font-size:11px;color:#94a3b8;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:6px;">Fake Review Risk</div>
              <div style="font-size:32px;font-weight:900;color:${fakeColor};line-height:1;">${fakePct}%</div>
              <div style="font-size:12px;font-weight:700;color:${fakeColor};margin-top:4px;">${fakeLabel}</div>
            </div>
            <div style="flex:1;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.15);border-radius:14px;padding:14px;text-align:center;">
              <div style="font-size:11px;color:#94a3b8;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:6px;">Trust Grade</div>
              <div style="font-size:36px;font-weight:900;color:${fakeColor};line-height:1;">${fakeGrade}</div>
              <div style="font-size:12px;color:#64748b;margin-top:4px;">${reviews.length} reviews analyzed</div>
            </div>
          </div>

          <div style="margin-bottom:8px;">
            <div style="font-size:11px;color:#94a3b8;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:8px;">👍 What People Love</div>
            ${data.Pros.map(p => `
              <div class="dv-pro-item">
                <span class="dv-pro-icon">✓</span>
                <span>${p}</span>
              </div>
            `).join('')}
          </div>

          <div>
            <div style="font-size:11px;color:#94a3b8;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:8px;">👎 Common Complaints</div>
            ${data.Cons.map(c => `
              <div class="dv-con-item">
                <span class="dv-con-icon">✕</span>
                <span>${c}</span>
              </div>
            `).join('')}
          </div>
        `);
      } else {
        throw new Error();
      }
    } catch {
      showToast('Failed to analyze reviews. Please try again.', 'error');
    }

    btn.innerHTML = `✨<span class="dv-tooltip">AI Review Summary</span>`;
  };

  dockContainer.appendChild(btn);
}

// ============================================================
// 4. MINIMIZE BUTTON
// ============================================================
function addMinimizeButton() {
  if (!dockContainer) return;

  const btn = document.createElement('button');
  btn.className = 'dv-icon-btn';
  btn.style.cssText += `
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.5);
    font-size: 14px;
    margin-left: 2px;
  `;
  btn.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <span class="dv-tooltip">Minimize</span>
  `;

  btn.onmouseover = () => {
    btn.style.background = 'rgba(255,255,255,0.12)';
    btn.style.color = 'rgba(255,255,255,0.8)';
  };
  btn.onmouseout = () => {
    btn.style.background = 'rgba(255,255,255,0.06)';
    btn.style.color = 'rgba(255,255,255,0.5)';
  };

  btn.onclick = () => {
    isMinimized = true;
    dockContainer.style.animation = 'none';
    dockContainer.style.transition = 'all 0.35s cubic-bezier(0.55,0,1,0.45)';
    dockContainer.style.opacity = '0';
    dockContainer.style.transform = 'translateX(-50%) scale(0.8) translateY(20px)';
    setTimeout(() => {
      dockContainer.style.display = 'none';
      showMiniBubble();
    }, 350);
  };

  dockContainer.appendChild(btn);
}

// ============================================================
// POPUP
// ============================================================
function showPopup(title, htmlContent) {
  injectStyles();
  const existing = document.getElementById('rewardsynchq-popup');
  if (existing) {
    existing.style.animation = 'dv-fade-in 0.3s reverse forwards';
    setTimeout(() => existing.remove(), 300);
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'dv-overlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.2);
    backdrop-filter: blur(4px);
    z-index: 2147483646;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  overlay.onclick = () => closePopup();
  document.body.appendChild(overlay);
  setTimeout(() => overlay.style.opacity = '1', 10);

  const popup = document.createElement('div');
  popup.id = 'rewardsynchq-popup';
  popup.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    width: min(380px, calc(100vw - 32px));
    background: rgba(15, 23, 42, 0.97);
    backdrop-filter: blur(32px) saturate(180%);
    border: 1px solid rgba(99,102,241,0.2);
    border-top: 1px solid rgba(255,255,255,0.1);
    border-radius: 24px;
    box-shadow:
      0 32px 64px -16px rgba(0,0,0,0.7),
      0 0 0 1px rgba(255,255,255,0.04) inset;
    padding: 0;
    z-index: 2147483647;
    animation: dv-fade-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
    overflow: hidden;
  `;

  popup.innerHTML = `
    <!-- Header -->
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 20px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1));
    ">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 10px rgba(99,102,241,0.4);">💎</div>
        <h3 style="margin:0;font-size:15px;font-weight:800;color:#f1f5f9;letter-spacing:-0.2px;">${title}</h3>
      </div>
      <button id="dv-close-popup" style="
        width:28px;height:28px;border-radius:8px;
        background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);
        color:#94a3b8;cursor:pointer;font-size:14px;
        display:flex;align-items:center;justify-content:center;
        transition:all 0.2s;
      " onmouseover="this.style.background='rgba(244,63,94,0.2)';this.style.color='#f43f5e';"
        onmouseout="this.style.background='rgba(255,255,255,0.08)';this.style.color='#94a3b8';">✕</button>
    </div>
    <!-- Body -->
    <div style="padding:18px 20px 20px;max-height:420px;overflow-y:auto;color:#cbd5e1;">
      ${htmlContent}
    </div>
    <!-- Footer -->
    <div style="padding:12px 20px;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,0.2);">
      <span style="font-size:11px;color:#475569;font-weight:500;">Powered by RewardSyncHQ AI</span>
      <div style="display:flex;gap:6px;align-items:center;">
        <div style="width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px rgba(34,197,94,0.6);"></div>
        <span style="font-size:11px;color:#22c55e;font-weight:600;">Live</span>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  const closeBtn = popup.querySelector('#dv-close-popup');
  closeBtn.onclick = closePopup;

  function closePopup() {
    overlay.style.opacity = '0';
    popup.style.animation = 'dv-fade-in 0.3s cubic-bezier(0.55,0,1,0.45) reverse forwards';
    setTimeout(() => { popup.remove(); overlay.remove(); }, 300);
  }
}

// ============================================================
// CASHBACK BANNER — auto-appears when on a supported store
// ============================================================
function showCashbackBanner(rate, slug, domain) {
  injectStyles();
  if (document.getElementById('dv-cashback-banner')) return;

  const storeLabel = domain || slug || window.location.hostname.replace('www.', '');

  const bar = document.createElement('div');
  bar.id = 'dv-cashback-banner';
  bar.innerHTML = `
    <!-- Left: brand + rate -->
    <div class="dv-bar-left">
      <div class="dv-bar-gem">💎</div>
      <div class="dv-bar-divider"></div>
      <div class="dv-bar-rate-badge">
        <span class="dv-bar-rate-num">${rate}</span>
        <span class="dv-bar-rate-pct">%</span>
      </div>
      <div class="dv-bar-info">
        <span class="dv-bar-title">Cashback Available</span>
        <span class="dv-bar-sub">on ${storeLabel} · via RewardSyncHQ</span>
      </div>
    </div>

    <div class="dv-bar-spacer"></div>

    <!-- Right: actions -->
    <div class="dv-bar-right">
      <button class="dv-bar-btn dv-bar-btn-wishlist" id="dv-bnr-wishlist">❤️ Wishlist</button>
      <button class="dv-bar-btn dv-bar-btn-ai" id="dv-bnr-ai">✨ AI Reviews</button>
      <button class="dv-bar-cta" id="dv-bnr-activate">🚀 Activate ${rate}% Cashback →</button>
      <button class="dv-bar-close" id="dv-bnr-close">✕</button>
    </div>
  `;

  document.body.appendChild(bar);

  // Push page content down so bar doesn't overlap it
  document.documentElement.style.marginTop = '52px';

  function closeBanner() {
    bar.style.animation = 'dv-bar-out 0.3s ease forwards';
    setTimeout(() => {
      bar.remove();
      document.documentElement.style.marginTop = '';
    }, 300);
  }

  document.getElementById('dv-bnr-close').onclick = closeBanner;

  document.getElementById('dv-bnr-activate').onclick = () => {
    burstConfetti(document.getElementById('dv-bnr-activate'));
    showToast('🎉 Redirecting to activate your cashback!', 'success');
    setTimeout(() => {
      window.location.href = `${FRONTEND_URL}/activate?brand=${slug}&direct_url=${encodeURIComponent(window.location.href)}`;
    }, 600);
  };

  document.getElementById('dv-bnr-wishlist').onclick = () => {
    if (!dockContainer) { initDock(); addWishlistButton(); addAIReviewButton(); addMinimizeButton(); }
    const wBtn = dockContainer && [...dockContainer.querySelectorAll('.dv-icon-btn')].find(b => b.innerHTML.includes('❤️'));
    if (wBtn) wBtn.click(); else showToast('Navigate to a product page first.', 'info');
  };

  document.getElementById('dv-bnr-ai').onclick = () => {
    if (!dockContainer) { initDock(); addWishlistButton(); addAIReviewButton(); addMinimizeButton(); }
    const aiBtn = dockContainer && [...dockContainer.querySelectorAll('.dv-icon-btn')].find(b => b.innerHTML.includes('✨'));
    if (aiBtn) aiBtn.click(); else showToast('Open a product page with reviews.', 'info');
  };
}

// ============================================================
// MESSAGE LISTENER
// ============================================================
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'SHOW_CASHBACK_BANNER') {
    // 1. Show the prominent auto-popup banner
    showCashbackBanner(request.cashback, request.slug, request.domain);
    // 2. Also set up the persistent mini-dock for continued access
    initDock();
    addCashbackButton(request.cashback, request.slug);
    addWishlistButton();
    addAIReviewButton();
    addMinimizeButton();
  }

  // Triggered from the popup's quick-action buttons
  if (request.action === 'TRIGGER_WISHLIST') {
    if (!dockContainer) {
      initDock();
      addWishlistButton();
      addAIReviewButton();
      addMinimizeButton();
    }
    // Programmatically click the wishlist button
    const wishlistBtn = dockContainer && dockContainer.querySelector('[title="Save to Wishlist"], .dv-icon-btn');
    if (wishlistBtn) wishlistBtn.click();
    else showToast('Open a product page first, then try again.', 'info');
  }

  if (request.action === 'TRIGGER_AI_REVIEW') {
    if (!dockContainer) {
      initDock();
      addWishlistButton();
      addAIReviewButton();
      addMinimizeButton();
    }
    const aiBtn = dockContainer && [...dockContainer.querySelectorAll('.dv-icon-btn')].find(b => b.innerHTML.includes('✨'));
    if (aiBtn) aiBtn.click();
    else showToast('Open a product page with reviews first.', 'info');
  }
});

// The dock only appears on store pages (when SHOW_CASHBACK_BANNER is received).
// No auto-dock on generic pages to avoid clutter.
