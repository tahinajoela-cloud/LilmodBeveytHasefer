/* Lilmod LOCAL — Fonts defaults. */
(function(){
  // Registration is idempotent and checks for a deployed SW update whenever
  // the app starts or returns to the foreground.
  if ('serviceWorker' in navigator) {
    var swRegistration;
    navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' })
      .then(function(registration){
        swRegistration=registration;
        return registration.update().catch(function(){});
      })
      .catch(function(err){ console.warn('SW tsy voasoratra:', err); });
    document.addEventListener('visibilitychange',function(){
      if(document.visibilityState==='visible' && swRegistration) swRegistration.update().catch(function(){});
    });
  }

  // Tehirizina misaraka ny lokon'ny soratra hebreo sy ny lohateny hebreo.
  var SETTINGS_KEY='lilmod_settings';
  var HEBREW_COLOR_KEY='lilmod_hebrew_text_color';
  function readSettings(){
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'null')||{}; }
    catch (_) { return {}; }
  }
  function readHebrewColor(settings){
    var saved='';
    try { saved=localStorage.getItem(HEBREW_COLOR_KEY)||''; } catch (_) {}
    var color=saved||(settings.he&&settings.he.color)||'#b45309';
    try { localStorage.setItem(HEBREW_COLOR_KEY,color); } catch (_) {}
    return color;
  }
  var initialSettings=readSettings();
  var independentHebrewColor=readHebrewColor(initialSettings);
  function applyTitleAndTextColors(){
    var settings=readSettings();
    var titleColor=settings.accent||'#b45309';
    document.documentElement.style.setProperty('--accent',titleColor);
    document.documentElement.style.setProperty('--he-color',independentHebrewColor);
  }
  function keepHebrewColorIndependent(){
    var settings=readSettings();
    settings.he=settings.he||{};
    settings.he.color=independentHebrewColor;
    try { localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings)); } catch (_) {}
  }
  // Reconcile legacy saved settings and ensure the main lesson page starts with
  // independent colors even if an older settings screen had copied accent to he.color.
  if(initialSettings.he){
    initialSettings.he.color=independentHebrewColor;
    try { localStorage.setItem(SETTINGS_KEY,JSON.stringify(initialSettings)); } catch (_) {}
  }
  applyTitleAndTextColors();

  var colorStyle=document.createElement('style');
  colorStyle.textContent='.lesson-head .he-title,.result-card .rc-he-title{color:var(--accent)!important}';
  document.head.appendChild(colorStyle);

  // The settings page's legacy accent handler also writes to S.he.color.
  // Preserve the independently saved Hebrew body color after that handler runs.
  function handleColorChange(event){
    var target=event.target;
    if(!target || !target.id) return;
    if(target.id==='color-he'){
      independentHebrewColor=target.value;
      try { localStorage.setItem(HEBREW_COLOR_KEY,independentHebrewColor); } catch (_) {}
      document.documentElement.style.setProperty('--he-color',independentHebrewColor);
    } else if(target.id==='accentColor'){
      applyTitleAndTextColors();
    }
  }
  document.addEventListener('input',handleColorChange);
  document.addEventListener('change',handleColorChange);
  document.addEventListener('click',function(event){
    if(event.target && (event.target.id==='saveBtn' || event.target.closest('#saveBtn'))){
      // Let the settings page's own click handler save first, then restore he.color.
      setTimeout(keepHebrewColorIndependent,0);
    }
  });

  // Search result cards use the same class for Hebrew content and lesson titles;
  // mark title-only cards so they use the separate title color.
  function markHebrewTitleCards(root){
    var cards=[];
    if(root && root.nodeType===1 && root.matches('.result-card')) cards.push(root);
    if(root && root.querySelectorAll) cards=cards.concat(Array.prototype.slice.call(root.querySelectorAll('.result-card')));
    cards.forEach(function(card){
      var meta=card.querySelector('.rc-meta');
      var hebrew=card.querySelector('.rc-he');
      if(meta && hebrew && meta.textContent.indexOf('Lohatenin')>=0) hebrew.classList.add('rc-he-title');
    });
  }
  if(document.body){
    markHebrewTitleCards(document.body);
    new MutationObserver(function(records){
      records.forEach(function(record){
        record.addedNodes.forEach(function(node){ if(node.nodeType===1) markHebrewTitleCards(node); });
      });
    }).observe(document.body,{childList:true,subtree:true});
  }

  var DEFAULT_FONTS=[
    {file:'HebrewFonts/Ezra SIL.ttf', name:'Ezra SIL', kind:'he'},
    {file:'HebrewFonts/Playpen Variable.ttf', name:'Playpen Variable', kind:'he'},
    {file:'HebrewFonts/David.ttf', name:'David', kind:'he'},
    {file:'HebrewFonts/Lashon Qodesh.ttf', name:'Lashon Qodesh', kind:'he'},
    {file:'HebrewFonts/Lashon Megilah.ttf', name:'Lashon Megilah', kind:'he'},
    {file:'HebrewFonts/Lashon Pictography.ttf', name:'Lashon Pictography', kind:'he'},
    {file:'LatinaFonts/RobotoCondensed-Light.ttf', name:'Roboto Condensed Light', kind:'latina'},
    {file:'LatinaFonts/Perpetua.ttf', name:'Perpetua', kind:'latina'},
    {file:'LatinaFonts/Georgia.ttf', name:'Georgia', kind:'latina'},
    {file:'LatinaFonts/Cambria.ttf', name:'Cambria', kind:'latina'}
  ];
  function kindToKinds(kind){
    if(kind==='he') return ['he'];
    if(kind==='pron') return ['pron'];
    if(kind==='fr') return ['fr'];
    if(kind==='mg') return ['mg'];
    return ['pron','fr','mg'];
  }
  function cleanName(f){ return f.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim()||'LilmodFont'; }
  var DB='lilmod-fonts-db', STORE='fonts';
  function openDB(){ return new Promise(function(res,rej){
    var r=indexedDB.open(DB,1);
    r.onupgradeneeded=function(){ try{ r.result.createObjectStore(STORE,{keyPath:'name'}); }catch(e){} };
    r.onsuccess=function(){ res(r.result); }; r.onerror=function(){ rej(r.error); };
  });}
  function getAll(){ return openDB().then(function(db){ return new Promise(function(res,rej){
    var tx=db.transaction(STORE,'readonly'), q=tx.objectStore(STORE).getAll();
    q.onsuccess=function(){ res(q.result||[]); }; q.onerror=function(){ rej(q.error); };
  });});}
  function putAll(list){ return openDB().then(function(db){ return new Promise(function(res,rej){
    var tx=db.transaction(STORE,'readwrite'), st=tx.objectStore(STORE);
    list.forEach(function(f){ st.put(f); });
    tx.oncomplete=function(){ res(); }; tx.onerror=function(){ rej(tx.error); };
  });});}
  function register(name, src){
    try{
      var ff=new FontFace(name, src);
      return ff.load().then(function(l){ document.fonts.add(l); return true; }).catch(function(){ return false; });
    }catch(e){ return Promise.resolve(false); }
  }
  function refreshBundled(){
    var bundled=[]; var jobs=[];
    DEFAULT_FONTS.forEach(function(f){
      bundled.push({name:f.name, file:f.file, kinds:kindToKinds(f.kind), isDefault:true});
      jobs.push(register(f.name, 'url(' + encodeURI(f.file) + ')'));
    });
    return getAll().then(function(all){
      var extraJobs=all.map(function(f){
        if(!bundled.find(function(b){ return b.name===f.name; })) bundled.push({name:f.name, file:'', kinds:kindToKinds(f.kind), isDefault:false});
        return register(f.name, f.blob);
      });
      return Promise.all(jobs.concat(extraJobs)).then(function(){
        window.__BUNDLED_FONTS=bundled;
        window.dispatchEvent(new Event('lilmod-fonts-ready'));
        return bundled;
      });
    }).catch(function(){
      window.__BUNDLED_FONTS=bundled;
      window.dispatchEvent(new Event('lilmod-fonts-ready'));
      return bundled;
    });
  }
  window.lilmodSaveFonts=function(fileList, kind){
    var files=Array.prototype.slice.call(fileList||[]);
    var ok=files.filter(function(f){ return /\.(ttf|otf|woff2?)$/i.test(f.name); });
    if(!ok.length) return Promise.resolve({saved:0, total:files.length});
    var list=ok.map(function(f){ return {name:cleanName(f.name), kind:kind, blob:f}; });
    return putAll(list).then(refreshBundled).then(function(){ return {saved:list.length, total:files.length}; });
  };
  window.lilmodRefreshFonts=refreshBundled;
  function splashHide(){ var sp=document.getElementById('splash'); if(!sp) return; sp.classList.add('done'); setTimeout(function(){ if(sp.parentNode) sp.parentNode.removeChild(sp); },600); }
  window.addEventListener('load', function(){ setTimeout(splashHide,350); }); setTimeout(splashHide,4000);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', refreshBundled);
  else refreshBundled();
})();
