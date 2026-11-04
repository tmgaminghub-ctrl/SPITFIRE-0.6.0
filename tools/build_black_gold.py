"""Compose the supplied cover and generated alley into deterministic 16:9 UI plates."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops, ImageOps
from pathlib import Path
import math, random, subprocess, sys
root=Path(__file__).resolve().parents[1]; app=root/'app'
subprocess.run([sys.executable,str(root/'tools/build_rig.py')],check=True)
for p in (app/'rig').glob('*.png'):
 im=Image.open(p).convert('RGBA');alpha=im.getchannel('A');rgb=im.convert('RGB')
 warm=ImageOps.colorize(ImageOps.grayscale(rgb),'#100a08','#f0dbad',mid='#8e6740')
 rgb=Image.blend(warm,rgb,.16).convert('RGBA');rgb.putalpha(alpha);rgb.save(p,optimize=True)
wide_title_backup=(app/'title-screen.webp').read_bytes() if not (root/'artwork/title-wide-source.webp').exists() and (app/'title-screen.webp').exists() else None
reference=Path(sys.argv[1]) if len(sys.argv)>1 else root.parent/'uploads/generated-image (3).png'
ref=Image.open(reference).convert('RGB')
bg_path=root/'artwork/black-gold-alley.webp'
if not bg_path.exists():bg_path=app/'stage-clean.jpg'
bg=Image.open(bg_path).convert('RGB').resize((1672,940),Image.Resampling.LANCZOS)
bg.save(app/'stage-clean.jpg',quality=94,optimize=True)
font=lambda n:ImageFont.truetype(str(app/'fonts/Anton-Regular.ttf'),n)
def cover(base,side,x,y):
 im=ref.resize((side,side),Image.Resampling.LANCZOS)
 mask=Image.new('L',(side,side),255); p=mask.load()
 for yy in range(side):
  for xx in range(side):
   edge=min(xx,yy,side-1-xx,side-1-yy)
   p[xx,yy]=int(255*min(1,max(0,edge/35)))
 base.paste(im,(x,y),mask)
def label(im,s,y,size,fill=(229,200,136),tracking=3):
 d=ImageDraw.Draw(im); f=font(size); widths=[d.textlength(c,font=f) for c in s];x=(1672-sum(widths)-tracking*(len(s)-1))/2
 for c,w in zip(s,widths):d.text((x,y),c,font=f,fill=fill,stroke_width=1,stroke_fill=(10,8,5));x+=w+tracking
# Title: art and prompt are baked into a clean single plate, no UI/footer.
title=Image.blend(bg,Image.new('RGB',bg.size,'#080604'),.58)
cover(title,820,426,8)
label(title,'THE UNDERGROUND CIRCUIT',27,15,(166,133,76),5)
label(title,'PRESS ANY BUTTON TO BEGIN',838,30,(238,213,154),4)
label(title,'LOCAL PLAY  /  FIVE LANES  /  ONE CROWN',899,12,(150,132,101),3)
title.save(app/'title-screen.webp',quality=94,method=6)
# Main menu: large cover on left, intentionally quiet black-metal field on right.
menu=Image.blend(bg,Image.new('RGB',bg.size,'#080604'),.36)
cover(menu,860,25,40)
shade=Image.new('RGBA',menu.size); d=ImageDraw.Draw(shade)
for x in range(820,1672):d.line((x,0,x,940),fill=(7,6,5,int(220*min(1,(x-820)/200))))
menu=Image.alpha_composite(menu.convert('RGBA'),shade).convert('RGB')
menu.save(app/'main-menu.webp',quality=93,method=6)
# Loading composition; art on right, roomy status/message area on left.
loading=Image.blend(bg,Image.new('RGB',bg.size,'#080604'),.43)
cover(loading,835,812,30)
d=ImageDraw.Draw(loading);d.rectangle((70,170,73,690),fill='#9b732f')
def left(s,y,size,color):d.text((104,y),s,font=font(size),fill=color,stroke_width=1,stroke_fill='#090604')
left('THE UNDERGROUND CIRCUIT',185,18,'#b29155')
left('RESPECT',243,90,'#eee1bf');left('THE RHYTHM.',345,90,'#d6ac57')
left('BLACK METAL. GOLD CHAINS. PURE FLOW.',500,19,'#c0ab85')
left('PREPARING THE ROOM',600,27,'#ead5a4')
left('ALL ASSETS READY BEFORE THE FIRST NOTE.',650,15,'#a9997b')
loading.save(app/'loading-screen.webp',quality=93,method=6)
# Smoke accents stay at the outside of the title; the logo/prompt never move.
for name,seed in [('smokeLeft',8),('smokeRight',11)]:
 random.seed(seed);s=Image.new('RGBA',(330,570));sd=ImageDraw.Draw(s)
 for j in range(5):
  points=[]
  for y in range(560,0,-3):
   x=165+math.sin(y/82+j)*50+math.sin(y/45+j)*18+(j-2)*13
   a=int(12*math.sin(math.pi*y/570));r=9+int(14*math.sin(y/135+j)**2)
   sd.ellipse((x-r,y-r,x+r,y+r),fill=(192,163,109,max(0,a)))
 s=s.filter(ImageFilter.GaussianBlur(8));s.save(app/'title-rig'/f'{name}.webp',quality=92,method=6)
print('Composed title, menu, loading, alley stage and animated side smoke.')

# Preserve the current rigged widescreen title when regenerating the overall theme.
if (root/'artwork/title-wide-source.webp').exists() or wide_title_backup is not None:
 if wide_title_backup is not None:(app/'title-screen.webp').write_bytes(wide_title_backup)
 subprocess.run([sys.executable,str(root/'tools/build_title_props.py')],check=True)
if (root.parent/'uploads/generated-image (8).png').exists():
 subprocess.run([sys.executable,str(root/'tools/build_poster_menu.py')],check=True)
