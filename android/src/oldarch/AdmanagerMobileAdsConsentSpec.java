package com.admanagermobileads;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

import javax.annotation.Nonnull;

abstract class AdmanagerMobileAdsConsentSpec extends ReactContextBaseJavaModule {
  AdmanagerMobileAdsConsentSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract void requestInfoUpdate(@Nonnull final ReadableMap options, final Promise promise);

  public abstract void showForm(final Promise promise);

  public abstract void showPrivacyOptionsForm(final Promise promise);

  public abstract void loadAndShowConsentFormIfRequired(final Promise promise);

  public abstract void getConsentInfo(Promise promise);

  public abstract void reset();

  public abstract void getTCString(Promise promise) ;

  public abstract void getGdprApplies(Promise promise);

  public abstract void getPurposeConsents(Promise promise);
}
