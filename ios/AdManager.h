
#import <React/RCTEventEmitter.h>
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNAdManagerSpec.h"

@interface AdManager : RCTEventEmitter <NativeAdManagerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface AdManager : RCTEventEmitter <RCTBridgeModule>
#endif

@end
