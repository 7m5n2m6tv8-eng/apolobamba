/* Dades de l'app del guia, construïdes a partir de les fonts del projecte (no s'escriuen a mà aquí):
   - window.DAYS (content.js): jornades, punts de pas, hores i altituds.
   - window.TRACK (track.js): track GPS de 2012 (Gallotrekk, Wikiloc), 199 punts.
   - window.PLANS (content.js): temporada, plans B, pla C, carreteres, criteris i punts d'evacuació.
   - window.PLANC (planc.js): traçat del pla C i rutes dels plans B (OpenStreetMap + SRTM).
   - window.GUIDE (data.js): hores de control i decisió de cada punt (cap. 10 del treball).
   Hores locals de Bolívia (BOT, UTC−4). */
(() => {
  'use strict';
  const DAYS = window.DAYS, TR = window.TRACK, PL = window.PLANS, PC = window.PLANC, G = window.GUIDE;
  const LANGS = ['ca', 'es', 'en', 'fr'];
  const toMin = s => { const m = /(\d{1,2})[.:](\d{2})/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : null; };
  const rang = s => (s || '').split('–').map(toMin).filter(v => v != null);
  const R = Math.PI / 180;
  const hav = (a, b, c, d) => { const x = Math.sin((c - a) * R / 2) ** 2 + Math.cos(a * R) * Math.cos(c * R) * Math.sin((d - b) * R / 2) ** 2; return 12742018 * Math.asin(Math.sqrt(x)); };

  // Traçat amb metres acumulats recalculats (el track porta km; el pla C, km de tot el pla)
  function tracat(pts) {
    const out = []; let m = 0;
    pts.forEach((p, i) => { if (i) m += hav(pts[i - 1][0], pts[i - 1][1], p[0], p[1]); out.push([p[0], p[1], p[2] == null ? null : p[2], m]); });
    return out;
  }
  // Punt del traçat més proper (projecció sobre cada segment): metres des de l'inici
  function projecta(trk, lat, lon, desDe) {
    const kx = Math.cos(lat * R) * 111320, ky = 110540; let best = null;
    for (let i = 0; i < trk.length - 1; i++) {
      const p = trk[i], q = trk[i + 1]; if (desDe != null && q[3] < desDe - 1) continue;
      const ax = (p[1] - lon) * kx, ay = (p[0] - lat) * ky, bx = (q[1] - lon) * kx, by = (q[0] - lat) * ky;
      const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy; let t = L ? -(ax * dx + ay * dy) / L : 0; t = Math.max(0, Math.min(1, t));
      const d = Math.hypot(ax + t * dx, ay + t * dy), m = p[3] + t * (q[3] - p[3]);
      if (!best || d < best.dist) best = { dist: d, m, ele: p[2] == null ? null : p[2] + t * ((q[2] ?? p[2]) - p[2]) };
    }
    return best;
  }
  // Desnivell acumulat del traçat, escalat perquè el total del dia coincideixi amb el del programa
  function acumulats(trk, up, dn) {
    const cu = [0], cd = [0];
    for (let i = 1; i < trk.length; i++) { const dz = (trk[i][2] ?? trk[i - 1][2]) - (trk[i - 1][2] ?? trk[i][2]); cu.push(cu[i - 1] + Math.max(0, dz)); cd.push(cd[i - 1] + Math.max(0, -dz)); }
    const fu = up && cu[cu.length - 1] ? up / cu[cu.length - 1] : 1, fd = dn && cd[cd.length - 1] ? dn / cd[cd.length - 1] : 1;
    return { cu: cu.map(v => v * fu), cd: cd.map(v => v * fd) };
  }

  // Punts de decisió: hora límit al punt i què s'aplica si se supera (cap. 10 del treball i plans B)
  const DEC = {
    '5:2': { ca: 'tornar a Pelechuco pel mateix camí (pla B)', es: 'volver a Pelechuco por el mismo camino (plan B)', en: 'return to Pelechuco the same way (plan B)', fr: 'revenir à Pelechuco par le même chemin (plan B)' },
    '7:1': { ca: 'tornar a Hilo Hilo', es: 'volver a Hilo Hilo', en: 'return to Hilo Hilo', fr: 'revenir à Hilo Hilo' },
    '7:3': { ca: 'MITJA VOLTA cap a Hilo Hilo', es: 'MEDIA VUELTA hacia Hilo Hilo', en: 'TURN BACK to Hilo Hilo', fr: 'DEMI-TOUR vers Hilo Hilo' },
    '8:5': { ca: 'no entrar a les Mil Corbes: pla B1 (baixada alternativa) o B2 (Quellwa Cota)', es: 'no entrar en las Mil Curvas: plan B1 (bajada alternativa) o B2 (Quellwa Cota)', en: 'do not enter the Mil Curvas: plan B1 (alternative descent) or B2 (Quellwa Cota)', fr: 'ne pas entrer dans les Mil Curvas : plan B1 (descente alternative) ou B2 (Quellwa Cota)' },
    '9:1': { ca: 'retorn a Incacancha pel camí reconegut', es: 'regreso a Incacancha por el camino reconocido', en: 'return to Incacancha by the known path', fr: 'retour à Incacancha par le chemin reconnu' },
    '10:1': { ca: 'final a Curva i continuar en vehicle', es: 'final en Curva y seguir en vehículo', en: 'finish at Curva and continue by vehicle', fr: 'fin à Curva et suite en véhicule' },
    'C2:3': { ca: 'tornar al Campament 3', es: 'volver al Campamento 3', en: 'return to Camp 3', fr: 'revenir au Camp 3' }
  };
  const LIMIT_C = { 'C2:3': '13.10' }; // hora límit al Pas d'Akamani (atles, pla C)
  // Rutes dels plans B que es poden seguir a peu des de la pantalla «Ara»
  const SEGUIBLES = ['b5-retorn', 'b7-retorn', 'b7-sunchully', 'b8-b1', 'b8-b2', 'b8-b3', 'b9-est', 'b10-curva'];
  const CODI_B = { 'b5-retorn': 'B', 'b7-retorn': 'B↩', 'b7-sunchully': 'B→S', 'b8-b1': 'B1', 'b8-b2': 'B2', 'b8-b3': 'B3', 'b9-est': 'B→C', 'b10-curva': 'B→Curva' };

  // Ritme: el de les jornades del programa (parades incloses). Ajust sobre les 6 jornades: 1,3 × (km/4 + pujada/400 + baixada/800) hores.
  const RITME = { f: 1.3, kmh: 4, up: 400, dn: 800 };
  const minutsRitme = (km, up, dn) => RITME.f * (km / RITME.kmh + up / RITME.up + dn / RITME.dn) * 60;

  const textos = f => Object.fromEntries(LANGS.map(l => [l, f(l)]));
  const JORN = [];

  DAYS.forEach((d, i) => {
    const trk = tracat(TR.pts.slice(TR.cut[i], TR.cut[i + 1] + 1));
    let desDe = 0;
    const pts = d.points.map((p, j) => {
      const s = projecta(trk, p.ll[0], p.ll[1], desDe); desDe = s.m;
      const ctl = (G.control[i] || [])[j] || [];
      const lim = toMin(ctl[0]), r = rang(p.time), k = d.day + ':' + j;
      return {
        k, c: d.day + '.' + (j + 1), n: textos(l => p[l] || p.es), ele: p.ele, km: p.km, ll: p.ll, m: j === 0 ? 0 : j === d.points.length - 1 ? trk[trk.length - 1][3] : s.m,
        t: r[0], t2: r[r.length - 1], l: lim != null ? lim : r[0],
        f: textos(l => l === 'ca' ? ctl[2] : l === 'es' ? ctl[3] : (((G.controlT[l] || [])[i] || [])[j] || ctl[3] || '')),
        dec: DEC[k] || null, abans: j === 0
      };
    });
    const ac = acumulats(trk, d.ascent, d.descent);
    JORN.push({ id: 'd' + d.day, dia: d.day, codi: String(d.day), tipus: 'A', idx: i, trk, cu: ac.cu, cd: ac.cd, pts, km: d.km, up: d.ascent, dn: d.descent, max: d.max,
      hores: d.hours, ini: toMin(d.start), arr: rang(d.arrival), nit: d.night, mapa: 'd' + d.day,
      rutes: (PC.routes || []).filter(r => r.day === d.day).map(r => r.id) });
  });

  PL.c.stages.forEach((s, j) => {
    const trk = tracat(PC.pts.slice(PC.cut[j], PC.cut[j + 1] + 1));
    let desDe = 0;
    const pts = s.points.map((p, q) => {
      const sn = projecta(trk, p.ll[0], p.ll[1], desDe); desDe = sn.m;
      const k = s.code + ':' + q, r = rang(p.time), last = q === s.points.length - 1;
      return {
        k, c: s.code + '.' + (q + 1), n: textos(l => p[l] || p.es), ele: p.ele, km: p.km, ll: p.ll, m: q === 0 ? 0 : last ? trk[trk.length - 1][3] : sn.m,
        t: r[0], t2: r[r.length - 1], l: LIMIT_C[k] ? toMin(LIMIT_C[k]) : last ? 16 * 60 + 40 : r[r.length - 1],
        f: textos(l => q === 0 ? (s[l] || s.es).text : last ? (s[l] || s.es).key : ''), dec: DEC[k] || null, abans: q === 0
      };
    });
    const ac = acumulats(trk, s.ascent, s.descent);
    JORN.push({ id: s.code.toLowerCase(), dia: s.day, codi: s.code, tipus: 'C', idx: j, trk, cu: ac.cu, cd: ac.cd, pts, km: s.km, up: s.ascent, dn: s.descent, max: s.max,
      hores: s.hours, ini: toMin(s.start), arr: rang(s.arrival), nit: s.night, mapa: s.code.toLowerCase(), rutes: [], nomC: textos(l => (s[l] || s.es).name) });
  });

  // Rutes dels plans B (a peu i en vehicle) amb metres acumulats
  const RUTES = {};
  (PC.routes || []).forEach(r => {
    const trk = tracat(r.pts.map(p => [p[0], p[1], p[2] ?? null]));
    const ac = acumulats(trk, r.up, r.down);
    RUTES[r.id] = { id: r.id, dia: r.day, tipus: r.kind, codi: CODI_B[r.id] || 'B', seguible: SEGUIBLES.includes(r.id), n: textos(l => r[l] || r.es),
      km: r.km, up: r.up, dn: r.down, min: minutsRitme(r.km, r.up, r.down), trk, cu: ac.cu, cd: ac.cd };
  });

  // Coordenades útils: punts de pas, final de cada etapa del pla C i sortides en vehicle
  const COORD = [];
  JORN.forEach(J => J.pts.forEach((p, j) => { if (J.tipus === 'A' && J.idx > 0 && j === 0) return; if (J.tipus === 'C' && J.idx > 0 && j === 0) return; COORD.push({ c: p.c, n: p.n, ll: p.ll, ele: p.ele, J: J.id }); }));
  const SORTIDES = (PL.escapes || []).map(e => ({ n: textos(l => e[l] || e.es), ll: e.ll, dies: e.days }));

  // Punts per a la previsió meteo: tots els punts de pas (Open-Meteo amb l'altitud de cada punt)
  const METEO_PTS = [];
  JORN.forEach(J => J.pts.forEach(p => { if (!METEO_PTS.some(q => hav(q.ll[0], q.ll[1], p.ll[0], p.ll[1]) < 150)) METEO_PTS.push({ ll: p.ll, ele: p.ele }); }));
  JORN.forEach(J => J.pts.forEach(p => { p.met = METEO_PTS.findIndex(q => hav(q.ll[0], q.ll[1], p.ll[0], p.ll[1]) < 150); }));

  window.APP = { JORN, RUTES, COORD, SORTIDES, METEO_PTS, RITME, minutsRitme, projecta, hav, toMin, LANGS };
})();
