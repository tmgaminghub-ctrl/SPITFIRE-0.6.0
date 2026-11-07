// Cross-platform PE resource editing: no Wine or code-signing certificate needed.
const fs=require('fs');const path=require('path');
async function applyIcon(context){
  if(context.electronPlatformName!=='win32')return;
  const RE=await import('resedit');
  const file=path.join(context.appOutDir,'SPITFIRE.exe');
  const exe=RE.NtExecutable.from(fs.readFileSync(file));
  const resources=RE.NtExecutableResource.from(exe);
  const icon=RE.Data.IconFile.from(fs.readFileSync(path.join(context.packager.projectDir,'app/icon.ico')));
  const groups=RE.Resource.IconGroupEntry.fromEntries(resources.entries);
  for(const group of groups.length?groups:[{id:1,lang:1033}])RE.Resource.IconGroupEntry.replaceIconsForResource(resources.entries,group.id,group.lang,icon.icons.map(i=>i.data));
  for(const version of RE.Resource.VersionInfo.fromEntries(resources.entries)){
    const versionParts=context.packager.appInfo.version.split('.').map(Number);version.setFileVersion(...versionParts,0,1033);version.setProductVersion(...versionParts,0,1033);
    version.setStringValues({lang:1033,codepage:1200},{FileDescription:'SPITFIRE — Midnight Circuit',ProductName:'SPITFIRE',CompanyName:'SPITFIRE Project',OriginalFilename:'SPITFIRE.exe'});version.outputToResourceEntries(resources.entries);
  }
  resources.outputResource(exe);fs.writeFileSync(file,Buffer.from(exe.generate()));
  console.log('Embedded SPITFIRE icon ('+icon.icons.length+' resolutions) into game executable.');
}
module.exports=async context=>{await applyIcon(context);
 // Optional D3D12/WebGPU DXC compiler is not used by this Canvas2D game.
 // Retain D3D11, Vulkan/SwiftShader fallbacks, codecs, ICU and all Chromium notices.
 if(context.electronPlatformName==='win32')fs.rmSync(path.join(context.appOutDir,'dxcompiler.dll'),{force:true});
 if(global.gc)global.gc();};
