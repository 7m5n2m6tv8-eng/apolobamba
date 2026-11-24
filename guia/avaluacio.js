// ---------------- AVALUACIÓ (checklist diari, autoavaluació del guia i enquesta del client) ----------------
// Versió interactiva dels instruments M2, M3 i M4 de l'Annex A del treball. Es omplen al mòbil sense cobertura,
// es desen al telèfon (no s'envia res) i s'exporten en CSV o s'imprimeixen en PDF en tornar.
// L'enquesta del client és un formulari de Google anònim (enllaç i QR a ENQUESTA).
const ENQUESTA = { url: 'https://docs.google.com/forms/d/e/1FAIpQLScnXaBFRML574r8K5PI5J7VZYa5B6C28ZPedfOIt_a5luli2g/viewform', qr: 'img/enquesta-qr.svg' }; // formulari de Google anònim; QR amb tools/qr_enquesta.py

const AV = {
ca: {
  hAval: 'Avaluació', avalIntro: 'Checklist diari, autoavaluació del guia i enquesta del client. Les dades es desen només en aquest mòbil; exporta-les en tornar.',
  openCheck: 'Checklist del dia', openAuto: 'Autoavaluació del guia', openEnq: 'Enquesta del client', exportCsv: 'Exportar CSV', printPdf: 'Imprimir / PDF', back: '← Tornar', saved: 'Desat al mòbil',
  checkTitle: 'Checklist diari del guia', checkHelp: 'Emplenar abans de sortir i completar al vespre en 5–10 minuts. Marcar Sí / No / NA; qualsevol «No» que condicioni l’activitat obliga a registrar la decisió.',
  code: 'Codi de sortida', date: 'Data', guide: 'Guia', stage: 'Etapa',
  before: 'Abans de la marxa', yes: 'Sí', no: 'No', na: 'NA', evidence: 'Evidència, incidència o decisió',
  items: ['Programa, cartografia i GPX disponibles i coherents', 'Meteorologia i informació local revisades amb hora i font', 'Estat del grup valorat de manera individual i confidencial', 'Material personal i col·lectiu necessari comprovat', 'Aigua, alimentació i pernocta de la jornada comprovades', 'Comunicacions, contacte extern i procediment d’avís acordats', 'Punts de decisió, hores límit i alternatives repassats', 'Carreteres consultades (ABC i transportistes, 48 h i 24 h)', 'Fonts d’aigua per sobre de les mines confirmades', 'Pla B de la jornada, punts d’evacuació i GPX carregats', 'Permís del SERNAP i registre al campament de guardaparcs', 'Briefing entès; cap, tancament i recompte acordats'],
  startDec: 'Decisió d’inici', decOpts: ['Programa previst', 'Programa modificat', 'No iniciar'], timeReason: 'Hora i motiu',
  record: 'Registre de la jornada',
  reg: [['Horaris', 'Sortida prevista / real. Arribada prevista / real.'], ['Punts de decisió', 'Punt i hora. Condició observada. Decisió.'], ['Ritme i parades', 'Temps de marxa, parades, adequació al grup i ajustos.'], ['Condicions', 'Meteorologia observada, visibilitat i terreny; diferències respecte de la previsió.'], ['Estat del grup', 'Fatiga i convivència de manera agregada. Les dades personals van al registre restringit.'], ['Interpretació i aprenentatge', 'Contingut breu realitzat i resposta del grup (realitzat, reduït o omissió justificada).'], ['Incidències i canvis', 'Identificador de la incidència, fet, decisió i motiu.'], ['Comunicació', 'Què s’ha comunicat, a qui, a quina hora i confirmació de recepció.'], ['Objectiu de la jornada', 'Assolit, parcial o no assolit, i fet que ho justifica.'], ['Millora per a l’endemà', 'Acció concreta, responsable i comprovació.']],
  dayScore: 'Valoració global del dia (1–5)', localCheck: 'Contrast amb el guia local', count: 'Recompte final', closeTime: 'Hora del tancament',
  autoTitle: 'Autoavaluació del guia', autoHelp: 'Emplenar dins de les 72 hores posteriors al servei, amb les checklists i el contrast amb el guia local. 1, cal millorar molt; 2, cal millorar; 3, adequat amb mancances; 4, bé; 5, molt bé. Justificar cada valoració amb un fet observable.',
  aspects: [['Planificació', 'Les etapes, els temps i la càrrega van ser realistes per al grup i l’altitud?'], ['Conducció', 'Vaig ajustar el ritme, les parades i els reagrupaments a les necessitats?'], ['Comunicació', 'Les consignes es van entendre i vaig escoltar les aportacions i el malestar?'], ['Decisions', 'Vaig decidir amb informació, registrar el motiu i explicar els canvis?'], ['Preparació operativa', 'Tenia alternatives practicables i comunicacions segons el pla?'], ['Gestió del grup', 'Vaig gestionar diferències de nivell, tensions i participació amb respecte?'], ['Interpretació', 'Els continguts van ser breus, rigorosos, contextualitzats i compatibles amb la marxa?'], ['Col·laboració local', 'Els rols i les aportacions del guia local van estar ben coordinats?'], ['Impacte ambiental i cultural', 'Vaig aplicar els acords locals i prevenir impactes evitables?'], ['Avaluació', 'Vaig completar els registres i utilitzar-los per adaptar els dies següents?']],
  fact: 'Fet concret i canvi que faria', avg: 'Mitjana',
  close: [['Punt fort, amb exemple'], ['Decisió que faria diferent i motiu'], ['Aprenentatge o pràctica que necessito abans de la següent edició'], ['Aportació del guia local'], ['Acció prioritària, responsable i termini']],
  enqTitle: 'Enquesta del client', enqText: 'Enquesta anònima i voluntària, en català, castellà, anglès i francès (uns 3 minuts). S’ofereix en acabar el servei, quan el grup ha pogut descansar: els clients escanegen el QR amb el seu mòbil. Les respostes van a un full de càlcul del responsable.', enqNoUrl: 'L’enllaç de l’enquesta encara no està configurat.', enqOpen: 'Obrir l’enquesta',
  confirmClear: 'Esborrar les dades d’aquest formulari?', clear: 'Esborrar', filled: 'emplenats'
},
es: {
  hAval: 'Evaluación', avalIntro: 'Checklist diario, autoevaluación del guía y encuesta del cliente. Los datos se guardan solo en este móvil; expórtalos al volver.',
  openCheck: 'Checklist del día', openAuto: 'Autoevaluación del guía', openEnq: 'Encuesta del cliente', exportCsv: 'Exportar CSV', printPdf: 'Imprimir / PDF', back: '← Volver', saved: 'Guardado en el móvil',
  checkTitle: 'Checklist diario del guía', checkHelp: 'Rellenar antes de salir y completar por la noche en 5–10 minutos. Marcar Sí / No / NA; cualquier «No» que condicione la actividad obliga a registrar la decisión.',
  code: 'Código de salida', date: 'Fecha', guide: 'Guía', stage: 'Etapa',
  before: 'Antes de la marcha', yes: 'Sí', no: 'No', na: 'NA', evidence: 'Evidencia, incidencia o decisión',
  items: ['Programa, cartografía y GPX disponibles y coherentes', 'Meteorología e información local revisadas con hora y fuente', 'Estado del grupo valorado de forma individual y confidencial', 'Material personal y colectivo necesario comprobado', 'Agua, comida y pernocta de la jornada comprobadas', 'Comunicaciones, contacto externo y procedimiento de aviso acordados', 'Puntos de decisión, horas límite y alternativas repasados', 'Carreteras consultadas (ABC y transportistas, 48 h y 24 h)', 'Fuentes de agua por encima de las minas confirmadas', 'Plan B de la jornada, puntos de evacuación y GPX cargados', 'Permiso del SERNAP y registro en el campamento de guardaparques', 'Briefing entendido; cabeza, cierre y recuento acordados'],
  startDec: 'Decisión de inicio', decOpts: ['Programa previsto', 'Programa modificado', 'No iniciar'], timeReason: 'Hora y motivo',
  record: 'Registro de la jornada',
  reg: [['Horarios', 'Salida prevista / real. Llegada prevista / real.'], ['Puntos de decisión', 'Punto y hora. Condición observada. Decisión.'], ['Ritmo y paradas', 'Tiempo de marcha, paradas, adecuación al grupo y ajustes.'], ['Condiciones', 'Meteorología observada, visibilidad y terreno; diferencias respecto a la previsión.'], ['Estado del grupo', 'Fatiga y convivencia de forma agregada. Los datos personales van al registro restringido.'], ['Interpretación y aprendizaje', 'Contenido breve realizado y respuesta del grupo (realizado, reducido u omisión justificada).'], ['Incidencias y cambios', 'Identificador de la incidencia, hecho, decisión y motivo.'], ['Comunicación', 'Qué se ha comunicado, a quién, a qué hora y confirmación de recepción.'], ['Objetivo de la jornada', 'Conseguido, parcial o no conseguido, y hecho que lo justifica.'], ['Mejora para el día siguiente', 'Acción concreta, responsable y comprobación.']],
  dayScore: 'Valoración global del día (1–5)', localCheck: 'Contraste con el guía local', count: 'Recuento final', closeTime: 'Hora del cierre',
  autoTitle: 'Autoevaluación del guía', autoHelp: 'Rellenar en las 72 horas posteriores al servicio, con los checklists y el contraste con el guía local. 1, hay que mejorar mucho; 2, hay que mejorar; 3, adecuado con carencias; 4, bien; 5, muy bien. Justificar cada valoración con un hecho observable.',
  aspects: [['Planificación', '¿Las etapas, los tiempos y la carga fueron realistas para el grupo y la altitud?'], ['Conducción', '¿Ajusté el ritmo, las paradas y los reagrupamientos a las necesidades?'], ['Comunicación', '¿Se entendieron las consignas y escuché las aportaciones y el malestar?'], ['Decisiones', '¿Decidí con información, registré el motivo y expliqué los cambios?'], ['Preparación operativa', '¿Tenía alternativas practicables y comunicaciones según el plan?'], ['Gestión del grupo', '¿Gestioné las diferencias de nivel, las tensiones y la participación con respeto?'], ['Interpretación', '¿Los contenidos fueron breves, rigurosos, contextualizados y compatibles con la marcha?'], ['Colaboración local', '¿Los roles y las aportaciones del guía local estuvieron bien coordinados?'], ['Impacto ambiental y cultural', '¿Apliqué los acuerdos locales y prevení impactos evitables?'], ['Evaluación', '¿Completé los registros y los usé para adaptar los días siguientes?']],
  fact: 'Hecho concreto y cambio que haría', avg: 'Media',
  close: [['Punto fuerte, con ejemplo'], ['Decisión que haría diferente y motivo'], ['Aprendizaje o práctica que necesito antes de la siguiente edición'], ['Aportación del guía local'], ['Acción prioritaria, responsable y plazo']],
  enqTitle: 'Encuesta del cliente', enqText: 'Encuesta anónima y voluntaria, en catalán, castellano, inglés y francés (unos 3 minutos). Se ofrece al terminar el servicio, cuando el grupo ha podido descansar: los clientes escanean el QR con su móvil. Las respuestas van a una hoja de cálculo del responsable.', enqNoUrl: 'El enlace de la encuesta aún no está configurado.', enqOpen: 'Abrir la encuesta',
  confirmClear: '¿Borrar los datos de este formulario?', clear: 'Borrar', filled: 'rellenados'
},
en: {
  hAval: 'Evaluation', avalIntro: 'Daily checklist, guide self-assessment and client survey. Data are saved only on this phone; export them when you are back.',
  openCheck: 'Today’s checklist', openAuto: 'Guide self-assessment', openEnq: 'Client survey', exportCsv: 'Export CSV', printPdf: 'Print / PDF', back: '← Back', saved: 'Saved on the phone',
  checkTitle: 'Guide’s daily checklist', checkHelp: 'Fill in before setting off and complete in the evening in 5–10 minutes. Tick Yes / No / NA; any “No” that affects the activity means the decision must be recorded.',
  code: 'Departure code', date: 'Date', guide: 'Guide', stage: 'Stage',
  before: 'Before setting off', yes: 'Yes', no: 'No', na: 'NA', evidence: 'Evidence, incident or decision',
  items: ['Programme, maps and GPX available and consistent', 'Weather and local information checked, with time and source', 'Group condition assessed individually and confidentially', 'Necessary personal and group equipment checked', 'Water, food and overnight for the day checked', 'Communications, outside contact and alert procedure agreed', 'Decision points, cut-off times and alternatives reviewed', 'Roads checked (ABC and drivers, 48 h and 24 h)', 'Water sources above the mines confirmed', 'Day’s plan B, evacuation points and GPX loaded', 'SERNAP permit and registration at the rangers’ camp', 'Briefing understood; leader, back marker and head count agreed'],
  startDec: 'Start decision', decOpts: ['Planned programme', 'Modified programme', 'Do not start'], timeReason: 'Time and reason',
  record: 'Day record',
  reg: [['Times', 'Planned / actual start. Planned / actual arrival.'], ['Decision points', 'Point and time. Condition observed. Decision.'], ['Pace and stops', 'Walking time, stops, fit with the group and adjustments.'], ['Conditions', 'Weather observed, visibility and terrain; differences from the forecast.'], ['Group condition', 'Fatigue and group life, in aggregate. Personal data go to the restricted record.'], ['Interpretation and learning', 'Short content delivered and group response (done, shortened or justified omission).'], ['Incidents and changes', 'Incident ID, fact, decision and reason.'], ['Communication', 'What was communicated, to whom, at what time and confirmation of receipt.'], ['Day objective', 'Achieved, partly or not achieved, and the fact that shows it.'], ['Improvement for tomorrow', 'Concrete action, person responsible and check.']],
  dayScore: 'Overall rating of the day (1–5)', localCheck: 'Cross-check with the local guide', count: 'Final head count', closeTime: 'Closing time',
  autoTitle: 'Guide self-assessment', autoHelp: 'Fill in within 72 hours after the service, using the checklists and the cross-check with the local guide. 1, needs a lot of improvement; 2, needs improvement; 3, adequate with gaps; 4, good; 5, very good. Back each score with an observable fact.',
  aspects: [['Planning', 'Were the stages, times and load realistic for the group and the altitude?'], ['Leading', 'Did I adapt pace, stops and regrouping to the needs?'], ['Communication', 'Were instructions understood, and did I listen to input and discomfort?'], ['Decisions', 'Did I decide with information, record the reason and explain the changes?'], ['Operational preparation', 'Did I have workable alternatives and communications as planned?'], ['Group management', 'Did I handle differences in level, tensions and participation with respect?'], ['Interpretation', 'Was the content short, rigorous, in context and compatible with walking?'], ['Local collaboration', 'Were the local guide’s roles and input well coordinated?'], ['Environmental and cultural impact', 'Did I apply local agreements and prevent avoidable impacts?'], ['Evaluation', 'Did I complete the records and use them to adapt the following days?']],
  fact: 'Concrete fact and change I would make', avg: 'Average',
  close: [['Strength, with an example'], ['Decision I would make differently, and why'], ['Learning or practice I need before the next edition'], ['Local guide’s contribution'], ['Priority action, person responsible and deadline']],
  enqTitle: 'Client survey', enqText: 'Anonymous, voluntary survey in Catalan, Spanish, English and French (about 3 minutes). It is offered at the end of the service, once the group has rested: clients scan the QR code with their phone. Answers go to a spreadsheet kept by the person in charge.', enqNoUrl: 'The survey link is not set yet.', enqOpen: 'Open the survey',
  confirmClear: 'Delete the data in this form?', clear: 'Delete', filled: 'filled in'
},
fr: {
  hAval: 'Évaluation', avalIntro: 'Check-list quotidienne, auto-évaluation du guide et enquête client. Les données restent uniquement sur ce téléphone ; exporte-les au retour.',
  openCheck: 'Check-list du jour', openAuto: 'Auto-évaluation du guide', openEnq: 'Enquête client', exportCsv: 'Exporter en CSV', printPdf: 'Imprimer / PDF', back: '← Retour', saved: 'Enregistré sur le téléphone',
  checkTitle: 'Check-list quotidienne du guide', checkHelp: 'À remplir avant le départ et à compléter le soir en 5 à 10 minutes. Cocher Oui / Non / NA ; tout « Non » qui conditionne l’activité oblige à consigner la décision.',
  code: 'Code du départ', date: 'Date', guide: 'Guide', stage: 'Étape',
  before: 'Avant la marche', yes: 'Oui', no: 'Non', na: 'NA', evidence: 'Preuve, incident ou décision',
  items: ['Programme, cartographie et GPX disponibles et cohérents', 'Météo et informations locales vérifiées, avec heure et source', 'État du groupe évalué de façon individuelle et confidentielle', 'Matériel personnel et collectif nécessaire vérifié', 'Eau, repas et nuit de la journée vérifiés', 'Communications, contact extérieur et procédure d’alerte convenus', 'Points de décision, heures limites et alternatives revus', 'Routes consultées (ABC et transporteurs, 48 h et 24 h)', 'Sources d’eau en amont des mines confirmées', 'Plan B de la journée, points d’évacuation et GPX chargés', 'Permis du SERNAP et enregistrement au camp des gardes', 'Briefing compris ; tête, serre-file et comptage convenus'],
  startDec: 'Décision de départ', decOpts: ['Programme prévu', 'Programme modifié', 'Ne pas partir'], timeReason: 'Heure et motif',
  record: 'Registre de la journée',
  reg: [['Horaires', 'Départ prévu / réel. Arrivée prévue / réelle.'], ['Points de décision', 'Point et heure. Condition observée. Décision.'], ['Rythme et pauses', 'Temps de marche, pauses, adaptation au groupe et ajustements.'], ['Conditions', 'Météo observée, visibilité et terrain ; écarts par rapport à la prévision.'], ['État du groupe', 'Fatigue et vie de groupe, de façon globale. Les données personnelles vont au registre restreint.'], ['Interprétation et apprentissage', 'Contenu bref réalisé et réponse du groupe (réalisé, réduit ou omission justifiée).'], ['Incidents et changements', 'Identifiant de l’incident, fait, décision et motif.'], ['Communication', 'Ce qui a été communiqué, à qui, à quelle heure et confirmation de réception.'], ['Objectif de la journée', 'Atteint, partiel ou non atteint, et fait qui le justifie.'], ['Amélioration pour le lendemain', 'Action concrète, responsable et vérification.']],
  dayScore: 'Note globale de la journée (1–5)', localCheck: 'Contrôle croisé avec le guide local', count: 'Comptage final', closeTime: 'Heure de clôture',
  autoTitle: 'Auto-évaluation du guide', autoHelp: 'À remplir dans les 72 heures après le service, avec les check-lists et le contrôle croisé avec le guide local. 1, beaucoup à améliorer ; 2, à améliorer ; 3, correct avec des lacunes ; 4, bien ; 5, très bien. Justifier chaque note par un fait observable.',
  aspects: [['Planification', 'Les étapes, les temps et la charge étaient-ils réalistes pour le groupe et l’altitude ?'], ['Conduite', 'Ai-je adapté le rythme, les pauses et les regroupements aux besoins ?'], ['Communication', 'Les consignes ont-elles été comprises et ai-je écouté les apports et le mal-être ?'], ['Décisions', 'Ai-je décidé avec des informations, noté le motif et expliqué les changements ?'], ['Préparation opérationnelle', 'Avais-je des alternatives praticables et les communications prévues ?'], ['Gestion du groupe', 'Ai-je géré les différences de niveau, les tensions et la participation avec respect ?'], ['Interprétation', 'Les contenus étaient-ils brefs, rigoureux, contextualisés et compatibles avec la marche ?'], ['Collaboration locale', 'Les rôles et les apports du guide local étaient-ils bien coordonnés ?'], ['Impact environnemental et culturel', 'Ai-je appliqué les accords locaux et évité les impacts évitables ?'], ['Évaluation', 'Ai-je complété les registres et les ai-je utilisés pour adapter les jours suivants ?']],
  fact: 'Fait concret et changement que je ferais', avg: 'Moyenne',
  close: [['Point fort, avec un exemple'], ['Décision que je prendrais autrement, et pourquoi'], ['Apprentissage ou pratique nécessaire avant la prochaine édition'], ['Apport du guide local'], ['Action prioritaire, responsable et délai']],
  enqTitle: 'Enquête client', enqText: 'Enquête anonyme et volontaire, en catalan, espagnol, anglais et français (environ 3 minutes). Elle est proposée à la fin du service, une fois le groupe reposé : les clients scannent le QR code avec leur téléphone. Les réponses arrivent dans un tableur du responsable.', enqNoUrl: 'Le lien de l’enquête n’est pas encore configuré.', enqOpen: 'Ouvrir l’enquête',
  confirmClear: 'Effacer les données de ce formulaire ?', clear: 'Effacer', filled: 'remplis'
}};

