'use strict';
// One local Career identity; custom names are always rendered as text, never markup.
const CAREER_PLAYER_KEY='spitfireCareerPlayerV1';
function cleanCareerName(value){return Array.from(String(value??'').normalize('NFC').replace(/[\p{Cc}\p{Cf}]/gu,'').trim().replace(/\s+/g,' ')).slice(0,16).join('');}
let storedCareerPlayer=loadLocal(CAREER_PLAYER_KEY,{});
if(!storedCareerPlayer||typeof storedCareerPlayer!=='object')storedCareerPlayer={};
let careerPlayer={name:cleanCareerName(typeof storedCareerPlayer.name==='string'?storedCareerPlayer.name:'')||'PLAYER ONE',background:CAREER_CARD_STYLES.some(s=>s.id===storedCareerPlayer.background)?storedCareerPlayer.background:CAREER_CARD_STYLES[0].id};
function careerPlayerName(){return careerPlayer.name;}
let careerCardSerial=0;const careerCardInstances=[];
function makeCareerPlayerCard(id,fixedStyle=null){
 const card=document.createElement('div');card.id=id;card.className='career-player-card';card.setAttribute('role','img');
 const img=document.createElement('img');img.alt='';img.draggable=false;card.appendChild(img);
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 260 480');svg.setAttribute('aria-hidden','true');
 const defs=document.createElementNS(ns,'defs'),arc=document.createElementNS(ns,'path'),arcId='career-name-arc-'+(++careerCardSerial);arc.id=arcId;arc.setAttribute('d','M 16 99 Q 130 35 244 99');defs.appendChild(arc);svg.appendChild(defs);
 const crest=document.createElementNS(ns,'path');crest.setAttribute('d','M 8 53 Q 130 -7 252 53 L 244 116 Q 130 78 16 116 Z');crest.setAttribute('fill','#8f2420');crest.setAttribute('stroke','#f5e5c5');crest.setAttribute('stroke-width','5');svg.appendChild(crest);
 const text=document.createElementNS(ns,'text');text.classList.add('career-name-text');text.setAttribute('text-anchor','middle');text.setAttribute('paint-order','stroke');text.setAttribute('stroke','#f8ecd2');text.setAttribute('stroke-width','3.2');text.setAttribute('fill','#9a2924');
 const path=document.createElementNS(ns,'textPath');path.setAttribute('href','#'+arcId);path.setAttribute('startOffset','50%');text.appendChild(path);svg.appendChild(text);card.appendChild(svg);
 careerCardInstances.push({card,img,path,text,fixedStyle});return card;
}
const editor=document.createElement('section');editor.className='career-player-editor';editor.setAttribute('aria-label','Career player card customization');
const previewHost=document.createElement('div');previewHost.className='career-preview-host';previewHost.appendChild(makeCareerPlayerCard('careerPlayerPreview'));
const fields=document.createElement('div');fields.className='career-player-fields';
const nameLabel=document.createElement('label');nameLabel.htmlFor='careerPlayerName';nameLabel.textContent='YOUR CAREER NAME';
const nameInput=document.createElement('input');nameInput.id='careerPlayerName';nameInput.type='text';nameInput.maxLength=16;nameInput.autocomplete='off';nameInput.spellcheck=false;nameInput.value=careerPlayer.name;nameInput.setAttribute('aria-describedby','careerPlayerHelp');
nameLabel.appendChild(nameInput);fields.appendChild(nameLabel);
const hint=document.createElement('p');hint.id='careerPlayerHelp';hint.className='mode-note';hint.textContent='Up to 16 characters · changes save on this computer · choose your pack background below';fields.appendChild(hint);
const picker=document.createElement('div');picker.id='careerBackgroundPicker';picker.className='career-bg-picker';picker.setAttribute('role','group');picker.setAttribute('aria-label','Choose Career card background');
for(const style of CAREER_CARD_STYLES){const button=document.createElement('button');button.type='button';button.dataset.background=style.id;button.title=style.label;button.setAttribute('aria-label',style.label+' pack background');const thumb=makeCareerPlayerCard('careerChoice-'+style.id,style);thumb.setAttribute('aria-hidden','true');button.appendChild(thumb);button.onclick=()=>setCareerBackground(style.id);button.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();e.stopPropagation();const index=CAREER_CARD_STYLES.findIndex(s=>s.id===style.id),next=CAREER_CARD_STYLES[(index+(e.key==='ArrowRight'?1:-1)+CAREER_CARD_STYLES.length)%CAREER_CARD_STYLES.length];setCareerBackground(next.id);picker.querySelector('[data-background="'+next.id+'"]').focus();});picker.appendChild(button);}
fields.appendChild(picker);const selectedLabel=document.createElement('p');selectedLabel.id='careerBackgroundLabel';selectedLabel.className='mode-note';selectedLabel.setAttribute('aria-live','polite');fields.appendChild(selectedLabel);editor.append(previewHost,fields);$('careerJobs').before(editor);
const hudCard=makeCareerPlayerCard('careerHudCard');hudCard.classList.add('hidden');document.body.appendChild(hudCard);
const resultCard=makeCareerPlayerCard('careerResultCard');resultCard.classList.add('hidden');$('results').appendChild(resultCard);
const careerMeasure=document.createElement('canvas').getContext('2d');
function refreshCareerCards(){const style=CAREER_CARD_STYLES.find(s=>s.id===careerPlayer.background)||CAREER_CARD_STYLES[0];const label=careerPlayer.name.toUpperCase();careerMeasure.font='40px PackLetter';const fontSize=Math.min(44,40*212/Math.max(1,careerMeasure.measureText(label).width));for(const item of careerCardInstances){const itemStyle=item.fixedStyle||style;item.img.src=itemStyle.file;item.path.textContent=label;item.text.setAttribute('font-size',String(fontSize));item.card.setAttribute('aria-label',careerPlayer.name+' — '+itemStyle.label+' Career player card');}for(const button of picker.querySelectorAll('button')){const active=button.dataset.background===style.id;button.classList.toggle('chosen',active);button.setAttribute('aria-pressed',String(active));}selectedLabel.textContent='SELECTED: '+style.label.toUpperCase();}
function saveCareerPlayer(){saveLocal(CAREER_PLAYER_KEY,careerPlayer);refreshCareerCards();}
function setCareerBackground(id){if(!CAREER_CARD_STYLES.some(s=>s.id===id))return;careerPlayer.background=id;saveCareerPlayer();}
nameInput.addEventListener('input',()=>{careerPlayer.name=cleanCareerName(nameInput.value)||'PLAYER ONE';saveCareerPlayer();});
nameInput.addEventListener('blur',()=>{nameInput.value=careerPlayer.name;});
nameInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();picker.querySelector('.chosen')?.focus();}});
// Existing lifecycle hooks retain their complete behavior; the card is Career-only.
const cardBeforeSessionStart=beforeSessionStart;beforeSessionStart=function(){show('careerHudCard',false);show('careerResultCard',false);cardBeforeSessionStart();};
const cardSessionStarted=onSessionStarted;onSessionStarted=function(){cardSessionStarted();refreshCareerCards();show('careerHudCard',modeContext.type==='career');};
const cardSessionFinished=onSessionFinished;onSessionFinished=function(stats){cardSessionFinished(stats);show('careerHudCard',false);refreshCareerCards();show('careerResultCard',modeContext.type==='career');};
const cardSessionExit=onSessionExit;onSessionExit=function(){cardSessionExit();show('careerHudCard',false);show('careerResultCard',false);};
refreshCareerCards();document.fonts.load('40px PackLetter').then(refreshCareerCards).catch(()=>{});
