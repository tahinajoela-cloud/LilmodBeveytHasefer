/* Lilmod PWA — Service Worker. Ampitomboy VERSION isaky ny fanovana. */
const VERSION = 'lilmod-v4';
const CORE = [
  './', './index.html', './tefy.html', './offline.html',
  './style.css', './script.js', './search.js', './local-fonts.js', './register-sw.js',
  './manifest.json', './Logo.png', './Logo-white.png', './Splash.png',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-192-maskable.png', './icons/icon-512-maskable.png'
];
/* Apetraka mialoha koa ny fonts rehetra ampiasain'ny app, mba tsy hiankina
   amin'ny fitsidihana pejy na lesona manokana vao ho voatahiry offline. */
const FONTS = [
  './HebrewFonts/David.ttf',
  './HebrewFonts/Ezra SIL.ttf',
  './HebrewFonts/Lashon Megilah.ttf',
  './HebrewFonts/Lashon Pictography.ttf',
  './HebrewFonts/Lashon Qodesh.ttf',
  './HebrewFonts/Playpen Variable.ttf',
  './LatinaFonts/Cambria.ttf',
  './LatinaFonts/David.ttf',
  './LatinaFonts/Georgia.ttf',
  './LatinaFonts/Perpetua.ttf',
  './LatinaFonts/RobotoCondensed-Light.ttf'
];
const toUrl = path => new URL(path, self.registration.scope).href;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    // Ireo rakitra fototra no tsy maintsy tafiditra vao ekena ilay SW vaovao.
    await cache.addAll(CORE.map(toUrl));
    // Andramo alaina mialoha ny fonts rehetra. Raha misy rakitra iray tsy
    // tratra vetivety, aza sakanana ny fametrahana ny app; averina alaina
    // amin'ny fetch rehefa misy connexion.
    await Promise.all(FONTS.map(async path => {
      try { await cache.add(toUrl(path)); }
      catch (error) { console.warn('Tsy voacache ny font:', path, error); }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key.startsWith('lilmod-') && key !== VERSION)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Remote fonts use browser fallback offline.

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
        const appPage = await cache.match(toUrl('./index.html'));
        if (appPage) return appPage;
        const offlinePage = await cache.match(toUrl('./offline.html'));
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