const aval = (() => {
  let D = store.get('aval', { check: {}, auto: {} });
  const A2 = () => AV[L] || AV.ca;
  const desa = () => { store.set('aval', D); const s = $('#avStat'); if (s) { s.textContent = A2().saved + ' · ' + hhmm(nowMin()); } };
  const v = x => esc(x ?? '');
  const tri = (name, val) => `<span class="tri">${[['si', A2().yes], ['no', A2().no], ['na', A2().na]].map(([k, t]) => `<label class="${val === k ? 'on ' + k : ''}"><input type="radio" name="${name}" value="${k}" ${val === k ? 'checked' : ''}>${t}</label>`).join('')}</span>`;
  const nota = (name, val) => `<span class="tri">${[1, 2, 3, 4, 5].map(n => `<label class="${+val === n ? 'on si' : ''}"><input type="radio" name="${name}" value="${n}" ${+val === n ? 'checked' : ''}>${n}</label>`).join('')}</span>`;
  const camp = (k, lab, val, type) => `<label class="fld">${lab}<input data-av="${k}" ${type ? `type="${type}"` : ''} value="${v(val)}"></label>`;
  const area = (k, lab, val, help) => `<label class="fld">${lab}${help ? `<span class="small mut" style="display:block">${help}</span>` : ''}<textarea data-av="${k}" rows="2">${v(val)}</textarea></label>`;
  const jId = () => J.id;
  const C = () => (D.check[jId()] = D.check[jId()] || { data: dataIso(J.dia), etapa: J.tipus === 'A' ? 'D' + J.dia : J.codi, items: {}, reg: {} });

  function pintaCheck() {
    const t = A2(), c = C();
    $('#avBody').innerHTML = `<h2>${t.checkTitle}</h2><p class="small mut">${t.checkHelp}</p>
      <div class="grid2">${camp('c.codi', t.code, c.codi ?? store.get('codiSortida', ''))}${camp('c.data', t.date, c.data, 'date')}${camp('c.etapa', t.stage, c.etapa)}${camp('c.guia', t.guide, c.guia ?? store.get('guiaNom', ''))}</div>
      <h3>${t.before}</h3>
      ${t.items.map((x, i) => { const it = c.items[i] || {}; return `<div class="avi"><div class="small"><b>${i + 1}.</b> ${esc(x)}</div>${tri('ci' + i, it.v)}<input data-av="ci.${i}" placeholder="${t.evidence}" value="${v(it.e)}"></div>`; }).join('')}
      <h3>${t.startDec}</h3><span class="tri">${t.decOpts.map((x, i) => `<label class="${c.dec == i ? 'on si' : ''}"><input type="radio" name="cdec" value="${i}" ${c.dec == i ? 'checked' : ''}>${x}</label>`).join('')}</span>
      ${area('c.motiu', t.timeReason, c.motiu)}
      <h3>${t.record}</h3>${t.reg.map(([h, p], i) => area('cr.' + i, `<b>${h}</b>`, c.reg[i], p)).join('')}
      <div class="grid2"><label class="fld">${t.dayScore}${nota('cval', c.val)}</label>${camp('c.contrast', t.localCheck, c.contrast)}${camp('c.recompte', t.count, c.recompte, 'number')}${camp('c.tancament', t.closeTime, c.tancament, 'time')}</div>
      <div class="row"><button class="btn sm" data-avclear="check">${t.clear}</button><span class="small mut" id="avStat"></span></div>`;
  }
  function pintaAuto() {
    const t = A2(), a = D.auto; a.items = a.items || {};
    const ns = Object.values(a.items).map(x => +x.v).filter(Boolean), mitj = ns.length ? dec(ns.reduce((p, q) => p + q, 0) / ns.length) : '–';
    $('#avBody').innerHTML = `<h2>${t.autoTitle}</h2><p class="small mut">${t.autoHelp}</p>
      <div class="grid2">${camp('a.codi', t.code, a.codi ?? store.get('codiSortida', ''))}${camp('a.guia', t.guide, a.guia ?? store.get('guiaNom', ''))}${camp('a.data', t.date, a.data, 'date')}<div class="kv"><b>${mitj}</b><span>${t.avg} (${ns.length}/10)</span></div></div>
      ${t.aspects.map(([h, q], i) => { const it = a.items[i] || {}; return `<div class="avi"><div class="small"><b>${esc(h)}.</b> ${esc(q)}</div>${nota('ai' + i, it.v)}<input data-av="ai.${i}" placeholder="${t.fact}" value="${v(it.f)}"></div>`; }).join('')}
      ${t.close.map(([h], i) => area('ac.' + i, `<b>${h}</b>`, (a.close || {})[i])).join('')}
      <div class="row"><button class="btn sm" data-avclear="auto">${t.clear}</button><span class="small mut" id="avStat"></span></div>`;
  }
  function pintaEnq() {
    const t = A2();
    $('#avBody').innerHTML = `<h2>${t.enqTitle}</h2><p class="small">${t.enqText}</p>` + (ENQUESTA.url
      ? `<img src="${ENQUESTA.qr}" alt="QR" style="width:240px;max-width:80%;display:block;margin:10px auto;background:#fff;padding:10px;border-radius:12px"><p style="text-align:center"><a class="btn ac" href="${ENQUESTA.url}" target="_blank" rel="noopener">${t.enqOpen}</a></p><p class="small mut" style="word-break:break-all;text-align:center">${esc(ENQUESTA.url)}</p>`
      : `<p class="warn small">${t.enqNoUrl}</p>`);
  }
  let vista = null;
  function obre(qui) {
    vista = qui; $$('main section').forEach(x => x.classList.toggle('act', x.id === 's-aval')); window.scrollTo(0, 0);
    ({ check: pintaCheck, auto: pintaAuto, enq: pintaEnq })[qui]();
  }
  function onInput(e) {
    const el = e.target, k = el.dataset.av, name = el.name;
    if (!k && !name) return;
    if (vista === 'check') {
      const c = C();
      if (k) { const [g, i] = k.split('.'); if (g === 'c') { c[i] = el.value; if (i === 'codi') store.set('codiSortida', el.value); if (i === 'guia') store.set('guiaNom', el.value); } else if (g === 'ci') (c.items[i] = c.items[i] || {}).e = el.value; else if (g === 'cr') c.reg[i] = el.value; }
      else if (name.startsWith('ci')) { (c.items[name.slice(2)] = c.items[name.slice(2)] || {}).v = el.value; marca(el); }
      else if (name === 'cdec') { c.dec = el.value; marca(el); } else if (name === 'cval') { c.val = el.value; marca(el); }
    } else if (vista === 'auto') {
      const a = D.auto; a.items = a.items || {}; a.close = a.close || {};
      if (k) { const [g, i] = k.split('.'); if (g === 'a') { a[i] = el.value; if (i === 'codi') store.set('codiSortida', el.value); if (i === 'guia') store.set('guiaNom', el.value); } else if (g === 'ai') (a.items[i] = a.items[i] || {}).f = el.value; else if (g === 'ac') a.close[i] = el.value; }
      else if (name.startsWith('ai')) { (a.items[name.slice(2)] = a.items[name.slice(2)] || {}).v = el.value; desa(); pintaAuto(); return; }
    }
    desa(); resum();
  }
  function marca(el) { el.closest('.tri').querySelectorAll('label').forEach(l => l.className = ''); el.parentNode.className = 'on ' + (el.value === 'no' ? 'no' : el.value === 'na' ? 'na' : 'si'); }

  // ---- exportar ----
  const q = s => '"' + String(s ?? '').replace(/"/g, '""') + '"';
  function csv() {
    const t = A2(), rows = [['tipus', 'codi', 'data', 'etapa', 'guia', 'apartat', 'valor', 'text']];
    const etiqueta = id => { const x = JORN.find(j => j.id === id); return x ? (x.tipus === 'A' ? 'D' + x.dia : x.codi) : id; };
    for (const id in D.check) {
      const c = D.check[id], base = ['checklist', c.codi, c.data, c.etapa || etiqueta(id), c.guia];
      t.items.forEach((x, i) => rows.push([...base, x, (c.items[i] || {}).v, (c.items[i] || {}).e]));
      rows.push([...base, t.startDec, c.dec != null ? t.decOpts[c.dec] : '', c.motiu]);
      t.reg.forEach(([h], i) => rows.push([...base, h, '', c.reg[i]]));
      rows.push([...base, t.dayScore, c.val, c.contrast]); rows.push([...base, t.count, c.recompte, c.tancament]);
    }
    const a = D.auto;
    if (a && (a.items || a.close)) {
      const base = ['autoavaluacio', a.codi, a.data, '', a.guia];
      t.aspects.forEach(([h], i) => rows.push([...base, h, ((a.items || {})[i] || {}).v, ((a.items || {})[i] || {}).f]));
      t.close.forEach(([h], i) => rows.push([...base, h, '', (a.close || {})[i]]));
    }
    const blob = new Blob(['﻿' + rows.map(r => r.map(q).join(';')).join('\r\n')], { type: 'text/csv' });
    const el = document.createElement('a'); el.href = URL.createObjectURL(blob); el.download = 'Apolobamba_Avaluacio_' + (store.get('codiSortida', '') || isoUTC(botAra())) + '.csv'; document.body.append(el); el.click(); el.remove();
  }
  function imprimeix() {
    const t = A2(), w = window.open('', '_blank'); if (!w) return;
    const h = s => esc(s ?? '');
    let html = `<!doctype html><meta charset="utf-8"><title>Andes Wild Trek · Apolobamba · ${h(t.hAval)}</title><style>body{font:11pt/1.4 system-ui,sans-serif;margin:16mm;color:#111}h1{font-size:16pt}h2{font-size:13pt;margin-top:8mm;page-break-before:always}h2:first-of-type{page-break-before:auto}table{border-collapse:collapse;width:100%;font-size:9.5pt}td,th{border:1px solid #bbb;padding:4px;vertical-align:top;text-align:left}th{background:#eee}</style><h1>Andes Wild Trek · Apolobamba · ${h(t.hAval)}</h1>`;
    for (const id in D.check) {
      const c = D.check[id];
      html += `<h2>${h(t.checkTitle)} · ${h(c.etapa)} · ${h(c.data)}</h2><p>${h(t.code)}: ${h(c.codi)} · ${h(t.guide)}: ${h(c.guia)}</p><table><tr><th>${h(t.before)}</th><th>${h(t.yes)}/${h(t.no)}/${h(t.na)}</th><th>${h(t.evidence)}</th></tr>${t.items.map((x, i) => `<tr><td>${h(x)}</td><td>${h(({ si: t.yes, no: t.no, na: t.na })[(c.items[i] || {}).v] || '')}</td><td>${h((c.items[i] || {}).e)}</td></tr>`).join('')}</table>
        <p><b>${h(t.startDec)}:</b> ${h(c.dec != null ? t.decOpts[c.dec] : '')} · ${h(c.motiu)}</p><table>${t.reg.map(([x], i) => `<tr><th style="width:30%">${h(x)}</th><td>${h(c.reg[i])}</td></tr>`).join('')}</table>
        <p><b>${h(t.dayScore)}:</b> ${h(c.val)} · <b>${h(t.localCheck)}:</b> ${h(c.contrast)} · <b>${h(t.count)}:</b> ${h(c.recompte)} · <b>${h(t.closeTime)}:</b> ${h(c.tancament)}</p>`;
    }
    const a = D.auto;
    if (a && (a.items || a.close)) html += `<h2>${h(t.autoTitle)}</h2><p>${h(t.code)}: ${h(a.codi)} · ${h(t.guide)}: ${h(a.guia)} · ${h(t.date)}: ${h(a.data)}</p><table><tr><th></th><th>1–5</th><th>${h(t.fact)}</th></tr>${t.aspects.map(([x, y], i) => `<tr><td><b>${h(x)}</b><br>${h(y)}</td><td>${h(((a.items || {})[i] || {}).v)}</td><td>${h(((a.items || {})[i] || {}).f)}</td></tr>`).join('')}</table><table>${t.close.map(([x], i) => `<tr><th style="width:35%">${h(x)}</th><td>${h((a.close || {})[i])}</td></tr>`).join('')}</table>`;
    w.document.write(html); w.document.close(); setTimeout(() => w.print(), 300);
  }
  function resum() {
    const t = A2(), n = Object.values(D.check).filter(c => Object.keys(c.items || {}).length).length, na = Object.keys((D.auto || {}).items || {}).length;
    const e = $('#avResum'); if (e) e.textContent = `${t.checkTitle}: ${n} ${t.filled} · ${t.autoTitle}: ${na}/10`;
  }
  function pintaCard() {
    const t = A2();
    $('#avalCard').innerHTML = `<h2>${t.hAval}</h2><p class="small">${t.avalIntro}</p>
      <div class="row"><button class="btn sm ac" data-aval="check">${t.openCheck} (${J.tipus === 'A' ? T('dayShort') + ' ' + J.dia : J.codi})</button><button class="btn sm ac" data-aval="auto">${t.openAuto}</button><button class="btn sm ac" data-aval="enq">${t.openEnq}</button></div>
      <div class="row" style="margin-top:8px"><button class="btn sm" data-avexp="csv">${t.exportCsv}</button><button class="btn sm" data-avexp="pdf">${t.printPdf}</button></div>
      <p class="small mut" id="avResum" style="margin:8px 0 0"></p>`;
    $('#avBack').textContent = t.back; resum();
  }
  return {
    init() {
      pintaCard();
      document.addEventListener('click', e => {
        const b = e.target.closest('[data-aval],[data-avexp],[data-avclear],#avBack'); if (!b) return;
        if (b.id === 'avBack') { vista = null; mostra('info'); }
        else if (b.dataset.aval) obre(b.dataset.aval);
        else if (b.dataset.avexp === 'csv') csv(); else if (b.dataset.avexp === 'pdf') imprimeix();
        else if (b.dataset.avclear && confirm(A2().confirmClear)) { if (b.dataset.avclear === 'check') delete D.check[jId()]; else D.auto = {}; desa(); obre(b.dataset.avclear); resum(); }
      });
      $('#s-aval').addEventListener('input', onInput); $('#s-aval').addEventListener('change', onInput);
    },
    obre,
    pinta() { pintaCard(); if (vista && $('#s-aval').classList.contains('act')) obre(vista); }
  };
})();
window.aval = aval;
