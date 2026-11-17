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
const { COPY, DAYS, TRACK } = ctx;
const CONTACT = (fs.readFileSync(path.join(ROOT, 'extras.js'), 'utf8').match(/whatsapp:\s*'(\d+)'/) || [])[1] || '';

let IMG = '';
const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const dec = n => n.toFixed(1).replace('.', ',');
const esc = s => String(s);

const D = {
  ca: {
    file: 'Dossier_Viatge_CA.pdf', title: 'Dossier del viatge', sub: 'Travessa Pelechuco → Charazani · Serralada d’Apolobamba, Bolívia',
    date: 'Proposta de dates: juny de 2027 · Document de novembre de 2026',
    notice: 'Aquest dossier presenta un projecte acadèmic de tècnic esportiu en mitja muntanya (TD2). Les reserves encara no estan obertes. El recorregut està planificat sobre un registre GPS de 2012 i contrastat amb operadors bolivians, però encara no s’ha reconegut sobre el terreny: distàncies, desnivells i horaris són de planificació.',
    toc: 'Contingut', tocItems: ['El viatge en xifres', 'Programa dia a dia', 'Perfil de la travessa', 'Les sis jornades, punt a punt', 'Clima i meteorologia', 'Altitud i salut', 'Allotjament, àpats i equipatge', 'Material', 'Preu i condicions', 'Contacte'],
    figures: 'El viatge en xifres', programme: 'Programa dia a dia', profile: 'Perfil de la travessa',
    profileText: 'Altitud al llarg dels 53,4 km de camí. Les tendes marquen on dormim. El punt més alt és el pas Sunchulli (5.032 m), el dia 7.',
    stages: 'Les sis jornades, punt a punt', stagesText: 'Per a cada jornada: dades, horari previst, punts de pas i mapa topogràfic. Als mapes hi surten els noms originals del registre GPS (per exemple «Paso1» és el pas 1).',
    cols: ['Km', 'Punt', 'Altitud', 'Hora prevista'], plate: 'Mapa de l’etapa', mapCredit: 'Mapa: OpenTopoMap · dades © OpenStreetMap i SRTM · CC-BY-SA. Track: Gallotrekk, Wikiloc (2012).',
    weather: 'Clima i meteorologia',
    climate: [['Juny, estació seca', 'Dies sovint assolellats i sol intens per l’altitud. Pluja poc freqüent.'], ['Nits fredes', 'Sota zero als campaments; als més alts poden baixar de −10 °C.'], ['Vent i neu puntual', 'Pot fer vent fort als passos i, de manera puntual, nevar. Amb neu dura o gel al pas Sunchulli, no es creua.'], ['Llum', 'Al juny surt el sol cap a les 06.55–07.00 i es pon cap a les 18.15. Caminem de les 07.10 a les 16.40 com a màxim.']],
    forecastTitle: 'Com seguim la previsió',
    forecast: 'El guia consulta la previsió 48 i 24 hores abans de la travessa i cada matí, i n’apunta la font i l’hora. A la muntanya no hi ha cobertura mòbil: la previsió durant la travessa arriba per comunicador satèl·lit i per la informació del guia local. Si la previsió no és bona, s’usen els dies de reserva.',
    whereTitle: 'Si la vols mirar tu abans de viatjar',
    where: [['SENAMHI', 'Servei oficial de meteorologia de Bolívia: previsions i avisos.', 'senamhi.gob.bo'], ['Windy', 'Previsió per hores al punt exacte (vent, núvols, isoterma de 0 °C). Busca Pelechuco o el pas Sunchulli.', 'windy.com'], ['Meteoblue', 'Previsió de 7–14 dies per a Pelechuco o Charazani, amb gràfics clars.', 'meteoblue.com']],
    altitude: 'Altitud i salut', lodging: 'Allotjament, àpats i equipatge',
    lodgingItems: [['La Paz', 'Hotel, tres nits (≈3.650 m) per aclimatar-nos.'], ['Pelechuco i Charazani', 'Allotjament local senzill.'], ['Cinc nits en tenda', 'Entre 4.010 i 4.700 m. Tendes, cuina i material col·lectiu inclosos.'], ['Àpats', 'Tots els del programa. Avisa’ns d’al·lèrgies o dietes especials.'], ['Equipatge', 'Les mules porten tendes, cuina i una bossa tova amb el teu equipatge. Tu portes una motxilla de dia de 25–35 litres. El límit de pes es confirmarà en reservar.'], ['Aigua', 'L’aigua de rius i fonts es tracta sempre.']],
    gear: 'Material', price: 'Preu i condicions', included: 'Què inclou', excluded: 'Què no inclou',
    contact: 'Contacte', contactText: 'Per a qualsevol dubte, escriu al guia per WhatsApp. Abans de reservar fem una conversa per valorar la teva experiència, l’altitud i les teves expectatives.',
    guide: 'Izan Pimentel Pérez · Guia de muntanya · Andes Wild Trek', web: 'Web del viatge', page: 'Pàgina',
  },
  es: {
    file: 'Dossier_Viaje_ES.pdf', title: 'Dossier del viaje', sub: 'Travesía Pelechuco → Charazani · Cordillera de Apolobamba, Bolivia',
    date: 'Propuesta de fechas: junio de 2027 · Documento de noviembre de 2026',
    notice: 'Este dossier presenta un proyecto académico de técnico deportivo en media montaña (TD2). Las reservas todavía no están abiertas. El recorrido está planificado sobre un registro GPS de 2012 y contrastado con operadores bolivianos, pero todavía no se ha reconocido sobre el terreno: distancias, desniveles y horarios son de planificación.',
    toc: 'Contenido', tocItems: ['El viaje en cifras', 'Programa día a día', 'Perfil de la travesía', 'Las seis jornadas, punto a punto', 'Clima y meteorología', 'Altitud y salud', 'Alojamiento, comidas y equipaje', 'Material', 'Precio y condiciones', 'Contacto'],
    figures: 'El viaje en cifras', programme: 'Programa día a día', profile: 'Perfil de la travesía',
    profileText: 'Altitud a lo largo de los 53,4 km de camino. Las tiendas marcan dónde dormimos. El punto más alto es el paso Sunchulli (5.032 m), el día 7.',
    stages: 'Las seis jornadas, punto a punto', stagesText: 'Para cada jornada: datos, horario previsto, puntos de paso y mapa topográfico. En los mapas aparecen los nombres originales del registro GPS (por ejemplo «Paso1» es el paso 1).',
    cols: ['Km', 'Punto', 'Altitud', 'Hora prevista'], plate: 'Mapa de la etapa', mapCredit: 'Mapa: OpenTopoMap · datos © OpenStreetMap y SRTM · CC-BY-SA. Track: Gallotrekk, Wikiloc (2012).',
    weather: 'Clima y meteorología',
    climate: [['Junio, estación seca', 'Días a menudo soleados y sol intenso por la altitud. Lluvia poco frecuente.'], ['Noches frías', 'Bajo cero en los campamentos; en los más altos pueden bajar de −10 °C.'], ['Viento y nieve puntual', 'Puede hacer viento fuerte en los pasos y, de forma puntual, nevar. Con nieve dura o hielo en el paso Sunchulli, no se cruza.'], ['Luz', 'En junio sale el sol hacia las 06:55–07:00 y se pone hacia las 18:15. Caminamos de las 07:10 a las 16:40 como máximo.']],
    forecastTitle: 'Cómo seguimos la previsión',
    forecast: 'El guía consulta la previsión 48 y 24 horas antes de la travesía y cada mañana, y anota la fuente y la hora. En la montaña no hay cobertura móvil: la previsión durante la travesía llega por comunicador satélite y por la información del guía local. Si la previsión no es buena, se usan los días de reserva.',
    whereTitle: 'Si quieres mirarla tú antes de viajar',
    where: [['SENAMHI', 'Servicio oficial de meteorología de Bolivia: previsiones y avisos.', 'senamhi.gob.bo'], ['Windy', 'Previsión por horas en el punto exacto (viento, nubes, isoterma de 0 °C). Busca Pelechuco o el paso Sunchulli.', 'windy.com'], ['Meteoblue', 'Previsión de 7–14 días para Pelechuco o Charazani, con gráficos claros.', 'meteoblue.com']],
    altitude: 'Altitud y salud', lodging: 'Alojamiento, comidas y equipaje',
    lodgingItems: [['La Paz', 'Hotel, tres noches (≈3.650 m) para aclimatarnos.'], ['Pelechuco y Charazani', 'Alojamiento local sencillo.'], ['Cinco noches en tienda', 'Entre 4.010 y 4.700 m. Tiendas, cocina y material colectivo incluidos.'], ['Comidas', 'Todas las del programa. Avísanos de alergias o dietas especiales.'], ['Equipaje', 'Las mulas llevan tiendas, cocina y una bolsa blanda con tu equipaje. Tú llevas una mochila de día de 25–35 litros. El límite de peso se confirmará al reservar.'], ['Agua', 'El agua de ríos y fuentes se trata siempre.']],
    gear: 'Material', price: 'Precio y condiciones', included: 'Qué incluye', excluded: 'Qué no incluye',
    contact: 'Contacto', contactText: 'Para cualquier duda, escribe al guía por WhatsApp. Antes de reservar hacemos una conversación para valorar tu experiencia, la altitud y tus expectativas.',
    guide: 'Izan Pimentel Pérez · Guía de montaña · Andes Wild Trek', web: 'Web del viaje', page: 'Página',
  }
};

