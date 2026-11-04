"""Bake the provided start prompt into the title artwork without a black UI panel.
Usage: python tools/compose_title.py ORIGINAL_TITLE.png PROMPT.png OUTPUT.png
Requires Pillow. The original title must be the supplied 1672x940 poster (or same ratio).
"""
from PIL import Image, ImageOps, ImageFilter
import sys
source,prompt,output=sys.argv[1:]
base=Image.open(source).convert('RGBA')
text=Image.open(prompt).convert('RGB')
alpha=ImageOps.grayscale(text)
box=alpha.point(lambda p:255 if p>24 else 0).getbbox()
alpha=alpha.crop(box)
width=round(base.width*.465)
alpha=alpha.resize((width,round(alpha.height*width/alpha.width)),Image.Resampling.LANCZOS)
x=(base.width-alpha.width)//2
y=round(base.height*.795)
shadow=Image.new('RGBA',base.size)
shadow_alpha=Image.new('L',base.size)
shadow_alpha.paste(alpha,(x+1,y+2))
shadow_alpha=shadow_alpha.filter(ImageFilter.GaussianBlur(2.2))
shadow.putalpha(shadow_alpha)
base=Image.alpha_composite(base,shadow)
letters=Image.new('RGBA',alpha.size,'white');letters.putalpha(alpha)
base.alpha_composite(letters,(x,y))
base.convert('RGB').save(output,optimize=True)
print('Baked prompt at',x,y,'size',alpha.size,'into',output)
