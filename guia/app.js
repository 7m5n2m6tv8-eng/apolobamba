/* App del guia · Apolobamba. Mateixa estructura que l'app de ruta del Catllaràs:
   Ara (hora, llum, GPS, retard, pròxim punt, què falta, pròxima decisió, meteo), Punts, Mapa, Plans, SOS i Info.
   Tot funciona sense cobertura. Hores locals de Bolívia (BOT, UTC−4), sigui quina sigui l'hora del mòbil. */
'use strict';
const A = window.APP, G = window.GUIDE, PL = window.PLANS, PC = window.PLANC, DAYS = window.DAYS;
const JORN = A.JORN, RUTES = A.RUTES;

// ---------------- UTILS ----------------
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem('apb_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('apb_' + k, JSON.stringify(v)); } catch (e) {} }
};
let L = store.get('lang', 'ca'); if (!A.LANGS.includes(L)) L = 'ca';
const T = (k, vars) => { let s = (window.UI[L] && window.UI[L][k]) ?? window.UI.ca[k] ?? k; if (vars) for (const v in vars) s = s.split('{' + v + '}').join(vars[v]); return s; };
const nm = o => (o && (o[L] || o.es || o.ca)) || '';
const sep = () => L === 'en' ? '.' : ',';
const dec = (n, d = 1) => Number(n).toFixed(d).replace('.', sep());
const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ({ en: ',', fr: ' ' })[L] || '.');
const hhmm = m => { m = Math.round(((m % 1440) + 1440) % 1440); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
const fmtMin = m => (m < 0 ? '−' : '') + hhmm(Math.abs(m));
const fmtDur = m => { m = Math.round(m); const s = m < 0 ? '−' : ''; m = Math.abs(m); const h = Math.floor(m / 60); return s + (h ? h + ' h ' + String(m % 60).padStart(2, '0') : (m % 60) + ' min'); };
const dist = m => m < 1000 ? Math.round(m) + ' m' : dec(m / 1000, m < 10000 ? 2 : 1) + ' km';
const hav = A.hav;
function bearing(a, b, c, d) { const r = Math.PI / 180, y = Math.sin((d - b) * r) * Math.cos(c * r), x = Math.cos(a * r) * Math.sin(c * r) - Math.sin(a * r) * Math.cos(c * r) * Math.cos((d - b) * r); return (Math.atan2(y, x) / r + 360) % 360; }
const CARD = () => T('card').split(',');
// UTM WGS84 (zona 19 sud a Apolobamba)
function utm(lat, lon) {
  const zone = Math.floor((lon + 180) / 6) + 1, a = 6378137, f = 1 / 298.257223563, k0 = 0.9996, e2 = f * (2 - f), ep2 = e2 / (1 - e2), r = Math.PI / 180;
  const phi = lat * r, lam = (lon - (zone * 6 - 183)) * r, N = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2), Tn = Math.tan(phi) ** 2, C = ep2 * Math.cos(phi) ** 2, Aa = lam * Math.cos(phi);
  const M = a * ((1 - e2 / 4 - 3 * e2 ** 2 / 64 - 5 * e2 ** 3 / 256) * phi - (3 * e2 / 8 + 3 * e2 ** 2 / 32 + 45 * e2 ** 3 / 1024) * Math.sin(2 * phi) + (15 * e2 ** 2 / 256 + 45 * e2 ** 3 / 1024) * Math.sin(4 * phi) - (35 * e2 ** 3 / 3072) * Math.sin(6 * phi));
  const X = k0 * N * (Aa + (1 - Tn + C) * Aa ** 3 / 6 + (5 - 18 * Tn + Tn * Tn + 72 * C - 58 * ep2) * Aa ** 5 / 120) + 500000;
  let Y = k0 * (M + N * Math.tan(phi) * (Aa * Aa / 2 + (5 - Tn + 9 * C + 4 * C * C) * Aa ** 4 / 24 + (61 - 58 * Tn + Tn * Tn + 600 * C - 330 * ep2) * Aa ** 6 / 720));
  if (lat < 0) Y += 10000000;
  return { X: Math.round(X), Y: Math.round(Y), zona: zone + (lat < 0 ? 'S' : 'N') };
}

// ---------------- HORA (BOT) I DATES ----------------
const BOT = -240; // minuts respecte d'UTC
let sim = null;
function botAra() { return new Date(Date.now() + BOT * 60000); } // camps UTC = hora de Bolívia
function nowMin() { if (sim !== null) return sim; const d = botAra(); return d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60; }
const isoUTC = d => d.toISOString().slice(0, 10);
let inici = store.get('inici', '2027-06-16'); // dia 1 del programa (provisional: segona quinzena de juny de 2027)
function dataDia(n) { const d = new Date(inici + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n - 1); return d; }
const dataIso = n => isoUTC(dataDia(n));
const dataTxt = n => { const d = dataDia(n); return d.getUTCDate() + '/' + (d.getUTCMonth() + 1); };

// ---------------- ESTAT ----------------
function jornadaAvui() {
  const avui = isoUTC(botAra());
  const ruta = store.get('ruta', 'A'); // A = ruta principal · C = s'ha activat el pla C abans de sortir
  return JORN.find(J => J.tipus === ruta && dataIso(J.dia) === avui) || null;
}
let J = jornadaAvui() || JORN.find(x => x.id === store.get('jorn', 'd5')) || JORN[0];
let arr = store.get('arr', {}); // {"7:3": minuts}
let gps = null, watchId = null, lastM = {}, target = null;
const PTS = () => J.pts;

