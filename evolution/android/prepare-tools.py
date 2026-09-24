#!/usr/bin/env python3
"""Pinned D8/smali and source-built apksigner. Binaries stay outside Git.
Requires the Java/ECJ/API setup documented in evolution/voice/README.md.
"""
import hashlib, json, os, pathlib, shutil, subprocess, tarfile, zipfile
ROOT = pathlib.Path(__file__).resolve().parents[2]
TOOLS = ROOT / '.cache/apk-tools'
JAVA = os.environ.get('JAVA_BIN', str(ROOT / '.cache/java-tools/jdk4py/java-runtime/bin/java'))
ECJ = ROOT / '.cache/voice-native/ecj.jar'
def run(*args):
    subprocess.run([str(a) for a in args], check=True, cwd=ROOT)
def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()
def compile_java(files, out, cp=None):
    args = [JAVA, '-cp', ECJ, 'org.eclipse.jdt.internal.compiler.batch.Main', '-source', '1.8', '-target', '1.8', '-proc:none', '-nowarn', '-d', out]
    if cp: args += ['-classpath', cp]
    run(*args, *files)
def main():
    TOOLS.mkdir(parents=True, exist_ok=True)
    assert digest(ECJ) == '7c71886a76964a825eb734d22dedbd3a1efa2c19bec3af26d07b7bbe8167d943', 'Unexpected ECJ'
    for item in json.loads((ROOT / 'evolution/android/tools.json').read_text()):
        target = TOOLS / item['file']
        if not target.exists() or digest(target) != item['sha256']:
            endpoint = f"repos/{item['repo']}/"
            endpoint += f"contents/{item['path']}?ref={item['commit']}" if 'path' in item else f"tarball/{item['commit']}"
            with target.open('wb') as out:
                subprocess.run(['gh', 'api', endpoint, '-H', 'Accept: application/vnd.github.raw+json'], stdout=out, check=True)
        if digest(target) != item['sha256']: raise ValueError('Unexpected tool download: ' + item['file'])
    source = TOOLS / 'apksig-source'
    if source.exists(): shutil.rmtree(source)
    source.mkdir()
    with tarfile.open(TOOLS / 'apksig-source.tar.gz') as tar:
        for entry in tar:
            p = pathlib.PurePosixPath(entry.name)
            if p.is_absolute() or '..' in p.parts or not (entry.isfile() or entry.isdir()): raise ValueError('Unsafe archive entry')
            tar.extract(entry, source)
    src = next(source.iterdir()) / 'src'
    cli = src / 'apksigner/java/com/android/apksigner/ApkSignerTool.java'
    text = cli.read_text()
    # Optional Conscrypt provider is absent in this host JRE. Keep crypto implementations
    # untouched; resolve the optional provider reflectively, otherwise use Java 17 JCA.
    before = 'Security.addProvider(new org.conscrypt.OpenSSLProvider());'
    assert text.count(before) == 1 and text.count('catch (UnsatisfiedLinkError e)') == 1
    text = text.replace(before, 'Security.addProvider((java.security.Provider) Class.forName("org.conscrypt.OpenSSLProvider").getDeclaredConstructor().newInstance());')
    text = text.replace('catch (UnsatisfiedLinkError e)', 'catch (ReflectiveOperationException | LinkageError e)')
    cli.write_text(text)
    classes = TOOLS / 'apksig-classes'
    if classes.exists(): shutil.rmtree(classes)
    classes.mkdir()
    compile_java(sorted((src / 'main/java').rglob('*.java')) + sorted((src / 'apksigner/java').rglob('*.java')), classes)
    with zipfile.ZipFile(TOOLS / 'apksigner.jar', 'w', zipfile.ZIP_DEFLATED) as jar:
        def add(name, data):
            info = zipfile.ZipInfo(str(name), (2026, 9, 20, 0, 0, 0)); info.compress_type = zipfile.ZIP_DEFLATED
            jar.writestr(info, data)
        add('META-INF/MANIFEST.MF', b'Manifest-Version: 1.0\nMain-Class: com.android.apksigner.ApkSignerTool\n\n')
        for p in sorted(classes.rglob('*.class')): add(p.relative_to(classes), p.read_bytes())
        for p in sorted((src / 'apksigner/java').rglob('*.txt')): add(p.relative_to(src / 'apksigner/java'), p.read_bytes())
    compile_java([ROOT / 'evolution/android/DexBridge.java'], TOOLS, TOOLS / 'apktool.jar')
    run(JAVA, '-jar', TOOLS / 'apksigner.jar', 'verify', '--verbose', '--print-certs', ROOT / 'downloads/JARVIS-Fitness-1.0.6-complet.apk')
    print('Prepared tools. apksigner SHA-256:', digest(TOOLS / 'apksigner.jar'))
if __name__ == '__main__': main()
