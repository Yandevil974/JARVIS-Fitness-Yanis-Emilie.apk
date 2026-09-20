package app.jarvis.fitness;

import android.Manifest;
import android.content.Intent;
import android.os.Build;
import android.provider.Settings;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(name="JarvisReminders", permissions={@Permission(alias="notifications", strings={Manifest.permission.POST_NOTIFICATIONS})})
public class JarvisRemindersPlugin extends Plugin {
    @PluginMethod public void begin(PluginCall call) {
        JSObject result=new JSObject();result.put("protocol",1);result.put("token",ReminderScheduler.begin());call.resolve(result);
    }
    @PluginMethod public void status(PluginCall call) {
        try { ReminderScheduler.reconcile(getContext(),false);call.resolve(JSObject.fromJSONObject(ReminderScheduler.status(getContext()))); }
        catch(Exception e) { call.reject("Impossible de vérifier la programmation Android.","SCHEDULING_ERROR"); }
    }
    @PluginMethod public void replace(PluginCall call) {
        try { call.resolve(JSObject.fromJSONObject(ReminderScheduler.replace(getContext(),call.getString("token"),call.getData().getLong("revision"),call.getArray("jobs")))); }
        catch(Exception e) { call.reject("Programmation refusée ou non sauvegardée. Rouvre l’application et vérifie les rappels.","SCHEDULING_ERROR"); }
    }
    @PluginMethod public void setEnabled(PluginCall call) {
        try { call.resolve(JSObject.fromJSONObject(ReminderScheduler.enable(getContext(),call.getString("token"),call.getData().getLong("revision"),call.getString("profile"),call.getData().getBoolean("enabled")))); }
        catch(Exception e) { call.reject("Réglage non confirmé. Vérifie l’autorisation Android et réessaie.","CONSENT_ERROR"); }
    }
    @PluginMethod public void requestPermission(PluginCall call) {
        if(Build.VERSION.SDK_INT<33 || getContext().checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)==android.content.pm.PackageManager.PERMISSION_GRANTED) {status(call);return;}
        requestPermissionForAlias("notifications",call,"notificationPermission");
    }
    @PermissionCallback private void notificationPermission(PluginCall call) { status(call); }
    @PluginMethod public void test(PluginCall call) {
        try { call.resolve(JSObject.fromJSONObject(ReminderScheduler.test(getContext()))); }
        catch(Exception e) { call.reject("Notification de test non envoyée. Vérifie les réglages Android.","NOTIFICATIONS_DISABLED"); }
    }
    @PluginMethod public void openSettings(PluginCall call) {
        try {
            Intent i=new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            i.putExtra(Settings.EXTRA_APP_PACKAGE,getContext().getPackageName());
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);getContext().startActivity(i);status(call);
        } catch(Exception e) { call.reject("Ouvre les notifications de cette application dans les paramètres Android.","SETTINGS_UNAVAILABLE"); }
    }
}
