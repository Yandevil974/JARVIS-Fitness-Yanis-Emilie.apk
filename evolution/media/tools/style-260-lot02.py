#!/usr/bin/env python3
"""Lot02 : textures locales 44/45,48,80, sans intégration automatique.
Les images générées sont recopiées uniquement dans le vert préexistant, trous internes
comblés. Chaque GIF décodé est comparé à l'original : HORS MASQUE = 0 pixel modifié.
La palette existante est conservée hors masque ; les nouvelles nuances occupent
uniquement des indices inutilisés hors masque. Pas de rotation ni recalage global.
"""
from collections import deque
import colorsys,hashlib,json,pathlib
import numpy as np
from PIL import Image,ImageDraw,ImageFont
ROOT=pathlib.Path(__file__).resolve().parents[3];R=ROOT/'evolution/media/refonte-photo';OUT=R/'style-260/lot02'
BOX={'44-2':[50,121,132,244],'48-1':[48,120,139,262],'48-2':[46,146,140,274],'80-1':[192,196,376,308],'80-2':[210,215,358,308]}
IDENT={44:'curl-scott-haltere-neutre',45:'curl-scott-haltere-prise-neutre',48:'curl-zottman-un-bras-banc-scott',80:'ecartes-halteres'}
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def F(n):return ImageFont.truetype(FONT,n)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def fillholes(mask):
 h,w=mask.shape;seen=np.zeros_like(mask);q=deque()
 for y,x in [(0,x) for x in range(w)]+[(h-1,x) for x in range(w)]+[(y,0) for y in range(h)]+[(y,w-1) for y in range(h)]:
  if not mask[y,x] and not seen[y,x]:seen[y,x]=True;q.append((y,x))
 while q:
  y,x=q.popleft()
  for yy,xx in [(y-1,x),(y+1,x),(y,x-1),(y,x+1)]:
   if 0<=yy<h and 0<=xx<w and not mask[yy,xx] and not seen[yy,xx]:seen[yy,xx]=True;q.append((yy,xx))
 return ~seen

def frames(path):
 im=Image.open(path);fs=[];dur=[]
 for i in range(im.n_frames):
  im.seek(i);fs.append(im.convert('RGB'));dur.append(im.info['duration'])
 return fs,dur

def compose(n,i,before):
 a=np.array(before);mask=np.zeros(a.shape[:2],bool)
 if n==44 and i==0:
  out=np.array(Image.open(R/'style-260/lot01/44-phase1-texture-proposition.png').convert('RGB'))
  mask=np.any(out!=a,axis=2)
  return Image.fromarray(out),mask
 key=f'{n}-{i+1}'
 if n==48:key='48-1' if i in (0,3) else '48-2'
 x0,y0,x1,y1=BOX[key];crop=a[y0:y1,x0:x1].astype(float)
 r,g,b=crop[:,:,0],crop[:,:,1],crop[:,:,2]
 # Bleu-vert du débord sur le coussin inclus pour 48, à supprimer localement.
 m=(g>r*1.10)&(g>b*(1.03 if n==48 else 1.25))&(g>35)&((g-r)>10)
 m=fillholes(m);mask[y0:y1,x0:x1]=m
 gen=Image.open(OUT/f'{key}-texture.png').convert('RGB').resize((x1-x0,y1-y0),Image.Resampling.LANCZOS)
 ga=np.array(gen).astype(float);gm=(ga[:,:,1]>ga[:,:,0]*1.02)&(ga[:,:,1]>ga[:,:,2]*1.12)
 hsv=np.array(gen.convert('HSV'));h=colorsys.rgb_to_hsv(117/255,189/255,18/255)[0]
 hsv[:,:,0][gm]=round(h*255);hsv[:,:,1][gm]=np.clip(hsv[:,:,1][gm].astype(float)*1.12,0,255).astype(np.uint8)
 ga=np.array(Image.fromarray(hsv,'HSV').convert('RGB'));out=a.copy();out[y0:y1,x0:x1][m]=ga[m]
 assert np.array_equal(out[~mask],a[~mask])
 return Image.fromarray(out),mask

