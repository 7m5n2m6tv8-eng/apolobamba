/* Còpia per funcionar sense connexió. Sempre es prova primer la xarxa, de manera que mai no serveix una versió antiga si hi ha cobertura. */
const CACHE='awt-offline-v4';
const CORE=['./','index.html','treball.html','presentacio.html','presentacio-organitzacio.html','presentacio-orientacio.html','site.css','content.js','extras.js','photo-credits.js','site.js','modules.js','modules.json','assets/favicon.svg','assets/apolobamba-landscape-small.webp','assets/apolobamba-range-small.webp','assets/pelechuco-plaza-small.webp','assets/guia.webp','dossiers/client/Fitxa_Viatge_CA.pdf','dossiers/client/Ficha_Viaje_ES.pdf','dossiers/client/Trip_Sheet_EN.pdf','dossiers/client/Fiche_Voyage_FR.pdf'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin||u.pathname.endsWith('version.txt'))return;
  e.respondWith(fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(u.pathname,copy));}return res;}).catch(()=>caches.match(u.pathname).then(m=>m||caches.match(u.pathname.replace(/\/$/,'/index.html'))||caches.match('index.html'))));
});
