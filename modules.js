(()=>{
let data;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fold=s=>s.toLocaleLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
window.mountProject=async()=>{
 if(!data)data=await fetch('modules.json').then(r=>r.json());
 const lang=document.documentElement.lang==='es'?'es':'ca',t=window.COPY[lang];
 const name=d=>lang==='es'?d.name_es:d.name,sections=d=>lang==='es'?d.sections_es:d.sections;
 document.getElementById('projecte')?.remove();
 const section=document.createElement('section');section.id='projecte';section.className='section project-hub';
 section.innerHTML=`<div class="wrap"><div class="section-heading"><div><p class="eyebrow">${t.hubLabel}</p><h2>${t.hubTitle}</h2></div><p class="section-intro">${t.hubIntro}</p></div><p class="hub-links"><a class="button button-forest" href="dossiers/Apolobamba_TD2_Treball_Complet.pdf" target="_blank" rel="noopener">${t.hubFull} ↗</a><a class="text-link" href="dossiers/Apolobamba_Canvis_Decisions.pdf" target="_blank" rel="noopener">${t.hubChanges} ↗</a></p><div class="hub-tools"><label>${t.hubSearch}<input id="doc-search" type="search" placeholder="${t.hubSearchPh}"></label><button id="presentation" type="button" class="button button-forest">${t.hubPresent}</button></div><nav class="hub-nav" aria-label="${t.hubNav}">${data.map((d,i)=>`<a href="#${d.id}">${i+1}. ${esc(name(d))}</a>`).join('')}</nav><p id="search-count" aria-live="polite"></p><div class="module-grid">${data.map((d,i)=>`<article class="module" id="${d.id}"><span class="module-number">0${i+1}</span><h3>${esc(name(d))}</h3><p class="doc-meta">${d.pages} ${d.pages===1?t.hubPages.replace(/s$/,''):t.hubPages} · ${t.hubMeta}</p><ul>${sections(d).map(s=>`<li>${esc(s)}</li>`).join('')}</ul><div class="module-actions"><a class="button button-forest" target="_blank" rel="noopener" href="${d.file}">${t.hubOpen} ↗</a><a href="${d.file}" download>${t.hubDownload} ↓</a></div><details><summary>${t.hubRead}</summary><div class="module-text" lang="ca">${esc(d.text)}</div></details></article>`).join('')}</div><aside class="social-demo" id="instagram"><div><p class="eyebrow">${t.igLabel}</p><h3>@andeswildtrek.demo</h3><p>${t.igText}</p><a class="button button-forest" href="#marketing">${t.igCta}</a></div><div class="social-posts">${['apolobamba-range-small.webp','pelechuco-plaza-small.webp','apolobamba-landscape-small.webp'].map((s,i)=>`<a href="#marketing"><img src="assets/${s}" alt="" width="1000" height="750" loading="lazy"><span>${t.igPosts[i]}</span></a>`).join('')}</div><p class="ig-credit">${t.igCredit}</p></aside></div>`;
 document.querySelector('#documents').after(section);
 section.querySelector('#doc-search').oninput=e=>{const q=fold(e.target.value.trim());let n=0;data.forEach(d=>{const yes=fold(d.name+' '+d.name_es+' '+d.text).includes(q);document.getElementById(d.id).hidden=!yes;if(yes)n++});document.getElementById('search-count').textContent=q?t.hubCount.replace('{0}',n):''};
 section.querySelector('#presentation').onclick=e=>{const on=document.body.classList.toggle('presenting');e.currentTarget.textContent=on?t.hubPresentOff:t.hubPresent;section.scrollIntoView({behavior:'smooth'})};
};
if(document.getElementById('documents'))window.mountProject();
})();
