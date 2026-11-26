# CLAUDE.md · Proyecto Apolobamba (Andes Wild Trek)

Contexto para seguir trabajando en este repositorio. Léelo entero antes de tocar nada. Actualízalo al final de cada pull request si cambian decisiones, estructura o pendientes.

## Quién y qué

- **Autor:** Izan Pimentel Pérez, guía de montaña (formación TD2 en media montaña, especializado en esquí de montaña, con experiencia en el extranjero y en Pirineos). Habla castellano y no es programador. El trabajo, el atlas y la presentación están en **catalán**; la web del cliente, la página del trabajo, la app del guía y los documentos del cliente están en **catalán, castellano, inglés y francés**.
- **Proyecto:** trabajo académico TD2 de media montaña. Diseña un producto comercial de trekking, **"Andes Wild Trek · Apolobamba"**: la travesía **Pelechuco → Charazani** en la Cordillera de Apolobamba (Bolivia).
- **Repositorio:** https://github.com/7m5n2m6tv8-eng/apolobamba (público).
- **Web publicada (GitHub Pages, rama `main`, raíz):** https://7m5n2m6tv8-eng.github.io/apolobamba/. Es la dirección del **QR del flyer** y no debe cambiar.
  - Web del cliente: `index.html`
  - Trabajo académico: `treball.html`
  - Presentaciones (una por asignatura, con guion, tecla N): `presentacio.html` (elige), `presentacio-organitzacio.html` y `presentacio-orientacio.html`
  - App del guía: `guia/` (…/apolobamba/guia/)
- Estado a 26/11/2026: PR #20 a #31 y #33 (atlas regenerado) integradas (también declinación, recuperación del título/ROPEC perdido y correcciones de la revisión de tres profesores) (presentaciones, título y ROPEC, Garmin inReach, app del guía con herramientas de campo, fitxa de metodología con guía para localizar los lliuraments y flyer final). El trabajo está prácticamente cerrado: Izan no quiere modificar mucho más.

## Forma de trabajar (obligatorio)

1. Los cambios van **siempre en una rama** (`claude/<descripcion>`) con **pull request a `main`**. No se toca `main` directamente. Izan revisa la PR y pide integrarla.
2. Según lo que cambie, antes del commit:
   - Datos de las jornadas → primero `python3 tools/atles.py`, después `python3 tools/guia_mapes.py` (mapas de fondo de la app del guía) y `node tools/dossier.js` (regenera los cuatro dossiers completos, de 15 páginas, con los mapas nuevos). `tools/atles.py` regenera el Atles cartogràfic A3 y los mapas del dossier; necesita `reportlab`, `Pillow` y acceso a `tile.opentopomap.org`, que está permitido en el entorno «apolobamba».
   - Textos o secciones de `index.html` → `node tools/prerender.js` (versión estática).
   - Documentos del cliente (ficha, preparación, plan de entrenamiento, libreta de ruta y encuesta, en 4 idiomas) → `node tools/client_docs.js`.
   - Rutas de los planes B y C → `python3 tools/gpx.py` (GPX en `dossiers/gpx/`).
   - Presentaciones → editar `tools/presentacions.py` y ejecutar `python3 tools/presentacions.py`.
   - **Siempre, al final:** `python3 tools/stamp.py` (actualiza `version.txt`, los `?v=` y la versión de la caché de la app del guía en `guia/sw.js`, para que el móvil cargue la versión nueva).
3. No hay dependencias ni build: es una web estática. Para probarla: `python3 -m http.server`. Revisa en móvil (390 px) y escritorio, en **ca, es, en y fr**, sin errores de consola ni enlaces rotos. La app `guia/` se prueba aparte.
4. **Trabajo escrito:** se edita `dossiers/Apolobamba_TD2_Treball_Complet.docx` y se exporta a PDF con el **mismo nombre**. Si cambia algún bloque, se regeneran los PDF de los bloques 01–06 y se actualiza el buscador (`modules.json`). **Nunca renombres archivos de `dossiers/`**, porque la web los enlaza.
5. **Textos de la web:** están en `content.js`. Nivel, requisitos, punto de encuentro, precios, reserva, cancelación, grupo privado y material (obligatorio / recomendado / organización) se escriben en `tools/fitxa_data.py` para los cuatro idiomas y también los aplica `tools/i18n_apply.py`. Cada clave existe en `ca`, `es`, `en` y `fr`, y los cuatro idiomas deben ir sincronizados. El inglés y el francés se escriben en `tools/i18n_web.py` (web) y `tools/i18n_plans.py` (planes) y se aplican con `python3 tools/i18n_apply.py` (después de `tools/plans_data.py`).
6. Los mensajes de las PR y los resúmenes para Izan van en castellano, claros y sin jerga técnica.

## Estructura del repo

