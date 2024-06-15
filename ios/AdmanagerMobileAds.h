
#import <React/RCTEventEmitter.h>
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNAdmanagerMobileAdsSpec.h"

@interface AdmanagerMobileAds : RCTEventEmitter <NativeAdmanagerMobileAdsSpec>
#else
#import <React/RCTBridgeModule.h>

@interface AdmanagerMobileAds : RCTEventEmitter <RCTBridgeModule>
#endif

@end
