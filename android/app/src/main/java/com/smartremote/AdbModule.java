package com.SmartRemote2; // Remplacez par votre package name

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.net.Socket;
import com.tananaev.adblib.AdbConnection;
import com.tananaev.adblib.AdbCrypto;
import com.tananaev.adblib.AdbStream;

public class AdbModule extends ReactContextBaseJavaModule {
    private AdbConnection adbConnection;
    private AdbCrypto adbCrypto;

    AdbModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "AdbModule";
    }

    @ReactMethod
    public void connect(String ip, Promise promise) {
        new Thread(() -> {
            try {
                Socket socket = new Socket(ip, 5555);
                // Génération des clés RSA nécessaires pour ADB (indispensable)
                adbCrypto = AdbCrypto.generateAdbCrypto(new AdbBase64());
                adbConnection = AdbConnection.create(socket, adbCrypto);
                adbConnection.connect();
                promise.resolve("Connected");
            } catch (Exception e) {
                promise.reject("Error", e.getMessage());
            }
        }).start();
    }

    @ReactMethod
    public void sendKey(int keycode, Promise promise) {
        new Thread(() -> {
            try {
                if (adbConnection != null) {
                    // Commande ADB pour simuler une touche
                    String cmd = "input keyevent " + keycode + "\n";
                    AdbStream stream = adbConnection.open("shell:" + cmd);
                    stream.close();
                    promise.resolve("Sent");
                }
            } catch (Exception e) {
                promise.reject("Error", e.getMessage());
            }
        }).start();
    }
}