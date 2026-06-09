package com.smartremote;

import android.hardware.ConsumerIrManager;
import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

public class IrModule extends ReactContextBaseJavaModule {
    private ConsumerIrManager irManager;

    IrModule(ReactApplicationContext context) {
        super(context);
        // On récupère le service Infrarouge du téléphone
        irManager = (ConsumerIrManager) context.getSystemService(Context.CONSUMER_IR_SERVICE);
    }

    @Override
    public String getName() {
        return "IrModule"; // C'est le nom qu'on utilise dans le JS
    }

    @ReactMethod
    public void transmit(int carrierFrequency, ReadableArray pattern) {
        if (irManager != null && irManager.hasIrEmitter()) {
            // Conversion de la liste React Native en tableau d'entiers Java
            int[] intPattern = new int[pattern.size()];
            for (int i = 0; i < pattern.size(); i++) {
                intPattern[i] = pattern.getInt(i);
            }
            // Envoi réel du signal physique
            irManager.transmit(carrierFrequency, intPattern);
        }
    }
}