// ---------------- CÀLCULS SOBRE EL TRAÇAT ----------------
function cumAt(Jx, arrCum, m) {
  const t = Jx.trk; if (m <= 0) return 0;
  for (let i = 1; i < t.length; i++) if (t[i][3] >= m) { const f = (m - t[i - 1][3]) / Math.max(1, t[i][3] - t[i - 1][3]); return arrCum[i - 1] + f * (arrCum[i] - arrCum[i - 1]); }
  return arrCum[arrCum.length - 1];
}
const dz = (Jx, m0, m1) => ({ up: Math.round(cumAt(Jx, Jx.cu, m1) - cumAt(Jx, Jx.cu, m0)), dn: Math.round(cumAt(Jx, Jx.cd, m1) - cumAt(Jx, Jx.cd, m0)) });
// Hora prevista (minuts) a una posició del traçat: interpolada entre les hores del programa
function planAt(m) {
  const ps = PTS();
  for (let i = 0; i < ps.length - 1; i++) { const a = ps[i], b = ps[i + 1]; if (m >= a.m && m <= b.m) return a.t + (b.t - a.t) * (m - a.m) / Math.max(1, b.m - a.m); }
  return m < ps[0].m ? ps[0].t : ps[ps.length - 1].t;
}
function snap(lat, lon) {
  const t = J.trk, kx = Math.cos(lat * Math.PI / 180) * 111320, ky = 110540, prev = lastM[J.id];
  let best = null, win = null;
  for (let i = 0; i < t.length - 1; i++) {
    const p = t[i], q = t[i + 1], ax = (p[1] - lon) * kx, ay = (p[0] - lat) * ky, bx = (q[1] - lon) * kx, by = (q[0] - lat) * ky;
    const dx = bx - ax, dy = by - ay, Ls = dx * dx + dy * dy; let f = Ls ? -(ax * dx + ay * dy) / Ls : 0; f = Math.max(0, Math.min(1, f));
    const d = Math.hypot(ax + f * dx, ay + f * dy), m = p[3] + f * (q[3] - p[3]), ele = p[2] + f * ((q[2] ?? p[2]) - p[2]), c = { dist: d, m, ele };
    if (!best || d < best.dist) best = c;
    if (prev != null && m >= prev - 300 && m <= prev + 1500 && (!win || d < win.dist)) win = c;
  }
  if (win && win.dist < best.dist + 40) best = win;
  return best;
}
function progress() {
  if (gps && gps.snap && gps.snap.dist < 300) return { m: gps.snap.m, src: 'gps' };
  let last = null; PTS().forEach(p => { if (arr[p.k] !== undefined) last = p; });
  return last ? { m: last.m, src: 'marca', p: last } : null;
}
function retard(pr, n) { return pr.src === 'marca' ? arr[pr.p.k] - pr.p.t : n - planAt(pr.m); }
// Hora d'arribada a un punt: des d'ara (GPS) o des de l'hora real de l'últim punt marcat, més el temps previst que falta
function arribadaA(p, pr, n) {
  const base = pr.src === 'marca' ? arr[pr.p.k] : n, falta = Math.max(0, p.t - planAt(pr.m));
  return { arr: base + falta, falta: pr.src === 'marca' ? Math.max(0, base + falta - n) : falta };
}

// ---------------- LLUM ----------------
// Sortida i posta de sol (algorisme NOAA) al centre de la travessa. Lloc segur = posta − 90 min (criteri del treball: arribar abans de les 16.40).
function sol(dataD, lat, lon) {
  const r = Math.PI / 180, y = dataD.getUTCFullYear(), N = Math.floor((Date.UTC(y, dataD.getUTCMonth(), dataD.getUTCDate()) - Date.UTC(y, 0, 1)) / 864e5) + 1, g = 2 * Math.PI / 365 * (N - 1);
  const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const de = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const ha = Math.acos(Math.cos(90.833 * r) / (Math.cos(lat * r) * Math.cos(de)) - Math.tan(lat * r) * Math.tan(de)) / r;
  return { surt: 720 - 4 * (lon + ha) - eq + BOT, posta: 720 - 4 * (lon - ha) - eq + BOT };
}
function llum(Jx) { const p = Jx.pts[Jx.pts.length - 1].ll, s = sol(dataDia(Jx.dia), p[0], p[1]); return { surt: s.surt, posta: s.posta, safe: s.posta - 90, txt: dataTxt(Jx.dia) }; }

