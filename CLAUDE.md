# CLAUDE.md · Proyecto Apolobamba (Andes Wild Trek)

Contexto para seguir trabajando en este repositorio. Léelo entero antes de tocar nada. Actualízalo al final de cada pull request si cambian decisiones, estructura o pendientes.

## Quién y qué

- **Autor:** Izan Pimentel Pérez, guía de montaña (formación TD2 en media montaña, especializado en esquí de montaña, con experiencia en el extranjero y en Pirineos). Habla castellano y no es programador. El trabajo y la web están sobre todo en **catalán**, y la web también en castellano.
- **Proyecto:** trabajo académico TD2 de media montaña. Diseña un producto comercial de trekking, **"Andes Wild Trek · Apolobamba"**: la travesía **Pelechuco → Charazani** en la Cordillera de Apolobamba (Bolivia).
- **Repositorio:** https://github.com/7m5n2m6tv8-eng/apolobamba (público).
- **Web publicada (GitHub Pages, rama `main`, raíz):** https://7m5n2m6tv8-eng.github.io/apolobamba/. Es la dirección del **QR del flyer** y no debe cambiar.
  - Web del cliente: `index.html`
  - Trabajo académico: `treball.html`
  - Presentación (12 diapositivas con guion, tecla N): `presentacio.html`
  - App del guía: `guia/` (…/apolobamba/guia/)
- Estado a 17/11/2026: último commit en `main` = merge de la PR #8 (atlas redibujado).

## Forma de trabajar (obligatorio)

1. Los cambios van **siempre en una rama** (`claude/<descripcion>`) con **pull request a `main`**. No se toca `main` directamente. Izan revisa la PR y pide integrarla.
2. Según lo que cambie, antes del commit:
   - Datos de las jornadas → primero `python3 tools/atles.py` y después `node tools/dossier.js` (regenera `Dossier_Viatge_CA.pdf` y `Dossier_Viaje_ES.pdf` con los mapas nuevos). `tools/atles.py` regenera el Atles cartogràfic A3 y los mapas del dossier; necesita `reportlab`, `Pillow` y acceso a `tile.opentopomap.org`, que está permitido en el entorno «apolobamba».
   - Textos o secciones de `index.html` → `node tools/prerender.js` (versión estática).
   - **Siempre, al final:** `python3 tools/stamp.py` (actualiza `version.txt` y los `?v=` para que el móvil cargue la versión nueva sin caché).
3. No hay dependencias ni build: es una web estática. Para probarla: `python3 -m http.server`. Revisa en móvil (390 px) y escritorio, en **ca y es**, sin errores de consola ni enlaces rotos. La app `guia/` se prueba aparte.
4. **Trabajo escrito:** se edita `dossiers/Apolobamba_TD2_Treball_Complet.docx` y se exporta a PDF con el **mismo nombre**. Si cambia algún bloque, se regeneran los PDF de los bloques 01–06 y se actualiza el buscador (`modules.json`). **Nunca renombres archivos de `dossiers/`**, porque la web los enlaza.
5. **Textos de la web:** están en `content.js`. Cada clave existe en `ca` y `es`, y los dos idiomas deben ir sincronizados.
6. Los mensajes de las PR y los resúmenes para Izan van en castellano, claros y sin jerga técnica.

## Estructura del repo

| Archivo | Contenido |
| --- | --- |
| `index.html` | Web del cliente: viaje, etapas (datos principales), programa, precio, condiciones, documentos para el cliente y contacto |
| `treball.html` | Página "Treball TD2": trabajo completo (PDF/Word), seis bloques con buscador, herramientas del guía (incluida la app), fuentes, Instagram y modo exposición |
| `presentacio.html` | Presentación de 12 diapositivas con guion |
| `content.js` | Todos los textos (ca/es) y los datos de las seis jornadas |
| `site.js` | Construcción de la página, pestañas de jornadas, lista de material y diálogos |
| `extras.js` | "El teu guia", comparador de altitud, "El territori", test "És per a mi?" y contacto por WhatsApp (número en `CONTACT`, ya configurado) |
| `sw.js` | Funcionamiento sin conexión de la web |
| `modules.js` / `modules.json` | Bloques del trabajo con buscador (solo en `treball.html`) |
| `site.css` | Estilos |
| `guia/` | App móvil del guía, sin cobertura (PWA): fichas técnicas con horas de control y decisiones, mapa esquemático con "On soc?", GPX, meteo en Bolivia, seguridad, contactos y listas. Track en `guia/track.js` (199 puntos, Gallotrekk, Wikiloc, 2012). Solo se enlaza desde `treball.html` |
| `assets/` | Fotos WebP, mapas de cada jornada para el dossier (`assets/maps/`, los genera `tools/atles.py`; no se usan en la web), flyer, figuras de la presentación, créditos en `PHOTOGRAPHY.md` |
| `dossiers/` | Trabajo completo (PDF + DOCX), bloques 01–06, Atles cartogràfic A3 y Formularis operatius |
| `dossiers/client/` | Para el cliente, en ca y es: ficha del viaje, preparación y material, plan de entrenamiento de 12 semanas, libreta de ruta y **dossier completo** (14 págs.; **no se enlaza en la web**: se envía por WhatsApp cuando el cliente contacta) |
| `tools/` | `stamp.py` (versión), `dossier.js` (dossier del cliente), `atles.py` (Atles cartogràfic A3, una página por jornada a pie, y los mapas `assets/maps/jornada-<día>-<ca|es>.webp` que usa el dossier), `prerender.js` (HTML estático). La libreta de ruta y la ficha del viaje no tienen generador: si cambian los datos, hay que rehacerlas o corregirlas a mano |

