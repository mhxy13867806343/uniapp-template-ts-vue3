#import <Foundation/Foundation.h>
#import <SystemConfiguration/SystemConfiguration.h>
#import <arpa/inet.h>
#import <ifaddrs.h>
#import <netdb.h>

@interface NetworkPlugin : NSObject
+ (NSString *)getNetworkType;
+ (NSString *)getLocalIpAddress;
+ (NSString *)pingHost:(NSString *)host timeout:(int)timeoutMs;
@end

@implementation NetworkPlugin

+ (NSString *)getNetworkType {
    struct sockaddr_in zeroAddress;
    bzero(&zeroAddress, sizeof(zeroAddress));
    zeroAddress.sin_len = sizeof(zeroAddress);
    zeroAddress.sin_family = AF_INET;
    
    SCNetworkReachabilityRef defaultRouteReachability = SCNetworkReachabilityCreateWithAddress(NULL, (const struct sockaddr *)&zeroAddress);
    SCNetworkReachabilityFlags flags;
    
    BOOL didRetrieveFlags = SCNetworkReachabilityGetFlags(defaultRouteReachability, &flags);
    CFRelease(defaultRouteReachability);
    
    if (!didRetrieveFlags) {
        return @"Unknown";
    }
    
    BOOL isReachable = ((flags & kSCNetworkFlagsReachable) != 0);
    BOOL needsConnection = ((flags & kSCNetworkFlagsConnectionRequired) != 0);
    BOOL isNetworkConnected = (isReachable && !needsConnection);
    
    if (!isNetworkConnected) {
        return @"Offline";
    }
    
    if ((flags & kSCNetworkReachabilityFlagsIsWWAN) != 0) {
        return @"Cellular";
    }
    
    return @"WiFi";
}

+ (NSString *)getLocalIpAddress {
    NSString *address = @"0.0.0.0";
    struct ifaddrs *interfaces = NULL;
    struct ifaddrs *temp_addr = NULL;
    int success = getifaddrs(&interfaces);
    if (success == 0) {
        temp_addr = interfaces;
        while(temp_addr != NULL) {
            if(temp_addr->ifa_addr->sa_family == AF_INET) {
                if([[NSString stringWithUTF8String:temp_addr->ifa_name] isEqualToString:@"en0"]) {
                    address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr)];
                }
            }
            temp_addr = temp_addr->ifa_next;
        }
    }
    freeifaddrs(interfaces);
    return address;
}

+ (NSString *)pingHost:(NSString *)host timeout:(int)timeoutMs {
    NSDate *startTime = [NSDate date];
    Boolean success = false;
    CFHostRef hostRef = CFHostCreateWithName(kCFAllocatorDefault, (__bridge CFStringRef)host);
    if (hostRef) {
        success = CFHostStartInfoResolution(hostRef, kCFHostAddresses, NULL);
        CFRelease(hostRef);
    }
    
    if (success) {
        NSTimeInterval elapsed = [[NSDate date] timeIntervalSinceDate:startTime];
        return [NSString stringWithFormat:@"Ping Success: %dms", (int)(elapsed * 1000)];
    } else {
        return @"Ping Failed";
    }
}

@end
