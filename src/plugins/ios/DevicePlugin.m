#import <UIKit/UIKit.h>

@interface DevicePlugin : NSObject
+ (NSString *)getHardwareInfo;
@end

@implementation DevicePlugin
+ (NSString *)getHardwareInfo {
    UIDevice *device = [UIDevice currentDevice];
    return [NSString stringWithFormat:@"iOS Native: %@ %@ (System Version: %@)", device.name, device.systemName, device.systemVersion];
}
@end
