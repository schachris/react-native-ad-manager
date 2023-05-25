//
//  CustomNativeAdLoader.m
//  react-native-ad-manager
//
//  Created by Christian Schaffrath on 18.05.23.
//

#import <GoogleMobileAds/GoogleMobileAds.h>
#import "CustomNativeAdLoader.h"
#import "GADCustomNativeAd+Infos.h"
#import <React/RCTLog.h>

@interface CustomNativeAdLoader()<GADAdLoaderDelegate, GADCustomNativeAdLoaderDelegate, GADCustomNativeAdDelegate>

@property(nonatomic) NSString * loaderId;
@property(nonatomic) NSString * adUnitId;
@property(nonatomic) NSArray<NSString *>* formatIds;
@property(nonatomic) CustomNativeAdState currentState;

@property(nonatomic) BOOL isRequestingAd;
@property(nonatomic) AdLoaderCompletionBlock completionBlock;
@property(nullable, nonatomic) GAMRequest * request;

@property (nonatomic, strong) GADAdLoader * customAdLoader;
@property (nullable, nonatomic, strong) GADCustomNativeAd *receivedAd;
@property (nullable, nonatomic, strong) CustomNativeAdError *error;

@end

@implementation CustomNativeAdLoader
{
    GADNativeAdCustomClickHandler customClickHandler;
}

+ (NSString *) generateId {
    // Generate a random UUID
    CFUUIDRef uuid = CFUUIDCreate(kCFAllocatorDefault);
    NSString *uuidString = (__bridge_transfer NSString *)CFUUIDCreateString(kCFAllocatorDefault, uuid);
    CFRelease(uuid);
    return  uuidString;
}

- (nonnull instancetype)initWithAdUnitId:(nonnull NSString *)adUnitId
                            andFormatIds: (NSArray<NSString*>*) formatIds
                      rootViewController:(nullable UIViewController *)rootViewController
                                 options:(nullable NSArray<GADAdLoaderOptions *> *)options {
    self = [super init];
    if(self)
    {
        self.loaderId = [CustomNativeAdLoader generateId];
        self.currentState = CustomNativeAdStateInit;
        self.error = nil;
        self.request = nil;
        
        self.adUnitId = adUnitId;
        self.formatIds = formatIds;
        
        GADAdLoader * googleAdLoader = [[GADAdLoader alloc] initWithAdUnitID:adUnitId
                                               rootViewController:nil //[UIApplication sharedApplication].delegate.window.rootViewController
                                                          adTypes: @[GADAdLoaderAdTypeCustomNative]
                                                          options: options];
        self.customAdLoader = googleAdLoader;
        self.customAdLoader.delegate = self;
    }
    return self;
}

- (void) updateState: (CustomNativeAdState) newState {
    CustomNativeAdState oldState = self.currentState;
    if(oldState == CustomNativeAdStateError || oldState < newState){
        [self forceUpdateState:newState];
    }
}

- (void) forceUpdateState: (CustomNativeAdState) newState {
    CustomNativeAdState oldState = self.currentState;
    self.currentState = newState;
    if(self.stateChangedDelegate){
        [self.stateChangedDelegate didChangeStateFor:self fromState:oldState toNewState:newState];
    }
}

- (void) setCustomClickHandler: (nullable GADNativeAdCustomClickHandler) handler {
    customClickHandler = handler;
    if(self.receivedAd){
        if(handler == nil){
            [self.receivedAd setCustomClickHandler:nil];
        }else{
            [self.receivedAd setCustomClickHandler:customClickHandler];
        }
    }
}

- (BOOL) hasActiveCustomClickHandler {
    return customClickHandler != nil;
}

- (NSString*) getLoaderId {
    return self.loaderId;
}

- ( GADCustomNativeAd* _Nullable ) getReceivedAd {
    return self.receivedAd;
}

- (CustomNativeAdLoaderDetails) getDetails {
    CustomNativeAdLoaderDetails details;
    
    details.loaderId = self.loaderId;
    details.adUnitId = self.adUnitId;
    details.formatIds = self.formatIds;
    details.state = self.currentState;
    
    if (self.receivedAd){
        details.hasAd = YES;
        details.ad = [self.receivedAd getAdDetails];
    }else{
        details.hasAd = NO;
    }
    return details;
}



- (void) cleanup {
    self.error = nil;
    self.completionBlock = nil;
    if(self.receivedAd){
        self.receivedAd.delegate = nil;
    }
    self.receivedAd = nil;
    [self forceUpdateState:CustomNativeAdStateInit];
}


- (void)loadRequest:(GAMRequest *)request WithCompletion:(AdLoaderCompletionBlock)completion {
    if(self.customAdLoader.loading == YES || self.isRequestingAd){
        CustomNativeAdError * error = [CustomNativeAdError errorWithMessage:@"This loader is already loading a request." andCode:@"AD_REQUEST_ALREADY_RUNNING"];
        completion(error, nil);
    }else{
        self.error = nil;
        self.request = request;
        [self updateState:CustomNativeAdStateLoading];
        self.isRequestingAd = YES;
        self.completionBlock = completion;
        self.customAdLoader.delegate = self;
        [self.customAdLoader loadRequest:self.request];
    }
}

- (BOOL) setIsDisplayingOnView: (UIView*) view {
    if (self.receivedAd){
        // Set the top-level native ad view on the GADNativeCustomTemplateAd so the
        // Google Mobile Ads SDK can track viewability for that view.
        self.receivedAd.displayAdMeasurement.view = view;
        // Begin measuring your impressions and clicks.
        NSError *error = nil;
        [self.receivedAd.displayAdMeasurement startWithError:&error];
        if (error) {
            RCTLogWarn(@"Failed to start the display measurement.For loader %@", [self getLoaderId]);
        }else{
        }
        return [self setIsDisplaying];
    }
    return NO;
}


