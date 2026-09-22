#!/usr/bin/env python3
"""Repack the complete signed 1.4.0 as 1.5.0 with the reviewed exercise visuals.
Same package, same key (certificate 7d6f9c8f…21fd), versionCode 11 -> 12: an in-place update,
never a new application. All nine DEX, resources.arsc and capacitor.config.json stay byte-identical.
Only AndroidManifest.xml (version) and the web bundle change; one media file is added.

Without the private signing backup (.private/…) the script stops after alignment and writes an
UNSIGNED candidate under .cache/ only (--unsigned-candidate). It never writes an unsigned APK to
downloads/, never generates a key and never asks for a secret.
"""
import argparse, base64, hashlib, importlib.util, io, json, pathlib, shutil, subprocess, sys, tempfile, zipfile
ROOT=pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'complete-hotfix'))
from apk_binary import patch_manifest, chunks, u16, pool_strings

def module(name, file):
 spec=importlib.util.spec_from_file_location(name,file);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
alignment=module('alignment_media',ROOT/'JARVIS-Fitness-Source/scripts/rebuild-apk.py')
RELEASE_FILE=ROOT/'evolution/android/release-media.json'
RELEASE=json.loads(RELEASE_FILE.read_text())
IDENTITY_FILE=ROOT/'evolution/android/identity-home.json'
JAVA=ROOT/'.cache/signing-tools/jdk4py/java-runtime/bin/java'
SIGNER=ROOT/'.cache/home-tools/apksigner.jar'
BUNDLE='assets/public/assets/index-CBCies4k.js'
ALLOWED=['AndroidManifest.xml',BUNDLE]
NEW_ENTRIES=RELEASE['newWebEntries']
def sha(data):return hashlib.sha256(data).hexdigest()
def run(*args):subprocess.run(list(map(str,args)),cwd=ROOT,check=True)

def signing_available():
 try:
  signing=module('signing_media',ROOT/'evolution/android/signing-home.py')
 except Exception:
  return None
 needed=[signing.PRIVATE/'recovery-key.txt',signing.PRIVATE/signing.ARCHIVE,signing.ENCRYPTED,JAVA,SIGNER]
 return signing if all(p.exists() for p in needed) else None

def build_web():
 """Compile the reviewed media correction on the exact 1.4.0 bundle and pin it."""
 run('node',ROOT/'evolution/media/build.mjs')
 web=(ROOT/'.cache/media-web'/BUNDLE.removeprefix('assets/public/')).read_bytes()
 pinned=RELEASE.get('validatedMediaBundleSha256')
 if pinned:assert sha(web)==pinned,'Media bundle changed: renew browser/DOM checks and the release pin'
 assert web.count(b'V '+RELEASE['previousVersion'].encode())==1
 web=web.replace(b'V '+RELEASE['previousVersion'].encode(),('V '+RELEASE['version']).encode())
 for marker in [b'JarvisMediaMap',b'JarvisHome',b'JarvisNotifications',b'JarvisDecisions',b'JarvisAppointments',b'JarvisSpokesperson',b'JarvisVoice',b'JarvisFollowUp']:assert marker in web
 assert b'level:"famille"' not in web and b'const Z4={' not in web
 return web

def repack(base, unsigned, web):
 with zipfile.ZipFile(base) as src,zipfile.ZipFile(unsigned,'w') as dst:
  names=src.namelist();assert not any(n in names for n in NEW_ENTRIES),'New media entry already packaged'
  last_media=max(i for i,n in enumerate(names) if n.startswith('assets/public/media/'))
  template=src.getinfo(names[last_media])
  for index,info in enumerate(src.infolist()):
   data=src.read(info.filename)
   if info.filename==BUNDLE:data=web
   elif info.filename=='AndroidManifest.xml':
    values=[]
    for offset,kind,head,size in chunks(data,u16(data,2)):
     if kind==1:values=pool_strings(data[offset:offset+size]);break
    assert RELEASE['appId'] in values and RELEASE['previousVersion'] in values and RELEASE['version'] not in values
    data=patch_manifest(data,{RELEASE['previousVersion']:RELEASE['version']},RELEASE['versionCode'])
   dst.writestr(info,data)
   if index==last_media:
    for name,digest in NEW_ENTRIES.items():
     payload=(ROOT/'.cache/media-web'/name.removeprefix('assets/public/')).read_bytes();assert sha(payload)==digest,name
     entry=zipfile.ZipInfo(name,date_time=template.date_time);entry.compress_type=template.compress_type
     entry.create_system=template.create_system;entry.external_attr=template.external_attr;entry.extract_version=template.extract_version
     dst.writestr(entry,payload)

def verify(base, candidate, web):
 with zipfile.ZipFile(base) as src,zipfile.ZipFile(candidate) as dst:
  assert sorted(set(dst.namelist())-set(src.namelist()))==sorted(NEW_ENTRIES),'Unexpected new entries'
  assert not set(src.namelist())-set(dst.namelist()),'Entries removed'
  changes=sorted(n for n in src.namelist() if src.read(n)!=dst.read(n));assert changes==sorted(ALLOWED),changes
  dex=[n for n in src.namelist() if n.endswith('.dex')];assert len(dex)==9
  assert all(src.read(n)==dst.read(n) for n in dex),'Native implementation changed'
  for n in ['resources.arsc','assets/capacitor.config.json','assets/public/training-hero.jpg']:assert src.read(n)==dst.read(n),n
  webfiles=[n for n in dst.namelist() if n.startswith('assets/public/') and not n.endswith('/')];assert len(webfiles)==272+len(NEW_ENTRIES)
  assert dst.read(BUNDLE)==web
  for name,digest in NEW_ENTRIES.items():assert sha(dst.read(name))==digest
  return changes

