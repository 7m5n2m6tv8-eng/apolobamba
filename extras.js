/* Seccions afegides a la web del client: guia, altitud interactiva, territori, test i contacte. */
(() => {
  'use strict';
  // Contacte: escriu aquí el número de WhatsApp amb prefix i sense espais ni «+» (exemple: '34600111222').
  const CONTACT = { whatsapp: '34644860628' };

  const T = {
    ca: {
      guideLabel: 'EL TEU GUIA', guideTitle: 'Qui t’acompanya<br>pel camí.',
      guideName: 'Izan Pimentel Pérez',
      guideRole: 'Guia de muntanya · Fundador d’Andes Wild Trek',
      guideText: 'Guia de muntanya format com a tècnic esportiu en mitja muntanya, amb especialització en esquí de muntanya i experiència guiant grups a l’estranger. La seva muntanya de cada dia és el Pirineu; l’Apolobamba és el projecte amb què vol portar aquesta manera de guiar als Andes.',
      guidePoints: [['Formació', 'Tècnic esportiu en mitja muntanya (TD2)'], ['Terreny habitual', 'Pirineus i mitja muntanya de tot l’Estat'], ['A l’Apolobamba', 'Sempre amb un guia local habilitat']],
      guideQuote: '«Guiar és decidir bé i explicar per què. El cim és que tothom torni amb ganes de tornar-hi.»',
      guideCaption: 'Al cim del Mont Perdut, 3.355 m',
      altLabel: 'EL RECORREGUT', altTitle: 'Tot el camí,<br>punt a punt.',
      altIntro: 'Mou-te pel mapa topogràfic, tria un dia o passa el dit pel perfil per seguir el camí. Les tendes marquen on dormim.',
      allDays: 'Tot', fit: 'Veure tot el recorregut', zoomIn: 'Apropa', zoomOut: 'Allunya', full: 'Pantalla completa', fullOff: 'Surt de pantalla completa', locate: 'On soc?', locating: 'Buscant la teva posició…', locFar: 'Ets a {0} km del recorregut.', locNear: 'Ets a {0} m del camí.', locErr: 'No s’ha pogut obtenir la posició.', twoFingers: 'Fes servir dos dits per moure el mapa', ctrlWheel: 'Fes servir Ctrl + roda per fer zoom', offlineTiles: 'Sense connexió: no es pot carregar el mapa de fons, però el traçat sí.', mapAria: 'Mapa topogràfic interactiu del recorregut', onMap: 'Veure al mapa',
      trackTitle: 'El track GPS', trackText: 'El traçat és un registre real del recorregut, gravat del 28 de juny a l’1 de juliol de 2012: 199 punts, 24 waypoints i l’hora de cada punt. Qui el va gravar va fer la travessa en quatre dies.', trackStats: [['53,4 km', 'de Pelechuco a Charazani'], ['+3.450 m', 'de desnivell positiu'], ['4 dies', 'el 2012, sense grup']], trackLink: 'Track de Gallotrekk a Wikiloc',
      profileAria: 'Perfil d’altitud de la travessa', nightWord: 'Nit', dayWord: 'Dia', kmWord: 'km des de Pelechuco', openMap: 'Obre’l al mapa topogràfic',
      mapTitle: 'El recorregut', mapHint: 'Esquema amb els punts GPS del traçat. El nord és a dalt.',
      cmpTitle: 'Per fer-te’n una idea', cmpText: 'El pas Sunchulli és més alt que el Mont Blanc, i dormirem cinc nits per sobre dels 4.000 m. Per això el programa comença amb tres dies d’aclimatació.',
      cmp: [['Pica d’Estats', 3143, 0], ['Aneto', 3404, 0], ['La Paz · on ens aclimatem', 3650, 1], ['Campament més alt', 4717, 1], ['Mont Blanc', 4806, 0], ['Pas Sunchulli', 5032, 2]],
      cultLabel: 'EL TERRITORI', cultTitle: 'Un país de pastors,<br>remeiers i vicunyes.',
      cultIntro: 'L’Apolobamba no és només paisatge. Caminem per un territori habitat, amb una cultura pròpia que mereix temps i respecte.',
      cult: [
        ['Els kallawayes', 'Charazani i Curva són el cor de la cultura kallawaya, coneguda arreu dels Andes pels seus remeiers itinerants i el seu saber sobre plantes medicinals. La UNESCO va inscriure la seva cosmovisió al patrimoni cultural immaterial de la humanitat.'],
        ['Les vicunyes d’Ulla Ulla', 'El dia del trasllat travessem l’altiplà d’Ulla Ulla. L’àrea es va protegir el 1972 per salvar la vicunya i avui forma part de l’Àrea Natural de Maneig Integrat Apolobamba, on les comunitats en gestionen la fibra.'],
        ['Passos i apachetes', 'Als colls trobarem apachetes: munts de pedres on els caminants deixen una ofrena i demanen permís a la muntanya. L’Akamani, que voregem el cinquè dia, és la muntanya sagrada dels kallawayes.']
      ],
      glossTitle: 'Cinc paraules per al camí',
      gloss: [['Apacheta', 'Munt de pedres en un coll, lloc d’ofrena.'], ['Pachamama', 'La Mare Terra.'], ['Achachila', 'Esperit protector que viu a la muntanya.'], ['Kallawaya', 'Poble i tradició de remeiers de la zona de Charazani.'], ['Jallalla', 'Exclamació aimara de celebració: «visca!».']],
      cultSources: 'Fonts',
      quizLabel: 'ÉS PER A MI?', quizTitle: 'Cinc preguntes per saber si aquest viatge t’encaixa.', quizStart: 'Fes el test', quizNext: 'Següent', quizAgain: 'Torna a començar', quizOf: 'de',
      quiz: [
        ['Quina experiència tens en travesses de diversos dies?', ['He fet diverses travesses de 4 dies o més', 'N’he fet alguna de 2–3 dies', 'Encara no n’he fet cap']],
        ['Com portes una jornada de 7–8 hores amb 1.000 m de desnivell?', ['Bé, i l’endemà puc tornar a caminar', 'L’acabo, però em costa recuperar', 'No ho he provat mai']],
        ['Has dormit en tenda amb fred?', ['Sí, sota zero', 'Sí, però amb bon temps', 'No']],
        ['Has estat mai per sobre dels 3.000 m?', ['Sí, i hi he dormit', 'Sí, de pas', 'No']],
        ['Com portes els canvis de plans i la vida senzilla de campament?', ['Formen part del viatge', 'M’adapto, tot i que em costa', 'Prefereixo saber-ho tot abans']]
      ],
      quizResults: [
        ['Encara no és el moment', 'Aquest viatge demana més rodatge. Comença per travesses de 3–4 dies al Pirineu amb nit en refugi o tenda, i torna a fer el test d’aquí a un temps.'],
        ['Hi pots arribar amb preparació', 'Tens una bona base. Amb el pla d’entrenament de 12 setmanes i alguna travessa més a l’esquena, hi arribaràs bé. En parlarem a la conversa prèvia.'],
        ['Aquest viatge t’encaixa', 'Tens l’experiència que demana la travessa. El següent pas és una conversa amb el guia per parlar de l’altitud i de les teves expectatives.']
      ],
      quizNote: 'Resultat orientatiu. No substitueix la conversa prèvia ni la revisió mèdica.', quizPlan: 'Pla d’entrenament',
      contactLabel: 'M’INTERESSA', contactTitle: 'Avisa’m quan s’obrin les reserves.', contactText: 'Escriu-nos per WhatsApp i t’avisarem quan hi hagi dates confirmades. Sense compromís.',
      fName: 'El teu nom', fExp: 'La teva experiència', fExpOpts: ['Travesses de 4 dies o més', 'Travesses de 2–3 dies', 'Sortides d’un dia'], fMsg: 'Algun comentari? (opcional)', fSend: 'Envia per WhatsApp',
      contactSoon: 'Aviat podràs escriure’ns per WhatsApp des d’aquí.', waText: 'Hola! M’interessa la travessa de l’Apolobamba.',
      stickyA: 'Veure el programa', stickyB: 'M’interessa', showMore: 'Mostra', offline: 'Aquesta web també funciona sense connexió un cop l’has oberta.'
    },
    es: {
      guideLabel: 'TU GUÍA', guideTitle: 'Quién te acompaña<br>en el camino.',
      guideName: 'Izan Pimentel Pérez',
      guideRole: 'Guía de montaña · Fundador de Andes Wild Trek',
      guideText: 'Guía de montaña formado como técnico deportivo en media montaña, con especialización en esquí de montaña y experiencia guiando grupos en el extranjero. Su montaña de cada día es el Pirineo; Apolobamba es el proyecto con el que quiere llevar esa manera de guiar a los Andes.',
      guidePoints: [['Formación', 'Técnico deportivo en media montaña (TD2)'], ['Terreno habitual', 'Pirineos y media montaña de toda España'], ['En Apolobamba', 'Siempre con un guía local habilitado']],
      guideQuote: '«Guiar es decidir bien y explicar por qué. La cumbre es que todo el mundo vuelva con ganas de repetir.»',
      guideCaption: 'En la cima del Monte Perdido, 3.355 m',
      altLabel: 'EL RECORRIDO', altTitle: 'Todo el camino,<br>punto a punto.',
      altIntro: 'Muévete por el mapa topográfico, elige un día o pasa el dedo por el perfil para seguir el camino. Las tiendas marcan dónde dormimos.',
      allDays: 'Todo', fit: 'Ver todo el recorrido', zoomIn: 'Acercar', zoomOut: 'Alejar', full: 'Pantalla completa', fullOff: 'Salir de pantalla completa', locate: '¿Dónde estoy?', locating: 'Buscando tu posición…', locFar: 'Estás a {0} km del recorrido.', locNear: 'Estás a {0} m del camino.', locErr: 'No se ha podido obtener la posición.', twoFingers: 'Usa dos dedos para mover el mapa', ctrlWheel: 'Usa Ctrl + rueda para hacer zoom', offlineTiles: 'Sin conexión: no se puede cargar el mapa de fondo, pero el trazado sí.', mapAria: 'Mapa topográfico interactivo del recorrido', onMap: 'Ver en el mapa',
      trackTitle: 'El track GPS', trackText: 'El trazado es un registro real del recorrido, grabado del 28 de junio al 1 de julio de 2012: 199 puntos, 24 waypoints y la hora de cada punto. Quien lo grabó hizo la travesía en cuatro días.', trackStats: [['53,4 km', 'de Pelechuco a Charazani'], ['+3.450 m', 'de desnivel positivo'], ['4 días', 'en 2012, sin grupo']], trackLink: 'Track de Gallotrekk en Wikiloc',
      profileAria: 'Perfil de altitud de la travesía', nightWord: 'Noche', dayWord: 'Día', kmWord: 'km desde Pelechuco', openMap: 'Ábrelo en el mapa topográfico',
      mapTitle: 'El recorrido', mapHint: 'Esquema con los puntos GPS del trazado. El norte está arriba.',
      cmpTitle: 'Para hacerte una idea', cmpText: 'El paso Sunchulli es más alto que el Mont Blanc, y dormiremos cinco noches por encima de los 4.000 m. Por eso el programa empieza con tres días de aclimatación.',
      cmp: [['Pica d’Estats', 3143, 0], ['Aneto', 3404, 0], ['La Paz · donde nos aclimatamos', 3650, 1], ['Campamento más alto', 4717, 1], ['Mont Blanc', 4806, 0], ['Paso Sunchulli', 5032, 2]],
      cultLabel: 'EL TERRITORIO', cultTitle: 'Un país de pastores,<br>curanderos y vicuñas.',
      cultIntro: 'Apolobamba no es solo paisaje. Caminamos por un territorio habitado, con una cultura propia que merece tiempo y respeto.',
      cult: [
        ['Los kallawayas', 'Charazani y Curva son el corazón de la cultura kallawaya, conocida en todos los Andes por sus curanderos itinerantes y su saber sobre plantas medicinales. La UNESCO inscribió su cosmovisión en el patrimonio cultural inmaterial de la humanidad.'],
        ['Las vicuñas de Ulla Ulla', 'El día del traslado cruzamos el altiplano de Ulla Ulla. La zona se protegió en 1972 para salvar la vicuña y hoy forma parte del Área Natural de Manejo Integrado Apolobamba, donde las comunidades gestionan su fibra.'],
        ['Pasos y apachetas', 'En los collados encontraremos apachetas: montones de piedras donde los caminantes dejan una ofrenda y piden permiso a la montaña. El Akamani, que bordeamos el quinto día, es la montaña sagrada de los kallawayas.']
      ],
      glossTitle: 'Cinco palabras para el camino',
      gloss: [['Apacheta', 'Montón de piedras en un collado, lugar de ofrenda.'], ['Pachamama', 'La Madre Tierra.'], ['Achachila', 'Espíritu protector que vive en la montaña.'], ['Kallawaya', 'Pueblo y tradición de curanderos de la zona de Charazani.'], ['Jallalla', 'Exclamación aimara de celebración: «¡viva!».']],
      cultSources: 'Fuentes',
      quizLabel: '¿ES PARA MÍ?', quizTitle: 'Cinco preguntas para saber si este viaje encaja contigo.', quizStart: 'Haz el test', quizNext: 'Siguiente', quizAgain: 'Volver a empezar', quizOf: 'de',
      quiz: [
        ['¿Qué experiencia tienes en travesías de varios días?', ['He hecho varias travesías de 4 días o más', 'He hecho alguna de 2–3 días', 'Todavía no he hecho ninguna']],
        ['¿Cómo llevas una jornada de 7–8 horas con 1.000 m de desnivel?', ['Bien, y al día siguiente puedo volver a caminar', 'La termino, pero me cuesta recuperar', 'Nunca lo he probado']],
        ['¿Has dormido en tienda con frío?', ['Sí, bajo cero', 'Sí, pero con buen tiempo', 'No']],
        ['¿Has estado alguna vez por encima de los 3.000 m?', ['Sí, y he dormido allí', 'Sí, de paso', 'No']],
        ['¿Cómo llevas los cambios de planes y la vida sencilla de campamento?', ['Forman parte del viaje', 'Me adapto, aunque me cuesta', 'Prefiero saberlo todo antes']]
      ],
      quizResults: [
        ['Todavía no es el momento', 'Este viaje pide más rodaje. Empieza por travesías de 3–4 días en el Pirineo con noche en refugio o tienda, y vuelve a hacer el test dentro de un tiempo.'],
        ['Puedes llegar con preparación', 'Tienes una buena base. Con el plan de entrenamiento de 12 semanas y alguna travesía más a la espalda, llegarás bien. Lo hablaremos en la conversación previa.'],
        ['Este viaje encaja contigo', 'Tienes la experiencia que pide la travesía. El siguiente paso es una conversación con el guía para hablar de la altitud y de tus expectativas.']
      ],
      quizNote: 'Resultado orientativo. No sustituye la conversación previa ni la revisión médica.', quizPlan: 'Plan de entrenamiento',
      contactLabel: 'ME INTERESA', contactTitle: 'Avísame cuando se abran las reservas.', contactText: 'Escríbenos por WhatsApp y te avisaremos cuando haya fechas confirmadas. Sin compromiso.',
      fName: 'Tu nombre', fExp: 'Tu experiencia', fExpOpts: ['Travesías de 4 días o más', 'Travesías de 2–3 días', 'Salidas de un día'], fMsg: '¿Algún comentario? (opcional)', fSend: 'Enviar por WhatsApp',
      contactSoon: 'Pronto podrás escribirnos por WhatsApp desde aquí.', waText: '¡Hola! Me interesa la travesía de Apolobamba.',
      stickyA: 'Ver el programa', stickyB: 'Me interesa', showMore: 'Mostrar', offline: 'Esta web también funciona sin conexión una vez la has abierto.'
    }
  };

  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const km = n => n.toFixed(1).replace('.', ',');
  const tent = (x, y) => `<path d="M${x - 7} ${y + 6} L${x} ${y - 7} L${x + 7} ${y + 6} Z M${x} ${y - 7} L${x} ${y + 6}" fill="#e5c98d" stroke="#163e33" stroke-width="1.4" stroke-linejoin="round"/>`;

  /* ---------- Track i punts ---------- */
  const TR = window.TRACK, PTS = TR.pts, CUT = TR.cut, TOT = PTS[PTS.length - 1][3];
  const R2D = 180 / Math.PI;
  function projKm(ll) { // km sobre el track del punt més proper (projecció plana local)
    const c = Math.cos(ll[0] / R2D); let best = [1e9, 0];
    for (let i = 0; i < PTS.length - 1; i++) {
      const ax = PTS[i][1] * c, ay = PTS[i][0], bx = PTS[i + 1][1] * c, by = PTS[i + 1][0], px = ll[1] * c, py = ll[0];
      const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy, f = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)) : 0;
      const ex = ax + dx * f - px, ey = ay + dy * f - py, d = ex * ex + ey * ey;
      if (d < best[0]) best = [d, PTS[i][3] + (PTS[i + 1][3] - PTS[i][3]) * f];
    }
    return best[1];
  }
  function atKm(k) { // posició interpolada al km k
    k = Math.max(0, Math.min(TOT, k)); let i = 1; while (i < PTS.length - 1 && PTS[i][3] < k) i++;
    const a = PTS[i - 1], b = PTS[i], f = b[3] > a[3] ? (k - a[3]) / (b[3] - a[3]) : 0;
    const st = CUT.findIndex((c, j) => j > 0 && i <= c) - 1;
    return { lat: a[0] + (b[0] - a[0]) * f, lon: a[1] + (b[1] - a[1]) * f, ele: a[2] + (b[2] - a[2]) * f, km: k, stage: Math.max(0, st) };
  }
  const stageRange = i => [PTS[CUT[i]][3], PTS[CUT[i + 1]][3]];
  function points(L) {
    const out = [];
    window.DAYS.forEach((d, di) => d.points.forEach((p, pi) => {
      if (di > 0 && pi === 0) return;
      out.push({ name: p[L], ele: p.ele, km: projKm(p.ll), day: d.day, stage: di, time: p.time, night: pi === d.points.length - 1, ll: p.ll });
    }));
    out[0].start = true; return out;
  }
  function distM(a, b) { const p1 = a[0] / R2D, p2 = b[0] / R2D, dl = (b[1] - a[1]) / R2D, h = Math.sin((p2 - p1) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2; return 12742018 * Math.asin(Math.sqrt(h)); }

  /* ---------- Perfil d'altitud ---------- */
  const PW = 1000, PH = 300, PL = 50, PR = 14, PT = 22, PB = 40, LO = 2900, HI = 5200;
  const pX = k => PL + (PW - PL - PR) * k / TOT, pY = e => PT + (PH - PT - PB) * (1 - (e - LO) / (HI - LO));
  function profile(L) {
    const t = T[L], P = points(L);
    const line = PTS.map(p => `${pX(p[3]).toFixed(1)},${pY(p[2]).toFixed(1)}`).join(' ');
    const grid = [3000, 3500, 4000, 4500, 5000].map(e => `<line x1="${PL}" x2="${PW - PR}" y1="${pY(e)}" y2="${pY(e)}" stroke="#163e33" stroke-opacity=".12"/><text x="${PL - 7}" y="${pY(e) + 4}" text-anchor="end" font-size="12" fill="#5b6b64">${fmt(e)}</text>`).join('');
    const bands = window.DAYS.map((d, i) => { const [k0, k1] = stageRange(i); return `<rect class="band" data-band="${i}" x="${pX(k0)}" y="${PT}" width="${pX(k1) - pX(k0)}" height="${PH - PT - PB}" fill="#163e33" fill-opacity="${i % 2 ? .05 : 0}"/><text x="${(pX(k0) + pX(k1)) / 2}" y="${PH - 12}" text-anchor="middle" font-size="12" font-weight="600" fill="#163e33">${t.dayWord} ${d.day}</text>`; }).join('');
    const dots = P.map((p, i) => `<g class="pt" data-pt="${i}" tabindex="0" role="button" aria-label="${p.name}, ${fmt(p.ele)} m">${p.night ? tent(pX(p.km), pY(p.ele) - 2) : `<circle cx="${pX(p.km)}" cy="${pY(p.ele)}" r="4.5" fill="#fffefa" stroke="#163e33" stroke-width="2"/>`}<circle cx="${pX(p.km)}" cy="${pY(p.ele)}" r="16" fill="transparent"/></g>`).join('');
    return `<svg class="profile" id="profile" viewBox="0 0 ${PW} ${PH}" role="img" aria-label="${t.profileAria}">${bands}${grid}<polygon points="${pX(0)},${PH - PB} ${line} ${pX(TOT)},${PH - PB}" fill="#163e33" fill-opacity=".13"/><polyline points="${line}" fill="none" stroke="#163e33" stroke-width="2.2" stroke-linejoin="round"/><g id="pf-cursor" visibility="hidden"><line y1="${PT}" y2="${PH - PB}" stroke="#c9a45c" stroke-width="1.5"/><circle r="5.5" fill="#c9a45c" stroke="#fff" stroke-width="2"/></g>${dots}</svg><div class="pt-card" id="pt-card" aria-live="polite"></div>`;
  }

  /* ---------- Mapa topogràfic (OpenTopoMap) ---------- */
  const TS = 256, ZMIN = 10, ZMAX = 16;
  const wx = lon => (lon + 180) / 360 * TS;
  const wy = lat => { const s = Math.sin(lat / R2D); return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * TS; };
  const unx = x => x / TS * 360 - 180, uny = y => { const n = Math.PI - 2 * Math.PI * y / TS; return R2D * Math.atan(Math.sinh(n)); };
  const WPTS = PTS.map(p => [wx(p[1]), wy(p[0])]);
  function TileMap(root, L) {
    const t = T[L], pane = document.createElement('div'), svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'), tip = document.createElement('div'), toast = document.createElement('div');
    pane.className = 'tmap-pane'; svg.setAttribute('class', 'tmap-svg'); tip.className = 'tmap-tip'; toast.className = 'tmap-toast';
    root.prepend(pane, svg); root.append(tip, toast);
    const tiles = new Map(); let cx = 0, cy = 0, z = 12, raf = 0, sel = -1, hover = null, you = null, errs = 0, okTiles = 0, toastT = 0;
    const P = points(L), W = () => root.clientWidth, H = () => root.clientHeight;
    const toPx = (x, y) => [(x - cx) * 2 ** z + W() / 2, (y - cy) * 2 ** z + H() / 2];
    function say(msg, ms = 2200) { toast.textContent = msg; toast.classList.add('on'); clearTimeout(toastT); if (ms) toastT = setTimeout(() => toast.classList.remove('on'), ms); }
    function draw() {
      raf = 0; const w = W(), h = H(); if (!w) return;
      const tz = Math.max(ZMIN, Math.min(17, Math.round(z))), sc = 2 ** (z - tz), n = 2 ** tz, ccx = cx * n, ccy = cy * n;
      const x0 = Math.floor((ccx - w / 2 / sc) / TS), x1 = Math.floor((ccx + w / 2 / sc) / TS), y0 = Math.max(0, Math.floor((ccy - h / 2 / sc) / TS)), y1 = Math.min(n - 1, Math.floor((ccy + h / 2 / sc) / TS));
      const want = new Set();
      for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) {
        const key = `${tz}/${x}/${y}`; want.add(key); let im = tiles.get(key);
        if (!im) {
          im = new Image(); im.alt = ''; im.decoding = 'async'; im.draggable = false;
          im.onload = () => { im.classList.add('ok'); okTiles++; }; im.onerror = () => { im.classList.add('err'); if (++errs === 6 && !okTiles) say(t.offlineTiles, 0); };
          im.src = `https://${'abc'[(x + y) % 3]}.tile.opentopomap.org/${tz}/${x}/${y}.png`; tiles.set(key, im); pane.appendChild(im);
        }
        const s = TS * sc; im.style.cssText = `left:${((x * TS - ccx) * sc + w / 2).toFixed(1)}px;top:${((y * TS - ccy) * sc + h / 2).toFixed(1)}px;width:${(s + .5).toFixed(1)}px;height:${(s + .5).toFixed(1)}px`;
      }
      tiles.forEach((im, key) => { if (!want.has(key)) { if (key.startsWith(tz + '/') || im.complete) { im.remove(); tiles.delete(key); } } });
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('width', w); svg.setAttribute('height', h);
      const seg = (a, b) => WPTS.slice(a, b + 1).map(p => toPx(p[0], p[1]).map(v => v.toFixed(1)).join(',')).join(' ');
      let o = `<polyline points="${seg(0, PTS.length - 1)}" class="trk-halo"/><polyline points="${seg(0, PTS.length - 1)}" class="trk ${sel >= 0 ? 'dim' : ''}"/>`;
      if (sel >= 0) o += `<polyline points="${seg(CUT[sel], CUT[sel + 1])}" class="trk-halo"/><polyline points="${seg(CUT[sel], CUT[sel + 1])}" class="trk on"/>`;
      P.forEach((p, i) => {
        const [x, y] = toPx(wx(p.ll[1]), wy(p.ll[0])); if (x < -40 || y < -40 || x > w + 40 || y > h + 40) return;
        const big = p.night || p.start, lab = big && (z >= 11.5 || sel === p.stage || (p.stage === sel + 1 && p.start));
        o += `<g class="mk${big ? ' big' : ''}" data-pt="${i}">${p.night ? tent(x, y - 2) : `<circle cx="${x}" cy="${y}" r="${big ? 6.5 : 4.5}"/>`}${lab ? `<text x="${x + 11}" y="${y + 4}">${p.name}</text>` : ''}<circle cx="${x}" cy="${y}" r="15" fill="transparent"/></g>`;
      });
      if (hover) { const [x, y] = toPx(wx(hover.lon), wy(hover.lat)); o += `<circle cx="${x}" cy="${y}" r="9" class="hov"/>`; }
      if (you) { const [x, y] = toPx(wx(you[1]), wy(you[0])); o += `<circle cx="${x}" cy="${y}" r="16" class="you-halo"/><circle cx="${x}" cy="${y}" r="7" class="you"/>`; }
      svg.innerHTML = o;
    }
    const req = () => { if (!raf) raf = requestAnimationFrame(draw); };
    function setView(x, y, zz) { cx = x; cy = y; z = Math.max(ZMIN, Math.min(ZMAX, zz)); req(); }
    function zoomAt(nz, px, py) { nz = Math.max(ZMIN, Math.min(ZMAX, nz)); const k = 2 ** z, k2 = 2 ** nz, dx = px - W() / 2, dy = py - H() / 2; cx += dx / k - dx / k2; cy += dy / k - dy / k2; z = nz; req(); }
    let anim = 0;
    function flyTo(x, y, zz) { cancelAnimationFrame(anim); const s = [cx, cy, z], e = [x, y, Math.max(ZMIN, Math.min(ZMAX, zz))], t0 = performance.now();
      const step = now => { const f = Math.min(1, (now - t0) / 450), g = f < .5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2; setView(s[0] + (e[0] - s[0]) * g, s[1] + (e[1] - s[1]) * g, s[2] + (e[2] - s[2]) * g); if (f < 1) anim = requestAnimationFrame(step); };
      anim = requestAnimationFrame(step); }
    function fit(i0 = 0, i1 = PTS.length - 1, fly = true) {
      const xs = WPTS.slice(i0, i1 + 1).map(p => p[0]), ys = WPTS.slice(i0, i1 + 1).map(p => p[1]);
      const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);
      const zz = Math.log2(Math.min((W() - 60) / ((maxx - minx) || 1e-6), (H() - 70) / ((maxy - miny) || 1e-6)));
      (fly ? flyTo : setView)((minx + maxx) / 2, (miny + maxy) / 2, Math.min(15, zz));
    }
    // Gestos
    const ptrs = new Map(); let g0 = null; const full = () => root.closest('.tmap-wrap').classList.contains('full');
    root.addEventListener('pointerdown', e => {
      if (e.target.closest('button,a,.tmap-tip')) return;
      ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      if (e.pointerType === 'touch' && !full() && ptrs.size === 1) { g0 = null; return; }
      root.setPointerCapture(e.pointerId); start(); });
    function start() { const v = [...ptrs.values()], r = root.getBoundingClientRect();
      if (v.length >= 2) { const m = [(v[0][0] + v[1][0]) / 2 - r.left, (v[0][1] + v[1][1]) / 2 - r.top]; g0 = { two: true, d: Math.hypot(v[0][0] - v[1][0], v[0][1] - v[1][1]), z, wx: cx + (m[0] - W() / 2) / 2 ** z, wy: cy + (m[1] - H() / 2) / 2 ** z }; }
      else if (v.length === 1) g0 = { two: false, x: v[0][0], y: v[0][1], cx, cy, moved: 0 }; }
    root.addEventListener('pointermove', e => {
      if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      if (e.pointerType === 'touch' && !full() && ptrs.size === 1) { if (!g0) say(t.twoFingers); return; }
      if (!g0) start(); const v = [...ptrs.values()], r = root.getBoundingClientRect();
      if (g0.two && v.length >= 2) { const m = [(v[0][0] + v[1][0]) / 2 - r.left, (v[0][1] + v[1][1]) / 2 - r.top], nz = Math.max(ZMIN, Math.min(ZMAX, g0.z + Math.log2(Math.hypot(v[0][0] - v[1][0], v[0][1] - v[1][1]) / g0.d))); setView(g0.wx - (m[0] - W() / 2) / 2 ** nz, g0.wy - (m[1] - H() / 2) / 2 ** nz, nz); }
      else if (!g0.two) { const dx = e.clientX - g0.x, dy = e.clientY - g0.y; g0.moved = Math.max(g0.moved, Math.abs(dx) + Math.abs(dy)); setView(g0.cx - dx / 2 ** z, g0.cy - dy / 2 ** z, z); root.classList.add('drag'); }
    });
    const end = e => { const wasTap = g0 && !g0.two && g0.moved < 6; ptrs.delete(e.pointerId); root.classList.remove('drag'); g0 = null; if (ptrs.size) start(); if (wasTap && e.type === 'pointerup') tap(e); };
    root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
    function tap(e) { const m = document.elementFromPoint(e.clientX, e.clientY)?.closest('.mk'); if (m) api.onPick(Number(m.dataset.pt)); }
    root.addEventListener('click', e => { const m = e.target.closest('.mk'); if (m) api.onPick(Number(m.dataset.pt)); });
    root.addEventListener('wheel', e => { if (!(e.ctrlKey || e.metaKey || full())) { say(t.ctrlWheel); return; } e.preventDefault(); const r = root.getBoundingClientRect(); zoomAt(z - e.deltaY * (e.deltaMode ? .05 : .0022), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    root.addEventListener('dblclick', e => { const r = root.getBoundingClientRect(); zoomAt(Math.round(z) + 1, e.clientX - r.left, e.clientY - r.top); });
    root.addEventListener('keydown', e => { const k = { ArrowLeft: [-80, 0], ArrowRight: [80, 0], ArrowUp: [0, -80], ArrowDown: [0, 80] }[e.key];
      if (k) { e.preventDefault(); setView(cx + k[0] / 2 ** z, cy + k[1] / 2 ** z, z); } else if (e.key === '+' || e.key === '=') zoomAt(z + 1, W() / 2, H() / 2); else if (e.key === '-') zoomAt(z - 1, W() / 2, H() / 2); });
    if ('ResizeObserver' in window) new ResizeObserver(req).observe(root);
    const api = {
      fit, req, onPick: () => {},
      zoom: d => zoomAt(Math.round(z) + d, W() / 2, H() / 2),
      select(i) { sel = i; if (i < 0) fit(); else fit(CUT[i], CUT[i + 1]); },
      hover(p) { hover = p; req(); },
      show(p) { tip.innerHTML = p ? `<b>${p.name}</b>${fmt(p.ele)} m · ${t.dayWord} ${p.day}${p.night ? ' · ' + t.nightWord : ''}` : ''; tip.classList.toggle('on', !!p);
        if (p) { const [x, y] = toPx(wx(p.ll[1]), wy(p.ll[0])); if (x < 40 || y < 40 || x > W() - 40 || y > H() - 40) flyTo(wx(p.ll[1]), wy(p.ll[0]), Math.max(z, 13)); } },
      locate() {
        if (!navigator.geolocation) return say(t.locErr); say(t.locating, 0);
        navigator.geolocation.getCurrentPosition(pos => {
          you = [pos.coords.latitude, pos.coords.longitude]; let d = 1e12; PTS.forEach(p => d = Math.min(d, distM(you, p)));
          if (d > 5000) { say(t.locFar.replace('{0}', fmt(d / 1000)), 4000); req(); } else { say(t.locNear.replace('{0}', fmt(d)), 4000); flyTo(wx(you[1]), wy(you[0]), 14); }
        }, () => say(t.locErr, 3000), { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
      }
    };
    requestAnimationFrame(() => fit(0, PTS.length - 1, false));
    return api;
  }
  function mapBlock(L) {
    const t = T[L];
    return `<div class="tmap-wrap" id="tmap-wrap"><div class="day-chips" role="tablist" aria-label="${t.dayWord}"><button type="button" class="on" data-day="-1">${t.allDays}</button>${window.DAYS.map((d, i) => `<button type="button" data-day="${i}">${t.dayWord} ${d.day}</button>`).join('')}</div>
<div class="tmap" id="tmap" tabindex="0" role="application" aria-label="${t.mapAria}"><div class="tmap-ctl"><button type="button" data-act="in" aria-label="${t.zoomIn}">+</button><button type="button" data-act="out" aria-label="${t.zoomOut}">−</button><button type="button" data-act="fit" aria-label="${t.fit}" title="${t.fit}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M7.5 16.5c2-1 1-5 4.5-5s2.5-3.5 4.5-4.5" stroke-dasharray="2 2"/></svg></button><button type="button" data-act="full" aria-label="${t.full}" title="${t.full}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg></button><button type="button" data-act="loc" aria-label="${t.locate}" title="${t.locate}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg></button></div>
<p class="tmap-attr">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · SRTM · <a href="https://opentopomap.org/about" target="_blank" rel="noopener">OpenTopoMap</a> (CC-BY-SA) · Track: <a href="${TR.src}" target="_blank" rel="noopener">Gallotrekk / Wikiloc</a></p></div>${profile(L)}</div>`;
  }
  function trackCard(L) {
    const t = T[L];
    return `<div class="track-card"><h3>${t.trackTitle}</h3><p>${t.trackText}</p><dl>${t.trackStats.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><a href="${TR.src}" target="_blank" rel="noopener">${t.trackLink} ↗</a></div>`;
  }

  function compare(L) {
    const t = T[L], max = 5200;
    return `<div class="cmp-card"><h3>${t.cmpTitle}</h3><p>${t.cmpText}</p><ul class="cmp">${t.cmp.map(([n, e, k]) => `<li class="k${k}"><span>${n}</span><div><i style="width:${(e / max * 100).toFixed(1)}%"></i></div><b>${fmt(e)} m</b></li>`).join('')}</ul></div>`;
  }

  const X = {
    altitude(L) { const t = T[L]; return `<section class="section alt-section" id="altitud"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">${t.altLabel}</p><h2>${t.altTitle}</h2></div><p class="section-intro">${t.altIntro}</p></div>${mapBlock(L)}<div class="alt-grid">${trackCard(L)}${compare(L)}</div></div></section>`; },
    culture(L) { const t = T[L]; return `<section class="section wrap culture" id="territori"><div class="section-heading"><div><p class="eyebrow">${t.cultLabel}</p><h2>${t.cultTitle}</h2></div><p class="section-intro">${t.cultIntro}</p></div><div class="cult-grid">${t.cult.map(([h, b], i) => `<article><span>0${i + 1}</span><h3>${h}</h3><p>${b}</p></article>`).join('')}</div><details class="gloss"><summary>${t.glossTitle}<b aria-hidden="true">+</b></summary><dl>${t.gloss.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl></details><p class="cult-src">${t.cultSources}: <a href="https://ich.unesco.org/en/RL/andean-cosmovision-of-the-kallawaya-00048" target="_blank" rel="noopener">UNESCO</a> · <a href="https://bolivia.wcs.org/en-us/Landscapes/Madidi-Tambopata/Apolobamba.aspx" target="_blank" rel="noopener">WCS Bolivia</a></p></section>`; },
    guide(L) { const t = T[L]; return `<section class="section guide-section" id="guia"><div class="wrap guide-grid"><figure><img src="assets/guia.webp" alt="${t.guideName}. ${t.guideCaption}" width="900" height="1303" loading="lazy"><figcaption>${t.guideCaption}</figcaption></figure><div><p class="eyebrow">${t.guideLabel}</p><h2>${t.guideTitle}</h2><p class="guide-name">${t.guideName}</p><p class="guide-role">${t.guideRole}</p><p>${t.guideText}</p><dl class="guide-points">${t.guidePoints.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><blockquote>${t.guideQuote}</blockquote></div></div></section>`; },
    quiz(L) { const t = T[L]; return `<aside class="quiz" id="test"><div class="quiz-head"><p class="eyebrow">${t.quizLabel}</p><h3>${t.quizTitle}</h3></div><div class="quiz-body" id="quiz-body"><button type="button" class="button button-forest" id="quiz-start">${t.quizStart}</button></div></aside>`; },
    contact(L) {
      const t = T[L], on = !!CONTACT.whatsapp;
      return `<div class="contact" id="contacte"><p class="eyebrow">${t.contactLabel}</p><h3>${t.contactTitle}</h3>${on ? `<p>${t.contactText}</p><form id="contact-form" class="contact-form"><label>${t.fName}<input name="n" autocomplete="name" required></label><label>${t.fExp}<select name="e">${t.fExpOpts.map(o => `<option>${o}</option>`).join('')}</select></label><label class="wide">${t.fMsg}<textarea name="m" rows="2"></textarea></label><button class="button button-forest" type="submit">${t.fSend}</button></form>` : `<p>${t.contactSoon}</p>`}</div>`;
    },
    sticky(L) { const t = T[L]; return `<div class="sticky-cta" id="sticky-cta"><a href="#programa">${t.stickyA}</a><a class="primary" href="#contacte">${t.stickyB}</a></div>`; },
    bind(L, docs) {
      const t = T[L], P = points(L), card = document.getElementById('pt-card'), mapEl = document.getElementById('tmap'), prof = document.getElementById('profile');
      if (card && mapEl && prof) {
        const map = TileMap(mapEl, L), wrap = document.getElementById('tmap-wrap'), cur = document.getElementById('pf-cursor');
        const ptCard = p => `<div><strong>${p.name}</strong><span>${t.dayWord} ${p.day}${p.night ? ' · ' + t.nightWord : ''}</span></div><dl><div><dt>m</dt><dd>${fmt(p.ele)}</dd></div><div><dt>${t.kmWord}</dt><dd>${km(p.km)}</dd></div><div><dt>h</dt><dd>${p.time}</dd></div></dl><a href="https://opentopomap.org/#marker=15/${p.ll[0]}/${p.ll[1]}" target="_blank" rel="noopener">${t.openMap} ↗</a>`;
        function show(i, move = true) { const p = P[i]; prof.querySelectorAll('.pt').forEach(g => g.classList.toggle('on', Number(g.dataset.pt) === i)); card.innerHTML = ptCard(p); setCur(p.km); map.hover(null); if (move) map.show(p); }
        function setCur(k) { cur.setAttribute('visibility', 'visible'); cur.querySelector('line').setAttribute('x1', pX(k)); cur.querySelector('line').setAttribute('x2', pX(k)); const c = cur.querySelector('circle'); c.setAttribute('cx', pX(k)); c.setAttribute('cy', pY(atKm(k).ele)); }
        map.onPick = i => show(i);
        prof.querySelectorAll('.pt').forEach(g => { const go = () => show(Number(g.dataset.pt)); g.addEventListener('click', go); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
        const scrub = e => { if (e.target.closest('.pt')) return; const r = prof.getBoundingClientRect(), k = ((e.clientX - r.left) / r.width * PW - PL) / (PW - PL - PR) * TOT; if (k < 0 || k > TOT) return;
          const a = atKm(k), near = P.reduce((b, p, i) => Math.abs(p.km - k) < Math.abs(P[b].km - k) ? i : b, 0);
          setCur(k); map.hover(a); map.show(null);
          if (Math.abs(P[near].km - k) < .25) { card.innerHTML = ptCard(P[near]); prof.querySelectorAll('.pt').forEach(g => g.classList.toggle('on', Number(g.dataset.pt) === near)); }
          else card.innerHTML = `<div><strong>${t.dayWord} ${window.DAYS[a.stage].day}</strong><span>${window.COPY[L].stageNames[a.stage]}</span></div><dl><div><dt>m</dt><dd>${fmt(a.ele)}</dd></div><div><dt>${t.kmWord}</dt><dd>${km(k)}</dd></div></dl>`; };
        prof.addEventListener('pointermove', scrub); prof.addEventListener('pointerdown', scrub);
        const chips = [...wrap.querySelectorAll('[data-day]')];
        const pick = i => { chips.forEach(c => c.classList.toggle('on', Number(c.dataset.day) === i)); prof.querySelectorAll('.band').forEach((b, j) => b.setAttribute('fill-opacity', i < 0 ? (j % 2 ? .05 : 0) : (j === i ? .16 : 0))); map.select(i); };
        chips.forEach(c => c.addEventListener('click', () => pick(Number(c.dataset.day))));
        X.pickDay = i => { pick(i); document.getElementById('altitud').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
        const setFull = on => { wrap.classList.toggle('full', on); document.body.classList.toggle('map-full', on); const b = mapEl.querySelector('[data-act=full]'); b.setAttribute('aria-label', on ? t.fullOff : t.full); b.title = on ? t.fullOff : t.full; setTimeout(() => map.fit(...(wrap.querySelector('.day-chips .on').dataset.day >= 0 ? [CUT[+wrap.querySelector('.day-chips .on').dataset.day], CUT[+wrap.querySelector('.day-chips .on').dataset.day + 1]] : [])), 60); };
        mapEl.querySelector('.tmap-ctl').addEventListener('click', e => { const a = e.target.closest('[data-act]')?.dataset.act; if (a === 'in') map.zoom(1); else if (a === 'out') map.zoom(-1); else if (a === 'fit') pick(-1); else if (a === 'full') setFull(!wrap.classList.contains('full')); else if (a === 'loc') map.locate(); });
        X.escFull = () => { if (wrap.classList.contains('full')) setFull(false); };
        show(P.findIndex(p => p.ele === Math.max(...P.map(q => q.ele))), false);
      }
      if (!X._once) { X._once = true; document.addEventListener('click', e => { const a = e.target.closest('[data-mapday]'); if (a && X.pickDay) { e.preventDefault(); X.pickDay(Number(a.dataset.mapday)); } }); document.addEventListener('keydown', e => { if (e.key === 'Escape' && X.escFull) X.escFull(); }); }
      // Test
      const body = document.getElementById('quiz-body');
      if (body) {
        let step = 0, score = 0;
        const ask = () => { const [q, opts] = t.quiz[step]; body.innerHTML = `<p class="quiz-step">${step + 1} ${t.quizOf} ${t.quiz.length}</p><p class="quiz-q">${q}</p><div class="quiz-opts">${opts.map((o, i) => `<button type="button" data-s="${2 - i}">${o}</button>`).join('')}</div>`; body.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => { score += Number(b.dataset.s); step++; step < t.quiz.length ? ask() : end(); })); };
        const end = () => { const r = score >= 8 ? 2 : score >= 5 ? 1 : 0; body.innerHTML = `<p class="quiz-res r${r}">${t.quizResults[r][0]}</p><p>${t.quizResults[r][1]}</p><p class="quiz-note">${t.quizNote}</p><div class="quiz-end"><a class="button button-forest" href="${docs[2]}" target="_blank" rel="noopener">${t.quizPlan} ↗</a><button type="button" id="quiz-again">${t.quizAgain}</button></div>`; document.getElementById('quiz-again').addEventListener('click', () => { step = 0; score = 0; ask(); }); };
        document.getElementById('quiz-start').addEventListener('click', ask);
      }
      // Contacte
      const form = document.getElementById('contact-form');
      if (form) form.addEventListener('submit', e => { e.preventDefault(); const f = new FormData(form); const msg = `${t.waText}\n${t.fName}: ${f.get('n')}\n${t.fExp}: ${f.get('e')}${f.get('m') ? '\n' + f.get('m') : ''}`; window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener'); });
      // Plegables al mòbil
      if (window.matchMedia('(max-width:800px)').matches) {
        document.querySelectorAll('.method-steps article, .gear-grid fieldset').forEach((el, i) => {
          const head = el.querySelector('h3, legend'); if (!head) return;
          if (i > 0 || el.tagName === 'FIELDSET') el.classList.add('folded');
          el.classList.add('foldable'); head.setAttribute('role', 'button'); head.tabIndex = 0;
          const tog = () => el.classList.toggle('folded');
          head.addEventListener('click', tog); head.addEventListener('keydown', e => { if (e.key === 'Enter') tog(); });
        });
      }
      // Barra fixa al mòbil
      const bar = document.getElementById('sticky-cta'), hero = document.getElementById('top'), end = document.getElementById('contacte');
      if (bar && hero && 'IntersectionObserver' in window) {
        const seen = new Set();
        const io = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)); bar.classList.toggle('show', seen.size === 0); }, { threshold: .05 });
        io.observe(hero); if (end) io.observe(end);
      }
    }
  };
  window.AWT_X = X;
})();
