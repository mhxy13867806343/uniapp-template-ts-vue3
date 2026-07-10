package com.uniapp.plugins;

import android.content.Context;
import android.os.Build;

public class DevicePlugin {
    public static String getHardwareInfo(Context context) {
        return "Android Native: " + Build.MANUFACTURER + " " + Build.MODEL + " (SDK " + Build.VERSION.SDK_INT + ")";
    }
}
