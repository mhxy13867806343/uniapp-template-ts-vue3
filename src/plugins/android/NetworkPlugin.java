package com.uniapp.plugins;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Collections;
import java.util.List;

public class NetworkPlugin {
    
    // 1. Check network connection type
    public static String getNetworkType(Context context) {
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return "Unknown";
        
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            android.net.Network activeNetwork = cm.getActiveNetwork();
            if (activeNetwork == null) return "Offline";
            NetworkCapabilities capabilities = cm.getNetworkCapabilities(activeNetwork);
            if (capabilities == null) return "Offline";
            
            if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
                return "WiFi";
            } else if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
                return "Cellular";
            } else if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_VPN)) {
                return "VPN (Active)";
            } else if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)) {
                return "Ethernet";
            }
        } else {
            NetworkInfo info = cm.getActiveNetworkInfo();
            if (info == null || !info.isConnected()) return "Offline";
            if (info.getType() == ConnectivityManager.TYPE_WIFI) return "WiFi";
            if (info.getType() == ConnectivityManager.TYPE_MOBILE) return "Cellular";
            if (info.getType() == ConnectivityManager.TYPE_VPN) return "VPN (Active)";
        }
        return "Connected";
    }

    // 2. Get local IP Address
    public static String getLocalIpAddress() {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface intf : interfaces) {
                List<InetAddress> addrs = Collections.list(intf.getInetAddresses());
                for (InetAddress addr : addrs) {
                    if (!addr.isLoopbackAddress()) {
                        String sAddr = addr.getHostAddress();
                        boolean isIPv4 = sAddr.indexOf(':') < 0;
                        if (isIPv4) return sAddr;
                    }
                }
            }
        } catch (Exception ex) {
            return "0.0.0.0";
        }
        return "0.0.0.0";
    }

    // 3. Native ICMP Ping Command execution
    public static String pingHost(String host, int timeoutMs) {
        long startTime = System.currentTimeMillis();
        try {
            int timeoutSec = Math.max(1, timeoutMs / 1000);
            Process process = Runtime.getRuntime().exec("/system/bin/ping -c 1 -W " + timeoutSec + " " + host);
            int status = process.waitFor();
            if (status == 0) {
                long duration = System.currentTimeMillis() - startTime;
                return "Ping Success: " + duration + "ms";
            } else {
                return "Ping Failed (Code " + status + ")";
            }
        } catch (Exception e) {
            return "Ping Error: " + e.getMessage();
        }
    }
}