| Archivo | Contenido |
| --- | --- |
| `index.html` | Web del cliente: viaje, etapas (datos principales), programa, precio, condiciones, documentos para el cliente y contacto |
| `treball.html` | Página "Treball TD2": trabajo completo (PDF/Word), seis bloques con buscador, herramientas del guía (incluida la app), instrumentos de evaluación (`#avaluacio`: encuesta en línea con QR, checklist y autoevaluación en la app; textos `tw.aval*`), fuentes, Instagram y modo exposición |
| `presentacio.html` | Página para elegir presentación. Hay **dos presentaciones, una por asignatura**, de unos 15 min y con guion (tecla N): `presentacio-organitzacio.html` (Organització d’activitats · escola de senderisme: empresa, mapa legal y contrato en 2 diapositivas, cliente, programa, presupuesto con lo que incluye y no incluye, conducción, dinámicas, mapa de riesgos, evaluación con el QR de la encuesta, marketing; 14 diapositivas) y `presentacio-orientacio.html` (Orientació, cartografia i planificació: zona, fuentes, atlas, jornadas, cálculo de horarios, luz, aclimatación, puntos de decisión, meteo, planes B y C, navegación con niebla, herramientas de navegación; 15 diapositivas). **Se generan con `python3 tools/presentacions.py`**: no editar los HTML a mano |
| `content.js` | Todos los textos (ca/es/en/fr), los datos de las seis jornadas (`window.DAYS`) y la temporada, planes B, plan C, carreteras y criterios (`window.PLANS`, que se escribe con `tools/plans_data.py`) |
| `site.js` | Construcción de la página, pestañas de jornadas, lista de material y diálogos |
| `extras.js` | "El teu guia", comparador de altitud, "El territori", test "És per a mi?" y contacto por WhatsApp (número en `CONTACT`, ya configurado) |
| `sw.js` | Funcionamiento sin conexión de la web |
| `modules.js` / `modules.json` | Bloques del trabajo con buscador (solo en `treball.html`) |
| `site.css` | Estilos |
| `guia/` | App móvil del guía, sin cobertura (PWA), **mismo modelo que la app del repositorio `catllaras`**: pantallas Ara, Punts, Mapa, Plans, SOS e Info. Hora de Bolivia, luz hasta lugar seguro (puesta − 90 min), GPS sobre el trazado, retraso, qué falta, hora límite y decisión, mapa en canvas (teselas de OpenTopoMap descargadas + mapas del atlas de fondo, `guia/mapes.js` e `img/`), seguir rutas de los planes B (`pla.js`), etapas C1–C4, meteo Open-Meteo por punto (`meteo.js`), SOS con WGS84/UTM 19S y salida en vehículo más cercana, listas, contactos y GPX. **Avaluació** (`guia/avaluacio.js`, tarjeta al principio de Info; enlaces directos `guia/?aval=check|auto|enq`): checklist diario (12 puntos del Annex A M2 + registro de la jornada), autoavaluación del guía (10 aspectos de M4, 1–5) y enlace y QR de la encuesta; se guarda en el móvil y se exporta en CSV o PDF. Los datos se construyen en `guia/dades.js` desde `content.js`, `track.js`, `planc.js` y `data.js` (no se copian); textos de la interfaz en `guia/i18n.js` (4 idiomas). **Herramientas de campo** (`guia/camp.js`, modelo del Catllaràs): «Ara» en vista simple, guion de la jornada, texto para dictar en una emergencia con mensaje corto para el inReach y caminada simulada. Detalle en `guia/README.md`. Solo se enlaza desde `treball.html` |
| `assets/` | Fotos WebP, mapas de cada jornada para el dossier (`assets/maps/`, los genera `tools/atles.py`; no se usan en la web), flyer, figuras de la presentación, créditos en `PHOTOGRAPHY.md` |
| `dossiers/` | Trabajo completo (PDF + DOCX), bloques 01–06, Atles cartogràfic A3 y Formularis operatius |
| `dossiers/gpx/` | GPX de la ruta principal, de las rutas de cada plan B (días 5–10) y del plan C (generados con `tools/gpx.py` sobre OpenStreetMap) |
| `dossiers/client/` | Para el cliente, en ca, es, en y fr: ficha del viaje, preparación y material, plan de entrenamiento de 12 semanas, libreta de ruta y **dossier completo** (`Dossier_Viatge_CA`, `Dossier_Viaje_ES`, `Travel_Dossier_EN`, `Dossier_Voyage_FR`; 15 págs., con temporada y alternativas explicadas para el cliente, sin la tabla ni los mapas del plan C; **no se enlaza en la web**: se envía por WhatsApp cuando el cliente contacta) |
| `tools/` | `stamp.py` (versión), `dossier.js` (dossier del cliente), `plans_data.py` (fuente de temporada, planes B, plan C, ABC y criterios → `window.PLANS`; con `PLANC_WORK` también regenera `guia/planc.js`), `atles.py` (Atles cartogràfic A3, 11 láminas: mapa general, 6 jornadas y 4 etapas del plan C, con las rutas de los planes B; exporta `assets/maps/jornada-*`, `pla-c-*` y `general-*` para el dossier; `--no-export` para no exportar), `prerender.js` (HTML estático), `client_docs.js` (ficha, preparación, entrenamiento, libreta de ruta y encuesta en 4 idiomas), `gpx.py` (GPX), `grafic_pressupost.py` (gráfico del presupuesto), `i18n_*.py` (inglés y francés), `fitxa_data.py` (nivel, requisitos, reserva, cancelación y material en 4 idiomas), `blocs.py` (bloques 01–06, formularios y buscador a partir del trabajo completo), `guia_mapes.py` (georreferencia los mapas del atlas para la app del guía), `qr_enquesta.py` (`python3 tools/qr_enquesta.py <url>` → QR de la encuesta en `guia/img/` y `assets/`), `presentacions.py` (las dos presentaciones y la página para elegir) |