- (BOOL) setIsDisplaying {
    if(self.receivedAd && self.currentState >= CustomNativeAdStateReceived){
        if(self.currentState <= CustomNativeAdStateDisplaying){
            [self updateState: CustomNativeAdStateDisplaying];
        }
        return YES;
    }
    return NO;
}


- (BOOL) recordImpression {
    if (self.receivedAd) {
        [self.receivedAd recordImpression];
        self.error = nil;
        [self updateState:CustomNativeAdStateImpression];
        return YES;
    }
    return NO;
}

- (BOOL) performClickOnAssetWithKey: (nonnull NSString*) assetKey {
    if (self.receivedAd){
        if (customClickHandler != nil){
            [self.receivedAd setCustomClickHandler:customClickHandler];
        }else{
            [self.receivedAd setCustomClickHandler:nil];
        }
        //It does not matter if we call this function to ofthen...google will take care of that and still tracks it as a single impression
        //so if someone clicks it the ad must have been seen
        [self.receivedAd recordImpression];
        [self.receivedAd performClickOnAssetWithKey:assetKey];
        self.error = nil;
        [self updateState:CustomNativeAdStateClicked];
        return YES;
    }
    return NO;
}

- (void) makeOutdated {
    [self updateState:CustomNativeAdStateOutdated];
}

- (void) destroy {
    [self cleanup];
}

#pragma mark GADAdLoaderDelegate implementation

/// Called after adLoader has finished loading.
- (void)adLoaderDidFinishLoading:(nonnull GADAdLoader *)adLoader {
    self.isRequestingAd = NO;
    self.request = nil;
}

- (void)adLoader:(nonnull GADAdLoader *)adLoader didFailToReceiveAdWithError:(nonnull NSError *)error {
    CustomNativeAdError *err = [CustomNativeAdError fromError:error WithCode:@"FAILED_TO_RECEIVE_AD"];
    self.error = err;
    [self updateState:CustomNativeAdStateError];
    if(self.completionBlock){
        self.completionBlock(err, nil);
        self.completionBlock = nil;
    }
    self.request = nil;
    self.isRequestingAd = NO;
}

#pragma mark GADCustomNativeAdLoaderDelegate implementation
/// Called when requesting an ad. Asks the delegate for an array of custom native ad format ID
/// strings.
- (nonnull NSArray<NSString *> *)customNativeAdFormatIDsForAdLoader:(nonnull GADAdLoader *)adLoader {
    
    if(self.formatIds != nil && [self.formatIds count] > 0) {
        return self.formatIds;
    }else{
        return @[];
    }
}

/// Tells the delegate that a custom native ad was received.
- (void)adLoader:(GADAdLoader *)adLoader didReceiveCustomNativeAd:(GADCustomNativeAd *) customNativeAd {
    self.receivedAd = customNativeAd;
    if (customClickHandler != nil){
        [self.receivedAd setCustomClickHandler:customClickHandler];
    }else{
        [self.receivedAd setCustomClickHandler:nil];
    }
    self.receivedAd.delegate = self;
    self.error = nil;
    [self updateState:CustomNativeAdStateReceived];
    if(self.completionBlock){
        self.completionBlock(nil, customNativeAd);
        self.completionBlock = nil;
    }
    self.request = nil;
    self.isRequestingAd = NO;
}

#pragma mark GADCustomNativeAdDelegate
/// Called when an impression is recorded for a custom native ad.
- (void)customNativeAdDidRecordImpression:(nonnull GADCustomNativeAd *)nativeAd {
    if(self.adActionsDelegate){
        [self.adActionsDelegate didRecordImpressionOnAd:nativeAd forAdLoader:self];
    }
}

/// Called when a click is recorded for a custom native ad.
- (void)customNativeAdDidRecordClick:(nonnull GADCustomNativeAd *)nativeAd {
    if(self.adActionsDelegate){
        [self.adActionsDelegate didRecordClickOnAd:nativeAd forAdLoader:self];
    }
}

#pragma mark Click-Time Lifecycle Notifications

/// Called just before presenting the user a full screen view, such as a browser, in response to
/// clicking on an ad. Use this opportunity to stop animations, time sensitive interactions, etc.
///
/// Normally the user looks at the ad, dismisses it, and control returns to your application with
/// the customNativeAdDidDismissScreen: message. However, if the user hits the Home button or clicks
/// on an App Store link, your application will end. The next method called will be the
/// applicationWillResignActive: of your UIApplicationDelegate object.
- (void)customNativeAdWillPresentScreen:(nonnull GADCustomNativeAd *)nativeAd {
    if(self.adActionsDelegate && [self.adActionsDelegate respondsToSelector:@selector(willPresentScreen:forAdLoader:)]){
        [self.adActionsDelegate willPresentScreen:nativeAd forAdLoader:self];
    }
}

/// Called just before dismissing a full screen view.
- (void)customNativeAdWillDismissScreen:(nonnull GADCustomNativeAd *)nativeAd{
    if(self.adActionsDelegate && [self.adActionsDelegate respondsToSelector:@selector(willDismissScreen:forAdLoader:)]){
        [self.adActionsDelegate willDismissScreen:nativeAd forAdLoader:self];
    }
}

/// Called just after dismissing a full screen view. Use this opportunity to restart anything you
/// may have stopped as part of customNativeAdWillPresentScreen:.
- (void)customNativeAdDidDismissScreen:(nonnull GADCustomNativeAd *)nativeAd {
    if(self.adActionsDelegate && [self.adActionsDelegate respondsToSelector:@selector(didDismissScreen:forAdLoader:)]){
        [self.adActionsDelegate didDismissScreen:nativeAd forAdLoader:self];
    }
}

@end
