
#import <React/RCTEventEmitter.h>
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNAdManagerMobileAdsSpec.h"

@interface AdManager : RCTEventEmitter <NativeAdManagerMobileAdsSpec>
#else
#import <React/RCTBridgeModule.h>

@interface AdManager : RCTEventEmitter <RCTBridgeModule>
#endif

@end
