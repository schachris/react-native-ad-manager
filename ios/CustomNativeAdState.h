//
//  CustomNativeAdState.h
//  react-native-admanager-mobile-ads
//
//  Created by Christian Schaffrath on 18.05.23.
//

#ifndef CustomNativeAdState_h
#define CustomNativeAdState_h

enum {
    CustomNativeAdStateError = -1,
    CustomNativeAdStateInit = 0,
    CustomNativeAdStateLoading = 1,
    CustomNativeAdStateReceived = 2,
    CustomNativeAdStateDisplaying = 3,
    CustomNativeAdStateImpression = 4,
    CustomNativeAdStateClicked = 5,
    CustomNativeAdStateOutdated = 6
};
typedef int CustomNativeAdState;

#endif /* CustomNativeAdState_h */
