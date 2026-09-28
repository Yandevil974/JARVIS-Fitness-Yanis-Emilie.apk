#!/usr/bin/env python3
"""Intégration ciblée de l'accord utilisateur « oui validé » sur les 25 points restants.
Source historique c685298, sans nouvelle génération/recoloration/copie de variante.
Ne touche pas au n°80. Vérifie tous les candidats avant la première écriture.
"""
import copy, hashlib, json, pathlib, subprocess
from PIL import Image
from io import BytesIO
ROOT = pathlib.Path(__file__).resolve().parents[3]
R = ROOT / 'evolution/media/refonte-photo'
SOURCE = 'c685298378773817460fb358bc605af7ce154b8b'
NUMEROS = {19,26,31,37,38,44,45,46,47,48,64,85,87,90,126,148,149,150,194,204,222,239,265,298,380}
def load(p): return json.loads(p.read_text())
def save(p,d): p.parent.mkdir(parents=True,exist_ok=True); p.write_text(json.dumps(d,ensure_ascii=False,indent=1)+'\n')
def sha(b): return hashlib.sha256(b).hexdigest()
def main():
    regp=R/'production/retours-utilisateur-2026-09-26.json'; reg=load(regp)
    mpfile=ROOT/'evolution/media/candidate/refonte-331-map.json'; mp=load(mpfile)
    manfile=R/'livraison/manifeste-331.json'; man=load(manfile); before=copy.deepcopy(man)
    nums=load(R/'livraison/numerotation-pdf.json')['numeros']
    entries={e['cle']:e for e in man['entrees']}
    gif80=R/'gif/homme/ecartes-halteres-homme.gif'; hash80=sha(gif80.read_bytes())
    jobs=[]
    for e in reg['entrees']:
        n=e['numero_signale']
        if n not in NUMEROS: continue
        prop=e.get('revision_candidate_lot69') if n in (26,44,45) else e['proposition']
        assert prop and nums[e['cle_numerotation']]==n
        data=subprocess.check_output(['git','show',SOURCE+':'+prop['gif']],cwd=ROOT)
        assert sha(data)==prop['sha256'], f'SHA candidat différent n°{n}'
        im=Image.open(BytesIO(data)); durations=[]
        for i in range(im.n_frames):
            im.seek(i); im.load(); durations.append(im.info.get('duration'))
        assert im.n_frames==(4 if n in (46,47,48) else 2), n
        assert all(d and d>0 for d in durations), n
        jobs.append((e,prop,data,list(im.size),im.n_frames,durations))
    assert len(jobs)==25
    changes=[]
    for e,prop,data,size,frames,durations in jobs:
        key=e['cle_numerotation']; entry=entries[key]; target=ROOT/'evolution'/entry['gif']
        target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
        entry.update(gif_sha256=sha(data),gif_size=size,gif_frames=frames,planche=None,
                     source_proposition={'commit':SOURCE,'gif':prop['gif']})
        mp['entrees'][key]['sha256']=sha(data)
        e.update(validation_utilisateur=True,statut='valide_integre')
        prop.update(validation_utilisateur=True,controle_final_requis=False,statut='valide_integre')
        e['integration']={'date':'2026-09-28','accord':'oui validé — réponse à la demande de validation des 25 autres propositions',
                          'gif':str(target.relative_to(ROOT)),'source_commit':SOURCE,'source_gif':prop['gif'],
                          'sha256':sha(data),'frames':frames,'size':size,'durees_ms':durations,
                          'copie_octet_pour_octet':True,'recoloration':False,'apk_reconstruit':False}
        if e['numero_signale'] in (26,44,45):
            e['proposition_precedente']=e['proposition'];e['proposition']=copy.deepcopy(prop)
        e['detail_validation_2026_09_28']='Accord explicite utilisateur reçu. Les réserves et anciennes mentions non-validées conservées dans les champs historiques ne décrivent plus le statut courant.'
        changes.append({'numero':e['numero_signale'],'cle':key,**e['integration']})
    keys={c['cle'] for c in changes}
    assert [e for e in man['entrees'] if e['cle'] not in keys]==[e for e in before['entrees'] if e['cle'] not in keys]
    assert sha(gif80.read_bytes())==hash80
    arp=R/'production/a-refaire.json'; ar=load(arp)
    ar['historiqueValidation25_2026_09_28']=[e for e in ar['aRefaire'] if e.get('numero_signale') in NUMEROS]
    ar['aRefaire']=[e for e in ar['aRefaire'] if e.get('numero_signale') not in NUMEROS]
    ar['validationUtilisateur2026_09_28']={'numeros':sorted(NUMEROS),'statut':'valide_integre','accord':'oui validé'}
    assert all(e['validation_utilisateur'] for e in reg['entrees'])
    save(regp,reg);save(arp,ar);save(manfile,man);save(mpfile,mp)
    save(R/'verification/INTEGRATION-25-2026-09-28.json',{'source_commit':SOURCE,'accord':'oui validé',
          'validations_total':26,'restants_non_approuves':0,'numero80_inchange_sha256':hash80,
          'generation_images':0,'recoloration':False,'apk_reconstruit':False,'integrations':changes})
    print('25 candidats vérifiés et copiés ; n°80 inchangé ; 26/26 approuvés.')
if __name__=='__main__': main()
