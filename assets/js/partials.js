/* Shared header & footer injection. Uses root-relative paths only. */
(function(){
  const TOOLS = [
    {name:'CSV to JSON Converter', slug:'csv-to-json', icon:'📄', cat:'Data', desc:'Convert CSV files and pasted data into clean JSON with robust parsing options.', i18nTitle:'tool.csv-to-json.title', i18nDesc:'tool.csv-to-json.desc'},
    {name:'JSON Formatter & Validator', slug:'json-formatter', icon:'{ }', cat:'Data', desc:'Beautify, validate and explore JSON with a tree view.', i18nTitle:'tool.json-formatter.title', i18nDesc:'tool.json-formatter.desc'},
    {name:'JSON to TypeScript', slug:'json-to-typescript', icon:'TS', cat:'Data', desc:'Convert JSON payloads into clean interfaces and types instantly.', i18nTitle:'tool.json-to-typescript.title', i18nDesc:'tool.json-to-typescript.desc'},
    {name:'JSON Diff', slug:'json-diff', icon:'⇄', cat:'Data', desc:'Compare two JSON documents side by side.', i18nTitle:'tool.json-diff.title', i18nDesc:'tool.json-diff.desc'},
    {name:'JWT Decoder', slug:'jwt-decoder', icon:'🔐', cat:'Security', desc:'Decode JWT header, payload and signature.', i18nTitle:'tool.jwt.title', i18nDesc:'tool.jwt.desc'},
    {name:'Cron Expression Generator', slug:'cron-generator', icon:'⏱', cat:'DevOps', desc:'Build cron expressions visually.', i18nTitle:'tool.cron.title', i18nDesc:'tool.cron.desc'},
    {name:'ENV ⇄ JSON ⇄ YAML', slug:'env-parser', icon:'📄', cat:'Data', desc:'Parse .env files and convert between formats.', i18nTitle:'tool.env.title', i18nDesc:'tool.env.desc'},
    {name:'Base64 Encoder / Decoder', slug:'base64', icon:'🔤', cat:'Encoding', desc:'Encode and decode Base64 with UTF-8 support.', i18nTitle:'tool.base64.title', i18nDesc:'tool.base64.desc'},
    {name:'URL Encoder / Decoder', slug:'url-encoder', icon:'🔗', cat:'Encoding', desc:'Percent-encode or decode URL components.', i18nTitle:'tool.url.title', i18nDesc:'tool.url.desc'},
    {name:'URL Parser', slug:'url-parser', icon:'🔗', cat:'Security', desc:'Parse URLs and inspect their protocol, hostname, port, path, query parameters, and fragment.', i18nTitle:'tool.url-parser.title', i18nDesc:'tool.url-parser.desc'},
    {name:'Unix Timestamp Converter', slug:'timestamp', icon:'🕐', cat:'DevOps', desc:'Convert between Unix timestamps and human dates.', i18nTitle:'tool.timestamp.title', i18nDesc:'tool.timestamp.desc'},
    {name:'UUID Generator', slug:'uuid', icon:'🆔', cat:'DevOps', desc:'Generate v4 UUIDs. Cryptographically secure.', i18nTitle:'tool.uuid.title', i18nDesc:'tool.uuid.desc'},
    {name:'Regex Tester', slug:'regex', icon:'.*', cat:'Text', desc:'Test regular expressions with live highlights.', i18nTitle:'tool.regex.title', i18nDesc:'tool.regex.desc'},
    {name:'SQL Formatter & Beautifier', slug:'sql-formatter', icon:'SQL', cat:'Data', desc:'Format SQL queries with a browser-based SQL beautifier.', i18nTitle:'tool.sql-formatter.title', i18nDesc:'tool.sql-formatter.desc'},
    {name:'CSS Formatter & Beautifier', slug:'css-formatter', icon:'CSS', cat:'Text', desc:'Format, validate and beautify CSS with syntax-aware styling and analysis tools.', i18nTitle:'tool.css-formatter.title', i18nDesc:'tool.css-formatter.desc'},
    {name:'Text Case Converter', slug:'case-converter', icon:'Aa', cat:'Text', desc:'Convert between camelCase, snake_case, kebab-case.', i18nTitle:'tool.case.title', i18nDesc:'tool.case.desc'},
    {name:'User Agent Parser', slug:'user-agent', icon:'🌐', cat:'Text', desc:'Parse User-Agent strings into browser, OS, device.', i18nTitle:'tool.user-agent.title', i18nDesc:'tool.user-agent.desc'},
    {name:'Hash Generator', slug:'hash-generator', icon:'#', cat:'Security', desc:'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes locally.', i18nTitle:'tool.hash-generator.title', i18nDesc:'tool.hash-generator.desc'}
  ];
  const toolLinks = TOOLS.map(t=>({slug:t.slug, k:t.i18nTitle.replace('.title','')}));
  window.DTH_TOOLS = TOOLS;

  function escapeHtml(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function ensurePaletteMarkup() {
    if (document.getElementById('cmdPalette')) return;
    const overlay = document.createElement('div');
    overlay.className = 'hp-palette-overlay';
    overlay.id = 'cmdPalette';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Search tools');
    overlay.innerHTML = `
      <div class="hp-palette">
        <div class="hp-palette-input-wrap">
          <span class="hp-palette-icon" aria-hidden="true">⌘</span>
          <input class="hp-palette-input" id="paletteInput" type="text" placeholder="Search tools… e.g. JSON, regex, JWT" autocomplete="off" />
          <button class="hp-palette-esc" id="paletteClose" aria-label="Close">esc</button>
        </div>
        <div class="hp-palette-results" id="paletteResults"></div>
      </div>
    `;
    document.body.insertBefore(overlay, document.body.firstChild);
  }

  function initPalette(){
    if (window.DTH && window.DTH._paletteInitialized) return;
    ensurePaletteMarkup();
    const overlay = document.getElementById('cmdPalette');
    const palInput = document.getElementById('paletteInput');
    const palResults = document.getElementById('paletteResults');
    const palClose = document.getElementById('paletteClose');
    const heroBtn = document.getElementById('heroOpenPalette');
    let palActiveIdx = -1;

    function openPalette() {
      overlay.classList.add('open');
      palInput.value = '';
      palActiveIdx = -1;
      renderPaletteResults('');
      setTimeout(() => palInput.focus(), 80);
      document.body.style.overflow = 'hidden';
    }

    function closePalette() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    function renderPaletteResults(query) {
      const q = query.toLowerCase().trim();
      const filtered = q
        ? TOOLS.filter((t) => (t.name + ' ' + t.cat + ' ' + t.desc + ' ' + t.slug).toLowerCase().includes(q))
        : TOOLS;

      if (filtered.length === 0) {
        palResults.innerHTML = '<div class="hp-palette-empty">No tools match "' + escapeHtml(query) + '"</div>';
        return;
      }

      let html = '<div class="hp-palette-group-label">' + (q ? 'Results' : 'All tools') + '</div>';
      filtered.forEach((tool, i) => {
        html +=
          '<a class="hp-palette-item' + (i === 0 ? ' active' : '') + '" href="/tools/' + tool.slug + '.html" data-idx="' + i + '">' +
          '<span class="hp-palette-item-icon">' + tool.icon + '</span>' +
          '<span class="hp-palette-item-text">' +
          '<div class="hp-palette-item-name">' + escapeHtml(tool.name) + '</div>' +
          '<div class="hp-palette-item-desc">' + escapeHtml(tool.desc) + '</div>' +
          '</span>' +
          '<span class="hp-palette-item-badge">' + escapeHtml(tool.cat) + '</span>' +
          '</a>';
      });
      palResults.innerHTML = html;
      palActiveIdx = 0;
    }

    function navigatePalette(dir) {
      const items = palResults.querySelectorAll('.hp-palette-item');
      if (!items.length) return;
      items.forEach((el) => el.classList.remove('active'));
      palActiveIdx = (palActiveIdx + dir + items.length) % items.length;
      items[palActiveIdx].classList.add('active');
      items[palActiveIdx].scrollIntoView({ block: 'nearest' });
    }

    function selectPaletteItem() {
      const items = palResults.querySelectorAll('.hp-palette-item');
      if (items[palActiveIdx]) {
        window.location.href = items[palActiveIdx].href;
      }
    }

    if (heroBtn) heroBtn.addEventListener('click', openPalette);
    if (palClose) palClose.addEventListener('click', closePalette);
    if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closePalette(); });
    if (palInput) palInput.addEventListener('input', () => renderPaletteResults(palInput.value));
    if (palInput) palInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); navigatePalette(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); navigatePalette(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); selectPaletteItem(); }
      else if (e.key === 'Escape') { closePalette(); }
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        overlay.classList.contains('open') ? closePalette() : openPalette();
      }
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closePalette();
      }
    });

    const cmdBtn = document.getElementById('cmd-palette-btn');
    if (cmdBtn) cmdBtn.addEventListener('click', openPalette);

    window.DTH._paletteInitialized = true;
  }

  window.DTH = window.DTH || {};
  window.DTH_TOOLS = TOOLS;
  window.DTH.initPalette = initPalette;

  function header(){
    const langOpts = [['en','English'],['es','Español'],['de','Deutsch'],['fr','Français'],['ja','日本語']]
      .map(([v,l])=>`<option value="${v}">${l}</option>`).join('');
    return `<header class="site-header"><div class="container row">
      <a class="brand" href="/"><span class="brand-mark">DT</span><span>DevToolsHive</span></a>
      <nav class="nav-primary" aria-label="Primary">
        <a href="/" data-i18n="nav.home">Home</a>
        <a href="/#tools" data-i18n="nav.tools">Tools</a>
        <a href="/blog/index.html" data-i18n="nav.blog">Blog</a>
        <button id="cmd-palette-btn" class="icon-btn" aria-label="Search tools" title="⌘K">⌘K</button>
        <select id="lang-switch" class="lang-select" aria-label="Language">${langOpts}</select>
        <button id="theme-toggle" class="icon-btn" aria-label="Toggle theme">☀</button>
      </nav>
    </div></header>`;
  }

  function footer(){
    const cols = TOOLS.slice(0,6).map(t=>`<li><a href="/tools/${t.slug}.html" data-i18n="${t.k}.title">${t.slug}</a></li>`).join('');
    const cols2= TOOLS.slice(6).map(t=>`<li><a href="/tools/${t.slug}.html" data-i18n="${t.k}.title">${t.slug}</a></li>`).join('');
    return `<footer class="site-footer"><div class="container">
      <div class="cols">
        <div>
          <a class="brand" href="/" style="margin-bottom:10px"><span class="brand-mark">DT</span><span>DevToolsHive</span></a>
          <p class="muted" data-i18n="footer.tagline" style="margin-top:8px;max-width:320px"></p>
        </div>
        <div><h4 data-i18n="footer.tools">Developer Tools</h4><ul>${cols}</ul></div>
        <div><h4 data-i18n="footer.popular">More Tools</h4><ul>${cols2}</ul></div>
        <div><h4 data-i18n="footer.resources">Resources</h4><ul>
          <li><a href="/blog/index.html" data-i18n="nav.blog">Blog</a></li>
          <li><a href="/pages/about.html">About</a></li>
          <li><a href="/pages/contact.html">Contact</a></li>
        </ul></div>
        <div><h4 data-i18n="footer.legal">Legal</h4><ul>
          <li><a href="/pages/privacy.html">Privacy Policy</a></li>
          <li><a href="/pages/terms.html">Terms of Service</a></li>
          <li><a href="/pages/disclaimer.html">Disclaimer</a></li>
        </ul></div>
      </div>
      <div class="meta">
        <span data-i18n="footer.copy">© 2026 DevToolsHive.</span>
        <span class="muted">v2.0</span>
      </div>
    </div></footer>`;
  }

  function injectShell(){
    const h=document.getElementById('site-header'); if(h) h.outerHTML = header();
    const f=document.getElementById('site-footer'); if(f) f.outerHTML = footer();
    initPalette();
    if(window.DTH_LANG){ /* re-apply after injection */
      document.dispatchEvent(new CustomEvent('dth:apply'));
      const cur = window.DTH_LANG.current(); window.DTH_LANG.set(cur);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectShell);
  } else {
    injectShell();
  }
})();