## Decisiones tomadas (no reabrir sin que Izan lo pida)

- **Propuesta única = antigua variante B.** La variante de cinco jornadas está descartada. Programa: **11 días + 2 de reserva** (13 días más los vuelos).
- **La etapa 2 se reparte en dos días, con noche en Hilo Hilo**, para que el día del paso Sunchulli (7–9 h) quepa en la ventana de luz. Lo respaldan los programas de operadores bolivianos.
- **La etapa final tiene un punto de decisión en el cruce de Curva:** si el grupo va justo de tiempo, termina allí y sigue en vehículo.
- **Precio de referencia: 3.800 € por persona**, con un mínimo de 6 participantes (grupo de 6–12, con guía de montaña y guía local).
- **Fechas propuestas: junio de 2027** (temporada seca). **Las reservas no están abiertas.** La web lo dice claramente: es un proyecto académico.
- **Web del cliente sin tracks, mapas ni meteo:** nada de mapa interactivo, perfil, track GPS, mapas de etapa, libreta de ruta ni atlas. Las etapas muestran los datos principales y remiten al **dossier completo, que se pide por WhatsApp**. La información técnica vive en la app del guía y en el trabajo.
- **El trabajo no tiene versiones:** nada de "edició 1.x", "què canvia" ni "versió descartada", solo la fecha. Lo pendiente está en el **Annex D**. La bibliografía está en el **Annex E** e incluye las fuentes de meteorología.
- **Meteorología (cap. 10):** se consulta en SENAMHI, Windy (ECMWF), Meteoblue, Mountain-Forecast, el satélite GOES y el comunicador satélite, con criterios de decisión.
- **Separación cliente / académico:** la web del cliente solo enlaza contenido para el cliente. Al trabajo académico se llega solo por el acceso "Treball TD2" (menú, menú móvil y pie). Las condiciones del viaje son una sección dentro de la web, no un PDF.
- **Honestidad de datos:** el recorrido está planificado sobre un GPX de 2012 y contrastado con operadores, pero **no se ha reconocido sobre el terreno**. Ese aviso se mantiene y los horarios no se presentan como validados.
- **Sin rastros de IA ni lenguaje interno** en los textos: nada de "facilitat per l'usuari", "paquet aportat" ni "NO-GO" sin explicar. Con el cliente, lenguaje llano.
- **"El teu guia" sin cita inventada** (se quitó). No inventar frases atribuidas a Izan.
- Topónimos normalizados en catalán ("Pas Sunchulli", no "Paso Sunchulli") y decimales con coma. La referencia es la tabla de normalización del trabajo (cap. 9). Los puntos de agua se llaman **"Agua buena 1–4"** (nombre del GPS, con la nota de que el agua se trata siempre); no se traducen.
- **Llegada a Charazani (día 10): 15.10–16.40**, igual que la duración de 8–9 h 30 min. La hora límite sigue siendo las 16.40.

## Programa (datos de referencia)

