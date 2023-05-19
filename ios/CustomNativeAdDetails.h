//
//  CustomNativeAdLoaderDetails.h
//  react-native-ad-manager
//
//  Created by Christian Schaffrath on 19.05.23.
//

#import "CustomNativeAdState.h"

#ifndef CustomNativeAdDetails_h
#define CustomNativeAdDetails_h

typedef struct {
    NSString* formatId;
    NSDictionary<NSString *, id> * responseInfo;
    NSArray<NSString *> * assetKeys;
    NSDictionary * assets;
} CustomNativeAdDetails;


typedef struct {
    NSString* adUnitId;
    NSArray<NSString *> * formatIds;
    
    NSString * loaderId;
    CustomNativeAdState state;
    
    BOOL hasAd;
    CustomNativeAdDetails ad;
} CustomNativeAdLoaderDetails;



#endif /* CustomNativeAdLoaderDetails_h */


