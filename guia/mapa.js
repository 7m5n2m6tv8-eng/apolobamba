// ---------------- MAPA ----------------
// Mapa propi en canvas (sense llibreries): teselles d'OpenTopoMap desades per anar sense cobertura,
// mapes de l'Atles cartogràfic com a fons sempre disponible, track de les jornades, pla C, rutes dels plans B,
// punts de pas, sortides en vehicle i GPS.
const mapa = (() => {
  const SUBS = ['a', 'b', 'c'];
  const TILE_URL = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
  const TILE_CACHE = 'apolobamba-teselles-v1';
  const ZMIN = 9, ZMAX = 17, TZMIN = 11, TZDESC = 15;
  // metres al voltant del track, del pla C i de les rutes dels plans B que es desen a cada zoom
  const BUF = { 11: 4000, 12: 2500, 13: 1500, 14: 800, 15: 450 };
  const COLS = { d5: '#b4573a', d6: '#1c7c86', d7: '#2b5fa8', d8: '#b8860b', d9: '#2f7d4f', d10: '#9b3d5a' }, CCOL = '#6a3d9a', BCOL = '#e67e22', VCOL = '#8d5524';

  let cv, ctx, W = 0, H = 0, dpr = 1;
  let cLat = -14.99, cLon = -69.01, Z = 11;
  let base = store.get('mapBase', 'otm'), plansOn = store.get('mapPlans', true), pendent = false, mostrat = false;
  const tiles = new Map(), imgs = {};

  const wx = (lon, z) => (lon + 180) / 360 * 256 * 2 ** z;
  const wy = (lat, z) => { const s = Math.sin(lat * Math.PI / 180); return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * 256 * 2 ** z; };
  const lonOf = (x, z) => x / (256 * 2 ** z) * 360 - 180;
  const latOf = (y, z) => { const n = Math.PI - 2 * Math.PI * y / (256 * 2 ** z); return 180 / Math.PI * Math.atan(Math.sinh(n)); };
  const scr = (lat, lon) => [W / 2 + wx(lon, Z) - wx(cLon, Z), H / 2 + wy(lat, Z) - wy(cLat, Z)];
  const tileUrl = (z, x, y) => TILE_URL.replace('{s}', SUBS[(x + y) % 3]).replace('{z}', z).replace('{x}', x).replace('{y}', y);

  // ----- dibuix -----
  function dibuixa() { if (!pendent) { pendent = true; requestAnimationFrame(pinta); } }
  function pinta() {
    pendent = false; if (!ctx || !W) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#e8e6df'; ctx.fillRect(0, 0, W, H);
    pintaAtles();                       // 1) mapes de l'atles: sempre a l'app, també tapen els forats sense teselles
    if (base === 'otm') pintaTeselles(); // 2) teselles d'OpenTopoMap (desades o amb cobertura)
    if (plansOn) pintaRutes();           // 3) plans B (a peu i en vehicle) i sortides
    pintaTracks(); pintaPlaActiu(); pintaPunts(); pintaGps();
    // escala
    const mpp = 156543.034 * Math.cos(cLat * Math.PI / 180) / 2 ** Z;
    const m = [50, 100, 200, 500, 1000, 2000, 5000, 10000].find(v => v / mpp > 70) || 10000, px = m / mpp;
    ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillRect(8, H - 26, px + 12, 18);
    ctx.strokeStyle = '#222'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(14, H - 14); ctx.lineTo(14 + px, H - 14); ctx.stroke();
    ctx.fillStyle = '#222'; ctx.font = '11px system-ui,sans-serif'; ctx.fillText(m >= 1000 ? m / 1000 + ' km' : m + ' m', 18, H - 17);
  }
  function pintaAtles() {
    // el mapa general sempre; a sobre, el de la jornada triada (més detall)
    const llista = [window.MAPES.find(m => m.k === 'general'), window.MAPES.find(m => m.k === J.mapa)].filter(Boolean);
    for (const m of llista) {
      let im = imgs[m.k]; if (!im) { im = imgs[m.k] = new Image(); im.onload = dibuixa; im.src = m.src; }
      if (!im.complete || !im.naturalWidth) continue;
      const n = 256 * 2 ** Z, x0 = m.box[0] * n - wx(cLon, Z) + W / 2, y0 = m.box[1] * n - wy(cLat, Z) + H / 2;
      ctx.drawImage(im, x0, y0, (m.box[2] - m.box[0]) * n, (m.box[3] - m.box[1]) * n);
    }
  }
  function tile(z, x, y) {
    const k = z + '/' + x + '/' + y; let t = tiles.get(k);
    if (!t) { t = { img: new Image(), ok: false, err: false }; t.img.onload = () => { t.ok = true; dibuixa(); }; t.img.onerror = () => { t.err = true; }; t.img.src = tileUrl(z, x, y); tiles.set(k, t); }
    return t;
  }
  function pintaTeselles() {
    const tz = Math.max(TZMIN, Math.min(navigator.onLine ? 16 : TZDESC, Math.round(Z))), s = 2 ** (Z - tz);
    const x0 = wx(cLon, tz) - W / 2 / s, y0 = wy(cLat, tz) - H / 2 / s;
    for (let tx = Math.floor(x0 / 256); tx <= Math.floor((x0 + W / s) / 256); tx++)
      for (let ty = Math.floor(y0 / 256); ty <= Math.floor((y0 + H / s) / 256); ty++) {
        const sx = (tx * 256 - x0) * s, sy = (ty * 256 - y0) * s, sz = 256 * s, t = tile(tz, tx, ty);
        if (t.ok) { ctx.drawImage(t.img, sx, sy, sz + .5, sz + .5); continue; }
        for (let up = 1; up <= 4 && tz - up >= TZMIN; up++) { // si no hi és, una tesella pare ampliada
          const f = 2 ** up, px = Math.floor(tx / f), py = Math.floor(ty / f), pt = tiles.get((tz - up) + '/' + px + '/' + py);
          if (pt && pt.ok) { const ss = 256 / f; ctx.drawImage(pt.img, (tx - px * f) * ss, (ty - py * f) * ss, ss, ss, sx, sy, sz + .5, sz + .5); break; }
          if (!pt && up === 1) tile(tz - up, px, py);
        }
      }
  }
  function linia(pts, col, w, dash, halo) {
    ctx.beginPath(); pts.forEach((p, i) => { const [x, y] = scr(p[0], p[1]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (halo) { ctx.setLineDash([]); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = w + 3.5; ctx.stroke(); }
    ctx.setLineDash(dash || []); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); ctx.setLineDash([]);
  }
  function pintaTracks() {
    for (const x of JORN) {
      const cur = x === J, col = x.tipus === 'C' ? CCOL : COLS[x.id];
      if (x.tipus === 'C' && J.tipus !== 'C' && !plansOn) continue;
      ctx.globalAlpha = cur ? 1 : .55;
      linia(x.trk, col, cur ? 4.5 : 2.6, x.tipus === 'C' ? [9, 5] : null, true);
      ctx.globalAlpha = 1;
    }
  }
  function pintaRutes() {
    const act = window.pla ? pla.idActiu() : 'A';
    for (const id in RUTES) {
      const r = RUTES[id]; if (id === act) continue;
      const delDia = r.dia === J.dia && J.tipus === 'A';
      ctx.globalAlpha = delDia ? .95 : .45;
      linia(r.trk, r.tipus === 'walk' ? BCOL : VCOL, delDia ? 3 : 2, r.tipus === 'walk' ? [2, 4] : [8, 4], false);
      ctx.globalAlpha = 1;
    }
    ctx.font = 'bold 11px system-ui,sans-serif'; ctx.textBaseline = 'middle';
    for (const s of A.SORTIDES) {
      const [x, y] = scr(s.ll[0], s.ll[1]); if (x < -20 || y < -20 || x > W + 20 || y > H + 20) continue;
      ctx.fillStyle = VCOL; ctx.fillRect(x - 6, y - 6, 12, 12); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.strokeRect(x - 6, y - 6, 12, 12);
      if (Z >= 12) { const t = '🚙 ' + nm(s.n).split(' · ')[0], tw = ctx.measureText(t).width; ctx.fillStyle = 'rgba(255,255,255,.88)'; ctx.fillRect(x - tw - 14, y - 8, tw + 6, 16); ctx.fillStyle = '#111'; ctx.fillText(t, x - tw - 11, y); }
    }
  }
  function pintaPlaActiu() {
    if (!window.pla || pla.idActiu() === 'A') return;
    const r = RUTES[pla.idActiu()]; linia(r.trk, BCOL, 5, [10, 6], true);
  }
  function pintaPunts() {
    ctx.font = 'bold 12px system-ui,sans-serif'; ctx.textBaseline = 'middle';
    for (const x of JORN) {
      const cur = x === J; if (!cur && Z < 12.5) continue;
      for (const p of x.pts) {
        const [px, py] = scr(p.ll[0], p.ll[1]); if (px < -40 || py < -40 || px > W + 40 || py > H + 40) continue;
        if (p.dec) { ctx.fillStyle = '#e67e22'; ctx.beginPath(); ctx.moveTo(px, py - 8); ctx.lineTo(px + 8, py); ctx.lineTo(px, py + 8); ctx.lineTo(px - 8, py); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke(); }
        else { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py, cur ? 5 : 3.5, 0, 7); ctx.fill(); ctx.strokeStyle = '#222'; ctx.lineWidth = 2; ctx.stroke(); }
        if (cur && Z >= 11.5) { const t = p.c + (Z >= 13.5 ? ' ' + nm(p.n) : ''), tw = ctx.measureText(t).width; ctx.fillStyle = 'rgba(255,255,255,.88)'; ctx.fillRect(px + 9, py - 8, tw + 6, 16); ctx.fillStyle = '#111'; ctx.fillText(t, px + 12, py); }
      }
    }
  }
  function pintaGps() {
    if (!gps) return;
    const [x, y] = scr(gps.lat, gps.lon), mpp = 156543.034 * Math.cos(gps.lat * Math.PI / 180) / 2 ** Z, r = Math.max(8, gps.acc / mpp);
    ctx.fillStyle = 'rgba(30,136,255,.15)'; ctx.strokeStyle = 'rgba(30,136,255,.5)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1e88ff'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.stroke(); ctx.fill();
  }

  // ----- interacció: arrossegar, pessigar, roda, doble toc -----
  const ptrs = new Map(); let pinch = null, lastTap = 0;
  function moveBy(dx, dy) { cLon = lonOf(wx(cLon, Z) - dx, Z); cLat = latOf(wy(cLat, Z) - dy, Z); }
  function zoomAt(nz, px, py) {
    nz = Math.max(ZMIN, Math.min(ZMAX, nz));
    const lat = latOf(wy(cLat, Z) + py - H / 2, Z), lon = lonOf(wx(cLon, Z) + px - W / 2, Z);
    Z = nz; cLon = lonOf(wx(lon, Z) - (px - W / 2), Z); cLat = latOf(wy(lat, Z) - (py - H / 2), Z);
    guarda(); dibuixa();
  }
  function guarda() { store.set('mapView', [cLat, cLon, Z]); }
  function encaixa(pts) { // centra i ajusta el zoom a uns punts
    if (!W) return;
    let s = 90, n = -90, o = 180, e = -180; pts.forEach(p => { s = Math.min(s, p[0]); n = Math.max(n, p[0]); o = Math.min(o, p[1]); e = Math.max(e, p[1]); });
    cLat = (s + n) / 2; cLon = (o + e) / 2;
    const dx = wx(e, 0) - wx(o, 0), dy = wy(s, 0) - wy(n, 0);
    Z = Math.max(ZMIN, Math.min(15, Math.log2(Math.min((W - 40) / Math.max(dx, 1e-9), (H - 40) / Math.max(dy, 1e-9)))));
    guarda(); dibuixa();
  }
  function lligaEvents() {
    cv.addEventListener('pointerdown', e => {
      cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.offsetX, e.offsetY]);
      if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: Z }; }
      const t = Date.now(); if (ptrs.size === 1 && t - lastTap < 300) zoomAt(Z + 1, e.offsetX, e.offsetY); lastTap = t;
    });
    cv.addEventListener('pointermove', e => {
      const p = ptrs.get(e.pointerId); if (!p) return;
      if (ptrs.size === 1) { moveBy(e.offsetX - p[0], e.offsetY - p[1]); dibuixa(); }
      ptrs.set(e.pointerId, [e.offsetX, e.offsetY]);
      if (ptrs.size === 2 && pinch) { const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); zoomAt(pinch.z + Math.log2(d / pinch.d), (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
    });
    const up = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; guarda(); };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', e => { e.preventDefault(); zoomAt(Z - e.deltaY / 300, e.offsetX, e.offsetY); }, { passive: false });
    $('#zIn').onclick = () => zoomAt(Z + 1, W / 2, H / 2);
    $('#zOut').onclick = () => zoomAt(Z - 1, W / 2, H / 2);
    $('#zMe').onclick = () => { if (!gps) { startGps(); return; } cLat = gps.lat; cLon = gps.lon; if (Z < 14) Z = 14; guarda(); dibuixa(); };
    $('#zDay').onclick = () => encaixa(J.trk);
    $('#zAll').onclick = () => encaixa(JORN.flatMap(x => x.trk));
    $('#capaBtn').onclick = () => { base = base === 'otm' ? 'atles' : 'otm'; store.set('mapBase', base); botons(); dibuixa(); };
    $('#plansBtn').onclick = () => { plansOn = !plansOn; store.set('mapPlans', plansOn); botons(); dibuixa(); };
    window.addEventListener('resize', mida);
    window.addEventListener('online', () => { tiles.forEach((t, k) => { if (t.err) tiles.delete(k); }); dibuixa(); estatTeselles(); });
    $('#tilesBtn').onclick = descarrega; $('#tilesDel').onclick = esborra;
  }
  function botons() {
    $('#capaBtn').textContent = base === 'otm' ? T('baseOtm') : T('baseAtlas');
    $('#plansBtn').textContent = T('plansLayer'); $('#plansBtn').classList.toggle('on', plansOn);
  }
  function mida() {
    if (!cv) return; const r = cv.getBoundingClientRect(); if (!r.width) return;
    dpr = window.devicePixelRatio || 1; W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); dibuixa();
  }

  // ----- teselles per anar sense cobertura -----
  function llistaTeselles() {
    const set = new Set();
    const afegeix = (lat, lon, b, z) => {
      const dl = b / 110540, dn = b / (111320 * Math.cos(lat * Math.PI / 180));
      const xa = Math.floor(wx(lon - dn, z) / 256), xb = Math.floor(wx(lon + dn, z) / 256), ya = Math.floor(wy(lat + dl, z) / 256), yb = Math.floor(wy(lat - dl, z) / 256);
      for (let x = xa; x <= xb; x++) for (let y = ya; y <= yb; y++) set.add(z + '/' + x + '/' + y);
    };
    const linies = [...JORN.map(x => x.trk), ...Object.values(RUTES).map(r => r.trk)];
    for (let z = TZMIN; z <= TZDESC; z++) for (const t of linies) { const pas = Math.max(1, Math.round(t.length / 120)); for (let i = 0; i < t.length; i += pas) afegeix(t[i][0], t[i][1], BUF[z], z); }
    return [...set].map(k => { const [z, x, y] = k.split('/').map(Number); return tileUrl(z, x, y); });
  }
  async function estatTeselles() {
    const el = $('#tilesStat'); if (!('caches' in window)) { el.textContent = T('noCache'); return; }
    const urls = llistaTeselles(), c = await caches.open(TILE_CACHE), keys = new Set((await c.keys()).map(r => r.url));
    const fetes = urls.filter(u => keys.has(u)).length, pc = Math.round(fetes * 100 / urls.length);
    $('#tilesProg').style.width = pc + '%';
    let mb = ''; try { const e = await navigator.storage.estimate(); mb = ` · ${Math.round(e.usage / 1048576)} MB`; } catch (e) {}
    el.innerHTML = fetes === urls.length ? `<b class="ok">${T('tilesDone', { n: fetes })}</b>${mb}` : `<b class="${fetes ? 'warn' : ''}">${T('tilesPart', { a: fetes, b: urls.length, p: pc })}</b>${mb}`;
    return { urls, keys };
  }
  let baixant = false;
  async function descarrega() {
    if (baixant) return; if (!navigator.onLine) { $('#tilesStat').textContent = T('needWifi'); return; }
    baixant = true; $('#tilesBtn').disabled = true;
    try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) {}
    const { urls, keys } = await estatTeselles(), falta = urls.filter(u => !keys.has(u)), c = await caches.open(TILE_CACHE);
    let fet = urls.length - falta.length, errs = 0, i = 0;
    const worker = async () => {
      while (i < falta.length) {
        const u = falta[i++];
        try { let r; try { r = await fetch(u, { mode: 'cors' }); } catch (e) { r = await fetch(u, { mode: 'no-cors' }); } if (!r.ok && r.type !== 'opaque') throw 0; await c.put(u, r); fet++; } catch (e) { errs++; }
        if (fet % 10 === 0) { $('#tilesProg').style.width = Math.round(fet * 100 / urls.length) + '%'; $('#tilesStat').textContent = T('downloading', { a: fet, b: urls.length }); }
      }
    };
    await Promise.all([1, 2].map(worker)); // dues connexions: OpenTopoMap demana no fer descàrregues massives
    baixant = false; $('#tilesBtn').disabled = false;
    await estatTeselles();
    if (errs) $('#tilesStat').innerHTML += ` <span class="warn">${T('tilesErr', { n: errs })}</span>`;
    tiles.clear(); dibuixa();
  }
  async function esborra() { if (!confirm(T('confirmTiles'))) return; await caches.delete(TILE_CACHE); tiles.clear(); estatTeselles(); dibuixa(); }

  return {
    init() {
      cv = $('#mapcv'); ctx = cv.getContext('2d');
      const v = store.get('mapView', null); if (v) [cLat, cLon, Z] = v;
      lligaEvents(); botons(); estatTeselles();
    },
    mostra() { const primer = !mostrat; mostrat = true; mida(); if (primer && !store.get('mapView', null)) encaixa(J.trk); estatTeselles(); },
    gps() { $('#mapStat').textContent = gps ? `GPS ±${Math.round(gps.acc)} m` : ''; if (mostrat) dibuixa(); },
    dibuixa, botons, llistaTeselles
  };
})();
window.mapa = mapa;
