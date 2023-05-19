//
//  CustomNativeAdError.m
//  react-native-ad-manager
//
//  Created by Christian Schaffrath on 19.05.23.
//

#import "CustomNativeAdError.h"

@implementation CustomNativeAdError
@synthesize errorCode = _errorCode;


+ (instancetype) errorWithMessage:(NSString *)message andCode:(NSString*)code {
    return [[CustomNativeAdError alloc] initWithTitle:@"CustomNativeAdError" message:message code:code];
}

+ (instancetype) withTitle:(NSString *)title message:(NSString *)message andCode:(NSString*)code {
    return [[CustomNativeAdError alloc] initWithTitle:title message:message code:code];
}

+ (instancetype) fromError: (NSError*) error WithCode:(NSString*)code {
    return [[CustomNativeAdError alloc] initWithError:error andCode:code];
}

- (instancetype)initWithError: (NSError*) error andCode: (NSString*) code {
    self = [super init];
    if (self) {
        _original_error = error;
        _title = [error domain];
        _message = [error localizedDescription];
        _errorCode = code != nil ? code : @"UNKNOWN_ERROR";
    }
    return self;
}

- (instancetype)initWithTitle:(NSString *)title message:(NSString *)message code:(NSString*)code
{
    self = [super init];
    if (self) {
        _title = [title copy];
        _message = [message copy];
        _errorCode = [code copy];
        
        _original_error = [NSError errorWithDomain:@"CustomNativeAdError" code:0 userInfo:
                               @{
                                   NSLocalizedDescriptionKey: message,
                                   NSLocalizedFailureReasonErrorKey: title,
                                   @"code": _errorCode
                               }
        ];
    }
    return self;
}

- (NSString *)localizedDescription {
    return self.message;
}

- (NSString *)localizedFailureReason {
    return self.title;
}

- (NSString*)errorCode {
    return _errorCode;
}

# pragma mark helper for react-native
- (void) insertIntoReactPromiseReject: (RCTPromiseRejectBlock)reject {
    reject(self.errorCode, [self localizedDescription], [self original_error]);
}

@end
