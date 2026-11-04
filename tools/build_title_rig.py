"""Build a two-hand title cutout rig while protecting the original logo/text.
Usage: python tools/build_title_rig.py ORIGINAL_REFERENCE.png CLEAN_PLATE.png
Requires Pillow. Generated clean plate is used only beneath the hand silhouettes.
"""
from PIL import Image,ImageDraw,ImageFilter,ImageChops
from pathlib import Path
import sys,json
root=Path(__file__).resolve().parents[1]
original=Image.open(sys.argv[1]).convert('RGBA')
clean=Image.open(sys.argv[2]).convert('RGBA').resize(original.size,Image.Resampling.LANCZOS)
out=root/'app/title-rig';out.mkdir(exist_ok=True)
shapes={
 'leftForearm':[[(141,637),(187,620),(266,634),(304,689),(313,738),(311,790),(322,840),(162,840),(136,811),(109,780),(111,734),(118,686)]],
 'leftHand':[[(259,371),(279,373),(303,383),(329,396),(354,411),(363,431),(378,437),(386,456),(385,481),(398,512),(397,552),(386,587),(375,619),(358,653),(338,686),(311,715),(278,737),(242,746),(199,744),(166,733),(138,709),(120,679),(114,647),(115,622),(126,604),(133,580),(127,554),(129,521),(138,488),(146,462),(157,440),(176,421),(194,405),(218,396),(234,379)]],
 'microphone':[[(292,211),(311,211),(335,217),(359,233),(375,253),(383,277),(384,313),(381,347),(381,367),(367,395),(346,405),(320,392),(295,382),(268,377),(246,392),(231,370),(227,342),(227,310),(228,277),(238,252),(255,233),(275,220)],[(292,558),(319,557),(319,610),(309,647),(289,639)]],
 'micCable':[[(310,609),(325,616),(333,648),(343,680),(352,709),(369,752),(389,792),(410,832),(392,840),(371,805),(351,767),(333,721),(322,683),(314,651)]],
 'rightForearm':[[(1310,626),(1387,617),(1476,633),(1520,663),(1557,707),(1578,750),(1588,786),(1558,813),(1517,840),(1305,840),(1288,805),(1284,755),(1291,698)]],
 'rightHand':[[(1435,275),(1452,267),(1469,268),(1488,279),(1501,292),(1502,310),(1495,333),(1480,359),(1468,384),(1451,408),(1440,430),(1478,403),(1516,372),(1544,350),(1568,342),(1588,343),(1604,357),(1610,372),(1607,386),(1598,401),(1581,418),(1559,436),(1533,458),(1508,479),(1490,494),(1498,515),(1506,536),(1504,558),(1510,581),(1507,603),(1496,625),(1478,648),(1478,670),(1469,694),(1451,719),(1423,734),(1395,740),(1367,735),(1341,725),(1319,708),(1303,689),(1290,660),(1281,628),(1278,596),(1278,567),(1279,532),(1288,504),(1305,484),(1329,473),(1341,454),(1353,438),(1369,417),(1382,392),(1394,366),(1408,338),(1419,311)]]
}
manifest={};union=Image.new('L',original.size)
for name,polys in shapes.items():
 mask=Image.new('L',original.size);d=ImageDraw.Draw(mask)
 for p in polys:d.polygon(p,fill=255)
 mask=mask.filter(ImageFilter.GaussianBlur(.5));union=ImageChops.lighter(union,mask)
 box=mask.getbbox();sprite=original.copy();sprite.putalpha(mask);sprite=sprite.crop(box);sprite.save(out/(name+'.webp'),lossless=True,method=6)
 manifest[name]={'x':box[0],'y':box[1],'file':'title-rig/'+name+'.webp'}
# Patch a small safety margin beneath rotating pieces; never touch the central design.
patch=union.filter(ImageFilter.MaxFilter(29)).filter(ImageFilter.GaussianBlur(2))
protect=Image.new('L',original.size,255);d=ImageDraw.Draw(protect);d.rectangle((430,0,1260,940),fill=0)
patch=ImageChops.multiply(patch,protect)
plate=Image.composite(clean,original,patch)
plate.save(root/'app/title-screen.webp',lossless=True,method=6)
(out/'parts.json').write_text(json.dumps(manifest,indent=2))
(root/'app/title-rig-data.js').write_text('const TITLE_RIG_PARTS='+json.dumps(manifest)+';\n')
# The central logo, prompt and copyright area must remain pixel-identical.
assert ImageChops.difference(plate.crop((430,0,1260,940)),original.crop((430,0,1260,940))).getbbox() is None
print('Built',len(manifest),'title pieces; central logo and text verified unchanged.')
