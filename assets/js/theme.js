/* Theme: dark default, persisted, with toggle. Inline-applied on load. */
(function(){
  const KEY='dth-theme';
  function get(){ try{return localStorage.getItem(KEY)||'dark';}catch(e){return 'dark';} }
  function apply(t){ document.documentElement.dataset.theme=t; }
  apply(get());
  document.addEventListener('DOMContentLoaded', ()=>{
    setTimeout(()=>{
      const btn=document.getElementById('theme-toggle');
      if(!btn) return;
      const set=()=>{ btn.textContent = (get()==='dark')?'☀':'☾'; btn.title = (get()==='dark')?'Light mode':'Dark mode'; };
      set();
      btn.addEventListener('click', ()=>{
        const next = get()==='dark' ? 'light' : 'dark';
        try{localStorage.setItem(KEY,next);}catch(e){}
        apply(next); set();
      });
    }, 0);
  });
})();
