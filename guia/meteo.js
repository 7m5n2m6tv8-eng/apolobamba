// ---------------- METEO ----------------
// Previsió d'Open-Meteo per a cada punt de pas, amb l'altitud del punt (el model corregeix la temperatura per altitud).
// Es desa al mòbil i, sense cobertura, es mostra l'última previsió amb l'hora en què es va baixar.
// Per a cada punt es mira l'hora prevista de pas. Open-Meteo només dona 16 dies: abans, la taula queda buida.
const meteo = (() => {
  const VARS = 'temperature_2m,apparent_temperature,precipitation_probability,precipitation,snowfall,wind_speed_10m,wind_gusts_10m,wind_direction_10m,cloud_cover,weather_code,freezing_level_height';
  const CUR = 'temperature_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_gusts_10m,wind_direction_10m';
  // Llindars orientatius de l'app (no substitueixen els criteris del treball ni el que es veu al terreny)
  const LL = { vent: 40, ratxa: 60, pas: 4600, pluja: 2, fredNit: -10 };
  let MET = store.get('meteo', null), sel = null, carregant = false;
  const PM = A.METEO_PTS;
  const edatTxt = () => { if (!MET) return ''; const m = Math.round((Date.now() - MET.ts) / 60000); return m < 60 ? T('agoMin', { n: m }) : m < 2880 ? T('agoH', { n: Math.round(m / 60) }) : T('agoD', { n: Math.round(m / 1440) }); };
  const esDiaRuta = () => JORN.some(x => dataIso(x.dia) === isoUTC(botAra()));
  const maxEdat = () => (esDiaRuta() ? 1 : 3) * 3600e3;
  const estat = txt => { ['#metAct', '#metAraAct'].forEach(s => { const e = $(s); if (e) e.innerHTML = txt; }); };

  async function carrega(manual) {
    if (carregant) return;
    if (!manual && MET && Date.now() - MET.ts < maxEdat()) return pinta();
    if (!navigator.onLine) { pinta(); if (manual) estat(`<span class="warn">${T('noSignal')}</span> ${MET ? T('showingFrom', { t: edatTxt() }) : ''}`); return; }
    carregant = true; estat(T('updating')); $$('.metBtn').forEach(b => b.disabled = true);
    const u = 'https://api.open-meteo.com/v1/forecast?latitude=' + PM.map(p => p.ll[0].toFixed(4)).join(',') + '&longitude=' + PM.map(p => p.ll[1].toFixed(4)).join(',') +
      '&elevation=' + PM.map(p => p.ele).join(',') + '&hourly=' + VARS + '&current=' + CUR + '&daily=sunrise,sunset&timezone=America%2FLa_Paz&forecast_days=16&wind_speed_unit=kmh';
    try {
      const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 30000);
      const r = await fetch(u, { signal: ctl.signal }); clearTimeout(to); if (!r.ok) throw new Error(r.status);
      const j = await r.json(), ar = Array.isArray(j) ? j : [j];
      MET = { ts: Date.now(), pts: ar.map(x => ({ h: x.hourly, d: x.daily, c: x.current })) }; store.set('meteo', MET);
    } catch (e) {
      carregant = false; $$('.metBtn').forEach(b => b.disabled = false);
      pinta(); estat(`<span class="warn">${T('metFail')}</span> ${MET ? T('showingFrom', { t: edatTxt() }) : ''}`); return;
    }
    carregant = false; $$('.metBtn').forEach(b => b.disabled = false);
    pinta(); tick(); const e = $('#metAraAct'); if (e) e.textContent = T('updatedNow');
  }
  function idx(dIso, min) { if (!MET) return -1; const h = Math.min(23, Math.round(min / 60)); return MET.pts[0].h.time.indexOf(dIso + 'T' + String(h).padStart(2, '0') + ':00'); }
  function v(pi, i) {
    if (!MET || i < 0 || pi < 0 || !MET.pts[pi]) return null; const h = MET.pts[pi].h;
    return { t: h.temperature_2m[i], at: h.apparent_temperature[i], ws: h.wind_speed_10m[i], wg: h.wind_gusts_10m[i], wd: h.wind_direction_10m[i], pp: h.precipitation_probability[i], pr: h.precipitation[i] || 0, sn: h.snowfall[i] || 0, cc: h.cloud_cover[i], code: h.weather_code[i], fz: h.freezing_level_height[i] };
  }
  function avisos(x, cota) {
    const o = [], pas = cota >= LL.pas;
    if (x.ws >= LL.vent || x.wg >= LL.ratxa) o.push([pas ? 'bad' : 'warn', T('wWind', { a: Math.round(x.ws), b: Math.round(x.wg) })]);
    if (x.code >= 95) o.push(['bad', T('wStorm')]);
    if (x.sn > 0) o.push([pas ? 'bad' : 'warn', T('wSnow')]);
    if (x.fz != null && x.fz < cota) o.push(['warn', T('wFreeze', { m: fmt(Math.round(x.fz / 50) * 50) })]);
    if (x.pr >= LL.pluja) o.push(['warn', T('wRain', { m: dec(x.pr) })]);
    if (x.code === 45 || x.code === 48) o.push([pas ? 'warn' : 'warn', T('wFog')]);
    return o;
  }
  const cls = (b, w) => b ? 'bad' : w ? 'warn' : '';
  const fletxa = d => d == null ? '' : `<span style="display:inline-block;transform:rotate(${d + 180}deg)">↑</span>`;
  const wmo = c => (T('wmo').split('|').map(x => x.split('=')).find(x => +x[0] === c) || [, '–'])[1];

  function botonsDia() {
    const ops = [['j', T('plannedDay', { d: dataTxt(J.dia) })]]; if (!esDiaRuta()) ops.push(['avui', T('today')]);
    if (sel == null) sel = 'j';
    $('#metDia').innerHTML = ops.map(([k, t]) => `<button data-v="${k}" class="${k === sel ? 'on' : ''}">${t}</button>`).join('');
  }
  function pinta() {
    botonsDia();
    $('#metAct').textContent = MET ? T('updatedAgo', { t: edatTxt() }) + (Date.now() - MET.ts > 12 * 3600e3 ? ' · ' + T('tooOld') : '') : '';
    if (!MET) { $('#metBody').innerHTML = T('noForecast'); return; }
    const dIso = sel === 'avui' ? isoUTC(botAra()) : dataIso(J.dia);
    if (idx(dIso, 720) < 0) { $('#metBody').innerHTML = T('notCovered', { d: dIso.split('-').reverse().join('/') }); return; }
    const rows = J.pts.map(p => {
      const tm = p.t, x = v(p.met, idx(dIso, tm)); if (!x) return '';
      const pas = p.ele >= LL.pas, vent = x.ws >= LL.vent || x.wg >= LL.ratxa;
      return `<tr><td><b>${p.c}</b></td><td>${hhmm(tm)}</td><td>${fmt(p.ele)}</td><td>${Math.round(x.t)}° <span class="mut">(${Math.round(x.at)}°)</span></td>
        <td class="${cls(pas && vent, vent)}">${fletxa(x.wd)} ${Math.round(x.ws)}/${Math.round(x.wg)}</td>
        <td class="${cls(false, x.pr >= LL.pluja || x.sn > 0)}">${Math.round(x.pp ?? 0)} % · ${dec(x.pr)}${x.sn > 0 ? ' ❄' : ''}</td>
        <td class="${cls(false, x.fz != null && x.fz < p.ele)}">${x.fz == null ? '–' : fmt(Math.round(x.fz / 50) * 50)}</td>
        <td class="${cls(x.code >= 95, x.code === 45 || x.code === 48)}">${wmo(x.code)} <span class="mut">${Math.round(x.cc)} %</span></td></tr>`;
    }).join('');
    // nit al lloc d'arribada: de les 18 h a les 7 h
    const fi = J.pts[J.pts.length - 1], dema = new Date(dIso + 'T12:00:00Z'); dema.setUTCDate(dema.getUTCDate() + 1);
    let mn = null; for (let h = 18; h <= 31; h++) { const x = v(fi.met, idx(h < 24 ? dIso : isoUTC(dema), (h % 24) * 60)); if (x) mn = mn == null ? x.t : Math.min(mn, x.t); }
    const iD = MET.pts[fi.met] ? MET.pts[fi.met].d.time.indexOf(dIso) : -1;
    let extra = iD >= 0 ? `<p style="margin:6px 0 0">${T('sunModel', { a: MET.pts[fi.met].d.sunrise[iD].slice(11), b: MET.pts[fi.met].d.sunset[iD].slice(11) })}</p>` : '';
    if (mn != null) extra += `<p style="margin:6px 0 0">${T('nightAt', { c: esc(nm(fi.n)), m: fmt(fi.ele) })}: <b class="${mn < LL.fredNit ? 'bad' : mn < 0 ? 'warn' : ''}">${Math.round(mn)} °C</b></p>`;
    $('#metBody').innerHTML = `<div class="scroll"><table class="met"><tr><th>${T('point')}</th><th>${T('hour')}</th><th>m</th><th>T (${T('feels')})</th><th>${T('windCol')}</th><th>${T('rainCol')}</th><th>0 °C</th><th>${T('sky')}</th></tr>${rows}</table></div>${extra}`;
  }

  return {
    init() {
      $$('.metBtn').forEach(b => b.onclick = () => carrega(true));
      $('#metDia').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; sel = b.dataset.v; pinta(); });
      window.addEventListener('online', () => carrega(false));
      pinta(); carrega(false);
    },
    pinta,
    // targeta «Meteo» de la pantalla Ara: hora actual al punt de pas més proper
    ara() {
      const el = $('#metAraBody'); if (!el) return;
      if (!MET) { el.className = 'mut small'; el.textContent = T('noForecastAra'); return; }
      const ara = botAra(), n = nowMin();
      let p = J.pts[0];
      if (gps) { let bd = 1e12; JORN.forEach(x => x.pts.forEach(q => { const d = A.hav(gps.lat, gps.lon, q.ll[0], q.ll[1]); if (d < bd) { bd = d; p = q; } })); }
      else { const pr = progress(); if (pr) p = [...J.pts].reverse().find(q => q.m <= pr.m + 20) || p; }
      let x = v(p.met, idx(isoUTC(ara), n)), font = T('forecastHour');
      const C0 = MET.pts[p.met] && MET.pts[p.met].c;
      if (C0 && x && Date.now() - MET.ts < 90 * 60e3) { x = { ...x, t: C0.temperature_2m, at: C0.apparent_temperature, ws: C0.wind_speed_10m, wg: C0.wind_gusts_10m, wd: C0.wind_direction_10m, pr: C0.precipitation || 0, cc: C0.cloud_cover, code: C0.weather_code }; font = T('rightNow', { h: String(C0.time).slice(11, 16) }); }
      if (!x) { el.className = 'mut small'; el.textContent = T('notNow'); return; }
      const av = avisos(x, p.ele), dir = x.wd == null ? '' : CARD()[Math.round(((x.wd + 180) % 360) / 45) % 8];
      el.className = 'small';
      el.innerHTML = `<div class="grid2">
        <div class="kv"><b>${Math.round(x.t)} °C</b><span>${T('feels')} ${Math.round(x.at)} °C · ${p.c} ${fmt(p.ele)} m</span></div>
        <div class="kv"><b class="${cls(x.ws >= LL.vent || x.wg >= LL.ratxa, x.wg >= 45)}">${Math.round(x.ws)}/${Math.round(x.wg)}</b><span>${T('windKmh')} ${fletxa(x.wd)} ${dir}</span></div>
        <div class="kv"><b>${Math.round(x.pp ?? 0)} %</b><span>${T('rainProb')} · ${dec(x.pr)} mm/h</span></div>
        <div class="kv"><b>${x.fz == null ? '–' : fmt(Math.round(x.fz / 50) * 50) + ' m'}</b><span>${T('freezing')} · ${wmo(x.code)}</span></div></div>
        ${av.length ? `<p style="margin:8px 0 0">${av.map(a => `<b class="${a[0]}">${a[1]}</b>`).join(' · ')}</p>` : ''}
        <p class="mut" style="margin:6px 0 0">${T('modelNote', { f: font, t: edatTxt() })}</p>`;
    },
    // avisos per a la pantalla Ara a partir de la previsió del dia de la jornada triada
    alertes(Jx) {
      if (!MET || Date.now() - MET.ts > 48 * 3600e3) return [];
      const dIso = dataIso(Jx.dia), out = [], fets = new Set();
      for (const p of Jx.pts) {
        const x = v(p.met, idx(dIso, p.t)); if (!x) continue;
        for (const [nivell, txt] of avisos(x, p.ele)) { const k = txt.split(' ')[0]; if (fets.has(k)) continue; fets.add(k); out.push([nivell, T('alMeteo', { c: nm(p.n), h: hhmm(p.t), m: fmt(p.ele), x: txt })]); }
      }
      return out.slice(0, 3);
    },
    carrega
  };
})();
window.meteo = meteo;
