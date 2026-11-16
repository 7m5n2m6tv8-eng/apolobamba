(()=>{
let data;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fold=s=>s.toLocaleLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
window.mountProject=async()=>{
 const root=document.getElementById('blocs'); if(!root)return;
 if(!data)data=await fetch('modules.json?v='+(window.AWT_VERSION||'')).then(r=>r.json());
 const lang=document.documentElement.lang==='es'?'es':'ca',t=window.COPY[lang];
 const name=d=>lang==='es'?d.name_es:d.name,sections=d=>lang==='es'?d.sections_es:d.sections;
 root.className='section project-hub';
 root.innerHTML=`<div class="wrap"><div class="section-heading"><div><p class="eyebrow">${t.hubLabel}</p><h2>${t.hubTitle}</h2></div><p class="section-intro">${t.hubIntro}</p></div><div class="hub-tools"><label>${t.hubSearch}<input id="doc-search" type="search" placeholder="${t.hubSearchPh}"></label></div><nav class="hub-nav" aria-label="${t.hubNav}">${data.map((d,i)=>`<a href="#${d.id}">${i+1}. ${esc(name(d))}</a>`).join('')}</nav><p id="search-count" aria-live="polite"></p><div class="module-grid">${data.map((d,i)=>`<article class="module" id="${d.id}"><span class="module-number">0${i+1}</span><h3>${esc(name(d))}</h3><p class="doc-meta">${d.pages} ${d.pages===1?t.hubPages.replace(/s$/,''):t.hubPages} · ${t.hubMeta}</p><ul>${sections(d).map(s=>`<li>${esc(s)}</li>`).join('')}</ul><div class="module-actions"><a class="button button-forest" target="_blank" rel="noopener" href="${d.file}">${t.hubOpen} ↗</a><a href="${d.file}" download>${t.hubDownload} ↓</a></div><details><summary>${t.hubRead}</summary><div class="module-text" lang="ca">${esc(d.text)}</div></details></article>`).join('')}</div><aside class="social-demo" id="instagram"><div><p class="eyebrow">${t.igLabel}</p><h3>@andeswildtrek.demo</h3><p>${t.igText}</p><a class="button button-forest" href="#marketing">${t.igCta}</a></div><div class="social-posts">${['apolobamba-range-small.webp','pelechuco-plaza-small.webp','apolobamba-landscape-small.webp'].map((s,i)=>`<a href="#marketing"><img src="assets/${s}" alt="" width="1000" height="750" loading="lazy"><span>${t.igPosts[i]}</span></a>`).join('')}</div><p class="ig-credit">${t.igCredit}</p></aside></div>`;
 if(window.AWT_STAMP)window.AWT_STAMP(root);
 root.querySelector('#doc-search').oninput=e=>{const q=fold(e.target.value.trim());let n=0;data.forEach(d=>{const yes=fold(d.name+' '+d.name_es+' '+d.text).includes(q);document.getElementById(d.id).hidden=!yes;if(yes)n++});document.getElementById('search-count').textContent=q?t.hubCount.replace('{0}',n):''};
};
if(document.getElementById("blocs"))window.mountProject();
})();
