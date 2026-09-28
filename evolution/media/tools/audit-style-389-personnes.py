#!/usr/bin/env python3
"""Repérage technique corps/vert pour les389, pas une validation anatomique.
Poids externes non livrés : yolov8n-seg ONNX en .cache/style-global.
Masques exploratoires : relire avant retouche, surtout piscine/occlusions.
Ne modifie aucun GIF, aucun manifeste ni statut de validation utilisateur.
"""
import hashlib,json,pathlib,time
import cv2,numpy as np,onnxruntime as ort
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[3];R=ROOT/'evolution/media/refonte-photo';C=ROOT/'.cache/style-global';O=R/'style-260/audit-corps';O.mkdir(parents=True,exist_ok=True)
opt=ort.SessionOptions();opt.intra_op_num_threads=2
session=ort.InferenceSession(str(C/'yolov8n-seg.onnx'),sess_options=opt,providers=['CPUExecutionProvider'])
def detect(a):
 h,w=a.shape[:2];scale=640/max(h,w);nw,nh=round(w*scale),round(h*scale);left=(640-nw)//2;top=(640-nh)//2
 pad=np.full((640,640,3),114,np.uint8);pad[top:top+nh,left:left+nw]=cv2.resize(a,(nw,nh))
 pred,proto=session.run(None,{'images':np.transpose(pad.astype(np.float32)/255,(2,0,1))[None]})
 rows=pred[0].T;indices=np.where((rows[:,4]>.35)&(rows[:,4:84].argmax(1)==0))[0]
 if len(indices)==0:return np.zeros((h,w),bool),0,0.
 boxes=[]
 for idx in indices:
  cx,cy,bw,bh=rows[idx,:4];boxes.append([float(cx-bw/2),float(cy-bh/2),float(bw),float(bh)])
 keep=np.array(cv2.dnn.NMSBoxes(boxes,rows[indices,4].tolist(),.35,.5)).flatten()
 people=[]
 for k in keep:
  row=rows[indices[k]];cx,cy,bw,bh=row[:4]
  scoremap=(row[84:]@proto[0].reshape(32,-1)).reshape(160,160)
  m=cv2.resize(scoremap,(640,640))>0
  bbox=np.zeros((640,640),bool);x0=max(0,int(cx-bw/2));x1=min(640,int(cx+bw/2));y0=max(0,int(cy-bh/2));y1=min(640,int(cy+bh/2));bbox[y0:y1,x0:x1]=True;m&=bbox
  m=cv2.resize(m[top:top+nh,left:left+nw].astype('uint8'),(w,h),interpolation=cv2.INTER_NEAREST)>0
  people.append((m,float(row[4]),int(m.sum())))
 people.sort(key=lambda p:p[2],reverse=True)
 return people[0][0],len(people),people[0][1]
man=json.loads((R/'livraison/manifeste-331.json').read_text());nums=json.loads((R/'livraison/numerotation-pdf.json').read_text())['numeros'];entries=[]
for j,e in enumerate(sorted(man['entrees'],key=lambda e:nums[e['cle']])):
 n=nums[e['cle']];path=C/'source/evolution'/e['gif'];assert hashlib.sha256(path.read_bytes()).hexdigest()==e['gif_sha256']
 im=Image.open(path);phases=[]
 for i in range(im.n_frames):
  im.seek(i);a=np.array(im.convert('RGB'));person,count,score=detect(a);f=a.astype(float)
  green=(f[:,:,1]>f[:,:,0]*1.10)&(f[:,:,1]>f[:,:,2]*1.25)&(f[:,:,1]>55)&((f[:,:,1]-f[:,:,2])>30)
  # Garder une marge intérieure, ne pas recolorer le matériel adjacent.
  inside=cv2.erode(person.astype('uint8'),np.ones((3,3),np.uint8))>0;muscle=green&inside
  num,labels,stats,cent=cv2.connectedComponentsWithStats(green.astype('uint8'),8)
  ambiguous=sum(1 for k in range(1,num) if stats[k,cv2.CC_STAT_AREA]>15 and 0.1<(labels[inside]==k).sum()/stats[k,cv2.CC_STAT_AREA]<.95)
  reasons=[]
  if count==0:reasons.append('personne_non_detectee')
  if count>1:reasons.append('plusieurs_personnes')
  if muscle.sum()<30:reasons.append('vert_muscle_absent_ou_insuffisant')
  if ambiguous:reasons.append('composantes_vertes_au_bord_du_corps')
  directory=C/'masques'/str(n);directory.mkdir(parents=True,exist_ok=True)
  Image.fromarray(person.astype('uint8')*255).save(directory/f'personne-{i+1}.png')
  Image.fromarray(muscle.astype('uint8')*255).save(directory/f'vert-{i+1}.png')
  if muscle.any():med=np.median(a[muscle],axis=0).astype(int).tolist()
  else:med=None
  phases.append({'phase':i+1,'personnes_detectees':count,'confiance':round(score,3),'pixels_corps':int(person.sum()),'pixels_vert_dans_corps':int(muscle.sum()),'pixels_vert_hors_corps_non_modifies':int((green&~inside).sum()),'rgb_median_corps':med,'alertes':reasons})
 entries.append({'numero':n,'cle':e['cle'],'source_sha256':e['gif_sha256'],'phases':phases,'validation_anatomique':False,'gif_modifie':False})
 if (j+1)%25==0:print(f'{j+1}/389 examinés',flush=True)
report={'total':len(entries),'type':'Repérage automatique exploratoire, pas une validation anatomique','aucun_gif_modifie':True,'poids_sha256':hashlib.sha256((C/'yolov8n-seg.onnx').read_bytes()).hexdigest(),'poids_source':'https://github.com/Hyuto/yolov8-seg-onnxruntime-web/blob/master/public/model/yolov8n-seg.onnx','limite':'Segmentation automatique peut manquer un membre ou confondre un accessoire. Les plantes exclues par le modèle ne sont pas une garantie sans relecture.','entrees':entries}
(O/'audit-389.json').write_text(json.dumps(report,ensure_ascii=False,indent=1)+'\n');print('TERMINÉ : 389 examinés ; aucun GIF modifié.',flush=True)
