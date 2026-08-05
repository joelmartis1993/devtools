/* Lightweight client i18n — translates [data-i18n], [data-i18n-attr]. Persists in localStorage. */
(function(){
  const KEY='dth-lang';
  const SUPPORTED=['en','es','de','fr','ja'];
  function detect(){
    try{
      const u=new URL(location.href).searchParams.get('lang');
      if(u && SUPPORTED.includes(u)){ localStorage.setItem(KEY,u); return u; }
      const s=localStorage.getItem(KEY);
      if(s && SUPPORTED.includes(s)) return s;
      const n=(navigator.language||'en').slice(0,2);
      return SUPPORTED.includes(n)?n:'en';
    }catch(e){return 'en';}
  }
  let current=detect();
  function get(key){
    if(!key || key.includes('undefined') || key.includes('null')){
      console.warn('[i18n] Invalid translation key:', key);
      return '';
    }
    const dict = (window.DTH_I18N && window.DTH_I18N[current]) || {};
    return dict[key] || (window.DTH_I18N && window.DTH_I18N.en && window.DTH_I18N.en[key]) || key;
  }
  function bindLangSwitch(){
    const sel=document.getElementById('lang-switch');
    if(!sel) return;
    sel.value=current;
    if(sel._dthI18nBound) return;
    sel.addEventListener('change', e=>set(e.target.value));
    sel._dthI18nBound = true;
  }
  function apply(){
    document.documentElement.lang = current;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n');
      const v=get(k);
      if(v && v !== k) el.textContent = v;
      else if(!v) { /* key was invalid, keep existing text */ }
      /* else v===k means no translation found; keep the existing fallback text */
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el=>{
      // syntax: "placeholder:keyName,title:otherKey"
      el.getAttribute('data-i18n-attr').split(',').forEach(pair=>{
        const [a,k]=pair.split(':'); if(a&&k) el.setAttribute(a.trim(), get(k.trim()));
      });
    });
    bindLangSwitch();
  }
  function set(lang){
    if(!SUPPORTED.includes(lang)) return;
    current=lang;
    try{localStorage.setItem(KEY,lang);}catch(e){}
    apply();
    document.dispatchEvent(new CustomEvent('dth:lang', {detail:{lang}}));
  }
  // expose
  window.DTH_LANG = { get, set, current:()=>current, supported:SUPPORTED };
  document.addEventListener('DOMContentLoaded', ()=>{
    apply();
  });
  document.addEventListener('dth:apply', ()=>{
    apply();
  });
})();
