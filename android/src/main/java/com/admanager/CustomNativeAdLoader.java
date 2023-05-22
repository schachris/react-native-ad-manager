package com.admanager;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdLoader;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.VideoOptions;
import com.google.android.gms.ads.admanager.AdManagerAdRequest;
import com.google.android.gms.ads.nativead.NativeAdOptions;
import com.google.android.gms.ads.nativead.NativeCustomFormatAd;

import java.util.UUID;

public class CustomNativeAdLoader {

  private String loaderId;
  private String adUnitId;
  private String formatId;
  private CustomNativeAdState _adState;
  private CustomNativeAdError error;

  private NativeAdOptions.Builder adOptionBuilder;
  private AdLoader.Builder adLoaderBuilder;
  private AdLoader adLoader;
  private AdManagerAdRequest adRequest;
  private NativeCustomFormatAd receivedAd;

  private NativeCustomFormatAd.OnCustomClickListener customClickListener;

  private ReactApplicationContext reactApplicationContext;

  private AdStateChangeListener adStateChangeListener;
  private CustomNativeAdLoaderHandler adLoaderCompletionListener;

  public interface AdStateChangeListener {
    void onStateChanged(CustomNativeAdLoader loader, CustomNativeAdState oldState, CustomNativeAdState newState);
  }

  CustomNativeAdLoader(ReactApplicationContext context, String adUnitId, String formatId) {
    UUID uuid = UUID.randomUUID();
    this.loaderId = uuid.toString();

    this.adUnitId = adUnitId;
    this.formatId = formatId;
    this.reactApplicationContext = context;
    this.error = null;
    this._adState = CustomNativeAdState.CustomNativeAdStateInit;
    this.initBuilder();
  }

  private void initBuilder() {
    this.adLoaderBuilder = new AdLoader.Builder(this.reactApplicationContext, adUnitId);
    this.adOptionBuilder = new NativeAdOptions.Builder();
  }

  private void forceUpdateState(CustomNativeAdState newState) {
    CustomNativeAdState oldState = this._adState;
    this._adState = newState;
    if (this.adStateChangeListener != null) {
      this.adStateChangeListener.onStateChanged(this, oldState, newState);
    }
  }

  private void updateState(CustomNativeAdState newState) {
    CustomNativeAdState oldState = this._adState;
    if(oldState == CustomNativeAdState.CustomNativeAdStateError || oldState.getValue() < newState.getValue()) {
      this.forceUpdateState(newState);
    }
  }

  public String getAdUnitId() {
    return this.adUnitId;
  }

  public String getLoaderId() {
    return this.loaderId;
  }

  public String getFormatId() {
    return this.formatId;
  }

  public Boolean hasCustomClickHandler() {
    return this.customClickListener != null;
  }

  public void setVideoOptions(@Nullable VideoOptions options) {
    // Methods in the NativeAdOptions.Builder class can be
    // used here to specify individual options settings.
    if (options == null) {
      adOptionBuilder.setVideoOptions(new VideoOptions.Builder().setStartMuted(true).build());
    } else {
      adOptionBuilder.setVideoOptions(options);
    }
  }
  public void setReturnUrlsForImageAssets(Boolean shouldSet) {
    this.adOptionBuilder.setReturnUrlsForImageAssets(shouldSet);
  }

  public void removeCustomClickHandler() throws CustomNativeAdError {
    if (this._adState.getValue() <= CustomNativeAdState.CustomNativeAdStateLoading.getValue()) {
      this.customClickListener = null;
    } else {
      throw CustomNativeAdError.withMessage("Custom click handler can only be set before the loader starts to fetch an ad.", "SET_CUSTOM_CLICK_AFTER_LOAD");
    }
  }
  public void setCustomClickHandler(NativeCustomFormatAd.OnCustomClickListener handler) throws CustomNativeAdError {
    if (this._adState.getValue() <= CustomNativeAdState.CustomNativeAdStateLoading.getValue()) {
      this.customClickListener = handler;
    } else {
      throw CustomNativeAdError.withMessage("Custom click handler can only be set before the loader starts to fetch an ad.", "SET_CUSTOM_CLICK_AFTER_LOAD");
    }
  }

  public void clearup() {
    this.customClickListener = null;
    if (this.receivedAd != null) {
      this.receivedAd.destroy();
      this.receivedAd = null;
    }
    this.adLoader = null;
    this.adRequest = null;
    this.initBuilder();
    this.setVideoOptions(null);
    this.forceUpdateState(CustomNativeAdState.CustomNativeAdStateInit);
  }



  public CustomNativeAdLoaderDetails getDetails() {
    CustomNativeAdLoaderDetails details = new CustomNativeAdLoaderDetails(this.loaderId, this.adUnitId, this.formatId, this._adState);
    details.setReceivedAd(this.receivedAd);
    return details;
  }

