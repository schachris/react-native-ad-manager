package com.admanagermobileads;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.TurboReactPackage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AdmanagerMobileAdsPackage extends TurboReactPackage {

  @NonNull
  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new AdmanagerMobileAdsModule(reactContext));
    modules.add(new AdmanagerMobileAdsConsentModule(reactContext));
    return modules;
  }

  @Nullable
  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    if (name.equals(AdmanagerMobileAdsModule.NAME)) {
      return new AdmanagerMobileAdsModule(reactContext);
    } else if (name.equals(AdmanagerMobileAdsConsentModule.NAME)) {
      return new AdmanagerMobileAdsConsentModule(reactContext);
    } else {
      return null;
    }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
      boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
      moduleInfos.put(
              AdmanagerMobileAdsModule.NAME,
              new ReactModuleInfo(
                      AdmanagerMobileAdsModule.NAME,
                      AdmanagerMobileAdsModule.NAME,
                      false, // canOverrideExistingModule
                      false, // needsEagerInit
                      true, // hasConstants
                      false, // isCxxModule
                      isTurboModule // isTurboModule
      ));
      moduleInfos.put(
        AdmanagerMobileAdsConsentModule.NAME,
        new ReactModuleInfo(
          AdmanagerMobileAdsConsentModule.NAME,
          AdmanagerMobileAdsConsentModule.NAME,
          false, // canOverrideExistingModule
          false, // needsEagerInit
          true, // hasConstants
          false, // isCxxModule
          isTurboModule // isTurboModule
        ));
      return moduleInfos;
    };
  }
}
