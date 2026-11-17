/* Seccions afegides a la web del client: guia, comparador d'altitud, territori, test i contacte. */
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
      contactLabel: 'M’INTERESSA', contactTitle: 'Demana el dossier complet del viatge.', contactText: 'Escriu-nos per WhatsApp. Et respondrà el guia, t’enviarem el dossier complet (etapes punt a punt, mapes, clima i preparació) i t’avisarem quan s’obrin les reserves. Sense compromís.',
      fName: 'El teu nom', fExp: 'La teva experiència', fExpOpts: ['Travesses de 4 dies o més', 'Travesses de 2–3 dies', 'Sortides d’un dia'], fMsg: 'Algun comentari? (opcional)', fSend: 'Envia per WhatsApp',
      contactSoon: 'Aviat podràs escriure’ns per WhatsApp des d’aquí.', waText: 'Hola! M’interessa la travessa de l’Apolobamba i m’agradaria rebre el dossier complet.',
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
      contactLabel: 'ME INTERESA', contactTitle: 'Pide el dossier completo del viaje.', contactText: 'Escríbenos por WhatsApp. Te responderá el guía, te enviaremos el dossier completo (etapas punto a punto, mapas, clima y preparación) y te avisaremos cuando se abran las reservas. Sin compromiso.',
      fName: 'Tu nombre', fExp: 'Tu experiencia', fExpOpts: ['Travesías de 4 días o más', 'Travesías de 2–3 días', 'Salidas de un día'], fMsg: '¿Algún comentario? (opcional)', fSend: 'Enviar por WhatsApp',
      contactSoon: 'Pronto podrás escribirnos por WhatsApp desde aquí.', waText: '¡Hola! Me interesa la travesía de Apolobamba y me gustaría recibir el dossier completo.',
      stickyA: 'Ver el programa', stickyB: 'Me interesa', showMore: 'Mostrar', offline: 'Esta web también funciona sin conexión una vez la has abierto.'
    }
  };

  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  function compare(L) {
    const t = T[L], max = 5200;
    return `<div class="cmp-card"><h3>${t.cmpTitle}</h3><p>${t.cmpText}</p><ul class="cmp">${t.cmp.map(([n, e, k]) => `<li class="k${k}"><span>${n}</span><div><i style="width:${(e / max * 100).toFixed(1)}%"></i></div><b>${fmt(e)} m</b></li>`).join('')}</ul></div>`;
  }

  const X = {
    compare,
    culture(L) { const t = T[L]; return `<section class="section wrap culture" id="territori"><div class="section-heading"><div><p class="eyebrow">${t.cultLabel}</p><h2>${t.cultTitle}</h2></div><p class="section-intro">${t.cultIntro}</p></div><div class="cult-grid">${t.cult.map(([h, b], i) => `<article><span>0${i + 1}</span><h3>${h}</h3><p>${b}</p></article>`).join('')}</div><details class="gloss"><summary>${t.glossTitle}<b aria-hidden="true">+</b></summary><dl>${t.gloss.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl></details><p class="cult-src">${t.cultSources}: <a href="https://ich.unesco.org/en/RL/andean-cosmovision-of-the-kallawaya-00048" target="_blank" rel="noopener">UNESCO</a> · <a href="https://bolivia.wcs.org/en-us/Landscapes/Madidi-Tambopata/Apolobamba.aspx" target="_blank" rel="noopener">WCS Bolivia</a></p></section>`; },
    guide(L) { const t = T[L]; return `<section class="section guide-section" id="guia"><div class="wrap guide-grid"><figure><img src="assets/guia.webp" alt="${t.guideName}. ${t.guideCaption}" width="900" height="1303" loading="lazy"><figcaption>${t.guideCaption}</figcaption></figure><div><p class="eyebrow">${t.guideLabel}</p><h2>${t.guideTitle}</h2><p class="guide-name">${t.guideName}</p><p class="guide-role">${t.guideRole}</p><p>${t.guideText}</p><dl class="guide-points">${t.guidePoints.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><blockquote>${t.guideQuote}</blockquote></div></div></section>`; },
    quiz(L) { const t = T[L]; return `<aside class="quiz" id="test"><div class="quiz-head"><p class="eyebrow">${t.quizLabel}</p><h3>${t.quizTitle}</h3></div><div class="quiz-body" id="quiz-body"><button type="button" class="button button-forest" id="quiz-start">${t.quizStart}</button></div></aside>`; },
    contact(L) {
      const t = T[L], on = !!CONTACT.whatsapp;
      return `<div class="contact" id="contacte"><p class="eyebrow">${t.contactLabel}</p><h3>${t.contactTitle}</h3>${on ? `<p>${t.contactText}</p><form id="contact-form" class="contact-form"><label>${t.fName}<input name="n" autocomplete="name" required></label><label>${t.fExp}<select name="e">${t.fExpOpts.map(o => `<option>${o}</option>`).join('')}</select></label><label class="wide">${t.fMsg}<textarea name="m" rows="2"></textarea></label><button class="button button-forest" type="submit">${t.fSend}</button></form>` : `<p>${t.contactSoon}</p>`}</div>`;
    },
    sticky(L) { const t = T[L]; return `<div class="sticky-cta" id="sticky-cta"><a href="#programa">${t.stickyA}</a><a class="primary" href="#contacte">${t.stickyB}</a></div>`; },
    bind(L, docs) {
      const t = T[L];
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
