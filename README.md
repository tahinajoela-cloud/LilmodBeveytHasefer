# Lilmod Beveyt Hasefer — A1 (Version tsotra, teny Malagasy)
Sokafy ny index.html amin'ny double-clic — tafiditra ao amin'ny script.js ny angona, tsy mila serveur.
Fichiers: index.html, style.css, script.js (angona tafiditra), data.json (kopian'ny angona), AUDIT.md.
Lesona tsirairay: Fehezanteny 20 + Rakiteny 20, andalana tsirairay amin'ny tsanganana 4: fanononana | hebreo misy niqqud | frantsay | malagasy.
Asa: fikarohana amin'ny lesona 100, onglets Fehezanteny / Rakiteny / Rehetra, asehoy/afenoy ny tsanganana tsirairay, fomba famerenana (afenoy ny hebreo na ny fandikana), fandrosoana voatahiry, pirinty.
Ny menu ankavia dia lohateny Malagasy ihany. Ny interface manontolo dia teny Malagasy.
Loharano: Lilmod_Beveyt_Hasefer_A1.docx — jereo ny AUDIT.md.

Fomba finday: amin'ny écran kely dia lasa tiroir (bouton ☰ Lesona) ny menu, ary lasa karatra isaky ny andalana ny tableau (Hebreo lehibe, misy marika Fanononana / Hebreo / Frantsay / Malagasy). Bouton 📱 Fomba finday: manery ny fomba finday na dia amin'ny ordinateur aza, hizahana toetra.

## GitHub Pages — apetraka (ho an'ny mpampiasa)

1. Mamorona repo vaovao (ohatra `Lilmod-A1`), dia alefaso ao daholo ny rakitra rehetra (index.html, style.css, script.js, tefy.html, pwa.js, sw.js, manifest.webmanifest, version.json, icon-192.png, icon-512.png, data.json, README.md, AUDIT.md).
2. GitHub → Settings → Pages → Source: Deploy from a branch → Branch: `main` / `/ (root)` → Save.
3. Adiresy: `https://<anaranao>.github.io/Lilmod-A1/` — zarao io lien io amin'ny mpampiasa.

## Offline — ho an'ny mpampiasa

- Sokafy indray mandeha ilay lien amin'ny internet: voatahiry ho azy ny app (service worker).
- Avy eo, miasa tsy misy internet izy, na "Add to Home Screen" / "Install app" aza.
- Ny Tefy, ny fandrosoana (`lilmod_done`) ary ny fanehoan-tsoratra voatahiry dia ao amin'ny finday ihany, tsy very rehefa offline.
- Tandremo: amin'ny `file://` (double-clic eo an-toerana) dia TSY miasa ny offline — mila HTTPS (GitHub Pages) na `localhost`.

## Mise à jour — ho anao (mpamorona), isaky ny manova ny app

1. Ovay ny `version` ao amin'ny `version.json` (ohatra 1.1.0 → 1.2.0).
2. Ovay mitovy amin'izany ny `CACHE_NAME` ao amin'ny `sw.js` (ohatra `lilmod-a1-v1.2.0`).
3. Alefaso (push) ao amin'ny GitHub.
4. Ny mpampiasa: sokafy ny app → miseho ny banner "Misy version vaovao" → tsindrio **↻ Havaozy**. Na tsindrio **Jereo ny mise à jour** ao amin'ny pejy fandraisana.
- Tsy very ny Tefy sy ny fandrosoana rehefa mise à jour: ao amin'ny `localStorage` izy ireo, fa tsy ao amin'ny cache.
