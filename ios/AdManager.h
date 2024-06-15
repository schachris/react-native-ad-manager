
#import <React/RCTEventEmitter.h>
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNAdmanagerMobileAdsSpec.h"

@interface AdManager : RCTEventEmitter <NativeAdmanagerMobileAdsSpec>
#else
#import <React/RCTBridgeModule.h>

@interface AdManager : RCTEventEmitter <RCTBridgeModule>
#endif

@end
