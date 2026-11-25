#!/usr/bin/env node
/* Genera el dossier complet del viatge (PDF) en català i castellà, amb les dades de content.js i el track de guia/track.js.
   És el document que s'envia al client quan contacta; no s'enllaça des de la web.
   Executa-ho des de l'arrel del repositori:  node tools/dossier.js
   Crea dossiers/client/Dossier_Viatge_CA.pdf i dossiers/client/Dossier_Viaje_ES.pdf */
const fs = require('fs'), path = require('path'), vm = require('vm'), os = require('os');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const ctx = { window: {} }; ctx.window = ctx; vm.createContext(ctx);
for (const f of ['content.js', 'guia/track.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx);
const { COPY, DAYS, TRACK, PLANS } = ctx;
vm.runInContext(fs.readFileSync(path.join(ROOT, 'photo-credits.js'), 'utf8'), ctx);
const PH = ctx.STAGE_PHOTOS || []; // una foto per jornada (Wikimedia Commons, assets/jornada-N.webp)
const CONTACT = (fs.readFileSync(path.join(ROOT, 'extras.js'), 'utf8').match(/whatsapp:\s*'(\d+)'/) || [])[1] || '';

let IMG = '';
const LANGS = ['ca', 'es', 'en', 'fr'];
let CUR = 'ca';
const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ({ en: ',', fr: '\u202f' })[CUR] || '.');
const dec = n => n.toFixed(1).replace('.', CUR === 'en' ? '.' : ',');
const hm = v => CUR === 'ca' ? v : CUR === 'fr' ? String(v).replace(/(\d\d)\.(\d\d)/g, '$1 h $2') : String(v).replace(/(\d\d)\.(\d\d)/g, '$1:$2');
const esc = s => String(s);

const D = {
  ca: {
    file: 'Dossier_Viatge_CA.pdf', title: 'Dossier del viatge', sub: 'Travessa Pelechuco → Charazani · Serralada d’Apolobamba, Bolívia',
    date: 'Proposta de dates: juny de 2027 · Document de novembre de 2026',
    notice: 'Aquest dossier presenta un projecte acadèmic de tècnic esportiu en mitja muntanya (TD2). Les reserves encara no estan obertes. El recorregut està planificat sobre un registre GPS de 2012, posat al dia amb relats de 2022–2025, operadors bolivians i OpenStreetMap, però encara no s’ha reconegut sobre el terreny: distàncies, desnivells i horaris són de planificació.',
    toc: 'Contingut', tocItems: ['El viatge en xifres', 'Programa dia a dia', 'Perfil de la travessa', 'Les sis jornades, punt a punt', 'Quan anar-hi i plans alternatius', 'Clima i meteorologia', 'Altitud i salut', 'Allotjament, àpats i equipatge', 'Material', 'Preu i condicions', 'Contacte'],
    figures: 'El viatge en xifres', programme: 'Programa dia a dia', profile: 'Perfil de la travessa',
    profileText: 'Altitud al llarg dels 53,4 km de camí. Les tendes marquen on dormim. El punt més alt és el pas Sunchulli (5.032 m), el dia 7.',
    stages: 'Les sis jornades, punt a punt', stagesText: 'Per a cada jornada: dades, horari previst, punts de pas i mapa topogràfic.',
    cols: ['Km', 'Punt', 'Altitud', 'Hora prevista'], plate: 'Mapa de la jornada', mapCredit: 'Mapa: OpenTopoMap · dades © OpenStreetMap i SRTM · CC-BY-SA. Track: Gallotrekk, Wikiloc (2012).',
    plans: 'Quan anar-hi i plans alternatius', planCHead: 'El pla C, etapa per etapa', planCMaps: 'Mapes del pla C', cStage: 'Etapa', dayW: 'Dia', nightW: 'Nit',
    weather: 'Clima i meteorologia',
    climate: [['Juny, estació seca', 'Dies sovint assolellats i sol intens per l’altitud. Pluja poc freqüent.'], ['Nits fredes', 'Sota zero als campaments; als més alts poden baixar de −10 °C.'], ['Vent i neu puntual', 'Pot fer vent fort als passos i, de manera puntual, nevar. Amb neu dura o gel al pas Sunchulli, no es creua.'], ['Llum', 'Al juny surt el sol cap a les 06.55–07.00 i es pon cap a les 18.15. Caminem de les 07.10 a les 16.40 com a màxim.']],
    forecastTitle: 'Com seguim la previsió',
    forecast: 'El guia consulta la previsió 48 i 24 hores abans de la travessa i cada matí, i n’apunta la font i l’hora. A la muntanya no hi ha cobertura mòbil: la previsió durant la travessa arriba pel Garmin inReach (comunicador satèl·lit) i per la informació del guia local. Si la previsió no és bona, s’usen els dies de reserva.',
    whereTitle: 'Si la vols mirar tu abans de viatjar',
    where: [['SENAMHI', 'Servei oficial de meteorologia de Bolívia: previsions i avisos.', 'senamhi.gob.bo'], ['Windy', 'Previsió per hores al punt exacte (vent, núvols, isoterma de 0 °C). Busca Pelechuco o el pas Sunchulli.', 'windy.com'], ['Meteoblue', 'Previsió de 7–14 dies per a Pelechuco o Charazani, amb gràfics clars.', 'meteoblue.com']],
    altitude: 'Altitud i salut', lodging: 'Allotjament, àpats i equipatge',
    lodgingItems: [['La Paz', 'Hotel, tres nits (≈3.650 m) per aclimatar-nos.'], ['Pelechuco i Charazani', 'Allotjament local senzill.'], ['Cinc nits en tenda', 'Entre 4.010 i 4.700 m. Tendes, cuina i material col·lectiu inclosos.'], ['Àpats', 'Tots els del programa. Avisa’ns d’al·lèrgies o dietes especials.'], ['Equipatge', 'Les mules porten tendes, cuina i una bossa tova amb el teu equipatge. Tu portes una motxilla de dia de 25–35 litres. El límit de pes es confirmarà en reservar.'], ['Aigua', 'Hi ha mineria d’or a la zona i tractar l’aigua no n’elimina els metalls: l’agafem de fonts per sobre de les mines o confirmades per la comunitat, la tractem sempre i en portem de reserva al tram de Sunchulli.']],
    gear: 'Material', price: 'Preu i condicions', included: 'Què inclou', excluded: 'Què no inclou',
    contact: 'Contacte', contactText: 'Per a qualsevol dubte, escriu al guia per WhatsApp. Abans de reservar fem una conversa per valorar la teva experiència, l’altitud i les teves expectatives.',
    guide: 'Izan Pimentel Pérez · Guia de muntanya · Andes Wild Trek', web: 'Web del viatge', page: 'Pàgina',
  },
  es: {
    file: 'Dossier_Viaje_ES.pdf', title: 'Dossier del viaje', sub: 'Travesía Pelechuco → Charazani · Cordillera de Apolobamba, Bolivia',
    date: 'Propuesta de fechas: junio de 2027 · Documento de noviembre de 2026',
    notice: 'Este dossier presenta un proyecto académico de técnico deportivo en media montaña (TD2). Las reservas todavía no están abiertas. El recorrido está planificado sobre un registro GPS de 2012, puesto al día con relatos de 2022–2025, operadores bolivianos y OpenStreetMap, pero todavía no se ha reconocido sobre el terreno: distancias, desniveles y horarios son de planificación.',
    toc: 'Contenido', tocItems: ['El viaje en cifras', 'Programa día a día', 'Perfil de la travesía', 'Las seis jornadas, punto a punto', 'Cuándo ir y planes alternativos', 'Clima y meteorología', 'Altitud y salud', 'Alojamiento, comidas y equipaje', 'Material', 'Precio y condiciones', 'Contacto'],
    figures: 'El viaje en cifras', programme: 'Programa día a día', profile: 'Perfil de la travesía',
    profileText: 'Altitud a lo largo de los 53,4 km de camino. Las tiendas marcan dónde dormimos. El punto más alto es el paso Sunchulli (5.032 m), el día 7.',
    stages: 'Las seis jornadas, punto a punto', stagesText: 'Para cada jornada: datos, horario previsto, puntos de paso y mapa topográfico.',
    cols: ['Km', 'Punto', 'Altitud', 'Hora prevista'], plate: 'Mapa de la jornada', mapCredit: 'Mapa: OpenTopoMap · datos © OpenStreetMap y SRTM · CC-BY-SA. Track: Gallotrekk, Wikiloc (2012).',
    plans: 'Cuándo ir y planes alternativos', planCHead: 'El plan C, etapa por etapa', planCMaps: 'Mapas del plan C', cStage: 'Etapa', dayW: 'Día', nightW: 'Noche',
    weather: 'Clima y meteorología',
    climate: [['Junio, estación seca', 'Días a menudo soleados y sol intenso por la altitud. Lluvia poco frecuente.'], ['Noches frías', 'Bajo cero en los campamentos; en los más altos pueden bajar de −10 °C.'], ['Viento y nieve puntual', 'Puede hacer viento fuerte en los pasos y, de forma puntual, nevar. Con nieve dura o hielo en el paso Sunchulli, no se cruza.'], ['Luz', 'En junio sale el sol hacia las 06:55–07:00 y se pone hacia las 18:15. Caminamos de las 07:10 a las 16:40 como máximo.']],
    forecastTitle: 'Cómo seguimos la previsión',
    forecast: 'El guía consulta la previsión 48 y 24 horas antes de la travesía y cada mañana, y anota la fuente y la hora. En la montaña no hay cobertura móvil: la previsión durante la travesía llega por el Garmin inReach (comunicador satélite) y por la información del guía local. Si la previsión no es buena, se usan los días de reserva.',
    whereTitle: 'Si quieres mirarla tú antes de viajar',
    where: [['SENAMHI', 'Servicio oficial de meteorología de Bolivia: previsiones y avisos.', 'senamhi.gob.bo'], ['Windy', 'Previsión por horas en el punto exacto (viento, nubes, isoterma de 0 °C). Busca Pelechuco o el paso Sunchulli.', 'windy.com'], ['Meteoblue', 'Previsión de 7–14 días para Pelechuco o Charazani, con gráficos claros.', 'meteoblue.com']],
    altitude: 'Altitud y salud', lodging: 'Alojamiento, comidas y equipaje',
    lodgingItems: [['La Paz', 'Hotel, tres noches (≈3.650 m) para aclimatarnos.'], ['Pelechuco y Charazani', 'Alojamiento local sencillo.'], ['Cinco noches en tienda', 'Entre 4.010 y 4.700 m. Tiendas, cocina y material colectivo incluidos.'], ['Comidas', 'Todas las del programa. Avísanos de alergias o dietas especiales.'], ['Equipaje', 'Las mulas llevan tiendas, cocina y una bolsa blanda con tu equipaje. Tú llevas una mochila de día de 25–35 litros. El límite de peso se confirmará al reservar.'], ['Agua', 'Hay minería de oro en la zona y tratar el agua no elimina los metales: la cogemos de fuentes por encima de las minas o confirmadas por la comunidad, la tratamos siempre y llevamos de reserva en el tramo de Sunchulli.']],
    gear: 'Material', price: 'Precio y condiciones', included: 'Qué incluye', excluded: 'Qué no incluye',
    contact: 'Contacto', contactText: 'Para cualquier duda, escribe al guía por WhatsApp. Antes de reservar hacemos una conversación para valorar tu experiencia, la altitud y tus expectativas.',
    guide: 'Izan Pimentel Pérez · Guía de montaña · Andes Wild Trek', web: 'Web del viaje', page: 'Página',
  },
  en: {"file": "Travel_Dossier_EN.pdf", "title": "Trip dossier", "sub": "Pelechuco → Charazani trek · Cordillera Apolobamba, Bolivia", "date": "Proposed dates: June 2027 · Document of November 2026", "notice": "This dossier presents an academic project for a mid-mountain sports technician qualification (TD2). Bookings are not open yet. The route is planned on a 2012 GPS track, brought up to date with accounts from 2022–2025, Bolivian operators and OpenStreetMap, but it has not yet been checked on the ground: distances, height gains and times are planning figures.", "toc": "Contents", "tocItems": ["The trip in figures", "Day-by-day programme", "Trek profile", "The six days, point by point", "When to go and alternative plans", "Climate and weather", "Altitude and health", "Accommodation, meals and luggage", "Gear", "Price and conditions", "Contact"], "figures": "The trip in figures", "programme": "Day-by-day programme", "profile": "Trek profile", "profileText": "Altitude along the 53.4 km of trail. The tents mark where we sleep. The highest point is the Sunchulli Pass (5,032 m), on day 7.", "stages": "The six days, point by point", "stagesText": "For each day: figures, planned times, waypoints and topographic map.", "cols": ["Km", "Point", "Altitude", "Planned time"], "plate": "Map of the day", "mapCredit": "Map: OpenTopoMap · data © OpenStreetMap and SRTM · CC-BY-SA. Track: Gallotrekk, Wikiloc (2012).", "plans": "When to go and alternative plans", "planCHead": "Plan C, stage by stage", "planCMaps": "Plan C maps", "cStage": "Stage", "dayW": "Day", "nightW": "Night", "weather": "Climate and weather", "climate": [["June, dry season", "Often sunny days and strong sun because of the altitude. Rain is infrequent."], ["Cold nights", "Below zero at the camps; at the highest ones it can drop below −10 °C."], ["Wind and occasional snow", "There can be strong wind on the passes and, occasionally, snow. With hard snow or ice on the Sunchulli Pass, we do not cross."], ["Daylight", "In June the sun rises around 06:55–07:00 and sets around 18:15. We walk from 07:10 until 16:40 at the latest."]], "forecastTitle": "How we follow the forecast", "forecast": "The guide checks the forecast 48 and 24 hours before the trek and every morning, noting the source and time. There is no mobile coverage in the mountains: during the trek the forecast comes via the Garmin inReach satellite communicator and from the local guide. If the forecast is not good, the reserve days are used.", "whereTitle": "If you want to check it before travelling", "where": [["SENAMHI", "Bolivia’s official weather service: forecasts and warnings.", "senamhi.gob.bo"], ["Windy", "Hourly forecast at the exact point (wind, clouds, freezing level). Search for Pelechuco or the Sunchulli Pass.", "windy.com"], ["Meteoblue", "7–14 day forecast for Pelechuco or Charazani, with clear charts.", "meteoblue.com"]], "altitude": "Altitude and health", "lodging": "Accommodation, meals and luggage", "lodgingItems": [["La Paz", "Hotel, three nights (≈3,650 m) to acclimatise."], ["Pelechuco and Charazani", "Simple local lodging."], ["Five nights in tents", "Between 4,010 and 4,700 m. Tents, kitchen and group equipment included."], ["Meals", "All those in the programme. Tell us about allergies or special diets."], ["Luggage", "Mules carry tents, kitchen and a soft bag with your luggage. You carry a 25–35 litre daypack. The weight limit will be confirmed on booking."], ["Water", "There is gold mining in the area and treating water does not remove metals: we take it from springs above the mines or confirmed by the community, always treat it and carry a reserve on the Sunchulli section."]], "gear": "Gear", "price": "Price and conditions", "included": "What’s included", "excluded": "What’s not included", "contact": "Contact", "contactText": "For any question, write to the guide on WhatsApp. Before booking we have a conversation to assess your experience, altitude and expectations.", "guide": "Izan Pimentel Pérez · Mountain guide · Andes Wild Trek", "web": "Trip website", "page": "Page"},
  fr: {"file": "Dossier_Voyage_FR.pdf", "title": "Dossier du voyage", "sub": "Trek Pelechuco → Charazani · Cordillère d’Apolobamba, Bolivie", "date": "Dates proposées : juin 2027 · Document de novembre 2026", "notice": "Ce dossier présente un projet académique de technicien sportif en moyenne montagne (TD2). Les réservations ne sont pas encore ouvertes. L’itinéraire est planifié à partir d’une trace GPS de 2012, mis à jour avec des récits de 2022–2025, des opérateurs boliviens et OpenStreetMap, mais il n’a pas encore été reconnu sur le terrain : distances, dénivelés et horaires sont prévisionnels.", "toc": "Sommaire", "tocItems": ["Le voyage en chiffres", "Programme jour par jour", "Profil du trek", "Les six journées, point par point", "Quand partir et plans alternatifs", "Climat et météo", "Altitude et santé", "Hébergement, repas et bagages", "Matériel", "Prix et conditions", "Contact"], "figures": "Le voyage en chiffres", "programme": "Programme jour par jour", "profile": "Profil du trek", "profileText": "Altitude le long des 53,4 km de chemin. Les tentes indiquent où nous dormons. Le point le plus haut est le col Sunchulli (5 032 m), le jour 7.", "stages": "Les six journées, point par point", "stagesText": "Pour chaque journée : données, horaires prévus, points de passage et carte topographique.", "cols": ["Km", "Point", "Altitude", "Heure prévue"], "plate": "Carte de la journée", "mapCredit": "Carte : OpenTopoMap · données © OpenStreetMap et SRTM · CC-BY-SA. Trace : Gallotrekk, Wikiloc (2012).", "plans": "Quand partir et plans alternatifs", "planCHead": "Le plan C, étape par étape", "planCMaps": "Cartes du plan C", "cStage": "Étape", "dayW": "Jour", "nightW": "Nuit", "weather": "Climat et météo", "climate": [["Juin, saison sèche", "Journées souvent ensoleillées et soleil intense à cause de l’altitude. Pluie peu fréquente."], ["Nuits froides", "Sous zéro aux camps ; aux plus hauts, il peut faire moins de −10 °C."], ["Vent et neige ponctuelle", "Il peut y avoir un vent fort sur les cols et, ponctuellement, de la neige. Avec de la neige dure ou de la glace au col Sunchulli, on ne passe pas."], ["Lumière", "En juin, le soleil se lève vers 06 h 55–07 h 00 et se couche vers 18 h 15. Nous marchons de 07 h 10 à 16 h 40 au plus tard."]], "forecastTitle": "Comment nous suivons la prévision", "forecast": "Le guide consulte la prévision 48 et 24 heures avant le trek et chaque matin, en notant la source et l’heure. Il n’y a pas de réseau mobile en montagne : pendant le trek, la prévision arrive par le communicateur satellite Garmin inReach et par le guide local. Si la prévision n’est pas bonne, on utilise les jours de réserve.", "whereTitle": "Si vous voulez la consulter avant de partir", "where": [["SENAMHI", "Service météorologique officiel de Bolivie : prévisions et alertes.", "senamhi.gob.bo"], ["Windy", "Prévision heure par heure au point exact (vent, nuages, isotherme 0 °C). Cherchez Pelechuco ou le col Sunchulli.", "windy.com"], ["Meteoblue", "Prévision à 7–14 jours pour Pelechuco ou Charazani, avec des graphiques clairs.", "meteoblue.com"]], "altitude": "Altitude et santé", "lodging": "Hébergement, repas et bagages", "lodgingItems": [["La Paz", "Hôtel, trois nuits (≈3 650 m) pour s’acclimater."], ["Pelechuco et Charazani", "Hébergement local simple."], ["Cinq nuits sous tente", "Entre 4 010 et 4 700 m. Tentes, cuisine et matériel collectif inclus."], ["Repas", "Tous ceux du programme. Signalez-nous allergies ou régimes particuliers."], ["Bagages", "Les mules portent les tentes, la cuisine et un sac souple avec vos bagages. Vous portez un sac de journée de 25–35 litres. La limite de poids sera confirmée à la réservation."], ["Eau", "Il y a des mines d’or dans la zone et traiter l’eau n’élimine pas les métaux : nous la prenons à des sources au-dessus des mines ou confirmées par la communauté, la traitons toujours et en portons une réserve sur le tronçon de Sunchulli."]], "gear": "Matériel", "price": "Prix et conditions", "included": "Ce qui est inclus", "excluded": "Ce qui n’est pas inclus", "contact": "Contact", "contactText": "Pour toute question, écrivez au guide sur WhatsApp. Avant de réserver, nous échangeons pour évaluer votre expérience, l’altitude et vos attentes.", "guide": "Izan Pimentel Pérez · Guide de montagne · Andes Wild Trek", "web": "Site du voyage", "page": "Page"}
};

function profileSvg(L) {
  const P = TRACK.pts, TOT = P[P.length - 1][3], W = 1000, H = 300, l = 52, r = 14, t = 18, b = 40, LO = 2900, HI = 5200;
  const x = k => l + (W - l - r) * k / TOT, y = e => t + (H - t - b) * (1 - (e - LO) / (HI - LO));
  const line = P.map(p => `${x(p[3]).toFixed(1)},${y(p[2]).toFixed(1)}`).join(' ');
  const grid = [3000, 3500, 4000, 4500, 5000].map(e => `<line x1="${l}" x2="${W - r}" y1="${y(e)}" y2="${y(e)}" stroke="#163e33" stroke-opacity=".14"/><text x="${l - 7}" y="${y(e) + 4}" text-anchor="end" font-size="12" fill="#5b6b64">${fmt(e)}</text>`).join('');
  const bands = TRACK.cut.slice(0, -1).map((c, i) => { const k0 = P[c][3], k1 = P[TRACK.cut[i + 1]][3]; return `<rect x="${x(k0)}" y="${t}" width="${x(k1) - x(k0)}" height="${H - t - b}" fill="#163e33" fill-opacity="${i % 2 ? .06 : 0}"/><text x="${(x(k0) + x(k1)) / 2}" y="${H - 14}" text-anchor="middle" font-size="12" font-weight="600" fill="#163e33">${({ ca: 'Dia', es: 'Día', en: 'Day', fr: 'Jour' })[L]} ${DAYS[i].day}</text>`; }).join('');
  const nights = DAYS.map((d, i) => { const p = P[TRACK.cut[i + 1]], X = x(p[3]), Y = y(d.points[d.points.length - 1].ele) - 3; return `<path d="M${X - 7} ${Y + 6} L${X} ${Y - 7} L${X + 7} ${Y + 6} Z" fill="#e5c98d" stroke="#163e33" stroke-width="1.3"/>`; }).join('');
  const top = DAYS[2].points.find(p => p.ele === 5032), topK = 13.95;
  return `<svg viewBox="0 0 ${W} ${H}" class="profile">${bands}${grid}<polygon points="${x(0)},${H - b} ${line} ${x(TOT)},${H - b}" fill="#163e33" fill-opacity=".14"/><polyline points="${line}" fill="none" stroke="#163e33" stroke-width="2.2" stroke-linejoin="round"/>${nights}<circle cx="${x(topK)}" cy="${y(5032)}" r="5" fill="#b4573a"/><text x="${x(topK) + 9}" y="${y(5032) + 4}" font-size="13" font-weight="700" fill="#b4573a">${top[L]} · 5.032 m</text><text x="${x(0)}" y="${H - 26}" font-size="11" fill="#5b6b64">0 km</text><text x="${x(TOT)}" y="${H - 26}" font-size="11" text-anchor="end" fill="#5b6b64">${dec(TOT)} km</text></svg>`;
}

function html(L) {
  const c = COPY[L], d = D[L];
  const h2 = (n, s) => `<h2><span>${String(n).padStart(2, '0')}</span>${s}</h2>`;
  const stage = (day, i) => {
    const pts = day.points.map(p => `<tr><td>${dec(p.km)}</td><th>${p[L]}</th><td>${fmt(p.ele)} m</td><td>${hm(p.time)}</td></tr>`).join('');
    return `<section class="stage page">
      <div class="shead"><div><p class="kicker">${c.stageLabel} 0${i + 1} · ${c.dayWord} ${day.day} · ${day.hours}</p>
      <h3>${c.stageNames[i]}</h3>
      <p>${c.stageDescriptions[i]}</p></div>${PH[i] ? `<figure class="sphoto"><img src="file://${IMG}/jornada-${i + 1}-small.jpg" alt=""><figcaption>${c.stagePhotoAlt[i]}${i === 0 || i === 5 ? '' : '. ' + c.stagePhotoNote} · ${PH[i].author} · ${PH[i].license} · Wikimedia Commons</figcaption></figure>` : ''}</div>
      <dl class="metrics"><div><dt>${c.distance}</dt><dd>${dec(day.km)} km</dd></div><div><dt>${c.ascent}</dt><dd>+${fmt(day.ascent)} m</dd></div><div><dt>${c.descent}</dt><dd>−${fmt(day.descent)} m</dd></div><div><dt>${c.max}</dt><dd>${fmt(day.max)} m</dd></div><div><dt>${c.night}</dt><dd>${day.nightLabel}</dd></div></dl>
      <p class="sched"><b>${c.schedule}:</b> ${c.scheduleText.replace('{0}', hm(day.start)).replace('{1}', hm(day.arrival))}</p>
      <p class="focus"><b>${c.stageFocus}.</b> ${c.stageFocusText[i]}</p>
      <table><thead><tr>${d.cols.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${pts}</tbody></table>
      <figure><img src="file://${IMG}/maps/jornada-${day.day}-${L}.jpg" alt=""><figcaption>${d.plate} · ${c.dayWord} ${day.day} · ${d.mapCredit}</figcaption></figure>
    </section>`;
  };
  return `<!doctype html><html lang="${L}"><head><meta charset="utf-8"><base href="file://${ROOT}/"><title>${d.title}</title><style>
  @page{size:A4;margin:16mm 15mm 16mm}
  .shead{display:grid;grid-template-columns:1fr 58mm;gap:6mm;align-items:start}.sphoto{margin:0}.stage figure img{max-height:80mm}.sphoto img{width:100%!important;max-height:none!important;height:39mm;object-fit:cover;border-radius:1mm;border:0}.sphoto figcaption{font-size:6.5pt;line-height:1.3;color:#5b6b64;margin-top:1mm}
  .months{width:100%;border-collapse:separate;border-spacing:1.2mm 0;margin:3mm 0 2mm}.months td{text-align:center;font:600 8pt Arial,sans-serif;padding:5mm 0 1.5mm;border-radius:1mm;background:#eceee7;color:#7b8378}.months .m-best{background:#163e33;color:#fff}.months .m-ok{background:#9daa86;color:#102c25}.months .m-risk{background:#e2cfa6;color:#102c25}.legend{font-size:8.5pt;color:#5b6b64}.legend span{margin-right:5mm}.legend i{display:inline-block;width:3mm;height:3mm;margin-right:1.5mm;border-radius:.6mm;vertical-align:-.4mm;background:#eceee7}.legend i.m-best{background:#163e33}.legend i.m-ok{background:#9daa86}.legend i.m-risk{background:#e2cfa6}.maps4{display:grid;grid-template-columns:1fr 1fr;gap:2.5mm 4mm;margin:3mm auto 0;width:86%}.maps4 img{width:100%;border:1px solid #d9ddd0}.maps4 figcaption{font-size:8pt;color:#5b6b64}.small{font-size:8pt;color:#5b6b64}
  *{box-sizing:border-box}body{font:10.5pt/1.5 Georgia,'DejaVu Serif',serif;color:#1d2a25;margin:0}
  h1,h2,h3,.kicker,th,dt,.label{font-family:'Helvetica Neue',Arial,'DejaVu Sans',sans-serif}
  .cover{height:262mm;display:flex;flex-direction:column;justify-content:flex-end;color:#fff;padding:18mm 14mm;background:linear-gradient(180deg,#0000 30%,#0d2b22ee 80%),url(file://${IMG}/apolobamba-landscape.jpg) center/cover;page-break-after:always}
  .cover .brand{letter-spacing:.3em;font:600 11pt Arial,sans-serif;margin:0 0 auto}.cover h1{font-size:34pt;line-height:1.05;margin:0 0 6mm}.cover p{margin:0 0 3mm;font-size:12pt}.cover .date{font:10pt Arial,sans-serif;opacity:.85}
  .page{page-break-before:always}
  h2{font-size:18pt;color:#163e33;margin:0 0 5mm;display:flex;gap:4mm;align-items:baseline}h2 span{font-size:10pt;color:#b4573a;letter-spacing:.1em}
  h3{font-size:14pt;color:#163e33;margin:0 0 2mm}.kicker{font-size:8.5pt;letter-spacing:.14em;text-transform:uppercase;color:#b4573a;margin:0 0 1mm}
  .notice{border-left:3px solid #b4573a;background:#f6f1e6;padding:3mm 4mm;font-size:9.5pt;margin:5mm 0}
  .facts{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin:4mm 0 6mm}.facts div{border:1px solid #d9ddd0;border-radius:2mm;padding:3mm}.facts strong{display:block;font:700 15pt Arial,sans-serif;color:#163e33}.facts span{font-size:9pt;color:#5b6b64}
  table{width:100%;border-collapse:collapse;font-size:9.5pt;margin:3mm 0}th,td{text-align:left;padding:1.6mm 2mm;border-bottom:1px solid #e1e4da;vertical-align:top}thead th{font-size:8pt;text-transform:uppercase;letter-spacing:.08em;color:#5b6b64;border-bottom:1.5px solid #163e33}
  tr.walk td,tr.walk th{background:#f6f8f3}
  .metrics{display:grid;grid-template-columns:repeat(5,1fr);gap:2mm;margin:3mm 0;border-block:1px solid #d6dbce;padding:2mm 0}.metrics dt{font-size:7.5pt;text-transform:uppercase;letter-spacing:.08em;color:#5b6b64}.metrics dd{margin:0;font:700 11pt Arial,sans-serif;color:#163e33}
  .sched,.focus{margin:1.5mm 0;font-size:9.8pt}.focus{border-left:2px solid #9daa86;padding-left:3mm}
  figure{margin:3mm 0 0}figure img{width:100%;max-height:100mm;object-fit:contain;border:1px solid #d9ddd0}figcaption{font-size:7.5pt;color:#5b6b64}
  .profile{width:100%;height:auto;border:1px solid #d9ddd0;border-radius:2mm;margin:3mm 0}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:3mm 6mm}.card{border:1px solid #d9ddd0;border-radius:2mm;padding:3mm 4mm;break-inside:avoid}.card b{display:block;font-family:Arial,sans-serif;color:#163e33}
  ul{padding-left:5mm;margin:2mm 0}ul.check{list-style:none;padding-left:0}li{margin:.8mm 0}.cond{break-inside:avoid;margin:0 0 2mm}.compact .card{font-size:9pt;line-height:1.4;padding:2.2mm 3.2mm}.compact .cond{font-size:8.6pt;line-height:1.35;margin:0 0 1.5mm}.compact .notice{margin:3mm 0;font-size:8.8pt}.compact .price{margin:0}.compact h2{font-size:15pt;margin:0 0 3mm}.compact .contact p{margin:1mm 0;font-size:9pt}.compact p{margin:1.5mm 0}.compact .grid2{gap:2.5mm 5mm}.compact h3{margin:3mm 0 1.5mm}.planc table{break-inside:avoid}.maps4 figure{margin:0;break-inside:avoid}.cond b{font-family:Arial,sans-serif;color:#163e33}
  .toc ol{columns:2;font-family:Arial,sans-serif;font-size:10pt}.price{font:700 26pt Arial,sans-serif;color:#163e33;margin:2mm 0}
  .src{font-size:8.5pt;color:#5b6b64}.contact{border:1.5px solid #163e33;border-radius:2mm;padding:5mm;margin-top:5mm}
  </style></head><body>
  <section class="cover"><p class="brand">ANDES WILD TREK</p><h1>Apolobamba.<br>${d.title}</h1><p>${d.sub}</p><p class="date">${d.date}</p></section>

  <section>${h2(1, d.figures)}
    <div class="facts">${c.facts.map(([n, l]) => `<div><strong>${n}</strong><span>${l}</span></div>`).join('')}</div>
    <p>${c.storyText}</p>
    <p class="notice">${d.notice}</p>
    <div class="toc"><h3>${d.toc}</h3><ol>${d.tocItems.map(x => `<li>${x}</li>`).join('')}</ol></div>
  </section>

  <section class="page">${h2(2, d.programme)}
    <table><thead><tr>${c.itinCols.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${c.itinerary.map(([dd, a, b, n]) => `<tr class="${+dd >= 5 && +dd <= 10 ? 'walk' : ''}"><td>${dd}</td><th>${a}</th><td>${b}</td><td>${n}</td></tr>`).join('')}</tbody></table>
    <p class="notice"><b>${c.reserveTitle}.</b> ${c.reserveText}</p>
    <p class="notice" style="border-color:#163e33"><b>${c.meetTitle}.</b> ${hm(c.meetText)}</p>
  </section>
  <section class="page">${h2(3, d.profile)}<p>${d.profileText}</p>${profileSvg(L)}
    <div style="margin-top:10mm">${h2(4, d.stages)}<p>${d.stagesText}</p><ol>${DAYS.map((x, i) => `<li>${c.dayWord} ${x.day} · ${c.stageNames[i]} · ${dec(x.km)} km · ${x.hours}</li>`).join('')}</ol></div>
  </section>

  ${DAYS.map(stage).join('')}

  <section class="page compact">${h2(5, d.plans)}
    <h3>${PLANS.season[L].window}</h3><p>${PLANS.season[L].proposal}</p>
    <table class="months"><tr>${PLANS.season.months.map((m, i) => `<td class="m-${m}">${PLANS.season[L].monthNames[i]}</td>`).join('')}</tr></table>
    <p class="legend">${['best', 'ok', 'risk', 'no'].map(k => `<span><i class="m-${k}"></i>${PLANS.season[L].legend[k]}</span>`).join('')}</p>
    <div class="grid2">${c.seasonShort.map(([a, b]) => `<div class="card"><b>${a}</b>${b}</div>`).join('')}</div>
    <h3 style="margin-top:6mm">${c.planTitle}</h3><p>${c.planText}</p>
    <div class="grid2">${c.planShort.map(([n, a, b]) => `<div class="card"><b>${a}</b>${b}</div>`).join('')}</div>
  </section>

  <section class="page">${h2(6, d.weather)}
    <div class="grid2">${d.climate.map(([a, b]) => `<div class="card"><b>${a}</b>${b}</div>`).join('')}</div>
    <h3 style="margin-top:6mm">${d.forecastTitle}</h3><p>${d.forecast}</p>
    <h3>${d.whereTitle}</h3><table><tbody>${d.where.map(([a, b, u]) => `<tr><th>${a}</th><td>${b}</td><td>${u}</td></tr>`).join('')}</tbody></table>
    ${h2(7, d.altitude)}<p>${c.altitudeText}</p><ul>${c.altitudePoints.map(x => `<li>${x}</li>`).join('')}</ul>
  </section>

  <section class="page">${h2(8, d.lodging)}
    <div class="grid2">${d.lodgingItems.map(([a, b]) => `<div class="card"><b>${a}</b>${b}</div>`).join('')}</div>
    ${h2(9, d.gear)}<div class="grid2">${c.gearGroups.map(([t, items]) => `<div class="card"><b>${t}</b><ul class="check">${items.map(x => `<li>☐ ${x}</li>`).join('')}</ul></div>`).join('')}</div>
  </section>

  <section class="page compact">${h2(10, d.price)}
    <p class="price">${c.priceAmount} € <small style="font-size:11pt;font-weight:400">${c.perPerson} · ${c.earlyLabel}</small></p><p><b>${c.priceStd} €</b> ${c.perPerson} · ${c.stdLabel}. ${c.priceNote}</p><p class="notice" style="border-color:#163e33"><b>${c.guarantee[0]}.</b> ${c.guarantee[1]}</p>
    <div class="grid2"><div class="card"><b>${d.included}</b><ul>${c.includeItems.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="card"><b>${d.excluded}</b><ul>${c.excludeItems.map(x => `<li>${x}</li>`).join('')}</ul></div></div>
    <div class="grid2" style="margin-top:4mm"><div class="card"><b>${c.bookTitle}</b><ol style="padding-left:5mm;margin:1mm 0">${c.bookSteps.map(([a, b]) => `<li><b style="display:inline">${a}.</b> ${b}</li>`).join('')}</ol></div><div class="card"><b>${c.cancelTitle}</b><table style="font-size:8.5pt"><tbody>${c.cancelRows.map(([a, b]) => `<tr><td>${a}</td><td style="text-align:right">${b}</td></tr>`).join('')}</tbody></table><ul style="font-size:8pt">${c.cancelNotes.map(x => `<li>${x}</li>`).join('')}</ul></div></div>
    <div style="margin-top:4mm">${c.conds.filter((_, i) => i !== 4 && i !== 7).map(([a, b]) => `<p class="cond"><b>${a}.</b> ${b}</p>`).join('')}</div>
    <p class="notice">${c.priceDisclaimer}</p>
    <div style="break-inside:avoid">${h2(11, d.contact)}<div class="contact"><p>${d.contactText}</p><p><b>${d.guide}</b><br>WhatsApp: +${CONTACT.slice(0, 2)} ${CONTACT.slice(2).replace(/(\d{3})(?=\d)/g, '$1 ')}<br>${d.web}: 7m5n2m6tv8-eng.github.io/apolobamba</p></div></div>
  </section>
  </body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dossier-'));
  // Les imatges es passen a JPEG de mida moderada perquè el PDF pesi poc i es pugui enviar per WhatsApp.
  const img = await browser.newPage();
  for (const name of ['apolobamba-landscape', ...PH.map((_, i) => `jornada-${i + 1}-small`), ...DAYS.flatMap(x => LANGS.map(l => `maps/jornada-${x.day}-${l}`)), ...PLANS.c.stages.flatMap(x => LANGS.map(l => `maps/pla-c-${x.code.toLowerCase()}-${l}`))]) {
    await img.goto('file://' + path.join(ROOT, 'assets', name + '.webp'));
    const data = await img.evaluate(async () => { const i = document.images[0]; await i.decode(); const w = Math.min(1700, i.naturalWidth), c = document.createElement('canvas'); c.width = w; c.height = Math.round(i.naturalHeight * w / i.naturalWidth); c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); return c.toDataURL('image/jpeg', .8); });
    fs.mkdirSync(path.dirname(path.join(tmp, name)), { recursive: true });
    fs.writeFileSync(path.join(tmp, name + '.jpg'), Buffer.from(data.split(',')[1], 'base64'));
  }
  IMG = tmp;
  for (const L of LANGS) {
    CUR = L;
    const f = path.join(tmp, L + '.html'); fs.writeFileSync(f, html(L));
    await page.goto('file://' + f); await page.waitForLoadState('networkidle');
    await page.pdf({ path: path.join(ROOT, 'dossiers/client', D[L].file), format: 'A4', printBackground: true, displayHeaderFooter: true,
      headerTemplate: '<span></span>', footerTemplate: `<div style="font:7pt Arial;color:#5b6b64;width:100%;padding:0 15mm;display:flex;justify-content:space-between"><span>Andes Wild Trek · Apolobamba · ${D[L].title}</span><span>${D[L].page} <span class="pageNumber"></span>/<span class="totalPages"></span></span></div>` });
    console.log('dossiers/client/' + D[L].file);
  }
  await browser.close();
})();