// ---------------- RENDER: ARA ----------------
function setJorn(id) {
  const nou = JORN.find(x => x.id === id); if (!nou) return;
  J = nou; store.set('jorn', id);
  if (gps) { gps.snap = snap(gps.lat, gps.lon); if (gps.snap && gps.snap.dist < 300) lastM[J.id] = gps.snap.m; pintaGpsKv(); }
  if (window.pla) pla.canviJorn();
  pintaSelectors(); renderPunts(); tick(); if (window.mapa) mapa.dibuixa(); if (window.meteo) meteo.pinta(); if (window.aval) aval.pinta();
}
function chipsJorn(id) {
  return `<div class="chips" id="${id}">${JORN.map(x => `<button data-j="${x.id}" class="${x.tipus === 'C' ? 'pc ' : ''}${x.id === J.id ? 'on' : ''}">${x.tipus === 'A' ? T('dayShort') + ' ' + x.dia : x.codi}</button>`).join('')}</div>`;
}
function pintaSelectors() { ['#jornAra', '#jornPunts', '#jornMapa'].forEach(s => { const e = $(s); if (e) e.outerHTML = chipsJorn(s.slice(1)); }); $('#hdrsub').textContent = titolJorn(J) + ' · ' + dataTxt(J.dia); }
function titolJorn(Jx) { return Jx.tipus === 'A' ? T('day') + ' ' + Jx.dia + ' · ' + nm(Jx.pts[0].n) + ' → ' + nm(Jx.pts[Jx.pts.length - 1].n) : T('planC') + ' ' + Jx.codi + ' · ' + nm(Jx.nomC); }
function pintaGpsKv() {
  const s = gps && gps.snap;
  $('#offTrack').textContent = s ? dist(s.dist) : '--';
  $('#offTrack').className = s && s.dist > 100 ? 'bad' : s && s.dist > 40 ? 'warn' : s ? 'ok' : '';
  $('#eleNow').textContent = gps && gps.alt != null ? fmt(gps.alt) + ' m' : s ? '≈' + fmt(s.ele) + ' m' : '--';
}
function tick() {
  const n = nowMin();
  $('#clock').textContent = hhmm(n) + (sim !== null ? '*' : '');
  const Lx = llum(J);
  $('#safeLbl').textContent = T('toSafe', { h: hhmm(Lx.safe) });
  $('#sunLbl').textContent = T('toSunset', { h: hhmm(Lx.posta) });
  $('#safeLeft').textContent = fmtDur(Lx.safe - n); $('#safeLeft').className = Lx.safe - n < 30 ? 'bad' : Lx.safe - n < 90 ? 'warn' : '';
  $('#sunLeft').textContent = fmtDur(Lx.posta - n);
  const ps = PTS(), pr = progress(), alerts = [];
  const solTxt = `<br><span class="mut">${T('sunCalc', { d: Lx.txt, s: hhmm(Lx.surt), p: hhmm(Lx.posta) })}</span>`;
  const plaAl = window.pla ? pla.render(n, Lx.safe) : null;
  if (plaAl) {
    alerts.push(...plaAl);
    $('#llumA').innerHTML = T('followingPlan', { p: esc(pla.actiu()) }) + solTxt;
  } else {
    const fi = ps[ps.length - 1], eta = pr ? arribadaA(fi, pr, n).arr : fi.t, marge = Lx.safe - eta;
    $('#llumA').innerHTML = T('etaEnd', { c: esc(nm(fi.n)), h: fmtMin(eta) }) + ` <b class="${marge < 0 ? 'bad' : marge < 30 ? 'warn' : 'ok'}">${marge < 0 ? T('lightMissing', { d: fmtDur(-marge) }) : T('margin', { d: fmtDur(marge) })}</b> ${T('before', { h: hhmm(Lx.safe) })}` + solTxt;
    if (pr && marge < 0) alerts.push(['bad', T('alLate', { c: nm(fi.n), h: fmtMin(eta), s: hhmm(Lx.safe) })]);
    if (pr && eta > 16 * 60 + 40 && marge >= 0) alerts.push(['warn', T('alLimit', { c: nm(fi.n), h: fmtMin(eta) })]);
  }
  if (pr) {
    $('#kmDone').textContent = dec(Math.max(0, pr.m) / 1000, 2);
    const late = retard(pr, n);
    $('#delay').textContent = (late > 0 ? '+' : '') + fmtDur(late); $('#delay').className = late > 20 ? 'bad' : late > 5 ? 'warn' : 'ok';
    const nxt = ps.find(p => p.m > pr.m + 20);
    if (nxt) {
      const eta = arribadaA(nxt, pr, n).arr, limLeft = nxt.l - n, obert = !!document.querySelector('#nextBody details[open]');
      $('#nextBody').innerHTML = `<div class="hd"><span class="code">${nxt.c}</span> <b>${esc(nm(nxt.n))}</b> <span class="mut small">${fmt(nxt.ele)} m</span></div>
        <div class="grid2" style="margin-top:8px">
          <div class="kv"><b>${dist(nxt.m - pr.m)}</b><span>${T('byTrack')}</span></div>
          <div class="kv"><b>${hhmm(nxt.t)}${nxt.t2 !== nxt.t ? '–' + hhmm(nxt.t2) : ''}</b><span>${T('planned')}</span></div>
          <div class="kv"><b>${fmtMin(eta)}</b><span>${T('estimated')}</span></div>
          <div class="kv"><b class="${limLeft < 0 ? 'bad' : limLeft < 20 ? 'warn' : ''}">${hhmm(nxt.l)}</b><span>${T('limit')} (${limLeft < 0 ? T('passed') : T('left', { d: fmtDur(limLeft) })})</span></div>
        </div>${nm(nxt.f) ? `<details><summary>${T('whatToCheck')}</summary><p class="small">${esc(nm(nxt.f))}</p></details>` : ''}`;
      if (obert) { const dd = document.querySelector('#nextBody details'); if (dd) dd.open = true; }
    } else $('#nextBody').innerHTML = `<b>${T('endStage')}</b>`;
    renderFalta(pr, n);
  } else {
    $('#kmDone').textContent = '--'; $('#delay').textContent = '--'; $('#delay').className = '';
    $('#nextBody').textContent = T('noProgress'); renderFalta(null, n);
  }
  // pròxima decisió
  const curM = pr ? pr.m : -1;
  const nd = ps.find(p => p.dec && p.m >= curM - 20 && arr[p.k] === undefined) || null;
  if (nd) {
    const left = nd.l - n;
    $('#decBody').innerHTML = `<div class="hd"><span class="code">${nd.c}</span> <b>${esc(nm(nd.n))}</b></div>
      <div class="big ${left < 0 ? 'bad' : left < 30 ? 'warn' : ''}" style="margin:6px 0">${hhmm(nd.l)}</div>
      <div class="${left < 0 ? 'bad' : 'mut'}">${left < 0 ? T('decPassed', { d: fmtDur(-left), x: esc(nm(nd.dec)) }) : T('decLeft', { d: fmtDur(left), x: esc(nm(nd.dec)) })}</div>
      <p style="margin:6px 0 0" class="small">${esc(nm(nd.f))}</p>`;
    if (left < 0) alerts.unshift(['bad', T('alDec', { c: nm(nd.n), h: hhmm(nd.l), x: nm(nd.dec) })]);
  } else $('#decBody').innerHTML = `<span class="mut">${T('noDec')}</span>`;
  if (Lx.safe - n < 60 && Lx.safe - n > -200) alerts.push(['warn', T('alLight')]);
  if (!plaAl && gps && gps.snap && gps.snap.dist > 100) alerts.unshift(['bad', T('alOff', { d: Math.round(gps.snap.dist) })]);
  if (window.meteo) { alerts.push(...meteo.alertes(J)); meteo.ara(); }
  $('#alerts').innerHTML = alerts.map(a => `<div class="alert ${a[0]}">${esc(a[1])}</div>`).join('');
  renderTarget();
}
function renderFalta(pr, n) {
  const el = $('#faltaBody');
  if (!pr) { el.className = 'mut small'; el.textContent = T('noProgress'); return; }
  const ps = PTS(), fi = ps[ps.length - 1], nxt = ps.find(p => p.m > pr.m + 20);
  if (!nxt) { el.className = 'small'; el.innerHTML = `<b>${T('endStage')}</b>`; return; }
  const fila = (nom, p) => { const z = dz(J, pr.m, p.m), Ar = arribadaA(p, pr, n);
    return `<div class="fblk"><div class="hd"><span class="code">${p.c}</span> <b>${esc(nm(p.n))}</b> <span class="mut small">· ${nom}</span></div>
      <div class="g4"><div><b>${dec((p.m - pr.m) / 1000, 2)} km</b><span>${T('distance')}</span></div><div><b>+${fmt(z.up)} / −${fmt(z.dn)} m</b><span>${T('elevation')}</span></div><div><b>${fmtDur(Ar.falta)}</b><span>${T('time')}</span></div><div><b>${fmtMin(Ar.arr)}</b><span>${T('arrival')}</span></div></div></div>`; };
  el.className = 'small';
  el.innerHTML = fila(T('nextPoint'), nxt) + (nxt !== fi ? fila(T('endOfDay'), fi) : '') + `<p class="mut" style="margin:6px 0 0">${T(pr.src === 'marca' ? 'faltaNoteMark' : 'faltaNote')}</p>`;
}

