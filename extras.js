/* Seccions afegides a la web del client: guia, altitud interactiva, territori, test i contacte. */
(() => {
  'use strict';
  // Contacte: escriu aquí el número de WhatsApp amb prefix i sense espais ni «+» (exemple: '34600111222').
  const CONTACT = { whatsapp: '' };

  const COORDS = [
    [[-14.820099,-69.070910],[-14.856747,-69.053726],[-14.867584,-69.045993],[-14.873787,-69.040822],[-14.893571,-69.042847]],
    [[-14.893571,-69.042847],[-14.925510,-69.029556]],
    [[-14.925510,-69.029556],[-14.960194,-69.022270],[-14.989190,-69.005371],[-14.997061,-68.997171],[-15.007856,-68.988429]],
    [[-15.007856,-68.988429],[-15.012278,-68.967291],[-15.038859,-68.962776],[-15.041128,-68.964903],[-15.044558,-68.965558],[-15.046389,-68.967301],[-15.048861,-68.973660],[-15.049699,-68.974377]],
    [[-15.049699,-68.974377],[-15.061215,-68.990457],[-15.065097,-68.993473],[-15.073298,-68.998971]],
    [[-15.073298,-68.998971],[-15.125738,-69.003733],[-15.140405,-68.999704],[-15.163465,-68.988890],[-15.176465,-68.995942]]
  ];

  const T = {
    ca: {
      guideLabel: 'EL TEU GUIA', guideTitle: 'Qui t’acompanya<br>pel camí.',
      guideName: 'Izan Pimentel Pérez',
      guideRole: 'Guia de muntanya · Fundador d’Andes Wild Trek',
      guideText: 'Guia de muntanya format com a tècnic esportiu en mitja muntanya, amb especialització en esquí de muntanya i experiència guiant grups a l’estranger. La seva muntanya de cada dia és el Pirineu; l’Apolobamba és el projecte amb què vol portar aquesta manera de guiar als Andes.',
      guidePoints: [['Formació', 'Tècnic esportiu en mitja muntanya (TD2)'], ['Terreny habitual', 'Pirineus i mitja muntanya de tot l’Estat'], ['A l’Apolobamba', 'Sempre amb un guia local habilitat']],
      guideQuote: '«Guiar és decidir bé i explicar per què. El cim és que tothom torni amb ganes de tornar-hi.»',
      guideCaption: 'Al cim del Mont Perdut, 3.355 m',
      altLabel: 'LA TRAVESSA EN ALTITUD', altTitle: 'Tot el camí,<br>punt a punt.',
      altIntro: 'Toca qualsevol punt del perfil per veure’n l’altitud, el dia i l’hora prevista. Les tendes marquen on dormim.',
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
      altLabel: 'LA TRAVESÍA EN ALTITUD', altTitle: 'Todo el camino,<br>punto a punto.',
      altIntro: 'Toca cualquier punto del perfil para ver su altitud, el día y la hora prevista. Las tiendas marcan dónde dormimos.',
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

  function points(L) {
    const out = []; let base = 0;
    window.DAYS.forEach((d, di) => {
      d.points.forEach((p, pi) => {
        if (di > 0 && pi === 0) return;
        const last = pi === d.points.length - 1;
        out.push({ name: p[L], ele: p.ele, km: base + p.km, day: d.day, stage: di, time: p.time, night: last, ll: COORDS[di][pi] });
      });
      base += d.points[d.points.length - 1].km;
    });
    out[0].start = true;
    return out;
  }

  function profile(L) {
    const t = T[L], P = points(L), W = 1000, H = 330, l = 54, r = 20, top = 26, bot = 46;
    const tot = P[P.length - 1].km, lo = 2800, hi = 5200;
    const X = k => l + (W - l - r) * k / tot, Y = e => top + (H - top - bot) * (1 - (e - lo) / (hi - lo));
    const line = P.map(p => `${X(p.km).toFixed(1)},${Y(p.ele).toFixed(1)}`).join(' ');
    const grid = [3000, 3500, 4000, 4500, 5000].map(e => `<line x1="${l}" x2="${W - r}" y1="${Y(e)}" y2="${Y(e)}" stroke="#163e33" stroke-opacity=".12"/><text x="${l - 8}" y="${Y(e) + 4}" text-anchor="end" font-size="12" fill="#5b6b64">${fmt(e)}</text>`).join('');
    const bands = window.DAYS.map((d, i) => { const a = P.filter(p => p.stage === i); const x0 = i === 0 ? X(0) : X(P.filter(p => p.stage === i - 1).slice(-1)[0].km), x1 = X(a[a.length - 1].km); return `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${H - top - bot}" fill="#163e33" fill-opacity="${i % 2 ? .05 : 0}"/><text x="${(x0 + x1) / 2}" y="${H - 14}" text-anchor="middle" font-size="12" font-weight="600" fill="#163e33">${t.dayWord} ${d.day}</text>`; }).join('');
    const dots = P.map((p, i) => `<g class="pt" data-pt="${i}" tabindex="0" role="button" aria-label="${p.name}, ${fmt(p.ele)} m">${p.night ? tent(X(p.km), Y(p.ele) - 2) : `<circle cx="${X(p.km)}" cy="${Y(p.ele)}" r="5" fill="#fffefa" stroke="#163e33" stroke-width="2"/>`}<circle cx="${X(p.km)}" cy="${Y(p.ele)}" r="17" fill="transparent"/></g>`).join('');
    return `<div class="profile-scroll"><svg class="profile" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t.profileAria}">${bands}${grid}<polygon points="${X(0)},${H - bot} ${line} ${X(tot)},${H - bot}" fill="#163e33" fill-opacity=".13"/><polyline points="${line}" fill="none" stroke="#163e33" stroke-width="2.5" stroke-linejoin="round"/>${dots}</svg></div><div class="pt-card" id="pt-card" aria-live="polite"></div>`;
  }

  function routeMap(L) {
    const t = T[L], P = points(L), lat = P.map(p => p.ll[0]), lon = P.map(p => p.ll[1]);
    const la0 = Math.max(...lat), la1 = Math.min(...lat), lo0 = Math.min(...lon), lo1 = Math.max(...lon), c = Math.cos(15 * Math.PI / 180);
    const Hh = 560, sc = (Hh - 40) / (la0 - la1), X = o => 26 + (o - lo0) * c * sc, Y = a => 20 + (la0 - a) * sc, Ww = X(lo1) + 190;
    const line = P.map(p => `${X(p.ll[1]).toFixed(1)},${Y(p.ll[0]).toFixed(1)}`).join(' ');
    const marks = P.map((p, i) => `<g class="pt" data-pt="${i}" tabindex="0" role="button" aria-label="${p.name}">${p.night || p.start ? `<circle cx="${X(p.ll[1])}" cy="${Y(p.ll[0])}" r="6.5" fill="#e5c98d" stroke="#163e33" stroke-width="2"/><text x="${X(p.ll[1]) + 13}" y="${Y(p.ll[0]) + 4}" font-size="12.5" font-weight="600" fill="#163e33">${p.name}</text>` : `<circle cx="${X(p.ll[1])}" cy="${Y(p.ll[0])}" r="3.5" fill="#fffefa" stroke="#163e33" stroke-width="1.6"/>`}<circle cx="${X(p.ll[1])}" cy="${Y(p.ll[0])}" r="13" fill="transparent"/></g>`).join('');
    return `<div class="route-card"><h3>${t.mapTitle}</h3><p>${t.mapHint}</p><svg class="route-svg" viewBox="0 0 ${Ww.toFixed(0)} ${Hh}" role="img" aria-label="${t.mapTitle}"><polyline points="${line}" fill="none" stroke="#163e33" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${marks}<g transform="translate(${Ww - 26},34)"><path d="M0 12 L0 -12 M-5 -5 L0 -12 L5 -5" fill="none" stroke="#163e33" stroke-width="1.6"/><text x="0" y="28" text-anchor="middle" font-size="11" fill="#163e33">N</text></g></svg></div>`;
  }

  function compare(L) {
    const t = T[L], max = 5200;
    return `<div class="cmp-card"><h3>${t.cmpTitle}</h3><p>${t.cmpText}</p><ul class="cmp">${t.cmp.map(([n, e, k]) => `<li class="k${k}"><span>${n}</span><div><i style="width:${(e / max * 100).toFixed(1)}%"></i></div><b>${fmt(e)} m</b></li>`).join('')}</ul></div>`;
  }

  const X = {
    altitude(L) { const t = T[L]; return `<section class="section alt-section" id="altitud"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">${t.altLabel}</p><h2>${t.altTitle}</h2></div><p class="section-intro">${t.altIntro}</p></div>${profile(L)}<div class="alt-grid">${routeMap(L)}${compare(L)}</div></div></section>`; },
    culture(L) { const t = T[L]; return `<section class="section wrap culture" id="territori"><div class="section-heading"><div><p class="eyebrow">${t.cultLabel}</p><h2>${t.cultTitle}</h2></div><p class="section-intro">${t.cultIntro}</p></div><div class="cult-grid">${t.cult.map(([h, b], i) => `<article><span>0${i + 1}</span><h3>${h}</h3><p>${b}</p></article>`).join('')}</div><details class="gloss"><summary>${t.glossTitle}<b aria-hidden="true">+</b></summary><dl>${t.gloss.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl></details><p class="cult-src">${t.cultSources}: <a href="https://ich.unesco.org/en/RL/andean-cosmovision-of-the-kallawaya-00048" target="_blank" rel="noopener">UNESCO</a> · <a href="https://bolivia.wcs.org/en-us/Landscapes/Madidi-Tambopata/Apolobamba.aspx" target="_blank" rel="noopener">WCS Bolivia</a></p></section>`; },
    guide(L) { const t = T[L]; return `<section class="section guide-section" id="guia"><div class="wrap guide-grid"><figure><img src="assets/guia.webp" alt="${t.guideName}. ${t.guideCaption}" width="900" height="1303" loading="lazy"><figcaption>${t.guideCaption}</figcaption></figure><div><p class="eyebrow">${t.guideLabel}</p><h2>${t.guideTitle}</h2><p class="guide-name">${t.guideName}</p><p class="guide-role">${t.guideRole}</p><p>${t.guideText}</p><dl class="guide-points">${t.guidePoints.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><blockquote>${t.guideQuote}</blockquote></div></div></section>`; },
    quiz(L) { const t = T[L]; return `<aside class="quiz" id="test"><div class="quiz-head"><p class="eyebrow">${t.quizLabel}</p><h3>${t.quizTitle}</h3></div><div class="quiz-body" id="quiz-body"><button type="button" class="button button-forest" id="quiz-start">${t.quizStart}</button></div></aside>`; },
    contact(L) {
      const t = T[L], on = !!CONTACT.whatsapp;
      return `<div class="contact" id="contacte"><p class="eyebrow">${t.contactLabel}</p><h3>${t.contactTitle}</h3>${on ? `<p>${t.contactText}</p><form id="contact-form" class="contact-form"><label>${t.fName}<input name="n" autocomplete="name" required></label><label>${t.fExp}<select name="e">${t.fExpOpts.map(o => `<option>${o}</option>`).join('')}</select></label><label class="wide">${t.fMsg}<textarea name="m" rows="2"></textarea></label><button class="button button-forest" type="submit">${t.fSend}</button></form>` : `<p>${t.contactSoon}</p>`}</div>`;
    },
    sticky(L) { const t = T[L]; return `<div class="sticky-cta" id="sticky-cta"><a href="#programa">${t.stickyA}</a><a class="primary" href="#contacte">${t.stickyB}</a></div>`; },
    bind(L, docs) {
      const t = T[L], P = points(L), card = document.getElementById('pt-card');
      function show(i) {
        const p = P[i];
        document.querySelectorAll('.pt').forEach(g => g.classList.toggle('on', Number(g.dataset.pt) === i));
        card.innerHTML = `<div><strong>${p.name}</strong><span>${t.dayWord} ${p.day}${p.night ? ' · ' + t.nightWord : ''}</span></div><dl><div><dt>m</dt><dd>${fmt(p.ele)}</dd></div><div><dt>${t.kmWord}</dt><dd>${km(p.km)}</dd></div><div><dt>h</dt><dd>${p.time}</dd></div></dl><a href="https://opentopomap.org/#marker=15/${p.ll[0]}/${p.ll[1]}" target="_blank" rel="noopener">${t.openMap} ↗</a>`;
      }
      if (card) {
        document.querySelectorAll('.pt').forEach(g => { const go = () => show(Number(g.dataset.pt)); g.addEventListener('click', go); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
        show(P.findIndex(p => p.ele === Math.max(...P.map(q => q.ele))));
      }
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
