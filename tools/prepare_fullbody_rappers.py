"""Build individual comic-book cutout rigs. Optional --sources DIRECTORY imports green-matte originals.
Without --sources rebuilds from durable transparent artwork/comic-rappers masters.
Requires Pillow, numpy, scipy. Select --config tools/fullbody-producers.json --masters artwork/comic-producers to build producers. Never modifies original Quick Play art.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import argparse,json
import numpy as np
from scipy.ndimage import distance_transform_edt
root=Path(__file__).resolve().parents[1];app=root/'app'

text=(app/'career-world-data.js').read_text();cast=json.loads(text.split('=',1)[1].split(';\n',1)[0])
args=argparse.ArgumentParser();args.add_argument('--sources',type=Path);args.add_argument('--config',default='tools/fullbody-rappers.json');args.add_argument('--masters',default='artwork/comic-rappers');args=args.parse_args()
config=json.loads((root/args.config).read_text())
masters=root/args.masters;masters.mkdir(parents=True,exist_ok=True)
parents={'Root':None,'Legs':'Root','Torso':'Root','Head':'Torso','UpperA':'Torso','ForeA':'UpperA','HandA':'ForeA','UpperB':'Torso','ForeB':'UpperB','HandB':'ForeB'}
parts={'legs':('Legs',0),'body':('Torso',1),'head':('Head',3),'upperA':('UpperA',4),'foreA':('ForeA',5),'handA':('HandA',6),'upperB':('UpperB',2),'foreB':('ForeB',4),'handB':('HandB',5)}
for key,cfg in config.items():
 master=masters/f'{key}.webp'
 if args.sources:
  im=Image.open(args.sources/cfg['source']).convert('RGBA');a=np.array(im).astype(np.int16)
  bias=a[:,:,1]-np.maximum(a[:,:,0],a[:,:,2]);alpha=np.clip(255-np.maximum(0,bias-45)*2,0,255)
  a[:,:,3]=alpha;a[:,:,1]=np.where(alpha<250,np.minimum(a[:,:,1],np.maximum(a[:,:,0],a[:,:,2])+20),a[:,:,1])
  im=Image.fromarray(a.astype(np.uint8),'RGBA');im.thumbnail((900,900) if cast[key]['role']=='producer' else (1000,1000));im.save(master,quality=91 if cast[key]['role']=='producer' else 94,method=6)
 # Always segment the decoded durable master, so a clean rebuild has identical results.
 im=Image.open(master).convert('RGBA');rgba=np.array(im);alpha=rgba[:,:,3];w,h=im.size;sw,sh=cfg['size'];sx,sy=w/sw,h/sh
 regions={}
 for name,poly in cfg['regions'].items():
  mask=Image.new('L',(w,h));ImageDraw.Draw(mask).polygon([(round(x*sx),round(y*sy)) for x,y in poly],fill=255);regions[name]=np.array(mask)>0
 if cfg.get('exclusive'):
  owner=np.full((h,w),-1,dtype=np.int8);order=['legs','upperB','foreB','handB','upperA','foreA','handA','head']
  for index,name in enumerate(order):owner[regions[name]]=index
  regions={name:owner==index for index,name in enumerate(order)}
 regions['body']=~np.logical_or.reduce(list(regions.values()))
 scale=cfg['scale'];ox,oy=cfg['offset'];worldscale=scale/sx
 person=cast[key];role=person['role'];person['rigParts']={};person['bones']={};person['bio']=cfg['bio'];person['artStyle']='comic-fullbody';person['wardrobeStyle']=cfg.get('wardrobeStyle','original-comic')
 for suffix,pivot in cfg['joints'].items():
  person['bones'][role+suffix]={'pivot':[round(ox+pivot[0]*scale,2),round(oy+pivot[1]*scale,2)],'parent':(role+parents[suffix]) if parents[suffix] else None}
 for name,(bone,z) in parts.items():
  core=regions[name]&(alpha>10)
  if not core.any():raise ValueError(f'Empty part {key}/{name}')
  distance,indices=distance_transform_edt(~core,return_indices=True)
  support=(distance<=6)&(alpha>0)
  if cfg.get('jointOnlyOverlap'):
   yy,xx=np.ogrid[:h,:w];jointmask=regions[name].copy()
   for joint,point in cfg['joints'].items():
    if joint==bone or parents.get(joint)==bone:
     px,py=point[0]*sx,point[1]*sy;jointmask|=(xx-px)**2+(yy-py)**2<=(32*sx)**2
   support&=jointmask
  out=rgba.copy();outside=support&~core;out[outside,:3]=rgba[indices[0][outside],indices[1][outside],:3];out[:,:,3]=np.where(support,alpha,0)
  part=Image.fromarray(out,'RGBA');box=part.getbbox();part=part.crop(box)
  destsize=(max(1,round(part.width*worldscale)),max(1,round(part.height*worldscale)));part=part.resize(destsize,Image.Resampling.LANCZOS)
  pname=role+'_'+name;dest=app/person['files'][pname];part.save(dest,quality=94,method=6)
  person['rigParts'][pname]={'file':person['files'][pname],'x':ox+round(box[0]*worldscale),'y':oy+round(box[1]*worldscale),'w':part.width,'h':part.height}
  person['bones'][role+bone].update(part=pname,z=(8 if role=='producer' and name.startswith('hand') else z))
 if role=='producer':person['sampler']={'file':'cast/comic-sampler.webp','x':90,'y':320,'w':360,'h':430}
 print(key, 'master',im.size,'parts',len(person['rigParts']),'independent joints',len(person['bones']))
(app/'career-world-data.js').write_text('const CAREER_CAST='+json.dumps(cast)+';\nconst CAREER_SHOWS='+text.split('const CAREER_SHOWS=',1)[1])