// ---------------- RENDER: PUNTS ----------------
function renderPunts() {
  const ps = PTS(), Lx = llum(J);
  const night = J.tipus === 'A' ? (DAYS[J.idx] || {}).nightLabel : (PL.c.stages[J.idx] || {}).nightLabel;
  $('#dayHead').innerHTML = `<h2>${esc(titolJorn(J))}</h2>
    <div>${dec(J.km)} km · +${fmt(J.up)} / −${fmt(J.dn)} m · ${T('max')} ${fmt(J.max)} m · ${esc(J.hores)}</div>
    <div class="mut small">${T('startEnd', { a: hhmm(J.ini), b: J.arr.map(hhmm).join('–'), n: night || '' })} · ${T('sunset')} ${hhmm(Lx.posta)} (${Lx.txt})</div>
    ${J.tipus === 'A' ? `<p class="small" style="margin:8px 0 0">${esc((window.COPY[L].stageFocusText || [])[J.idx] || '')}</p>` : ''}`;
  $('#profile').innerHTML = perfilSvg();
  $('#ptList').innerHTML = ps.map((p, i) => {
    const a = arr[p.k], nx = ps[i + 1];
    const lateTxt = a !== undefined ? ` · <b class="${a - p.t > 20 ? 'bad' : a - p.t > 5 ? 'warn' : 'ok'}">${T('arrived')} ${hhmm(a)} (${a - p.t > 0 ? '+' : ''}${fmtDur(a - p.t)})</b>` : '';
    let tram = '';
    if (nx) { const z = dz(J, p.m, nx.m); tram = `<div class="tram">${T('toNext', { c: nx.c })} · ${dec((nx.m - p.m) / 1000, 2)} km · +${fmt(z.up)} / −${fmt(z.dn)} m · ${fmtDur(nx.t - (p.t))} ${T('planShort')}</div>`; }
    return `<div class="pt ${p.dec ? 'dec' : ''} ${a !== undefined ? 'done' : ''}">
      <div class="hd"><span class="code">${p.c}</span><span class="nm">${esc(nm(p.n))}${p.dec ? `<span class="tag">${T('decisionTag')}</span>` : ''}</span></div>
      <div class="times"><span>${fmt(p.ele)} m</span><span>km ${dec(p.m / 1000)}</span><span>${T('planShort')} <b>${hhmm(p.t)}${p.t2 !== p.t ? '–' + hhmm(p.t2) : ''}</b></span><span>${p.abans ? T('beforeLeaving') : T('limit') + ' <b>' + hhmm(p.l) + '</b>'}</span></div>
      <div class="small">${esc(nm(p.f))}${p.dec ? ` <b class="warn">${T('ifExceeded')}: ${esc(nm(p.dec))}.</b>` : ''}${lateTxt}</div>
      <div class="row" style="margin-top:6px">
        <button class="btn sm" data-arr="${p.k}">${a !== undefined ? T('unmark') : T('hereNow')}</button>
        <button class="btn sm" data-nav="${p.c}">${T('navigate')}</button>
        <button class="btn sm" data-copy="${p.ll[0].toFixed(5)}, ${p.ll[1].toFixed(5)}">${T('copyCoords')}</button>
      </div>${tram}</div>`;
  }).join('');
  const pb = (PL.b.find(b => b.day === J.dia && J.tipus === 'A') || {})[L] || [];
  $('#ptPlanB').innerHTML = pb.length ? `<h2>${T('planBday', { d: J.dia })}</h2>` + pb.map(([x, y]) => `<details class="sf"><summary>${esc(x)}</summary><p class="small">${esc(y)}</p></details>`).join('') : `<h2>${T('planC')} ${J.codi}</h2><p class="small">${esc(nm(J.pts[J.pts.length - 1].f))}</p>`;
}
function perfilSvg() {
  const t = J.trk, W = 400, H = 120, l = 36, r = 6, tp = 8, b = 18, tot = t[t.length - 1][3];
  const es = t.map(p => p[2]).filter(v => v != null), lo = Math.floor((Math.min(...es) - 50) / 250) * 250, hi = Math.ceil((Math.max(...es) + 50) / 250) * 250;
  const x = m => l + (W - l - r) * m / tot, y = e => tp + (H - tp - b) * (1 - (e - lo) / (hi - lo));
  const line = t.map(p => `${x(p[3]).toFixed(1)},${y(p[2]).toFixed(1)}`).join(' ');
  const grid = []; for (let e = lo; e <= hi; e += (hi - lo > 1000 ? 500 : 250)) grid.push(`<line x1="${l}" x2="${W - r}" y1="${y(e)}" y2="${y(e)}" class="gl"/><text x="${l - 4}" y="${y(e) + 4}" text-anchor="end">${fmt(e)}</text>`);
  const pts = J.pts.map(p => `<circle cx="${x(p.m)}" cy="${y(p.ele)}" r="${p.dec ? 4.5 : 3}" class="${p.dec ? 'pd' : 'pp'}"/><text x="${x(p.m)}" y="${H - 4}" text-anchor="middle">${p.c.split('.')[1]}</text>`).join('');
  const me = gps && gps.snap && gps.snap.dist < 300 ? `<line x1="${x(gps.snap.m)}" x2="${x(gps.snap.m)}" y1="${tp}" y2="${H - b}" class="me"/>` : '';
  return `<svg viewBox="0 0 ${W} ${H}" class="prof" role="img" aria-label="${T('profile')}">${grid.join('')}<polygon points="${x(0)},${H - b} ${line} ${x(tot)},${H - b}" class="pa"/><polyline points="${line}" class="pl"/>${me}${pts}</svg>`;
}

