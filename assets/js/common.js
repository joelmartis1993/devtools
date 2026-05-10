/* DevToolsHive — common utilities (no deps, ES2018) */
(function(g){
  const $ = (s, r=document)=>r.querySelector(s);
  const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

  function ensureToastHost(){
    let h = document.querySelector('.toast-host');
    if(!h){ h=document.createElement('div'); h.className='toast-host'; document.body.appendChild(h); }
    return h;
  }
  function toast(msg, kind){
    const h = ensureToastHost();
    const t = document.createElement('div');
    t.className = 'toast ' + (kind||'');
    t.textContent = msg;
    h.appendChild(t);
    setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(8px)'; t.style.transition='all .2s'; }, 2200);
    setTimeout(()=>t.remove(), 2500);
  }
  async function copyText(text, label){
    try{
      await navigator.clipboard.writeText(text);
      toast((label||'Copied')+' to clipboard','ok');
    }catch(e){
      const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select();
      try{ document.execCommand('copy'); toast('Copied','ok'); }catch(_){ toast('Copy failed','err'); }
      ta.remove();
    }
  }
  function downloadText(filename, text, mime){
    const blob = new Blob([text], {type: mime||'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click();
    setTimeout(()=>{URL.revokeObjectURL(url); a.remove();}, 0);
  }
  function readFileAsText(file){
    return new Promise((res,rej)=>{
      const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=()=>rej(r.error); r.readAsText(file);
    });
  }
  function debounce(fn, wait){
    let t; return function(){ clearTimeout(t); const a=arguments, c=this; t=setTimeout(()=>fn.apply(c,a), wait); };
  }
  // Global keyboard shortcuts
  document.addEventListener('keydown', (e)=>{
    const mod = e.ctrlKey || e.metaKey;
    if(!mod) return;
    if(e.key==='Enter'){
      const b=document.querySelector('[data-shortcut="run"]'); if(b){ e.preventDefault(); b.click(); }
    } else if(e.shiftKey && (e.key==='C'||e.key==='c')){
      const b=document.querySelector('[data-shortcut="copy"]'); if(b){ e.preventDefault(); b.click(); }
    } else if(e.key==='l' || e.key==='L'){
      const b=document.querySelector('[data-shortcut="clear"]');
      if(b && document.activeElement && document.activeElement.tagName!=='INPUT'){ e.preventDefault(); b.click(); }
    }
  });

  g.DTH = { $, $$, toast, copyText, downloadText, readFileAsText, debounce };
})(window);
