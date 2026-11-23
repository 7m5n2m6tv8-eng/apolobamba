// ---------------- SEGUIR UN PLA B ----------------
// Quan se segueix una ruta dels plans B, la pantalla «Ara» mostra el progrés sobre el traçat d'aquella ruta:
// km fets, distància al traçat i què falta fins al final (km, desnivell, temps i arribada).
// Km i desnivell: els de la ruta (OpenStreetMap + SRTM). Temps: ritme de les jornades del programa (vegeu dades.js).
const pla = (() => {
  let actiu = store.get('pla', 'A'), marques = store.get('plaMarques', {}), lastP = null;
  const R = () => RUTES[actiu];
  const disponibles = () => J.rutes.map(id => RUTES[id]).filter(r => r && r.seguible);
  if (actiu !== 'A' && (!RUTES[actiu] || RUTES[actiu].dia !== J.dia || J.tipus !== 'A')) actiu = 'A';
  const cumAtR = (r, a, m) => { const p = r.trk; if (m <= 0) return 0; for (let i = 1; i < p.length; i++) if (p[i][3] >= m) { const f = (m - p[i - 1][3]) / Math.max(1, p[i][3] - p[i - 1][3]); return a[i - 1] + f * (a[i] - a[i - 1]); } return a[a.length - 1]; };
  function falta(r, m0, m1) {
    const tot = r.trk[r.trk.length - 1][3], fr = (m1 - m0) / Math.max(1, tot);
    const up = Math.round(cumAtR(r, r.cu, m1) - cumAtR(r, r.cu, m0)), dn = Math.round(cumAtR(r, r.cd, m1) - cumAtR(r, r.cd, m0));
    const km = r.km * fr;
    return { km, up, dn, min: A.minutsRitme(km, up, dn) };
  }
  function snapR(r, lat, lon) {
    const kx = Math.cos(lat * Math.PI / 180) * 111320, ky = 110540, p = r.trk; let best = null, win = null;
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i], b = p[i + 1], ax = (a[1] - lon) * kx, ay = (a[0] - lat) * ky, bx = (b[1] - lon) * kx, by = (b[0] - lat) * ky;
      const dx = bx - ax, dy = by - ay, Ls = dx * dx + dy * dy; let t = Ls ? -(ax * dx + ay * dy) / Ls : 0; t = Math.max(0, Math.min(1, t));
      const d = Math.hypot(ax + t * dx, ay + t * dy), m = a[3] + t * (b[3] - a[3]), c = { dist: d, m };
      if (!best || d < best.dist) best = c;
      if (lastP !== null && m >= lastP - 300 && m <= lastP + 1500 && (!win || d < win.dist)) win = c;
    }
    if (win && win.dist < best.dist + 40) best = win;
    return best;
  }
  function progres(r) {
    if (gps) { const s = snapR(r, gps.lat, gps.lon); if (s && s.dist < 300) { lastP = s.m; return { m: s.m, src: 'gps', dist: s.dist }; } }
    const k = marques[actiu]; if (k && k.inici !== undefined) return { m: 0, src: 'marca', base: k.inici };
    return null;
  }
  const g4 = (f, arrM) => `<div class="g4"><div><b>${dec(f.km, 2)} km</b><span>${T('distance')}</span></div><div><b>+${fmt(f.up)} / −${fmt(f.dn)} m</b><span>${T('elevation')}</span></div><div><b>${fmtDur(f.min)}</b><span>${T('time')}</span></div><div><b>${fmtMin(arrM)}</b><span>${T('arrival')}</span></div></div>`;

  function selector() {
    const ops = disponibles();
    const box = $('#plaRow');
    if (!ops.length) { box.style.display = 'none'; if (actiu !== 'A') tria('A', true); return; }
    box.style.display = '';
    $('#plaSeg').innerHTML = ['A', ...ops.map(r => r.id)].map(k => `<button data-pla="${k}" class="${k === actiu ? 'on' : ''}">${k === 'A' ? 'A' : esc(RUTES[k].codi)}</button>`).join('');
  }
  function tria(k, inicial) {
    actiu = k; lastP = null; store.set('pla', k);
    const enB = k !== 'A';
    ['#nextCard', '#faltaCard', '#decCard'].forEach(s => $(s).style.display = enB ? 'none' : '');
    $('#plaCard').style.display = enB ? '' : 'none';
    if (!inicial) { selector(); tick(); if (window.mapa) mapa.dibuixa(); }
  }
  // Pinta la targeta del pla. Retorna les alertes; null si se segueix el pla A.
  function render(n, SAFEm) {
    if (actiu === 'A') return null;
    const r = R(), pr = progres(r), out = [], tot = r.trk[r.trk.length - 1][3];
    let h = `<div class="hd"><span class="code">${esc(r.codi)}</span> <b>${esc(nm(r.n))}</b></div>
      <p class="small" style="margin:4px 0 8px">${T('total')}: ${dec(r.km)} km · +${fmt(r.up)} / −${fmt(r.dn)} m · ≈${fmtDur(r.min)} ${T('walking')}</p>`;
    if (!pr) h += `<p class="mut small">${T('planNoProgress')}</p>`;
    else {
      const base = pr.src === 'marca' ? pr.base : n, f = falta(r, pr.m, tot), fiArr = base + f.min, marge = SAFEm - fiArr;
      h += `<div class="grid2" style="margin-bottom:8px"><div class="kv"><b>${dec(r.km * pr.m / Math.max(1, tot), 2)} km</b><span>${T('doneOfPlan')}</span></div>
        <div class="kv"><b class="${pr.dist > 100 ? 'bad' : pr.dist > 40 ? 'warn' : 'ok'}">${pr.src === 'gps' ? dist(pr.dist) : '—'}</b><span>${T('toRoute')}</span></div></div>`;
      h += `<div class="fblk"><div class="hd"><b>${T('endOfPlan')}</b></div>${g4(f, fiArr)}</div>`;
      h += `<p class="small" style="margin:6px 0 0">${T('etaPlan', { h: fmtMin(fiArr) })} <b class="${marge < 0 ? 'bad' : marge < 30 ? 'warn' : 'ok'}">${marge < 0 ? T('lightMissing', { d: fmtDur(-marge) }) : T('margin', { d: fmtDur(marge) })}</b> ${T('before', { h: hhmm(SAFEm) })}</p>`;
      if (marge < 0) out.push(['bad', T('alPlanLate', { p: r.codi, h: fmtMin(fiArr), s: hhmm(SAFEm) })]);
      if (pr.src === 'gps' && pr.dist > 100) out.unshift(['bad', T('alPlanOff', { p: r.codi, d: Math.round(pr.dist) })]);
    }
    const mk = marques[actiu] || {};
    h += `<div class="row" style="margin-top:8px"><button class="btn sm" data-plamarca="inici">${mk.inici !== undefined ? T('startedAt', { h: hhmm(mk.inici) }) : T('startNow')}</button></div>`;
    h += `<p class="small mut" style="margin:8px 0 0">${T('planNote')}</p>`;
    $('#plaBody').innerHTML = h;
    return out;
  }
  function init() {
    selector(); tria(actiu, true);
    $('#plaSeg').addEventListener('click', e => { const b = e.target.closest('[data-pla]'); if (b) tria(b.dataset.pla); });
    document.addEventListener('click', e => {
      const m = e.target.closest('[data-plamarca]');
      if (m) { const k = marques[actiu] || {}; if (k.inici !== undefined) delete k.inici; else k.inici = Math.round(nowMin()); marques[actiu] = k; store.set('plaMarques', marques); tick(); }
      const s = e.target.closest('[data-seguir]');
      if (s) { const r = RUTES[s.dataset.seguir]; const Jd = JORN.find(x => x.tipus === 'A' && x.dia === r.dia); if (Jd && Jd !== J) setJorn(Jd.id); tria(r.id); mostra('ara'); }
    });
  }
  return {
    init, render, selector, actiu: () => actiu === 'A' ? 'A' : RUTES[actiu].codi, idActiu: () => actiu,
    canviJorn() { if (actiu !== 'A' && (!RUTES[actiu] || RUTES[actiu].dia !== J.dia || J.tipus !== 'A')) tria('A', true); selector(); },
    esborra() { marques = {}; store.set('plaMarques', marques); }
  };
})();
window.pla = pla;
