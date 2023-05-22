package com.admanager;

import com.google.android.gms.ads.nativead.NativeCustomFormatAd;

public interface CustomNativeAdLoaderHandler {
  void onAdReceived(CustomNativeAdLoader adLoader, NativeCustomFormatAd nativeCustomFormatAd);
  void onAdLoadFailed(CustomNativeAdLoader adLoader, CustomNativeAdError adError);
}
