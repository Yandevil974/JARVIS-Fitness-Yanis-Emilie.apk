#!/usr/bin/env python3
"""Compose the reviewed media mapping (evolution/media/mapping.json).

Every association below was decided after viewing the packaged frames
(evolution/media/README.md, findings.json). Rules applied:
  exact     same movement, same equipment, same body position (rep scheme,
            tempo, load or "test" variants are not visual differences);
  variante  same movement, one clearly named difference (implement, grip,
            uni/bilateral, bench angle, seated/standing) written in `note`;
  none      no honest demonstration in the packaged library: the app shows an
            explicit "no demonstration" card instead of another movement.
Legacy (original HTML app) images are restored whenever they are correct;
legacy images that showed a different movement are replaced or set to none.
"""
import json, pathlib, re, sys, unicodedata

ROOT = pathlib.Path(__file__).resolve().parents[3]
INVENTORY = json.loads((ROOT / 'evolution/media/review/inventory-1.4.0.json').read_text())
LEGACY = json.loads((ROOT / 'JARVIS-Fitness-Source/src/data/legacy.json').read_text())
WEB_ROOT = ROOT / '.cache/media-audit/web-1.4.0'   # extracted 1.4.0 APK web root
OUT = ROOT / 'evolution/media/mapping.json'


def ge(value):
    """Same normaliser as the bundle's Ge()."""
    s = unicodedata.normalize('NFD', str(value or ''))
    s = re.sub(r'[\u0300-\u036f]', '', s).lower()
    s = re.sub(r"[’']", ' ', s)
    s = re.sub(r'[-–—]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


def media_paths():
    media = WEB_ROOT / 'media'
    if not media.is_dir():
        raise SystemExit('Extract the 1.4.0 APK web root to .cache/media-audit/web-1.4.0 first')
    return {'/media/' + f.name for f in media.iterdir() if f.suffix in ('.gif', '.jpg')}


PACKAGED = media_paths()
HERE = pathlib.Path(__file__).resolve().parent
NEW_ASSETS = {'/media/dips-triceps-corrige.gif'}


def M(prefix):
    """Resolve a hash prefix (or full name) to the packaged /media path."""
    if prefix.startswith('/media/'):
        return prefix
    hits = [p for p in PACKAGED | NEW_ASSETS if p.split('/')[-1].startswith(prefix)]
    if len(hits) != 1:
        raise SystemExit(f'ambiguous or unknown media {prefix!r}: {hits}')
    return hits[0]


# Legacy MUSCU_GUIDES with normalised keys (what the app SHOULD have matched).
LEGACY_GUIDES = {}
for source in ('elite', 'emilie'):
    for key, value in LEGACY[source]['MUSCU_GUIDES'].items():
        LEGACY_GUIDES[ge(key)] = value


def legacy_image(name):
    guide = LEGACY_GUIDES.get(ge(name))
    if guide and guide.get('ref'):
        guide = LEGACY_GUIDES.get(ge(guide['ref']))
    return (guide or {}).get('img')


# ---------------------------------------------------------------------------
# Exercise decisions. Anything not listed here must have a correct legacy image
# (restored as exact); the script fails otherwise so no exercise is forgotten.
# ---------------------------------------------------------------------------
E = lambda media, note=None: {'level': 'exact', 'media': M(media), 'note': note}
V = lambda media, note: {'level': 'variante', 'media': M(media), 'note': note}
N = lambda note: {'level': 'none', 'media': None, 'note': note}

DECISIONS = {
    # --- legacy images that showed ANOTHER movement (audit findings) --------
    'kickback-a-l-elastique': V('48916936', "Illustration : kickback à la poulie. Ici : élastique à la cheville, même geste d'extension de hanche. L'ancienne image montrait un kickback triceps avec haltère."),
    'face-pull-a-la-poulie': N("Aucun face pull dans la bibliothèque (l'ancienne image était un tirage vertical derrière la nuque)."),
    'face-pull-a-l-elastique': N("Aucun face pull dans la bibliothèque (l'ancienne image était un tirage vertical derrière la nuque)."),
    'clamshell-a-l-elastique': N("Aucun clamshell (couché sur le côté, genoux pliés) dans la bibliothèque ; l'ancienne image était un bird dog."),
    'hip-thrust-unilateral': V('1519aacc', "Illustration : hip thrust barre à deux jambes, dos sur le banc. Ici : une seule jambe au sol, l'autre tendue. L'ancienne image était un squat bulgare."),
    'hip-thrust-unilateral-1-jambe': V('1519aacc', "Illustration : hip thrust barre à deux jambes, dos sur le banc. Ici : une seule jambe au sol. L'ancienne image était un squat bulgare."),
    'hip-thrust-unilateral-leste': V('1519aacc', "Illustration : hip thrust barre à deux jambes. Ici : une jambe, lesté (haltère ou disque sur la hanche)."),
    'mollets-debout-unilateraux': E('10ab787f', "Montée sur une jambe, avant-pied sur une marche (l'ancienne image montrait la version à deux jambes avec barre)."),
    'tirage-vertical-prise-neutre': V('4af33157', "Illustration : tirage vertical prise large en pronation. Ici : poignée neutre, coudes le long du corps."),
    'circuit-abdominaux-crunch-releves-gainage': V('c1065bef', "Illustration : crunch à la poulie assis (première partie du circuit). Enchaînez ensuite relevés de jambes et gainage."),
    'dead-bug-avec-rotation': V('b2236e6b', "Illustration : dead bug classique. Ici : ajoutez la rotation contrôlée du buste."),
    'gainage-lateral-dynamique': V('e56d7d8f', "Illustration : gainage latéral tenu, pieds sur banc. Ici : version dynamique (montée/descente du bassin)."),
    'french-press-barre-ez': E('ea226c44', "Extension couchée à la barre EZ restaurée (la 1.4.0 affichait à tort l'extension debout à la poulie basse)."),
    'elevations-laterales-assises': V('9e7f9262', "Illustration : élévations latérales debout. Ici : assis sur un banc, même trajectoire."),

    # --- biceps --------------------------------------------------------------
    'curl-barre': E('882c9c36'),
    'curl-marteau': V('8fe5818f', "Illustration : curl marteau assis. Ici : debout, même prise neutre."),
    'curl-halteres-incline-supination': E('b54f07a7'),
    'curl-halteres-incline-prise-neutre': V('b54f07a7', "Illustration : curl incliné en supination. Ici : prise neutre (paumes face à face)."),
    'curl-scott-barre-ez-pronation': N("Pas de curl sur pupitre Scott dans la bibliothèque."),
    'curl-scott-barre-ez-supination': N("Pas de curl sur pupitre Scott dans la bibliothèque."),
    'curl-scott-haltere-prise-neutre': N("Pas de curl haltère sur pupitre Scott dans la bibliothèque."),
    'curl-scott-haltere-neutre': N("Pas de curl haltère sur pupitre Scott dans la bibliothèque."),
    'curl-scott-90-haltere-supination': N("Pas de curl haltère sur pupitre Scott 90° dans la bibliothèque."),
    'curl-haltere-supination-banc-scott-90': N("Pas de curl haltère sur banc Scott 90° dans la bibliothèque."),
    'curl-zottman': N("Pas de curl Zottman (rotation du poignet) dans la bibliothèque."),
    'curl-zottman-assis': N("Pas de curl Zottman assis dans la bibliothèque."),
    'curl-zottman-un-bras-banc-scott': N("Pas de curl Zottman sur banc Scott dans la bibliothèque."),
    'curl-concentration': N("Pas de curl concentration (coude sur la cuisse) dans la bibliothèque."),
    'curl-poulie-basse': N("Pas de curl à la poulie basse dans la bibliothèque."),
    'curl-poulie-basse-supination': N("Pas de curl à la poulie basse dans la bibliothèque."),

    # --- triceps -------------------------------------------------------------
    'triceps-extensions-halteres-banc-plat': V('ea226c44', "Illustration : extension couchée à la barre EZ. Ici : un haltère dans chaque main, même trajectoire vers le front."),
    'extensions-triceps-halteres-plat': V('ea226c44', "Illustration : extension couchée à la barre EZ. Ici : haltères, banc plat."),
    'extensions-triceps-halteres-incline': V('ea226c44', "Illustration : extension couchée à la barre EZ sur banc plat. Ici : haltères, banc incliné."),
    'french-press-haltere-un-bras': V('5d6a8913', "Illustration : extension au-dessus de la tête à deux mains, barre EZ. Ici : un seul haltère, un bras à la fois."),
    'extensions-triceps-poulie': E('497ab2e2'),
    'pushdown-triceps-cable': E('497ab2e2'),
    'barre-au-front-pushdown-triceps': E('ea226c44', "Barre au front (extension couchée à la barre EZ)."),
    'extensions-triceps-barre-ez-pullover': V('ea226c44', "Illustration : extension couchée à la barre EZ. Ici : enchaînez avec le pullover bras légèrement fléchis."),
    'extensions-triceps-pullover-barre-ez': V('ea226c44', "Illustration : extension couchée à la barre EZ. Ici : enchaînez avec le pullover."),
    'california-press-barre-au-cou': N("Pas de California press (hybride extension/développé serré) dans la bibliothèque."),
    'developpe-couche-prise-serree': V('30adf4e9', "Illustration : développé couché prise moyenne. Ici : mains largeur d'épaules, coudes près du corps."),
    'developpe-couche-decline-prise-serree': V('30adf4e9', "Illustration : développé couché sur banc plat, prise moyenne. Ici : banc décliné et prise serrée."),
    'triceps-dips': E('/media/dips-triceps-corrige.gif', "Image haute redessinée (même style) pour corriger l'orientation du buste ; image basse d'origine."),
    'dips': V('/media/dips-triceps-corrige.gif', "Illustration : dips aux barres parallèles, buste vertical (accent triceps). Ici, version pectoraux : buste légèrement penché vers l'avant, coudes un peu plus ouverts, descente jusqu'à l'étirement des pectoraux."),

    # --- épaules -------------------------------------------------------------
    'elevations-laterales-coude-a-90': V('9e7f9262', "Illustration : élévations latérales bras quasi tendus. Ici : coude plié à 90°, même élévation du bras."),
    'elevations-laterales-incline': V('9e7f9262', "Illustration : élévations latérales debout. Ici : allongé sur le côté sur banc incliné, un bras à la fois."),
    'elevations-laterales-incline-30': V('9e7f9262', "Illustration : élévations latérales debout. Ici : banc incliné à 30°."),
    'elevations-laterales-incline-45': V('9e7f9262', "Illustration : élévations latérales debout. Ici : banc incliné à 45°."),
    'elevations-laterales-incline-30-face-au-banc': V('9e7f9262', "Illustration : élévations latérales debout. Ici : buste posé face au banc incliné à 30°."),
    'elevations-laterales-lean-away': V('9e7f9262', "Illustration : élévations latérales debout. Ici : une main sur un support, buste incliné à l'opposé."),
    'developpe-derriere-la-nuque': V('22146cff', "Illustration : développé militaire barre devant. Ici : barre descendue derrière la nuque, amplitude prudente."),
    'developpe-haltere-un-bras-debout': V('d9c88be0', "Illustration : développé haltères assis à deux bras. Ici : debout, un seul haltère."),
    'developpe-militaire-inertie-depuis-les-pins': V('22146cff', "Illustration : développé militaire debout. Ici : départ barre posée sur les pins à hauteur de menton."),
    'developpe-halteres-assis-neutre-pronation': V('d9c88be0', "Illustration : développé haltères assis en pronation. Ici : départ prise neutre, rotation vers la pronation en montant."),
    'developpe-halteres-assis-prise-neutre': V('d9c88be0', "Illustration : développé haltères assis en pronation. Ici : paumes face à face."),

    # --- pectoraux -----------------------------------------------------------
    'developpe-halteres-incline-45': E('b4522eb6'),
    'developpe-halteres-incline-45-prise-neutre': V('b4522eb6', "Illustration : développé incliné en pronation. Ici : paumes face à face."),
    'developpe-halteres-incline-pronation': E('b4522eb6'),
    'developpe-couche-barre': E('30adf4e9'),
    'developpe-couche-plat-inertie-depuis-les-pins': V('30adf4e9', "Illustration : développé couché classique. Ici : départ barre posée sur les pins."),
    'ecartes-halteres': V('805f8592', "Illustration : écartés haltères sur banc décliné. Ici : banc plat, même arc de cercle."),
    'ecartes-cables-incline': V('b395c84e', "Illustration : câbles croisés debout. Ici : allongé sur banc incliné entre les poulies basses."),
    'cables-croises-rotation-externe': V('b395c84e', "Illustration : câbles croisés. Ici : terminez chaque répétition par une rotation externe des épaules."),
    'pompes': V('43bad873', "Illustration : pompes mains surélevées. Ici : mains au sol."),

    # --- dos -----------------------------------------------------------------
    'tractions-prise-large': V('a8fb4616', "Illustration : tractions pronation largeur d'épaules. Ici : prise plus large que les épaules."),
    'lean-away-pull-ups': V('a8fb4616', "Illustration : tractions classiques. Ici : buste incliné vers l'arrière en tirant (lean away)."),
    'tirage-vertical-lean-away': V('dc0cabae', "Illustration : tirage vertical classique. Ici : buste incliné vers l'arrière, barre vers le haut de la poitrine."),
    'pullover-cable-bras-tendus': N("Pas de pullover à la poulie bras tendus dans la bibliothèque."),
    'pullover-haltere-plat': N("Pas de pullover haltère couché dans la bibliothèque."),
    'rowing-assis-etirement': V('0a5625b9', "Illustration : rowing assis prise neutre. Ici : laissez les épaules s'étirer vers l'avant entre les répétitions."),
    'rowing-assis-au-cou': V('0a5625b9', "Illustration : rowing assis vers l'abdomen. Ici : tirez vers le cou, coudes hauts."),
    'rowing-assis-cable-unilateral': V('0a5625b9', "Illustration : rowing assis à deux mains. Ici : une poignée, un bras à la fois."),
    'rowing-haltere-buste-penche': V('4dfda05b', "Illustration : rowing haltère un bras, appui sur le banc. Ici : buste penché sans appui."),
    'rowing-haltere-un-bras-prise-neutre': E('4dfda05b'),
    'rowing-a-l-elastique': V('0860394a', "Illustration : tirage horizontal à la poulie. Ici : élastique fixé devant vous."),
    'good-morning-debout': N("Pas de good morning (barre sur le dos) dans la bibliothèque ; le soulevé de terre roumain n'est pas le même placement."),
    'back-extension-45-prise-snatch': V('f64281e2', "Illustration : extension du dos sur banc horizontal. Ici : banc à 45°, barre tenue en prise large."),

    # --- jambes / fessiers ---------------------------------------------------
    'leg-extension': N("Pas d'extension de genoux à la machine dans la bibliothèque ; la presse à cuisses n'est pas le même mouvement."),
    'leg-press-unilateral': V('9f8ae03b', "Illustration : presse à deux jambes. Ici : une seule jambe sur la plateforme."),
    'mollets-a-la-presse': N("Pas de montée de mollets à la presse dans la bibliothèque."),
    'fentes-barre': V('995e1f9a', "Illustration : fentes avant avec haltères. Ici : barre sur les trapèzes."),
    'fentes-marchees': V('995e1f9a', "Illustration : fentes avant alternées sur place. Ici : en avançant à chaque pas."),
    'fentes-arriere-au-poids-du-corps': V('bc4d9bed', "Illustration : fentes arrière avec barre. Ici : sans charge."),
    'drop-lunges-fentes-controlees': V('bc4d9bed', "Illustration : fentes arrière avec barre. Ici : pas croisé vers l'arrière, descente contrôlée, sans charge."),
    'drop-lunges-fentes-sautees-controlees': N("Pas de fentes sautées dans la bibliothèque ; l'illustration d'une fente statique ne montre pas l'impulsion."),
    'fentes-bulgares-halteres-pied-avant-sureleve': V('cf312b83', "Illustration : squat bulgare haltères, pied arrière surélevé. Ici : pied avant également surélevé."),
    'split-squat-poulie-basse': V('cf312b83', "Illustration : squat bulgare avec haltères. Ici : résistance d'une poulie basse tenue devant."),
    'split-squat-barbell-pied-avant-sureleve': V('cf312b83', "Illustration : squat bulgare haltères. Ici : barre sur le dos, pied avant surélevé."),
    'squat-cycliste': V('530326be', "Illustration : back squat barre haute. Ici : talons surélevés, pieds rapprochés, genoux très en avant."),
    'squat-cycliste-squat-complet': V('530326be', "Illustration : back squat barre haute. Ici : talons surélevés, descente complète."),
    'back-squat-inertie-pause-complete': V('530326be', "Illustration : back squat classique. Ici : pause complète en position basse avant de remonter."),
    'safety-bar-squat-ou-barre-classique': V('530326be', "Illustration : barre classique. Ici : safety bar si disponible, même descente."),
    'squat-au-poids-du-corps': V('78f9aee5', "Illustration : goblet squat avec haltère. Ici : sans charge, bras devant pour l'équilibre."),
    'souleve-de-terre-partiel': V('a8b1d117', "Illustration : soulevé de terre complet. Ici : départ ou arrêt à mi-tibia/genoux (amplitude partielle)."),
    'souleve-de-terre-partiel-prise-snatch': V('a8b1d117', "Illustration : soulevé de terre prise classique. Ici : amplitude partielle, prise très large."),
    'glute-ham-raise': N("Pas de glute ham raise dans la bibliothèque ; le leg curl allongé n'est pas le même mouvement."),
    'leg-curl-allonge-pieds-pointes': V('4eff701b', "Illustration : leg curl allongé. Ici : pieds pointés (extension de cheville)."),
    'leg-curl-allonge-pieds-flechis': V('4eff701b', "Illustration : leg curl allongé. Ici : pieds fléchis (orteils vers les tibias)."),
    'releves-de-jambes-allonge': E('afe2f533'),
    'releves-de-jambes-incline': V('afe2f533', "Illustration : relevés de jambes au sol. Ici : sur banc incliné, mains derrière la tête."),

    # --- tronc / mobilité ----------------------------------------------------
    'crunch-sur-swiss-ball': N("Pas de crunch sur swiss ball dans la bibliothèque ; le jackknife n'est pas le même mouvement."),
    'ab-wheel-roulette': N("Pas de roulette abdominale dans la bibliothèque."),
    'wood-chop-poulie-haute': N("Pas de wood chop (rotation diagonale) dans la bibliothèque ; le crunch à la poulie n'est pas le même mouvement."),
    'mobilite-des-epaules': E('/media/warmup-mobilite.jpg', "Cercles d'épaules (illustration fixe de l'échauffement)."),
    'respiration-diaphragmatique': E('/media/stretch-respiration.jpg', "Respiration allongée, genoux pliés (illustration fixe)."),

    # --- tests 1RM (même exercice, schéma de répétitions différent) ----------
    'developpe-couche-test-1rm': E('30adf4e9'),
    'back-squat-test-1rm': E('530326be'),
    'souleve-de-terre-test-1rm': E('a8b1d117'),
    'developpe-militaire-test-1rm': E('22146cff'),
}

# Legacy images reviewed as correct for their key (restored as exact).
exercises = {}
for exercise in INVENTORY['exercises']:
    eid, name = exercise['id'], exercise['name']
    legacy = legacy_image(name)
    if eid in DECISIONS:
        entry = dict(DECISIONS[eid])
    elif legacy:
        entry = {'level': 'exact', 'media': legacy, 'note': None}
    else:
        raise SystemExit(f'No decision for {eid} ({name})')
    entry.update(name=name, legacy=legacy, previous=(exercise.get('resolved') or {}).get('path'))
    exercises[eid] = entry
missing = set(DECISIONS) - set(exercises)
if missing:
    raise SystemExit(f'Decisions for unknown exercises: {sorted(missing)}')

# ---------------------------------------------------------------------------
# Pool guides: aquatic illustrations of the elite source replace Émilie's land
# GIFs (side plank on a bench, band work, wall knee raise...).
# ---------------------------------------------------------------------------
pool_guides = {
    'Gainage au bord (vertical)': V('3d29edbd', "Illustration : gainage au bord, corps à l'horizontale. Ici : corps vertical, mains au bord, ventre gainé."),
    'Mobilité épaules aquatique': E('c9c8fd84'),
    'Mobilité hanches / chevilles': E('54e922d2', "Montée de genou et mobilisation de cheville dans l'eau."),
    'Ciseaux au bord': E('64f9a3c8'),
    'Talons-fesses': E('c99b47ee'),
    'Étirements au bord': V('/media/pool-etirements-bord.jpg', "Illustration : étirement des ischio-jambiers, pied posé sur le bord. Enchaînez mollets, épaules/dos et quadriceps selon les consignes."),
}

# ---------------------------------------------------------------------------
# Timer movements by context. `land` covers the Tabata/HIIT generator names;
# aquatic names resolve through the pool guides (with the overrides above).
# ---------------------------------------------------------------------------
REST = {'level': 'rest', 'media': None, 'note': 'Récupération : visuel respiratoire.'}
land = {
    'Jumping jacks': N("Pas de jumping jacks dans la bibliothèque."),
    'Squats': V('78f9aee5', "Illustration : goblet squat avec haltère. Ici : au poids du corps."),
    'Squats doux': V('78f9aee5', "Illustration : goblet squat avec haltère. Ici : au poids du corps, amplitude confortable."),
    'Pompes': V('43bad873', "Illustration : pompes mains surélevées. Ici : mains au sol (ou sur les genoux)."),
    'Pompes au mur': V('43bad873', "Illustration : pompes mains surélevées sur un step. Ici : mains à plat contre le mur."),
    'Pompes inclinées': E('43bad873'),
    'Mountain climbers': E('c07b14f1'),
    'Mountain climbers lents': V('c07b14f1', "Même mouvement, rythme lent et contrôlé."),
    'Fentes alternées': V('995e1f9a', "Illustration : fentes avant avec haltères. Ici : sans charge."),
    'Fentes arrière': V('bc4d9bed', "Illustration : fentes arrière avec barre. Ici : sans charge."),
    'Gainage planche': E('1317e405', "Planche sur les avant-bras (l'animation enchaîne sur une planche latérale)."),
    'Planche': E('1317e405', "Planche sur les avant-bras (l'animation enchaîne sur une planche latérale)."),
    'Planche latérale G': V('e56d7d8f', "Illustration : planche latérale pieds sur banc. Ici : au sol, côté gauche vers le bas."),
    'Planche latérale D': V('e56d7d8f', "Illustration : planche latérale pieds sur banc. Ici : au sol, côté droit vers le bas."),
    'Burpees simplifiés': N("Pas de burpees dans la bibliothèque."),
    'Burpees': N("Pas de burpees dans la bibliothèque."),
    'Relevés de jambes': E('afe2f533'),
    'Dips au bord': N("Pas de dips mains sur un banc/bord dans la bibliothèque (les dips aux barres parallèles sont une autre position)."),
    'Superman': N("Pas de superman (extension dos allongé sur le ventre) dans la bibliothèque."),
    'Ponts fessiers': E('8eecb015'),
    'Squats sumo': N("Pas de squat sumo (pieds très écartés) dans la bibliothèque."),
    'Montées sur mollets': V('f529e06a', "Illustration : montée sur mollets debout à la machine. Ici : au poids du corps, sur une marche ou au sol."),
    'Mollets': V('f529e06a', "Illustration : montée sur mollets debout à la machine. Ici : au poids du corps, lentement."),
    'Chaise au mur': N("Pas de chaise au mur dans la bibliothèque."),
    'Chaise douce': N("Pas de chaise au mur dans la bibliothèque."),
    'Battements de jambes': N("Pas de battements de jambes au sol (allongé sur le dos) dans la bibliothèque ; l'ancienne image montrait les battements en piscine."),
    'Crunch': N("Pas de crunch au sol dans la bibliothèque."),
    'Russian twist': N("Pas de Russian twist dans la bibliothèque."),
    'Dead bug': E('b2236e6b'),
    'Montées de genoux': N("Pas de montées de genoux au sol dans la bibliothèque ; l'ancienne image montrait la version en piscine."),
    'High knees': N("Pas de montées de genoux rapides au sol dans la bibliothèque."),
    'Corde invisible': N("Pas de corde à sauter (simulée) dans la bibliothèque."),
    'Patineurs': N("Pas de patineurs (sauts latéraux) dans la bibliothèque."),
    'Squats sautés': N("Pas de squats sautés dans la bibliothèque."),
    'Repos actif': REST,
    'Marche sur place': N("Pas de marche sur place au sol dans la bibliothèque ; l'ancienne image montrait la marche aquatique."),
    'Oiseau-chien': E('aab0de0a'),
    'Respiration profonde': REST,
    'Échauffement progressif': N("Échauffement libre (marche, montées de genoux légères) : pas de démonstration."),
    'Récupération': REST,
    'Récupération entre cycles': REST,
    'Retour au calme': REST,
}

# ---------------------------------------------------------------------------
# Proposals shown in the chat (review/proposals-lot*.json). NOTHING is applied until the user
# validates a name here; the validated GIF must then be moved from assets/proposals/ to assets/.
# ---------------------------------------------------------------------------
# Lot 1 shown in the chat on 2026-09-22 (proposals-tabata-lot1.jpg); the user answered « Poursuis ».
# Remove a name below to send that movement back to the explicit absence card (one line, reversible).
VALIDATED_PROPOSALS = {'Jumping jacks', 'Burpees', 'Squats sautés', 'Montées de genoux', 'Patineurs', 'Chaise au mur', 'Superman', 'Russian twist'}
for lot in sorted(HERE.glob('proposals-lot*.json')):
    for prop in json.loads(lot.read_text())['proposals']:
        if prop['name'] not in VALIDATED_PROPOSALS:
            continue
        media = '/media/' + prop['file']
        if not (HERE.parent / 'assets' / prop['file']).exists():
            raise SystemExit(f"validated proposal {prop['name']}: move assets/proposals/{prop['file']} to assets/ first")
        NEW_ASSETS.add(media)
        for use in prop['uses']:
            m = re.match(r"^(.*?)\s*\(variante\s*:\s*(.*)\)$", use)
            if m:
                land[m.group(1)] = {'level': 'variante', 'media': media, 'note': f"Illustration : {prop['name']}. Ici : {m.group(2)}."}
            else:
                land[use] = {'level': 'exact', 'media': media, 'note': None}

# ---------------------------------------------------------------------------
# Stretches: image names are already right except the ones below.
# ---------------------------------------------------------------------------
stretches = {
    'stretch-fes-0': E('/media/stretch-piriforme.jpg', "« Pigeon assis » : assis, cheville sur le genou opposé, buste penché (l'ancienne image montrait le pigeon au sol)."),
    'stretch-moy-0': N("Pas d'illustration du croisement de jambe debout avec inclinaison latérale (l'ancienne image montrait une fente latérale)."),
    'stretch-mol-1': N("Pas d'illustration du talon qui descend sous une marche (l'ancienne image montrait l'étirement au mur)."),
    'stretch-isc-0': V('/media/stretch-isc-flexion.jpg', "Illustration : flexion avant debout. Ici : assis, jambes tendues, dos long."),
    'stretch-bic-0': V('/media/stretch-biceps.jpg', "Illustration : bras tendu derrière, paume contre le mur. Ici : main tirée doucement vers le bas par l'autre main."),
    'stretch-avb-0': V('/media/stretch-avb-flechisseurs.jpg', "Illustration : paumes au sol, doigts vers les genoux. Ici : bras tendu devant, doigts tirés vers le bas."),
    # tri-1 « Main dans le dos » : l'ancienne image montrait la main remontant depuis le bas du dos (rotation interne d'épaule),
    # pas le coude levé avec la main glissée entre les omoplates ; l'illustration de tri-0 montre la position décrite.
    'stretch-tri-1': V('/media/stretch-triceps-coude.jpg', "Illustration : coude levé au-dessus de la tête, main glissée entre les omoplates. Ici : même position ; l'autre main pousse le coude vers le bas, sans cambrer."),
    'stretch-epP-0': V('/media/stretch-ep-posterieur.jpg', "Illustration : bras tendu devant, l'autre main soutient sous l'avant-bras. Ici : paume vers le bas, tirez la main vers vous avec l'autre main."),
}

# ---------------------------------------------------------------------------
# Warm-up steps (Bg): lower-body sessions get their own visuals.
# ---------------------------------------------------------------------------
warmup = {
    'Mise en route': E('/media/warmup-cardio.jpg', "Marche ou vélo très facile."),
    'Mobilité des épaules': E('/media/warmup-mobilite.jpg'),
    'Mobilité hanches & chevilles': N("Pas d'illustration de mobilité hanches/chevilles au sol (l'ancienne image montrait des cercles de bras)."),
    'Activation fessiers': E('8eecb015', "Ponts fessiers au sol."),
    'Activation scapulaire': N("Pas d'illustration de rétractions d'omoplates/rotations externes (l'ancienne image montrait des cercles de bras)."),
    'Approche': {'level': 'exercise', 'media': None, 'note': "Visuel du premier exercice de la séance (sa démonstration validée) ; sinon absence explicite."},
}

# Record what 1.4.0 actually displayed, so every override stays reviewable (before -> after).
for title, entry in pool_guides.items():
    entry['previous'] = next((g['img'] for g in INVENTORY['poolGuides'] if g['t'] == title), None)
for sid, entry in stretches.items():
    entry['previous'] = next((st['img'] for st in INVENTORY['stretches'] if st['id'] == sid), None)
for name, entry in warmup.items():
    entry['previous'] = INVENTORY.get('warmupImages', {}).get({'Mise en route': 'route', 'Mobilité des épaules': 'mobilite', 'Mobilité hanches & chevilles': 'mobilite', 'Activation fessiers': 'mobilite', 'Activation scapulaire': 'mobilite', 'Approche': 'approche'}[name])

mapping = {
    'version': '1.5.0-media',
    'baseBundleSha256': INVENTORY['baseline']['bundleSha256'] if isinstance(INVENTORY.get('baseline'), dict) and 'bundleSha256' in INVENTORY['baseline'] else 'f80a7e82cbe8d45b7c959541ce384c54f3694582eef14515467dbfef204f9f26',
    'dips': {'variant': 'redraw', 'redraw': '/media/dips-triceps-corrige.gif', 'original': M('c3a2b989')},
    'newAssets': sorted(NEW_ASSETS),
    'levels': {
        'exact': 'même mouvement, même matériel, même position',
        'variante': 'même mouvement, une différence nommée (matériel, prise, uni/bilatéral, angle, assis/debout)',
        'none': 'aucune démonstration honnête : carte « pas de démonstration » explicite',
        'rest': 'étape de récupération : visuel respiratoire',
    },
    'exercises': exercises,
    'poolGuides': pool_guides,
    'movements': {'land': land},
    'stretches': stretches,
    'warmup': warmup,
}


def check_media(entry, where):
    media = entry.get('media')
    if media and media not in PACKAGED and media not in NEW_ASSETS:
        raise SystemExit(f'{where}: media {media} is not packaged')


for eid, entry in exercises.items():
    check_media(entry, eid)
for title, entry in pool_guides.items():
    check_media(entry, title)
for name, entry in land.items():
    check_media(entry, name)
for sid, entry in stretches.items():
    check_media(entry, sid)

OUT.write_text(json.dumps(mapping, ensure_ascii=False, indent=1) + '\n')
counts = {}
for entry in exercises.values():
    counts[entry['level']] = counts.get(entry['level'], 0) + 1
changed = sum(1 for e in exercises.values() if e['media'] != e['previous'])
print(json.dumps({'exercises': len(exercises), 'levels': counts, 'changedVersus1.4.0': changed,
                  'landMovements': len(land), 'poolOverrides': len(pool_guides), 'stretchOverrides': len(stretches)}, ensure_ascii=False))
