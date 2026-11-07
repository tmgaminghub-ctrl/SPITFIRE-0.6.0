'use strict';
// Career-only scenery and illustrated cast. Quick Play/Training/Versus keep the original stage and rigs.
const careerVenueImages={},careerCastImages={};
const careerSamplerImage=new Image();careerSamplerImage.src='cast/comic-sampler.webp';
for(const show of CAREER_SHOWS){const image=new Image();image.src=show.file;careerVenueImages[show.id]=image;}
for(const person of Object.values(CAREER_CAST)){careerCastImages[person.id]={};for(const [part,file]of Object.entries(person.files)){const image=new Image();image.src=file;careerCastImages[person.id][part]=image;}}
function currentCareerShow(){return modeContext.type==='career'&&Number.isInteger(modeContext.job)?CAREER_SHOWS[modeContext.job]||null:null;}
function careerStageTexture(fallback){const show=currentCareerShow();return show?careerVenueImages[show.id]:fallback;}
function careerPartTexture(part,fallback){const show=currentCareerShow();if(!show)return fallback;if(part==='sampler')return careerSamplerImage;const id=part.startsWith('rapper_')?show.rapper:part.startsWith('producer_')?show.producer:null;return id?careerCastImages[id][part]||fallback:fallback;}
function careerPuppetBones(fallback){const show=currentCareerShow();return show?{...fallback,...CAREER_CAST[show.rapper].bones,...CAREER_CAST[show.producer].bones}:fallback;}
function careerPartMeta(part,fallback){const show=currentCareerShow();if(!show)return fallback;const person=CAREER_CAST[part.startsWith('rapper_')?show.rapper:show.producer];return (part==='sampler'?person.sampler:person.rigParts?.[part])||fallback;}
function styleCareerPose(pose){const show=currentCareerShow();if(!show)return pose;const mc=CAREER_CAST[show.rapper],dj=CAREER_CAST[show.producer];for(const key in pose.angles){if(key.startsWith('rapper'))pose.angles[key]*=mc.swing;else if(key.startsWith('producer'))pose.angles[key]*=dj.swing;}pose.rapperY*=mc.swing;pose.producerY*=dj.swing;return pose;}
async function ensureCareerWorldReady(){const show=currentCareerShow();if(!show)return;const images=[careerSamplerImage,careerVenueImages[show.id],...Object.values(careerCastImages[show.rapper]),...Object.values(careerCastImages[show.producer])];await Promise.all(images.map(async image=>{if(image.complete&&!image.naturalWidth){const source=image.src;image.src='';image.src=source;}try{await image.decode();}catch{throw Error('Career stage/cast artwork could not decode: '+image.src.split('/').slice(-2).join('/'));}if(!image.naturalWidth)throw Error('A Career artist sprite is empty.');}));}
(()=>{
 const hud=document.createElement('div');hud.id='careerShowHud';hud.className='career-show-hud hidden';hud.setAttribute('aria-label','Career venue and performers');document.body.append(hud);
 const before=beforeSessionStart;beforeSessionStart=function(){hud.classList.add('hidden');return before.apply(this,arguments);};
 const started=onSessionStarted;onSessionStarted=function(){const result=started.apply(this,arguments),show=currentCareerShow();hud.replaceChildren();if(show){const venue=document.createElement('strong');venue.textContent=show.venue;const bill=document.createElement('span');bill.textContent='MC '+CAREER_CAST[show.rapper].name+'  /  PROD. '+CAREER_CAST[show.producer].name;hud.append(venue,bill);}hud.classList.toggle('hidden',!show);return result;};
 const finished=onSessionFinished;onSessionFinished=function(){const show=currentCareerShow(),result=finished.apply(this,arguments);hud.classList.add('hidden');if(show){const credit=document.createElement('span');credit.className='career-show-credit';credit.textContent=show.venue+' · '+CAREER_CAST[show.rapper].name+' × '+CAREER_CAST[show.producer].name;$('resultExtra').append(credit);}return result;};
 const exited=onSessionExit;onSessionExit=function(){hud.classList.add('hidden');return exited.apply(this,arguments);};
})();
