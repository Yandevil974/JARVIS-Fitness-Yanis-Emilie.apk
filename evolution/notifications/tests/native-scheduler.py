"""Execute production API-compiled (or packaged DEX-converted) scheduler with explicit
Android service doubles and real JSON parsing. NOT a device/emulator test.
"""
import hashlib, json, os, pathlib, subprocess, tempfile
ROOT=pathlib.Path(__file__).resolve().parents[3]
TOOLS=ROOT/'.cache/voice-native'
JAVA=str(ROOT/'.cache/java-tools/jdk4py/java-runtime/bin/java')
REPORT=json.loads((ROOT/'.cache/notifications-native/compile-report.json').read_text())
for item in REPORT['sources']: assert hashlib.sha256((ROOT/item['path']).read_bytes()).hexdigest()==item['sha256']
JSON_ARCHIVE=ROOT/'.cache/notifications-native/json.tar.gz'
assert hashlib.sha256(JSON_ARCHIVE.read_bytes()).hexdigest()=='64c481f11f667252bd02dc13a0b8ed13ab6b2b7ab99466c0dcf69fd1a57b6e3d'
OUT=pathlib.Path(tempfile.mkdtemp(prefix='host-',dir=ROOT/'.cache/notifications-native'))
SOURCES={
'android/os/Build.java':'''package android.os; public class Build {public static class VERSION {public static int SDK_INT=34;}}''',
'android/content/SharedPreferences.java':'''package android.content; public interface SharedPreferences {
 String getString(String k,String fallback);boolean getBoolean(String k,boolean fallback);Editor edit();
 public interface Editor {Editor putString(String k,String v);Editor putBoolean(String k,boolean v);boolean commit();}
}''',
'android/content/Context.java':'''package android.content; import java.util.*; import android.app.*;import android.content.pm.*;
public class Context {public boolean permission=false;public Memory memory=new Memory();public AlarmManager alarms=new AlarmManager();public NotificationManager notifications=new NotificationManager();
 public Object getSystemService(String n){return n.equals("alarm")?alarms:notifications;}public SharedPreferences getSharedPreferences(String n,int mode){return memory;}
 public int checkSelfPermission(String p){return permission?0:-1;}public String getPackageName(){return "app.yanis.fitness.evolution";}public PackageManager getPackageManager(){return new PackageManager();}
 public static class Memory implements SharedPreferences {public Map<String,Object> map=new HashMap<>();public boolean fail;
 public String getString(String k,String d){return (String)map.getOrDefault(k,d);}public boolean getBoolean(String k,boolean d){return (Boolean)map.getOrDefault(k,d);}
 public Editor edit(){return new Write(this);} }
 public static class Write implements SharedPreferences.Editor {Memory m;Map<String,Object> patch=new HashMap<>();Write(Memory m){this.m=m;}
 public SharedPreferences.Editor putString(String k,String v){patch.put(k,v);return this;}public SharedPreferences.Editor putBoolean(String k,boolean v){patch.put(k,v);return this;}
 public boolean commit(){if(m.fail)return false;m.map.putAll(patch);return true;}}
}''',
'android/content/pm/PackageManager.java':'''package android.content.pm;import android.content.Intent;public class PackageManager {public Intent getLaunchIntentForPackage(String p){return new Intent(p);}}''',
'android/content/Intent.java':'''package android.content;public class Intent {String action;public Intent(String s){action=s;}public Intent(Context c,Class<?> k){}public Intent setAction(String s){action=s;return this;}public String getAction(){return action;}}''',
'android/content/BroadcastReceiver.java':'''package android.content;public abstract class BroadcastReceiver {public abstract void onReceive(Context c,Intent i);}''',
'android/util/Log.java':'''package android.util;public class Log {public static int w(String t,String m){return 0;}}''',
'android/app/PendingIntent.java':'''package android.app;import android.content.*;public class PendingIntent {public static PendingIntent getBroadcast(Context c,int id,Intent i,int flags){return new PendingIntent();}public static PendingIntent getActivity(Context c,int id,Intent i,int flags){return new PendingIntent();}}''',
'android/app/AlarmManager.java':'''package android.app;public class AlarmManager {public long next;public int calls;public void cancel(PendingIntent p){next=0;}public void setAndAllowWhileIdle(int type,long at,PendingIntent p){next=at;calls++;}}''',
'android/app/NotificationChannel.java':'''package android.app;public class NotificationChannel {public int importance;public NotificationChannel(String id,CharSequence title,int importance){this.importance=importance;}public void setDescription(String s){}public void setLockscreenVisibility(int v){}public int getImportance(){return importance;}}''',
'android/app/NotificationManager.java':'''package android.app;public class NotificationManager {public boolean allowed=true;public NotificationChannel channel;public int deliveries,cancels;public Notification last;public int lastId;
 public void createNotificationChannel(NotificationChannel c){if(channel==null)channel=c;}public NotificationChannel getNotificationChannel(String id){return channel;}
 public boolean areNotificationsEnabled(){return allowed;}public void cancel(int id){cancels++;}public void notify(int id,Notification n){deliveries++;last=n;lastId=id;}}
''',
'android/app/Notification.java':'''package android.app;import android.content.Context;public class Notification {public String title,text;public int visibility;public long timeout;
 public static class Builder {Notification n=new Notification();public Builder(Context c,String id){}public Builder setSmallIcon(int i){return this;}public Builder setContentTitle(CharSequence s){n.title=s.toString();return this;}public Builder setContentText(CharSequence s){n.text=s.toString();return this;}
 public Builder setTimeoutAfter(long t){n.timeout=t;return this;}public Builder setVisibility(int v){n.visibility=v;return this;}public Builder setAutoCancel(boolean b){return this;}public Builder setOnlyAlertOnce(boolean b){return this;}public Builder setContentIntent(PendingIntent p){return this;}public Builder setCategory(String s){return this;}public Notification build(){return n;}}
}''',
'app/jarvis/fitness/SchedulerTest.java':'''package app.jarvis.fitness;
import android.content.*;import android.app.*;import org.json.*;import java.util.*;import java.text.*;
public class SchedulerTest {
 static int count;static long rev;static String token;
 static void ok(boolean v){if(!v)throw new AssertionError("Scenario "+count);}
 interface Action {void run()throws Exception;}
 static void rejects(Action a)throws Exception {boolean rejected=false;try{a.run();}catch(Exception e){rejected=true;}ok(rejected);}
 static Context context(){count++;rev=0;token=ReminderScheduler.begin();android.os.Build.VERSION.SDK_INT=34;return new Context();}
 static void grant(Context c)throws Exception{c.permission=true;ReminderScheduler.enable(c,token,++rev,"elite",true);}
 static JSONObject job(String p,String key,int offset)throws Exception {
  Calendar when=Calendar.getInstance();when.add(Calendar.MINUTE,offset);Calendar end=(Calendar)when.clone();end.add(Calendar.HOUR,2);
  JSONObject j=new JSONObject();j.put("profile",p);j.put("key",String.join("",Collections.nCopies(64,key)));
  j.put("date",new SimpleDateFormat("yyyy-MM-dd").format(when.getTime()));j.put("minute",when.get(Calendar.HOUR_OF_DAY)*60+when.get(Calendar.MINUTE));
  j.put("expiryDate",new SimpleDateFormat("yyyy-MM-dd").format(end.getTime()));j.put("expiryMinute",end.get(Calendar.HOUR_OF_DAY)*60+end.get(Calendar.MINUTE));return j;
 }
 static void replace(Context c,JSONObject... jobs)throws Exception{JSONArray a=new JSONArray();for(JSONObject j:jobs)a.put(j);ReminderScheduler.replace(c,token,++rev,a);}
 public static void main(String[] args)throws Exception {
  {Context c=context();replace(c,job("elite","a",60));ok(c.alarms.next==0);ok(!ReminderScheduler.status(c).getJSONObject("enabled").getBoolean("elite"));}
  {Context c=context();rejects(()->grantWithoutPermission(c));ok(c.alarms.next==0);}
  {Context c=context();grant(c);replace(c,job("elite","a",60));ok(c.alarms.next>System.currentTimeMillis());ok(c.notifications.deliveries==0);}
  {Context c=context();grant(c);replace(c,job("emilie","a",60));ok(c.alarms.next==0);}
  {Context c=context();grant(c);replace(c,job("elite","a",60));ReminderScheduler.enable(c,token,++rev,"elite",false);ok(c.alarms.next==0);ok(c.notifications.cancels>0);}
  {Context c=context();grant(c);replace(c,job("elite","a",60));replace(c);ok(c.alarms.next==0);}
  {Context c=context();grant(c);replace(c,job("elite","a",60));c.permission=false;ReminderScheduler.reconcile(c,false);ok(c.alarms.next==0);}
  {Context c=context();grant(c);replace(c,job("elite","a",60));c.notifications.channel.importance=0;ReminderScheduler.reconcile(c,false);ok(c.alarms.next==0);}
  {Context c=context();grant(c);replace(c,job("elite","a",-1));ReminderScheduler.reconcile(c,true);ok(c.notifications.deliveries==1);ReminderScheduler.reconcile(c,true);ok(c.notifications.deliveries==1);ok(c.alarms.next==0);}
  {Context c=context();grant(c);replace(c,job("elite","a",-1),job("elite","b",-1));ReminderScheduler.reconcile(c,true);ok(c.notifications.deliveries==1);ok(ReminderScheduler.fired(c).length()==2);ok(c.notifications.last.text.equals("Un point t’attend dans ton suivi."));ok(c.notifications.last.visibility==0);ok(c.notifications.last.timeout>0);}
  {Context c=context();grant(c);replace(c,job("elite","a",-180));ReminderScheduler.reconcile(c,true);ok(c.notifications.deliveries==0);ok(c.alarms.next==0);}
  {Context c=context();grant(c);replace(c,job("elite","a",60));String previous=ReminderScheduler.prefs(c).getString("jobs","");rejects(()->ReminderScheduler.replace(c,"old",100,new JSONArray()));ok(ReminderScheduler.prefs(c).getString("jobs","").equals(previous));}
  {Context c=context();grant(c);replace(c,job("elite","a",60));rejects(()->ReminderScheduler.replace(c,token,rev,new JSONArray()));}
  {Context c=context();grant(c);replace(c,job("elite","a",60));String previous=ReminderScheduler.prefs(c).getString("jobs","");c.memory.fail=true;rejects(()->replace(c));ok(ReminderScheduler.prefs(c).getString("jobs","").equals(previous));}
  {Context c=context();grant(c);JSONObject j=job("elite","a",60);j.put("text","PRIVATE");rejects(()->replace(c,j));ok(c.alarms.next==0);}
  {Context c=context();grant(c);JSONObject j=job("elite","a",60);rejects(()->replace(c,j,j));}
  {Context c=context();grant(c);JSONObject j=job("elite","a",60);j.put("date","2026-02-30");rejects(()->replace(c,j));}
  {Context c=context();grant(c);JSONObject j=job("elite","a",60);j.put("minute",18.5);rejects(()->replace(c,j));}
  {Context c=context();grant(c);replace(c,job("elite","a",60));Context reopened=new Context();reopened.memory=c.memory;reopened.permission=true;ReminderScheduler.token=null;new ReminderReceiver().onReceive(reopened,new Intent("android.intent.action.BOOT_COMPLETED"));ok(reopened.alarms.next>0);ok(reopened.notifications.deliveries==0);}
  {Context c=context();grant(c);replace(c,job("elite","a",-1));ReminderScheduler.reconcile(c,true);Context reopened=new Context();reopened.memory=c.memory;reopened.permission=true;ReminderScheduler.token=null;new ReminderReceiver().onReceive(reopened,new Intent("app.yanis.fitness.evolution.FOLLOWUP"));ok(reopened.notifications.deliveries==0);}
  {Context c=context();grant(c);replace(c,job("elite","a",60));int calls=c.alarms.calls;new ReminderReceiver().onReceive(c,new Intent("untrusted.action"));ok(c.alarms.calls==calls);new ReminderReceiver().onReceive(c,new Intent("android.intent.action.TIMEZONE_CHANGED"));ok(c.alarms.calls>calls);}
  {Context c=context();c.permission=true;ReminderScheduler.test(c);ok(c.notifications.deliveries==1);ok(ReminderScheduler.jobs(c).length()==0);ok(ReminderScheduler.fired(c).length()==0);ok(!ReminderScheduler.status(c).getJSONObject("enabled").getBoolean("elite"));}
  {Context c=context();rejects(()->ReminderScheduler.test(c));ok(c.notifications.deliveries==0);}
  {Context c=context();android.os.Build.VERSION.SDK_INT=26;ReminderScheduler.enable(c,token,++rev,"elite",true);replace(c,job("elite","a",60));ok(c.alarms.next>0);}
  {Context c=context();grant(c);JSONObject j=job("elite","a",60);replace(c,j);long first=c.alarms.next;TimeZone old=TimeZone.getDefault();try{TimeZone.setDefault(TimeZone.getTimeZone("Pacific/Honolulu"));ReminderScheduler.reconcile(c,false);ok(c.alarms.next!=first);}finally{TimeZone.setDefault(old);}}
  System.out.println(count+" notification scenarios passed with simulated Android services; NOT a device test.");
 }
 static void grantWithoutPermission(Context c)throws Exception{ReminderScheduler.enable(c,token,++rev,"elite",true);}
}'''
}
for name,source in SOURCES.items():
    p=OUT/'src'/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(source.replace(";ok(", ";\n ok("))
classes=OUT/'classes';classes.mkdir()
host=os.environ.get('NOTIFICATIONS_HOST_CLASSES',REPORT['output'])
cp=os.pathsep.join([host,str(TOOLS/'android.jar'),str(TOOLS/'reference-classes.jar')])
json_sources=sorted(next((ROOT/'.cache/notifications-native').glob('stleary-JSON-java-*')).glob('src/main/java/org/json/*.java'))
subprocess.run([JAVA,'-cp',str(TOOLS/'ecj.jar'),'org.eclipse.jdt.internal.compiler.batch.Main','-encoding','UTF-8','-source','1.8','-target','1.8','-proc:none','-nowarn','-classpath',cp,'-d',str(classes),*[str(p) for p in (OUT/'src').rglob('*.java')],*[str(p) for p in json_sources]],check=True)
subprocess.run([JAVA,'-cp',os.pathsep.join([str(classes),cp]),'app.jarvis.fitness.SchedulerTest'],check=True)
