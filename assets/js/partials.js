/* Shared header + footer renderer (kept as JS-injected partials) */
(function () {
  const ICON_MOON = '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  const ICON_SUN  = '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>';

  function basePath() {
    // Detect if we're inside /tools/ subdirectory
    return location.pathname.includes('/tools/') ? '../' : '';
  }

  window.renderHeader = function () {
    const b = basePath();
    return `
    <header class="header">
      <div class="header-inner">
        <a href="${b}index.html" class="logo">
          <span class="logo-mark">D</span>
          <span>DevToolsHive</span>
        </a>
        <nav class="nav" aria-label="Primary">
          <a href="${b}index.html">Tools</a>
          <a href="${b}index.html#about">About</a>
          <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
        </nav>
        <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme" title="Toggle theme (dark/light)">
          ${ICON_MOON}${ICON_SUN}
        </button>
      </div>
    </header>`;
  };

  window.renderFooter = function () {
    const b = basePath();
    const year = new Date().getFullYear();
    return `
    <footer class="footer">
      <div class="footer-inner">
        <div>© ${year} DevToolsHive · Free developer tools, in your browser.</div>
        <div class="footer-links">
          <a href="${b}index.html">Home</a>
          <a href="${b}tools/json-formatter.html">JSON</a>
          <a href="${b}tools/base64.html">Base64</a>
          <a href="${b}tools/url-encoder.html">URL</a>
          <a href="${b}tools/timestamp.html">Timestamp</a>
          <a href="${b}tools/uuid.html">UUID</a>
          <a href="${b}tools/regex.html">Regex</a>
          <a href="${b}tools/case-converter.html">Case</a>
        </div>
      </div>
    </footer>`;
  };

  // Auto-mount
  document.addEventListener('DOMContentLoaded', () => {
    const h = document.getElementById('site-header');
    const f = document.getElementById('site-footer');
    if (h) h.outerHTML = renderHeader();
    if (f) f.outerHTML = renderFooter();
  });
})();