## Decisiones tomadas (no reabrir sin que Izan lo pida)

- **Propuesta única = antigua variante B.** La variante de cinco jornadas está descartada. Programa: **11 días + 2 de reserva** (13 días más los vuelos).
- **La etapa 2 se reparte en dos días, con noche en Hilo Hilo**, para que el día del paso Sunchulli (7–9 h) quepa en la ventana de luz. Lo respaldan los programas de operadores bolivianos.
- **La etapa final tiene un punto de decisión en el cruce de Curva:** si el grupo va justo de tiempo, termina allí y sigue en vehículo.
- **Precio de referencia: 2.700 € por persona**, margen del 20 % con 8 clientes (20,2 %). Grupo de **8–13** con guía de montaña y guía local; a partir de 10 clientes se añade un guía de apoyo (1.953,75 €). Coste = (10.447,50 + 653,75·n + apoyo) × 1,10. Con 6–7 clientes no se llega al 20 %.
- **Precio anticipado y condiciones (propuesta, pendiente de asesoría):** 2.700 € hasta 90 días antes de la salida y 2.850 € después (el presupuesto se calcula con 2.700 €). Señal del 30 % al confirmar y resto 45 días antes. Garantía de salida: si no se llega a 8, aviso como mínimo 30 días antes y devolución del 100 % en 14 días (u otra fecha). Cancelación por el cliente sobre el precio total: 10 % a más de 90 días, 25 % de 90 a 61, 50 % de 60 a 31, 75 % de 30 a 15 y 100 % a menos de 15 o sin presentarse; cesión de plaza posible; sin gastos por circunstancias inevitables y extraordinarias en destino. Suplementos (habitación y tienda individual, alquiler de saco) con precio a confirmar. Grupo privado de 8–13 con fechas dentro de la temporada y presupuesto a medida.
- **Ficha del cliente:** nivel en cuatro indicadores (exigencia física alta, dificultad técnica baja, altitud muy alta, aislamiento alto) y requisitos concretos (una travesía previa de 3 días o más; 8–9 h con unos 1.000 m dos días seguidos). Punto de encuentro: día 1 en el aeropuerto de El Alto (LPB) y reunión de bienvenida a las 19.00 en el hotel; el servicio termina el día 11 por la tarde en La Paz. Orden de la web: inicio, cifras, nivel y requisitos, experiencia, etapas, programa (con punto de encuentro), precio y condiciones, territorio, método, guía, preparación, preguntas, documentos y contacto. Ficha del viaje en 2 páginas; dossier completo de 15 páginas.
- **Fechas propuestas: junio de 2027** (temporada seca). **Las reservas no están abiertas.** La web lo dice claramente: es un proyecto académico.
- **Web del cliente sin tracks, mapas ni meteo:** nada de mapa interactivo, perfil, track GPS, mapas de etapa, libreta de ruta ni atlas. Las etapas muestran los datos principales y remiten al **dossier completo, que se pide por WhatsApp**. La información técnica vive en la app del guía y en el trabajo.
- **El trabajo no tiene versiones:** nada de "edició 1.x", "què canvia" ni "versió descartada", solo la fecha. Lo pendiente está en el **Annex D**. La bibliografía está en el **Annex E** e incluye las fuentes de meteorología.
- **Meteorología (cap. 10):** se consulta en SENAMHI, Windy (ECMWF), Meteoblue, Mountain-Forecast, el satélite GOES y el comunicador satélite, con criterios de decisión.
- **Separación cliente / académico:** la web del cliente solo enlaza contenido para el cliente. Al trabajo académico se llega solo por el acceso "Treball TD2" (menú, menú móvil y pie). Las condiciones del viaje son una sección dentro de la web, no un PDF.
- **Honestidad de datos:** el recorrido parte de un GPX de 2012 (geometría y tiempos) **puesto al día con fuentes recientes**: relatos y registros de 2022–2025, OpenStreetMap 2026 (≈36 % del camino ya es pista minera), seis operadores consultados en noviembre de 2026 y la ABC (2025–2026). No presentarlo como «solo el GPX de 2012». Aun así **no se ha reconocido sobre el terreno**. Ese aviso se mantiene y los horarios no se presentan como validados.
- **Sin rastros de IA ni lenguaje interno** en los textos: nada de "facilitat per l'usuari", "paquet aportat" ni "NO-GO" sin explicar. Con el cliente, lenguaje llano.
- **"El teu guia" sin cita inventada** (se quitó). No inventar frases atribuidas a Izan.
- Topónimos normalizados en catalán ("Pas Sunchulli", no "Paso Sunchulli") y decimales con coma. La referencia es la tabla de normalización del trabajo (cap. 9). Los puntos de agua se llaman **"Agua buena 1–4"** (nombre del GPS, con la nota de que el agua se trata siempre); no se traducen.
- **Llegada a Charazani (día 10): 15.10–16.40**, igual que la duración de 8–9 h 30 min. La hora límite sigue siendo las 16.40.
- **Temporada:** ventana recomendada del 15 de junio al 31 de julio; salida propuesta, segunda quincena de junio de 2027. Mayo y septiembre, posibles; agosto, con riesgo de nevadas fuertes (1993, 2019); diciembre–abril, no.
- **Planes B por jornada** (texto en `tools/plans_data.py`): hora límite 14.40 en el Pas Sunchulli, con el último punto de media vuelta cómoda en Agua buena 3 a las 13.40; si a las 14.40 no se está en el paso, media vuelta y 4×4 por la pista Hilo Hilo–Sorapata (a pie hasta Hilo Hilo son unas 3 h); en el día 8, bajada alternativa a las Mil Corbes por el sur del Pas 5 (2,9 km, −600 m, unos 200 m sin cartografiar), noche en Quellwa Cota o regreso al Campament 2; final en Curva; salidas en vehículo por pistas mineras (≈36 % del camino va por pista, según OpenStreetMap).
- **Precio con plan C y días de reserva:** con el plan C el precio para el cliente no cambia (la diferencia de las partidas Q la cubre el margen); los 2 días de reserva son una provisión: si no se usan, el servicio acaba el día 11 y las noches extra en La Paz las paga el cliente.
- **Plan C · Cañisaya – Akamani – Charazani:** 4 etapas; el día 4 se va en vehículo de La Paz a Curva (≈9 h, noche ≈3.740 m) y se duerme allí (C1 Curva→Cañisaya, C2 →Pas d’Akamani→Incacancha, C3 →Pas Lorisani→Huayrapata, C4 →Pas de Chatalayo→RN16→Charazani), 34,6 km, +2.070/−2.440 m, máx. 4.661 m. Datos de OpenStreetMap y SRTM (±10 %), pendientes de reconocer. Se activa antes de salir (paso cerrado, conflicto minero, sin permisos) o desde Incacancha.
- **Título y ROPEC (25/11/2026):** el trabajo trata a Izan como **titular del título de tècnic esportiu en mitja muntanya (TD2) e inscrito al ROPEC**; no se inventa ningún número de inscripción (se adjunta copia al expediente). Se mantiene el límite del título (no habilita para terreno técnico de alta montaña) y que el registro catalán no vale en Bolivia. La acreditación del guía local en Bolivia sigue pendiente. La web sigue diciendo que es un proyecto académico.
- **Garmin inReach:** el guía principal lleva un **Garmin inReach (GPS y comunicador satélite)** con suscripción activa: mensajes, SOS (centro de emergencias de Garmin), previsión por punto y enlace de seguimiento para el contacto externo. Aparece en el trabajo (cap. 4.3, 10, Annex D, partida «Material col·lectiu» de 400 € como alquiler/amortización con suscripción), las presentaciones, la web (material de la organización), la app y los dossiers. El presupuesto no cambia: si la cotización real del dispositivo y la suscripción no cabe en los 400 €, hay que reajustarlo.
- **Agua:** tratarla no elimina el mercurio: solo fuentes por encima de las minas o confirmadas por la comunidad, y reserva en el valle de Sunchulli. **Permiso escrito del SERNAP** en La Paz y registro en Pelechuco y Lagunillas. **Microcrampones de reserva** para el grupo, no para el cliente: solo para placas de hielo sueltas en un sendero fácil; no cambian el límite (con nieve dura o hielo en el Pas Sunchulli no se cruza).
- **Horas de control del día 8 (26/11/2026):** Pas 4 11.40, Agua buena 4 11.55, Pas 5 12.10, Inici Mil Corbes 12.40 y Final Mil Corbes 13.10 se mantienen como **puntos de decisión**, aunque un grupo lento (7 h) llegue más tarde: si se pasa la hora, el guía valora seguir o aplicar el plan B. No se mueven.
- **Carreteras:** consultar la ABC (transitabilidad.abc.gob.bo, @carreterasbo) y transportistas 48 h y 24 h antes de cada traslado. Punto crítico: RN16 Charazani–Apolo (donde termina el plan C). El camino a Pelechuco no está en los informes de la ABC.

