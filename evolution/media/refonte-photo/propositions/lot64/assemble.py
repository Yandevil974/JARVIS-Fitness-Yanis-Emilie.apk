"""Rebuild isolated lot64 candidates only; never touches delivered media."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import numpy as np
R = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
P = HERE / 'phases'

def load(path):
    return Image.open(path).convert('RGB')

def compose(base, patch, box):
    im = load(base)
    x,y,x2,y2 = box
    patch = patch.resize((x2-x,y2-y),Image.Resampling.LANCZOS)
    mask = Image.new('L',patch.size)
    ImageDraw.Draw(mask).rectangle((7,7,patch.width-7,patch.height-7),fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(3))
    im.paste(patch,(x,y),mask)
    return im

low = R/'propositions/lot62/phases/scott-debut.png'
high = R/'propositions/lot63/phases/scott-fin.png'
a = load(R/'propositions/lot63/phases/scott-debut-compose.png')
b = compose(high,load(P/'scott-main-haute-cadre.png'),(140,285,465,560))
b.save(P/'scott-fin-compose.png')
# Remove unwanted weight numerals using same-position clean disc texture from
# the pronated close-up. No rotation/mirroring; hand and grip are untouched.
lo_sup = load(P/'zottman-bas-supination-rond.png')
lo_pro = load(P/'zottman-bas-pronation-rond.png').resize(lo_sup.size)
assert lo_sup.size == (1024,1056)
mask = Image.new('L',lo_sup.size)
draw = ImageDraw.Draw(mask)
draw.ellipse((120,645,225,840),fill=255)
draw.ellipse((800,540,925,745),fill=255)
lo_sup.paste(lo_pro,(0,0),mask.filter(ImageFilter.GaussianBlur(8)))
lo_sup.save(P/'zottman-bas-supination-sans-chiffres.png')
# Keep original background: the last generation corrected hand skin but also
# recolored the shoulder. Composite only its hand/forearm polygon.
hi_pro = load(P/'zottman-haut-pronation.png')
hi_skin = load(P/'zottman-haut-pronation-peau.png').resize(hi_pro.size)
hand_mask = Image.new('L',hi_pro.size)
ImageDraw.Draw(hand_mask).polygon([(420,340),(480,290),(550,275),(600,298),
    (660,300),(750,390),(780,505),(733,700),(680,800),(660,944),
    (435,944),(430,820),(330,685),(316,520),(332,423),(400,356)],fill=255)
hi_pro.paste(hi_skin,(0,0),hand_mask.filter(ImageFilter.GaussianBlur(3)))
hi_pro.save(P/'zottman-haut-pronation-retouche-locale.png')
z = [compose(low,lo_sup,(145,855,465,1185)),load(high),
     compose(high,hi_pro,(140,285,465,560)),
     compose(low,lo_pro,(145,855,465,1185))]
for i,im in enumerate(z,1): im.save(P/f'zottman-phase{i}.png')
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22)
small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',13)
labels = ['1 - Départ : supination','2 - Montée : supination','3 - Rotation : pronation','4 - Descente : pronation']
sets = [(44,'curl-scott-haltere-neutre',[a,b]),
        (45,'curl-scott-haltere-prise-neutre',[a,b]),
        (48,'curl-zottman-un-bras-banc-scott',z)]
(HERE/'gif/homme').mkdir(parents=True,exist_ok=True)
(HERE/'planches').mkdir(exist_ok=True)
metrics=[]
for number,slug,frames in sets:
    full=Image.new('RGB',(800*len(frames),1374),'white')
    dr=ImageDraw.Draw(full)
    for i,im in enumerate(frames):
        full.paste(im,(i*800,40))
        dr.text((i*800+14,8),labels[i] if number==48 else ('DÉBUT' if i==0 else 'FIN'),font=font,fill='black')
    full.save(HERE/'planches'/f'{slug}.png')
    scaled=[im.resize((264,440),Image.Resampling.LANCZOS) for im in frames]
    gif=HERE/'gif/homme'/f'{slug}-homme.gif'
    scaled[0].save(gif,save_all=True,append_images=scaled[1:],duration=500,loop=0,disposal=2)
    review=Image.new('RGB',(558,490 if number!=48 else 974),'white');dr=ImageDraw.Draw(review)
    dr.text((10,5),f'N°{number} - PROPOSITION NON VALIDÉE',font=small,fill='black')
    for i,im in enumerate(scaled):
        x=10+(i%2)*274;y=30+(i//2)*484
        dr.text((x,y),labels[i] if number==48 else ('DÉBUT' if i==0 else 'FIN'),font=small,fill='black')
        review.paste(im,(x,y+20))
    review.save(R/'review'/f'lot64-proposition-{number}.jpg',quality=95)
    counts=[]
    with Image.open(gif) as g:
        for i in range(g.n_frames):
            g.seek(i);ar=np.asarray(g.convert('RGB'),dtype=int)[165:215,67:82]
            r,gr,bl=ar[:,:,0],ar[:,:,1],ar[:,:,2]
            counts.append(int(((gr>120)&(gr>r+15)&(gr>bl+60)).sum()))
    metrics.append({'numero':number,'size':[264,440],'frames':len(frames),'duree_ms':500,
                    'recalage':[0,0],'roi_biceps':[67,165,82,215],'strict_lime':counts,'validation_utilisateur':False})
(HERE/'mesures.json').write_text(json.dumps(metrics,indent=2))
print(json.dumps(metrics,indent=2))
