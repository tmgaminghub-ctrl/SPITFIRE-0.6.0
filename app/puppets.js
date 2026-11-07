'use strict';
// Articulated cutout rigs. All joints use the original illustration's bind space.
// Each child inherits its ancestors' rotations; sprites are independently editable PNGs.
const PUPPET_BONES={
 producerRoot:{pivot:[145,566],parent:null},
 producerLegs:{pivot:[145,566],parent:'producerRoot',part:'producer_legs',z:0},
 producerTorso:{pivot:[158,513],parent:'producerRoot',part:'producer_body',z:1},
 producerHead:{pivot:[208,310],parent:'producerTorso',part:'producer_head',z:3},
 producerUpperB:{pivot:[237,330],parent:'producerTorso',part:'producer_upperB',z:4},
 producerForeB:{pivot:[292,384],parent:'producerUpperB',part:'producer_foreB',z:5},
 producerHandB:{pivot:[311,405],parent:'producerForeB',part:'producer_handB',z:8},
 producerUpperA:{pivot:[118,318],parent:'producerTorso',part:'producer_upperA',z:4},
 producerForeA:{pivot:[90,383],parent:'producerUpperA',part:'producer_foreA',z:5},
 producerHandA:{pivot:[180,449],parent:'producerForeA',part:'producer_handA',z:8},
 rapperRoot:{pivot:[1193,541],parent:null},
 rapperLegs:{pivot:[1193,541],parent:'rapperRoot',part:'rapper_legs',z:0},
 rapperTorso:{pivot:[1190,492],parent:'rapperRoot',part:'rapper_body',z:1},
 rapperHead:{pivot:[1132,269],parent:'rapperTorso',part:'rapper_head',z:3},
 rapperUpperB:{pivot:[1248,237],parent:'rapperTorso',part:'rapper_upperB',z:2},
 rapperForeB:{pivot:[1327,185],parent:'rapperUpperB',part:'rapper_foreB',z:4},
 rapperHandB:{pivot:[1312,116],parent:'rapperForeB',part:'rapper_handB',z:5},
 rapperUpperA:{pivot:[1060,313],parent:'rapperTorso',part:'rapper_upperA',z:4},
 rapperForeA:{pivot:[996,350],parent:'rapperUpperA',part:'rapper_foreA',z:5},
 rapperHandA:{pivot:[1038,268],parent:'rapperForeA',part:'rapper_handA',z:6},
 sampler:{pivot:[280,510],parent:null,part:'sampler',z:7}
};
const rigImages={};for(const [name,meta] of Object.entries(RIG_PARTS)){const i=new Image();i.src=meta.file;rigImages[name]=i;}
let rigDebug=false;window.addEventListener('keydown',e=>{if(e.code==='F2'&&!e.repeat){e.preventDefault();rigDebug=!rigDebug;}});
function rigReady(){return Object.values(rigImages).every(i=>i.complete&&i.naturalWidth>0);}
function poseAt(t,live,fire){const phase=Math.max(0,t-LEAD)/B*Math.PI*2,energy=(live?.4+hype/110:.55)+(fire?.55:0),motion=settings.motion?0:1;const angles={};const bob=Math.sin(phase),half=Math.sin(phase/2),slow=Math.sin(phase/4);const drumA=Math.pow(Math.max(0,Math.sin(phase)),4),drumB=Math.pow(Math.max(0,Math.sin(phase+Math.PI)),4);
angles.producerRoot=.006*slow;angles.producerTorso=.009*half;angles.producerHead=.048*bob;angles.producerUpperA=.018*half;angles.producerForeA=-.035*drumA;angles.producerHandA=.065*drumA;angles.producerUpperB=-.018*half;angles.producerForeB=.05*drumB;angles.producerHandB=-.065*drumB;
angles.rapperRoot=-.008*slow;angles.rapperTorso=-.014*half;angles.rapperHead=.042*bob;angles.rapperUpperA=.014*half;angles.rapperForeA=.025*bob;angles.rapperHandA=-.02*bob;angles.rapperUpperB=.055*slow;angles.rapperForeB=.07*Math.sin(phase/4+.7);angles.rapperHandB=.06*Math.sin(phase/2);
// Actual drum-pad input and flow input produce small additive hand accents.
if(live){if(pressed.has(0)||pressed.has(1))angles.producerHandA+=.06;if(pressed.has(2)||pressed.has(3))angles.producerHandB-=.05;if(pressed.has(4))angles.rapperHead-=.025;}
for(const k in angles)angles[k]*=energy*motion;
return {angles,producerY:1.8*bob*energy*motion,rapperY:2.6*bob*energy*motion};}
function applyBone(name,pose,bones=PUPPET_BONES){const bone=bones[name];if(bone.parent)applyBone(bone.parent,pose,bones);else if(name==='producerRoot')ctx.translate(0,pose.producerY);else if(name==='rapperRoot')ctx.translate(0,pose.rapperY);const [x,y]=bone.pivot;ctx.translate(x,y);ctx.rotate(pose.angles[name]||0);ctx.translate(-x,-y);}
function drawPuppets(t,live,fire){if(!rigReady())return;const basePose=poseAt(t,live,fire),pose=typeof styleCareerPose==='function'?styleCareerPose(basePose):basePose;const bones=typeof careerPuppetBones==='function'?careerPuppetBones(PUPPET_BONES):PUPPET_BONES;ctx.save();ctx.scale(W/1376,H/768);for(const [name,bone] of Object.entries(bones).filter(([,b])=>b.part).sort((a,b)=>a[1].z-b[1].z)){const meta=typeof careerPartMeta==='function'?careerPartMeta(bone.part,RIG_PARTS[bone.part]):RIG_PARTS[bone.part];ctx.save();applyBone(name,pose,bones);const texture=typeof careerPartTexture==='function'?careerPartTexture(bone.part,rigImages[bone.part]):rigImages[bone.part];ctx.drawImage(texture,meta.x,meta.y);ctx.restore();}
if(rigDebug){for(const [name,bone] of Object.entries(bones)){if(name==='sampler')continue;ctx.save();applyBone(name,pose,bones);const [x,y]=bone.pivot;ctx.strokeStyle='#d8ff67';ctx.lineWidth=2;for(const child of Object.values(bones).filter(b=>b.parent===name)){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(...child.pivot);ctx.stroke();}ellipse(x,y,4,4,'#ff58db','#fff',1);ctx.font='9px monospace';ctx.textAlign='left';ctx.fillStyle='#f8ffce';ctx.fillText(name,x+6,y-6);ctx.restore();}ctx.fillStyle='#071018d9';ctx.fillRect(465,14,440,34);text('RIG VIEW / F2 TO HIDE',685,37,15,'#d8ff67');}ctx.restore();}
