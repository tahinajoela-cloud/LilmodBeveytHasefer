# Lilmod — Version PWA ho an'ny GitHub Pages

## Inona no ao anaty ity dossier ity (fanampiny fotsiny)
- `manifest.json` — VAOVAO (manolo ny taloha): icons 192/512 + maskable, `start_url: ./index.html`, `scope: ./`
- `sw.js` — Service Worker: cache ny app + fonts (HebrewFonts/, LatinaFonts/) rehefa voasokatra voalohany
- `register-sw.js` — fisoratana anarana ny SW
- `offline.html` — pejy aseho rehefa tsy misy connexion
- `icons/icon-*.png` — icons avy amin'ny logo BS (manga = any, fotsy eo ambony maitso = maskable)
- `Logo.png` / `Logo-white.png` / `Splash.png` — avy amin'ny logo BS nalefa (Logo-white: BS fotsy, mangarahara)
- `.nojekyll` — TSY MAINTSY ao amin'ny root, raha tsy izany dia tsy mandeha ny dossiers manomboka amin'ny `_` sy ny rakitra sasany ao amin'ny GitHub Pages

## Fichier efa misy anao, TSY OVANA
`index.html`, `tefy.html`, `style.css`, `script.js`, `local-fonts.js`, `HebrewFonts/`, `LatinaFonts/`, `logos/`
Ny defaults fonts sy ny anaran'ny dossiers dia efa ao anaty `local-fonts.js` (`HebrewFonts/...`, `LatinaFonts/...`) — tsy kitihina.
Ny anaran'ny logo (`Logo.png`, `Splash.png`) dia efa ao anaty `index.html` / `tefy.html` — tsy kitihina.

## Dingana 1 — Apetraho ao amin'ny dossier efa misy anao
Adikao daholo ny ao anatin'ity dossier `pwa-github` ity, **atao overwrite** ny `manifest.json`, `Logo.png`, `Logo-white.png`, `Splash.png` taloha.

## Dingana 2 — Ampio andalana 1 isaky ny pejy (ilay hany fanovana amin'ny HTML)
Ao amin'ny `index.html` SY `tefy.html`, eo alohan'ny `</body>`:
```html
<script src="register-sw.js"></script>
```
Ohatra ao amin'ny `index.html`:
```html
<script src="local-fonts.js"></script>
<script src="script.js"></script>
<script src="register-sw.js"></script>
</body></html>
```
Ao amin'ny `tefy.html` dia apetraho aorian'ny `<script>` farany, alohan'ny `</body>` ihany koa.

## Dingana 3 — Alefaso any amin'ny GitHub
- Repo: ohatra `tahinajoela-cloud / Lilmod` (na ny repo efa misy anao)
- Branch: `main`, dossier: `/ (root)` — apetraho ao amin'ny ROOT ny fichier rehetra, tsy ao anaty sous-dossier.
- Settings → Pages → Source: `Deploy from a branch` → Branch: `main` / `/ (root)` → Save.
- Andraso 1–2 min, dia sokafy: `https://tahinajoela-cloud.github.io/Lilmod/`

## Dingana 4 — Fametrahana (Install) ho PWA
- **Android / Chrome:** sokafy ny lien → menu ⋮ → **Install app / Apetraho** (na **Add to Home screen**).
- **iPhone / Safari:** Share → **Add to Home Screen**.
- **PC / Chrome / Edge:** kisary Install eo amin'ny address bar.
- Aorian'ny install voalohany, sokafy indray mandeha misy internet mba ho voa-cache ny fonts, dia mandeha **offline** avy eo.
- Fanamarihana manan-danja: ny fonts ampidinina amin'ny alalan'ny « Browse dossier » ao amin'ny Tefy dia voatahiry ao amin'ny IndexedDB — mbola ao izy ireo rehefa offline.

## Raha tsy miseho ny Install
1. HTTPS no ilaina — efa omen'ny GitHub Pages izany.
2. Ataovy azo antoka fa ao amin'ny root ny `manifest.json`, `sw.js`, `.nojekyll`.
3. Ao amin'ny Chrome: DevTools → Application → Manifest / Service Workers — jereo raha misy erreur.
4. Ovay ny `VERSION` ao amin'ny `sw.js` (`lilmod-v1` → `lilmod-v2`…) isaky ny manova fichier ianao, mba havaozin'ny navigateur ny cache.

## Firafitra farany tokony ho ao amin'ny GitHub
```
index.html  tefy.html  style.css  script.js  local-fonts.js
manifest.json  sw.js  register-sw.js  offline.html  .nojekyll
Logo.png  Logo-white.png  Splash.png
icons/icon-192.png  icons/icon-512.png  icons/icon-192-maskable.png  icons/icon-512-maskable.png
HebrewFonts/  LatinaFonts/  logos/
```
