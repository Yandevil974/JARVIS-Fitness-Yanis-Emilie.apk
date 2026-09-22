package app.jarvis.fitness;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.speech.RecognizerIntent;
import android.speech.tts.TextToSpeech;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PermissionState;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.util.ArrayList;
import java.util.Locale;

@CapacitorPlugin(name="JarvisSpeech", permissions={@Permission(alias="microphone", strings={Manifest.permission.RECORD_AUDIO})})
public class JarvisSpeechPlugin extends Plugin {
    private TextToSpeech engine;
    private boolean ready=false;
    private String pending=null;
    @Override public void load(){
        getActivity().runOnUiThread(()->{
            engine=new TextToSpeech(getContext(), status->{
                if(status==TextToSpeech.SUCCESS){ready=true;engine.setLanguage(Locale.FRANCE);engine.setSpeechRate(0.98f);if(pending!=null){engine.speak(pending,TextToSpeech.QUEUE_FLUSH,null,"jarvis");pending=null;}}
            });
        });
    }
    @PluginMethod public void speak(PluginCall call){
        final String text=call.getString("text","");
        getActivity().runOnUiThread(()->{if(ready&&engine!=null)engine.speak(text,TextToSpeech.QUEUE_FLUSH,null,"jarvis");else pending=text;call.resolve();});
    }
    @PluginMethod public void listen(PluginCall call){
        if(getPermissionState("microphone")!=PermissionState.GRANTED){requestPermissionForAlias("microphone",call,"microphoneResult");return;}
        launchRecognition(call);
    }
    @PermissionCallback private void microphoneResult(PluginCall call){
        if(getPermissionState("microphone")==PermissionState.GRANTED)launchRecognition(call);else call.reject("Microphone non autorisé. Le mode texte reste disponible.");
    }
    private void launchRecognition(PluginCall call){
        Intent intent=new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE,"fr-FR");
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS,1);
        intent.putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE,true);
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT,"Votre demande à JARVIS");
        try{startActivityForResult(call,intent,"recognitionResult");}catch(ActivityNotFoundException error){call.reject("Service de dictée Android indisponible. Utilisez le clavier.");}
    }
    @ActivityCallback private void recognitionResult(PluginCall call,ActivityResult result){
        if(call==null)return;
        if(result.getResultCode()!=Activity.RESULT_OK||result.getData()==null){call.reject("Dictée annulée.");return;}
        ArrayList<String> words=result.getData().getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
        if(words==null||words.isEmpty()){call.reject("Aucun texte reconnu.");return;}
        JSObject output=new JSObject();output.put("text",words.get(0));call.resolve(output);
    }
    @Override protected void handleOnDestroy(){if(engine!=null){engine.stop();engine.shutdown();}super.handleOnDestroy();}
}