| Día | Jornada | Datos | Noche |
| --- | --- | --- | --- |
| 1–3 | La Paz: llegada, adaptación y aclimatación | Paseos suaves, revisión de material | Hotel ≈3.650 m |
| 4 | La Paz → Pelechuco | ~12 h en 4×4 | Alojamiento local, 3.660 m |
| 5 | Pelechuco → Campament 1 | 9,7 km · +1.047/−540 m · 6–8 h | Tienda, 4.168 m |
| 6 | Campament 1 → Hilo Hilo | 4,2 km · 2–3 h | Tienda, 4.010 m |
| 7 | Hilo Hilo → Pas Sunchulli (5.032 m) → Campament 2 | 11,4 km · ≈+1.020/−315 m · 7–9 h · hora límite en el collado: 14:40 | Tienda, 4.500–4.700 m (objetivo ≈4.500 m) |
| 8 | Campament 2 → Incacancha (Mil Curvas) | 8,3 km · +211/−867 m · 5–7 h | Tienda, 4.060 m |
| 9 | Incacancha → Campament 3 (paso Akamani) | 4,1 km · +602/−491 m · 4–6 h | Tienda, 4.171 m |
| 10 | Campament 3 → Charazani (posible final en Curva) | 15,8 km · +497/−1.473 m · 8–9 h 30 min | Alojamiento local, 3.195 m |
| 11 | Charazani → La Paz | 7–8 h en vehículo | Fin del servicio |

Total a pie: 6 jornadas, 53,4 km, +3.450/−3.915 m. Horario de marcha: salida desde las 07:10 y llegada antes de las 16:40.

Fuentes de contraste (cap. 9 y Annex E del trabajo): track de Gallotrekk en Wikiloc (2012), programas de operadores bolivianos (Bolivian Mountain Guides, ZigZag Bolivia, entre otros) y relatos de 2022–2025. Mapas: OpenTopoMap, OpenStreetMap y SRTM (CC-BY-SA). Fotos: Wikimedia Commons (CC BY-SA 4.0).

## Historial de pull requests (todas integradas en `main`)

1. **#1**: B como propuesta única, noche en Hilo Hilo, final en Curva y 3.800 €. Textos ca/es reescritos para el cliente, pestañas de jornada, contraste con operadores y flyer nuevo.
2. **#2**: web del cliente separada del trabajo (`treball.html`), condiciones del viaje dentro de la web, trabajo sin versiones y Annex D.
3. **#3**: la web carga siempre la última versión (`version.txt`, `tools/stamp.py`, `?v=`).
4. **#4**: portada, índice, figuras y bibliografía del trabajo; flyer con foto real; "El teu guia", comparador de altitud, "El territori", test, plan de entrenamiento y libreta de ruta; mejoras en móvil; modo sin conexión; presentación; Instagram.
5. **#5**: mapa interactivo con el GPX real, correcciones de datos y WhatsApp activado.
6. **#6**: web del cliente sin tracks ni mapas (todo eso pasa al dossier por WhatsApp), dossier completo ca/es con `tools/dossier.js`, app del guía `guia/`, `tools/prerender.js`, meteorología en el cap. 10, Annex C, D y E actualizados y cita de "El teu guia" eliminada.
7. **#7**: CLAUDE.md con el contexto del proyecto.
8. **#8**: Atles cartogràfic A3 redibujado con `tools/atles.py` (6 páginas, una por jornada, topónimos normalizados, decimales con coma); el dossier del cliente usa los mismos mapas en ca/es; Annex D actualizado (Word, PDF, bloque 06 y buscador); llegada a Charazani unificada en 15.10–16.40 (web, app, trabajo, dossier y libretas de ruta).

## Pendiente

**En el repositorio (lo puede hacer Claude):**
- **Fotos por jornada:** cuando Izan aporte sus fotos, colocarlas en las pestañas de etapa (WebP con versión `-small`) y, si encaja, también en el dossier.
- Si Izan lo pide, acortar o plegar bloques de la web del cliente, que quedó larga en móvil.

**Fuera del repositorio (Annex D, depende de Izan o del trabajo de campo):**
- Ratificar el modelo de agencia organizadora (si solo se vende guiado, hay que rehacer contrato, fiscalidad y presupuesto) y el mínimo de 6 clientes (qué hacer con 4–5).
- Reconocimiento de campo: trazado, tiempos reales, cotas de pernocta, campamentos, nieve o hielo, el puente, agua, comunicaciones y retiradas. Si fallan Hilo Hilo, el Campament 2 o los tiempos de E2b y E5, añadir jornadas o cambiar la ruta.
- Situar el Campament 2 hacia los 4.500 m: en el punto del GPX (4.717 m) la noche sube 707 m respecto a Hilo Hilo.
- Cotizaciones locales, garantía, RC, seguros, transporte, porteo, informe fiscal, permisos (SERNAP y acampada) y habilitaciones.
- Plan de emergencia con datos reales (operador, contacto externo, centro sanitario, asistencia 24 h, identificador del comunicador satélite), que se apunta en el formulario de apertura y en la app del guía.
- Si el flyer ya estaba impreso, el nuevo lleva textos distintos. El QR sigue apuntando a la misma dirección.
