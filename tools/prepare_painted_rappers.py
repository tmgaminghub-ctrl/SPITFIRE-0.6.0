"""Prepare painted Career rapper sprites without changing the puppet's bind geometry.
Run `node tools/restore-assets.cjs --materialize` before editing binary assets.
Head source: .cache/{id}-painted-head.png, or durable artwork/painted-rappers masters.
Clothing/hand source: original app/rig sprites. Producers and Quick Play rigs are untouched.
"""
from pathlib import Path
from PIL import Image,ImageOps,ImageColor
import json,math
root=Path(__file__).resolve().parents[1];app=root/'app';masters=root/'artwork/painted-rappers';masters.mkdir(parents=True,exist_ok=True)
parts=json.loads((app/'rig-data.js').read_text().split('=',1)[1].rstrip(';\n '))
cast=json.loads((app/'career-world-data.js').read_text().split('=',1)[1].split(';\n',1)[0])
if any(p.get('artStyle')=='comic-fullbody' for p in cast.values()):
 raise SystemExit('These rigs now have unique full bodies. Use tools/prepare_fullbody_rappers.py instead.')
for key in ['nova','echo','brick']:
 person=cast[key];source=root.parent/'.cache'/f'{key}-painted-head.png';master=masters/f'{key}-head.webp'
 if source.exists():
  im=Image.open(source).convert('RGBA');pixels=[]
  for r,g,b,a in im.getdata():
   # Preserve teal/violet highlights; remove only strongly green-biased chroma matte.
   bias=g-max(r,b);alpha=max(0,min(255,round(255-max(0,bias-45)*2)))
   if alpha<250:g=min(g,max(r,b)+20)
   pixels.append((r,g,b,alpha))
  im.putdata(pixels);im.thumbnail((340,500))
  if key=='nova':
   # Stagger/taper braid tips instead of leaving a straight sprite-crop edge.
   p=im.load()
   for x in range(im.width):
    if im.width*.29<x<im.width*.74:continue
    tip=im.height*(.90+.08*(.5+.5*math.sin(x*.20)))
    for y in range(int(im.height*.89),im.height):
     r,g,b,a=p[x,y];a=round(a*max(0,min(1,(tip-y)/5)));p[x,y]=(r,g,b,a)
  im.save(master,quality=92,method=6)
 elif master.exists():im=Image.open(master).convert('RGBA')
 else:raise FileNotFoundError('Missing painted head: '+key)
 head=parts['rapper_head'];out=im.resize((head['w'],head['h']),Image.Resampling.LANCZOS)
 out.save(app/person['files']['rapper_head'],quality=95,method=6)
 for name,path in person['files'].items():
  if name.endswith('_head'):continue
  original=Image.open(app/parts[name]['file']).convert('RGBA');alpha=original.getchannel('A');grey=ImageOps.grayscale(original)
  skin='_hand' in name or 'rapper_fore' in name
  if skin:
   shadow='#291a16';mid=person['skin'];bright=tuple(min(255,int(v*.82+72))for v in ImageColor.getrgb(mid))
  else:
   shadow=person['dark'];mid=person['cloth'];bright=tuple(min(255,int(v*.56+112))for v in ImageColor.getrgb(mid))
  colored=ImageOps.colorize(grey,shadow,bright,mid=mid,midpoint=167).convert('RGBA');colored.putalpha(alpha)
  # Paint cool/warm stage reflection into the original shaded folds, not a flat tint.
  pix=colored.load();luma=grey.load();m=parts[name]
  for y in range(colored.height):
   for x in range(colored.width):
    r,g,b,a=pix[x,y]
    if not a:continue
    phase=max(0,min(1,(m['x']+x-959)/417));strength=max(0,min(.23,(luma[x,y]-100)/680))
    light=(int(58+phase*124),int(188-phase*80),int(177+phase*38))
    pix[x,y]=(int(r*(1-strength)+light[0]*strength),int(g*(1-strength)+light[1]*strength),int(b*(1-strength)+light[2]*strength),a)
  colored.save(app/path,quality=94,method=6)
 person['artStyle']='painted-stage'
(app/'career-world-data.js').write_text('const CAREER_CAST='+json.dumps(cast)+';\nconst CAREER_SHOWS='+ (app/'career-world-data.js').read_text().split('const CAREER_SHOWS=',1)[1])
print('Prepared three painted heads and 24 shaded body/limb sprites. Existing dimensions and joint coordinates retained.')
