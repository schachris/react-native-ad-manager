import { TCModel, TCString } from "@iabtcf/core";
import { NativeModules } from "react-native";
import {
  isArray,
  isBoolean,
  isObject,
  isPropertySet,
  isString
} from "../utils";
import {
  AdsConsentDebugGeography,
  AdsConsentInfo,
  AdsConsentInfoOptions,
  AdsConsentInterface,
  AdsConsentPurposes,
  AdsConsentSpecialFeatures,
  AdsConsentUserChoices
} from "./types";

import { Platform } from "react-native";
import { Spec } from "../spec/NativeAdmanagerMobileAdsConsent";

const LINKING_ERROR =
  `The package 'react-native-admanager-mobile-ads' (AdConsent) doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo Go\n";

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const AdsConsentModule: Spec = isTurboModuleEnabled
  ? require("../spec/NativeAdmanagerMobileAdsConsent").default
  : NativeModules.AdmanagerMobileAdsConsent;

const native: Spec = AdsConsentModule
  ? AdsConsentModule
  : new Proxy({} as any, {
      get() {
        throw new Error(LINKING_ERROR);
      }
    });

export const AdsConsent: AdsConsentInterface = {
  requestConsentInfoUpdate(
    options: AdsConsentInfoOptions = {}
  ): Promise<AdsConsentInfo> {
    if (!isObject(options)) {
      throw new Error(
        "AdsConsent.requestInfoUpdate(*) 'options' expected an object value."
      );
    }

    if (
      isPropertySet(options, "debugGeography") &&
      options.debugGeography !== AdsConsentDebugGeography.DISABLED &&
      options.debugGeography !== AdsConsentDebugGeography.EEA &&
      options.debugGeography !== AdsConsentDebugGeography.NOT_EEA
    ) {
      throw new Error(
        "AdsConsent.requestInfoUpdate(*) 'options.debugGeography' expected one of AdsConsentDebugGeography.DISABLED, AdsConsentDebugGeography.EEA or AdsConsentDebugGeography.NOT_EEA."
      );
    }

    if (
      isPropertySet(options, "tagForUnderAgeOfConsent") &&
      !isBoolean(options.tagForUnderAgeOfConsent)
    ) {
      throw new Error(
        "AdsConsent.requestInfoUpdate(*) 'options.tagForUnderAgeOfConsent' expected a boolean value."
      );
    }

    if (isPropertySet(options, "testDeviceIdentifiers")) {
      if (!isArray(options.testDeviceIdentifiers)) {
        throw new Error(
          "AdsConsent.requestInfoUpdate(*) 'options.testDeviceIdentifiers' expected an array of string values."
        );
      }

      for (const deviceId of options.testDeviceIdentifiers ?? []) {
        if (!isString(deviceId)) {
          throw new Error(
            "AdsConsent.requestInfoUpdate(*) 'options.testDeviceIdentifiers' expected an array of string values."
          );
        }
      }
    }

    return native.requestInfoUpdate(options);
  },

  showForm(): Promise<AdsConsentInfo> {
    return native.showForm();
  },

  showPrivacyOptionsForm(): Promise<AdsConsentInfo> {
    return native.showPrivacyOptionsForm();
  },

  loadAndShowConsentFormIfRequired(): Promise<AdsConsentInfo> {
    return native.loadAndShowConsentFormIfRequired();
  },

  getConsentInfo(): Promise<AdsConsentInfo> {
    return native.getConsentInfo();
  },

  reset(): void {
    return native.reset();
  },

  getTCString(): Promise<string> {
    return native.getTCString();
  },

  async getTCModel(): Promise<TCModel> {
    const tcString = await native.getTCString();
    return TCString.decode(tcString);
  },

  getGdprApplies(): Promise<boolean> {
    return native.getGdprApplies();
  },

  getPurposeConsents(): Promise<string> {
    return native.getPurposeConsents();
  },

  async getUserChoices(): Promise<AdsConsentUserChoices> {
    const tcString = await native.getTCString();

    let tcModel: TCModel;

    try {
      tcModel = TCString.decode(tcString);
    } catch (e) {
      tcModel = new TCModel();

      if (__DEV__) {
        console.warn(
          `Failed to decode tcString ${tcString}:`,
          e,
          "Note: DEV-Only warning"
        );
      }
    }

    return {
      activelyScanDeviceCharacteristicsForIdentification:
        tcModel.specialFeatureOptins.has(
          AdsConsentSpecialFeatures.ACTIVELY_SCAN_DEVICE_CHARACTERISTICS_FOR_IDENTIFICATION
        ),
      applyMarketResearchToGenerateAudienceInsights:
        tcModel.purposeConsents.has(
          AdsConsentPurposes.APPLY_MARKET_RESEARCH_TO_GENERATE_AUDIENCE_INSIGHTS
        ),
      createAPersonalisedAdsProfile: tcModel.purposeConsents.has(
        AdsConsentPurposes.CREATE_A_PERSONALISED_ADS_PROFILE
      ),
      createAPersonalisedContentProfile: tcModel.purposeConsents.has(
        AdsConsentPurposes.CREATE_A_PERSONALISED_CONTENT_PROFILE
      ),
      developAndImproveProducts: tcModel.purposeConsents.has(
        AdsConsentPurposes.DEVELOP_AND_IMPROVE_PRODUCTS
      ),
      measureAdPerformance: tcModel.purposeConsents.has(
        AdsConsentPurposes.MEASURE_AD_PERFORMANCE
      ),
      measureContentPerformance: tcModel.purposeConsents.has(
        AdsConsentPurposes.MEASURE_CONTENT_PERFORMANCE
      ),
      selectBasicAds: tcModel.purposeConsents.has(
        AdsConsentPurposes.SELECT_BASIC_ADS
      ),
      selectPersonalisedAds: tcModel.purposeConsents.has(
        AdsConsentPurposes.SELECT_PERSONALISED_ADS
      ),
      selectPersonalisedContent: tcModel.purposeConsents.has(
        AdsConsentPurposes.SELECT_PERSONALISED_CONTENT
      ),
      storeAndAccessInformationOnDevice: tcModel.purposeConsents.has(
        AdsConsentPurposes.STORE_AND_ACCESS_INFORMATION_ON_DEVICE
      ),
      usePreciseGeolocationData: tcModel.specialFeatureOptins.has(
        AdsConsentSpecialFeatures.USE_PRECISE_GEOLOCATION_DATA
      )
    };
  }
};
