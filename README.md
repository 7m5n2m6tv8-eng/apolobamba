# Andes Wild Trek · Apolobamba

Web estàtica del projecte TD2. Té dues pàgines: `index.html`, la web del viatge per al client, i `treball.html`, el treball acadèmic per presentar-lo.
No necessita instal·lar dependències ni executar cap compilació.

Web publicada (és l’adreça del QR del flyer): https://7m5n2m6tv8-eng.github.io/apolobamba/

## Què hi ha a cada fitxer

| Fitxer | Contingut |
| --- | --- |
| `index.html` | Web del client: viatge, etapes, programa, preu, condicions i documents per al client |
| `treball.html` | Pàgina «Treball TD2»: treball complet, blocs amb cercador, eines del guia, fonts i mode exposició |
| `content.js` | Tots els textos (català, castellà, anglès i francès) i les dades de les sis jornades |
| `guia/` | App mòbil del guia (funciona sense cobertura): fitxes tècniques, hores de control, meteo, seguretat, llistes, GPX. Track GPS a `guia/track.js` (199 punts, Gallotrekk, Wikiloc, 2012). Adreça: `…/apolobamba/guia/` |
| `site.js` | Construcció de la pàgina, pestanyes de les jornades, llista de material i diàlegs |
| `presentacio.html` | Presentació del treball en 14 diapositives amb guió (tecla N) |
| `extras.js` | Guia, comparador d’altitud, territori, test i contacte per WhatsApp (número a `CONTACT`) |
| `sw.js` | Permet obrir la web sense connexió un cop visitada |
| `modules.js` · `modules.json` | Blocs del treball amb cercador (només a `treball.html`) |
| `site.css` | Estils |
| `CLAUDE.md` | Context del projecte per a Claude Code (decisions, manera de treballar i pendents) |
| `assets/` | Fotografies, mapes de les etapes (WebP) i crèdits |
| `dossiers/` | Treball complet (PDF i Word), sis blocs, atles A3, formularis i enquesta del client (4 idiomes) |
| `dossiers/gpx/` | GPX de la ruta principal, de cada pla B (dies 5–10) i del pla C (OpenStreetMap) |
| `dossiers/client/` | Documents per al client en català, castellà, anglès i francès: fitxa, preparació i material, pla d’entrenament, llibreta de ruta i el **dossier complet** (`Dossier_Viatge_CA.pdf`, `Dossier_Viaje_ES.pdf`, `Travel_Dossier_EN.pdf`, `Dossier_Voyage_FR.pdf`), que no s’enllaça a la web: s’envia per WhatsApp quan el client contacta |

## Com actualitzar-la

- **Textos de la web:** edita `content.js`. Cada clau existeix en `ca`, `es`, `en` i `fr`. L’anglès i el francès s’escriuen a `tools/i18n_web.py` i `tools/i18n_plans.py` i s’apliquen amb `python3 tools/i18n_apply.py`.
- **Treball escrit:** edita `dossiers/Apolobamba_TD2_Treball_Complet.docx`, exporta’l a PDF amb el mateix nom i substitueix els fitxers de `dossiers/` sense canviar-ne els noms. Després, `python3 tools/blocs.py` regenera els blocs 01–06, els formularis i el cercador.
- **Temporada, plans B i pla C:** les dades són a `tools/plans_data.py`; executa `python3 tools/plans_data.py` per actualitzar `window.PLANS` a `content.js`.
- **Atles i mapes:** `python3 tools/atles.py` regenera l’Atles A3 (11 làmines: mapa general, sis jornades i quatre etapes del pla C) i els mapes del dossier.
- **Dossier complet:** després de canviar dades de les jornades, executa `node tools/dossier.js` per regenerar els quatre PDF, i `node tools/client_docs.js` per a la fitxa, la preparació, el pla d’entrenament, la llibreta i l’enquesta.
- **GPX:** `python3 tools/gpx.py` regenera els GPX de `dossiers/gpx/`.
- **Versió estàtica d’index.html:** després de canviar textos o seccions, executa `node tools/prerender.js`.
- **Versió:** després de qualsevol canvi, executa `python3 tools/stamp.py` abans de fer commit. Actualitza `version.txt` i els enllaços, i així els navegadors carreguen la versió nova en obrir la web, sense esperar la memòria cau.
- **Publicació:** GitHub Pages serveix la branca `main` des de l’arrel. Quan una pull request s’integra a `main`, la web s’actualitza a la mateixa adreça.

## Crèdits

Fotografies de Wikimedia Commons (CC BY-SA 4.0), detallades a `assets/PHOTOGRAPHY.md`.
Mapes: dades © OpenStreetMap i SRTM, estil © OpenTopoMap (CC-BY-SA).