## Programa (datos de referencia)

| Día | Jornada | Datos | Noche |
| --- | --- | --- | --- |
| 1–3 | La Paz: llegada, adaptación y aclimatación | Paseos suaves, revisión de material | Hotel ≈3.650 m |
| 4 | La Paz → Pelechuco | ~12 h en 4×4 | Alojamiento local, 3.660 m |
| 5 | Pelechuco → Campament 1 | 9,7 km · +1.047/−540 m · 6–8 h · llegada 13.10–15.10 | Tienda, 4.168 m |
| 6 | Campament 1 → Hilo Hilo | 4,2 km · 2–3 h | Tienda, 4.010 m |
| 7 | Hilo Hilo → Pas Sunchulli (5.032 m) → Campament 2 | 11,4 km · +1.062/−354 m · 7–9 h · hora límite en el collado: 14:40 | Tienda, 4.500–4.700 m (objetivo ≈4.500 m) |
| 8 | Campament 2 → Incacancha (Mil Curvas) | 8,3 km · +211/−867 m · 5–7 h · llegada 12.10–14.10 | Tienda, 4.060 m |
| 9 | Incacancha → Campament 3 (paso Akamani) | 4,1 km · +602/−491 m · 4–6 h | Tienda, 4.171 m |
| 10 | Campament 3 → Charazani (posible final en Curva) | 15,8 km · +497/−1.473 m · 8–9 h 30 min | Alojamiento local, 3.195 m |
| 11 | Charazani → La Paz | 7–8 h en vehículo | Fin del servicio |

