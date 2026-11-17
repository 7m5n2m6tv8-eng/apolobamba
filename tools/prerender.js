#!/usr/bin/env node
/* Torna a escriure dins d'index.html la versió estàtica de la web (en català), perquè es vegi encara que el JavaScript no carregui.
   Executa-ho des de l'arrel del repositori després de canviar textos o seccions:  node tools/prerender.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const ctx = { console, document: { body: { dataset: {} }, documentElement: {} }, navigator: {}, location: { protocol: 'file:' }, localStorage: { getItem: () => null, setItem() {} } };
ctx.window = ctx; ctx.window.__AWT_STATIC_RENDER__ = true;
vm.createContext(ctx);
for (const f of ['content.js', 'extras.js', 'photo-credits.js', 'site.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
const html = ctx.AWT.build('ca');
const file = path.join(ROOT, 'index.html'), src = fs.readFileSync(file, 'utf8');
const a = src.indexOf('<div id="app">') + '<div id="app">'.length, b = src.indexOf('</div><noscript>');
if (a < 20 || b < a) throw new Error('No trobo <div id="app"> a index.html');
fs.writeFileSync(file, src.slice(0, a) + html + src.slice(b));
console.log('index.html actualitzat');
