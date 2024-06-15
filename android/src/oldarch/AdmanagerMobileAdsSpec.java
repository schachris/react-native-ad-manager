package com.admanagermobileads;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

abstract class AdmanagerMobileAdsSpec extends ReactContextBaseJavaModule {
  AdmanagerMobileAdsSpec(ReactApplicationContext context) {
    super(context);
  }

  // public abstract void multiply(double a, double b, Promise promise);

  public abstract void start();
  public abstract void clearAll();
  public abstract void startWithCallback(Callback callback);
  public abstract void setTestDeviceIds(ReadableArray testDeviceIds);
  public abstract void defaultTargeting(ReadableMap targeting);
  public abstract void removeCustomDefaultClickHandler(Promise promise);
  public abstract void setCustomDefaultClickHandler(Promise promise);


  public abstract void requestAdTrackingTransparency(Callback callback);
  public abstract void requestAdTrackingTransparencyBeforeAdLoad(Boolean shouldRequestATT);

  public abstract void getAvailableAdLoaderIds(Promise promise);
  public abstract void getAdLoaderDetails(String loaderId, Promise promise);
  public abstract void createAdLoader(ReadableMap options, Promise promise);
  public abstract void removeCustomClickHandlerForLoader(String loaderId, Promise promise);
  public abstract void setCustomClickHandlerForLoader(String loaderId, Promise promise) ;
  public abstract void setIsDisplayingForLoader(String loaderId, Promise promise) ;
  public abstract void setIsDisplayingOnViewForLoader(String loaderId, Integer viewTag, Promise promise) ;
  public abstract void makeLoaderOutdated(String loaderId, Promise promise) ;
  public abstract void destroyLoader(String loaderId, Promise promise) ;
  public abstract void removeAdLoader(String loaderId, Promise promise) ;
  public abstract void loadRequest(String loaderId, ReadableMap options, Promise promise);
  public abstract void recordImpression(String loaderId, Promise promise);
  public abstract void recordClickOnAssetKey(String loaderId, String assetKey, Promise promise);
  public abstract void recordClick(String loaderId, Promise promise);
}
