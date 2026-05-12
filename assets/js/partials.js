/* Shared header & footer injection. Uses root-relative paths only. */
(function(){
  const TOOLS = [
    {slug:'json-formatter',  k:'tool.json-formatter'},
    {slug:'json-diff',       k:'tool.json-diff', isNew:true},
    {slug:'jwt-decoder',     k:'tool.jwt', isNew:true},
    {slug:'cron-generator',  k:'tool.cron', isNew:true},
    {slug:'env-parser',      k:'tool.env', isNew:true},
    {slug:'api-builder',     k:'tool.api', isNew:true},
    {slug:'base64',          k:'tool.base64'},
    {slug:'url-encoder',     k:'tool.url'},
    {slug:'timestamp',       k:'tool.timestamp'},
    {slug:'uuid',            k:'tool.uuid'},
    {slug:'regex',           k:'tool.regex'},
    {slug:'case-converter',  k:'tool.case'},
    {slug:'user-agent',      k:'tool.user-agent'},
  ];
  window.DTH_TOOLS = TOOLS;

  function header(){
    const langOpts = [['en','English'],['es','Español'],['de','Deutsch'],['fr','Français'],['ja','日本語']]
      .map(([v,l])=>`<option value="${v}">${l}</option>`).join('');
    return `<header class="site-header"><div class="container row">
      <a class="brand" href="/"><span class="brand-mark">DT</span><span>DevToolsHive</span></a>
      <nav class="nav-primary" aria-label="Primary">
        <a href="/" data-i18n="nav.home">Home</a>
        <a href="/#tools" data-i18n="nav.tools">Tools</a>
        <select id="lang-switch" class="lang-select" aria-label="Language">${langOpts}</select>
        <button id="theme-toggle" class="icon-btn" aria-label="Toggle theme">☀</button>
        <a class="icon-btn" href="https://github.com/" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub" style="text-decoration:none">★</a>
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
        <div><h4 data-i18n="footer.tools">Tools</h4><ul>${cols}</ul></div>
        <div><h4 data-i18n="footer.popular">Popular</h4><ul>${cols2}</ul></div>
        <div><h4 data-i18n="footer.legal">Legal</h4><ul>
          <li><a href="/" data-i18n="nav.home">Home</a></li>
          <li><a href="https://github.com/" target="_blank" rel="noopener" data-i18n="footer.github">GitHub</a></li>
        </ul></div>
      </div>
      <div class="meta">
        <span data-i18n="footer.copy">© 2026 DevToolsHive.</span>
        <span class="muted">v2.0</span>
      </div>
    </div></footer>`;
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const h=document.getElementById('site-header'); if(h) h.outerHTML = header();
    const f=document.getElementById('site-footer'); if(f) f.outerHTML = footer();
    if(window.DTH_LANG){ /* re-apply after injection */
      document.dispatchEvent(new CustomEvent('dth:apply'));
      // trigger by re-running by calling set with current
      const cur = window.DTH_LANG.current(); window.DTH_LANG.set(cur);
    }
  });
})();
