//
//  GADCustomNativeAd+Infos.m
//  react-native-ad-manager
//
//  Created by Christian Schaffrath on 18.05.23.
//

#import "GADCustomNativeAd+Infos.h"

@implementation GADCustomNativeAd (Infos)

- (CustomNativeAdDetails) getAdDetails {
    CustomNativeAdDetails details;
    details.formatId = self.formatID;
    details.responseInfo = self.responseInfo.dictionaryRepresentation;
    details.assetKeys = self.availableAssetKeys;
    
    NSMutableDictionary *assets = [self getAssets];
    if ([assets count] > 0){
        details.assets = assets;
    }else{
        details.assets = nil;
    }
    
    return details;
}

- (NSMutableDictionary*) getAssets {
    NSMutableDictionary *assets = [[NSMutableDictionary alloc] init];
    [self.availableAssetKeys enumerateObjectsUsingBlock:^(NSString * _Nonnull value, NSUInteger idx, BOOL * _Nonnull stop) {
        NSString *assetVal = [self stringForKey:value];
        if (assetVal != nil) {
            assets[value] = assetVal;
        } else if ([self imageForKey:value] != nil) {
            GADNativeAdImage *adImage = [self imageForKey:value];
            assets[value] = [[NSMutableDictionary alloc] initWithObjectsAndKeys:
                             adImage.imageURL.absoluteString, @"uri",
                         [[NSNumber numberWithFloat:adImage.image.size.width] stringValue], @"width",
                         [[NSNumber numberWithFloat:adImage.image.size.height] stringValue], @"height",
                         [[NSNumber numberWithFloat:adImage.scale] stringValue], @"scale",
                         nil];
        }
    }];
    return assets;
}

- (NSString*) getOneAssetKey {
    __block NSString *assetKey = @"ad";
    [self.availableAssetKeys enumerateObjectsUsingBlock:^(NSString * _Nonnull propname, NSUInteger idx, BOOL * _Nonnull stop) {
        NSString *assetVal = [self stringForKey:propname];
        if (assetVal != nil && assetVal.length > 1) {
            assetKey = propname;
        }
    }];
    return assetKey;
}

@end


