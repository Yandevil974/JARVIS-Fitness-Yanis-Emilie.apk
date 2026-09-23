package app.jarvis.fitness;

import android.Manifest;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import org.json.JSONArray;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.Locale;
import java.util.HashSet;
import java.util.UUID;

/** Durable minimal state; serialized across bridge calls and system broadcasts.
 * One inexact alarm, device-local consent, no exact-alarm/network/service permission.
 * Wall-clock dates are re-evaluated after timezone/time changes and reboot.
 */
public final class ReminderScheduler {
    static final String CHANNEL = "yanis_private_followup_v1";
    static final int ALARM = 7010, DISPLAY = 7010, TEST = 7011;
    static String token;
    static long revision;
    static final long DAY = 86400000L;
    private ReminderScheduler() {}
    static SharedPreferences prefs(Context c) { return c.getSharedPreferences("yanis_reminders_v1", Context.MODE_PRIVATE); }
    static NotificationManager manager(Context c) { return (NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE); }
    static void channel(Context c) {
        NotificationChannel ch = new NotificationChannel(CHANNEL, "Rappels discrets de suivi", NotificationManager.IMPORTANCE_DEFAULT);
        ch.setDescription("Bilans et séances, sans données personnelles à l’écran verrouillé");
        ch.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
        manager(c).createNotificationChannel(ch);
    }
    static boolean allowed(Context c) {
        channel(c);
        if (Build.VERSION.SDK_INT >= 33 && c.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) return false;
        NotificationChannel ch = manager(c).getNotificationChannel(CHANNEL);
        return manager(c).areNotificationsEnabled() && ch != null && ch.getImportance() != NotificationManager.IMPORTANCE_NONE;
    }
    static boolean profile(String p) { return "elite".equals(p) || "emilie".equals(p); }
    static long at(String date, int minute) throws Exception {
        if (date == null || !date.matches("[0-9]{4}-[0-9]{2}-[0-9]{2}") || minute < 0 || minute > 1439) throw new IllegalArgumentException("Invalid date/time");
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.ROOT);
        format.setLenient(false);
        String text = date + String.format(Locale.ROOT, " %02d:%02d", minute / 60, minute % 60);
        Date parsed = format.parse(text);
        if (!format.format(parsed).equals(text)) throw new IllegalArgumentException("Invalid wall-clock date");
        return parsed.getTime();
    }
    static JSONArray jobs(Context c) throws Exception { return new JSONArray(prefs(c).getString("jobs", "[]")); }
    static JSONObject fired(Context c) throws Exception { return new JSONObject(prefs(c).getString("fired", "{}")); }
    static PendingIntent alarm(Context c) {
        Intent i = new Intent(c, ReminderReceiver.class).setAction(c.getPackageName() + ".FOLLOWUP");
        return PendingIntent.getBroadcast(c, ALARM, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }
    static void persist(SharedPreferences.Editor editor) {
        if (!editor.commit()) throw new IllegalStateException("Les rappels n’ont pas pu être sauvegardés.");
    }
    static void guard(String t, long r) {
        if (token == null || !token.equals(t) || r <= revision) throw new IllegalArgumentException("Programmation périmée : rouvre l’application.");
    }
    public static synchronized String begin() { token = UUID.randomUUID().toString(); revision = 0; return token; }
    static JSONArray validate(JSONArray input) throws Exception {
        if (input == null || input.length() > 128) throw new IllegalArgumentException("Invalid reminder count");
        JSONArray clean = new JSONArray(); HashSet<String> keys = new HashSet<>(); long now = System.currentTimeMillis();
        for (int n=0; n<input.length(); n++) {
            JSONObject j = input.getJSONObject(n);
            if (j.length() != 6 || !profile(j.getString("profile")) || !j.getString("key").matches("[0-9a-f]{64}") || !keys.add(j.getString("key"))) throw new IllegalArgumentException("Invalid reminder identity");
            for (String field : new String[]{"minute", "expiryMinute"}) {
                Object v = j.get(field); if (!(v instanceof Number) || ((Number)v).doubleValue() != j.getInt(field)) throw new IllegalArgumentException("Invalid minute");
            }
            long due = at(j.getString("date"), j.getInt("minute"));
            long expiry = at(j.getString("expiryDate"), j.getInt("expiryMinute"));
            if (due > now + 92*DAY || due < now - 3*DAY || expiry <= due || expiry > due + 3*DAY) throw new IllegalArgumentException("Invalid reminder window");
            clean.put(new JSONObject(j.toString()));
        }
        return clean;
    }
    public static synchronized JSONObject replace(Context c, String t, long r, JSONArray input) throws Exception {
        guard(t,r); JSONArray clean = validate(input);
        persist(prefs(c).edit().putString("jobs", clean.toString())); revision = r;
        manager(c).cancel(DISPLAY); // stale notification content never survives reconciliation
        reconcile(c, false);
        return status(c);
    }
    public static synchronized JSONObject enable(Context c, String t, long r, String p, boolean on) throws Exception {
        guard(t,r); if (!profile(p)) throw new IllegalArgumentException("Invalid profile");
        if (on && !allowed(c)) throw new IllegalStateException("Autorise d’abord les notifications dans Android.");
        persist(prefs(c).edit().putBoolean("enabled_"+p, on)); revision = r;
        manager(c).cancel(DISPLAY);
        if (!on) manager(c).cancel(TEST);
        reconcile(c, false); return status(c);
    }
    public static synchronized JSONObject status(Context c) throws Exception {
        boolean permission = allowed(c); JSONArray jobs = jobs(c); JSONObject fired = fired(c);
        int count=0; long next=Long.MAX_VALUE, now=System.currentTimeMillis();
        for (int n=0;n<jobs.length();n++) {
            JSONObject j=jobs.getJSONObject(n);
            try {
                long due=at(j.getString("date"),j.getInt("minute")), expiry=at(j.getString("expiryDate"),j.getInt("expiryMinute"));
                if(permission && prefs(c).getBoolean("enabled_"+j.getString("profile"),false) && !fired.has(j.getString("key")) && expiry>now) {count++;next=Math.min(next,Math.max(due,now));}
            } catch (java.text.ParseException | IllegalArgumentException invalidWallTime) { /* DST gap: never guess an earlier time. */ }
        }
        JSONObject enabled=new JSONObject(); enabled.put("elite",prefs(c).getBoolean("enabled_elite",false)); enabled.put("emilie",prefs(c).getBoolean("enabled_emilie",false));
        JSONObject out=new JSONObject(); out.put("protocol",1);out.put("permission",permission);out.put("enabled",enabled);out.put("scheduled",count);out.put("next",next==Long.MAX_VALUE ? 0 : next);return out;
    }
    public static synchronized void reconcile(Context c, boolean deliver) throws Exception {
        AlarmManager alarms=(AlarmManager)c.getSystemService(Context.ALARM_SERVICE);
        PendingIntent alarm=alarm(c); alarms.cancel(alarm);
        if (!allowed(c)) { manager(c).cancel(DISPLAY); manager(c).cancel(TEST); return; }
        JSONArray jobs=jobs(c); JSONObject fired=fired(c); HashSet<String> current=new HashSet<>();
        long now=System.currentTimeMillis(), next=Long.MAX_VALUE, displayExpiry=now+2*DAY; boolean notify=false;
        for(int n=0;n<jobs.length();n++) {
            JSONObject j=jobs.getJSONObject(n);String key=j.getString("key");current.add(key);
            if(!prefs(c).getBoolean("enabled_"+j.getString("profile"),false) || fired.has(key)) continue;
            try {
                long due=at(j.getString("date"),j.getInt("minute")), expiry=at(j.getString("expiryDate"),j.getInt("expiryMinute"));
                if(expiry<=now) continue;
                if(deliver && due<=now) { fired.put(key,now);notify=true;displayExpiry=Math.min(displayExpiry,expiry); }
                else next=Math.min(next,Math.max(now+5000,due));
            } catch (java.text.ParseException | IllegalArgumentException invalidWallTime) { /* Invalid timezone-local clock: skip, not crash or shift. */ }
        }
        Iterator<String> it=fired.keys();
        while(it.hasNext()) { String key=it.next(); if(!current.contains(key) && fired.optLong(key)<now-90*DAY) it.remove(); }
        // Bound history without evicting current reminders (including undated first check-ins).
        while(fired.length()>512) {
            String oldest=null;long time=Long.MAX_VALUE;it=fired.keys();
            while(it.hasNext()) {String key=it.next();if(!current.contains(key)&&fired.optLong(key)<time){oldest=key;time=fired.optLong(key);}}
            if(oldest==null) break;fired.remove(oldest);
        }
        // Commit deduplication BEFORE notifying: at-most-once attempts, not proof of delivery.
        persist(prefs(c).edit().putString("fired",fired.toString()));
        if(notify) show(c,DISPLAY,false,Math.max(1000,displayExpiry-now));
        if(next!=Long.MAX_VALUE) alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,next,alarm);
    }
    static void show(Context c, int id, boolean test, long timeout) {
        if(!allowed(c)) throw new IllegalStateException("Notifications désactivées dans Android.");
        Intent open=c.getPackageManager().getLaunchIntentForPackage(c.getPackageName());
        PendingIntent content=PendingIntent.getActivity(c,id,open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
        Notification.Builder b=new Notification.Builder(c,CHANNEL).setSmallIcon(android.R.drawable.ic_popup_reminder)
            .setContentTitle("Yanis Fitness Evolution").setContentText(test ? "Notification de test — aucun bilan validé." : "Un point t’attend dans ton suivi.")
            .setTimeoutAfter(timeout).setVisibility(Notification.VISIBILITY_PRIVATE).setAutoCancel(true).setOnlyAlertOnce(true)
            .setContentIntent(content).setCategory(Notification.CATEGORY_REMINDER);
        manager(c).notify(id,b.build());
    }
    public static synchronized JSONObject test(Context c) throws Exception { show(c,TEST,true,60000);return status(c); }
}
