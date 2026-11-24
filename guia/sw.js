// App del guia sense cobertura.
// - CACHE: l'app. tools/stamp.py hi posa la versió del repositori: quan canvia, els mòbils baixen la nova i surt el botó «Actualitzar».
// - TILES: teselles d'OpenTopoMap desades des de la pantalla Mapa; NO s'esborren en actualitzar l'app.
// - La previsió d'Open-Meteo no passa per aquí: l'app la desa al mòbil.
const CACHE = 'guia-apolobamba-f9c52962c9';
const TILES = 'apolobamba-teselles-v1';
const FILES = ['./', 'index.html', 'i18n.js', 'app.js', 'pla.js', 'mapa.js', 'meteo.js', 'avaluacio.js', 'img/enquesta-qr.svg', 'dades.js', 'data.js', 'track.js', 'planc.js', 'mapes.js',
  'img/mapa-general.jpg', 'img/mapa-d5.jpg', 'img/mapa-d6.jpg', 'img/mapa-d7.jpg', 'img/mapa-d8.jpg', 'img/mapa-d9.jpg', 'img/mapa-d10.jpg',
  'img/mapa-c1.jpg', 'img/mapa-c2.jpg', 'img/mapa-c3.jpg', 'img/mapa-c4.jpg',
  'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', '../content.js',
  '../dossiers/gpx/Apolobamba_Ruta_Principal.gpx', '../dossiers/gpx/Apolobamba_Pla_C.gpx',
  '../dossiers/gpx/Apolobamba_Pla_B_Dia5.gpx', '../dossiers/gpx/Apolobamba_Pla_B_Dia6.gpx', '../dossiers/gpx/Apolobamba_Pla_B_Dia7.gpx',
  '../dossiers/gpx/Apolobamba_Pla_B_Dia8.gpx', '../dossiers/gpx/Apolobamba_Pla_B_Dia9.gpx', '../dossiers/gpx/Apolobamba_Pla_B_Dia10.gpx'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('guia-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Teselles d'OpenTopoMap: primer les desades; si no hi són i hi ha cobertura, es baixen i es desen.
  if (url.hostname.endsWith('tile.opentopomap.org')) {
    e.respondWith(caches.open(TILES).then(c => c.match(e.request.url).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok || res.type === 'opaque') c.put(e.request.url, res.clone());
      return res;
    }))).catch(() => new Response('', { status: 504 })));
    return;
  }
  if (url.origin !== location.origin) return; // Open-Meteo i altres: directe a la xarxa
  // Fitxers de l'app: es respon amb la còpia desada (funciona sense cobertura) i, si hi ha xarxa, s'actualitza de fons.
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true }).then(hit => {
    const xarxa = fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(xarxa); return hit; }
    return xarxa.then(res => res || c.match('index.html'));
  })));
});
