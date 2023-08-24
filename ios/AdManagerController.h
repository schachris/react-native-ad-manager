//
//  AdManagerController.h
//  react-native-admanager-mobile-ads
//
//  Created by Christian Schaffrath on 18.05.23.
//

#import <Foundation/Foundation.h>
#import <GoogleMobileAds/GoogleMobileAds.h>
#import "CustomNativeAdLoader.h"
#import "CustomNativeAdDetails.h"
#import "CustomNativeAdError.h"

NS_ASSUME_NONNULL_BEGIN

typedef void (^ResolverBlock)(id result);
typedef void (^RejecterBlock)(id result);


typedef void (^AdErrorBlock)(CustomNativeAdError* error);
typedef void (^ReceivedAdBlock)(CustomNativeAdLoader* loader, GADCustomNativeAd* ad);

@interface AdManagerController : NSObject

+ (instancetype) main;

+ (void) startGoogleMobileAdsSDK:(nullable GADInitializationCompletionHandler) completionHandler;
+ (GADVideoOptions *) getVideoOptions: (NSDictionary*) options;
+ (GAMRequest *) getRequestWithOptions: (NSDictionary*) options andDefaultTargeting: (NSDictionary<NSString *, NSString *> *) defaultTargeting;
+ (void) setTestDeviceIds: (NSArray *) testDeviceIds;


- (CustomNativeAdLoader*) createAdLoaderForAdUnitId:(NSString*) adUnitId withFormatIds: (NSArray<NSString*> *)formatIds andOptions: (nullable NSArray<GADAdLoaderOptions *> *)options;

- (CustomNativeAdLoader * _Nonnull) getLoaderForIdOrThrow: (NSString *) loaderId;
- (CustomNativeAdLoaderDetails) getAdLoaderDetailsForId: (NSString *) loaderId;
- (NSArray<NSString*> *) getAvailableAdLoaderIds;
- (NSArray<NSString*> *) removeAdLoader: (NSString*) loaderId;

- (CustomNativeAdLoader *) loadRequest:(GAMRequest*) request forId:(NSString *) loaderId withSuccessHandler: (ReceivedAdBlock) successHandler andErrorHandler: (AdErrorBlock) errorHandler;
- (CustomNativeAdLoader *) recordImpressionForId: (NSString *) loaderId;
- (CustomNativeAdLoader *) setIsDisplayingForLoader: (NSString*) loaderId;
- (CustomNativeAdLoader *) setIsDisplayingOnView: (UIView *) view forLoader: (NSString*) loaderId;
- (CustomNativeAdLoader *) makeLoaderOutdated: (NSString*) loaderId;
- (CustomNativeAdLoader *) destroyLoader: (NSString*) loaderId;

- (void)requestIDFAWithCompletion: (void(^)(NSNumber * status))completion;

- (CustomNativeAdLoader *) setCustomClickHandlerForLoader: (NSString*) loaderId clickHandler:(nullable GADNativeAdCustomClickHandler) handler;
- (NSString *) forLoaderId: (NSString *) loaderId recordClickOnAssetKey: (nullable NSString *) assetKey withDefaultClickHandler: (nullable GADNativeAdCustomClickHandler) defaultClickHandler;

- (void) clearAll;
- (void) clearAllClickHandler;

@property BOOL onlyLoadRequestAfterATT;

@end

NS_ASSUME_NONNULL_END
