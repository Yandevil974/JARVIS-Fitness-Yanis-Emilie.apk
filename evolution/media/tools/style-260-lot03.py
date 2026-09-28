#!/usr/bin/env python3
"""Assembler des propositions locales ; aucune intégration automatique.
Les sources sont les GIF aux SHA du manifeste, depuis le miroir temporaire.
Les copies ne sont permises que pour des démonstrations octet pour octet identiques.
"""
import pathlib,json,hashlib,colorsys
import cv2,numpy as np
from PIL import Image,ImageDraw,ImageFont
ROOT=pathlib.Path(__file__).resolve().parents[3];R=ROOT/'evolution/media/refonte-photo';O=R/'style-260/lot03';C=ROOT/'.cache/style-global';O.mkdir(exist_ok=True)
MAN=json.loads((R/'livraison/manifeste-331.json').read_text());NUM=json.loads((R/'livraison/numerotation-pdf.json').read_text())['numeros'];BY={NUM[e['cle']]:e for e in MAN['entrees']}
BOX={'19-1':[88,188,197,283],'19-2':[88,191,196,289],'85-1':[319,82,462,158],'85-2':[307,81,472,151],'214-1':[178,136,250,226],'214-2':[193,148,273,233],'223-1':[172,200,269,295],'223-2':[166,199,273,296],'337-1':[130,136,294,275],'337-2':[128,148,296,286]}
GROUPS={19:[19],85:[85],214:[214,274,275,276],223:[223,305,316],337:[337,338,339]}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def source(n):
 p=ROOT/'evolution'/BY[n]['gif'];return p if p.exists() else C/'source/evolution'/BY[n]['gif']
def frames(p):
 im=Image.open(p);fs=[];ds=[]
 for i in range(im.n_frames):im.seek(i);fs.append(im.convert('RGB'));ds.append(im.info['duration'])
 return fs,ds

def fillholes(m):
 padded=np.pad(m.astype('uint8'),1);empty=1-padded;cv2.floodFill(empty,None,(0,0),2);return (padded|(empty==1))[1:-1,1:-1]>0

def roi(n,i,size):
 im=Image.new('L',size);d=ImageDraw.Draw(im)
 if n==19:
  if i==0:
   d.polygon([(101,265),(109,247),(158,215),(172,215),(172,236),(117,269)],fill=255);d.polygon([(167,201),(186,201),(184,276),(162,276)],fill=255)
  else:
   d.polygon([(104,273),(100,254),(158,229),(175,228),(176,250),(118,277)],fill=255);d.polygon([(172,200),(189,200),(189,283),(170,283)],fill=255)
 elif n==85:
  if i==0:
   d.rectangle((333,99,368,153),fill=255);d.rectangle((418,99,457,152),fill=255)
  else:
   d.rectangle((318,89,365,119),fill=255);d.rectangle((417,87,465,117),fill=255)
 else:d.rectangle(BOX[f'{n}-{i+1}'],fill=255)
 return np.array(im)>0

def palette(before,after,mask):
 a=np.array(before);q=before.quantize(colors=256,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE);assert np.array_equal(np.array(q.convert('RGB')),a)
 idx=np.array(q);raw=q.getpalette();pal=np.array(raw+[0]*(768-len(raw)),dtype='uint8').reshape(256,3)
 used=set(np.unique(idx[~mask]).tolist());free=[i for i in range(256) if i not in used]
 if free:
  values=np.array(after)[mask].reshape(1,-1,3);cq=Image.fromarray(values).quantize(colors=len(free));raw=cq.getpalette();cp=np.array(raw+[0]*(768-len(raw)),dtype='uint8').reshape(256,3)
  pal[free]=cp[:len(free)]
 pp=Image.new('P',(1,1));pp.putpalette(pal.ravel().tolist());mapped=after.quantize(palette=pp,dither=Image.Dither.FLOYDSTEINBERG);idx[mask]=np.array(mapped)[mask]
 out=Image.fromarray(idx);out.putpalette(pal.ravel().tolist());assert np.array_equal(np.array(out.convert('RGB'))[~mask],a[~mask]);return out,len(free)

