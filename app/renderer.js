'use strict';
const stageImage=new Image();stageImage.src='stage-clean.jpg';
function resize(){const dpr=Math.min(devicePixelRatio,2);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}window.addEventListener('resize',resize);resize();
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
function text(s,x,y,size,color,align='center'){ctx.fillStyle=color;ctx.font=`900 ${size}px Arial`;ctx.textAlign=align;ctx.fillText(s,x,y);}
function poly(points,fill,stroke=null,line=1){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=line;ctx.stroke();}}
function ellipse(x,y,rx,ry,fill,stroke=null,width=1){ctx.beginPath();ctx.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function project(p,lane=.5){const top=H*.415,hit=H*.9,cx=W*.5,tw=W*.125,bw=Math.min(W*.62,1050);const width=tw+(bw-tw)*p;return {x:cx+(lane-.5)*width,y:top+(hit-top)*p,width,cell:width/5,p};}
function noteDepth(remaining){const look=2.45;return (1/(1+Math.max(-.1,remaining)*1.75)-1/(1+look*1.75))/(1-1/(1+look*1.75));}
function ribbon(a,b,lane,width,color){const pa=project(a,(lane+.5)/5),pb=project(b,(lane+.5)/5);poly([[pa.x-pa.cell*width,pa.y],[pa.x+pa.cell*width,pa.y],[pb.x+pb.cell*width,pb.y],[pb.x-pb.cell*width,pb.y]],color);}
function gem(x,y,size,color,glow=false,pressed=false){const ry=size*.27;if(glow&&!settings.motion){ctx.shadowColor=color;ctx.shadowBlur=17;}ellipse(x,y+4,size,ry,'#010306','#9aa2ac',Math.max(1,size*.055));ctx.shadowBlur=0;ellipse(x,y,size*.89,ry*.9,'#111c26',color,Math.max(1,size*.08));const g=ctx.createLinearGradient(0,y-ry,0,y+ry);g.addColorStop(0,'#ffffff');g.addColorStop(.18,color);g.addColorStop(.7,color);g.addColorStop(1,'#101923');ellipse(x,y-2,size*.73,ry*.78,g);ellipse(x-size*.12,y-ry*.45,size*.40,ry*.22,'#ffffffc0');if(pressed){ctx.shadowColor=color;ctx.shadowBlur=24;ellipse(x,y,size*.92,ry,null,'#ffffff',2);ctx.shadowBlur=0;}}
function drawStage(t,fire,live){
const visibleStage=typeof careerStageTexture==='function'?careerStageTexture(stageImage):stageImage;
if(visibleStage.complete&&visibleStage.naturalWidth){ctx.drawImage(visibleStage,0,0,W,H);}else{const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#352313');g.addColorStop(1,'#0c0907');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
drawPuppets(t,live,fire);
const shade=ctx.createLinearGradient(0,0,0,H);shade.addColorStop(0,'#0c080565');shade.addColorStop(.35,'#0c080500');shade.addColorStop(.65,'#0c080500');shade.addColorStop(1,'#0c0805b0');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
if(!settings.motion){for(let i=0;i<4;i++){const sx=W*(.23+i*.18),dx=Math.sin(t*.35+i)*W*.1;poly([[sx-4,0],[sx+4,0],[sx+dx+W*.14,H*.78],[sx+dx-W*.14,H*.78]],fire?'#b83c1f0c':'#c4954409');}for(let i=0;i<22;i++){const x=(i*97.13)%W,y=H-((t*(14+i%5)+i*63)%H);ellipse(x,y,1.2,1.2,i%3?'#c38e3c30':'#ecd39a50');}}
if(fire){const g=ctx.createRadialGradient(W/2,H*.55,H*.2,W/2,H*.55,W*.7);g.addColorStop(0,'#ad4c1900');g.addColorStop(1,'#a83c1e40');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
if(live){ // Crowd silhouettes at the very front, leaving the central hit zone unobscured.
for(let i=0;i<24;i++){let x=i*W/23;if(x>W*.19&&x<W*.81)continue;const y=H*.97+Math.sin(i*6)*9+(settings.motion?0:Math.sin(t*3+i)*Math.min(5,hype/20));ellipse(x,y,12,14,'#03070b');rect(x-15,y+9,30,40,'#03070b');}}
}
function highway(t,dt,fire){
const A=project(0,0),B=project(0,1),C=project(1.12,1),D=project(1.12,0);
// Cast shadow and thick metallic side rails.
poly([[A.x-15,A.y],[B.x+15,B.y],[C.x+22,C.y+12],[D.x-22,D.y+12]],'#000000a0');
const deck=ctx.createLinearGradient(0,A.y,0,C.y);deck.addColorStop(0,'#20170f');deck.addColorStop(.5,'#17110c');deck.addColorStop(1,'#0f0d0b');poly([[A.x,A.y],[B.x,B.y],[C.x,C.y],[D.x,D.y]],deck);
ctx.save();poly([[A.x,A.y],[B.x,B.y],[C.x,C.y],[D.x,D.y]],null);ctx.clip();
// Original graphic inlay: chopped waveform, record arcs and urban stencil-like shapes.
for(let l=0;l<5;l++){const a=project(0,l/5),b=project(0,(l+1)/5),c=project(1.13,(l+1)/5),d=project(1.13,l/5);poly([[a.x,a.y],[b.x,b.y],[c.x,c.y],[d.x,d.y]],l%2?'#00000010':'#ad875108');}
for(let i=0;i<20;i++){const p=.1+i*.052,a=project(p,.3),b=project(p,.7);ctx.globalAlpha=.08;ctx.strokeStyle='#b69254';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(W*.5,a.y,(b.x-a.x)*.9,(b.x-a.x)*.15,0,0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=1;
for(let i=0;i<32;i++){const p=i/32,pt=project(p,.5),width=pt.width*(.06+Math.abs(Math.sin(i*1.7))*.22);poly([[pt.x-width,pt.y],[pt.x-width*.75,pt.y-4],[pt.x+width,pt.y],[pt.x+width*.6,pt.y+5]],'#a57e3e0c');}
// A subdued crown embossed in the blackened deck, always behind notes.
const crown=project(.66,.5),cw=crown.width*.15,ch=cw*.45;
ctx.save();ctx.globalAlpha=.12;poly([[crown.x-cw,crown.y-ch],[crown.x-cw*.6,crown.y+ch*.15],[crown.x,crown.y-ch*1.35],[crown.x+cw*.6,crown.y+ch*.15],[crown.x+cw,crown.y-ch],[crown.x+cw*.7,crown.y+ch],[crown.x-cw*.7,crown.y+ch]],'#d0a25c','#efd39b',2);ctx.restore();
// Moving bar lines retain the same perspective mapping as notes.
const beatNow=(t-LEAD)/BPM_BEAT;
for(let beat=Math.floor(beatNow)-1;beat<beatNow+6;beat++){const p=noteDepth(LEAD+beat*BPM_BEAT-t);if(p<0||p>1.12)continue;const a=project(p,0),b=project(p,1);ctx.strokeStyle=beat%4===0?'#bc92556b':'#71533560';ctx.lineWidth=beat%4===0?2:1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
for(let l=1;l<5;l++){const a=project(0,l/5),b=project(1.12,l/5);ctx.strokeStyle='#02070b';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.strokeStyle='#caa46332';ctx.lineWidth=1;ctx.stroke();}
for(let l=0;l<5;l++)if(pressed.has(l))ribbon(0,1.12,l,.44,COLORS[l]+'12');
// Sustains are ribbons extending into depth, not screen-space rectangles.
for(const n of notes){if(n.type!=='hold'||n.broken||n.status==='miss'||n.time+n.duration<t-.05||n.time>t+2.45)continue;const near=Math.min(1.02,noteDepth(n.time-t)),far=Math.max(0,noteDepth(n.time+n.duration-t));if(near>0){ribbon(far,near,n.lane,.18,COLORS[n.lane]+'80');ribbon(far,near,n.lane,.025,'#ffffffe0');}}
// Distant gems first: nearby gems correctly occlude them.
const visible=notes.filter(n=>n.status==='pending'&&n.time>=t-.13&&n.time<=t+2.45).sort((a,b)=>b.time-a.time);
for(const n of visible){const p=noteDepth(n.time-t);if(p<0||p>1.13)continue;const pt=project(p,(n.lane+.5)/5),size=pt.cell*.39;ctx.globalAlpha=Math.min(1,.3+p*2);gem(pt.x,pt.y,size,COLORS[n.lane],n.phrase>=0);if(n.phrase>=0){text('◆',pt.x,pt.y-size*.45,Math.max(6,size*.4),'#fff6c9');}if(n.roll){ctx.strokeStyle='#ffffff';ctx.lineWidth=1;for(let j=-1;j<=1;j++){ctx.beginPath();ctx.moveTo(pt.x+j*size*.25-2,pt.y-3);ctx.lineTo(pt.x+j*size*.25+3,pt.y+2);ctx.stroke();}}}ctx.globalAlpha=1;ctx.restore();
// Chrome rails sit above the board.
for(const lane of [0,1]){const a=project(0,lane),b=project(1.12,lane);ctx.strokeStyle='#020407';ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.strokeStyle='#aa8246';ctx.lineWidth=6;ctx.stroke();ctx.strokeStyle=fire?'#f4c57a':'#e2c182';ctx.lineWidth=1.5;ctx.stroke();}
// Judgment line and five drum-pad receptors.
const hitL=project(1,0),hitR=project(1,1);ctx.strokeStyle='#f1ffff30';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hitL.x,hitL.y);ctx.lineTo(hitR.x,hitR.y);ctx.stroke();
for(let l=0;l<5;l++){const pt=project(1,(l+.5)/5),r=pt.cell*.4,down=pressed.has(l);ellipse(pt.x,pt.y+4,r+4,r*.29+3,'#020407','#967241',3);ellipse(pt.x,pt.y,r,r*.29,'#131b22',COLORS[l],3);ellipse(pt.x,pt.y,r*.68,r*.2,down?COLORS[l]+'a0':'#241a11',down?'#ffffff':'#8c6c43',1);text(typeof controllerLaneLabel==='function'?controllerLaneLabel(l):KEYS[l],pt.x,pt.y+5,Math.max(12,r*.36),down?'#fff':COLORS[l]);if(down){ctx.shadowColor=COLORS[l];ctx.shadowBlur=22;ellipse(pt.x,pt.y,r+5,r*.32,null,COLORS[l],3);ctx.shadowBlur=0;}text(LABELS[l],pt.x,pt.y+Math.max(34,r*.7),Math.max(8,Math.min(11,pt.cell*.09)),'#c7d3da');}
for(const p of particles){p.age+=dt;const pt=project(1,(p.lane+.5)/5),x=pt.x+p.vx*p.age,y=pt.y+p.vy*p.age+120*p.age*p.age;ctx.globalAlpha=Math.max(0,1-p.age*2);if(!settings.motion){ctx.shadowColor=COLORS[p.lane];ctx.shadowBlur=8;rect(x,y,4,4,COLORS[p.lane]);ctx.shadowBlur=0;}}ctx.globalAlpha=1;particles=particles.filter(p=>p.age<.5);
if(t-judgeAt>=0&&t-judgeAt<.65&&judgment){const y=H*.74;ctx.lineWidth=5;ctx.strokeStyle='#04080c';ctx.font=`900 ${judgment.length>15?22:34}px Arial`;ctx.textAlign='center';ctx.strokeText(judgment,W*.5,y);text(judgment,W*.5,y,judgment.length>15?22:34,judgment==='MISS'||judgment==='HOLD BROKEN'?'#ff738d':'#f6e4bd');}
if(t<LEAD){const s=t<0?'READY':String(Math.ceil(LEAD-t));ctx.strokeStyle='#03090d';ctx.lineWidth=7;ctx.font='900 76px Arial';ctx.textAlign='center';ctx.strokeText(s,W*.5,H*.64);text(s,W*.5,H*.64,76,'#ead09a');}
if(fire){ctx.shadowColor='#d98b3d';ctx.shadowBlur=20;text('S P I T F I R E',W*.5,H*.355,30,'#f3dba8');ctx.shadowBlur=0;}
// Minimal top song progress leaves the two performers unobscured.
const prog=Math.max(0,Math.min(1,t/LENGTH));rect(W*.37,94,W*.26,3,'#ffffff20');rect(W*.37,94,W*.26*prog,3,fire?'#df944a':'#d2ad61');
}
const BPM_BEAT=B;
function draw(now){if(typeof ensureBattlePrimary==='function')ensureBattlePrimary();if(typeof drawTitleRig==='function')drawTitleRig(now);if(typeof controllerPoll==='function')controllerPoll(now);if(typeof modeControllerPoll==='function')modeControllerPoll(now);const dt=Math.min(.04,(now-lastFrame)/1000||.016);lastFrame=now;const live=state==='playing'||state==='paused',t=live?time():now/1000,fire=live&&(isFire(t)||(typeof secondPlayerFire==='function'&&secondPlayerFire(t)));ctx.clearRect(0,0,W,H);drawStage(t,fire,live);if(live){if(typeof isBattle==='function'&&isBattle())drawBattleHighways(t,dt);else highway(t,dt,fire);}if(state==='playing')tick(time());requestAnimationFrame(draw);}requestAnimationFrame(draw);
