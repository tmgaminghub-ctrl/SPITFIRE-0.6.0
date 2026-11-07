"""Career scenery conversion and original illustrated cast variants.
Run after `node tools/restore-assets.cjs --materialize`.
Venue source paintings are AI-generated assets in .cache/career-*.png; when absent,
keep the released app/venues WebPs. User uploads and original puppet sprites are unchanged.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json,random
root=Path(__file__).resolve().parents[1];app=root/'app'
(app/'venues').mkdir(exist_ok=True);(app/'cast').mkdir(exist_ok=True)
venues=[('basement','THE CINDER CELLAR','NOVA VERSE','IRIS 808'),('rooftop','SKYLINE ROOFTOP','ECHO KID','DUST RELAY'),('warehouse','IRONWORKS CLUB','BRICK SAINT','TAPE THEORY'),('subway','PLATFORM ZERO','NOVA VERSE','TAPE THEORY'),('block','CROWN BLOCK PARTY','BRICK SAINT','IRIS 808'),('arena','BLACK GOLD ARENA','ECHO KID','DUST RELAY')]
people=[
 dict(id='nova',name='NOVA VERSE',role='rapper',skin='#8d5038',cloth='#b64866',dark='#24131e',hair='braids',accessory='#dfb958',swing=.83,bio='Measured pocket, burgundy jacket, gold hoops.'),
 dict(id='echo',name='ECHO KID',role='rapper',skin='#bb7c51',cloth='#489695',dark='#10292e',hair='cap',accessory='#d8b17a',swing=1.2,bio='High-energy gestures, teal jacket, flat-brim cap.'),
 dict(id='brick',name='BRICK SAINT',role='rapper',skin='#684431',cloth='#c6ae7d',dark='#33281b',hair='beanie',accessory='#c77d36',swing=1.05,bio='Heavy head nod, cream jacket, orange beanie and beard.'),
 dict(id='iris',name='IRIS 808',role='producer',skin='#b37952',cloth='#93689c',dark='#241b30',hair='bob',accessory='#c19ac7',swing=.85,bio='Precise pad work, violet bob and oversized glasses.'),
 dict(id='dust',name='DUST RELAY',role='producer',skin='#65402f',cloth='#80905e',dark='#1c291d',hair='phones',accessory='#a1ac68',swing=1.1,bio='Loose alternating pad accents, olive hoodie and green headphones.'),
 dict(id='tape',name='TAPE THEORY',role='producer',skin='#a46b46',cloth='#c7994d',dark='#322216',hair='cap-phones',accessory='#9e4236',swing=.95,bio='Steady groove, ochre hoodie, red cap and beard.')]
parts=json.loads((app/'rig-data.js').read_text().split('=',1)[1].rstrip(';\n '))

def head(p,size):
 S=3;w,h=size;im=Image.new('RGBA',(w*S,h*S));d=ImageDraw.Draw(im);sx=w/121;sy=h/169
 def box(b):return tuple(int(v*S*(sx if i%2==0 else sy)) for i,v in enumerate(b))
 def ell(b,fill,outline='#201710',width=2):d.ellipse(box(b),fill,outline,width*S)
 def poly(points,fill,outline='#211710',width=2):d.polygon([(int(x*S*sx),int(y*S*sy))for x,y in points],fill,outline,width*S)
 def line(points,fill='#271b13',width=2):d.line([(int(x*S*sx),int(y*S*sy))for x,y in points],fill,width*S)
 skin=p['skin'];acc=p['accessory'];style=p['hair']
 poly([(45,118),(76,119),(79,165),(48,168),(42,147)],skin)
 poly([(39,128),(51,146),(76,138),(77,123)],'#543424',None)
 if style in ['braids','bob']:
  ell((17,7,108,143),'#211c1b')
 ell((25,62,41,95),skin);ell((87,60,103,92),skin)
 poly([(34,40),(43,25),(74,22),(92,42),(94,91),(83,115),(62,132),(42,120),(30,92)],skin)
 poly([(36,45),(45,33),(52,32),(43,87),(54,113),(67,126),(47,115),(34,91)],'#a77854',None)
 poly([(86,55),(91,90),(80,111),(65,125),(80,117),(96,90),(95,57)],'#5b392a',None)
 if style=='braids':
  for x in [25,33,91,99]:
   for y in range(35,147,11):ell((x-4,y,x+5,y+15),'#2d251f',width=1)
  for x in range(39,87,9):line([(x,29),(x+6,44),(x+8,58)],'#211a14',4)
  ell((23,99,37,121),None,acc,3);ell((88,97,102,119),None,acc,3)
 elif style=='beanie':
  poly([(27,61),(29,29),(39,11),(79,9),(97,26),(99,57)],acc)
  poly([(24,47),(100,45),(101,64),(27,67)],'#996039')
  for x in range(34,95,9):line([(x,18),(x-1,44)],'#6d4228',1)
 elif 'cap' in style:
  poly([(29,54),(31,28),(47,12),(78,13),(96,35),(94,53)],acc)
  poly([(31,47),(86,45),(111,60),(104,68),(57,58),(25,59)],p['dark'])
  line([(67,17),(67,43)],'#ead4a377',1)
 elif style=='bob':
  poly([(26,32),(48,12),(89,24),(96,58),(61,34),(36,63),(27,94)],'#372637')
  for x in [26,31,35,93,98]:line([(x,47),(x-2,111)],'#92709c',1)
 else:
  poly([(35,31),(46,21),(76,24),(91,41),(85,47),(40,42)],'#261e19')
 line([(41,75),(51,72)],width=3);line([(72,72),(83,75)],width=3)
 ell((46,78,51,83),'#1a1512',None);ell((74,78,79,83),'#1a1512',None)
 line([(64,80),(59,97),(67,99)],'#39291f',2)
 line([(50,109),(71,109)],'#3c221f',2)
 if style in ['beanie','cap-phones']:
  poly([(35,95),(48,111),(65,119),(85,98),(81,120),(63,135),(45,124)],'#30221c')
  line([(52,111),(71,111)],'#c29470',1)
 if style=='bob':
  for b in [(35,67,59,89),(68,67,92,89)]:d.rectangle(box(b),fill='#241e2844',outline='#1f191b',width=3*S)
  line([(59,75),(68,75)],'#1f191b',3)
 if style in ['phones','cap-phones','bob']:
  d.arc(box((13,12,110,113)),185,355,fill='#201b19',width=7*S)
  ell((17,57,32,99),acc);ell((91,57,107,99),acc)
  line([(22,64),(23,91)],'#d0b88e',2);line([(98,64),(99,91)],'#d0b88e',2)
 # Fine ink hatching and a small reflected cheek highlight retain the illustrated feel.
 for y in [97,102,107]:line([(82,y),(87,y-3)],'#30251b66',1)
 line([(40,91),(44,99)],'#c9986e',1)
 return im.resize((w,h),Image.Resampling.LANCZOS)

for slug,*_ in venues:
 source=root.parent/'.cache'/('career-'+slug+'.png');dest=app/'venues'/f'{slug}.webp'
 if source.exists():Image.open(source).convert('RGB').resize((1376,768),Image.Resampling.LANCZOS).save(dest,quality=87,method=6)
 elif not dest.exists():raise FileNotFoundError('Restore released venue first: '+str(dest))
old_cast=json.loads((app/'career-world-data.js').read_text().split('=',1)[1].split(';\n',1)[0]) if (app/'career-world-data.js').exists() else {}
painted=json.loads((root/'tools/painted-rappers.json').read_text())['rappers'] if (root/'tools/painted-rappers.json').exists() else []
for p in people:
 p['files']={}
 if p['id'] in painted or old_cast.get(p['id'],{}).get('artStyle')=='comic-fullbody':
  previous=old_cast.get(p['id'],{})
  for field in ['artStyle','rigParts','bones','bio','sampler','wardrobeStyle']:
   if field in previous:p[field]=previous[field]
 for name,m in parts.items():
  if not name.startswith(p['role']+'_'):continue
  painted_dest=app/'cast'/f"{p['id']}-{name}.webp"
  if (p['id'] in painted or old_cast.get(p['id'],{}).get('artStyle')=='comic-fullbody') and painted_dest.exists():
   p['files'][name]=str(painted_dest.relative_to(app));continue
  old=Image.open(app/m['file']).convert('RGBA');alpha=old.getchannel('A')
  if name.endswith('_head'):out=head(p,old.size)
  else:
   exposed='_hand' in name or ('rapper_fore' in name)
   high=p['skin'] if exposed else p['cloth'];dark='#2a1a13' if exposed else p['dark']
   out=ImageOps.colorize(ImageOps.grayscale(old.convert('RGB')),dark,high).convert('RGBA');out.putalpha(alpha)
   if name.endswith('_body'):
    ink=Image.new('RGBA',out.size);d=ImageDraw.Draw(ink)
    if p['role']=='rapper':x,y=int(out.width*.5),int(out.height*.49)
    else:x,y=int(out.width*.42),int(out.height*.34)
    d.arc((x-20,y-26,x+20,y+22),0,180,fill=p['accessory'],width=3);d.ellipse((x-4,y+17,x+4,y+25),fill=p['accessory'])
    ink.putalpha(ImageOps.multiply(ink.getchannel('A'),alpha) if hasattr(ImageOps,'multiply') else __import__('PIL.ImageChops',fromlist=['multiply']).multiply(ink.getchannel('A'),alpha));out=Image.alpha_composite(out,ink)
  dest=app/'cast'/f"{p['id']}-{name}.webp";out.save(dest,quality=92,method=6);p['files'][name]=str(dest.relative_to(app))
lookup={p['name']:p['id']for p in people}
shows=[dict(id=slug,venue=name,rapper=lookup[r],producer=lookup[p],file=f'venues/{slug}.webp')for slug,name,r,p in venues]
(app/'career-world-data.js').write_text('const CAREER_CAST='+json.dumps({p['id']:p for p in people})+';\nconst CAREER_SHOWS='+json.dumps(shows)+';\n')
print('Built six venues and',len(people),'original cast designs with',sum(len(p['files'])for p in people),'articulated sprite variants.')
