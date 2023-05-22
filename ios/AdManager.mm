#import "AdManager.h"
#import "AdManagerController.h"
#import "CustomNativeAdError.h"

@implementation AdManager{
    bool hasDefaultCustomClickHandler;
    NSDictionary * defaultTargeting;
    bool hasListeners;
}

RCT_EXPORT_MODULE()

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
//RCT_REMAP_METHOD(multiply,
//                 multiplyWithA:(double)a withB:(double)b
//                 withResolver:(RCTPromiseResolveBlock)resolve
//                 withRejecter:(RCTPromiseRejectBlock)reject)
//{
//    NSNumber *result = @(a * b);
//
//    resolve(result);
//}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeAdManagerSpecJSI>(params);
}
#endif

- (NSMutableDictionary*)customNativeAdDetailsToDict:(CustomNativeAdDetails) details {
    NSMutableDictionary *data = [[NSMutableDictionary alloc] initWithDictionary:@{
        @"formatId": details.formatId,
        @"responseInfo": details.responseInfo,
        @"assetKeys": details.assetKeys
    }];
    
    if (details.assets != nil){
        data[@"assets"] = details.assets;
    }
    
    return data;
}


- (NSMutableDictionary*) customNativeAdLoaderDetailsToDict:(CustomNativeAdLoaderDetails) details {
    NSMutableDictionary * data = [NSMutableDictionary dictionaryWithDictionary:@{
        @"id": details.loaderId,
        @"adUnitId": details.adUnitId,
        @"formatIds": details.formatIds,
        @"state": [NSNumber numberWithInt:details.state]
    }];
    
    if (details.hasAd) {
        data[@"ad"] = [self customNativeAdDetailsToDict: details.ad];
    }
    
    return data;
}

RCT_REMAP_METHOD(setTestDeviceIds,
                 setTestDeviceIds: (NSArray *) testDeviceIds)
{
    [AdManagerController setTestDeviceIds:testDeviceIds];
}

RCT_EXPORT_METHOD(start)
{
    [AdManagerController startGoogleMobileAdsSDK:nil];
}

RCT_REMAP_METHOD(startWithCallback,
                 startWithCallback:(RCTResponseSenderBlock)callback)
{
    [AdManagerController startGoogleMobileAdsSDK:^(GADInitializationStatus * _Nonnull result) {
        NSMutableDictionary * resultData = [[NSMutableDictionary alloc] init];
        
        NSDictionary<NSString *, GADAdapterStatus *> *adapterStatusesByClassName = result.adapterStatusesByClassName;
        
        for (NSString *adapterName in adapterStatusesByClassName) {
            
            GADAdapterStatus *adapterStatus = adapterStatusesByClassName[adapterName];
            NSMutableDictionary *status = [[NSMutableDictionary alloc] init];
            
            [status setObject:adapterStatus.description forKey:@"description"];
            [status setObject:
             [NSNumber numberWithInteger: adapterStatus.state]
                       forKey:@"state"];
            [status setObject:@(adapterStatus.latency) forKey:@"latency"];
            
            [resultData setObject:status forKey:adapterName];
        }
        callback(@[resultData]);
    }];
}

RCT_REMAP_METHOD(removeCustomDefaultClickHandler,
                 removeCustomDefaultClickHandlerWithResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    hasDefaultCustomClickHandler = NO;
    // TODO: some ad loaders may have used the defaultCustomClickHandler, they have to be removed otherwise nothing will happen...when clicked
    resolve(nil);
}

RCT_REMAP_METHOD(setCustomDefaultClickHandler,
                 setCustomDefaultClickHandlerWithResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    hasDefaultCustomClickHandler = YES;
    resolve(nil);
}

RCT_REMAP_METHOD(defaultTargeting,
                 defaultTargeting: (NSDictionary *) targeting)
{
    self->defaultTargeting = targeting;
}

RCT_EXPORT_METHOD(clearAll)
{
    [[AdManagerController main] clearAll];
}