Total a pie: 6 jornadas, 53,4 km, +3.450/−3.915 m. Horario de marcha: salida desde las 07:10 y llegada antes de las 16:40.

Fuentes de contraste (cap. 9 y Annex E del trabajo): track de Gallotrekk en Wikiloc (2012), programas de operadores bolivianos (Bolivian Mountain Guides, ZigZag Bolivia, entre otros) y relatos de 2022–2025. Mapas: OpenTopoMap, OpenStreetMap y SRTM (CC-BY-SA). Fotos: Wikimedia Commons (CC BY-SA 4.0). Kit de dinámicas: 145 g (16 tarjetas A6).

## Historial de pull requests

1. **#1**: B como propuesta única, noche en Hilo Hilo, final en Curva y 3.800 €. Textos ca/es reescritos para el cliente, pestañas de jornada, contraste con operadores y flyer nuevo.
2. **#2**: web del cliente separada del trabajo (`treball.html`), condiciones del viaje dentro de la web, trabajo sin versiones y Annex D.
3. **#3**: la web carga siempre la última versión (`version.txt`, `tools/stamp.py`, `?v=`).
4. **#4**: portada, índice, figuras y bibliografía del trabajo; flyer con foto real; "El teu guia", comparador de altitud, "El territori", test, plan de entrenamiento y libreta de ruta; mejoras en móvil; modo sin conexión; presentación; Instagram.
5. **#5**: mapa interactivo con el GPX real, correcciones de datos y WhatsApp activado.
6. **#6**: web del cliente sin tracks ni mapas (todo eso pasa al dossier por WhatsApp), dossier completo ca/es con `tools/dossier.js`, app del guía `guia/`, `tools/prerender.js`, meteorología en el cap. 10, Annex C, D y E actualizados y cita de "El teu guia" eliminada.
7. **#7**: CLAUDE.md con el contexto del proyecto.
8. **#8**: Atles cartogràfic A3 redibujado con `tools/atles.py` (6 páginas, una por jornada, topónimos normalizados, decimales con coma); el dossier del cliente usa los mismos mapas en ca/es; Annex D actualizado (Word, PDF, bloque 06 y buscador); llegada a Charazani unificada en 15.10–16.40 (web, app, trabajo, dossier y libretas de ruta).
9. **#9**: revisión de la ruta (17/11/2026): temporada recomendada, planes B por jornada y vías de evacuación, plan C con fichas técnicas, carreteras (ABC) y criterios de agua y permisos, en la web del cliente, la página del trabajo, la presentación, la app del guía, el atlas (10 láminas), el dossier y el trabajo escrito (cap. 10.2–10.6, Annex D y E).

10. **#10**: revisión completa (coherencia de datos, agua, microcrampones, plan C con noche en Curva, nomenclatura por días), precio 2.700 € con margen del 20 % y grupo de 8–13, GPX y mapas de los planes B y C (atlas de 11 láminas con mapa general), encuesta del cliente, generador de documentos del cliente, traducción al inglés y al francés y dossier completo compactado.

11. **#11**: ficha del cliente reorganizada siguiendo el modelo de las fichas de travesías organizadas del Pirineo: nivel en cuatro indicadores, requisitos, punto de encuentro, precio anticipado (2.700/2.850 €), garantía de salida, suplementos, reserva en cuatro pasos, tabla de cancelación, grupo privado y material obligatorio / recomendado / de la organización; nuevo orden de la web; ficha de 2 páginas; dossier, presentación y trabajo (cap. 5.2, 5.3, 6.1, 6.2 y Annex D) actualizados.

