//
//  GADCustomNativeAd+Infos.h
//  react-native-admanager-mobile-ads
//
//  Created by Christian Schaffrath on 18.05.23.
//

#import <Foundation/Foundation.h>
#import <GoogleMobileAds/GoogleMobileAds.h>
#import "CustomNativeAdDetails.h"

NS_ASSUME_NONNULL_BEGIN

@interface GADCustomNativeAd (Infos)

- (CustomNativeAdDetails) getAdDetails;
- (NSMutableDictionary*) getAssets;
- (NSString*) getOneAssetKey;

@end


NS_ASSUME_NONNULL_END
