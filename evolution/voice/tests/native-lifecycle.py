"""Host lifecycle tests with explicit Android/Capacitor doubles, NOT a device test.
Run compile-native.mjs first: that compiles the production plugin against real API
34 and complete APK class signatures. Here those class files are exercised with
simulated services, permissions and the main-thread queue (no real microphone).
"""
import hashlib, json, os, pathlib, subprocess, tempfile
ROOT = pathlib.Path(__file__).resolve().parents[3]
TOOLS = ROOT / '.cache/voice-native'
JAVA = os.environ.get('JAVA_BIN', str(ROOT / '.cache/java-tools/jdk4py/java-runtime/bin/java'))
REPORT = json.loads((TOOLS / 'compile-report.json').read_text())
assert hashlib.sha256((ROOT / REPORT['source']).read_bytes()).hexdigest() == REPORT['sourceSha256'], 'Recompile the current native source first'
OUT = pathlib.Path(tempfile.mkdtemp(prefix='host-test-', dir=TOOLS))
SOURCES = {
'android/os/Looper.java': '''package android.os; public class Looper { public static Looper getMainLooper(){return new Looper();} }''',
'android/os/Handler.java': '''package android.os; import java.util.*; public class Handler {
 static List<Runnable> queue=new ArrayList<>(), later=new ArrayList<>(); public Handler(Looper l){}
 public boolean post(Runnable r){queue.add(r);return true;} public boolean postDelayed(Runnable r,long ms){later.add(r);return true;}
 public void removeCallbacks(Runnable r){queue.remove(r);later.remove(r);} public static void flush(){while(!queue.isEmpty())queue.remove(0).run();}
 public static void expire(){for(Runnable r:new ArrayList<>(later))r.run();flush();} }''',
'android/os/Bundle.java': '''package android.os; import java.util.*; public class Bundle {
 public ArrayList<String> words; public ArrayList<String> getStringArrayList(String key){return words;}
}''',
'android/content/Intent.java': '''package android.content; public class Intent { public Intent(String s){}
 public Intent putExtra(String a,String b){return this;} public Intent putExtra(String a,int b){return this;} public Intent putExtra(String a,boolean b){return this;} }''',
'android/speech/SpeechRecognizer.java': '''package android.speech; import android.content.*; public class SpeechRecognizer {
 public static boolean available=true; public static int starts; public static SpeechRecognizer last; public RecognitionListener listener; public boolean destroyed;
 public static boolean isRecognitionAvailable(Context c){return available;} public static SpeechRecognizer createSpeechRecognizer(Context c){last=new SpeechRecognizer();return last;}
 public void setRecognitionListener(RecognitionListener r){listener=r;} public void startListening(Intent i){starts++;listener.onReadyForSpeech(null);}
 public void cancel(){listener.onError(5);} public void destroy(){destroyed=true;} }''',
'android/speech/tts/UtteranceProgressListener.java': '''package android.speech.tts; public abstract class UtteranceProgressListener {
 public abstract void onStart(String id); public abstract void onDone(String id); public abstract void onError(String id);
 public void onError(String id,int code){onError(id);} public void onStop(String id,boolean interrupted){} }''',
'org/json/JSONArray.java': '''package org.json; import java.util.*; public class JSONArray {
 public List<Object> values=new ArrayList<>(); public JSONArray put(Object v){values.add(v);return this;} public int length(){return values.size();} }''',
'android/speech/tts/Voice.java': '''package android.speech.tts; import java.util.*; public class Voice {
 private String name; private Locale locale; private boolean network;
 public Voice(String n,Locale l,boolean r){name=n;locale=l;network=r;} public String getName(){return name;}
 public Locale getLocale(){return locale;} public boolean isNetworkConnectionRequired(){return network;} }''',
'android/speech/tts/TextToSpeech.java': '''package android.speech.tts; import android.content.*; import android.os.*; import java.util.*; public class TextToSpeech {
 public interface OnInitListener { void onInit(int status); } public static int initStatus=0,language=0,result=0; public static TextToSpeech last;
 public UtteranceProgressListener listener; public String id; public boolean shutdown; public Voice chosen; public float rate; public int voiceResult=0,rateResult=0;
 public TextToSpeech(Context c,OnInitListener l){last=this;l.onInit(initStatus);} public int setLanguage(Locale l){chosen=null;return language;} public int setSpeechRate(float f){rate=f;return rateResult;}
 public Set<Voice> getVoices(){return new HashSet<>(Arrays.asList(new Voice("fr-local",Locale.FRANCE,false),new Voice("fr-network",Locale.CANADA_FRENCH,true),new Voice("en",Locale.US,false)));}
 public int setVoice(Voice v){chosen=v;return voiceResult;}
 public int setOnUtteranceProgressListener(UtteranceProgressListener l){listener=l;return 0;} public static int getMaxSpeechInputLength(){return 4000;}
 public int speak(CharSequence text,int mode,Bundle params,String id){this.id=id;return result;}
 public int stop(){if(listener!=null&&id!=null)listener.onStop(id,true);return 0;} public void shutdown(){shutdown=true;} }''',
'com/getcapacitor/JSObject.java': '''package com.getcapacitor; import java.util.*; public class JSObject {
 public Map<String,Object> values=new HashMap<>(); public JSObject put(String k,Object v){values.put(k,v);return this;} public JSObject put(String k,int v){values.put(k,v);return this;}
 public JSObject put(String k,boolean v){values.put(k,v);return this;} public JSObject put(String k,String v){values.put(k,v);return this;} }''',
'com/getcapacitor/PermissionState.java': '''package com.getcapacitor; public enum PermissionState { GRANTED,DENIED,PROMPT; public String toString(){return name().toLowerCase();} }''',
'com/getcapacitor/PluginCall.java': '''package com.getcapacitor; import java.util.*; public class PluginCall {
 public Map<String,String> input=new HashMap<>(); public int terminals; public String code; public JSObject output;
 public PluginCall(String id){input.put("requestId",id);} public String getString(String k,String fallback){return input.getOrDefault(k,fallback);}
 public Double getDouble(String k,Double fallback){return input.containsKey(k)?Double.valueOf(input.get(k)):fallback;} public void resolve(){resolve(null);} public void resolve(JSObject o){terminal();output=o;} public void reject(String message,String c){terminal();code=c;}
 private void terminal(){if(++terminals>1)throw new AssertionError("Call settled twice");} }''',
'com/getcapacitor/Plugin.java': '''package com.getcapacitor; import android.content.Context; public class Plugin {
 public PermissionState permission=PermissionState.GRANTED; public int requests; public JSObject event;
 public void load(){} public Context getContext(){return null;} public PermissionState getPermissionState(String s){return permission;}
 protected void requestPermissionForAlias(String alias,PluginCall call,String callback){requests++;}
 protected void notifyListeners(String name,JSObject obj){event=obj;} protected void handleOnStop(){} protected void handleOnDestroy(){} }''',
'app/jarvis/fitness/LifecycleTest.java': '''package app.jarvis.fitness;
import android.os.*; import android.speech.*; import android.speech.tts.*; import com.getcapacitor.*; import java.util.*;
public class LifecycleTest {
 static int tests; static void ok(boolean b){if(!b)throw new AssertionError("Native lifecycle case "+tests);}
 static JarvisSpeechPlugin plugin(){TextToSpeech.initStatus=0;TextToSpeech.language=0;TextToSpeech.result=0;SpeechRecognizer.available=true;
  JarvisSpeechPlugin p=new JarvisSpeechPlugin();p.load();Handler.flush();return p;}
 static PluginCall call(String s){return new PluginCall(s);} static PluginCall speech(){PluginCall c=call("say");c.input.put("text","Bonjour");return c;}
 static void permission(JarvisSpeechPlugin p,PluginCall c)throws Exception {java.lang.reflect.Method m=JarvisSpeechPlugin.class.getDeclaredMethod("microphoneResult",PluginCall.class);m.setAccessible(true);m.invoke(p,c);Handler.flush();}
 static void close(JarvisSpeechPlugin p){p.handleOnDestroy();Handler.flush();}
 public static void main(String[] args)throws Exception {
  {tests++;JarvisSpeechPlugin p=plugin();p.permission=PermissionState.PROMPT;PluginCall d=call("diag");p.diagnostics(d);Handler.flush();ok(p.requests==0);ok(d.output.values.get("protocolVersion").equals(2));ok(d.output.values.get("offlineGuaranteed").equals(false));close(p);}
  {tests++;JarvisSpeechPlugin p=plugin();p.permission=PermissionState.PROMPT;int starts=SpeechRecognizer.starts;PluginCall l=call("pending");p.listen(l);Handler.flush();ok(p.requests==1);p.cancelListen(call("cancel"));Handler.flush();ok(l.code.equals("CANCELLED"));p.permission=PermissionState.GRANTED;permission(p,l);ok(SpeechRecognizer.starts==starts);ok(l.terminals==1);close(p);}
  {tests++;JarvisSpeechPlugin p=plugin();p.permission=PermissionState.PROMPT;PluginCall l=call("deny");p.listen(l);Handler.flush();p.permission=PermissionState.DENIED;permission(p,l);ok(l.code.equals("PERMISSION_DENIED"));close(p);}
  {tests++;JarvisSpeechPlugin p=plugin();PluginCall l=call("recognize");p.listen(l);Handler.flush();SpeechRecognizer r=SpeechRecognizer.last;
   ok(p.event.values.get("requestId").equals("recognize"));r.listener.onEndOfSpeech();ok(p.event.values.get("state").equals("processing"));
   Bundle data=new Bundle();data.words=new ArrayList<>(Arrays.asList("Bonjour"));r.listener.onResults(data);ok(l.output.values.get("text").equals("Bonjour"));ok(r.destroyed);r.listener.onError(7);ok(l.terminals==1);close(p);}
  {tests++;JarvisSpeechPlugin p=plugin();PluginCall l=call("busy");p.listen(l);Handler.flush();PluginCall second=call("second");p.listen(second);Handler.flush();ok(second.code.equals("BUSY"));
   Handler.expire();ok(l.code.equals("TIMEOUT"));ok(SpeechRecognizer.last.destroyed);close(p);}
  {tests++;JarvisSpeechPlugin p=plugin();PluginCall l=call("background");p.listen(l);Handler.flush();p.handleOnStop();Handler.flush();ok(l.code.equals("BACKGROUND"));ok(SpeechRecognizer.last.destroyed);close(p);}
  {tests++;JarvisSpeechPlugin p=plugin();PluginCall s=speech();p.speak(s);Handler.flush();ok(s.terminals==0);TextToSpeech engine=TextToSpeech.last;engine.listener.onDone(engine.id);Handler.flush();ok(s.terminals==1&&s.code==null);engine.listener.onError(engine.id);Handler.flush();ok(s.terminals==1);close(p);ok(engine.shutdown);}
  {tests++;JarvisSpeechPlugin p=plugin();PluginCall s=speech();p.speak(s);Handler.flush();String old=TextToSpeech.last.id;p.stopSpeech(call("stop"));Handler.flush();ok(s.code.equals("CANCELLED"));PluginCall next=speech();p.speak(next);Handler.flush();TextToSpeech.last.listener.onDone(old);Handler.flush();ok(next.terminals==0);Handler.expire();ok(next.code.equals("TIMEOUT"));close(p);}
  {tests++;JarvisSpeechPlugin p=plugin();PluginCall s=speech();p.speak(s);Handler.flush();PluginCall l=call("no-overlap");p.listen(l);Handler.flush();ok(s.code.equals("CANCELLED"));PluginCall conflict=speech();p.speak(conflict);Handler.flush();ok(conflict.code.equals("BUSY"));close(p);ok(l.code.equals("CANCELLED"));}
  {tests++;TextToSpeech.language=-1;JarvisSpeechPlugin p=new JarvisSpeechPlugin();p.load();Handler.flush();PluginCall s=speech();p.speak(s);Handler.flush();ok(s.code.equals("LANGUAGE_UNAVAILABLE"));close(p);}
  {tests++;TextToSpeech.initStatus=-1;JarvisSpeechPlugin p=new JarvisSpeechPlugin();p.load();Handler.flush();PluginCall s=speech();p.speak(s);Handler.flush();ok(s.code.equals("TTS_ERROR"));close(p);}
  {tests++;JarvisSpeechPlugin p=plugin();TextToSpeech.result=-1;PluginCall s=speech();p.speak(s);Handler.flush();ok(s.code.equals("TTS_ERROR"));close(p);}
  {tests++;JarvisSpeechPlugin p=plugin();SpeechRecognizer.available=false;PluginCall l=call("no-service");p.listen(l);Handler.flush();ok(l.code.equals("SERVICE_UNAVAILABLE"));close(p);}
  {tests++;int[] codes={9,6,7,2,1,3,8,10,12,13};String[] expected={"PERMISSION_DENIED","NO_SPEECH","NO_MATCH","NETWORK","NETWORK","AUDIO","BUSY","BUSY","LANGUAGE_UNAVAILABLE","LANGUAGE_UNAVAILABLE"};for(int i=0;i<codes.length;i++)ok(JarvisSpeechPlugin.recognitionError(codes[i]).equals(expected[i]));}
  {tests++;JarvisSpeechPlugin p=plugin();PluginCall d=call("voices");p.diagnostics(d);Handler.flush();ok(d.output.values.get("voiceOptionsVersion").equals(1));
   org.json.JSONArray voices=(org.json.JSONArray)d.output.values.get("voices");ok(voices.length()==2);boolean network=false;
   for(Object row:voices.values){JSObject v=(JSObject)row;ok(((String)v.values.get("lang")).startsWith("fr-"));if(v.values.get("networkRequired").equals(true))network=true;}ok(network);close(p);}
  {tests++;JarvisSpeechPlugin p=plugin();PluginCall s=speech();s.input.put("voiceId","fr-network");s.input.put("rate","1.2");p.speak(s);Handler.flush();TextToSpeech engine=TextToSpeech.last;
   ok(engine.chosen.getName().equals("fr-network"));ok(Math.abs(engine.rate-1.2f)<0.001);engine.listener.onDone(engine.id);Handler.flush();ok(s.code==null&&s.terminals==1);
   PluginCall defaults=speech();p.speak(defaults);Handler.flush();ok(engine.chosen==null);ok(Math.abs(engine.rate-0.98f)<0.001);close(p);}
  {tests++;for(String name:new String[]{"deleted","en"}){JarvisSpeechPlugin p=plugin();PluginCall s=speech();s.input.put("voiceId",name);p.speak(s);Handler.flush();ok(s.code.equals("VOICE_UNAVAILABLE"));ok(TextToSpeech.last.id==null);close(p);}}
  {tests++;for(String rate:new String[]{"NaN","Infinity","0.1","4"}){JarvisSpeechPlugin p=plugin();PluginCall s=speech();s.input.put("rate",rate);p.speak(s);Handler.flush();ok(s.code.equals("INVALID_RATE"));ok(TextToSpeech.last.id==null);close(p);}}
  {tests++;JarvisSpeechPlugin p=plugin();TextToSpeech.last.voiceResult=-1;PluginCall s=speech();s.input.put("voiceId","fr-local");p.speak(s);Handler.flush();ok(s.code.equals("VOICE_UNAVAILABLE"));close(p);}
  {tests++;JarvisSpeechPlugin p=plugin();TextToSpeech.last.rateResult=-1;PluginCall s=speech();p.speak(s);Handler.flush();ok(s.code.equals("TTS_ERROR"));close(p);}
  System.out.println(tests+" native lifecycle scenarios passed with simulated services (NOT a device test).");
 }
}'''
}
for name, source in SOURCES.items():
    file = OUT / 'src' / name
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(source)
classes = OUT / 'classes'
classes.mkdir()
# Optional DEX->JAR round-trip of the packaged plugin; still a host simulation.
host_classes = os.environ.get('NATIVE_HOST_CLASSES', REPORT['output'])
assert pathlib.Path(host_classes).exists(), 'Missing host classes'
cp = os.pathsep.join([host_classes, str(TOOLS / 'android.jar'), str(TOOLS / 'reference-classes.jar')])
subprocess.run([JAVA, '-cp', str(TOOLS / 'ecj.jar'), 'org.eclipse.jdt.internal.compiler.batch.Main', '-source', '1.8', '-target', '1.8', '-proc:none', '-classpath', cp, '-d', str(classes), *[str(p) for p in (OUT / 'src').rglob('*.java')]], check=True)
subprocess.run([JAVA, '-cp', os.pathsep.join([str(classes), cp]), 'app.jarvis.fitness.LifecycleTest'], check=True)
