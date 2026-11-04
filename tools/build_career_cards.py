"""Extract all eleven selectable pack backgrounds from the supplied low-res contact image."""
from PIL import Image,ImageDraw
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1];app=root/'app';out=app/'career-cards';out.mkdir(exist_ok=True)
im=Image.open(root.parent/'uploads/backwoods-cigars.jpg').convert('RGB')
rows=[(0,102,84,257),(109,102,194,257),(220,102,306,257),(333,102,419,257),(448,102,534,257),(0,282,84,438),(90,282,174,438),(180,282,264,438),(270,282,354,438),(360,282,444,438),(450,282,534,438)]
labels=['Yellow / Gold','Amber / Copper','Dark Brown','Rose / Silver','Black / Gold','Silver / Blue','Camo / Black','Yellow / Banana','Charcoal','Cream / Grey','Purple / Berry']
colors=['#a78a2b','#70412c','#402516','#77645b','#242725','#5e6263','#3a352d','#b5a536','#2b2d28','#777368','#79396d']
styles=[]
for i,(box,label,color) in enumerate(zip(rows,labels,colors)):
 crop=im.crop(box)
 # Replace only the old brand header; other supplied artwork/labels stay in place.
 d=ImageDraw.Draw(crop);d.rectangle((0,0,crop.width,39),fill=color)
 for y in range(40):
  # A subtle packaging-style vignette behind the new vector lettering.
  alpha=int(22*abs(y-16)/24);d.line((0,y,crop.width,y),fill=tuple(max(0,int(color[j:j+2],16)-alpha) for j in [1,3,5]))
 name=f'pack-{i+1:02d}.webp';crop.save(out/name,quality=96,method=6)
 styles.append({'id':f'pack-{i+1:02d}','label':label,'file':'career-cards/'+name})
(app/'career-card-data.js').write_text('const CAREER_CARD_STYLES='+json.dumps(styles,separators=(',',':'))+';\n')
print('Extracted 11 backgrounds; original brand headers cleared for custom player names.')
