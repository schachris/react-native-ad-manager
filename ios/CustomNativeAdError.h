//
//  CustomNativeAdError.h
//  react-native-admanager-mobile-ads
//
//  Created by Christian Schaffrath on 19.05.23.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface CustomNativeAdError : NSObject

+ (instancetype) errorWithMessage:(NSString *)message andCode:(NSString*)code;
+ (instancetype) fromError: (NSError*) error WithCode:(NSString*)code;

@property (nonatomic, copy, readonly) NSString *title;
@property (nonatomic, copy, readonly) NSString *message;
@property (nonatomic, copy, readonly) NSString *errorCode;
@property (nonatomic, copy, readonly) NSError *original_error;

- (void) insertIntoReactPromiseReject: (RCTPromiseRejectBlock)reject;

@end

NS_ASSUME_NONNULL_END
