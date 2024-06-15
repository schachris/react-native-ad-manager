
#import <React/RCTEventEmitter.h>
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNAdManagerMobileAdsSpec.h"

@interface AdManagerMobileAds : RCTEventEmitter <NativeAdManagerMobileAdsSpec>
#else
#import <React/RCTBridgeModule.h>

@interface AdManagerMobileAds : RCTEventEmitter <RCTBridgeModule>
#endif

@end