  private void prepareForAdLoading() {
    this.adLoaderBuilder.forCustomFormatAd(this.getFormatId(), new NativeCustomFormatAd.OnCustomFormatAdLoadedListener() {
      @Override
      public void onCustomFormatAdLoaded(@NonNull NativeCustomFormatAd nativeCustomFormatAd) {
        // Show the custom format and record an impression.
        CustomNativeAdLoader.this.receivedAd = nativeCustomFormatAd;
        CustomNativeAdLoader.this.updateState(CustomNativeAdState.CustomNativeAdStateReceived);
        CustomNativeAdLoader.this.adLoaderCompletionListener.onAdReceived(CustomNativeAdLoader.this, nativeCustomFormatAd);
        CustomNativeAdLoader.this.adLoaderCompletionListener = null;
        // If this callback occurs after the activity is destroyed, you
        // must call destroy and return or you may get a memory leak.
        // Note `isDestroyed()` is a method on Activity.
        if (CustomNativeAdLoader.this.reactApplicationContext.getCurrentActivity().isDestroyed()) {
          nativeCustomFormatAd.destroy();
          return;
        }
      }
    }, this.customClickListener);
    this.adLoaderBuilder.withNativeAdOptions(CustomNativeAdLoader.this.adOptionBuilder.build());
    this.adLoaderBuilder.withAdListener(new AdListener() {
      @Override
      public void onAdFailedToLoad(@NonNull LoadAdError var1) {
        CustomNativeAdError error = CustomNativeAdError.fromAdError(var1, "FAILED_TO_RECEIVE_AD");
        CustomNativeAdLoader.this.error = error;
        CustomNativeAdLoader.this.updateState(CustomNativeAdState.CustomNativeAdStateError);
        // Handle the failure by logging, altering the UI, and so on.
        CustomNativeAdLoader.this.adLoaderCompletionListener.onAdLoadFailed(CustomNativeAdLoader.this, error);
        CustomNativeAdLoader.this.adLoaderCompletionListener = null;
      }
    });
  }

  public void loadAd(AdManagerAdRequest adRequest, CustomNativeAdLoaderHandler completionListener) {
    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        if(adLoader != null && adLoader.isLoading()){
          CustomNativeAdError error = CustomNativeAdError.withMessage("This loader is already loading a request.", "AD_REQUEST_ALREADY_RUNNING");
          CustomNativeAdLoader.this.error = error;
          CustomNativeAdLoader.this.updateState(CustomNativeAdState.CustomNativeAdStateError);
          CustomNativeAdLoader.this.adLoaderCompletionListener.onAdLoadFailed(CustomNativeAdLoader.this, error);
        }else{
          if (adLoader == null) {
            CustomNativeAdLoader.this.prepareForAdLoading();
          }
          CustomNativeAdLoader.this.adLoaderCompletionListener = completionListener;
          CustomNativeAdLoader.this.adLoader = adLoaderBuilder.build();
          CustomNativeAdLoader.this.adRequest = adRequest;
          CustomNativeAdLoader.this.updateState(CustomNativeAdState.CustomNativeAdStateLoading);
          CustomNativeAdLoader.this.adLoader.loadAd(adRequest);
        }
      }
    });
  }

  public void displayAd() throws CustomNativeAdError {
    if (this._adState.getValue() >= CustomNativeAdState.CustomNativeAdStateReceived.getValue()) {
      this.updateState(CustomNativeAdState.CustomNativeAdStateDisplaying);
    } else {
      throw CustomNativeAdError.withMessage("The ad is not ready to display.", "AD_NOT_DISPLAYABLE");
    }
  }

  public void recordImpression() throws CustomNativeAdError {
    if (this.receivedAd != null) {
      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          CustomNativeAdLoader.this.receivedAd.recordImpression();
        }
      });
      CustomNativeAdLoader.this.updateState(CustomNativeAdState.CustomNativeAdStateImpression);
    }else{
      throw CustomNativeAdError.withMessage("Could not record impression. Propably no ad received yet.", "RECORD_AD_IMPRESSION_FAILED");
    }
  }

  public String recordClick(@Nullable String assetKey) throws CustomNativeAdError {
    if (this.receivedAd != null) {
      String clickedAssetKey;
      if(assetKey == null){
        clickedAssetKey = Utils.getOneAssetKey(this.receivedAd);
      }else{
        clickedAssetKey = assetKey;
      }
      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          //It does not matter if we call this function to often...google will take care of that and still tracks it as a single impression
          //so if someone clicks it the ad must have been seen
          CustomNativeAdLoader.this.receivedAd.recordImpression();
          CustomNativeAdLoader.this.receivedAd.performClick(clickedAssetKey);
        }
      });
      CustomNativeAdLoader.this.updateState(CustomNativeAdState.CustomNativeAdStateClicked);
      return clickedAssetKey;
    }else{
      throw CustomNativeAdError.withMessage("Could not record click on asset key. Propably no ad received yet.", "RECORD_AD_CLICK_FAILED");
    }
  }

  public void makeOutdated() {
    this.updateState(CustomNativeAdState.CustomNativeAdStateOutdated);
  }
}
