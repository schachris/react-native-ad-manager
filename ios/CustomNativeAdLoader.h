//
//  CustomNativeAdLoader.h
//  react-native-ad-manager
//
//  Created by Christian Schaffrath on 18.05.23.
//

#import <Foundation/Foundation.h>
#import "CustomNativeAdState.h"
#import "CustomNativeAdDetails.h"
#import "CustomNativeAdError.h"

NS_ASSUME_NONNULL_BEGIN

typedef void (^AdLoaderCompletionBlock)(CustomNativeAdError* _Nullable error, GADCustomNativeAd * _Nullable customNativeAd);

@protocol CustomNativeAdStateChangedDelegate;
@protocol CustomNativeAdActionsDelegate;

@interface CustomNativeAdLoader : NSObject

- (nonnull instancetype)initWithAdUnitId:(nonnull NSString *)adUnitId
                            andFormatIds: (NSArray<NSString*>*) formatIds
                      rootViewController:(nullable UIViewController *)rootViewController
                                 options:(nullable NSArray<GADAdLoaderOptions *> *)options;

@property(nonatomic, weak, nullable) id<CustomNativeAdStateChangedDelegate> stateChangedDelegate;
@property(nonatomic, weak, nullable) id<CustomNativeAdActionsDelegate> adActionsDelegate;

- (CustomNativeAdLoaderDetails) getDetails;
- (NSString*) getLoaderId;
- (nullable GADCustomNativeAd*) getReceivedAd;


- (void) loadRequest:(GAMRequest *)request WithCompletion: (AdLoaderCompletionBlock) completion;

- (BOOL) setIsDisplaying;
- (BOOL) recordImpression;

- (void) setCustomClickHandler: (nullable GADNativeAdCustomClickHandler) handler;
- (BOOL) performClickOnAssetWithKey: (nonnull NSString*) assetKey;
- (BOOL) hasActiveCustomClickHandler;

- (void) makeOutdated;

- (void) cleanup;

@end

@protocol CustomNativeAdStateChangedDelegate <NSObject>

- (void) didChangeStateFor:(CustomNativeAdLoader *)adLoader fromState:(CustomNativeAdState) oldState toNewState: (CustomNativeAdState) newState;

@end

@protocol CustomNativeAdActionsDelegate <NSObject>
-(void)didRecordImpressionOnAd: (GADCustomNativeAd *) customNativeAd forAdLoader: (CustomNativeAdLoader *) adLoader;
-(void)didRecordClickOnAd: (GADCustomNativeAd *) customNativeAd forAdLoader: (CustomNativeAdLoader *) adLoader;

@optional
-(void)willPresentScreen: (GADCustomNativeAd *) customNativeAd forAdLoader: (CustomNativeAdLoader *) adLoader;
-(void)willDismissScreen: (GADCustomNativeAd *) customNativeAd forAdLoader: (CustomNativeAdLoader *) adLoader;
-(void)didDismissScreen: (GADCustomNativeAd *) customNativeAd forAdLoader: (CustomNativeAdLoader *) adLoader;
@end

NS_ASSUME_NONNULL_END
