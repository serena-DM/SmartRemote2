package com.SmartRemote2; // <--- METTEZ VOTRE NOM DE PACKAGE ICI

import android.util.Base64;
import com.tananaev.adblib.AdbCrypto;

public class AdbBase64 implements AdbCrypto.AdbBase64 {
    @Override
    public String encodeToString(byte[] data) {
        // Utilise la fonction Base64 native d'Android
        return Base64.encodeToString(data, Base64.NO_WRAP);
    }
}