// ---------------- RENDER: PLANS, SOS, INFO (estàtic per idioma) ----------------
function horesRuta(r) { return fmtDur(r.min); }
function renderStatic() {
  // Plans
  $('#quefer').innerHTML = G[L].safety.map(([a, b]) => `<details class="sf"><summary>${esc(a)}</summary><p class="small">${esc(b)}</p></details>`).join('');
  $('#esquema').innerHTML = JORN.filter(x => x.tipus === 'A').map(x => `<p class="small"><b>${T('dayShort')} ${x.dia}</b> ${x.pts.map(p => p.dec ? `<b class="warn">◆ ${esc(nm(p.n))} ${hhmm(p.l)}</b>` : esc(nm(p.n))).join(' → ')}${x.rutes.filter(id => RUTES[id].seguible).map(id => ` ▸ <b>${RUTES[id].codi}</b>: ${esc(nm(RUTES[id].n))}`).join('')}</p>`).join('') +
    `<p class="small"><b>${T('planC')}</b> ${JORN.filter(x => x.tipus === 'C').map(x => `${x.codi} ${esc(nm(x.nomC))}`).join(' ▸ ')}</p>`;
  $('#plansB').innerHTML = PL.b.map(b => {
    const rs = (PC.routes || []).filter(r => r.day === b.day).map(r => RUTES[r.id]);
    return `<details class="sf"><summary>${T('day')} ${b.day} · ${esc((window.COPY[L].stageNames || [])[JORN.findIndex(x => x.dia === b.day && x.tipus === 'A')] || '')}</summary>
      ${(b[L] || b.es).map(([x, y]) => `<p class="small"><b>${esc(x)}.</b> ${esc(y)}</p>`).join('')}
      ${rs.map(r => `<div class="pt"><div class="hd"><span class="code">${r.tipus === 'walk' ? '🥾' : '🚙'} ${esc(r.codi)}</span><span class="nm">${esc(nm(r.n))}</span>${r.seguible ? `<button class="btn sm" data-seguir="${r.id}">${T('follow')}</button>` : ''}</div>
        <div class="small mut">${dec(r.km)} km · +${fmt(r.up)} / −${fmt(r.dn)} m${r.tipus === 'walk' ? ' · ≈' + horesRuta(r) + ' ' + T('walking') : ''}</div></div>`).join('')}
      <a class="btn sm" href="../dossiers/gpx/Apolobamba_Pla_B_Dia${b.day}.gpx" download>${T('gpxB', { d: b.day })}</a></details>`;
  }).join('');
  const C = PL.c[L] || PL.c.es;
  $('#planC').innerHTML = `<p class="small">${esc(C.intro)}</p><ul class="small">${C.when.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
    <table><tr><th>${T('dayShort')}</th><th>${T('stage')}</th></tr>${C.program.map(([a, b]) => `<tr><td><b>${esc(a)}</b></td><td>${esc(b)}</td></tr>`).join('')}</table>
    ${JORN.filter(x => x.tipus === 'C').map(x => `<div class="pt"><div class="hd"><span class="code">${x.codi}</span><span class="nm">${esc(nm(x.nomC))}</span><button class="btn sm" data-j2="${x.id}">${T('openStage')}</button></div><div class="small mut">${dec(x.km)} km · +${fmt(x.up)} / −${fmt(x.dn)} m · ${T('max')} ${fmt(x.max)} m · ${esc(x.hores)}</div></div>`).join('')}
    <div class="row" style="margin-top:8px"><button class="btn sm ac" data-ruta="C">${T('activateC')}</button><button class="btn sm" data-ruta="A">${T('backToA')}</button><a class="btn sm" href="../dossiers/gpx/Apolobamba_Pla_C.gpx" download>${T('gpxC')}</a></div>
    <p class="small mut">${esc(C.source)}</p>`;
  $('#llindars').innerHTML = `<ul class="small">${G[L].criteria.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` + (PL.rules[L] || PL.rules.es).items.map(([a, b]) => `<details class="sf"><summary>${esc(a)}</summary><p class="small">${esc(b)}</p></details>`).join('');
  $('#trBC').innerHTML = `<div class="scroll"><table><tr><th>${T('plan')}</th><th>${T('route')}</th><th>km</th><th>+/− m</th><th>${T('walk')}</th></tr>` +
    Object.values(RUTES).map(r => `<tr><td><b>${T('dayShort')} ${r.dia}</b> ${r.tipus === 'walk' ? '🥾' : '🚙'}</td><td>${esc(nm(r.n))}</td><td>${dec(r.km)}</td><td>+${fmt(r.up)}/−${fmt(r.dn)}</td><td>${r.tipus === 'walk' ? '≈' + horesRuta(r) : '—'}</td></tr>`).join('') +
    JORN.filter(x => x.tipus === 'C').map(x => `<tr><td><b>${x.codi}</b></td><td>${esc(nm(x.nomC))}</td><td>${dec(x.km)}</td><td>+${fmt(x.up)}/−${fmt(x.dn)}</td><td>${esc(x.hores)}</td></tr>`).join('') + '</table></div>';
  // SOS
  $('#protocol').innerHTML = `<ol class="small" style="padding-left:20px;margin:4px 0">${T('protocolList').split('|').map(x => `<li>${x}</li>`).join('')}</ol>` +
    G[L].safety.filter((x, i) => i >= 2 && i <= 3).map(([a, b]) => `<p class="small"><b>${esc(a)}.</b> ${esc(b)}</p>`).join('');
  pintaContactes();
  $('#coordTbl').innerHTML = `<div class="scroll"><table><tr><th>${T('code')}</th><th>${T('point')}</th><th>WGS84</th><th>UTM</th><th>m</th></tr>` +
    A.COORD.map(r => { const u = utm(r.ll[0], r.ll[1]); return `<tr><td><b>${r.c}</b></td><td>${esc(nm(r.n))}</td><td>${r.ll[0].toFixed(5)}, ${r.ll[1].toFixed(5)}</td><td>${u.zona} ${u.X} ${u.Y}</td><td>${fmt(r.ele)}</td></tr>`; }).join('') +
    A.SORTIDES.map(s => { const u = utm(s.ll[0], s.ll[1]); return `<tr><td><b>🚙</b></td><td>${esc(nm(s.n))}</td><td>${s.ll[0].toFixed(4)}, ${s.ll[1].toFixed(4)}</td><td>${u.zona} ${u.X} ${u.Y}</td><td></td></tr>`; }).join('') + '</table></div>';
  // Info
  $('#grup').innerHTML = T('groupHtml', { f: dec(A.RITME.f) });
  $('#horari').innerHTML = `<div class="scroll"><table><tr><th>${T('dayShort')}</th><th>${T('stage')}</th><th>km</th><th>${T('start')}</th><th>${T('arrival')}</th><th>${T('night')}</th></tr>` +
    JORN.map(x => `<tr class="${x.id === J.id ? 'cur' : ''}"><td><b>${x.tipus === 'A' ? x.dia : x.codi}</b> <span class="mut">${dataTxt(x.dia)}</span></td><td>${esc(x.tipus === 'A' ? nm(x.pts[0].n) + ' → ' + nm(x.pts[x.pts.length - 1].n) : nm(x.nomC))}</td><td>${dec(x.km)}</td><td>${hhmm(x.ini)}</td><td>${x.arr.map(hhmm).join('–')}</td><td>${fmt(x.nit)}</td></tr>`).join('') + '</table></div>';
  $('#meteoFonts').innerHTML = `<p class="small">${esc(G[L].meteoWhen)}</p>` + G[L].meteoSources.map(([a, b, u]) => `<details class="sf"><summary>${esc(a)}</summary><p class="small">${esc(b)}${u ? ` <a href="${u}" target="_blank" rel="noopener">${esc(u.replace(/^https:\/\/(www\.)?/, '').split(/[/?]/)[0])} ↗</a>` : ''}</p></details>`).join('');
  const S = PL.season[L] || PL.season.es;
  $('#temporada').innerHTML = `<p class="small"><b>${esc(S.window)}</b><br>${esc(S.proposal)}</p><ol class="months">${PL.season.months.map((m, i) => `<li class="m-${m}" title="${esc(S.legend[m])}">${esc(S.monthNames[i])}</li>`).join('')}</ol>` + S.reasons.map(([a, b]) => `<details class="sf"><summary>${esc(a)}</summary><p class="small">${esc(b)}</p></details>`).join('');
  $('#carreteres').innerHTML = `<p class="small mut">${T('checkedOn')} ${esc(PL.roads.checked)}</p>` + (PL.roads[L] || PL.roads.es).items.map(([a, b]) => `<details class="sf"><summary>${esc(a)}</summary><p class="small">${esc(b)}</p></details>`).join('');
  const nights = G[L].nights, maxE = Math.max(...nights.map(x => x[1]));
  $('#nits').innerHTML = `<ul class="bars">${nights.map(([nn, e], i) => { const jump = i ? e - nights[i - 1][1] : 0; return `<li><span>${esc(nn)}</span><i style="width:${((e - 3000) / (maxE - 3000) * 100).toFixed(0)}%"></i><b>${fmt(e)}</b><em class="${jump > 500 ? 'bad' : ''}">${i ? (jump >= 0 ? '+' : '−') + fmt(Math.abs(jump)) : ''}</em></li>`; }).join('')}</ul><p class="small mut">${esc(G[L].nightsNote)}</p>`;
  const done = new Set(store.get('checks', []));
  $('#llistes').innerHTML = G[L].checks.map(([h, items], a) => `<h3>${esc(h)}</h3>${items.map((x, b) => `<label><input type="checkbox" data-chk="${a}-${b}" ${done.has(a + '-' + b) ? 'checked' : ''}><span>${esc(x)}</span></label>`).join('')}`).join('');
  $('#inici').value = inici;
  $$('#langSeg button').forEach(b => b.classList.toggle('on', b.dataset.lang === L));
  $('#verTxt').textContent = T('version');
}
function pintaContactes() {
  const saved = store.get('contacts', {});
  $('#contactes').innerHTML = `<p class="small mut">${esc(G[L].contactsHint)}</p>` + G[L].contacts.map((nn, i) => {
    const v = saved[i] || '', tel = (v.match(/\+?\d[\d\s]{5,}\d/) || [''])[0].replace(/\s/g, '');
    return `<label class="fld">${esc(nn)}<span class="row" style="flex-wrap:nowrap"><input data-contact="${i}" value="${esc(v)}" inputmode="text">${tel ? `<a class="btn sm ac" href="tel:${tel}">📞</a>` : ''}</span></label>`;
  }).join('');
}