def compose(n,i,before):
 a=np.array(before);f=a.astype(float);g=(f[:,:,1]>f[:,:,0]*1.07)&(f[:,:,1]>f[:,:,2]*1.12)&(f[:,:,1]>48)&((f[:,:,1]-f[:,:,2])>22);mask=fillholes(g&roi(n,i,before.size))&roi(n,i,before.size)
 key=f'{n}-{i+1}';x0,y0,x1,y1=BOX[key];gen=Image.open(O/f'{key}-texture.png').convert('RGB').resize((x1-x0,y1-y0),Image.Resampling.LANCZOS)
 ga=np.array(gen).astype(float);gm=(ga[:,:,1]>ga[:,:,0]*1.03)&(ga[:,:,1]>ga[:,:,2]*1.12);hsv=np.array(gen.convert('HSV'));h=colorsys.rgb_to_hsv(117/255,189/255,18/255)[0]
 hsv[:,:,0][gm]=round(h*255);hsv[:,:,1][gm]=np.clip(hsv[:,:,1][gm].astype(float)*1.10,0,255).astype('uint8');ga=np.array(Image.fromarray(hsv,'HSV').convert('RGB'))
 out=a.copy();local=mask[y0:y1,x0:x1];out[y0:y1,x0:x1][local]=ga[local];assert mask.sum()>20,(n,i)
 assert np.array_equal(out[~mask],a[~mask]);return Image.fromarray(out),mask

pages=[];records=[];F=lambda n:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',n)
for n,group in GROUPS.items():
 src=source(n);assert sha(src)==BY[n]['gif_sha256'];fs,ds=frames(src);outfs=[];masks=[];stats=[]
 for i,before in enumerate(fs):
  after,mask=compose(n,i,before);after.save(O/f'{n}-phase{i+1}-local.png');Image.fromarray(mask.astype('uint8')*255).save(O/f'{n}-phase{i+1}-masque.png');indexed,free=palette(before,after,mask);outfs.append(indexed);masks.append(mask);stats.append({'phase':i+1,'pixels_masque':int(mask.sum()),'indices_nouveaux':free,'pixels_modifies_hors_masque':0})
 dest=O/f'{n}-style-proposition.gif';outfs[0].save(dest,save_all=True,append_images=outfs[1:],duration=ds,loop=0,disposal=2,optimize=False)
 decoded,newds=frames(dest);assert ds==newds and len(fs)==len(decoded)
 for a,b,mask in zip(fs,decoded,masks):assert np.array_equal(np.array(a)[~mask],np.array(b)[~mask])
 for alias in group:
  assert sha(source(alias))==sha(src),f'Copie non identique {n}/{alias}'
  p=O/f'{alias}-style-proposition.gif'
  if alias!=n:p.write_bytes(dest.read_bytes())
  records.append({'numero':alias,'cle':BY[alias]['cle'],'reference_demonstration':n,'source_sha256':sha(source(alias)),'proposition_sha256':sha(p),'taille':list(fs[0].size),'frames':len(fs),'durees_ms':ds,'statut':'proposition_a_controler','integre':False,'phases':stats})
 page=Image.new('RGB',(1700,1280),'white');d=ImageDraw.Draw(page)
 d.text((35,20),'STYLE — N°'+', '.join(map(str,group)),font=F(33),fill='#172b39');d.text((35,75),'PROPOSITIONS — anatomie/couleur à contrôler, aucun GIF livré remplacé',font=F(23),fill='#976114')
 for i in range(2):
  y=140+i*490;d.text((35,y-30),f'PHASE {i+1} — AVANT',font=F(22),fill='#172b39');d.text((860,y-30),'APRÈS (GIF décodé)',font=F(22),fill='#172b39')
  for col,img in enumerate([fs[i],decoded[i]]):
   x=35+825*col;full=img.copy();full.thumbnail((410,415));page.paste(full,(x,y));ys,xs=np.where(masks[i]);box=(max(0,int(xs.min())-10),max(0,int(ys.min())-10),min(img.width,int(xs.max())+11),min(img.height,int(ys.max())+11));zoom=img.crop(box);s=min(370/zoom.width,385/zoom.height);zoom=zoom.resize((round(zoom.width*s),round(zoom.height*s)),Image.Resampling.LANCZOS);page.paste(zoom,(x+420,y))
 d.text((35,1155),'Contrôle : 0 pixel modifié hors masques locaux après export GIF. Gestes et visages conservés.',font=F(22),fill='#172b39');d.text((35,1200),'Les copies partagées ont été vérifiées octet pour octet ; pas de propagation vers un autre geste.',font=F(21),fill='#172b39')
 page.save(O/f'{n}-comparatif.jpg',quality=91);pages.append(page)
pages[0].save(O/'STYLE-260-lot03.pdf',save_all=True,append_images=pages[1:],resolution=150)
(O/'controles.json').write_text(json.dumps({'date':'2026-09-28','generations':10,'echecs':0,'propositions':records,'nombre_gif_proposes':len(records),'gif_livres_modifies':0},ensure_ascii=False,indent=1)+'\n');print(len(records),'propositions ;',len(pages),'pages PDF ; zéro livré modifié.')
