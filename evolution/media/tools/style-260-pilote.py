#!/usr/bin/env python3
"""Audit technique 389 GIF + pilote de teinte local, NON VALIDÉ.
Aucun masquage anatomique automatique sur les 389 : les ROI du pilote sont manuelles.
Les pixels hors masque sont préservés exactement, y compris après décodage GIF.
La présence de vert ne certifie pas la qualité anatomique : relecture humaine requise.
"""
import colorsys, hashlib, json, pathlib
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
ROOT=pathlib.Path(__file__).resolve().parents[3]
R=ROOT/'evolution/media/refonte-photo'; OUT=R/'style-260'; OUT.mkdir(exist_ok=True)
MAN=json.loads((R/'livraison/manifeste-331.json').read_text())
NUM=json.loads((R/'livraison/numerotation-pdf.json').read_text())['numeros']
BYNUM={NUM[e['cle']]:e for e in MAN['entrees']}
def source(e):
 p=ROOT/'evolution'/e['gif']
 return p if p.exists() else ROOT/'.cache/integration80/evolution'/e['gif']
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def green(a):
 a=a.astype(float);r,g,b=a[:,:,0],a[:,:,1],a[:,:,2]
 return (g>r*1.10)&(g>b*1.25)&(g>55)&((g-b)>30)
def readframes(p):
 im=Image.open(p);frames=[];dur=[]
 for i in range(im.n_frames):
  im.seek(i);frames.append(im.convert('RGB'));dur.append(im.info.get('duration',0))
 return frames,dur,im.info.get('loop',0)
audit=[]
for e in MAN['entrees']:
 p=source(e); assert digest(p)==e['gif_sha256'], e['cle']
 fs,ds,loop=readframes(p)
 assert len(fs)==e['gif_frames'] and list(fs[0].size)==e['gif_size']
 audit.append({'numero':NUM[e['cle']],'cle':e['cle'],'sha256':digest(p),'frames':len(fs),'taille':list(fs[0].size),'durees_ms':ds,'statut_anatomique':'a_controler_manuellement','masque_corps_valide':False})