// ---------------- GPS ----------------
function startGps() {
  if (!('geolocation' in navigator)) { $('#gpsStat').textContent = T('noGeo'); return; }
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId); watchId = null; gps = null;
    $$('.gpsBtn').forEach(b => b.textContent = T('gpsOn')); $('#gpsStat').textContent = T('gpsStopped'); pintaGpsKv(); renderSos(); if (window.mapa) mapa.gps(); tick(); return;
  }
  $('#gpsStat').textContent = T('gpsSearching'); $$('.gpsBtn').forEach(b => b.textContent = T('gpsOff'));
  watchId = navigator.geolocation.watchPosition(pos => {
    const { latitude: lat, longitude: lon, accuracy, altitude } = pos.coords;
    gps = { lat, lon, acc: accuracy, alt: altitude, t: Date.now() }; gps.snap = snap(lat, lon); if (gps.snap && gps.snap.dist < 300) lastM[J.id] = gps.snap.m;
    $('#gpsStat').textContent = `GPS ±${Math.round(accuracy)} m · ${hhmm(nowMin())}`;
    pintaGpsKv(); renderSos(); if (window.mapa) mapa.gps();
    if ($('#s-punts').classList.contains('act')) $('#profile').innerHTML = perfilSvg();
    tick();
  }, err => { $('#gpsStat').textContent = err.code === 1 ? T('gpsDenied') : T('gpsNoSignal') + ' (' + err.message + ')'; },
  { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 });
}
function renderSos() {
  if (!gps) { $('#sosPos').className = 'mut'; $('#sosPos').textContent = T('sosNoGps'); return; }
  $('#sosPos').className = ''; const u = utm(gps.lat, gps.lon);
  let near = null; A.COORD.forEach(r => { const d = hav(gps.lat, gps.lon, r.ll[0], r.ll[1]); if (!near || d < near.d) near = { r, d }; });
  let sx = null; A.SORTIDES.forEach(s => { const d = hav(gps.lat, gps.lon, s.ll[0], s.ll[1]); if (!sx || d < sx.d) sx = { s, d, b: bearing(gps.lat, gps.lon, s.ll[0], s.ll[1]) }; });
  $('#sosPos').innerHTML = `<div class="coord">${gps.lat.toFixed(5)}, ${gps.lon.toFixed(5)}</div><div class="mut small">WGS84 (lat, lon) · ±${Math.round(gps.acc)} m</div>
    <div class="coord" style="margin-top:8px">${u.zona} ${u.X} ${u.Y}</div><div class="mut small">UTM WGS84 (${T('zone')} ${u.zona}) · X, Y</div>
    <div class="row" style="margin-top:6px"><button class="btn sm" data-copy="${gps.lat.toFixed(5)}, ${gps.lon.toFixed(5)}">${T('copyCoords')}</button></div>
    <p class="small">${T('nearestPoint')}: <b>${near.r.c}</b> ${esc(nm(near.r.n))} · ${dist(near.d)}${gps.alt != null ? ' · ' + T('gpsAlt') + ' ' + fmt(gps.alt) + ' m' : ''}</p>
    <p class="small">${T('nearestExit')}: <b>${esc(nm(sx.s.n))}</b> · ${dist(sx.d)} ${T('straight')} · ${T('bearing')} ${Math.round(sx.b)}° (${CARD()[Math.round(sx.b / 45) % 8]})</p>`;
}

