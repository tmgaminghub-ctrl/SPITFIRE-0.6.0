"""Extract four independent title props and smoke, patch their holes, and compose exact 16:9.
Python 3 + Pillow; normal builds use the included generated runtime assets.
"""
from PIL import Image,ImageDraw,ImageFilter,ImageChops,ImageFont
from pathlib import Path
import json,math
root=Path(__file__).resolve().parents[1];app=root/'app';out=app/'title-rig';out.mkdir(exist_ok=True)
source_path=root/'artwork/title-wide-source.webp'
source_is_bundled=not source_path.exists()
if source_is_bundled:source_path=app/'title-screen.webp'
source=Image.open(source_path).convert('RGB').resize((1376,768),Image.Resampling.LANCZOS)
clean_path=root/'artwork/title-clean-fill.webp'
if not clean_path.exists():clean_path=app/'title-rig/plate.webp'
clean=Image.open(clean_path).convert('RGB').resize(source.size,Image.Resampling.LANCZOS)
S=(1600,900);sx=S[0]/1376;sy=S[1]/768
# Editable silhouette masks in source-pixel coordinates.
def polygon(points):
 m=Image.new('L',source.size);ImageDraw.Draw(m).polygon(points,fill=255);return m
left=[(390,175),(413,163),(431,188),(445,187),(458,195),(463,205),(478,209),(491,225),(546,351),(550,369),(561,380),(559,395),(489,419),(477,414),(467,396),(390,248),(382,228),(386,213),(393,203),(400,198)]
canL=polygon(left);canR=polygon([(1376-x,y) for x,y in left])
recordL=Image.new('L',source.size);ImageDraw.Draw(recordL).ellipse((112,386,438,710),fill=255)
recordR=Image.new('L',source.size);ImageDraw.Draw(recordR).ellipse((942,386,1264,710),fill=255)
logo=polygon([(556,404),(576,429),(607,442),(716,452),(780,445),(823,410),(835,432),(873,446),(925,465),(886,494),(905,524),(978,534),(943,560),(945,601),(940,647),(977,703),(881,684),(848,706),(817,690),(742,717),(671,731),(625,712),(604,717),(575,694),(539,713),(510,698),(451,695),(406,701),(432,667),(439,625),(423,576),(397,538),(441,528),(462,500),(451,467),(482,453),(531,430)])
head=polygon([(532,0),(851,0),(895,173),(902,197),(869,219),(849,242),(848,300),(857,346),(835,392),(806,425),(772,454),(603,454),(565,419),(541,388),(529,351),(524,292),(529,261),(544,237),(534,206),(502,232),(510,183),(530,145)])
foreground=ImageChops.lighter(logo,head)
props={'canLeft':canL,'canRight':canR,'recordLeft':recordL,'recordRight':recordR}
mask=Image.new('L',source.size)
for m in props.values():mask=ImageChops.lighter(mask,m)
# The generated plate is used ONLY in the four exposed prop footprints.
patch=mask.filter(ImageFilter.MaxFilter(25)).filter(ImageFilter.GaussianBlur(1))
base=source.copy();base.paste(clean,(0,0),patch)
base.paste(source,(0,0),foreground)
base=base.resize(S,Image.Resampling.LANCZOS)
# Prompt is part of the plate, never a separate footer or UI button.
d=ImageDraw.Draw(base);font=ImageFont.truetype(str(app/'fonts/Anton-Regular.ttf'),23)
s='PRESS ANY BUTTON TO BEGIN';tracking=3;width=sum(d.textlength(c,font=font) for c in s)+tracking*(len(s)-1);x=(1600-width)/2
# Soft local ground shadow preserves a readable prompt without a panel.
if not source_is_bundled:
 for c in s:
  d.text((x,859),c,font=font,fill='#eddbaf',stroke_width=2,stroke_fill='#0b0806');x+=d.textlength(c,font=font)+tracking
