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
    const dict = (window.DTH_I18N && window.DTH_I18N[current]) || {};
    return dict[key] || (window.DTH_I18N && window.DTH_I18N.en && window.DTH_I18N.en[key]) || key;
  }
  function apply(){
    document.documentElement.lang = current;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); el.textContent = get(k);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el=>{
      // syntax: "placeholder:keyName,title:otherKey"
      el.getAttribute('data-i18n-attr').split(',').forEach(pair=>{
        const [a,k]=pair.split(':'); if(a&&k) el.setAttribute(a.trim(), get(k.trim()));
      });
    });
    const sel=document.getElementById('lang-switch'); if(sel) sel.value=current;
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
    const sel=document.getElementById('lang-switch');
    if(sel){ sel.value=current; sel.addEventListener('change', e=>set(e.target.value)); }
  });
})();