// ---------------- NAVEGAR A UN PUNT ----------------
function renderTarget() {
  if (!target) { $('#targetCard').style.display = 'none'; return; }
  $('#targetCard').style.display = 'block';
  const r = A.COORD.find(c => c.c === target) || JORN.flatMap(x => x.pts).find(p => p.c === target);
  if (!r) { target = null; return; }
  if (!gps) $('#targetBody').innerHTML = `<b>${r.c}</b> ${esc(nm(r.n))}<br><span class="mut">${T('navNoGps')}</span> <button class="btn sm" id="tClr">${T('remove')}</button>`;
  else {
    const d = hav(gps.lat, gps.lon, r.ll[0], r.ll[1]), b = bearing(gps.lat, gps.lon, r.ll[0], r.ll[1]);
    $('#targetBody').innerHTML = `<div class="hd"><span class="code">${r.c}</span> <b>${esc(nm(r.n))}</b></div>
      <div class="row" style="margin-top:6px"><span class="arrow" style="transform:rotate(${b}deg)">⬆</span><span class="big">${dist(d)}</span>
      <span>${T('bearing')} <b>${Math.round(b)}°</b> (${CARD()[Math.round(b / 45) % 8]}) ${T('straight')}</span></div>
      <button class="btn sm" id="tClr" style="margin-top:6px">${T('remove')}</button>`;
  }
  const c = $('#tClr'); if (c) c.onclick = () => { target = null; renderTarget(); };
}

// ---------------- GPX (tot en un fitxer, generat al mòbil) ----------------
function gpxTot() {
  const e = s => esc(s);
  const wpt = JORN.flatMap(x => x.pts.map(p => `<wpt lat="${p.ll[0]}" lon="${p.ll[1]}"><ele>${p.ele}</ele><name>${e(p.c + ' ' + nm(p.n))}</name></wpt>`)).join('\n');
  const esw = A.SORTIDES.map(s => `<wpt lat="${s.ll[0]}" lon="${s.ll[1]}"><name>${e('🚙 ' + nm(s.n))}</name></wpt>`).join('\n');
  const trk = x => `<trk><name>${e(x.tipus === 'A' ? T('day') + ' ' + x.dia : T('planC') + ' ' + x.codi)}</name><trkseg>\n${x.trk.map(p => `<trkpt lat="${p[0]}" lon="${p[1]}">${p[2] != null ? `<ele>${p[2]}</ele>` : ''}</trkpt>`).join('\n')}\n</trkseg></trk>`;
  const rt = r => `<trk><name>${e(T('dayShort') + ' ' + r.dia + ' · ' + nm(r.n))}</name><trkseg>\n${r.trk.map(p => `<trkpt lat="${p[0]}" lon="${p[1]}">${p[2] != null ? `<ele>${p[2]}</ele>` : ''}</trkpt>`).join('\n')}\n</trkseg></trk>`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Andes Wild Trek · app del guia" xmlns="http://www.topografix.com/GPX/1/1">\n<metadata><name>Apolobamba · Pelechuco–Charazani</name><desc>Track: ${e(window.TRACK.author)}, Wikiloc (${window.TRACK.year}). Plans B i C: ${e(PC.src)}</desc></metadata>\n${wpt}\n${esw}\n${JORN.map(trk).join('\n')}\n${Object.values(RUTES).map(rt).join('\n')}\n</gpx>\n`;
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([xml], { type: 'application/gpx+xml' })); a.download = 'Apolobamba_App_Guia.gpx'; document.body.append(a); a.click(); a.remove();
}

