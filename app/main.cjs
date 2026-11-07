const {app,BrowserWindow,Menu}=require('electron');
app.commandLine.appendSwitch('autoplay-policy','no-user-gesture-required');
// This game uses Canvas2D/Web Audio, not WebGPU; keep the portable runtime lean.
app.commandLine.appendSwitch('disable-features','WebGPU');
const path=require('path');
const fs=require('fs');
// Keep saves beside the portable executable when the directory is writable.
if(process.env.PORTABLE_EXECUTABLE_DIR){
  try { const data=path.join(process.env.PORTABLE_EXECUTABLE_DIR,'SPITFIRE-data'); fs.mkdirSync(data,{recursive:true}); fs.accessSync(data,fs.constants.W_OK); app.setPath('userData',data); } catch { /* Read-only media: fall back to the normal per-user data directory. */ }
}
app.whenReady().then(()=>{Menu.setApplicationMenu(null);const w=new BrowserWindow({width:1440,height:810,useContentSize:true,minWidth:960,minHeight:540,backgroundColor:'#090b12',icon:path.join(__dirname,'icon.png'),title:'SPITFIRE • Midnight Circuit',webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}});w.loadFile(path.join(__dirname,'index.html'));w.webContents.setWindowOpenHandler(()=>({action:'deny'}));w.webContents.on('will-navigate',e=>e.preventDefault());});
app.on('window-all-closed',()=>app.quit());