assert len(audit)==389
(OUT/'audit-technique-389.json').write_text(json.dumps({'controles':'SHA, décodage, frames, dimensions, durées ; PAS une validation anatomique ou de couleur','total':389,'entrees':sorted(audit,key=lambda e:e['numero'])},ensure_ascii=False,indent=1)+'\n')
# Référence mesurée sur les zones vertes du corps, première phase (plantes hors ROI).
ref,_ds,_loop=readframes(source(BYNUM[260]));refa=np.array(ref[0]); roi=refa[65:352,116:247]; samples=roi[green(roi)]
# Médiane incluant les ombres, pas uniquement les aplats lumineux.
assert len(samples)>30
target=np.median(samples,axis=0)/255
hue,sat,val=colorsys.rgb_to_hsv(*target)
(OUT/'reference-260.json').write_text(json.dumps({'numero':260,'sha256':digest(source(BYNUM[260])),'roi_corps_xyxy':[116,65,247,352],'rgb_median_mesure':(target*255).round().astype(int).tolist(),'pixels_mesures':len(samples),'plantes_exclues':True,'reference_modifiee':False},indent=1)+'\n')
# Polygones larges de localisation, intersectés avec le vert déjà existant.
# Ils ne créent pas de nouvelle anatomie. Limite : une zone plate reste à retoucher.
boxes={44:[(62,127,119,234),(64,147,111,223)],45:[(62,127,119,234),(64,147,111,223)],80:[(208,207,367,292),(226,219,354,292)]}
checks=[];pages=[];deferred=[]
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
F=lambda n:ImageFont.truetype(font,n)
for n,regions in boxes.items():
 e=BYNUM[n];fs,ds,loop=readframes(source(e));new=[];masks=[];stats=[]
 for i,(im,box) in enumerate(zip(fs,regions)):
  a=np.array(im);region=np.zeros(a.shape[:2],bool);x0,y0,x1,y1=box;region[y0:y1,x0:x1]=True;mask=green(a)&region;assert mask.sum()>80
  # Conserver tous les indices utilisés hors du muscle ; nouvelles couleurs uniquement
  # dans les places libres de la palette, afin de ne jamais recolorer une plante/main.
  indexed=im.quantize(colors=256,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
  assert np.array_equal(np.array(indexed.convert('RGB')),a)
  idx=np.array(indexed);pal=np.array(indexed.getpalette(),dtype=np.uint8).reshape(-1,3)
  outside=set(np.unique(idx[~mask]).tolist());free=[j for j in range(256) if j not in outside]
  if len(free)<3:
   deferred.append({'numero':n,'phase':i+1,'motif':'Palette partagée avec le décor : pas assez de couleurs libres pour préserver exactement les pixels hors muscle. Aucune proposition produite.'})
   break
  # Redistribuer la luminance existante autour de la référence sans aplat uniforme.
  vals=a[mask].max(axis=1)/255.;median=np.median(vals)
  levels=np.linspace(max(.15,val*.50),min(1.,val*1.28),len(free))
  colors=np.array([np.array(colorsys.hsv_to_rgb(hue,sat,float(v)))*255 for v in levels]).round().astype(np.uint8)
  desired=np.clip(val+(vals-median)*1.35,levels[0],levels[-1])
  pick=np.abs(desired[:,None]-levels[None,:]).argmin(axis=1)
  idx[mask]=np.array(free,dtype=np.uint8)[pick];pal[free]=colors
  out=Image.fromarray(idx);out.putpalette(pal.flatten().tolist());new.append(out);masks.append(mask)
  assert np.array_equal(np.array(out.convert('RGB'))[~mask],a[~mask])
  stats.append({'phase':i+1,'roi_xyxy':box,'pixels_masque':int(mask.sum()),'nuances_disponibles':len(free),'pixels_modifies_hors_masque':0})
 if len(new)!=len(fs):continue
 p=OUT/'lot01'/f'{n}-proposition-style.gif';new[0].save(p,save_all=True,append_images=new[1:],duration=ds,loop=loop,disposal=2,optimize=False)
 decoded,ds2,_=readframes(p);assert ds==ds2
 for old,out,mask in zip(fs,decoded,masks):assert np.array_equal(np.array(old)[~mask],np.array(out)[~mask])
 checks.append({'numero':n,'source_sha256':digest(source(e)),'proposition_sha256':digest(p),'statut':'proposition_teinte_non_validee_anatomie_a_revoir','controle':stats,'integration':False})
 if n==45:continue
 page=Image.new('RGB',(1600,1100),'white');d=ImageDraw.Draw(page)
 d.text((35,20),f'N°{n}'+(' / 45' if n==44 else '')+' — essai local, NON VALIDÉ',font=F(30),fill='#162a36')
 d.text((35,65),'AVANT                                               PROPOSITION — teinte du n°260',font=F(22),fill='#162a36')
 for i,(before,after) in enumerate(zip(fs,decoded)):
  y=110+i*415
  # Zoom muscle de même taille pour apprécier la démarcation plutôt que la silhouette entière.
  x0,y0,x1,y1=regions[i];box=(max(0,x0-28),max(0,y0-25),min(before.width,x1+28),min(before.height,y1+25))
  for col,img in enumerate([before,after]):
   zoom=img.crop(box);zoom.thumbnail((650,350));zoom=zoom.resize((round(zoom.width*min(650/zoom.width,350/zoom.height)),round(zoom.height*min(650/zoom.width,350/zoom.height))))
   page.paste(zoom,(40+col*790,y));d.text((40+col*790,y+355),f'Phase {i+1} — zoom muscle',font=F(20),fill='#444444')
 d.text((35,960),'Hors masque : pixels strictement identiques. Gestes, mains, visage et plantes conservés.',font=F(21),fill='#162a36')
 d.text((35,1000),'Essai de teinte/contraste uniquement : ne restaure pas une texture absente ni un contour faux.',font=F(21),fill='#985600')
 d.text((35,1040),'Aucun GIF livré remplacé. Vérification anatomique requise avant généralisation.',font=F(21),fill='#985600')
 page.save(OUT/'lot01'/f'{n}-comparatif.jpg',quality=92);pages.append(page)
pages[0].save(OUT/'lot01/STYLE-260-pilote.pdf',save_all=True,append_images=pages[1:],resolution=150)
(OUT/'lot01/controles.json').write_text(json.dumps({'reference_rgb':(target*255).round().astype(int).tolist(),'generation':0,'gif_livres_modifies':0,'propositions':checks,'differes':deferred},ensure_ascii=False,indent=1)+'\n')
print('Audit technique 389/389. Référence RGB mesurée :', (target*255).round().astype(int).tolist())
print('Pilote 44/45 : vérification pixels hors masque OK ; n°80 différé (palette). Aucun livré modifié.')
