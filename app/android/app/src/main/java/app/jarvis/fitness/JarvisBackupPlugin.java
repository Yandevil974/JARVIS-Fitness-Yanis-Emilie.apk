package app.jarvis.fitness;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.JSObject;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.InputStream;
import java.io.File;
import java.io.FileOutputStream;
@CapacitorPlugin(name="JarvisBackup")
public class JarvisBackupPlugin extends Plugin {
    @PluginMethod public void readBundled(PluginCall call){
        File file=new File(getContext().getFilesDir(),"bundled-yanis-backup.json");
        try(InputStream input=getContext().getAssets().open("restoration/yanis-profile.json");FileOutputStream output=new FileOutputStream(file)){
            byte[] buffer=new byte[8192];int count;while((count=input.read(buffer))!=-1)output.write(buffer,0,count);
            output.flush();
            JSObject result=new JSObject();result.put("uri",android.net.Uri.fromFile(file).toString());call.resolve(result);
        }catch(Exception error){call.resolve(new JSObject());}
    }
}
