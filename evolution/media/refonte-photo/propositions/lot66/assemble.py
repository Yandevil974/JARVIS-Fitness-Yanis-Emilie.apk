"""Rebuild isolated proposal47 from photographed crops; no delivered file writes."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter,ImageFont
import numpy as np
import json
HERE=Path(__file__).resolve().parent
R=HERE.parents[1]
P=HERE/'phases';OLD=R/'propositions/lot65'
def load(p):return Image.open(p).convert('RGB')
def paste(base,detail,box,feather=1):
    im=base.copy();x,y,x2,y2=box
    patch=detail.resize((x2-x,y2-y),Image.Resampling.LANCZOS)
    mask=Image.new('L',patch.size);ImageDraw.Draw(mask).rectangle((3,3,patch.width-3,patch.height-3),fill=255)
    im.paste(patch,(x,y),mask.filter(ImageFilter.GaussianBlur(feather)))
    return im
low_sup=load(OLD/'phases/47-bas-supination-normalise.png')
high_sup=load(OLD/'guides/47-haut-supination.png')
high_pro=paste(high_sup,load(P/'haut-main-gauche-pronation.png'),(155,185,290,300))
high_pro=paste(high_pro,load(P/'haut-main-droite-pronation.png'),(395,185,530,300))
low_detail=paste(load(OLD/'phases/47-bas-pronation-detail.png'),load(P/'bas-main-droite-pronation.png'),(1520,0,2096,512),2)
low_detail.save(P/'bas-deux-mains-pronation.png')
low_pro=paste(low_sup,low_detail,(145,450,555,550))
frames=[low_sup,high_sup,high_pro,low_pro]
labels=['1 - Départ : supination','2 - Montée : supination','3 - Rotation : pronation','4 - Descente : pronation']
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22)
small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',14)
(HERE/'planches').mkdir(exist_ok=True);(HERE/'gif/homme').mkdir(parents=True,exist_ok=True)
full=Image.new('RGB',(2736,808),'white');d=ImageDraw.Draw(full)
for i,f in enumerate(frames):
    assert f.size==(684,768)
    f.save(P/f'47-phase{i+1}.png');full.paste(f,(684*i,40));d.text((684*i+10,8),labels[i],font=font,fill='black')
full.save(HERE/'planches/curl-zottman-assis.png')
scaled=[f.resize((392,440),Image.Resampling.LANCZOS) for f in frames]
gif=HERE/'gif/homme/curl-zottman-assis-homme.gif'
scaled[0].save(gif,save_all=True,append_images=scaled[1:],duration=500,loop=0,disposal=2)
review=Image.new('RGB',(814,984),'white');d=ImageDraw.Draw(review)
d.text((10,5),'N°47 - PROPOSITION NON VALIDÉE',font=small,fill='black')
for i,f in enumerate(scaled):
    x=10+(i%2)*402;y=30+(i//2)*482
    d.text((x,y),labels[i],font=small,fill='black');review.paste(f,(x,y+22))
review.save(R/'review/lot66-proposition-47.jpg',quality=95)
rois=[[116,207,133,250],[126,178,143,205],[126,178,143,205],[116,207,133,250]]
counts=[]
with Image.open(gif) as im:
    for i,roi in enumerate(rois):
        im.seek(i);x,y,x2,y2=roi;ar=np.asarray(im.convert('RGB'),dtype=int)[y:y2,x:x2]
        r,g,b=ar[:,:,0],ar[:,:,1],ar[:,:,2]
        counts.append(int(((g>120)&(g>r+15)&(g>b+60)).sum()))
(HERE/'mesures.json').write_text(json.dumps({'numero':47,'size':[392,440],'frames':4,'duration_ms':500,'recalage':[0,0],'roi_avant_bras_par_phase':rois,'strict_lime':counts,'validation_utilisateur':False},indent=2))
print('ROI',counts)
