#!/usr/bin/env python3
"""Prepare only the signer needed for a web/identity-only repack (no DEX rebuild)."""
import hashlib, json, pathlib, subprocess, tarfile, zipfile, shutil
ROOT = pathlib.Path(__file__).resolve().parents[2]
TOOLS = ROOT / '.cache/home-tools'
JAVA = ROOT / '.cache/signing-tools/jdk4py/java-runtime/bin/java'
PINS = {
 'apksig-source.tar.gz': ('repos/LineageOS/android_tools_apksig/tarball/6447768c0e8ab4385a47e7bb85e6bdba0085dced', '14a13d76bd2ddb96b1c3a4d1aaf7e383ff0d8fa73bb0aa52d65d1fb4993295ee'),
 'ecj.jar': ('repos/processing/processing4/contents/java/mode/org.eclipse.jdt.core.jar?ref=c14695476ed904fba445668c05384b0c5ad9bc24', '7c71886a76964a825eb734d22dedbd3a1efa2c19bec3af26d07b7bbe8167d943')}
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 TOOLS.mkdir(parents=True,exist_ok=True)
 for name,(url,digest) in PINS.items():
  target=TOOLS/name
  if not target.exists():
   with target.open('wb') as out:subprocess.run(['gh','api',url,'-H','Accept: application/vnd.github.raw+json'],stdout=out,check=True)
  if sha(target)!=digest:raise ValueError('Unexpected tool: '+name)
 source=TOOLS/'apksig-source';source.mkdir(exist_ok=True)
 with tarfile.open(TOOLS/'apksig-source.tar.gz') as tar:
  for item in tar:
   p=pathlib.PurePosixPath(item.name)
   if p.is_absolute() or '..' in p.parts or not(item.isfile() or item.isdir()):raise ValueError('Unsafe tool archive')
   tar.extract(item,source)
 src=next(source.iterdir())/'src';cli=src/'apksigner/java/com/android/apksigner/ApkSignerTool.java'
 text=cli.read_text();before='Security.addProvider(new org.conscrypt.OpenSSLProvider());'
 assert text.count(before)==1
 text=text.replace(before,'Security.addProvider((java.security.Provider) Class.forName("org.conscrypt.OpenSSLProvider").getDeclaredConstructor().newInstance());').replace('catch (UnsatisfiedLinkError e)','catch (ReflectiveOperationException | LinkageError e)')
 cli.write_text(text)
 classes=TOOLS/'classes'
 if classes.exists():shutil.rmtree(classes)
 classes.mkdir()
 files=sorted((src/'main/java').rglob('*.java'))+sorted((src/'apksigner/java').rglob('*.java'))
 subprocess.run([str(JAVA),'-cp',str(TOOLS/'ecj.jar'),'org.eclipse.jdt.internal.compiler.batch.Main','-encoding','UTF-8','-source','1.8','-target','1.8','-proc:none','-nowarn','-d',str(classes),*map(str,files)],check=True)
 with zipfile.ZipFile(TOOLS/'apksigner.jar','w',zipfile.ZIP_DEFLATED) as jar:
  def add(name,data):
   info=zipfile.ZipInfo(str(name),(2026,9,21,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;jar.writestr(info,data)
  add('META-INF/MANIFEST.MF',b'Manifest-Version: 1.0\nMain-Class: com.android.apksigner.ApkSignerTool\n\n')
  for p in sorted(classes.rglob('*.class')):add(p.relative_to(classes),p.read_bytes())
  for p in sorted((src/'apksigner/java').rglob('*.txt')):add(p.relative_to(src/'apksigner/java'),p.read_bytes())
 subprocess.run([str(JAVA),'-jar',str(TOOLS/'apksigner.jar'),'verify','--verbose','--print-certs',str(ROOT/'downloads/Yanis-Fitness-Evolution-1.3.0.apk')],check=True)
 report={'sources':{k:v[1] for k,v in PINS.items()},'java':'jdk4py==17.0.9.2','encoding':'UTF-8','apksignerSha256':sha(TOOLS/'apksigner.jar'),'providerChange':'Optional Conscrypt loading by reflection only; cryptographic implementations unchanged'}
 (TOOLS/'provenance.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
if __name__=='__main__':main()