RCT_REMAP_METHOD(getAvailableAdLoaderIds,
                 getAvailableAdLoaderIdsWithResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([[AdManagerController main] getAvailableAdLoaderIds]);
}

RCT_REMAP_METHOD(createAdLoader,
                 createAdLoaderWithOptions: (NSDictionary *) options
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSString * adUnitId = [options objectForKey:@"adUnitId"];
    NSArray<NSString*> * formatIds = [options objectForKey:@"formatIds"];
    
    NSDictionary * videoConfig = [options objectForKey:@"videoOptions"];
    GADVideoOptions *videoOptions = [AdManagerController getVideoOptions: videoConfig];
  
    @try {
        CustomNativeAdLoader * loader = [[AdManagerController main] createAdLoaderForAdUnitId:adUnitId withFormatIds:formatIds andOptions:@[videoOptions]];
        resolve([self customNativeAdLoaderDetailsToDict: [loader getDetails]]);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}

RCT_REMAP_METHOD(getAdLoaderDetails,
                 getAdLoaderDetailsForId: (NSString *) loaderId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        CustomNativeAdLoaderDetails details = [[AdManagerController main] getAdLoaderDetailsForId:loaderId];
        resolve([self customNativeAdLoaderDetailsToDict:details]);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}

RCT_REMAP_METHOD(removeAdLoader,
                 removeAdLoader: (NSString*) loaderId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    @try{
        NSArray<NSString*> * remainingIds = [[AdManagerController main] removeAdLoader:loaderId];
        resolve(remainingIds);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}

RCT_REMAP_METHOD(loadRequest,
                 loadRequestForId: (NSString *) loaderId
                 withOptions: (NSDictionary *) options
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    GAMRequest *request = [AdManagerController getRequestWithOptions:options andDefaultTargeting: self->defaultTargeting];
    
    [[AdManagerController main] loadRequest:request forId:loaderId withSuccessHandler:^(CustomNativeAdLoader * _Nonnull loader, GADCustomNativeAd * _Nonnull ad) {
        NSMutableDictionary * data = [self customNativeAdLoaderDetailsToDict: [loader getDetails]];
        NSDictionary *targeting = [request customTargeting];
        if(targeting != nil && targeting.count > 0){
            [data setObject:targeting forKey:@"targeting"];
        }
        resolve(data);
    } andErrorHandler:^(CustomNativeAdError * _Nonnull error) {
        [error insertIntoReactPromiseReject:reject];
    }];
    
}

RCT_REMAP_METHOD(setIsDisplayingForLoader,
                 setIsDisplayingForLoader: (NSString*) loaderId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    @try{
        CustomNativeAdLoader * loader = [[AdManagerController main] setIsDisplayingForLoader:loaderId];
        resolve([self customNativeAdLoaderDetailsToDict: [loader getDetails]]);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}

RCT_REMAP_METHOD(recordImpression,
                 recordImpressionForLoaderId: (NSString *) loaderId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    @try{
        CustomNativeAdLoader * loader = [[AdManagerController main] recordImpressionForId:loaderId];
        resolve([self customNativeAdLoaderDetailsToDict: [loader getDetails]]);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}



RCT_REMAP_METHOD(makeLoaderOutdated,
                 makeLoaderOutdated: (NSString*) loaderId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    @try{
        CustomNativeAdLoader * loader = [[AdManagerController main] makeLoaderOutdated:loaderId];
        resolve([self customNativeAdLoaderDetailsToDict: [loader getDetails]]);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}


RCT_REMAP_METHOD(setCustomClickHandlerForLoader,
                 setCustomClickHandlerForLoader: (NSString*) loaderId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    @try{
        CustomNativeAdLoader * loader = [[AdManagerController main] getLoaderForIdOrThrow:loaderId];
        [[AdManagerController main] setCustomClickHandlerForLoader:loaderId clickHandler:^(NSString * _Nonnull assetID) {
            [self sendAdClickedEventforLoader:loader onAssetKey:assetID];
        }];
        resolve(nil);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}

RCT_REMAP_METHOD(removeCustomClickHandlerForLoader,
                 removeCustomClickHandlerForLoader: (NSString*) loaderId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    @try{
        [[AdManagerController main] setCustomClickHandlerForLoader:loaderId clickHandler:nil];
        resolve(nil);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}


RCT_REMAP_METHOD(recordClickOnAssetKey,
                 forLoaderId: (NSString *) loaderId
                 recordClickOnAssetKey: (NSString *) assetKey
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    @try{
        
        CustomNativeAdLoader * loader = [[AdManagerController main] getLoaderForIdOrThrow:loaderId];
        GADNativeAdCustomClickHandler customHandler;
        if (hasDefaultCustomClickHandler && ![loader hasActiveCustomClickHandler]) {
            customHandler = ^(NSString * _Nonnull assetID) {
                [self sendAdClickedEventforLoader:loader onAssetKey:assetID];
            };
        }
        NSString * clickedAssetKey = [[AdManagerController main] forLoaderId:loaderId recordClickOnAssetKey:assetKey withDefaultClickHandler:customHandler];
        
        NSMutableDictionary * data = [self customNativeAdLoaderDetailsToDict:[loader getDetails]];
        [data setObject:clickedAssetKey forKey:@"assetKey"];
        resolve(data);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}

RCT_REMAP_METHOD(recordClick,
                 recordClickForLoaderId: (NSString *) loaderId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    [self forLoaderId:loaderId recordClickOnAssetKey:nil withResolver:resolve withRejecter:reject];
}

#pragma mark NewArch
#ifdef RCT_NEW_ARCH_ENABLED
- (void)createAdLoader:(JS::NativeAdManager::SpecCreateAdLoaderOptions &)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    
    std::optional<JS::NativeAdManager::SpecCreateAdLoaderOptionsVideoConfig> video = options.videoConfig();
    //TODO: Make this work with the passed config
    NSMutableDictionary * videoConfig = [NSMutableDictionary new];
    GADVideoOptions *videoOptions = [AdManagerController getVideoOptions: videoConfig];
  
    @try {
        CustomNativeAdLoader * loader = [[AdManagerController main] createAdLoaderForAdUnitId:options.adUnitId() withFormatIds:RCTConvertVecToArray(options.formatIds()) andOptions:@[videoOptions]];
        resolve([self customNativeAdLoaderDetailsToDict: [loader getDetails]]);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}

- (void)getAdLoaderDetails:(NSString *)adLoaderId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        CustomNativeAdLoaderDetails details = [[AdManagerController main] getAdLoaderDetailsForId:adLoaderId];
        resolve([self customNativeAdLoaderDetailsToDict:details]);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}


- (void)getAvailableAdLoaderIds:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    resolve([[AdManagerController main] getAvailableAdLoaderIds]);
}


- (void)loadRequest:(NSString *)adLoaderId options:(NSDictionary *)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    GAMRequest *request = [AdManagerController getRequestWithOptions:options andDefaultTargeting: self->defaultTargeting];
    
    [[AdManagerController main] loadRequest:request forId:adLoaderId withSuccessHandler:^(CustomNativeAdLoader * _Nonnull loader, GADCustomNativeAd * _Nonnull ad) {
        NSMutableDictionary * data = [self customNativeAdLoaderDetailsToDict: [loader getDetails]];
        NSDictionary *targeting = [request customTargeting];
        if(targeting != nil && targeting.count > 0){
            [data setObject:targeting forKey:@"targeting"];
        }
        resolve(data);
    } andErrorHandler:^(CustomNativeAdError * _Nonnull error) {
        [error insertIntoReactPromiseReject:reject];
    }];
}


- (void)makeLoaderOutdated:(NSString *)loaderId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try{
        CustomNativeAdLoader * loader = [[AdManagerController main] makeLoaderOutdated:loaderId];
        resolve([self customNativeAdLoaderDetailsToDict: [loader getDetails]]);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}


- (void)recordClick:(NSString *)adLoaderId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [self recordClickOnAssetKey:adLoaderId assetKey:nil resolve:resolve reject:reject];
}


- (void)recordClickOnAssetKey:(NSString *)adLoaderId assetKey:(NSString *)assetKey resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try{
        CustomNativeAdLoader * loader = [[AdManagerController main] getLoaderForIdOrThrow: adLoaderId];
        GADNativeAdCustomClickHandler customHandler;
        if (hasDefaultCustomClickHandler && ![loader hasActiveCustomClickHandler]) {
            customHandler = ^(NSString * _Nonnull assetID) {
                [self sendAdClickedEventforLoader:loader onAssetKey:assetID];
            };
        }
        NSString * clickedAssetKey = [[AdManagerController main] forLoaderId: adLoaderId recordClickOnAssetKey:assetKey withDefaultClickHandler:customHandler];
        
        NSMutableDictionary * data = [self customNativeAdLoaderDetailsToDict:[loader getDetails]];
        [data setObject:clickedAssetKey forKey:@"assetKey"];
        resolve(data);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}


- (void)recordImpression:(NSString *)adLoaderId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try{
        CustomNativeAdLoader * loader = [[AdManagerController main] recordImpressionForId:adLoaderId];
        resolve([self customNativeAdLoaderDetailsToDict: [loader getDetails]]);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}


- (void)removeAdLoader:(NSString *)loaderId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try{
        NSArray<NSString*> * remainingIds = [[AdManagerController main] removeAdLoader:loaderId];
        resolve(remainingIds);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}


- (void)removeCustomClickHandlerForLoader:(NSString *)loaderId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try{
        [[AdManagerController main] setCustomClickHandlerForLoader:loaderId clickHandler:nil];
        resolve(nil);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}


- (void)removeCustomDefaultClickHandler:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    hasDefaultCustomClickHandler = NO;
    resolve(nil);
}


- (void)setCustomClickHandlerForLoader:(NSString *)loaderId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try{
        CustomNativeAdLoader * loader = [[AdManagerController main] getLoaderForIdOrThrow:loaderId];
        [[AdManagerController main] setCustomClickHandlerForLoader:loaderId clickHandler:^(NSString * _Nonnull assetID) {
            [self sendAdClickedEventforLoader:loader onAssetKey:assetID];
        }];
        resolve(nil);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}


- (void)setCustomDefaultClickHandler:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    hasDefaultCustomClickHandler = YES;
    resolve(nil);
}


- (void)setIsDisplayingForLoader:(NSString *)loaderId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try{
        CustomNativeAdLoader * loader = [[AdManagerController main] setIsDisplayingForLoader:loaderId];
        resolve([self customNativeAdLoaderDetailsToDict: [loader getDetails]]);
    }
    @catch (CustomNativeAdError *error) {
        [error insertIntoReactPromiseReject:reject];
    }
}

#endif

#pragma mark Send Events

- (void)startObserving
{
  hasListeners = YES;
}

- (void)stopObserving
{
  hasListeners = NO;
}

- (void)sendEvent:(NSString *)name body:(id)body
{
  if (hasListeners) {
    [self sendEventWithName:name body:body];
  }
}

- (void) sendAdClickedEventforLoader: (CustomNativeAdLoader * )adLoader onAssetKey: (NSString*) assetKey {
    CustomNativeAdLoaderDetails details = [adLoader getDetails];
    NSMutableDictionary *data = [self customNativeAdLoaderDetailsToDict:details];
    [data setObject:@"assetKey" forKey:assetKey];
    [self sendEventWithName:@"onAdClicked" body:data];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onAdClicked"];
}

- (void)removeListeners:(double)count {
    [[AdManagerController main] clearAllClickHandler];
    [super removeListeners: count];
}

- (void)addListener:(NSString *)eventName {
    [super addListener:eventName];
}

@end
