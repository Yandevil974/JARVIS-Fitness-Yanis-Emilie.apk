"""Build isolated proposal46. No writes to delivered media. No mirroring."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter,ImageFont
import numpy as np
import cv2
import json
HERE=Path(__file__).resolve().parent
R=HERE.parents[1]
P=HERE/'phases';G=HERE/'guides'
def load(p):return Image.open(p).convert('RGB')
def patch(base,detail,box):
    out=load(base);x,y,x2,y2=box
    im=load(detail).resize((x2-x,y2-y),Image.Resampling.LANCZOS)
    if y==350:
        # Inpaint old end-on discs before adding the new hand/weight foreground.
        arr=np.asarray(out).copy();erase=np.zeros(arr.shape[:2],dtype=np.uint8)
        cv2.ellipse(erase,(239,444),(36,35),0,0,360,255,-1)
        cv2.ellipse(erase,(450,444),(36,35),0,0,360,255,-1)
        out=Image.fromarray(cv2.inpaint(arr,erase,3,cv2.INPAINT_TELEA))
        for left,dx in [(0,-12),(170,12)]:
            part=im.crop((left,0,left+170,140));m=Image.new('L',part.size);d=ImageDraw.Draw(m)
            if left==0:
                d.ellipse((25,51,55,116),fill=255);d.ellipse((94,51,126,116),fill=255)
                d.rectangle((5,75,145,89),fill=255)
                d.polygon([(53,62),(67,49),(91,49),(97,66),(97,100),(54,100)],fill=255)
            else:
                d.ellipse((50,51,82,116),fill=255);d.ellipse((117,51,149,116),fill=255)
                d.rectangle((25,75,168,89),fill=255)
                d.polygon([(76,63),(80,49),(115,49),(120,66),(117,100),(76,100)],fill=255)
            out.paste(part,(x+left+dx,y),m.filter(ImageFilter.GaussianBlur(1)))
    else:
        m=Image.new('L',im.size);d=ImageDraw.Draw(m)
        d.rectangle((0,0,150,112),fill=255);d.rectangle((265,0,410,112),fill=255)
        out.paste(im,(x,y),m.filter(ImageFilter.GaussianBlur(1)))
    return out
frames=[patch(G/'46-bas-source.png',P/'46-bas-supination-detail.png',(175,350,515,490)),
        load(G/'46-haut-supination.png'),
        patch(G/'46-haut-supination.png',P/'46-haut-pronation-detail.png',(140,160,550,285)),
        patch(G/'46-bas-source.png',P/'46-bas-pronation-detail.png',(175,350,515,490))]
labels=['1 - Départ : supination','2 - Montée : supination','3 - Rotation : pronation','4 - Descente : pronation']
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22)
small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',14)
(HERE/'planches').mkdir(exist_ok=True);(HERE/'gif/homme').mkdir(parents=True,exist_ok=True)
full=Image.new('RGB',(2736,808),'white');d=ImageDraw.Draw(full)
for i,f in enumerate(frames):
    f.save(P/f'46-phase{i+1}.png');full.paste(f,(684*i,40));d.text((684*i+10,8),labels[i],font=font,fill='black')
full.save(HERE/'planches/curl-zottman.png')
scaled=[f.resize((392,440),Image.Resampling.LANCZOS) for f in frames]
gif=HERE/'gif/homme/curl-zottman-homme.gif'
scaled[0].save(gif,save_all=True,append_images=scaled[1:],duration=500,loop=0,disposal=2)
review=Image.new('RGB',(814,984),'white');d=ImageDraw.Draw(review)
d.text((10,5),'N°46 - PROPOSITION NON VALIDÉE',font=small,fill='black')
for i,f in enumerate(scaled):
    x=10+(i%2)*402;y=30+(i//2)*482
    d.text((x,y),labels[i],font=small,fill='black');review.paste(f,(x,y+22))
review.save(R/'review/lot65-proposition-46.jpg',quality=95)
rois=[[137,145,150,175],[149,145,159,160],[149,145,159,160],[137,145,150,175]]
counts=[]
with Image.open(gif) as im:
    for i,roi in enumerate(rois):
        im.seek(i);x,y,x2,y2=roi;ar=np.asarray(im.convert('RGB'),dtype=int)[y:y2,x:x2]
        r,g,b=ar[:,:,0],ar[:,:,1],ar[:,:,2]
        counts.append(int(((g>120)&(g>r+15)&(g>b+60)).sum()))
(HERE/'mesures.json').write_text(json.dumps({'numero':46,'size':[392,440],'frames':4,'duration_ms':500,'recalage':[0,0],'roi_biceps_par_phase':rois,'strict_lime':counts,'validation_utilisateur':False},indent=2))
print('ROI',counts)
