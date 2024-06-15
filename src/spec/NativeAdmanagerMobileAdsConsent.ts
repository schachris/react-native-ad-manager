import { TurboModule, TurboModuleRegistry } from "react-native";
import { UnsafeObject } from "react-native/Libraries/Types/CodegenTypes";
import { AdsConsentInfo } from "../UserMessagingPlatform";

export interface Spec extends TurboModule {
  reset(): void;
  getTCString(): Promise<string>;
  getPurposeConsents(): Promise<string>;
  getGdprApplies(): Promise<boolean>;
  showForm(): Promise<AdsConsentInfo>;
  showPrivacyOptionsForm(): Promise<AdsConsentInfo>;
  getConsentInfo(): Promise<AdsConsentInfo>;
  loadAndShowConsentFormIfRequired(): Promise<AdsConsentInfo>;
  requestInfoUpdate(options: UnsafeObject): Promise<AdsConsentInfo>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  "AdmanagerMobileAdsConsent"
);