12. **#12**: app del guía rehecha con el modelo de la app del Catllaràs (Ara, Punts, Mapa, Plans, SOS, Info; GPS, horario, luz, decisiones, mapa sin cobertura, planes B y C para seguir, meteo por puntos y SOS) en 4 idiomas; web del cliente más corta en móvil (bloques plegables); descripción de la app actualizada en la web, el trabajo (cap. 10 y tabla de recursos) y los bloques; tabla del programa del día 7 corregida en este archivo (+1.062/−354 m).

13. **#13**: una foto de Wikimedia Commons por jornada (guardada en `assets/`) en las pestañas de etapa y en el dossier completo, con autor, licencia y aviso cuando es paisaje de referencia, en 4 idiomas.

14. **#14**: web del cliente más comercial para la Entrega 01: planes B y C, temporada y material de la organización explicados sin detalle técnico (4 idiomas; ficha, preparación y dossier regenerados).

15. **#15**: dossier completo del cliente más comercial (15 páginas): temporada y planes alternativos con los mismos textos cortos que la web (`seasonShort`, `planShort`) y sin la tabla ni los mapas del plan C, que quedan en el atlas, la app y el trabajo. Copia para la Entrega 01: `Pimentel_Izan_Entrega_01_Client.pdf` (no está en el repositorio).

16. **#16**: instrumentos de evaluación reales: encuesta anónima del cliente en Google Forms (ca/es/en/fr, el cliente elige idioma; respuestas en una hoja de Google) con QR; checklist diario y autoevaluación del guía dentro de la app (sin cobertura, exportables en CSV o PDF); apartado «Instruments d’avaluació» en la página del trabajo, en 4 idiomas.

17. **#17**: presentación dividida en dos, una por asignatura: Organización de actividades (escuela de senderismo), con tres diapositivas de normativa y legislación, y Orientación, cartografía y planificación (fuentes, atlas, horarios, luz, decisiones, meteo, planes B y C y navegación). Página para elegir en `presentacio.html`; generador `tools/presentacions.py`.

18. **#18**: fuentes presentadas como base de 2012 puesta al día con fuentes de 2022–2026 (web en 4 idiomas, dossier, app del guía y presentación de Orientación, con una tabla de fuentes nueva); altitudes del plan C en la presentación alineadas con los datos (Incacancha 4.060 m, Charazani 3.195 m).

19. **#19**: revisión del trabajo escrito (Word, PDF, bloques y buscador; ahora 68 págs.): normativa ampliada y comprobada (RDL 1/2007 libro IV y RDL 23/2018, Ley 13/2002 y Decreto 75/2020 de turismo, Ley 3/2008 solo en Cataluña, Decreto 56/2003 como referencia, RGPD y LOPDGDD) también en la presentación de Organización; códigos de bibliografía duplicados corregidos ([V1–V3], [R12], [R13]) y citas que faltaban; días en lugar de «etapas» del GPX; partidas Q del presupuesto sin doble cómputo e incluido el plan C; teléfonos de emergencia en el Annex B; plan B del día 7 y plan C con la carretera cortada aclarados; final en Curva como resultado probable; pistas mineras por jornada (también en la web); idiomas del grupo; kit de dinámicas con 16 tarjetas (145 g); Annex C actualizado; PK y cotas con el mismo formato; fecha 24/11/2026.

20. **#20**: presentaciones mejoradas para la defensa (25/11/2026): organización con mapa legal y estado de cada trámite, contrato más corto, presupuesto con barras legibles y «inclou / no inclou», mapa de riesgos en lugar de la diapositiva de seguridad y «inclou/exclou» del precio; orientación con barra de luz, perfil del día 7 con la hora límite, diapositiva nueva de navegación con niebla (azimut calculado desde el GPX), cartografía con datum y carta oficial, textos más cortos y tamaños mayores; botones ocultos al proyectar; altitud del Pas Sunchulli (5.032 m, hasta 5.100 m según otras fuentes), totales «arrodonits», IAE de agencia: epígrafe 755.2 y «tres instrumentos operativos» (no «en uso»). Declinación magnética calculada el 26/11/2026 (NOAA WMMHR-2025, 20/06/2027): 9,84° O en Pelechuco y 9,79° O en Charazani, ±0,34°, cambio 0,23° O/año; ya está en la presentación de Orientación. Sigue pendiente contrastar con la carta oficial del IGM (serie H731, 1:50.000), que no se ha podido consultar en línea.

21. **#21**: Izan como titular del título y del ROPEC en el trabajo (cap. 3, Annex D), la presentación de Organización (mapa legal y conclusiones) y los textos relacionados; Garmin inReach como comunicador del guía en el trabajo, las presentaciones, la web, la app y los dossiers; PDF, bloques y buscador regenerados (68 págs.).

