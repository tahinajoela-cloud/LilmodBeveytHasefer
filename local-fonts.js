/* Lilmod LOCAL — Fonts defaults. */
(function(){
  // Ilaina amin'ny index.html sy tefy.html ny local-fonts.js; ampiasaina koa
  // izy io mba hisoratra anarana foana ny Service Worker amin'ireo pejy roa.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .catch(function(err){ console.warn('SW tsy voasoratra:', err); });
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