// ---------------- TEXTOS ESTÀTICS (data-t) ----------------
function aplicaIdioma() {
  document.documentElement.lang = L; document.title = T('title');
  $$('[data-t]').forEach(el => { el.innerHTML = T(el.dataset.t); });
  $$('.gpsBtn').forEach(b => b.textContent = T(watchId !== null ? 'gpsOff' : 'gpsOn'));
  $('#gpsStat').textContent = watchId !== null && gps ? `GPS ±${Math.round(gps.acc)} m` : T('gpsIdle');
  $('#langBtn').textContent = L.toUpperCase();
}
function setLang(l) {
  L = l; store.set('lang', l); $('#metAraAct').textContent = ''; aplicaIdioma(); renderStatic(); pintaSelectors(); renderPunts(); renderSos();
  if (window.pla) pla.selector(); if (window.mapa) mapa.botons(); if (window.meteo) meteo.pinta(); if (window.aval) aval.pinta(); tick(); pintaWake();
}

// ---------------- EVENTS ----------------
function mostra(s) {
  $$('#nav button').forEach(x => x.classList.toggle('on', x.dataset.s === s));
  $$('main section').forEach(x => x.classList.toggle('act', x.id === 's-' + s));
  if (s === 'mapa' && window.mapa) mapa.mostra();
  window.scrollTo(0, 0);
}
$$('#nav button').forEach(b => b.onclick = () => mostra(b.dataset.s));
document.addEventListener('click', e => {
  const t = e.target.closest('button,[data-j]'); if (!t) return;
  if (t.dataset.j) setJorn(t.dataset.j);
  else if (t.dataset.j2) { setJorn(t.dataset.j2); mostra('punts'); }
  else if (t.dataset.ruta) { store.set('ruta', t.dataset.ruta); setJorn(t.dataset.ruta === 'C' ? 'c1' : 'd5'); mostra('ara'); }
  else if (t.dataset.arr) { const k = t.dataset.arr; if (arr[k] !== undefined) delete arr[k]; else arr[k] = Math.round(nowMin()); store.set('arr', arr); renderPunts(); tick(); }
  else if (t.dataset.nav) { target = t.dataset.nav; mostra('ara'); renderTarget(); }
  else if (t.dataset.copy) { const v = t.dataset.copy, old = t.textContent; (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => { t.textContent = T('copied'); setTimeout(() => t.textContent = old, 1500); }).catch(() => prompt('', v)); }
  else if (t.dataset.lang) setLang(t.dataset.lang);
});
$$('.gpsBtn').forEach(b => b.onclick = startGps);
$('#langBtn').onclick = () => setLang(A.LANGS[(A.LANGS.indexOf(L) + 1) % A.LANGS.length]);
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.chk) store.set('checks', [...$$('[data-chk]:checked')].map(x => x.dataset.chk));
  if (t.id === 'inici' && /^\d{4}-\d\d-\d\d$/.test(t.value)) { inici = t.value; store.set('inici', inici); renderStatic(); pintaSelectors(); renderPunts(); tick(); if (window.meteo) meteo.pinta(); }
});
document.addEventListener('input', e => { const t = e.target; if (t.dataset.contact) { const s = store.get('contacts', {}); s[t.dataset.contact] = t.value; store.set('contacts', s); } });
document.addEventListener('focusout', e => { if (e.target.dataset && e.target.dataset.contact) pintaContactes(); });
$('#themeBtn').onclick = () => { document.body.classList.toggle('light'); store.set('light', document.body.classList.contains('light')); if (window.mapa) mapa.dibuixa(); };
$('#resetBtn').onclick = () => { if (confirm(T('confirmReset'))) { arr = {}; store.set('arr', arr); if (window.pla) pla.esborra(); renderPunts(); tick(); } };
$('#resetChk').onclick = () => { store.set('checks', []); renderStatic(); };
$('#simOn').onclick = () => { const v = $('#simTime').value; if (v) { sim = A.toMin(v); tick(); } };
$('#simOff').onclick = () => { sim = null; tick(); };
$('#gpxBtn').onclick = gpxTot;

// ---------------- PANTALLA ENCESA ----------------
let wakeLock = null, wakeOn = false;
async function demanaWake() { try { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; pintaWake(); }); } catch (e) { wakeLock = null; } pintaWake(); }
function pintaWake() {
  const b = $('#wakeBtn'); if (!b) return;
  if (!('wakeLock' in navigator)) { b.textContent = T('wakeNA'); b.disabled = true; return; }
  b.textContent = wakeOn ? (wakeLock ? T('wakeOn') : T('wakePaused')) : T('wake'); b.classList.toggle('on', wakeOn && !!wakeLock);
}
$('#wakeBtn').onclick = () => { wakeOn = !wakeOn; if (wakeOn) demanaWake(); else { if (wakeLock) wakeLock.release(); wakeLock = null; pintaWake(); } };
document.addEventListener('visibilitychange', () => { if (wakeOn && document.visibilityState === 'visible' && !wakeLock) demanaWake(); });