def palette_only_inside(before,after,mask):
 a=np.array(before);indexed=before.quantize(colors=256,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
 assert np.array_equal(np.array(indexed.convert('RGB')),a)
 idx=np.array(indexed);raw=indexed.getpalette();pal=np.array(raw+[0]*(768-len(raw)),dtype=np.uint8).reshape(256,3)
 used=set(np.unique(idx[~mask]).tolist());free=[i for i in range(256) if i not in used]
 if free:
  pixels=np.array(after)[mask].reshape(1,-1,3)
  colors=Image.fromarray(pixels).quantize(colors=len(free),method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
  raw=colors.getpalette();cps=np.array(raw+[0]*(768-len(raw)),dtype=np.uint8).reshape(-1,3)
  for j,i in enumerate(free):pal[i]=cps[j]
 palette=Image.new('P',(1,1));palette.putpalette(pal.flatten().tolist())
 # Dithering uniquement utilisé pour les pixels du muscle ; indices du reste inchangés.
 quant=after.quantize(palette=palette,dither=Image.Dither.FLOYDSTEINBERG)
 idx[mask]=np.array(quant)[mask]
 result=Image.fromarray(idx);result.putpalette(pal.flatten().tolist())
 assert np.array_equal(np.array(result.convert('RGB'))[~mask],a[~mask])
 return result,len(free)

reports=[];pages=[]
for n in [44,48,80]:
 src=R/'gif/homme'/f'{IDENT[n]}-homme.gif';fs,dur=frames(src);new=[];masks=[];stats=[]
 for i,before in enumerate(fs):
  after,mask=compose(n,i,before);after.save(OUT/f'{n}-phase{i+1}-local.png')
  Image.fromarray(mask.astype('uint8')*255).save(OUT/f'{n}-phase{i+1}-masque.png')
  indexed,free=palette_only_inside(before,after,mask);new.append(indexed);masks.append(mask)
  diff=np.array(indexed.convert('RGB')).astype(float)-np.array(after).astype(float)
  stats.append({'phase':i+1,'pixels_masque':int(mask.sum()),'nouveaux_indices_palette':free,'pixels_modifies_hors_masque':0,'erreur_moyenne_rgb_dans_masque_apres_palette':round(float(np.abs(diff)[mask].mean()),3)})
 gif=OUT/f'{n}-style-proposition.gif';new[0].save(gif,save_all=True,append_images=new[1:],duration=dur,loop=0,disposal=2,optimize=False)
 decoded,dur2=frames(gif);assert dur==dur2 and len(fs)==len(decoded)
 for before,after,mask in zip(fs,decoded,masks):assert np.array_equal(np.array(before)[~mask],np.array(after)[~mask])
 reports.append({'numero':n,'source_sha256':sha(src),'proposition_sha256':sha(gif),'frames':len(fs),'taille':list(fs[0].size),'durees_ms':dur,'statut':('a_reprendre_raccord_coussin' if n==48 else 'proposition_style_a_controler'),'integre':False,'phases':stats})
 # Deux phases par page, toutes les phases représentées (4 pour 48).
 for start in range(0,len(fs),2):
  page=Image.new('RGB',(1700,1280),'white');d=ImageDraw.Draw(page)
  d.text((35,22),f'STYLE — N°{n}'+(' / 45' if n==44 else '')+' — retouches locales',font=F(34),fill='#172b39')
  d.text((35,77),'PROPOSITION NON INTÉGRÉE — cadrage, mains et gestes préservés',font=F(23),fill='#946116')
  for row,i in enumerate(range(start,min(start+2,len(fs)))):
   y=140+row*495;d.text((35,y-30),f'PHASE {i+1} — AVANT',font=F(22),fill='#172b39');d.text((860,y-30),'APRÈS — GIF décodé',font=F(22),fill='#172b39')
   for col,img in enumerate([fs[i],decoded[i]]):
    x=35+col*825;full=img.copy();full.thumbnail((410,420));page.paste(full,(x,y))
    ys,xs=np.where(masks[i]);box=(max(0,int(xs.min())-12),max(0,int(ys.min())-12),min(img.width,int(xs.max())+13),min(img.height,int(ys.max())+13))
    crop=img.crop(box);s=min(370/crop.width,380/crop.height);crop=crop.resize((round(crop.width*s),round(crop.height*s)),Image.Resampling.LANCZOS);page.paste(crop,(x+420,y+20))
  d.text((35,1160),'Contrôle automatique : 0 pixel modifié hors masque musculaire, y compris après export GIF.',font=F(23),fill='#172b39')
  d.text((35,1205),'Rendu anatomique à relire. Aucune génération du corps entier ; n°80 : mains intactes.',font=F(22),fill='#172b39')
  if n==48:
   d.rectangle((25,65,1680,108),fill='white');d.text((35,77),'À REPRENDRE — raccord muscle/coussin insuffisant, ne pas intégrer',font=F(23),fill='#aa2020')
  page.save(OUT/f'{n}-comparatif-{start//2+1}.jpg',quality=91)
  if n!=48:pages.append(page)
# 44 et45 sont deux entrées approuvées partageant exactement la même démonstration.
assert sha(R/'gif/homme'/f'{IDENT[44]}-homme.gif')==sha(R/'gif/homme'/f'{IDENT[45]}-homme.gif')
(OUT/'45-style-proposition.gif').write_bytes((OUT/'44-style-proposition.gif').read_bytes())
copy=json.loads(json.dumps(reports[0]));copy['numero']=45;copy['copie_conforme_de']=44;reports.append(copy)
pages[0].save(OUT/'STYLE-260-lot02.pdf',save_all=True,append_images=pages[1:],resolution=150)
(OUT/'controles.json').write_text(json.dumps({'date':'2026-09-28','perimetre_global':389,'lots_precedents':'lot01 : style phase1 approuvé par « super vas-y »','appels_generation_ce_tour':6,'echecs_generation_ce_tour':1,'gif_livres_modifies':0,'gif_proposes':3,'gif_a_reprendre':1,'propositions':reports},ensure_ascii=False,indent=1)+'\n')
print('3 GIF propositions (44/45/80), n°48 à reprendre. Hors masque : 0 pixel modifié. PDF',len(pages),'pages.')
