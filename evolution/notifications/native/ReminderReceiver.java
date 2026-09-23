package app.jarvis.fitness;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Manifest receiver; exported=false. Only explicit app alarms and system broadcasts. */
public class ReminderReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context c, Intent intent) {
        if(intent==null) return;
        String action=intent.getAction();
        boolean alarm=(c.getPackageName()+".FOLLOWUP").equals(action);
        if(!alarm && !Intent.ACTION_BOOT_COMPLETED.equals(action) && !Intent.ACTION_MY_PACKAGE_REPLACED.equals(action)
            && !Intent.ACTION_TIME_CHANGED.equals(action) && !Intent.ACTION_TIMEZONE_CHANGED.equals(action)) return;
        try { ReminderScheduler.reconcile(c,alarm); }
        catch(Exception error) { // No personal payload or exception message in logs.
            android.util.Log.w("YanisReminders","Rappels non reprogrammés : ouvrir l’application pour vérifier.");
        }
    }
}