22. **#22**: app del guía mejorada con lo mejor de la app del Catllaràs (`guia/camp.js`, 4 idiomas): vista simple en «Ara», guion de la jornada con la frase tipo de cada punto, texto para dictar o enviar en una emergencia (WGS84, UTM 19S, punto y salida en vehículo más cercanos) con mensaje corto para el Garmin inReach, caminada simulada en el mode prova y protección del desplazamiento sobre el mapa. No se trae el mapa del tiempo del Atlántico del Catllaràs, que no aplica a Bolivia.

23. **#23**: corrección de la línea de estado de este archivo.

24. **#24**: metodología fácil de evaluar (rúbrica: fitxa de metodologia /40, checklist diari /20, enquesta del client /20 y autoavaluació del guia /20). La fitxa del cap. 8 tiene ahora los apartados Dades de la travessia, Objectiu, Públic i anàlisi del grup, Continguts, Etapes i progressió, Estratègia de conducció, Recursos, Temporització y Avaluació; tabla «On trobar cada lliurament de metodologia» al principio del cap. 8 (p. 17) y entradas del Annex A (M1–M5) con su página en el índice. PDF, bloques y buscador regenerados (68 págs.).

25. **#25**: flyer final rehecho (`assets/flyer.jpg` y `assets/flyer.pdf`): URL escrita bajo el QR, texto en lugar del falso botón, «Des de 2.700 € per persona» como precio de referencia y contacto por WhatsApp. Misma figura sustituida en el cap. 7 del trabajo. El QR apunta a la misma dirección. Izan entrega aparte una guía de una página para la profesora (no está en el repositorio ni debe añadirse).

26. **#26**: CLAUDE.md con las PR #23 a #25.

27. **#27**: declinación magnética (NOAA WMMHR-2025, 20/06/2027: 9,84° O en Pelechuco, 9,79° O en Charazani) en la presentación de Orientación y en el cap. 10 del trabajo; carta del IGM como pendiente en el Annex D.

28. **#28**: Annex D sin la nota detallada del inReach (lo cubre «Cotitzacions locals…»).

29. **#29**: recupera en el trabajo escrito los cambios de la PR #21 (titular TD2/ROPEC e inReach), que se habían perdido al añadir el IAE 755.2 desde una versión antigua del Word. **Antes de editar el docx, partir siempre del de `main` actual.**

30. **#30**: correcciones de la revisión de tres «profesores» (Organización 7,8/10, Orientación 7,5/10, Metodología 84/100): plan C al mismo precio y días de reserva explicados en el presupuesto (cap. 5.4); media vuelta del día 7 con último punto en Agua buena 3 a las 13.40 y 4×4 por la pista (web, planes B, app, presentación y trabajo, 4 idiomas); llegadas de los días 5 (13.10–15.10) y 8 (12.10–14.10) coherentes con la duración; fuentes «2022 a 2025»; «Altres partides» en la presentación; «Revisió final» en el método de la web; el QR de la encuesta ya no se anuncia en la libreta de ruta. El atlas A3 no se ha podido regenerar (sin acceso a las teselas de OpenTopoMap): mantiene la llegada antigua de los días 5 y 8 y el texto anterior del día 7; `tools/atles.py` ya está corregido y basta ejecutarlo con red.

31. **#31**: mejoras propuestas en la revisión. Trabajo escrito (ahora 70 págs.; índice y tabla de localización actualizados): apartados nuevos en el cap. 8 «Objectius, evidències i instruments», «Grup tipus i anàlisi del grup» y «Progressió didàctica de J1 a J6», enlazados desde la fitxa; «Protocol de mal d’altura» en el cap. 10 (Lake Louise y pulsioxímetro, criterios de descenso, signos de alarma; la medicación la prescribe medicina del viatge) con [R14] Roach 2018 y [R15] Luks/WMS 2019; revisión del precio (art. 158–159, tope del 8 %) y formulario normalizado (annex II) en el modelo de contrato (cap. 6.2); en el Annex D, oxígeno o cámara hiperbárica a decidir con el operador. Atlas: `tools/atles.py` dibuja la cuadrícula UTM 19S cada 1 km con etiquetas en km y la declinación (≈ 9,8° O); probado con un mapa de fondo vacío, pero el PDF del atlas no se ha regenerado por falta de acceso a OpenTopoMap.

32. **#33**: atlas A3 regenerado con OpenTopoMap (cuadrícula UTM 19S cada 1 km, declinación ≈ 9,8° O, llegadas nuevas de los días 5 y 8 y texto nuevo del día 7); etiquetas UTM dentro del marco y declinación dentro del mapa; si falta una tesela de OpenTopoMap (404), `tools/atles.py` amplía la del nivel anterior. Horas de los puntos de paso de los días 5 y 8 recalculadas en proporción a 6–8 h y 5–7 h (content.js, atlas, app, dossiers, libretas de ruta y las dos tablas del cap. 10 del Word; PDF, bloque 06 y buscador regenerados). Azimuts del atlas comprobados (35 tramos). Las horas de control del día 8 se mantienen como puntos de decisión.

## Pendiente

