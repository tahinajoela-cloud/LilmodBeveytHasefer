/* Lilmod PWA — Service Worker. Ampitomboy VERSION isaky ny fanovana. */
const VERSION = 'lilmod-v1';
const CORE = [
  './', './index.html', './tefy.html', './offline.html',
  './style.css', './script.js', './local-fonts.js',
  './manifest.json', './Logo.png', './Logo-white.png', './Splash.png',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-192-maskable.png', './icons/icon-512-maskable.png'
];
/* Fonts ao anaty HebrewFonts/ sy LatinaFonts/ : alaina amin'ny voalohany, avy eo cache.
   Tsy atao precache daholo izy ireo (mavesatra) — fa cache-on-first-use. */
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // Google Fonts sns: avela ho an'ny navigateur
  // Navigation: network-first, fallback cache, farany offline.html
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => {
      const copy = r.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return r;
    }).catch(() => caches.match('./index.html').then(m => m || caches.match('./offline.html'))));
    return;
  }
  // Fonts / CSS / JS / sary: cache-first, avy eo network + cache update
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(r => {
      if (r.ok && (url.pathname.includes('/HebrewFonts/') || url.pathname.includes('/LatinaFonts/') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname.endsWith('.png'))) {
        const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy));
      }
      return r;
    }).catch(() => hit);
    return hit || net;
  }));
});