base.save(out/'plate.webp',quality=95,method=6)
# Complete static fallback is shown until every rig layer is decoded.
fallback=source.resize(S,Image.Resampling.LANCZOS);fallback.paste(base.crop((0,850,1600,900)),(0,850));fallback.save(app/'title-screen.webp',quality=95,method=6)
manifest={}
def save(name,rgb,alpha):
 alpha=alpha.filter(ImageFilter.GaussianBlur(.35));box=alpha.getbbox();im=rgb.convert('RGBA');im.putalpha(alpha);im=im.crop(box)
 xy=(round(box[0]*sx),round(box[1]*sy));size=(round(im.width*sx),round(im.height*sy));im=im.resize(size,Image.Resampling.LANCZOS)
 im.save(out/(name+'.webp'),quality=96,method=6)
 manifest[name]={'x':xy[0],'y':xy[1],'w':size[0],'h':size[1],'file':'title-rig/'+name+'.webp'}
for name,m in props.items():
 rgb=source.copy()
 if name.startswith('record'):
  # Restore the little rim hidden by the logo using symmetric intact grooves.
  overlap=ImageChops.multiply(m,logo);pixels=rgb.load();original=source.load();a=overlap.load();cx=275 if name=='recordLeft' else 1103
  for y in range(386,711):
   for x in range(112 if name=='recordLeft' else 942,439 if name=='recordLeft' else 1265):
    if a[x,y] or (y>448 and ((name=='recordLeft' and x>394) or (name=='recordRight' and x<983))):pixels[x,y]=original[int(2*cx-x),y]
 save(name,rgb,m)
save('foreground',source,foreground)
# Real painted smoke is luminance-keyed from the clean plate, not a solid rectangle.
for name,box in [('smokeLeft',(291,73,526,497)),('smokeRight',(850,77,1090,500))]:
 a=Image.new('L',source.size);p=a.load();rgb=clean.load()
 for y in range(box[1],box[3]):
  for x in range(box[0],box[2]):
   r,g,b=rgb[x,y];lum=(r+g+b)/3
   # Suppress warm lamps/bricks; retain cool/neutral pale wisps.
   neutral=max(0,1-abs(r-b)/65);edge=min(1,(x-box[0])/25,(box[2]-x)/25,(y-box[1])/25,(box[3]-y)/25)
   p[x,y]=int(max(0,lum-56)*.65*neutral*max(0,edge))
 save(name,Image.new('RGB',source.size,'#d7cfc0'),a)
# Wider foreground haze uses a separate translucent layer for independent drift.
for name,box in [('hazeLeft',(0,330,300,700)),('hazeRight',(1080,330,1376,700))]:
 a=Image.new('L',source.size);p=a.load();rgb=clean.load()
 for y in range(box[1],box[3]):
  for x in range(box[0],box[2]):
   r,g,b=rgb[x,y];lum=(r+g+b)/3;edge=min(1,(x-box[0])/35,(box[2]-x)/35,(y-box[1])/35,(box[3]-y)/35)
   p[x,y]=int(max(0,lum-45)*.5*max(0,1-abs(r-b)/50)*max(0,edge))
 save(name,Image.new('RGB',source.size,'#bcb8af'),a)
(app/'title-rig-data.js').write_text('const TITLE_WIDTH=1600,TITLE_HEIGHT=900;\nconst TITLE_RIG_PARTS='+json.dumps(manifest,separators=(',',':'))+';\n')
# Retire earlier side-only smoke textures; current smoke has the same names.
print('Built exact 1600x900 title: 4 prop cutouts, 4 smoke/haze layers, fixed foreground.')

# Apply the user-imported smoke atlases after regenerating base title props.
if (root.parent/'uploads/Mobile - Hello Kitty and Friends Happiness Parade - Effects - Colored Smoke Effect.png').exists():
 import subprocess,sys
 subprocess.run([sys.executable,str(root/'tools/import_smoke.py')],check=True)
