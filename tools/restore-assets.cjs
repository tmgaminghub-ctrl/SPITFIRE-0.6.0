// The portable EXE is the durable, authoritative copy of the bundled binary artwork.
// Rehydrate it to a cache + symlinks for local preview, or real files for packaging.
const fs=require('fs'),path=require('path'),os=require('os'),crypto=require('crypto'),cp=require('child_process');
(async()=>{
 const root=path.resolve(__dirname,'..'),m=require('./runtime-assets.json'),materialize=process.argv.includes('--materialize'),compact=process.argv.includes('--compact');
 const app=path.join(root,'app'),cache=path.join(os.homedir(),'.cache','spitfire-runtime-'+m.version),assets=path.join(cache,'assets');
 const missing=m.files.some(f=>!fs.existsSync(path.join(app,f.path)));
 const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 if(missing&&m.files.some(f=>!fs.existsSync(path.join(assets,f.path)))){
  const exe=path.resolve(root,m.executable);if(!fs.existsSync(exe))throw Error('Keep '+m.executable+' beside the source workspace to restore bundled artwork.');
  fs.mkdirSync(cache,{recursive:true});const {getPath7za}=require('app-builder-lib/out/toolsets/7zip');const z=await getPath7za();
  const run=args=>cp.execFileSync(z,args,{stdio:'ignore'});
  run(['e',exe,'-o'+cache,'$PLUGINSDIR/app-64.7z','-y']);run(['e',path.join(cache,'app-64.7z'),'-o'+cache,'resources/app.asar','-y']);
  const asar=require('@electron/asar'),archive=path.join(cache,'app.asar');
  for(const f of m.files){const dest=path.join(assets,f.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,asar.extractFile(archive,'app/'+f.path));if(hash(dest)!==f.sha256)throw Error('Asset integrity mismatch: '+f.path);}
  fs.rmSync(path.join(cache,'app-64.7z'),{force:true});fs.rmSync(archive,{force:true});
 }
 let changed=0;
 for(const f of m.files){const dest=path.join(app,f.path),src=path.join(assets,f.path);let stat;try{stat=fs.lstatSync(dest);}catch{}
  if(stat&&!stat.isSymbolicLink()){
   if(compact&&process.platform!=='win32'&&hash(dest)===f.sha256){fs.mkdirSync(path.dirname(src),{recursive:true});fs.copyFileSync(dest,src);fs.unlinkSync(dest);fs.symlinkSync(src,dest);changed++;}
   continue; // Never overwrite a developer's edited regular file.
  }
  if(stat&&fs.existsSync(dest)&&!materialize)continue;
  if(!fs.existsSync(src))throw Error('Missing cached asset: '+f.path);
  fs.mkdirSync(path.dirname(dest),{recursive:true});if(stat)fs.unlinkSync(dest);
  if(materialize||process.platform==='win32')fs.copyFileSync(src,dest);else fs.symlinkSync(src,dest);changed++;
 }
 if(changed)console.log((materialize?'Materialized ':'Restored ')+changed+' bundled artwork files from the portable release.');
})().catch(e=>{console.error(e.message);process.exit(1);});
