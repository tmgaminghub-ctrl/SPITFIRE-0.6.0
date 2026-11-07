'use strict';
// Reuse the real settings controls and their save/audio handlers, not visual replicas.
(()=>{
 const host=$('settings'),old=host.querySelector('.settings');
 const controls={};for(const id of ['volume','offset','motion','difficulty','assist'])controls[id]=$(id).closest('label');
 const controllerButton=[...old.querySelectorAll('button')].find(e=>e.textContent==='CONTROLLERS');
 const back=$('back');back.textContent='BACK';
 old.replaceChildren();old.className='settings options-paper';
 old.innerHTML='<div class="options-kicker">STREET RHYTHM / BACKSTAGE</div><h1 class="options-title">OPTIONS</h1><nav class="options-tabs" aria-label="Options categories"></nav><section class="options-content" aria-label="Selected options"></section><div class="options-stamp">BLACK GOLD<br><small>MAKE IT YOUR MIX.</small></div><footer class="options-footer"><span><i class="option-key">A</i> SELECT</span><span><i class="option-key back-key">B</i> BACK</span><span>↕ NAVIGATE &nbsp; ↔ ADJUST</span></footer>';
 const nav=old.querySelector('nav'),content=old.querySelector('section');
 const panes={};
 const descriptions={audio:['SOUNDCHECK','Dial in the mix.','Master volume and input timing are saved automatically. Positive offset corrects late inputs; try 5–10 ms steps in Training.'],video:['THE LOOK','Keep the room moving.','Reduced motion quiets the title rig and animated effects. The game keeps its 16:9 composition at any window size.'],gameplay:['YOUR FLOW','Set your challenge.','Roll assist is unranked. Career missions use their own difficulty; this chart setting applies to Quick Play. Lane labels supplement colour.']};
 for(const id of ['audio','video','gameplay']){
  const p=document.createElement('div');p.id='options-'+id;p.className='options-pane hidden';const [tag,title,desc]=descriptions[id];
  const k=document.createElement('div');k.className='options-section-tag';k.textContent=tag;const h=document.createElement('h2');h.textContent=title;const d=document.createElement('p');d.className='options-description';d.textContent=desc;p.append(k,h,d);panes[id]=p;content.append(p);
 }
 panes.audio.append(controls.volume,controls.offset);
 const volumeValue=document.createElement('output');volumeValue.id='optionsVolumeValue';volumeValue.textContent=$('volume').value+'%';controls.volume.append(volumeValue);
 $('volume').addEventListener('input',()=>{volumeValue.textContent=$('volume').value+'%';});
 panes.video.append(controls.motion);
 const fullscreen=document.createElement('button');fullscreen.id='optionsFullscreen';fullscreen.textContent='TOGGLE FULLSCREEN';
 const videoStatus=document.createElement('p');videoStatus.className='options-description';videoStatus.setAttribute('role','status');
 fullscreen.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();videoStatus.textContent=document.fullscreenElement?'Fullscreen on.':'Windowed view.';}catch{videoStatus.textContent='Fullscreen is unavailable in this preview. Open the game in its own window.';}};
 panes.video.append(fullscreen,videoStatus);panes.gameplay.append(controls.difficulty,controls.assist);
 const saved=document.createElement('p');saved.className='options-saved';saved.setAttribute('role','status');saved.textContent='LOCAL SETTINGS / AUTO-SAVE';content.append(saved);
 let active='audio',detail=false;
 const title=old.querySelector('.options-title');
 function markSelection(){for(const b of nav.querySelectorAll('[data-option]')){const chosen=b.dataset.option===active;b.classList.toggle('option-selected',chosen);b.setAttribute('aria-pressed',String(chosen));}}
 function categories(focus=true){detail=false;old.querySelector('.options-footer>span:last-child').textContent='↕ NAVIGATE';old.classList.remove('options-detail');content.classList.add('hidden');title.textContent='OPTIONS';for(const p of Object.values(panes))p.classList.add('hidden');markSelection();if(focus)nav.querySelector('[data-option="'+active+'"]').focus();}
 function select(id){active=id;detail=true;old.querySelector('.options-footer>span:last-child').textContent='↕ NAVIGATE  ↔ ADJUST';old.classList.add('options-detail');content.classList.remove('hidden');title.textContent=id.toUpperCase();for(const [key,p]of Object.entries(panes))p.classList.toggle('hidden',key!==id);markSelection();panes[id].querySelector('input,select,button')?.focus();}
 for(const [id,label]of [['audio','AUDIO'],['video','VIDEO'],['controller','CONTROLLER'],['gameplay','GAMEPLAY']]){
  const b=id==='controller'?controllerButton:document.createElement('button');b.textContent=label;b.className='options-tab';b.dataset.option=id;
  if(id==='controller'){b.setAttribute('aria-label','CONTROLLERS');b.onclick=()=>{active='controller';markSelection();openControllers();};}else b.onclick=()=>select(id);
  b.addEventListener('focus',()=>{if(!detail){active=id;markSelection();}});
  b.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const tabs=[...nav.children];tabs[(tabs.indexOf(b)+(e.key==='ArrowDown'?1:tabs.length-1))%tabs.length].focus();});nav.append(b);
 }
 const backWrap=document.createElement('div');backWrap.className='options-back';backWrap.append(back);old.append(backWrap);
 host.addEventListener('input',()=>{try{saved.textContent=localStorage.getItem('spitfireSettings')===JSON.stringify(settings)?'SETTINGS SAVED ON THIS COMPUTER':'SETTINGS APPLIED / SAVE UNAVAILABLE';}catch{saved.textContent='SETTINGS APPLIED / SAVE UNAVAILABLE';}});
 const leave=back.onclick;back.onclick=()=>{if(detail){categories();return;}leave();$('settingsBtn').focus();};
 const enter=$('settingsBtn').onclick;$('settingsBtn').onclick=()=>{enter();categories();};
 // Controller Done returns to this Options screen, rather than a disconnected panel.
 const close=closeControllers;closeControllers=function(){const from=controllerReturn;close();if(from==='settings'){active='controller';categories();}};$('padDone').onclick=closeControllers;
 categories(false);
})();
