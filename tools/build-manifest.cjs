// Build the local image/font preload manifest. No network or npm packages required.
const fs=require('fs'),path=require('path');const root=path.join(__dirname,'../app');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const images=walk(root).filter(f=>/\.(png|jpe?g|webp|svg)$/i.test(f)).map(f=>path.relative(root,f).split(path.sep).join('/')).sort();
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');const fonts=[...html.matchAll(/@font-face\s*\{[^}]*font-family\s*:\s*([^;]+);[^}]*src\s*:\s*url\(['"]?([^'")]+)['"]?\)/g)].map(m=>({family:m[1].trim().replace(/^['"]|['"]$/g,''),path:m[2]}));
for(const font of fonts)if(!fs.existsSync(path.join(root,font.path)))throw Error('Missing font '+font.path);
fs.writeFileSync(path.join(root,'asset-manifest.js'),'const PRELOAD_IMAGE_ASSETS='+JSON.stringify(images)+';\nconst PRELOAD_FONT_ASSETS='+JSON.stringify(fonts)+';\n');
console.log('Preload manifest:',images.length,'images,',fonts.length,'font families');
