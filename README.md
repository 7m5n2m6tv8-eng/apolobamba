# Andes Wild Trek · Apolobamba

Web estàtica del projecte TD2, edició 1.4 (16.11.2026). L’entrada és `index.html`.
No necessita instal·lar dependències ni executar cap compilació.

Web publicada (és l’adreça del QR del flyer): https://7m5n2m6tv8-eng.github.io/apolobamba/

## Què hi ha a cada fitxer

| Fitxer | Contingut |
| --- | --- |
| `index.html` | Capçalera, metadades i primera pintada en català |
| `content.js` | Tots els textos (català i castellà) i les dades de les sis jornades |
| `site.js` | Construcció de la pàgina, pestanyes de les jornades, llista de material i diàlegs |
| `modules.js` · `modules.json` | Apartat «Treball acadèmic»: sis blocs amb cercador |
| `site.css` | Estils |
| `assets/` | Fotografies, mapes de les etapes (WebP) i crèdits |
| `dossiers/` | PDF del treball, atles A3, formularis i Word editable |

## Com actualitzar-la

- **Textos de la web:** edita `content.js`. Cada clau existeix en `ca` i `es`.
- **Treball escrit:** edita `dossiers/Apolobamba_TD2_Treball_Complet.docx`, exporta’l a PDF amb el mateix nom i substitueix els fitxers de `dossiers/` sense canviar-ne els noms.
- **Publicació:** GitHub Pages serveix la branca `main` des de l’arrel. Quan una pull request s’integra a `main`, la web s’actualitza a la mateixa adreça.

## Crèdits

Fotografies de Wikimedia Commons (CC BY-SA 4.0), detallades a `assets/PHOTOGRAPHY.md`.
Mapes: dades © OpenStreetMap i SRTM, estil © OpenTopoMap (CC-BY-SA).
