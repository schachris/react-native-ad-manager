package com.admanager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

abstract class AdManagerSpec extends ReactContextBaseJavaModule {
  AdManagerSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract void start();
  public abstract void clearAll();
  public abstract void startWithCallback(Callback callback);
  public abstract void setTestDeviceIds(ReadableArray testDeviceIds);
  public abstract void defaultTargeting(ReadableMap targeting);
  public abstract void removeCustomDefaultClickHandler(Promise promise);
  public abstract void setCustomDefaultClickHandler(Promise promise);
  public abstract void getAvailableAdLoaderIds(Promise promise);
  public abstract void getAdLoaderDetails(String loaderId, Promise promise);
  public abstract void createAdLoader(ReadableMap options, Promise promise);
  public abstract void removeCustomClickHandlerForLoader(String loaderId, Promise promise);
  public abstract void setCustomClickHandlerForLoader(String loaderId, Promise promise) ;
  public abstract void setIsDisplayingForLoader(String loaderId, Promise promise) ;
  public abstract void makeLoaderOutdated(String loaderId, Promise promise) ;
  public abstract void removeAdLoader(String loaderId, Promise promise) ;
  public abstract void loadRequest(String loaderId, ReadableMap options, Promise promise);
  public abstract void recordImpression(String loaderId, Promise promise);
  public abstract void recordClickOnAssetKey(String loaderId, String assetKey, Promise promise);
  public abstract void recordClick(String loaderId, Promise promise);

}
