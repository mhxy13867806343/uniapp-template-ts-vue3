import deviceInfo from '@ohos.deviceInfo';

export class DevicePlugin {
    public static getHardwareInfo(): string {
        return "HarmonyOS Native: " + deviceInfo.marketName + " (SDK " + deviceInfo.sdkApiVersion + ")";
    }
}
