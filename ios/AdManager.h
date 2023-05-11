
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNAdManagerSpec.h"

@interface AdManager : NSObject <NativeAdManagerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface AdManager : NSObject <RCTBridgeModule>
#endif

@end
