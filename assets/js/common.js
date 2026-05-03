/* DevToolsHive common utilities — theme, clipboard, toast, shortcuts */
(function () {
  'use strict';

  // ===== Theme (dark by default; persist user preference) =====
  const THEME_KEY = 'dth-theme';
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
    if (text == null) return;
    text = String(text);
    try {
      await navigator.clipboard.writeText(text);
      showToast(label || 'Copied to clipboard');
    } catch {
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

  // ===== Global keyboard shortcuts =====
  // Tools register handlers via window.toolShortcuts = { process, copyOutput, clearInput }
  window.toolShortcuts = window.toolShortcuts || {};
  document.addEventListener('keydown', (e) => {
    const ctrl = e.ctrlKey || e.metaKey;
    if (!ctrl) return;
    const tag = (e.target && e.target.tagName) || '';
    const isInput = tag === 'INPUT' || tag === 'TEXTAREA';
    // Ctrl+Enter -> process
    if (e.key === 'Enter' && window.toolShortcuts.process) {
      e.preventDefault(); window.toolShortcuts.process();
    }
    // Ctrl+Shift+C -> copy output
    else if (e.shiftKey && (e.key === 'C' || e.key === 'c') && window.toolShortcuts.copyOutput) {
      e.preventDefault(); window.toolShortcuts.copyOutput();
    }
    // Ctrl+L -> clear input (only when in a tool input or page focused)
    else if (!e.shiftKey && (e.key === 'l' || e.key === 'L') && window.toolShortcuts.clearInput) {
      e.preventDefault(); window.toolShortcuts.clearInput();
    }
  });

  // Legacy helper (kept for older pages)
  window.onShortcut = function (combo, handler) {
    document.addEventListener('keydown', (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (combo === 'ctrl+enter' && ctrl && e.key === 'Enter') { e.preventDefault(); handler(e); }
      if (combo === 'ctrl+shift+c' && ctrl && e.shiftKey && (e.key === 'C' || e.key === 'c')) { e.preventDefault(); handler(e); }
      if (combo === 'ctrl+l' && ctrl && (e.key === 'l' || e.key === 'L')) { e.preventDefault(); handler(e); }
    });
  };

  // Auto-focus first tool input on load (skip if user already focused something)
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (document.activeElement && document.activeElement !== document.body) return;
      const first = document.querySelector('[data-autofocus], textarea#input, input#input, input#pattern, input#tsInput');
      if (first) try { first.focus(); } catch {}
    }, 50);
  });
})();
