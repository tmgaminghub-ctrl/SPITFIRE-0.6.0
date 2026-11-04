"""Preserve the supplied poster; extract its lettering and highlight for interactive rows."""
from PIL import Image,ImageFilter
import cv2,numpy as np
from pathlib import Path
root=Path(__file__).resolve().parents[1];app=root/'app'
im=Image.open(root.parent/'uploads/generated-image (8).png').convert('RGB');rgb=np.array(im);mask=np.zeros(rgb.shape[:2],np.uint8)
rows=[('career',(713,400,970,459)),('quick',(660,464,1020,535)),('multiplayer',(666,541,1016,602)),('training',(690,603,990,666)),('leaderboards',(649,666,1030,730)),('options',(715,731,970,790))]
out=app/'menu-labels';out.mkdir(exist_ok=True)
for p in [app/'main-menu.webp',app/'menu-highlight.webp']:
 if p.is_symlink():p.unlink()
# Every label uses the same 480x65 coordinate space; its original distress is retained.
for index,(name,(x0,y0,x1,y1)) in enumerate(rows):
 region=rgb[y0:y1,x0:x1].astype(float);r,g,b=region[:,:,0],region[:,:,1],region[:,:,2]
 if name in ['quick','multiplayer']:v=np.maximum(0,np.minimum(np.minimum(r,g),b)-13)*3.2
 else:v=np.maximum(0,r-np.maximum(g,b)-12)*3
 a=np.uint8(np.clip(v,0,255));textmask=np.zeros(rgb.shape[:2],np.uint8);textmask[y0:y1,x0:x1]=a
 # Keep the shared row box stable rather than independently re-centering words.
 canvas=Image.new('RGBA',(480,65));glyph=Image.new('RGBA',(x1-x0,y1-y0),'white');glyph.putalpha(Image.fromarray(a));canvas.paste(glyph,(x0-600,y0-(399+index*65)))
 canvas.save(out/(name+'.webp'),lossless=True,method=6)
 mask=np.maximum(mask,np.uint8(textmask>0)*255)
# Reuse the actual rough white frame; erase its baked-in Quick Play letters.
x0,y0,x1,y1=600,451,1080,545
reg=rgb[y0:y1,x0:x1].astype(float);r,g,b=reg[:,:,0],reg[:,:,1],reg[:,:,2]
a=np.uint8(np.clip((np.minimum(np.minimum(r,g),b)-28)*2.2,0,255));a[(r-g>28)|(r-b>38)]=0
# The inner opening must stay empty: no baked-in Quick Play ghost on other modes.
a[14:82,54:430]=0
frame=Image.new('RGBA',(480,94),'#deddd4');frame.putalpha(Image.fromarray(a));frame.save(app/'menu-highlight.webp',lossless=True,method=6)
# Remove the original bright border as well as all original labels from the plate.
reg=rgb[451:545,600:1080].astype(float);neutral=(np.min(reg,axis=2)>45)&((np.max(reg,axis=2)-np.min(reg,axis=2))<40)
mask[451:545,600:1080]=np.maximum(mask[451:545,600:1080],np.uint8(neutral)*255)
mask=cv2.dilate(mask,np.ones((5,5),np.uint8));clean=cv2.inpaint(rgb,mask,5,cv2.INPAINT_TELEA)
# Break cache links before writing, leaving the previous release's cached artwork intact.
for p in [app/'main-menu.webp',app/'menu-highlight.webp']:
 if p.is_symlink():p.unlink()
Image.fromarray(clean).save(app/'main-menu.webp',quality=95,method=6)
# Frame was written before unlinking its prior cache link; save the new actual file now.
frame.save(app/'menu-highlight.webp',lossless=True,method=6)
print('Interactive poster plate, six original lettering masks and selected-frame extracted.')
