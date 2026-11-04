"""Import the two user-supplied sprite sheets with their existing transparent alpha.
No external downloads or generated replacement imagery. Pillow is required.
"""
from PIL import Image
from pathlib import Path
import json,re,sys
root=Path(__file__).resolve().parents[1];app=root/'app';uploads=root.parent/'uploads';out=app/'smoke';out.mkdir(exist_ok=True)
specs={
 'plume':{'source':'Mobile - Hello Kitty and Friends Happiness Parade - Effects - Colored Smoke Effect.png','columns':8,'rows':8,'sourceCell':256,'frames':64,'duration':4},
 'puff':{'source':'PC _ Computer - Showdown Bandit - Miscellaneous - Smoke Particles.png','columns':5,'rows':5,'sourceCell':422,'frames':25,'duration':4}
}
for name,s in specs.items():
 im=Image.open(uploads/s['source']).convert('RGBA');cell=192
 atlas=Image.new('RGBA',(cell*s['columns'],cell*s['rows']))
 for i in range(s['frames']):
  x=(i%s['columns'])*s['sourceCell'];y=(i//s['columns'])*s['sourceCell']
  frame=im.crop((x,y,x+s['sourceCell'],y+s['sourceCell'])).resize((cell,cell),Image.Resampling.LANCZOS)
  atlas.paste(frame,((i%s['columns'])*cell,(i//s['columns'])*cell))
 atlas.save(out/(name+'.webp'),quality=94,method=6,exact=True)
 s['cell']=cell;s['file']='smoke/'+name+'.webp'
p=app/'title-rig-data.js';text=p.read_text();parts=json.loads(re.search(r'const TITLE_RIG_PARTS=(\{.*\});',text).group(1))
parts.update({
 'smokeLeft':{'x':365,'y':-15,'w':220,'h':240,'file':'smoke/plume.webp','animation':'plume','phase':0},
 'smokeRight':{'x':1015,'y':-15,'w':220,'h':240,'file':'smoke/plume.webp','animation':'plume','phase':1.35,'flip':True},
 'hazeLeft':{'x':78,'y':515,'w':300,'h':290,'file':'smoke/puff.webp','animation':'puff','phase':.65},
 'hazeRight':{'x':1222,'y':515,'w':300,'h':290,'file':'smoke/puff.webp','animation':'puff','phase':2.1,'flip':True}
})
atlases={n:{k:v for k,v in s.items() if k in ['columns','frames','duration','cell','file']} for n,s in specs.items()}
p.write_text('const TITLE_WIDTH=1600,TITLE_HEIGHT=900;\nconst TITLE_RIG_PARTS='+json.dumps(parts,separators=(',',':'))+';\nconst TITLE_SMOKE_ATLASES='+json.dumps(atlases,separators=(',',':'))+';\n')
for n in ['smokeLeft','smokeRight','hazeLeft','hazeRight']:
 (app/'title-rig'/(n+'.webp')).unlink(missing_ok=True)
(out/'sources.json').write_text(json.dumps({'assets':specs,'rights':'Third-party game assets supplied by the user. Source-page availability is not a reuse licence. Rights not verified.'},indent=2)+'\n')
print('Imported 64 plume frames and 25 puff frames; alpha preserved; 192px cells.')
