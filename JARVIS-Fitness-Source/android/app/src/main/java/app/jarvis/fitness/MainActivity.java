package app.jarvis.fitness;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
public class MainActivity extends BridgeActivity {
    @Override public void onCreate(Bundle savedInstanceState){
        registerPlugin(JarvisSpeechPlugin.class);
        registerPlugin(JarvisBackupPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
