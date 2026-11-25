# Apolobamba · app del guia

App web per al mòbil del guia de la travessa Pelechuco – Charazani. Funciona sense cobertura un cop oberta. Segueix el mateix model que l’app de ruta del Catllaràs (repositori `catllaras`), adaptat a sis jornades, al pla C i a Bolívia. En català, castellà, anglès i francès.

**Instal·lar:** iPhone, Safari amb cobertura → Compartir → «Afegir a la pantalla d’inici». Android, Chrome → menú → «Instal·lar aplicació».

## Abans de sortir (a La Paz, amb wifi)

1. Obrir l’app perquè es desi la versió nova.
2. **Info → Ajustos:** posar la data del dia 1 (arribada a La Paz). Les jornades a peu són els dies 5 a 10.
3. **Mapa → «Descarregar el mapa de la ruta»:** teselles d’OpenTopoMap dels zooms 11 a 15 al voltant del track, del pla C i dels plans B.
4. **Ara → «Actualitzar meteo ara»:** la previsió queda desada i es veu sense cobertura, amb l’hora en què es va baixar.
5. **SOS → Contactes:** omplir operador, contacte extern, assegurança, centre sanitari, transport i Garmin inReach (GPS i comunicador satèl·lit).

## Pantalles

| Pantalla | Què hi ha |
|---|---|
| Ara | Hora de Bolívia, llum fins al lloc segur (posta − 90 min), GPS sobre el traçat, km fets, retard, pròxim punt, què falta (km, desnivell, temps, arribada), pròxima hora límit i decisió, meteo a l’hora i la cota on sou, navegar a un punt, seguir un pla B |
| Punts | Perfil i punts de pas de cada jornada (D5–D10) i de cada etapa del pla C (C1–C4): hora prevista, hora límit, què comprovar, «Hi som» (sense GPS), plans B del dia |
| Mapa | Mapa propi en canvas: teselles d’OpenTopoMap desades i, a sota, els mapes de l’Atles cartogràfic (sempre dins de l’app); jornades, pla C, rutes dels plans B, sortides en vehicle i GPS |
| Plans | Què fer si…, esquema de decisions, plans B per jornada amb rutes per seguir, pla C, criteris i taula de rutes |
| SOS | Comunicador satèl·lit, telèfons de Bolívia (110, 165, 119), coordenades WGS84 i UTM 19S, punt i sortida en vehicle més propers, protocol, contactes i coordenades de tots els punts |
| Info | **Avaluació** (al principi): checklist diari, autoavaluació del guia i enquesta del client (enllaç i QR). Grup i conducció, horari, previsió per punts, fonts meteo, temporada, carreteres (ABC), cotes de nit, llistes, GPX i ajustos (idioma, data, mode prova) |

## Fitxers

| Fitxer | Què és |
|---|---|
| `index.html` | Pantalles i estils |
| `app.js` | Lògica: hora BOT, llum, GPS, horari, punts, SOS, GPX |
| `dades.js` | Construeix les jornades a partir de `../content.js`, `track.js`, `planc.js` i `data.js`. **No s’hi escriuen dades a mà**: els punts de decisió i el ritme dels plans B són les úniques constants |
| `pla.js` | Seguir una ruta dels plans B a la pantalla «Ara» |
| `mapa.js` | Mapa en canvas i descàrrega de teselles |
| `avaluacio.js` | Checklist diari (Annex A, M2), autoavaluació del guia (M4, 1–5) i enquesta del client (formulari de Google anònim, QR a `img/enquesta-qr.svg`, fet amb `python3 tools/qr_enquesta.py <url>`). Es desa al mòbil i s’exporta en CSV o PDF. Enllaços directes: `?aval=check`, `?aval=auto`, `?aval=enq` |
| `meteo.js` | Previsió Open-Meteo per a cada punt, amb la seva altitud |
| `i18n.js` | Textos de la interfície en 4 idiomes |
| `data.js` | Hores de control i decisions (cap. 10 del treball), seguretat, llistes i contactes |
| `track.js` / `planc.js` | Track de 2012 i traçat del pla C i dels plans B |
| `mapes.js` / `img/` | Mapes de l’atles georeferenciats (els genera `python3 tools/guia_mapes.py` després de `tools/atles.py`) |
| `camp.js` | Eines de camp (model del Catllaràs): «Ara» en vista simple, **guió de la jornada** (què dir a cada punt i criteris de conducció), **text per dictar o enviar en una emergència** i missatge curt per al Garmin inReach (WGS84, UTM 19S, punt i sortida més propers), caminada simulada al mode prova i protecció del desplaçament sobre el mapa |
| `sw.js` | Funcionament sense cobertura. Les teselles es desen a part i no s’esborren en actualitzar l’app |

## Fonts i llicències

- Track: Gallotrekk, Wikiloc (2012). Plans B i C: © OpenStreetMap contributors (ODbL) i SRTM.
- Mapa: © OpenTopoMap (CC-BY-SA). La descàrrega es limita al voltant de la ruta i fa dues connexions a la vegada, perquè OpenTopoMap demana no fer descàrregues massives.
- Previsió: Open-Meteo (CC BY 4.0). L’API gratuïta és per a ús no comercial: si l’app es fa servir en sortides de pagament, cal valorar el pla comercial.
- El recorregut no s’ha reconegut sobre el terreny: hores, desnivells i traçats dels plans són estimacions que el guia valida.
