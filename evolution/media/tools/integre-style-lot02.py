#!/usr/bin/env python3
"""Accord « Validé » sur lot02 : intégrer seulement 44,45,80.
Contrôles avant copie : SHA source/candidat, frames, taille, durée, zéro changement
hors masque. PDF existant mis à jour uniquement dans les cadres de ces exercices,
sans restaurer/importer les 363 autres GIF historiques absents du checkout.
"""
import copy,hashlib,io,json,pathlib
import numpy as np
import pymupdf
from PIL import Image,ImageDraw,ImageFont
ROOT=pathlib.Path(__file__).resolve().parents[3]; R=ROOT/'evolution/media/refonte-photo'; LOT=R/'style-260/lot02'; TARGET={44,45,80}
def load(p):return json.loads(p.read_text())
def save(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=1)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def frames(p):
 im=Image.open(p);fs=[];ds=[]
 for i in range(im.n_frames):im.seek(i);fs.append(im.convert('RGB'));ds.append(im.info['duration'])
 return fs,ds

def main():
 cp=LOT/'controles.json';ctrl=load(cp)
 manp=R/'livraison/manifeste-331.json';man=load(manp);oldman=copy.deepcopy(man)
 mapp=ROOT/'evolution/media/candidate/refonte-331-map.json';mp=load(mapp);oldmap=copy.deepcopy(mp)
 num=load(R/'livraison/numerotation-pdf.json')['numeros'];by_num={num[e['cle']]:e for e in man['entrees']}
 untouched={str(p):sha(p) for p in (R/'gif').rglob('*.gif')}
 jobs=[]
 for n in sorted(TARGET):
  check=next(e for e in ctrl['propositions'] if e['numero']==n);entry=by_num[n]
  dest=ROOT/'evolution'/entry['gif'];cand=LOT/f'{n}-style-proposition.gif'
  assert sha(dest)==check['source_sha256'],f'n°{n}: source modifiée ou lot déjà intégré'
  assert sha(cand)==check['proposition_sha256']
  old,ds=frames(dest);new,nds=frames(cand)
  assert ds==nds==check['durees_ms'] and len(new)==len(old)==check['frames']
  for i,(a,b) in enumerate(zip(old,new)):
   assert a.size==b.size==tuple(check['taille'])
   mask=np.array(Image.open(LOT/f'{44 if n==45 else n}-phase{i+1}-masque.png'))>0
   assert np.array_equal(np.array(a)[~mask],np.array(b)[~mask]),(n,i)
  jobs.append((n,entry,dest,cand,new,check))
 # Mettre à jour les seules images des exercices concernés dans le PDF raster PIL.
 pdf=R/'livraison/REVUE-331-exercices.pdf';doc=pymupdf.open(pdf);assert len(doc)==131
 page_images={};page_sources={};page_masks={};page_refs={}
 for n,entry,dest,cand,new,check in jobs:
  pi=1+(n-1)//3
  if pi not in page_images:
   refs=doc[pi].get_images(full=True);assert len(refs)==1
   xref=refs[0][0];data=doc.extract_image(xref)['image'];page=Image.open(io.BytesIO(data)).convert('RGB')
   assert page.size==(1240,1754)
   page_sources[pi]=np.array(page).copy();page_masks[pi]=np.zeros((1754,1240),bool);page_images[pi]=page;page_refs[pi]=xref
  page=page_images[pi];slot_h=(1754-120)//3;y0=40+((n-1)%3)*slot_h;cell_h=slot_h-130
  for i,f in enumerate(new):
   pic=f.copy();pic.thumbnail((480,cell_h-28),Image.Resampling.LANCZOS)
   x=90+(i%2)*550+(480-pic.width)//2;y=y0+104+(i//2)*cell_h
   page.paste(pic,(x,y));page_masks[pi][y:y+pic.height,x:x+pic.width]=True
 for pi,page in page_images.items():
  assert np.array_equal(np.array(page)[~page_masks[pi]],page_sources[pi][~page_masks[pi]])
  stream=io.BytesIO();page.save(stream,format='PNG');doc[pi].replace_image(page_refs[pi],stream=stream.getvalue())
 temp=ROOT/'.cache/style-lot02-valide.pdf';doc.save(temp,garbage=4,deflate=True);doc.close()
 with pymupdf.open(temp) as d:assert len(d)==131
 # Index visuel : mêmes numéros, mêmes cases, seules trois vignettes remplacées.
 idxp=R/'review/index-general.jpg';idx=Image.open(idxp).convert('RGB');width=(idx.width-8)//10-8
 for n,entry,dest,cand,new,check in jobs:
  f=new[0];thumb=f.resize((round(f.width*150/f.height),150))
  x=8+((n-1)%10)*(width+8);y=8+((n-1)//10)*(150+18+8)+18
  idx.paste(thumb,(x,y))
 # Intégration après réussite de tous les précontrôles.
 changes=[]
 for n,entry,dest,cand,new,check in jobs:
  dest.write_bytes(cand.read_bytes());h=sha(dest)
  entry['gif_sha256']=h
  entry['style']={'reference_numero':260,'lot':'lot02','date':'2026-09-28','validation_utilisateur':'Validé','source':str(cand.relative_to(ROOT)),'sha256_avant':check['source_sha256'],'sha256_apres':h,'hors_masque_pixels_modifies':0}
  if entry.get('planche'):entry['planche_geste_avant_style']=entry['planche'];entry['planche']=None
  mp['entrees'][entry['cle']]['sha256']=h
  check.update(statut='valide_integre',integre=True,accord='Validé',date_validation='2026-09-28')
  changes.append({'numero':n,'cle':entry['cle'],**entry['style']})
 selected={e['cle'] for e in changes}
 assert [e for e in man['entrees'] if e['cle'] not in selected]==[e for e in oldman['entrees'] if e['cle'] not in selected]
 assert {k:v for k,v in mp['entrees'].items() if k not in selected}=={k:v for k,v in oldmap['entrees'].items() if k not in selected}
 paths={str(job[2]) for job in jobs}
 for path,h in untouched.items():
  if path not in paths:assert sha(pathlib.Path(path))==h
 save(manp,man);save(mapp,mp)
 pdf.write_bytes(temp.read_bytes());idx.save(idxp,quality=88)
 ctrl.update(gif_livres_modifies=3,validation_utilisateur='Validé',numeros_integres=sorted(TARGET));save(cp,ctrl)
 pp=R/'style-260/progression-389.json';progress=load(pp)
 for e in progress['entrees']:
  if e['numero'] in TARGET:
   record=next(c for c in changes if c['numero']==e['numero']);e.update(statut_style='valide_integre',style_integre=True,validation_utilisateur='Validé',gif_courant_sha256=record['sha256_apres'])
 progress.update(propositions_completes=0,style_integre=3,style_valide=3,a_reprendre=1,non_traites=385,restants_style=386);save(pp,progress)
 regp=R/'production/retours-utilisateur-2026-09-26.json';reg=load(regp)
 for e in reg['entrees']:
  if e['numero_signale'] in TARGET:e['integration_style_2026_09_28']=next(c for c in changes if c['numero']==e['numero_signale'])
 reg['decision_style_2026_09_28'].update(statut='lot02_44_45_80_valides_integres',gif_style_finalises=3,gif_style_integres=3,gif_style_proposes=0);save(regp,reg)
 report={'date':'2026-09-28','accord':'Validé','perimetre_accord':sorted(TARGET),'numero48_integre':False,'generation':0,'gif_integres':3,'restants_style':386,'manifeste_autres_entrees_inchangees':True,'autres_gif_locaux_inchanges':True,'controle_pixels_hors_masque':0,'pdf_pages':131,'pages_pdf_modifiees_base1':[p+1 for p in sorted(page_images)],'pdf_autres_images_inchangees':True,'index_vignettes_remplacees':sorted(TARGET),'apk_reconstruit':False,'changements':changes}
 save(LOT/'INTEGRATION-VALIDEE.json',report)
 print('Intégration 44/45/80 OK ; 48 inchangé ; PDF 131 pages ; 3/389 style intégré.')
if __name__=='__main__':main()
