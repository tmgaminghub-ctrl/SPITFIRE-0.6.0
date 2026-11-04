const {chromium}=require('@playwright/test');
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1440,height:810}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8080');await p.waitForFunction(()=>titleRigReady());const result=await p.evaluate(()=>{
 const assert=(v,s)=>{if(!v)throw Error(s);};const c=document.createElement('canvas');c.width=1600;c.height=900;const x=c.getContext('2d');
 assert(TITLE_WIDTH===1600&&TITLE_HEIGHT===900&&TITLE_WIDTH/TITLE_HEIGHT===16/9,'exact 16:9 scene');assert(document.querySelector('.title-art').naturalWidth/document.querySelector('.title-art').naturalHeight===16/9,'16:9 fallback');
 const pixels=(t,reduced=false)=>{renderTitlePose(x,1600,900,t,reduced);return x.getImageData(0,0,1600,900).data;};const a=pixels(0),b=pixels(2);
 const changed=(one,two,box)=>{let n=0;for(let y=box[1];y<box[3];y++)for(let col=box[0];col<box[2];col++){const i=(y*1600+col)*4;if(one[i]!==two[i]||one[i+1]!==two[i+1]||one[i+2]!==two[i+2])n++;}return n;};
 for(const [name,box]of Object.entries({skull:[680,180,920,300],logo:[620,560,980,760],prompt:[400,858,1200,899]}))assert(changed(a,b,box)===0,name+' must remain fixed');
 const isolated={};for(const name of ['canLeft','canRight','recordLeft','recordRight','smokeLeft','smokeRight','hazeLeft','hazeRight']){
  const bone=TITLE_BONES[name],meta=TITLE_RIG_PARTS[bone.part];const draw=t=>{x.clearRect(0,0,1600,900);x.save();const pose=titlePose(t,false);applyTitleBone(x,name,pose);x.globalAlpha=pose[name].alpha;drawTitleLayer(x,name,t,false);x.restore();return x.getImageData(0,0,1600,900).data;};
  isolated[name]=changed(draw(0),draw(2),[0,0,1600,900]);assert(isolated[name]>100,name+' must animate independently');
 }
 assert(TITLE_BONES.smokeLeft.parent==='canLeft'&&TITLE_BONES.smokeRight.parent==='canRight','smoke must inherit can transforms');
 assert(!TITLE_BONES.recordLeft.parent&&!TITLE_BONES.recordRight.parent,'independent vinyl pivots');
 const r0=pixels(0,true),r2=pixels(2,true);assert(r0.every((v,i)=>v===r2[i]),'reduced motion freezes all layers');
 const loop0=pixels(0),loop48=pixels(48);assert(loop0.every((v,i)=>v===loop48[i]),'48-second composite loop');
 assert(Math.abs(titlePose(12,false).recordLeft.rotation-Math.PI/2)<1e-9&&Math.abs(titlePose(12,false).recordRight.rotation+Math.PI/2)<1e-9,'opposite record spin');
 const tall=document.createElement('canvas');tall.width=1000;tall.height=720;const tx=tall.getContext('2d');renderTitlePose(tx,1000,720,0,true);const corner=tx.getImageData(5,5,1,1).data;assert(corner[0]===0&&corner[1]===0&&corner[2]===0,'letterbox, never crop title');
 return {scene:'1600x900',exact16by9:true,independentChangedPixels:isolated,canParentedSmoke:true,oppositeRecordSpin:true,fixedSkullLogoPrompt:true,reducedMotion:true,fortyEightSecondLoop:true,letterboxing:true};
});console.log(JSON.stringify({pass:errors.length===0,...result,runtimeErrors:errors},null,2));await b.close();if(errors.length)process.exit(1);})().catch(e=>{console.error(e);process.exit(1);});
