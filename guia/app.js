/* App del guia: fitxes tècniques de la travessa, funciona sense cobertura. */
(() => {
  'use strict';
  const G = window.GUIDE, DAYS = window.DAYS, TR = window.TRACK, PTS = TR.pts, CUT = TR.cut, TOT = PTS[PTS.length - 1][3];
  const PL = window.PLANS, PC = window.PLANC, CS = PL.c.stages; // temporada, plans B, pla C (content.js, planc.js)
  const store = { get(k, f) { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
  let L = store.get('guia-lang', 'ca'), tab = store.get('guia-tab', 0), day = store.get('guia-day', 0), mapDay = -1, you = null;
  if (!G[L]) L = 'ca';
  const t = () => G[L], C = () => window.COPY[L];
  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const dec = n => n.toFixed(1).replace('.', ',');
  const hm = s => L === 'es' ? s.replace(/(\d\d)\.(\d\d)/g, '$1:$2') : s;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const app = document.getElementById('app');

  /* ---------- Jornades ---------- */
  const chipsDays = g => `<div class="chips">${DAYS.map((x, i) => `<button type="button" data-day="${i}" class="${i === day ? 'on' : ''}">${g.day} ${x.day}</button>`).join('')}${CS.map((s, i) => `<button type="button" data-day="${6 + i}" class="pc ${6 + i === day ? 'on' : ''}">${s.code}</button>`).join('')}</div>`;
  function planCStage(i) {
    const s = CS[i], g = t(), x = s[L];
    const rows = s.points.map(p => `<details class="pt"><summary><span class="km">${dec(p.km)}</span><span class="nm">${p[L]}</span><span class="el">${fmt(p.ele)}</span><span class="tm">${hm(p.time)}</span><span class="mx"></span></summary><p class="ll">${g.coords}: <code>${p.ll[0].toFixed(5)}, ${p.ll[1].toFixed(5)}</code> <button type="button" data-copy="${p.ll[0].toFixed(5)}, ${p.ll[1].toFixed(5)}">${g.copy}</button></p></details>`).join('');
    return `${chipsDays(g)}<article class="card pcard"><p class="kick">${g.planC} · ${s.code} · ${g.day} ${s.day} · ${s.hours}</p><h2>${x.name}</h2>
    <dl class="nums"><div><dt>${g.km}</dt><dd>${dec(s.km)}</dd></div><div><dt>${g.up}</dt><dd>+${fmt(s.ascent)}</dd></div><div><dt>${g.down}</dt><dd>−${fmt(s.descent)}</dd></div><div><dt>${g.max}</dt><dd>${fmt(s.max)}</dd></div><div><dt>${g.night}</dt><dd>${s.nightLabel.replace(' m', '')}</dd></div></dl>
    <dl class="times"><div><dt>${g.start}</dt><dd>${hm(s.start)}</dd></div><div><dt>${g.arrival}</dt><dd>${hm(s.arrival)}</dd></div><div><dt>${g.limit}</dt><dd>${hm('16.40')}</dd></div></dl>
    <p>${x.text}</p><p class="keyp"><b>${g.key}.</b> ${hm(x.key)}</p></article>
    <div class="table"><div class="th"><span>${g.cols[0]}</span><span>${g.cols[1]}</span><span>${g.cols[2]}</span><span>${g.cols[3]}</span><span></span></div>${rows}</div>
    <article class="card"><h2>${PL.c[L].title}</h2><p>${PL.c[L].intro}</p><ul>${PL.c[L].when.map(w => `<li>${w}</li>`).join('')}</ul><p class="note">${PL.c[L].source}</p></article>`;
  }
  function days() {
    if (day >= 6) return planCStage(day - 6);
    const d = DAYS[day], c = C(), g = t(), ctl = G.control[day];
    const rows = d.points.map((p, i) => {
      const [mca, mes, dca, des] = ctl[i] || ['', '', '', ''];
      const hard = /MITJA VOLTA|MEDIA VUELTA|PUNT DE DECISIÓ|PUNTO DE DECISIÓN/.test(L === 'ca' ? dca : des);
      return `<details class="pt${hard ? ' hard' : ''}"><summary><span class="km">${dec(p.km)}</span><span class="nm">${p[L]}</span><span class="el">${fmt(p.ele)}</span><span class="tm">${hm(p.time)}</span><span class="mx">${L === 'ca' ? mca : mes}</span></summary><p>${L === 'ca' ? dca : des}</p><p class="ll">${g.coords}: <code>${p.ll[0].toFixed(5)}, ${p.ll[1].toFixed(5)}</code> <button type="button" data-copy="${p.ll[0].toFixed(5)}, ${p.ll[1].toFixed(5)}">${g.copy}</button></p></details>`;
    }).join('');
    const pb = (PL.b.find(b => b.day === d.day) || { ca: [], es: [] })[L];
    return `${chipsDays(g)}
    <article class="card"><p class="kick">${g.day} ${d.day} · ${d.hours}</p><h2>${c.stageNames[day]}</h2>
    <dl class="nums"><div><dt>${g.km}</dt><dd>${dec(d.km)}</dd></div><div><dt>${g.up}</dt><dd>+${fmt(d.ascent)}</dd></div><div><dt>${g.down}</dt><dd>−${fmt(d.descent)}</dd></div><div><dt>${g.max}</dt><dd>${fmt(d.max)}</dd></div><div><dt>${g.night}</dt><dd>${d.nightLabel.replace(' m', '')}</dd></div></dl>
    <dl class="times"><div><dt>${g.start}</dt><dd>${hm(d.start)}</dd></div><div><dt>${g.arrival}</dt><dd>${hm(d.arrival)}</dd></div><div><dt>${g.limit}</dt><dd>${hm('16.40')}</dd></div></dl>
    <p class="keyp"><b>${g.key}.</b> ${c.stageFocusText[day]}</p></article>
    <div class="table"><div class="th"><span>${g.cols[0]}</span><span>${g.cols[1]}</span><span>${g.cols[2]}</span><span>${g.cols[3]}</span><span>${g.cols[4]}</span></div>${rows}</div>
    <article class="card"><h2>${g.planB}</h2>${pb.map(([a, b]) => `<details class="sf" open><summary>${hm(a)}</summary><p>${hm(b)}</p></details>`).join('')}</article>
    <p class="note">${g.rule}</p>`;
  }

  /* ---------- Mapa esquemàtic i perfil ---------- */
  const lat0 = PTS.reduce((a, p) => a + p[0], 0) / PTS.length, kx = Math.cos(lat0 * Math.PI / 180);
  const R2D = 180 / Math.PI;
  function distM(a, b) { const p1 = a[0] / R2D, p2 = b[0] / R2D, dl = (b[1] - a[1]) / R2D, h = Math.sin((p2 - p1) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2; return 12742018 * Math.asin(Math.sqrt(h)); }
  function nearest(ll) { // distància al traçat i km aproximat
    let best = [1e12, 0];
    for (let i = 0; i < PTS.length - 1; i++) {
      const a = PTS[i], b = PTS[i + 1];
      for (let s = 0; s <= 10; s++) { const f = s / 10, q = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], d = distM(ll, q); if (d < best[0]) best = [d, a[3] + (b[3] - a[3]) * f]; }
    }
    return best;
  }
  function stageAt(k) { for (let i = 0; i < 6; i++) if (k <= PTS[CUT[i + 1]][3] + 1e-6) return i; return 5; }
  function mapSvg() {
    const showC = mapDay < 0 || mapDay === 6, i0 = mapDay < 0 || mapDay === 6 ? 0 : CUT[mapDay], i1 = mapDay < 0 || mapDay === 6 ? PTS.length - 1 : CUT[mapDay + 1];
    const sel = mapDay === 6 ? PC.pts : PTS.slice(i0, i1 + 1).concat(mapDay < 0 ? PC.pts : []), xs = sel.map(p => p[1] * kx), ys = sel.map(p => p[0]);
    if (you && mapDay < 0) { xs.push(you[1] * kx); ys.push(you[0]); }
    const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);
    const W = 400, H = 520, pad = 34, sc = Math.min((W - 2 * pad) / (maxx - minx || 1e-6), (H - 2 * pad) / (maxy - miny || 1e-6));
    const ox = (W - (maxx - minx) * sc) / 2, oy = (H - (maxy - miny) * sc) / 2;
    const P = (lat, lon) => [ox + (lon * kx - minx) * sc, oy + (maxy - lat) * sc];
    const seg = (a, b) => PTS.slice(a, b + 1).map(p => P(p[0], p[1]).map(v => v.toFixed(1)).join(',')).join(' ');
    const cols = ['#2f6f5e', '#8a6d2f', '#b4573a', '#355c8a', '#6b4f8a', '#4f7a2f'];
    const line = (pts, extra) => `<polyline points="${pts.map(p => P(p[0], p[1]).map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
    let o = CUT.slice(0, -1).map((c, i) => `<polyline points="${seg(c, CUT[i + 1])}" fill="none" stroke="${cols[i]}" stroke-width="${mapDay < 0 || mapDay === i ? 4 : 2}" stroke-opacity="${mapDay < 0 || mapDay === i ? 1 : mapDay === 6 ? .2 : .25}" stroke-linejoin="round" stroke-linecap="round"/>`).join('');
    if (showC) o += line(PC.pts, `stroke="#7a4fa0" stroke-width="${mapDay === 6 ? 4 : 2.5}" stroke-dasharray="7 5"`);
    if (mapDay < 0 || mapDay === 3) o += line(PC.alt, 'stroke="#b4573a" stroke-width="3" stroke-dasharray="3 4"');
    if (mapDay === 6) CS.forEach(s => s.points.forEach((p, pi) => { const [x, y] = P(p.ll[0], p.ll[1]); o += `<circle cx="${x}" cy="${y}" r="${pi === s.points.length - 1 ? 6 : 4}" fill="${pi === s.points.length - 1 ? '#e5c98d' : '#fff'}" stroke="#7a4fa0" stroke-width="2"/><text x="${x + 9}" y="${y + 4}">${esc(p[L])}</text>`; }));
    PL.escapes.forEach(e => { if (mapDay >= 0 && mapDay < 6 && !e.days.includes(DAYS[mapDay].day)) return; if (mapDay === 6) return; const [x, y] = P(e.ll[0], e.ll[1]); o += `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" rx="2" fill="#b4573a" stroke="#fff" stroke-width="1.5"/><text x="${x - 9}" y="${y + 4}" text-anchor="end" class="esc">${esc(e[L].split(' · ')[0])}</text>`; });
    DAYS.forEach((d, di) => d.points.forEach((p, pi) => {
      if (mapDay === 6 || (mapDay >= 0 && di !== mapDay)) return; if (di > 0 && pi === 0 && mapDay < 0) return;
      const [x, y] = P(p.ll[0], p.ll[1]), end = pi === d.points.length - 1;
      o += `<circle cx="${x}" cy="${y}" r="${end ? 6 : 4}" fill="${end ? '#e5c98d' : '#fff'}" stroke="#163e33" stroke-width="2"/>`;
      if (mapDay >= 0 || end || (di === 0 && pi === 0) || p.ele === 5032) o += `<text x="${x + 9}" y="${y + 4}">${esc(p[L])}</text>`;
    }));
    if (you) { const [x, y] = P(you[0], you[1]); o += `<circle cx="${x}" cy="${y}" r="16" fill="#1d6fd6" fill-opacity=".2"/><circle cx="${x}" cy="${y}" r="7" fill="#1d6fd6" stroke="#fff" stroke-width="2.5"/>`; }
    const kmBar = 1000 * sc / 111320; // píxels per km (aprox.)
    o += `<g transform="translate(${pad},${H - 14})"><line x1="0" x2="${kmBar}" y1="0" y2="0" stroke="#163e33" stroke-width="2"/><text x="${kmBar + 6}" y="4">1 km</text></g><g transform="translate(${W - 24},30)"><path d="M0 -14 L6 4 L0 0 L-6 4Z" fill="#163e33"/><text x="0" y="18" text-anchor="middle">${t().north}</text></g>`;
    return `<svg class="map" viewBox="0 0 ${W} ${H}" role="img">${o}</svg>`;
  }
  function profileSvg() {
    const W = 400, H = 150, l = 34, r = 6, tp = 8, b = 20, LO = 3000, HI = 5100;
    const x = k => l + (W - l - r) * k / TOT, y = e => tp + (H - tp - b) * (1 - (e - LO) / (HI - LO));
    const line = PTS.map(p => `${x(p[3]).toFixed(1)},${y(p[2]).toFixed(1)}`).join(' ');
    const band = mapDay < 0 || mapDay > 5 ? '' : `<rect x="${x(PTS[CUT[mapDay]][3])}" y="${tp}" width="${x(PTS[CUT[mapDay + 1]][3]) - x(PTS[CUT[mapDay]][3])}" height="${H - tp - b}" fill="#c9a45c" fill-opacity=".25"/>`;
    const grid = [3000, 4000, 5000].map(e => `<line x1="${l}" x2="${W - r}" y1="${y(e)}" y2="${y(e)}" stroke="#163e33" stroke-opacity=".15"/><text x="${l - 4}" y="${y(e) + 4}" text-anchor="end">${fmt(e)}</text>`).join('');
    const me = you && you.km != null ? `<line x1="${x(you.km)}" x2="${x(you.km)}" y1="${tp}" y2="${H - b}" stroke="#1d6fd6" stroke-width="2"/>` : '';
    return `<svg class="prof" viewBox="0 0 ${W} ${H}">${band}${grid}<polygon points="${x(0)},${H - b} ${line} ${x(TOT)},${H - b}" fill="#163e33" fill-opacity=".14"/><polyline points="${line}" fill="none" stroke="#163e33" stroke-width="1.8"/>${me}${DAYS.map((d, i) => `<text x="${(x(PTS[CUT[i]][3]) + x(PTS[CUT[i + 1]][3])) / 2}" y="${H - 5}" text-anchor="middle">${d.day}</text>`).join('')}</svg>`;
  }
  function map() {
    const g = t();
    return `<div class="chips"><button type="button" data-mapday="-1" class="${mapDay < 0 ? 'on' : ''}">${g.allDays}</button>${DAYS.map((x, i) => `<button type="button" data-mapday="${i}" class="${i === mapDay ? 'on' : ''}">${g.day} ${x.day}</button>`).join('')}<button type="button" data-mapday="6" class="pc ${mapDay === 6 ? 'on' : ''}">${g.planC}</button></div>
    <div class="card mapcard">${mapSvg()}${mapDay === 6 ? '' : profileSvg()}<p class="legend"><i class="lc"></i>${g.planC} <i class="la"></i>${g.altRoute} <i class="le"></i>${g.escape}</p></div>
    <p class="loc" id="loc" aria-live="polite">${you ? you.msg : ''}</p>
    <div class="actions"><button type="button" class="btn" id="locate">${g.locate}</button><button type="button" class="btn ghost" id="gpx">${g.gpx}</button></div>
    <p class="note">${g.mapNote}</p>`;
  }
  function gpx() {
    const wpts = DAYS.flatMap((d, di) => d.points.filter((p, pi) => di === 0 || pi > 0).map(p => `<wpt lat="${p.ll[0]}" lon="${p.ll[1]}"><ele>${p.ele}</ele><name>${esc(p[L])}</name></wpt>`)).join('\n');
    const trk = PTS.map(p => `<trkpt lat="${p[0]}" lon="${p[1]}"><ele>${p[2]}</ele></trkpt>`).join('\n');
    const g = t(), esw = PL.escapes.map(e => `<wpt lat="${e.ll[0]}" lon="${e.ll[1]}"><name>${esc(g.escape + ': ' + e[L])}</name></wpt>`).join('\n');
    const cw = CS.flatMap((s, si) => s.points.filter((p, pi) => si === 0 || pi > 0).map(p => `<wpt lat="${p.ll[0]}" lon="${p.ll[1]}"><ele>${p.ele}</ele><name>${esc(g.planC + ': ' + p[L])}</name></wpt>`)).join('\n');
    const ctrk = PC.pts.map(p => `<trkpt lat="${p[0]}" lon="${p[1]}"><ele>${p[2]}</ele></trkpt>`).join('\n'), atrk = PC.alt.map(p => `<trkpt lat="${p[0]}" lon="${p[1]}"></trkpt>`).join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Andes Wild Trek" xmlns="http://www.topografix.com/GPX/1/1">\n<metadata><name>Apolobamba · Pelechuco–Charazani</name><desc>Track: ${TR.author}, Wikiloc (${TR.year}). ${g.planC} i ${g.altRoute}: ${PC.src}</desc></metadata>\n${wpts}\n${esw}\n${cw}\n<trk><name>Pelechuco–Charazani</name><trkseg>\n${trk}\n</trkseg></trk>\n<trk><name>${esc(PL.c[L].title)}</name><trkseg>\n${ctrk}\n</trkseg></trk>\n<trk><name>${esc(g.altRoute)}</name><trkseg>\n${atrk}\n</trkseg></trk>\n</gpx>\n`;
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([xml], { type: 'application/gpx+xml' })); a.download = 'Apolobamba_Pelechuco_Charazani.gpx'; document.body.append(a); a.click(); a.remove();
  }
  function locate() {
    const g = t(), out = document.getElementById('loc');
    if (!navigator.geolocation) { out.textContent = g.locErr; return; }
    out.textContent = g.locating;
    navigator.geolocation.getCurrentPosition(pos => {
      const ll = [pos.coords.latitude, pos.coords.longitude], [d, k] = nearest(ll);
      const ds = d >= 1000 ? `${dec(d / 1000)} km` : `${fmt(d)} m`, acc = g.acc.replace('{a}', fmt(pos.coords.accuracy));
      you = ll; you.km = d < 5000 ? k : null;
      you.msg = (d < 5000 ? g.you.replace('{d}', ds).replace('{k}', dec(k)).replace('{day}', `${g.day} ${DAYS[stageAt(k)].day}`) : g.far.replace('{d}', ds)) + ' · ' + acc;
      if (d < 5000) mapDay = stageAt(k);
      render();
    }, () => { out.textContent = g.locErr; }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 30000 });
  }

  /* ---------- Meteo ---------- */
  function meteo() {
    const g = t(), less90 = s => { const [h, m] = s.split(':').map(Number), v = h * 60 + m - 90; return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`; };
    return `<article class="card"><h2>${g.meteoTitle}</h2><p>${g.meteoWhen}</p></article>
    <div class="list">${g.meteoSources.map(([a, b, u]) => `<article class="item"><h3>${a}</h3><p>${b}</p>${u ? `<a href="${u}" target="_blank" rel="noopener">${u.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '').split('?')[0]} ↗</a>` : ''}</article>`).join('')}</div>
    <article class="card"><h2>${g.meteoCriteria}</h2><ul>${g.criteria.map(x => `<li>${x}</li>`).join('')}</ul></article>
    <article class="card"><h2>${g.seasonCard}</h2><p><b>${PL.season[L].window}</b><br>${PL.season[L].proposal}</p><ol class="months">${PL.season.months.map((m, i) => `<li class="m-${m}" title="${PL.season[L].legend[m]}">${PL.season[L].monthNames[i]}</li>`).join('')}</ol>${PL.season[L].reasons.map(([a, b]) => `<details class="sf"><summary>${a}</summary><p>${b}</p></details>`).join('')}</article>
    <article class="card"><h2>${g.roadsCard} <small>· ${g.checkedOn} ${PL.roads.checked}</small></h2>${PL.roads[L].items.map(([a, b]) => `<details class="sf"><summary>${a}</summary><p>${hm(b)}</p></details>`).join('')}</article>
    <article class="card"><h2>${g.sunTitle}</h2><table class="sun"><thead><tr>${g.sunCols.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${G.sun.map(([dd, a, b]) => `<tr><td>${dd}/06</td><td>${a}</td><td>${b}</td><td>${less90(b)}</td></tr>`).join('')}</tbody></table></article>`;
  }

  /* ---------- Seguretat ---------- */
  function safety() {
    const g = t(), saved = store.get('guia-contacts', {});
    const max = Math.max(...g.nights.map(n => n[1]));
    return `<article class="card"><h2>${g.safetyTitle}</h2>${g.safety.map(([a, b]) => `<details class="sf"><summary>${a}</summary><p>${b}</p></details>`).join('')}</article>
    <article class="card"><h2>${g.rulesCard}</h2>${PL.rules[L].items.map(([a, b]) => `<details class="sf"><summary>${a}</summary><p>${b}</p></details>`).join('')}</article>
    <article class="card"><h2>${g.nightsTitle}</h2><ul class="bars">${g.nights.map(([n, e], i) => { const prev = i ? g.nights[i - 1][1] : e, jump = e - prev; return `<li><span>${n}</span><i style="width:${((e - 3000) / (max - 3000) * 100).toFixed(0)}%"></i><b>${fmt(e)}</b><em class="${jump > 500 ? 'warn' : ''}">${i ? (jump >= 0 ? '+' : '−') + fmt(Math.abs(jump)) : ''}</em></li>`; }).join('')}</ul><p class="note">${g.nightsNote}</p></article>
    <article class="card"><h2>${g.contactsTitle}</h2><p class="note">${g.contactsHint}</p>${g.contacts.map((n, i) => `<label class="fld">${n}<input data-contact="${i}" value="${esc(saved[i] || '')}" inputmode="text"></label>`).join('')}</article>`;
  }

  /* ---------- Llistes ---------- */
  function checks() {
    const g = t(), done = new Set(store.get('guia-checks', []));
    return `<div class="list">${g.checks.map(([h, items], a) => `<article class="item"><h3>${h}</h3>${items.map((x, b) => `<label class="chk"><input type="checkbox" data-chk="${a}-${b}" ${done.has(`${a}-${b}`) ? 'checked' : ''}><span>${x}</span></label>`).join('')}</article>`).join('')}</div><button type="button" class="btn ghost" id="reset">${g.reset}</button>`;
  }

  function render() {
    const g = t(); document.documentElement.lang = L; document.title = g.title;
    const views = [days, map, meteo, safety, checks];
    app.innerHTML = `<header class="top"><div><h1>${g.title}</h1><p>${g.sub}</p></div><div class="lang"><button type="button" data-lang="ca" aria-pressed="${L === 'ca'}">CA</button><button type="button" data-lang="es" aria-pressed="${L === 'es'}">ES</button></div></header>
    <p class="status ${navigator.serviceWorker && navigator.serviceWorker.controller ? 'ok' : ''}">${navigator.serviceWorker && navigator.serviceWorker.controller ? g.offlineOk : g.offlineNo}</p>
    <main>${views[tab]()}<p class="foot">${g.footer}</p></main>
    <nav class="tabs">${g.tabs.map((x, i) => `<button type="button" data-tab="${i}" class="${i === tab ? 'on' : ''}">${x}</button>`).join('')}</nav>`;
  }
  app.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.tab) { tab = +b.dataset.tab; store.set('guia-tab', tab); render(); scrollTo(0, 0); }
    else if (b.dataset.lang) { L = b.dataset.lang; store.set('guia-lang', L); render(); }
    else if (b.dataset.day) { day = +b.dataset.day; store.set('guia-day', day); render(); }
    else if (b.dataset.mapday) { mapDay = +b.dataset.mapday; render(); }
    else if (b.dataset.copy) { navigator.clipboard?.writeText(b.dataset.copy).then(() => { b.textContent = t().copied; }).catch(() => {}); }
    else if (b.id === 'locate') locate();
    else if (b.id === 'gpx') gpx();
    else if (b.id === 'reset') { store.set('guia-checks', []); render(); }
  });
  app.addEventListener('change', e => {
    if (e.target.dataset.chk) store.set('guia-checks', [...app.querySelectorAll('[data-chk]:checked')].map(x => x.dataset.chk));
  });
  app.addEventListener('input', e => {
    if (e.target.dataset.contact) { const s = store.get('guia-contacts', {}); s[e.target.dataset.contact] = e.target.value; store.set('guia-contacts', s); }
  });
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready).then(() => setTimeout(render, 400)).catch(() => {});
  render();
})();
