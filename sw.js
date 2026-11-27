/* Lilmod A1 — Service Worker. Ovay ny CACHE_NAME isaky ny mise à jour. */
const CACHE_NAME = 'lilmod-a1-v1.1.0';
const CORE = ['./','./index.html','./tefy.html','./style.css','./script.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME ? caches.delete(k) : null))).then(() => self.clients.claim()));
});
self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // Google Fonts sns: avela amin'ny tambajotra, tsy cache-na
  if (url.pathname.endsWith('version.json')) { // version.json: tambajotra foana, aza cache-na
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  if (e.request.mode === 'navigate') { // pejy: tambajotra aloha, cache raha offline
    e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then((hit) => { // rakitra: cache aloha, havaozina any ambadika
    const net = fetch(e.request).then((r) => { if (r.ok) { const c = r.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(e.request, c)); } return r; }).catch(() => null);
    return hit || net;
  }));
});