**En el repositorio (lo puede hacer Claude):**
- Mejoras de la revisión todavía sin hacer: margen en el día 10; tabla de azimuts por tramo en el atlas; checklist de la app también para los días 1–4, 11 y reserva, y autoevaluación guardada por código de salida.
- Si cambian los planes o el plan C: editar `tools/plans_data.py`, ejecutar `python3 tools/plans_data.py`, `python3 tools/atles.py`, `node tools/dossier.js`, `node tools/prerender.js` y `python3 tools/stamp.py`. El capítulo 10.2–10.6 del Word se generó con estos datos: si cambian, hay que actualizarlo a mano.
- Tracks de los planes B y C: salen de OpenStreetMap (ODbL). Wikiloc y TwoNav no se descargaron (bloquean el acceso automático y no se forzó).
- **Fotos por jornada:** cada pestaña de etapa y cada página de jornada del dossier tienen una foto de Wikimedia Commons (CC BY-SA 4.0), guardada en `assets/jornada-1…6.webp` (1.600 px) y `-small` (800 px). Datos y créditos en `window.STAGE_PHOTOS` (`photo-credits.js`) y `assets/PHOTOGRAPHY.md`; textos `stagePhotoAlt` y `stagePhotoNote`. Solo las jornadas 1 (Pelechuco) y 6 (Charazani–Curva) son del sitio exacto; las demás son paisaje de la zona y lo dicen. No hay fotos libres en Commons del Pas Sunchulli, Hilo Hilo, Incacancha ni Akamani. Si Izan aporta fotos propias, sustituir los archivos con el mismo nombre, actualizar los créditos y ejecutar `node tools/dossier.js`. En el dossier, los mapas de jornada se limitan a 80 mm de alto para que quepa la foto.
- Web del cliente simplificada (23/11/2026, Entrega 01): el bloque «Si el camí no deixa passar» usa `planShort` (3 frases: plan B, 2 días de reserva, ruta alternativa) y «Quan anar-hi» usa `seasonShort` (una frase por época). `planItems` y `PLANS.season.reasons`, con los detalles, siguen en el dossier y la app del guía. El material de la organización dice «Material de seguretat del grup» (sin el detalle de los microcrampones).
- Encuesta del cliente: formulario de Google en la cuenta de Izan («Apolobamba · Enquesta del client»), anónimo (no recoge correos), con las respuestas en la hoja «Apolobamba · Enquesta del client (Responses)». Una pregunta de idioma lleva a la sección ca, es, en o fr (mismos textos que `tools/client_docs.js`). Si se cambia el enlace: `ENQUESTA.url` en `guia/avaluacio.js`, primer elemento de `tw.aval` (content.js ca/es y `tools/i18n_web.py` en/fr) y `python3 tools/qr_enquesta.py <url>`. Si se cambian las preguntas, cambiarlas también en el formulario a mano.
- Web del cliente en móvil: los bloques secundarios se pliegan con «Mostra’n més» (lista `FOLD` en `site.js`; textos `foldMore`/`foldLess`). Para plegar otro bloque, añadir su selector a la lista.
- App del guía: la fecha del día 1 es provisional (16/06/2027) y se cambia en Info → Ajustos. Los umbrales de meteo de la app (viento ≥ 40 km/h, rachas ≥ 60 km/h) son orientativos, no del trabajo. Los números de emergencia de Bolivia (110, 165, 119) se comprobaron el 23/11/2026.

**Fuera del repositorio (Annex D, depende de Izan o del trabajo de campo):**
- Reconocer la bajada alternativa a las Mil Corbes y las cuatro etapas del plan C; acuerdos de acampada en Cañisaya, Huayrapata y Quellwa Cota; uso de pistas mineras para evacuar.
- Validar con asesoría el precio anticipado, la señal, el calendario de pagos y la escala de cancelación, y fijar el precio de los suplementos.
- Ratificar el modelo de agencia organizadora (si solo se vende guiado, hay que rehacer contrato, fiscalidad y presupuesto) y el mínimo de 8 clientes (qué hacer con 6–7).
- Reconocimiento de campo: trazado, tiempos reales, cotas de pernocta, campamentos, nieve o hielo, el puente, agua, comunicaciones y retiradas. Si fallan Hilo Hilo, el Campament 2 o los tiempos de E2b y E5, añadir jornadas o cambiar la ruta.
- Situar el Campament 2 hacia los 4.500 m: en el punto del GPX (4.717 m) la noche sube 707 m respecto a Hilo Hilo.
- Cotizaciones locales, garantía, RC, seguros, transporte, porteo, informe fiscal, permisos (SERNAP y acampada) y habilitaciones.
- Plan de emergencia con datos reales (operador, contacto externo, centro sanitario, asistencia 24 h, identificador del comunicador satélite), que se apunta en el formulario de apertura y en la app del guía.
- Si el flyer ya estaba impreso, el nuevo lleva textos distintos. El QR sigue apuntando a la misma dirección.
