# Andes Wild Trek · Apolobamba

Web estàtica del projecte TD2. Té dues pàgines: `index.html`, la web del viatge per al client, i `treball.html`, el treball acadèmic per presentar-lo.
No necessita instal·lar dependències ni executar cap compilació.

Web publicada (és l’adreça del QR del flyer): https://7m5n2m6tv8-eng.github.io/apolobamba/

## Què hi ha a cada fitxer

| Fitxer | Contingut |
| --- | --- |
| `index.html` | Web del client: viatge, etapes, programa, preu, condicions i documents per al client |
| `treball.html` | Pàgina «Treball TD2»: treball complet, blocs amb cercador, eines del guia, fonts i mode exposició |
| `content.js` | Tots els textos (català i castellà) i les dades de les sis jornades |
| `site.js` | Construcció de la pàgina, pestanyes de les jornades, llista de material i diàlegs |
| `presentacio.html` | Presentació del treball en 12 diapositives amb guió (tecla N) |
| `extras.js` | Guia, perfil interactiu, territori, test i contacte. El número de WhatsApp es posa a la primera línia de configuració |
| `sw.js` | Permet obrir la web sense connexió un cop visitada |
| `modules.js` · `modules.json` | Blocs del treball amb cercador (només a `treball.html`) |
| `site.css` | Estils |
| `assets/` | Fotografies, mapes de les etapes (WebP) i crèdits |
| `dossiers/` | Treball complet (PDF i Word), sis blocs, atles A3 i formularis |
| `dossiers/client/` | Documents per al client en català i castellà: fitxa del viatge i preparació i material |

## Com actualitzar-la

- **Textos de la web:** edita `content.js`. Cada clau existeix en `ca` i `es`.
- **Treball escrit:** edita `dossiers/Apolobamba_TD2_Treball_Complet.docx`, exporta’l a PDF amb el mateix nom i substitueix els fitxers de `dossiers/` sense canviar-ne els noms.
- **Versió:** després de qualsevol canvi, executa `python3 tools/stamp.py` abans de fer commit. Actualitza `version.txt` i els enllaços, i així els navegadors carreguen la versió nova en obrir la web, sense esperar la memòria cau.
- **Publicació:** GitHub Pages serveix la branca `main` des de l’arrel. Quan una pull request s’integra a `main`, la web s’actualitza a la mateixa adreça.

## Crèdits

Fotografies de Wikimedia Commons (CC BY-SA 4.0), detallades a `assets/PHOTOGRAPHY.md`.
Mapes: dades © OpenStreetMap i SRTM, estil © OpenTopoMap (CC-BY-SA).
