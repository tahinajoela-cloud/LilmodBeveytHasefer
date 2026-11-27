# Lilmod — PWA offline sy fanavaozana

## Fomba fiasan'ny offline
Ny app dia natao hiasa offline amin'ny navigateur na amin'ny APK wrapper izay mampiditra ilay tranonkala HTTPS. Rehefa misokatra voalohany **misy connexion** ilay app, ny Service Worker dia mitahiry mialoha ny pejy sy rakitra fototra rehetra, anisan'izany ny pejin'ny lesona sy ny fonts rehetra. Rehefa vita ilay fametrahana/cache dia afaka sokafana tsy misy connexion.

- Sokafy amin'ny connexion ilay app ary avelao ho vita ny chargement voalohany, anisan'izany ny fonts.
- Aza akatona na vonoina ny connexion mandra-pahavitan'ny download/cache voalohany.
- Ny lesona rehetra dia ao anatin'ny `script.js`, ka tsy mila API na fangatahana internet isaky ny lesona.
- Ny safidy sy fandrosoana dia tehirizina eo an-toerana amin'ny navigateur; ny fonts nampidirin'ny mpampiasa dia tehirizina ao amin'ny IndexedDB.
- Ny Google Fonts ivelany dia mety tsy ho hita offline; mampiasa fonts eo an-toerana/system fallback kosa ny app.

## Fanavaozana
Ny Service Worker dia manamarina ny `sw.js` rehefa manomboka ny app sy rehefa averina eo aloha. Isaky ny misy fanovana lehibe amin'ny rakitra web/cache, ampitomboy ny `VERSION` ao amin'ny `sw.js` (ohatra `lilmod-v4` ho `lilmod-v5`). Rehefa mahazo connexion indray ilay app, dia misintona sy mametraka ny cache vaovao izy, avy eo manolo ny cache taloha. Ny fanavaozana dia miseho rehefa averina sokafana na averina eo aloha ilay app; mety mila averina sokafana indray mandeha raha vao avy namoaka fanovana.

## Fepetra amin'ny Website-to-App / APK Builder
- Ataovy URL HTTPS marina an'ny GitHub Pages no sokafan'ilay APK (fa tsy preview na URL miovaova).
- Avelao hiasa ny service workers, JavaScript, cookies/storage ary ny Cache API ao amin'ny WebView.
- Sokafy indray mandeha amin'ny Internet ilay APK aorian'ny fametrahana ary andraso ho vita ny cache, vao andramana ny airplane mode.
- Raha tsy miasa ny offline ao amin'ny APK nefa mandeha amin'ny Chrome, dia jereo raha manakana service worker na mamafa cache/storage ilay builder/WebView. Ny rakitra web irery dia tsy afaka manery APK hanohana ireo API nosakanan'ny wrapper.

## Fichier PWA
- `manifest.json` — anaran'ny app, icon ary start URL.
- `sw.js` — precache, fallback offline, cache-on-first-use, ary fanavaozana/versioning.
- `local-fonts.js` — fisoratana anarana sy fanamarinana fanavaozana SW; fitantanana fonts eo an-toerana.
- `offline.html` — pejy fallback rehefa tsy mbola misy pejy app voacache.
- `index.html`, `tefy.html`, `style.css`, `script.js`, `search.js` — app sy lesona.
- `HebrewFonts/`, `LatinaFonts/`, `icons/` — fonts sy kisary voatahiry mialoha.
