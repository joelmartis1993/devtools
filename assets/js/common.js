/* DevKit common utilities — theme, clipboard, toast, shortcuts */
(function () {
  'use strict';

  // ===== Theme =====
  const THEME_KEY = 'devkit-theme';
  const root = document.documentElement;
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light') root.setAttribute('data-theme', 'light');

  window.toggleTheme = function () {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem(THEME_KEY, 'light');
    }
  };

  // ===== Toast =====
  let toastEl = null;
  let toastTimer = null;
  window.showToast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span></span>';
      document.body.appendChild(toastEl);
    }
    toastEl.querySelector('span').textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
  };

  // ===== Clipboard =====
  window.copyText = async function (text, label) {
    if (!text) { showToast('Nothing to copy'); return; }
    try {
      await navigator.clipboard.writeText(text);
      showToast(label || 'Copied to clipboard');
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showToast(label || 'Copied'); } catch { showToast('Copy failed'); }
      document.body.removeChild(ta);
    }
  };

  // ===== Download =====
  window.downloadText = function (text, filename, type) {
    const blob = new Blob([text], { type: type || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // ===== Tool card hover effect =====
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest && e.target.closest('.tool-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  // ===== Debounce =====
  window.debounce = function (fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  // ===== Shortcut helpers =====
  window.onShortcut = function (combo, handler) {
    document.addEventListener('keydown', (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (combo === 'ctrl+enter' && ctrl && e.key === 'Enter') { e.preventDefault(); handler(e); }
      if (combo === 'ctrl+shift+c' && ctrl && e.shiftKey && (e.key === 'C' || e.key === 'c')) { e.preventDefault(); handler(e); }
      if (combo === 'ctrl+k' && ctrl && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); handler(e); }
    });
  };
})();
