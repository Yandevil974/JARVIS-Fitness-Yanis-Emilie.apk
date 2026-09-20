// API compilation only, not an APK/DEX build. Tool binaries and outputs stay in .cache.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { config, sha256 } from '../../complete-hotfix/patch-web.mjs';
const root = process.cwd();
const java = process.env.JAVA_BIN || path.join(root, '.cache/java-tools/jdk4py/java-runtime/bin/java');
const tools = path.join(root, '.cache/voice-native');
const compiler = process.env.ECJ_JAR || path.join(tools, 'ecj.jar');
const android = process.env.ANDROID_JAR || path.join(tools, 'android.jar');
const reference = process.env.REFERENCE_CLASSES_JAR || path.join(tools, 'reference-classes.jar');
const verify = (file, expected) => { if (sha256(fs.readFileSync(file)) !== expected) throw new Error('Unexpected input: ' + file); };
verify(path.join(root, '.cache/reference/base.apk'), config.base.sha256);
verify(android, '6cea1df3efb77103ac3e2beb9bf4718964b0e0869ab16d39d29d5cbae1c147ad');
verify(compiler, '7c71886a76964a825eb734d22dedbd3a1efa2c19bec3af26d07b7bbe8167d943');
const source = 'JARVIS-Fitness-Source/android/app/src/main/java/app/jarvis/fitness/JarvisSpeechPlugin.java';
const capacitor = 'JARVIS-Fitness-Source/node_modules/@capacitor/android/capacitor/src/main/java/com/getcapacitor/';
const output = fs.mkdtempSync(path.join(tools, 'compiled-'));
execFileSync(java, ['-cp', compiler, 'org.eclipse.jdt.internal.compiler.batch.Main', '-source', '1.8', '-target', '1.8', '-proc:none',
  '-classpath', [android, reference].join(path.delimiter), '-d', output, source,
  ...['PluginMethod.java', 'annotation/CapacitorPlugin.java', 'annotation/Permission.java', 'annotation/PermissionCallback.java'].map(f => capacitor + f)], { stdio: 'inherit' });
const mainClass = path.join(output, 'app/jarvis/fitness/JarvisSpeechPlugin.class');
if (!fs.existsSync(mainClass)) throw new Error('Compiler did not produce the plugin class');
fs.writeFileSync(path.join(tools, 'compile-report.json'), JSON.stringify({
  verification: 'Android API 34 + complete APK class signatures; no Android runtime/emulator execution',
  source, sourceSha256: sha256(fs.readFileSync(source)), baseApkSha256: config.base.sha256,
  androidJarSha256: sha256(fs.readFileSync(android)), referenceClassesJarSha256: sha256(fs.readFileSync(reference)),
  output, classSha256: sha256(fs.readFileSync(mainClass)), signedApkProduced: false,
}, null, 2) + '\n');
console.log('Native API compilation succeeded:', output);
