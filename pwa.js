/* Lilmod A1 — PWA: offline + mise à jour. Miasa amin'ny index.html sy tefy.html. */
(function () {
  var banner = document.getElementById('updateBanner');
  var btnUpdate = document.getElementById('updateBtn');
  var btnLater = document.getElementById('updateLaterBtn');
  var statusEl = document.getElementById('updateStatus');
  var waitingWorker = null;
  function show(msg) { if (statusEl) statusEl.textContent = msg; if (banner) banner.hidden = false; }
  function applyUpdate() {
    if (waitingWorker) waitingWorker.postMessage('SKIP_WAITING');
    else if ('caches' in window) caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); }).then(function () { location.reload(); });
  }
  if (btnUpdate) btnUpdate.addEventListener('click', applyUpdate);
  if (btnLater) btnLater.addEventListener('click', function () { if (banner) banner.hidden = true; });
  if (!('serviceWorker' in navigator)) { if (statusEl) statusEl.textContent = 'Tsy tohanan\'ny navigateur ny offline.'; return; }
  // Tsy miasa amin'ny file:// ny service worker — mila HTTPS (GitHub Pages) na localhost.
  if (location.protocol === 'file:') { if (statusEl) statusEl.textContent = 'Sokafy amin\'ny GitHub Pages (HTTPS) raha hampiasa offline.'; return; }
  navigator.serviceWorker.register('./sw.js').then(function (reg) {
    function track(w) { if (!w) return; w.addEventListener('statechange', function () { if (w.state === 'installed' && navigator.serviceWorker.controller) { waitingWorker = w; show('Misy version vaovao ✓ — tsindrio Havaozy.'); } }); }
    track(reg.waiting);
    reg.addEventListener('updatefound', function () { track(reg.installing); });
    // Fanamarinana mise à jour: isaky ny sokafana + isaky ny tsindriana ny bokotra
    var checkBtn = document.getElementById('checkUpdateBtn');
    if (checkBtn) checkBtn.addEventListener('click', function () {
      if (statusEl) statusEl.textContent = 'Mijery mise à jour…';
      reg.update().then(function () {
        return fetch('./version.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).catch(function () { return null; });
      }).then(function (v) {
        if (v && v.version) { if (statusEl) statusEl.textContent = 'Version ao amin\'ny serveur: ' + v.version + '. Raha efa napetraka io dia efa à jour ianao.'; }
      });
    });
    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () { if (!refreshing) { refreshing = true; location.reload(); } });
  }).catch(function () { if (statusEl) statusEl.textContent = 'Tsy voasoratra ny offline. Jereo ny fifandraisana.'; });
})();
