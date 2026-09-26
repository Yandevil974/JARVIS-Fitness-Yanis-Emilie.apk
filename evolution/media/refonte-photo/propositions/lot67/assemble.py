"""Rebuild isolated proposal80; no delivered media writes."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np
import json
H=Path(__file__).resolve().parent;R=H.parents[1]
frames=[Image.open(H/'phases'/p).convert('RGB') for p in ['ecartes-debut-bras-ouverts.png','ecartes-fin-extension.png']]
assert frames[0].size==frames[1].size==(1376,768)
(H/'planches').mkdir(exist_ok=True);(H/'gif/homme').mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',24)
full=Image.new('RGB',(2752,810),'white');d=ImageDraw.Draw(full)
for i,f in enumerate(frames):full.paste(f,(1376*i,42));d.text((1376*i+12,8),'DÉBUT' if i==0 else 'FIN',font=font,fill='black')
full.save(H/'planches/ecartes-halteres.png')
scaled=[f.resize((788,440),Image.Resampling.LANCZOS) for f in frames]
g=H/'gif/homme/ecartes-halteres-homme.gif';scaled[0].save(g,save_all=True,append_images=scaled[1:],duration=500,loop=0,disposal=2)
r=Image.new('RGB',(1606,482),'white');d=ImageDraw.Draw(r);d.text((10,7),'N°80 - Banc incliné - PROPOSITION NON VALIDÉE',font=font,fill='black')
for i,f in enumerate(scaled):r.paste(f,(10+798*i,42))
r.save(R/'review/lot67-proposition-80.jpg',quality=95)
counts=[]
with Image.open(g) as im:
 for i in range(im.n_frames):
  im.seek(i);a=np.asarray(im.convert('RGB'),dtype=int)[145:160,370:435];red,green,blue=a[:,:,0],a[:,:,1],a[:,:,2];counts.append(int(((green>120)&(green>red+15)&(green>blue+60)).sum()))
(H/'mesures.json').write_text(json.dumps({'numero':80,'size':[788,440],'frames':2,'duration_ms':500,'recalage':[0,0],'roi_pectoraux':[370,145,435,160],'strict_lime':counts,'validation_utilisateur':False},indent=2))
print(counts)