function profileSvg(L) {
  const P = TRACK.pts, TOT = P[P.length - 1][3], W = 1000, H = 300, l = 52, r = 14, t = 18, b = 40, LO = 2900, HI = 5200;
  const x = k => l + (W - l - r) * k / TOT, y = e => t + (H - t - b) * (1 - (e - LO) / (HI - LO));
  const line = P.map(p => `${x(p[3]).toFixed(1)},${y(p[2]).toFixed(1)}`).join(' ');
  const grid = [3000, 3500, 4000, 4500, 5000].map(e => `<line x1="${l}" x2="${W - r}" y1="${y(e)}" y2="${y(e)}" stroke="#163e33" stroke-opacity=".14"/><text x="${l - 7}" y="${y(e) + 4}" text-anchor="end" font-size="12" fill="#5b6b64">${fmt(e)}</text>`).join('');
  const bands = TRACK.cut.slice(0, -1).map((c, i) => { const k0 = P[c][3], k1 = P[TRACK.cut[i + 1]][3]; return `<rect x="${x(k0)}" y="${t}" width="${x(k1) - x(k0)}" height="${H - t - b}" fill="#163e33" fill-opacity="${i % 2 ? .06 : 0}"/><text x="${(x(k0) + x(k1)) / 2}" y="${H - 14}" text-anchor="middle" font-size="12" font-weight="600" fill="#163e33">${L === 'ca' ? 'Dia' : 'Día'} ${DAYS[i].day}</text>`; }).join('');
  const nights = DAYS.map((d, i) => { const p = P[TRACK.cut[i + 1]], X = x(p[3]), Y = y(d.points[d.points.length - 1].ele) - 3; return `<path d="M${X - 7} ${Y + 6} L${X} ${Y - 7} L${X + 7} ${Y + 6} Z" fill="#e5c98d" stroke="#163e33" stroke-width="1.3"/>`; }).join('');
  const top = DAYS[2].points.find(p => p.ele === 5032), topK = 13.95;
  return `<svg viewBox="0 0 ${W} ${H}" class="profile">${bands}${grid}<polygon points="${x(0)},${H - b} ${line} ${x(TOT)},${H - b}" fill="#163e33" fill-opacity=".14"/><polyline points="${line}" fill="none" stroke="#163e33" stroke-width="2.2" stroke-linejoin="round"/>${nights}<circle cx="${x(topK)}" cy="${y(5032)}" r="5" fill="#b4573a"/><text x="${x(topK) + 9}" y="${y(5032) + 4}" font-size="13" font-weight="700" fill="#b4573a">${top[L]} · 5.032 m</text><text x="${x(0)}" y="${H - 26}" font-size="11" fill="#5b6b64">0 km</text><text x="${x(TOT)}" y="${H - 26}" font-size="11" text-anchor="end" fill="#5b6b64">${dec(TOT)} km</text></svg>`;
}

