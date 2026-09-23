package app.jarvis.fitness;

import android.Manifest;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import org.json.JSONArray;
import java.util.Set;
import android.speech.tts.UtteranceProgressListener;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PermissionState;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.util.ArrayList;
import java.util.Locale;

/** Protocol 2. All device ownership and settlement occurs on the Android main thread.
 * No activity-based external recognizer: cancellation is effective in this app.
 * Recognition/TTS are provided by the user's installed Android services, not by a cloud AI.
 */
@CapacitorPlugin(name = "JarvisSpeech", permissions = {
    @Permission(alias = "microphone", strings = { Manifest.permission.RECORD_AUDIO })
})
public class JarvisSpeechPlugin extends Plugin {
    private final Handler main = new Handler(Looper.getMainLooper());
    private TextToSpeech engine;
    private SpeechRecognizer recognizer;
    private PluginCall listening, speaking;
    private boolean initialized, frenchAvailable, destroyed;
    private String ttsState = "initializing", utteranceId;
    private long sequence;
    private Runnable listenDeadline, speechDeadline;

    @Override public void load() {
        main.post(() -> {
            if (destroyed) return;
            try {
                engine = new TextToSpeech(getContext(), status -> main.post(() -> initializeTts(status)));
            } catch (RuntimeException error) { ttsState = "error"; }
        });
    }
    private void initializeTts(int status) {
        if (destroyed || engine == null) return;
        if (status != TextToSpeech.SUCCESS) { ttsState = "error"; return; }
        try {
            initialized = true;
            int language = engine.setLanguage(Locale.FRANCE);
            frenchAvailable = language >= TextToSpeech.LANG_AVAILABLE;
            ttsState = frenchAvailable ? "ready" : "language-unavailable";
            engine.setSpeechRate(0.98f);
            engine.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override public void onStart(String id) { /* speak() already reports its pending state */ }
                @Override public void onDone(String id) { main.post(() -> finishSpeech(id, null)); }
                @Override public void onError(String id) { main.post(() -> finishSpeech(id, "TTS_ERROR")); }
                @Override public void onError(String id, int code) { onError(id); }
                @Override public void onStop(String id, boolean interrupted) { main.post(() -> finishSpeech(id, "CANCELLED")); }
            });
        } catch (RuntimeException error) { initialized = false; ttsState = "error"; }
    }
    @PluginMethod public void diagnostics(PluginCall call) {
        main.post(() -> {
            JSObject result = new JSObject();
            result.put("protocolVersion", 2);
            result.put("platform", "android");
            result.put("recognitionAvailable", !destroyed && recognitionAvailable());
            result.put("microphone", getPermissionState("microphone").toString());
            result.put("ttsReady", initialized && !destroyed);
            result.put("ttsState", ttsState);
            result.put("frenchAvailable", frenchAvailable && !destroyed);
            // EXTRA_PREFER_OFFLINE is a preference, not an offline guarantee.
            result.put("offlineGuaranteed", false);
            result.put("voiceOptionsVersion", 1);
            result.put("voices", voiceList());
            call.resolve(result);
        });
    }
    private JSONArray voiceList() {
        JSONArray list = new JSONArray();
        if (!initialized || engine == null || destroyed) return list;
        try {
            Set<Voice> voices = engine.getVoices();
            if (voices != null) for (Voice voice : voices) {
                if (!"fr".equals(voice.getLocale().getLanguage())) continue;
                JSObject item = new JSObject();
                item.put("id", voice.getName()); item.put("name", voice.getName());
                item.put("lang", voice.getLocale().toLanguageTag());
                item.put("networkRequired", voice.isNetworkConnectionRequired());
                list.put(item);
            }
        } catch (RuntimeException ignored) { /* Default French voice may still be usable. */ }
        return list;
    }
    private String configureVoice(PluginCall call) {
        Double rate = call.getDouble("rate", 0.98);
        if (rate == null || rate.isNaN() || rate.isInfinite() || rate < 0.75 || rate > 1.25) return "INVALID_RATE";
        String name = call.getString("voiceId", "");
        if (name.isEmpty()) {
            // Never inherit another profile's explicit voice.
            if (engine.setLanguage(Locale.FRANCE) < TextToSpeech.LANG_AVAILABLE) return "LANGUAGE_UNAVAILABLE";
        } else {
            Voice selected = null;
            Set<Voice> voices = engine.getVoices();
            if (voices != null) for (Voice v : voices) {
                if (name.equals(v.getName()) && "fr".equals(v.getLocale().getLanguage())) { selected = v; break; }
            }
            if (selected == null || engine.setVoice(selected) == TextToSpeech.ERROR) return "VOICE_UNAVAILABLE";
        }
        return engine.setSpeechRate(rate.floatValue()) == TextToSpeech.ERROR ? "TTS_ERROR" : null;
    }
    private boolean recognitionAvailable() {
        try { return SpeechRecognizer.isRecognitionAvailable(getContext()); }
        catch (RuntimeException error) { return false; }
    }
    @PluginMethod public void listen(PluginCall call) {
        main.post(() -> {
            if (destroyed) { reject(call, "SERVICE_UNAVAILABLE"); return; }
            if (listening != null) { reject(call, "BUSY"); return; }
            if (!recognitionAvailable()) { reject(call, "SERVICE_UNAVAILABLE"); return; }
            stopSpeechInternal("CANCELLED");
            listening = call;
            // Includes permission wait. A later permission result must not restart a cancelled call.
            listenDeadline = () -> { if (listening == call) failListening("TIMEOUT"); };
            main.postDelayed(listenDeadline, 20000);
            if (getPermissionState("microphone") != PermissionState.GRANTED) {
                try { requestPermissionForAlias("microphone", call, "microphoneResult"); }
                catch (RuntimeException error) { failListening("PERMISSION_DENIED"); }
            } else startRecognition(call);
        });
    }
    @PermissionCallback private void microphoneResult(PluginCall call) {
        main.post(() -> {
            if (destroyed || call != listening) return;
            if (getPermissionState("microphone") == PermissionState.GRANTED) startRecognition(call);
            else failListening("PERMISSION_DENIED");
        });
    }
    private void startRecognition(PluginCall call) {
        if (call != listening || destroyed) return;
        try {
            recognizer = SpeechRecognizer.createSpeechRecognizer(getContext());
            recognizer.setRecognitionListener(new RecognitionListener() {
                private boolean current() { return call == listening && !destroyed; }
                @Override public void onReadyForSpeech(Bundle params) { if (current()) emit(call, "listening"); }
                @Override public void onBeginningOfSpeech() { if (current()) emit(call, "listening"); }
                @Override public void onEndOfSpeech() { if (current()) emit(call, "processing"); }
                @Override public void onError(int code) { if (current()) failListening(recognitionError(code)); }
                @Override public void onResults(Bundle results) {
                    if (!current()) return;
                    ArrayList<String> words = results == null ? null : results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                    if (words == null || words.isEmpty() || words.get(0) == null || words.get(0).trim().isEmpty()) {
                        failListening("NO_MATCH"); return;
                    }
                    String text = words.get(0).trim();
                    cleanupListening();
                    JSObject result = new JSObject(); result.put("text", text); call.resolve(result);
                }
                @Override public void onRmsChanged(float rms) {}
                @Override public void onBufferReceived(byte[] buffer) {}
                @Override public void onPartialResults(Bundle partial) {}
                @Override public void onEvent(int type, Bundle params) {}
            });
            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "fr-FR");
            intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
            intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
            intent.putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true);
            recognizer.startListening(intent);
        } catch (SecurityException error) { failListening("PERMISSION_DENIED"); }
        catch (RuntimeException error) { failListening("SERVICE_UNAVAILABLE"); }
    }
    static String recognitionError(int code) {
        switch (code) {
            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS: return "PERMISSION_DENIED";
            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT: return "NO_SPEECH";
            case SpeechRecognizer.ERROR_NO_MATCH: return "NO_MATCH";
            case SpeechRecognizer.ERROR_NETWORK:
            case SpeechRecognizer.ERROR_NETWORK_TIMEOUT: return "NETWORK";
            case SpeechRecognizer.ERROR_AUDIO: return "AUDIO";
            case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
            case 10: return "BUSY"; // too many requests on recent Android
            case 12: // language not supported (API 31+)
            case 13: return "LANGUAGE_UNAVAILABLE"; // language unavailable
            default: return "SERVICE_UNAVAILABLE";
        }
    }
    private void emit(PluginCall call, String state) {
        JSObject event = new JSObject();
        event.put("state", state); event.put("requestId", call.getString("requestId", ""));
        notifyListeners("speechState", event);
    }
    private void cleanupListening() {
        listening = null; // invalidate callbacks before cancel/destroy can trigger another callback
        if (listenDeadline != null) main.removeCallbacks(listenDeadline);
        listenDeadline = null;
        SpeechRecognizer old = recognizer; recognizer = null;
        if (old != null) {
            try { old.cancel(); } catch (RuntimeException ignored) {}
            try { old.destroy(); } catch (RuntimeException ignored) {}
        }
    }
    private void failListening(String code) {
        PluginCall call = listening; cleanupListening();
        if (call != null) reject(call, code);
    }
    @PluginMethod public void cancelListen(PluginCall call) {
        main.post(() -> { failListening("CANCELLED"); call.resolve(); });
    }
    @PluginMethod public void speak(PluginCall call) {
        main.post(() -> {
            if (destroyed) { reject(call, "TTS_ERROR"); return; }
            if (listening != null) { reject(call, "BUSY"); return; }
            if (!initialized || engine == null) { reject(call, "error".equals(ttsState) ? "TTS_ERROR" : "TTS_NOT_READY"); return; }
            if (!frenchAvailable) { reject(call, "LANGUAGE_UNAVAILABLE"); return; }
            String text = call.getString("text", "").trim();
            if (text.isEmpty()) { call.resolve(); return; }
            if (text.length() > TextToSpeech.getMaxSpeechInputLength()) { reject(call, "TEXT_TOO_LONG"); return; }
            stopSpeechInternal("CANCELLED");
            try {
                String configurationError = configureVoice(call);
                if (configurationError != null) { reject(call, configurationError); return; }
            } catch (RuntimeException error) { reject(call, "TTS_ERROR"); return; }
            speaking = call; utteranceId = "jarvis-" + (++sequence);
            final String id = utteranceId;
            speechDeadline = () -> {
                if (id.equals(utteranceId)) stopSpeechInternal("TIMEOUT");
            };
            main.postDelayed(speechDeadline, 60000);
            try {
                if (engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, id) == TextToSpeech.ERROR) stopSpeechInternal("TTS_ERROR");
            } catch (RuntimeException error) { stopSpeechInternal("TTS_ERROR"); }
        });
    }
    private void finishSpeech(String id, String code) {
        if (id == null || !id.equals(utteranceId) || speaking == null) return;
        PluginCall call = speaking; speaking = null; utteranceId = null;
        if (speechDeadline != null) main.removeCallbacks(speechDeadline);
        speechDeadline = null;
        if (code == null) call.resolve(); else reject(call, code);
    }
    private void stopSpeechInternal(String code) {
        finishSpeech(utteranceId, code);
        if (engine != null) try { engine.stop(); } catch (RuntimeException ignored) {}
    }
    @PluginMethod public void stopSpeech(PluginCall call) {
        main.post(() -> { stopSpeechInternal("CANCELLED"); call.resolve(); });
    }
    private static void reject(PluginCall call, String code) { call.reject(code, code); }
    @Override protected void handleOnStop() {
        main.post(() -> { failListening("BACKGROUND"); stopSpeechInternal("BACKGROUND"); });
        super.handleOnStop();
    }
    @Override protected void handleOnDestroy() {
        main.post(() -> {
            destroyed = true; failListening("CANCELLED"); stopSpeechInternal("CANCELLED");
            if (engine != null) { engine.shutdown(); engine = null; }
        });
        super.handleOnDestroy();
    }
}