def main():
 parser=argparse.ArgumentParser(description=__doc__,formatter_class=argparse.RawDescriptionHelpFormatter)
 parser.add_argument('--output',type=pathlib.Path)
 parser.add_argument('--unsigned-candidate',action='store_true',help='stop after alignment; write .cache/media-release/unsigned-candidate.apk (not installable, never published)')
 args=parser.parse_args()
 output=(args.output or ROOT/RELEASE['output']).resolve()
 if output != (ROOT/RELEASE['output']).resolve() and not output.is_relative_to(ROOT/'.cache'):
  raise ValueError('Only this release or a temporary candidate output is permitted')
 base=ROOT/RELEASE['baseApk'];identity=json.loads(IDENTITY_FILE.read_text())
 assert sha(base.read_bytes())==RELEASE['baseApkSha256'],'Base is not the published 1.4.0'
 for name in ['appId','appName']:assert identity[name]==RELEASE[name]
 assert identity['version']==RELEASE['previousVersion'] and identity['versionCode']==RELEASE['previousVersionCode']
 assert RELEASE['versionCode']>RELEASE['previousVersionCode']
 with zipfile.ZipFile(base) as z:assert sha(z.read(BUNDLE))==RELEASE['baseBundleSha256']
 web=build_web()
 work=ROOT/'.cache/media-release';work.mkdir(parents=True,exist_ok=True)
 unsigned,aligned,candidate=[work/n for n in ['unsigned.apk','aligned.apk','signed.apk']]
 repack(base,unsigned,web)
 alignment.align_apk(unsigned,aligned)
 changes=verify(base,aligned,web)
 report={'identity':identity,'appId':RELEASE['appId'],'version':RELEASE['version'],'versionCode':RELEASE['versionCode'],'baseApkSha256':sha(base.read_bytes()),
  'packagedWebSha256':sha(web),'packagedWebDifference':'reviewed media mapping + V 1.4.0 -> V 1.5.0',
  'changedEntries':changes,'addedEntries':NEW_ENTRIES,'webFiles':272+len(NEW_ENTRIES),'unchangedWebFiles':271,'nativeDexFiles':9,'byteIdenticalDexFiles':9,
  'alignmentVerified':True,'stagesIncluded':RELEASE['stagesIncluded'],'approvedHomeIncluded':True,'mediaCorrectionsIncluded':True,'generalConversationalAiIncluded':False,'deviceTested':False}
 signing=signing_available()
 if args.unsigned_candidate or not signing:
  target=work/'unsigned-candidate.apk';shutil.copyfile(aligned,target)
  report.update(signed=False,apkSha256=sha(target.read_bytes()),apkBytes=target.stat().st_size,status='UNSIGNED candidate: not installable, not published; signing needs the private backup restored on a trusted machine')
  target.with_suffix('.fidelity.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
  print('UNSIGNED CANDIDATE:',target);print('SHA256:',report['apkSha256']);print(report['status'])
  return
 # Sign with the SAME key as 1.4.0, restored from the encrypted backup (never a new key).
 assert sha(SIGNER.read_bytes())==RELEASE['apksignerSha256']
 envelope=json.loads(signing.ENCRYPTED.read_text());assert envelope['identity']==identity
 key=base64.b64decode((signing.PRIVATE/'recovery-key.txt').read_bytes().strip(),validate=True)
 data=signing.unseal(envelope,key);assert data==(signing.PRIVATE/signing.ARCHIVE).read_bytes()
 with tempfile.TemporaryDirectory(prefix='restored-for-signing-',dir=signing.PRIVATE) as temp:
  secret=pathlib.Path(temp)
  with zipfile.ZipFile(io.BytesIO(data)) as backup:
   for name in signing.NAMES:signing.private_write(secret/name,backup.read(name))
  run(JAVA,'-jar',SIGNER,'sign','--ks',secret/'jarvis-evolution.p12','--ks-pass','file:'+str(secret/'password.txt'),'--ks-key-alias','jarvis-evolution',
      '--v1-signing-enabled','false','--v2-signing-enabled','true','--v3-signing-enabled','true','--v4-signing-enabled','false','--out',candidate,aligned)
 verification=subprocess.check_output([str(JAVA),'-jar',str(SIGNER),'verify','--verbose','--print-certs',str(candidate)],text=True)
 for item in ['Signer #1 certificate SHA-256 digest: '+identity['certificateSha256'],'Number of signers: 1','Verified using v2 scheme (APK Signature Scheme v2): true','Verified using v3 scheme (APK Signature Scheme v3): true']:assert item in verification
 alignment.verify_alignment(candidate);verify(base,candidate,web)
 report.update(signed=True,apkSha256=sha(candidate.read_bytes()),apkBytes=candidate.stat().st_size,signatureVerified=['v2','v3'],signedFromRestoredEncryptedBackup=True,
  sameCertificateAs140=True,signerSha256=sha(SIGNER.read_bytes()))
 output.parent.mkdir(parents=True,exist_ok=True);temp=output.with_suffix('.apk.tmp');shutil.copyfile(candidate,temp);temp.replace(output)
 output.with_suffix('.fidelity.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 output.with_suffix('.apk.sha256').write_text(report['apkSha256']+'  '+output.name+'\n')
 print(verification);print('SIGNED APK:',output);print('SHA256:',report['apkSha256'])
if __name__=='__main__':main()