function html(L) {
  const c = COPY[L], d = D[L];
  const h2 = (n, s) => `<h2><span>${String(n).padStart(2, '0')}</span>${s}</h2>`;
  const stage = (day, i) => {
    const pts = day.points.map(p => `<tr><td>${dec(p.km)}</td><th>${p[L]}</th><td>${fmt(p.ele)} m</td><td>${p.time}</td></tr>`).join('');
    const shared = DAYS.filter(x => x.map === day.map).length > 1;
    return `<section class="stage page">
      <p class="kicker">${c.stageLabel} 0${i + 1} · ${c.dayWord} ${day.day} · ${day.hours}</p>
      <h3>${c.stageNames[i]}</h3>
      <p>${c.stageDescriptions[i]}</p>
      <dl class="metrics"><div><dt>${c.distance}</dt><dd>${dec(day.km)} km</dd></div><div><dt>${c.ascent}</dt><dd>+${fmt(day.ascent)} m</dd></div><div><dt>${c.descent}</dt><dd>−${fmt(day.descent)} m</dd></div><div><dt>${c.max}</dt><dd>${fmt(day.max)} m</dd></div><div><dt>${c.night}</dt><dd>${day.nightLabel}</dd></div></dl>
      <p class="sched"><b>${c.schedule}:</b> ${c.scheduleText.replace('{0}', day.start).replace('{1}', day.arrival)}</p>
      <p class="focus"><b>${c.stageFocus}.</b> ${c.stageFocusText[i]}</p>
      <table><thead><tr>${d.cols.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${pts}</tbody></table>
      <figure><img src="file://${IMG}/maps/etapa-${day.map}.jpg" alt=""><figcaption>${d.plate} ${day.map}${shared ? (L === 'ca' ? ' (comuna als dies 6 i 7)' : ' (común a los días 6 y 7)') : ''} · ${d.mapCredit}</figcaption></figure>
    </section>`;
  };
  return `<!doctype html><html lang="${L}"><head><meta charset="utf-8"><base href="file://${ROOT}/"><title>${d.title}</title><style>
  @page{size:A4;margin:16mm 15mm 16mm}
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
  ul{padding-left:5mm;margin:2mm 0}ul.check{list-style:none;padding-left:0}li{margin:.8mm 0}.cond{break-inside:avoid;margin:0 0 3mm}.cond b{font-family:Arial,sans-serif;color:#163e33}
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
  </section>
  <section class="page">${h2(3, d.profile)}<p>${d.profileText}</p>${profileSvg(L)}
    <div style="margin-top:10mm">${h2(4, d.stages)}<p>${d.stagesText}</p><ol>${DAYS.map((x, i) => `<li>${c.dayWord} ${x.day} · ${c.stageNames[i]} · ${dec(x.km)} km · ${x.hours}</li>`).join('')}</ol></div>
  </section>

  ${DAYS.map(stage).join('')}

  <section class="page">${h2(5, d.weather)}
    <div class="grid2">${d.climate.map(([a, b]) => `<div class="card"><b>${a}</b>${b}</div>`).join('')}</div>
    <h3 style="margin-top:6mm">${d.forecastTitle}</h3><p>${d.forecast}</p>
    <h3>${d.whereTitle}</h3><table><tbody>${d.where.map(([a, b, u]) => `<tr><th>${a}</th><td>${b}</td><td>${u}</td></tr>`).join('')}</tbody></table>
    ${h2(6, d.altitude)}<p>${c.altitudeText}</p><ul>${c.altitudePoints.map(x => `<li>${x}</li>`).join('')}</ul>
  </section>

  <section class="page">${h2(7, d.lodging)}
    <div class="grid2">${d.lodgingItems.map(([a, b]) => `<div class="card"><b>${a}</b>${b}</div>`).join('')}</div>
    ${h2(8, d.gear)}<div class="grid2">${c.gearGroups.map(([t, items]) => `<div class="card"><b>${t}</b><ul class="check">${items.map(x => `<li>☐ ${x}</li>`).join('')}</ul></div>`).join('')}</div>
  </section>

  <section class="page">${h2(9, d.price)}
    <p class="price">${c.priceAmount} € <small style="font-size:11pt;font-weight:400">${c.perPerson}</small></p><p>${c.priceNote}</p>
    <div class="grid2"><div class="card"><b>${d.included}</b><ul>${c.includeItems.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="card"><b>${d.excluded}</b><ul>${c.excludeItems.map(x => `<li>${x}</li>`).join('')}</ul></div></div>
    <div style="margin-top:5mm">${c.conds.map(([a, b]) => `<p class="cond"><b>${a}.</b> ${b}</p>`).join('')}</div>
    <p class="notice">${c.priceDisclaimer}</p>
    <div style="break-inside:avoid">${h2(10, d.contact)}<div class="contact"><p>${d.contactText}</p><p><b>${d.guide}</b><br>WhatsApp: +${CONTACT.slice(0, 2)} ${CONTACT.slice(2).replace(/(\d{3})(?=\d)/g, '$1 ')}<br>${d.web}: 7m5n2m6tv8-eng.github.io/apolobamba</p></div></div>
  </section>
  </body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dossier-'));
  // Les imatges es passen a JPEG de mida moderada perquè el PDF pesi poc i es pugui enviar per WhatsApp.
  const img = await browser.newPage();
  for (const name of ['apolobamba-landscape', ...[1, 2, 3, 4, 5].map(n => 'maps/etapa-' + n)]) {
    await img.goto('file://' + path.join(ROOT, 'assets', name + '.webp'));
    const data = await img.evaluate(async () => { const i = document.images[0]; await i.decode(); const w = Math.min(1700, i.naturalWidth), c = document.createElement('canvas'); c.width = w; c.height = Math.round(i.naturalHeight * w / i.naturalWidth); c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); return c.toDataURL('image/jpeg', .8); });
    fs.mkdirSync(path.dirname(path.join(tmp, name)), { recursive: true });
    fs.writeFileSync(path.join(tmp, name + '.jpg'), Buffer.from(data.split(',')[1], 'base64'));
  }
  IMG = tmp;
  for (const L of ['ca', 'es']) {
    const f = path.join(tmp, L + '.html'); fs.writeFileSync(f, html(L));
    await page.goto('file://' + f); await page.waitForLoadState('networkidle');
    await page.pdf({ path: path.join(ROOT, 'dossiers/client', D[L].file), format: 'A4', printBackground: true, displayHeaderFooter: true,
      headerTemplate: '<span></span>', footerTemplate: `<div style="font:7pt Arial;color:#5b6b64;width:100%;padding:0 15mm;display:flex;justify-content:space-between"><span>Andes Wild Trek · Apolobamba · ${D[L].title}</span><span>${D[L].page} <span class="pageNumber"></span>/<span class="totalPages"></span></span></div>` });
    console.log('dossiers/client/' + D[L].file);
  }
  await browser.close();
})();
