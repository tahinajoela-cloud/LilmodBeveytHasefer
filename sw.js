/* Lilmod PWA — Service Worker. Ampitomboy VERSION isaky ny fanovana. */
const VERSION = 'lilmod-v3';
const CORE = [
  './', './index.html', './tefy.html', './offline.html',
  './style.css', './script.js', './search.js', './local-fonts.js', './register-sw.js',
  './manifest.json', './Logo.png', './Logo-white.png', './Splash.png',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-192-maskable.png', './icons/icon-512-maskable.png'
];

/* Fonts ao anaty HebrewFonts/ sy LatinaFonts/ dia cache-na rehefa ampiasaina
   voalohany, mba tsy hampavesatra ny fametrahana voalohany. */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll(CORE.map(path => new URL(path, self.registration.scope).href)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Avela amin'ny navigateur ny Google Fonts.

  event.respondWith((async () => {
    const cache = await caches.open(VERSION);

    if (request.mode === 'navigate') {
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      } catch (_) {
        const exactPage = await cache.match(request);
        if (exactPage) return exactPage;

        const appPage = await cache.match(new URL('./index.html', self.registration.scope).href);
        if (appPage) return appPage;

        const offlinePage = await cache.match(new URL('./offline.html', self.registration.scope).href);
        if (offlinePage) return offlinePage;

        return Response.error();
      }
    }

    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch (_) {
      return Response.error();
    }
  })());
});
