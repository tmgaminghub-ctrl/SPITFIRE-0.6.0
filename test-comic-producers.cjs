const {chromium}=require('@playwright/test');
(async()=>{
 const browser=await chromium.launch({args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const page=await browser.newPage({viewport:{width:1376,height:768}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8080');await page.click('#enterMenu');await page.click('#careerBtn');await page.evaluate(()=>careerProgress.cleared.fill(true));
 const signatures=[];
 for(let job=0;job<3;job++){
  await page.evaluate(i=>launchCareer(i),job);await page.waitForFunction(()=>state==='playing');
  signatures.push(await page.evaluate(()=>{
   const show=currentCareerShow(),person=CAREER_CAST[show.producer],bones=careerPuppetBones(PUPPET_BONES);
   if(person.artStyle!=='comic-fullbody'||Object.keys(person.rigParts).length!==9||Object.keys(person.bones).length!==10)throw Error('Complete individual producer body required');
   if(bones.producerRoot===PUPPET_BONES.producerRoot||bones.rapperRoot!==CAREER_CAST[show.rapper].bones.rapperRoot)throw Error('Both independent artist rigs must route together');
   for(const [part,m] of Object.entries(person.rigParts)){
    const image=careerPartTexture(part,rigImages[part]);if(image===rigImages[part]||image.naturalWidth!==m.w||image.naturalHeight!==m.h||careerPartMeta(part,RIG_PARTS[part])!==m)throw Error('Producer geometry/texture mismatch');
    const c=document.createElement('canvas');c.width=m.w;c.height=m.h;const g=c.getContext('2d');g.drawImage(image,0,0);const p=g.getImageData(0,0,c.width,c.height).data;let opaque=0,transparent=0,green=0;
    for(let i=0;i<p.length;i+=4){if(p[i+3]<5)transparent++;if(p[i+3]>240){opaque++;if(p[i]<70&&p[i+1]>180&&p[i+2]<70)green++;}}
    if(!transparent||opaque<100||green)throw Error('Clean transparent illustrated producer parts required: '+part);
   }
   if(careerPartTexture('sampler',rigImages.sampler)!==careerSamplerImage||careerPartMeta('sampler',RIG_PARTS.sampler)!==person.sampler||!careerSamplerImage.naturalWidth||person.sampler.w!==careerSamplerImage.naturalWidth)throw Error('Clean comic equipment must replace original sampler with baked-in limbs');
   const render=t=>{ctx.clearRect(0,0,W,H);drawPuppets(t,true,false);return canvas.toDataURL();};
   settings.motion=false;if(render(LEAD+B*.25)===render(LEAD+B*.75))throw Error('Animated cutout motion');
   pressed.clear();const idle=styleCareerPose(poseAt(LEAD,true,false));pressed.add(0);pressed.add(2);const hit=styleCareerPose(poseAt(LEAD,true,false));pressed.clear();
   if(hit.angles.producerHandA===idle.angles.producerHandA||hit.angles.producerHandB===idle.angles.producerHandB)throw Error('Two input hand accents');
   settings.motion=true;if(render(LEAD+B*.25)!==render(LEAD+B*.75))throw Error('Reduced motion must freeze both rigs');settings.motion=false;
   rigDebug=true;render(LEAD+B*.3);rigDebug=false;
   return JSON.stringify(person.rigParts)+JSON.stringify(person.bones);
  }));
  await page.evaluate(async()=>await home());await page.waitForFunction(()=>state==='menu');
 }
 if(new Set(signatures).size!==3)throw Error('Three unique full-body rigs');
 await page.click('#play');await page.click('#playTrack');await page.waitForFunction(()=>state==='playing');
 if(!await page.evaluate(()=>careerPuppetBones(PUPPET_BONES)===PUPPET_BONES&&['producer_head','producer_body','sampler'].every(part=>careerPartMeta(part,RIG_PARTS[part])===RIG_PARTS[part]&&careerPartTexture(part,rigImages[part])===rigImages[part])))throw Error('Non-Career default rig and sampler must stay original');
 const retry=await browser.newPage();await retry.route('**/cast/comic-sampler.webp',r=>r.abort());await retry.goto('http://127.0.0.1:8080');await retry.click('#enterMenu');await retry.click('#careerBtn');await retry.evaluate(()=>launchCareer(0));await retry.waitForFunction(()=>state==='load-error');await retry.unroute('**/cast/comic-sampler.webp');await retry.click('#loadRetry');await retry.waitForFunction(()=>state==='playing');await retry.close();
 if(errors.length)throw Error(errors.join('\n'));
 console.log(JSON.stringify({pass:true,threeDistinctFullBodyProducers:true,nineCustomPartsTenJointsEach:true,rapperAndProducerIndependentGeometry:true,cleanMatteForAllTwentySevenParts:true,cleanSamplerWithoutOldBakedInLimbs:true,animationAndInputHandAccents:true,reducedMotionAndDebugOverlay:true,quickPlayOriginalRigsAndEquipment:true,newSamplerLoadErrorAndRetryRecovery:true,runtimeErrors:errors},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
