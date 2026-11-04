'use strict';
// Preserve the rigged opening title, then enter the user's Street Rhythm poster menu.
function enterMainMenu(){state='menu';show('title',false);show('menu',true);$('play').focus();}
function showTitleScreen(){if(state==='playing'||state==='loading')return;state='title';for(const id of ['menu','settings','controllers','pause','results'])show(id,false);show('title',true);if(typeof markTitleControllerBaseline==='function')markTitleControllerBaseline();$('enterMenu').focus();}
$('enterMenu').onclick=enterMainMenu;$('title').addEventListener('click',enterMainMenu);$('titleBack').onclick=showTitleScreen;
$('enterMenu').focus();
window.addEventListener('keydown',e=>{
  if(!$('title').classList.contains('hidden')){if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||['F11','Tab','ShiftLeft','ShiftRight','ControlLeft','ControlRight','AltLeft','AltRight','MetaLeft','MetaRight','CapsLock'].includes(e.code))return;e.preventDefault();e.stopImmediatePropagation();enterMainMenu();return;}
  if(e.code!=='Escape')return;
  if(!$('menu').classList.contains('hidden')){e.preventDefault();showTitleScreen();}
  else if(!$('settings').classList.contains('hidden')){e.preventDefault();$('back').click();}
},true);
