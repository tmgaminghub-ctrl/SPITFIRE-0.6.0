'use strict';
// Four independent cutout props. Smoke emitters inherit each can's transform.
const titlePoint=(x,y)=>[x*TITLE_WIDTH/1376,y*TITLE_HEIGHT/768];
const TITLE_BONES={
 hazeLeft:{pivot:titlePoint(150,500),parent:null,part:'hazeLeft',z:1},
 hazeRight:{pivot:titlePoint(1226,500),parent:null,part:'hazeRight',z:1},
 recordLeft:{pivot:titlePoint(275,548),parent:null,part:'recordLeft',z:2},
 recordRight:{pivot:titlePoint(1103,548),parent:null,part:'recordRight',z:2},
 canLeft:{pivot:titlePoint(515,402),parent:null,part:'canLeft',z:4},
 canRight:{pivot:titlePoint(861,402),parent:null,part:'canRight',z:4},
 smokeLeft:{pivot:titlePoint(410,180),parent:'canLeft',part:'smokeLeft',z:3},
 smokeRight:{pivot:titlePoint(966,180),parent:'canRight',part:'smokeRight',z:3},
 foreground:{pivot:[800,450],parent:null,part:'foreground',z:6}
};
const titleTextures={},titleImageCache=new Map();for(const [name,part] of Object.entries(TITLE_RIG_PARTS)){let image=titleImageCache.get(part.file);if(!image){image=new Image();image.src=part.file;titleImageCache.set(part.file,image);}titleTextures[name]=image;}
titleTextures.plate=new Image();titleTextures.plate.src='title-rig/plate.webp';
const titleRigCanvas=$('titleRigCanvas'),titleRigContext=titleRigCanvas.getContext('2d');
function titleRigReady(){const poster=document.querySelector('.title-art');return poster.complete&&poster.naturalWidth>0&&Object.values(titleTextures).every(i=>i.complete&&i.naturalWidth>0);}
function titlePose(seconds,reduced=settings.motion){
 const t=((seconds%48)+48)%48,p=t*Math.PI*2/8,q=t*Math.PI*2/12,a=reduced?0:1;
 const pose=(r=0,x=0,y=0,alpha=1)=>({rotation:r*a,x:x*a,y:y*a,alpha:reduced?1:alpha});
 return {canLeft:pose(.012*Math.sin(p),0,1.2*Math.sin(p)),canRight:pose(-.012*Math.sin(p+.6),0,1.2*Math.sin(p+.6)),
 recordLeft:pose(t/48*Math.PI*2),recordRight:pose(-t/48*Math.PI*2),
 smokeLeft:pose(.018*Math.sin(q),4*Math.sin(q),-5*Math.sin(q+.5),.7+.2*Math.sin(q)),
 smokeRight:pose(-.018*Math.sin(q+.8),-4*Math.sin(q+.8),-5*Math.sin(q+1.3),.7+.2*Math.sin(q+.8)),
 hazeLeft:pose(.012*Math.sin(q),5*Math.sin(q),-3*Math.sin(q+.2),.7+.2*Math.sin(q+.3)),
 hazeRight:pose(-.012*Math.sin(q+.5),-5*Math.sin(q+.5),-3*Math.sin(q+.7),.7+.2*Math.sin(q+1)),foreground:pose()};
}
function applyTitleBone(context,name,pose){const bone=TITLE_BONES[name],p=pose[name];if(bone.parent)applyTitleBone(context,bone.parent,pose);context.translate(p.x,p.y);context.translate(...bone.pivot);context.rotate(p.rotation);context.translate(-bone.pivot[0],-bone.pivot[1]);}
// Sprite-sheet playback is time-based, cross-faded, and deterministic across frame rates.
function titleSmokeFrame(name,seconds,reduced=settings.motion){
 const m=TITLE_RIG_PARTS[name],atlas=TITLE_SMOKE_ATLASES[m.animation];
 if(reduced)return {frame:m.animation==='plume'?12:7,next:m.animation==='plume'?12:7,blend:0,progress:.25,opacity:.6};
 const clock=((seconds%48)+48)%48,t=(clock+(m.phase||0))%atlas.duration,p=t/atlas.duration,f=p*atlas.frames;
 return {frame:Math.floor(f),next:(Math.floor(f)+1)%atlas.frames,blend:f%1,progress:p,opacity:Math.max(0,Math.min(1,t/.18,(atlas.duration-t)/.45))*.6};
}
function drawTitleLayer(context,name,seconds,reduced=settings.motion){
 const m=TITLE_RIG_PARTS[TITLE_BONES[name].part],image=titleTextures[TITLE_BONES[name].part];
 if(!m.animation){context.drawImage(image,m.x,m.y);return;}
 const a=TITLE_SMOKE_ATLASES[m.animation],f=titleSmokeFrame(name,seconds,reduced),alpha=context.globalAlpha;
 let w=m.w,h=m.h,x=m.x,y=m.y;
 if(m.animation==='puff'){const size=.72+f.progress*.42;w*=size;h*=size;x+=(m.w-w)/2;y+=(m.h-h)/2-f.progress*35;}
 context.save();if(m.flip){context.translate(x+w,y);context.scale(-1,1);x=0;y=0;}
 const draw=(frame,weight)=>{if(weight<=0)return;context.globalAlpha=alpha*f.opacity*weight;const sx=(frame%a.columns)*a.cell,sy=Math.floor(frame/a.columns)*a.cell;context.drawImage(image,sx,sy,a.cell,a.cell,x,y,w,h);};
 draw(f.frame,1-f.blend);draw(f.next,f.blend);context.restore();
}
function renderTitlePose(context,width,height,seconds,reduced=settings.motion){
 if(!titleRigReady())return false;
 const scale=Math.min(width/TITLE_WIDTH,height/TITLE_HEIGHT),x=(width-TITLE_WIDTH*scale)/2,y=(height-TITLE_HEIGHT*scale)/2;
 context.clearRect(0,0,width,height);context.fillStyle='#000';context.fillRect(0,0,width,height);context.save();context.translate(x,y);context.scale(scale,scale);context.drawImage(titleTextures.plate,0,0,TITLE_WIDTH,TITLE_HEIGHT);
 const pose=titlePose(seconds,reduced);
 for(const [name,bone]of Object.entries(TITLE_BONES).sort((a,b)=>a[1].z-b[1].z)){
  context.save();applyTitleBone(context,name,pose);context.globalAlpha=pose[name].alpha;
  drawTitleLayer(context,name,seconds,reduced);context.restore();
 }
 context.restore();return true;
}
function drawTitleRig(now){if($('title').classList.contains('hidden'))return;const width=innerWidth,height=innerHeight,dpr=Math.min(devicePixelRatio,2);if(titleRigCanvas.width!==Math.round(width*dpr)||titleRigCanvas.height!==Math.round(height*dpr)){titleRigCanvas.width=Math.round(width*dpr);titleRigCanvas.height=Math.round(height*dpr);titleRigContext.setTransform(dpr,0,0,dpr,0,0);}renderTitlePose(titleRigContext,width,height,now/1000);}
