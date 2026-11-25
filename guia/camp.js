/* Eines de camp de l'app del guia (model de l'app del Catllaràs, adaptat a Bolívia):
   · «Ara» en vista simple (pròxim punt, hora d'arribada, retard i llum en gran);
   · guió de la jornada: què dir a cada punt (orientació, desnivell, hora) i criteris de conducció;
   · text per dictar o enviar en una emergència (WGS84, UTM, punt i sortida més propers) i missatge curt per al Garmin inReach;
   · caminada simulada (mode prova) i protecció del desplaçament amb el dit sobre el mapa.
   Només fa servir dades pròpies de l'app (J, PTS, A.COORD, A.SORTIDES, gps). Textos en 4 idiomes. */
(() => {
  'use strict';
  const CT = {
    ca: {
      guioBtn: '📖 Guió de la jornada', guioTit: 'Guió de la jornada', close: 'Tancar',
      simple: 'Vista simple', all: 'Veure totes les dades', nextPt: 'Pròxim punt', eta: 'hora d’arribada estimada', left: 'falten', vsPlan: 'respecte al pla',
      toSafe: 'fins a lloc segur', toSunset: 'fins a la posta', noPos: 'Sense posició: marca a «Punts» l’últim punt per on heu passat o activa el GPS.', noNext: 'Marca l’últim punt o activa el GPS',
      orient: (a, b, c) => `<b>Orientació:</b> venim de ${a} · som a ${b} · anem a ${c}.`, orientEnd: 'final de la jornada', arrive: 'Hi som a les', hereAlt: 'm',
      mission: 'Què comprovar', decision: 'Decisió si se supera l’hora límit', limit: 'hora límit',
      first: '<b>Briefing:</b> horari i ritme del dia, estat físic i emocional (preguntar-ho un per un: mal de cap, son, gana, nàusees), aigua, menjar i capes a mà, i què porta el guia (farmaciola i comunicador).',
      end: '<b>Tancament:</b> recompte del grup, repàs de la jornada, feedback i com ha dormit cadascú. Amb símptomes no es puja a dormir més amunt.',
      risk: '<b>Perills en tres temps:</b> 1) indicar el perill abans d’arribar · 2) actuar segons el perill (ritme, distància, esperar el grup) · 3) buscar feedback: «us trobeu còmodes?».',
      org: '<b>Organització:</b> compte visual del grup (dir «us compto»), tancador al seu lloc, distància segons el terreny.',
      critTit: 'Criteris de conducció: què dir en cada moment',
      crit: [
        '<b>Frase tipus a cada punt (15 s):</b> «Venim de ___, som a ___ (ho assenyalo al mapa), anem a ___, falten ___ km i ___ m de desnivell, hi arribarem cap a les ___. Ens espera ___ (terreny o perill).» Cobreix orientació, desnivell, distància, horari, mapa i entorn. Fer servir el mapa o el GPS davant del grup i dir-ho.',
        '<b>Parades:</b> aigua, menjar i capes en un lloc adequat i adaptat al grup; explicar només en parades sense fred ni vent.',
        '<b>Organització:</b> tancador anomenat · ordre adequat · compte visual · estat físic i emocional un per un · distància entre persones segons el terreny · indicacions clares davant dificultats o canvis.',
        '<b>Altitud:</b> preguntar pel mal de cap, el son, la gana i les nàusees abans de pujar i al campament.',
        '<b>Explicacions:</b> paisatge, territori i cultura local, adequades i encertades; si no està contrastat, dir-ho.'],
      sosTit: 'Text per dictar o enviar', sosNo: 'Activa el GPS per omplir-lo amb la posició.', copy: 'Copiar', copied: 'Copiat', share: 'Compartir ubicació',
      oldPos: h => `Última posició coneguda, de les ${h}. Pot no ser l’actual.`, newPos: (h, a) => `Posició de les ${h}, precisió ±${a} m.`,
      shortTit: 'Missatge curt per al Garmin inReach',
      N: 'N', S: 'S', E: 'E', W: 'O',
      sosTxt: o => `Sóc el guia d’un grup d’Andes Wild Trek a la Cordillera d’Apolobamba (La Paz, Bolívia). Necessito ajuda.\nCoordenades: ${o.lat} ${o.ns}, ${o.lon} ${o.ew} (WGS84). UTM ${o.zona}: X ${o.X}, Y ${o.Y}.\nCota aproximada: ${o.alt} m. Punt més proper: ${o.c}, ${o.n}, a ${o.d}. Sortida en vehicle més propera: ${o.s}, a ${o.ds}.\nQuè ha passat: ______ · Persones afectades: ___ · Estat: ______`,
      shortTxt: o => `SOS Apolobamba · ${o.la},${o.lo} · ${o.alt} m · prop de ${o.c} · Què ha passat: ___ · Persones: ___`,
      walkOn: 'Simular caminada (GPS)', walkOff: 'Aturar', walkGps: 'Atura primer el GPS real.', walking: 'Caminada simulada',
      guard: '↕ Llisca aquí per moure la pàgina (el mapa captura el dit)'
    },
    es: {
      guioBtn: '📖 Guion de la jornada', guioTit: 'Guion de la jornada', close: 'Cerrar',
      simple: 'Vista simple', all: 'Ver todos los datos', nextPt: 'Próximo punto', eta: 'hora de llegada estimada', left: 'faltan', vsPlan: 'respecto al plan',
      toSafe: 'hasta lugar seguro', toSunset: 'hasta la puesta', noPos: 'Sin posición: marca en «Puntos» el último punto por el que habéis pasado o activa el GPS.', noNext: 'Marca el último punto o activa el GPS',
      orient: (a, b, c) => `<b>Orientación:</b> venimos de ${a} · estamos en ${b} · vamos a ${c}.`, orientEnd: 'final de la jornada', arrive: 'Llegamos a las', hereAlt: 'm',
      mission: 'Qué comprobar', decision: 'Decisión si se supera la hora límite', limit: 'hora límite',
      first: '<b>Briefing:</b> horario y ritmo del día, estado físico y emocional (preguntarlo uno por uno: dolor de cabeza, sueño, hambre, náuseas), agua, comida y capas a mano, y qué lleva el guía (botiquín y comunicador).',
      end: '<b>Cierre:</b> recuento del grupo, repaso de la jornada, feedback y cómo ha dormido cada uno. Con síntomas no se sube a dormir más arriba.',
      risk: '<b>Peligros en tres tiempos:</b> 1) indicar el peligro antes de llegar · 2) actuar según el peligro (ritmo, distancia, esperar al grupo) · 3) buscar feedback: «¿os encontráis cómodos?».',
      org: '<b>Organización:</b> cuenta visual del grupo (decir «os cuento»), cierre de grupo en su sitio, distancia según el terreno.',
      critTit: 'Criterios de conducción: qué decir en cada momento',
      crit: [
        '<b>Frase tipo en cada punto (15 s):</b> «Venimos de ___, estamos en ___ (lo señalo en el mapa), vamos a ___, faltan ___ km y ___ m de desnivel, llegaremos hacia las ___. Nos espera ___ (terreno o peligro).» Cubre orientación, desnivel, distancia, horario, mapa y entorno. Usar el mapa o el GPS delante del grupo y decirlo.',
        '<b>Paradas:</b> agua, comida y capas en un lugar adecuado y adaptado al grupo; explicar solo en paradas sin frío ni viento.',
        '<b>Organización:</b> cierre de grupo nombrado · orden adecuado · cuenta visual · estado físico y emocional uno por uno · distancia entre personas según el terreno · indicaciones claras ante dificultades o cambios.',
        '<b>Altitud:</b> preguntar por el dolor de cabeza, el sueño, el hambre y las náuseas antes de subir y en el campamento.',
        '<b>Explicaciones:</b> paisaje, territorio y cultura local, adecuadas y acertadas; si no está contrastado, decirlo.'],
      sosTit: 'Texto para dictar o enviar', sosNo: 'Activa el GPS para rellenarlo con la posición.', copy: 'Copiar', copied: 'Copiado', share: 'Compartir ubicación',
      oldPos: h => `Última posición conocida, de las ${h}. Puede no ser la actual.`, newPos: (h, a) => `Posición de las ${h}, precisión ±${a} m.`,
      shortTit: 'Mensaje corto para el Garmin inReach',
      N: 'N', S: 'S', E: 'E', W: 'O',
      sosTxt: o => `Soy el guía de un grupo de Andes Wild Trek en la Cordillera de Apolobamba (La Paz, Bolivia). Necesito ayuda.\nCoordenadas: ${o.lat} ${o.ns}, ${o.lon} ${o.ew} (WGS84). UTM ${o.zona}: X ${o.X}, Y ${o.Y}.\nAltitud aproximada: ${o.alt} m. Punto más cercano: ${o.c}, ${o.n}, a ${o.d}. Salida en vehículo más cercana: ${o.s}, a ${o.ds}.\nQué ha pasado: ______ · Personas afectadas: ___ · Estado: ______`,
      shortTxt: o => `SOS Apolobamba · ${o.la},${o.lo} · ${o.alt} m · cerca de ${o.c} · Qué ha pasado: ___ · Personas: ___`,
      walkOn: 'Simular caminata (GPS)', walkOff: 'Parar', walkGps: 'Para primero el GPS real.', walking: 'Caminata simulada',
      guard: '↕ Desliza aquí para mover la página (el mapa captura el dedo)'
    },
    en: {
      guioBtn: '📖 Day script', guioTit: 'Day script', close: 'Close',
      simple: 'Simple view', all: 'Show all data', nextPt: 'Next point', eta: 'estimated arrival time', left: 'to go', vsPlan: 'vs the plan',
      toSafe: 'to safe place', toSunset: 'to sunset', noPos: 'No position: mark the last point you passed in “Points” or turn on the GPS.', noNext: 'Mark the last point or turn on the GPS',
      orient: (a, b, c) => `<b>Orientation:</b> we come from ${a} · we are at ${b} · we are going to ${c}.`, orientEnd: 'the end of the day', arrive: 'We get there at', hereAlt: 'm',
      mission: 'What to check', decision: 'Decision if the time limit is passed', limit: 'time limit',
      first: '<b>Briefing:</b> timetable and pace for the day, physical and emotional state (ask one by one: headache, sleep, appetite, nausea), water, food and layers to hand, and what the guide carries (first-aid kit and communicator).',
      end: '<b>Close:</b> head count, review of the day, feedback and how each person slept. With symptoms, nobody goes up to sleep higher.',
      risk: '<b>Hazards in three steps:</b> 1) point out the hazard before reaching it · 2) act according to the hazard (pace, distance, wait for the group) · 3) ask for feedback: “are you comfortable?”.',
      org: '<b>Organisation:</b> visual head count (say “I am counting you”), sweeper in place, distance according to the terrain.',
      critTit: 'Guiding criteria: what to say and when',
      crit: [
        '<b>Standard sentence at each point (15 s):</b> “We come from ___, we are at ___ (I point it out on the map), we are going to ___, ___ km and ___ m of climb to go, we will arrive around ___. Ahead of us: ___ (terrain or hazard).” It covers orientation, climb, distance, timing, map and surroundings. Use the map or GPS in front of the group and say so.',
        '<b>Stops:</b> water, food and layers in a suitable place adapted to the group; explain only at stops without cold or wind.',
        '<b>Organisation:</b> named sweeper · suitable order · visual head count · physical and emotional state one by one · distance between people according to the terrain · clear instructions for difficulties or changes.',
        '<b>Altitude:</b> ask about headache, sleep, appetite and nausea before climbing and at camp.',
        '<b>Explanations:</b> landscape, territory and local culture, suitable and accurate; if it is not verified, say so.'],
      sosTit: 'Text to dictate or send', sosNo: 'Turn on the GPS to fill it in with your position.', copy: 'Copy', copied: 'Copied', share: 'Share location',
      oldPos: h => `Last known position, from ${h}. It may not be the current one.`, newPos: (h, a) => `Position from ${h}, accuracy ±${a} m.`,
      shortTit: 'Short message for the Garmin inReach',
      N: 'N', S: 'S', E: 'E', W: 'W',
      sosTxt: o => `I am the guide of an Andes Wild Trek group in the Apolobamba range (La Paz, Bolivia). I need help.\nCoordinates: ${o.lat} ${o.ns}, ${o.lon} ${o.ew} (WGS84). UTM ${o.zona}: X ${o.X}, Y ${o.Y}.\nApproximate altitude: ${o.alt} m. Nearest point: ${o.c}, ${o.n}, ${o.d} away. Nearest vehicle exit: ${o.s}, ${o.ds} away.\nWhat happened: ______ · People affected: ___ · Condition: ______`,
      shortTxt: o => `SOS Apolobamba · ${o.la},${o.lo} · ${o.alt} m · near ${o.c} · What happened: ___ · People: ___`,
      walkOn: 'Simulate a walk (GPS)', walkOff: 'Stop', walkGps: 'Stop the real GPS first.', walking: 'Simulated walk',
      guard: '↕ Swipe here to scroll the page (the map captures the finger)'
    },
    fr: {
      guioBtn: '📖 Script de la journée', guioTit: 'Script de la journée', close: 'Fermer',
      simple: 'Vue simple', all: 'Voir toutes les données', nextPt: 'Prochain point', eta: 'heure d’arrivée estimée', left: 'reste', vsPlan: 'par rapport au plan',
      toSafe: 'jusqu’à un lieu sûr', toSunset: 'jusqu’au coucher', noPos: 'Pas de position : marquez dans « Points » le dernier point passé ou activez le GPS.', noNext: 'Marquez le dernier point ou activez le GPS',
      orient: (a, b, c) => `<b>Orientation :</b> nous venons de ${a} · nous sommes à ${b} · nous allons à ${c}.`, orientEnd: 'la fin de la journée', arrive: 'Nous y sommes à', hereAlt: 'm',
      mission: 'À vérifier', decision: 'Décision si l’heure limite est dépassée', limit: 'heure limite',
      first: '<b>Briefing :</b> horaire et rythme de la journée, état physique et émotionnel (demander à chacun : mal de tête, sommeil, appétit, nausées), eau, nourriture et couches à portée de main, et ce que porte le guide (trousse de secours et communicateur).',
      end: '<b>Clôture :</b> comptage du groupe, bilan de la journée, retours et comment chacun a dormi. En cas de symptômes, on ne monte pas dormir plus haut.',
      risk: '<b>Dangers en trois temps :</b> 1) signaler le danger avant d’y arriver · 2) agir selon le danger (rythme, distance, attendre le groupe) · 3) chercher un retour : « êtes-vous à l’aise ? ».',
      org: '<b>Organisation :</b> comptage visuel du groupe (dire « je vous compte »), serre-file à sa place, distance selon le terrain.',
      critTit: 'Critères de conduite : quoi dire et quand',
      crit: [
        '<b>Phrase type à chaque point (15 s) :</b> « Nous venons de ___, nous sommes à ___ (je le montre sur la carte), nous allons à ___, il reste ___ km et ___ m de dénivelé, nous y serons vers ___. Devant nous : ___ (terrain ou danger). » Elle couvre orientation, dénivelé, distance, horaire, carte et environnement. Utiliser la carte ou le GPS devant le groupe et le dire.',
        '<b>Pauses :</b> eau, nourriture et couches dans un endroit adapté au groupe ; n’expliquer qu’aux pauses sans froid ni vent.',
        '<b>Organisation :</b> serre-file nommé · ordre adapté · comptage visuel · état physique et émotionnel un par un · distance entre les personnes selon le terrain · consignes claires face aux difficultés ou aux changements.',
        '<b>Altitude :</b> demander mal de tête, sommeil, appétit et nausées avant de monter et au camp.',
        '<b>Explications :</b> paysage, territoire et culture locale, adaptées et justes ; si ce n’est pas vérifié, le dire.'],
      sosTit: 'Texte à dicter ou à envoyer', sosNo: 'Activez le GPS pour le remplir avec la position.', copy: 'Copier', copied: 'Copié', share: 'Partager la position',
      oldPos: h => `Dernière position connue, de ${h}. Elle peut ne pas être l’actuelle.`, newPos: (h, a) => `Position de ${h}, précision ±${a} m.`,
      shortTit: 'Message court pour le Garmin inReach',
      N: 'N', S: 'S', E: 'E', W: 'O',
      sosTxt: o => `Je suis le guide d’un groupe d’Andes Wild Trek dans la Cordillère d’Apolobamba (La Paz, Bolivie). J’ai besoin d’aide.\nCoordonnées : ${o.lat} ${o.ns}, ${o.lon} ${o.ew} (WGS84). UTM ${o.zona} : X ${o.X}, Y ${o.Y}.\nAltitude approximative : ${o.alt} m. Point le plus proche : ${o.c}, ${o.n}, à ${o.d}. Sortie en véhicule la plus proche : ${o.s}, à ${o.ds}.\nCe qui s’est passé : ______ · Personnes concernées : ___ · État : ______`,
      shortTxt: o => `SOS Apolobamba · ${o.la},${o.lo} · ${o.alt} m · près de ${o.c} · Ce qui s’est passé : ___ · Personnes : ___`,
      walkOn: 'Simuler une marche (GPS)', walkOff: 'Arrêter', walkGps: 'Arrêtez d’abord le vrai GPS.', walking: 'Marche simulée',
      guard: '↕ Glissez ici pour faire défiler la page (la carte capte le doigt)'
    }
  };
  const t = k => (CT[L] && CT[L][k] !== undefined) ? CT[L][k] : CT.ca[k];

  const css = document.createElement('style');
  css.textContent = `
  .campRow{display:flex;gap:8px;margin:0 0 10px}.campRow .btn{flex:1}
  #s-ara.simple>*:not(#simpleCard):not(#alerts):not(.campRow):not(#jornAra):not(#plaRow):not(#plaCard):not(#decCard):not(#targetCard):not(.vistaRow){display:none!important}
  #simpleCard .nm{font-size:22px;font-weight:800;margin:2px 0 8px}
  #simpleCard .big{font-size:34px;font-weight:800;line-height:1.1}
  #simpleCard .g3{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
  #simpleCard .g3 div{background:var(--card2);border-radius:10px;padding:8px 10px}
  #simpleCard .g3 span{display:block;font-size:12px;color:var(--mut)}
  #simpleCard .g3 b{font-size:22px}
  #s-guio .bar{display:flex;gap:8px;align-items:center;padding:0 0 8px}#s-guio .bar b{flex:1;font-size:17px}
  #s-guio .pg{border:1px solid var(--line);background:var(--card);border-radius:12px;padding:10px 12px;margin:0 0 10px}
  #s-guio .pg .hd{display:flex;gap:8px;align-items:baseline}#s-guio .pg .hr{margin-left:auto;font-weight:700}
  #s-guio .q{border-left:3px solid var(--blue);padding-left:8px;margin:6px 0 0}
  #s-guio ul{margin:6px 0 0;padding-left:18px}
  #sosTxt,#sosShort{white-space:pre-wrap;background:var(--card2);border-radius:8px;padding:10px;font-size:14px;margin:6px 0}
  .mapGuard{height:34px;margin:6px 0 0;border-radius:10px;background:var(--card2);color:var(--mut);font-size:13px;display:flex;align-items:center;justify-content:center;touch-action:pan-y}`;
  document.head.appendChild(css);

  // ---------- Vista simple de «Ara» + botó del guió ----------
  const ara = $('#s-ara');
  const card = document.createElement('div'); card.className = 'card'; card.id = 'simpleCard';
  card.innerHTML = `<div class="small mut" id="spLbl"></div><div class="nm" id="spNom">—</div>
    <div class="big" id="spEta">--:--</div><div class="small mut" id="spEtaL"></div>
    <div class="g3"><div><b id="spKm">--</b><span id="spLeftL"></span></div><div><b id="spDelay">--</b><span id="spDelayL"></span></div>
    <div><b id="spLlum">--</b><span id="spLlumL"></span></div><div><b id="spPosta">--</b><span id="spPostaL"></span></div></div>
    <div class="campRow" style="margin:12px 0 0"><button class="btn ac" id="spGps"></button></div>
    <p class="small mut" style="margin:8px 0 0" id="spNota"></p>`;
  ara.insertBefore(card, $('#alerts').nextSibling);
  const row = document.createElement('div'); row.className = 'campRow';
  row.innerHTML = '<button class="btn" id="btnGuio"></button>';
  ara.insertBefore(row, $('#alerts'));
  const vrow = document.createElement('div'); vrow.className = 'campRow vistaRow';
  vrow.innerHTML = '<button class="btn sm" id="spToggle"></button>';
  ara.appendChild(vrow);
  let simple = store.get('vistaSimple', true);
  const aplicaVista = () => { ara.classList.toggle('simple', simple); $('#spToggle').textContent = simple ? t('all') : t('simple'); store.set('vistaSimple', simple); };
  $('#spToggle').onclick = () => { simple = !simple; aplicaVista(); };
  $('#spGps').onclick = () => { const b = document.querySelector('.gpsBtn'); if (b) b.click(); };
  const txt = id => (document.getElementById(id) || {}).textContent || '--';
  setInterval(() => {
    const nb = document.getElementById('nextBody'), kv = nb ? nb.querySelectorAll('.kv b') : [], hd = nb && nb.querySelector('.hd');
    $('#spNom').textContent = hd ? hd.textContent.replace(/\s+/g, ' ').trim() : t('noNext');
    $('#spKm').textContent = kv[0] ? kv[0].textContent : '--';
    $('#spEta').textContent = kv[2] ? kv[2].textContent : '--:--';
    const d = document.getElementById('delay'), sd = $('#spDelay');
    sd.textContent = d ? d.textContent : '--'; sd.className = d ? d.className : '';
    $('#spLlum').textContent = txt('safeLeft'); $('#spPosta').textContent = txt('sunLeft');
    const g = document.querySelector('.gpsBtn'); $('#spGps').textContent = g ? g.textContent : '';
    $('#spNota').textContent = kv[0] ? '' : t('noPos');
  }, 1000);

  // ---------- Guió de la jornada ----------
  const sec = document.createElement('section'); sec.id = 's-guio'; document.querySelector('main').appendChild(sec);
  let prev = 'ara';
  const llistaPunts = Jx => Jx.pts;
  function guio() {
    const ps = llistaPunts(J);
    const chips = `<div class="chips">${JORN.map(x => `<button data-gj="${x.id}" class="${x.tipus === 'C' ? 'pc ' : ''}${x.id === J.id ? 'on' : ''}">${x.tipus === 'A' ? T('dayShort') + ' ' + x.dia : x.codi}</button>`).join('')}</div>`;
    const bar = `<div class="bar"><b>${esc(t('guioTit'))} · ${esc(titolJorn(J))}</b><button class="btn sm" id="guioX">${esc(t('close'))}</button></div>`;
    const crit = `<details class="pg"><summary><b>${esc(t('critTit'))}</b></summary><div class="small">${t('crit').map(x => `<p>${x}</p>`).join('')}</div></details>`;
    const pts = ps.map((p, i) => {
      const a = ps[i - 1], b = ps[i + 1];
      let seg = '';
      if (b) { const z = dz(J, p.m, b.m); seg = `${esc(nm(b.n))} (${dec((b.m - p.m) / 1000, 1)} km, +${fmt(z.up)}/−${fmt(z.dn)} m, ${fmtDur(b.t - p.t)})`; }
      const ori = t('orient')(a ? esc(nm(a.n)) : '—', `${esc(nm(p.n))} (${fmt(p.ele)} m)`, b ? seg : t('orientEnd')) + ` ${t('arrive')} ${hhmm(p.t)}.`;
      const x = [];
      if (i === 0) x.push(t('first'));
      if (p.dec) x.push(t('risk'));
      if (i === ps.length - 1) x.push(t('end'));
      x.push(t('org'));
      const f = nm(p.f), dc = nm(p.dec);
      return `<div class="pg"><div class="hd"><span class="code">${p.c}</span><b>${esc(nm(p.n))}</b><span class="hr">${hhmm(p.t)}</span></div>
        <div class="small mut">${fmt(p.ele)} m · km ${dec(p.km, 1)}</div>
        <div class="small" style="margin-top:6px">${ori}</div>
        ${f ? `<p class="q small"><b>${esc(t('mission'))}:</b> ${esc(f)}</p>` : ''}
        ${dc ? `<p class="small" style="margin:6px 0 0"><b>${esc(t('decision'))} (${esc(t('limit'))} ${hhmm(p.l)}):</b> ${esc(dc)}</p>` : ''}
        <ul class="small">${x.map(s => `<li>${s}</li>`).join('')}</ul></div>`;
    }).join('');
    $('#s-guio').innerHTML = bar + chips + crit + pts;
  }
  function obreGuio() {
    const cur = document.querySelector('main section.act'); if (cur && cur.id !== 's-guio') prev = cur.id.slice(2);
    guio(); mostra('guio');
  }
  $('#btnGuio').onclick = obreGuio;
  sec.addEventListener('click', e => {
    if (e.target.id === 'guioX') return mostra(prev);
    const b = e.target.closest('[data-gj]'); if (b) { setJorn(b.dataset.gj); guio(); }
  });

  // ---------- Text per dictar o enviar en una emergència ----------
  const sos = $('#s-sos');
  const sosCard = document.createElement('div'); sosCard.className = 'card';
  sosCard.innerHTML = `<h2 id="sosH"></h2><div id="sosTxt" class="small mut"></div>
    <div class="campRow"><button class="btn sm" id="sosCopia"></button><button class="btn sm ac" id="sosShare"></button></div>
    <p class="small mut" id="sosOld" style="margin:0"></p>
    <h3 id="sosShortH"></h3><div id="sosShort" class="small"></div>
    <div class="campRow"><button class="btn sm" id="sosShortCopia"></button></div>`;
  const where = $('#sosPos') && $('#sosPos').closest('.card');
  if (where) where.insertAdjacentElement('afterend', sosCard); else sos.appendChild(sosCard);
  let ultima = store.get('ultimaPos', null), texte = '', curt = '', linkPos = '', gravat = 0;
  function pintaSos() {
    let pos = null, vella = false;
    if (typeof gps !== 'undefined' && gps) { pos = { lat: gps.lat, lon: gps.lon, acc: gps.acc, alt: gps.alt, t: gps.t }; ultima = pos; if (Date.now() - gravat > 15000) { store.set('ultimaPos', pos); gravat = Date.now(); } }
    else if (ultima) { pos = ultima; vella = true; }
    const el = $('#sosTxt'), old = $('#sosOld'); if (!el) return;
    if (!pos) { texte = curt = ''; el.textContent = t('sosNo'); el.className = 'small mut'; $('#sosShort').textContent = ''; old.textContent = ''; return; }
    const u = utm(pos.lat, pos.lon);
    let near = null; A.COORD.forEach(r => { const d = hav(pos.lat, pos.lon, r.ll[0], r.ll[1]); if (!near || d < near.d) near = { r, d }; });
    let sx = null; A.SORTIDES.forEach(s => { const d = hav(pos.lat, pos.lon, s.ll[0], s.ll[1]); if (!sx || d < sx.d) sx = { s, d }; });
    const hh = new Date(pos.t).toLocaleTimeString(L, { hour: '2-digit', minute: '2-digit' });
    const alt = pos.alt != null ? fmt(pos.alt) : '—';
    linkPos = `https://maps.google.com/?q=${pos.lat.toFixed(5)},${pos.lon.toFixed(5)}`;
    texte = t('sosTxt')({ lat: dec(Math.abs(pos.lat), 5), ns: pos.lat < 0 ? t('S') : t('N'), lon: dec(Math.abs(pos.lon), 5), ew: pos.lon < 0 ? t('W') : t('E'),
      zona: u.zona, X: u.X, Y: u.Y, alt, c: near.r.c, n: nm(near.r.n), d: dist(near.d), s: nm(sx.s.n), ds: dist(sx.d) });
    curt = t('shortTxt')({ la: pos.lat.toFixed(5), lo: pos.lon.toFixed(5), alt, c: near.r.c });
    el.textContent = texte; el.className = 'small'; $('#sosShort').textContent = curt;
    old.textContent = vella ? t('oldPos')(hh) : t('newPos')(hh, Math.round(pos.acc || 0));
  }
  const copia = (btn, v, lbl) => { if (v && navigator.clipboard) navigator.clipboard.writeText(v).then(() => { btn.textContent = t('copied'); setTimeout(() => btn.textContent = t(lbl), 1500); }); else if (v) prompt('', v); };
  $('#sosCopia').onclick = e => copia(e.target, texte, 'copy');
  $('#sosShortCopia').onclick = e => copia(e.target, curt, 'copy');
  $('#sosShare').onclick = () => { if (!texte) return; if (navigator.share) navigator.share({ title: 'SOS', text: texte + '\n' + linkPos }).catch(() => {}); else if (navigator.clipboard) navigator.clipboard.writeText(texte + '\n' + linkPos); };
  setInterval(pintaSos, 2000);

  // ---------- Mode prova: caminada simulada ----------
  const simOff = $('#simOff');
  const wrow = document.createElement('div'); wrow.className = 'campRow'; wrow.style.marginTop = '8px';
  wrow.innerHTML = '<button class="btn sm" id="walkOn"></button><button class="btn sm" id="walkOff"></button>';
  if (simOff) simOff.parentElement.insertAdjacentElement('afterend', wrow);
  let timer = null;
  const aturaCaminada = () => { if (timer) { clearInterval(timer); timer = null; } gps = null; sim = null; pintaGpsKv(); renderSos(); if (window.mapa) mapa.gps(); pintaSos(); tick(); };
  $('#walkOff').onclick = aturaCaminada;
  $('#walkOn').onclick = () => {
    if (watchId !== null) { alert(t('walkGps')); return; }
    if (timer) return;
    const ps = J.pts, trk = J.trk; let min = ps[0].t, i = 0;
    const fi = ps[ps.length - 1].t;
    timer = setInterval(() => {
      min += 30; if (min >= fi) { aturaCaminada(); return; }
      while (i < ps.length - 2 && ps[i + 1].t < min) i++;
      const a = ps[i], b = ps[i + 1], f = Math.min(1, Math.max(0, (min - a.t) / Math.max(1, b.t - a.t)));
      const dm = a.m + (b.m - a.m) * f;
      let k = 0; while (k < trk.length - 2 && trk[k + 1][3] < dm) k++;
      const p = trk[k], q = trk[k + 1], g = Math.min(1, Math.max(0, (dm - p[3]) / Math.max(1, q[3] - p[3])));
      const lat = p[0] + (q[0] - p[0]) * g, lon = p[1] + (q[1] - p[1]) * g, ele = (p[2] ?? 0) + ((q[2] ?? p[2] ?? 0) - (p[2] ?? 0)) * g;
      const s = snap(lat, lon); if (s && s.dist < 300) lastM[J.id] = s.m;
      gps = { lat, lon, acc: 8, alt: ele, snap: s, t: Date.now() };
      sim = min + 6; // simula anar 6 min tard sobre el pla
      $('#gpsStat').textContent = t('walking');
      pintaGpsKv(); renderSos(); if (window.mapa) mapa.gps(); pintaSos(); tick();
    }, 400);
  };

  // ---------- Desplaçament amb el dit al mòbil ----------
  const mw = $('#mapwrap');
  if (mw) { const g = document.createElement('div'); g.className = 'mapGuard'; g.id = 'mapGuard'; mw.parentNode.insertBefore(g, mw.nextSibling); }

  // ---------- Textos i idioma ----------
  function pinta() {
    $('#btnGuio').textContent = t('guioBtn');
    $('#spLbl').textContent = t('nextPt'); $('#spEtaL').textContent = t('eta'); $('#spLeftL').textContent = t('left'); $('#spDelayL').textContent = t('vsPlan');
    $('#spLlumL').textContent = t('toSafe'); $('#spPostaL').textContent = t('toSunset');
    $('#sosH').textContent = t('sosTit'); $('#sosCopia').textContent = t('copy'); $('#sosShare').textContent = t('share');
    $('#sosShortH').textContent = t('shortTit'); $('#sosShortCopia').textContent = t('copy');
    $('#walkOn').textContent = t('walkOn'); $('#walkOff').textContent = t('walkOff');
    const g = $('#mapGuard'); if (g) g.textContent = t('guard');
    aplicaVista(); pintaSos();
    if ($('#s-guio').classList.contains('act')) guio();
  }
  window.camp = { pinta, obreGuio };
  pinta();
})();
