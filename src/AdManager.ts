import { EmitterSubscription, NativeEventEmitter, NativeModules, Platform, findNodeHandle } from 'react-native';

import type { AdLoaderDetails, Spec } from './NativeAdManager';
import type { AdTrackingTransparencyStatus, GADAdRequestOptions, GADInitializationStatus } from './types';

const LINKING_ERROR =
  `The package 'react-native-admanager-mobile-ads' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const AdManagerModule: Spec = isTurboModuleEnabled ? require('./NativeAdManager').default : NativeModules.AdManager;

export const NativeAdManager: Spec = AdManagerModule
  ? AdManagerModule
  : new Proxy({} as any, {
      get() {
        throw new Error(LINKING_ERROR);
      },
    });

export type CustomAdClickHandler = (result: { assetKey: string } & AdLoaderDetails<any>) => void;

class AdManagerController {
  private emitter: NativeEventEmitter;
  private subscription: EmitterSubscription;
  private customClickHandler: { [id: string]: CustomAdClickHandler } = {};
  private defaultClickHandler: CustomAdClickHandler | undefined = undefined;
  constructor() {
    this.emitter = new NativeEventEmitter(NativeAdManager as any);

    // Set up the event listener
    this.subscription = this.emitter.addListener('onAdClicked', (data: AdLoaderDetails<any> & { assetKey: string }) => {
      // Handle the callback data here
      if (data && data.id) {
        const handler = this.customClickHandler[data.id];
        if (handler) {
          handler(data);
        } else if (this.defaultClickHandler) {
          this.defaultClickHandler(data);
        }
      }
    });
  }

  removeSubscription() {
    return this.subscription?.remove();
  }

  start() {
    return NativeAdManager.start();
  }

  startWithCallback(callback: (status: GADInitializationStatus) => void) {
    return NativeAdManager.startWithCallback(callback as any);
  }

  setTestDeviceIds(testDeviceIds: ReadonlyArray<string>) {
    return NativeAdManager.setTestDeviceIds(testDeviceIds);
  }

  requestAdTrackingTransparency(callback: (status: AdTrackingTransparencyStatus) => void) {
    return NativeAdManager.requestAdTrackingTransparency(callback);
  }

  setOnlyRequestAdsAfterATTFinished(onlyLoadRequestsAfterATT: boolean) {
    return NativeAdManager.requestAdTrackingTransparencyBeforeAdLoad(onlyLoadRequestsAfterATT);
  }

  clearAll() {
    return NativeAdManager.clearAll();
  }

  async setCustomDefaultClickHandler(handler?: CustomAdClickHandler) {
    if (handler) {
      await NativeAdManager.setCustomDefaultClickHandler();
      this.defaultClickHandler = handler;
    } else {
      return this.removeCustomDefaultClickHandler();
    }
  }
  async removeCustomDefaultClickHandler() {
    await NativeAdManager.removeCustomDefaultClickHandler();
    this.defaultClickHandler = undefined;
  }

  createAdLoader<AdFormatType>(options: {
    adUnitId: string;
    formatIds: ReadonlyArray<string>;
    videoConfig?: {
      startMuted?: boolean;
      customControlsRequested?: boolean;
      clickToExpandRequested?: boolean;
    };
  }) {
    return NativeAdManager.createAdLoader<AdFormatType>(options);
  }
  loadRequest<AdFormatType, AdTargetingOptions = Record<string, string>>(
    adLoaderId: string,
    options: GADAdRequestOptions<AdTargetingOptions>
  ) {
    return NativeAdManager.loadRequest<AdFormatType, AdTargetingOptions>(adLoaderId, options);
  }

  removeAdLoader(loaderId: string) {
    return NativeAdManager.removeAdLoader(loaderId);
  }

  getAvailableAdLoaderIds() {
    return NativeAdManager.getAvailableAdLoaderIds();
  }

  getAdLoaderDetails<AdFormatType>(adLoaderId: string) {
    return NativeAdManager.getAdLoaderDetails<AdFormatType>(adLoaderId);
  }

  setIsDisplayingForLoader<AdFormatType>(loaderId: string) {
    return NativeAdManager.setIsDisplayingForLoader<AdFormatType>(loaderId);
  }

  setIsDisplayingOnViewForLoader<AdFormatType>(loaderId: string, adViewRef: React.RefObject<any>) {
    if (adViewRef && adViewRef.current) {
      const adViewTag = findNodeHandle(adViewRef.current);
      if (adViewTag) {
        return NativeAdManager.setIsDisplayingOnViewForLoader<AdFormatType>(loaderId, adViewTag);
      }
    }
    throw new Error('AdViewRef was not found or resolved in null value');
  }

  makeLoaderOutdated<AdFormatType>(loaderId: string) {
    return NativeAdManager.makeLoaderOutdated<AdFormatType>(loaderId);
  }

  destroyLoader<AdFormatType>(loaderId: string) {
    return NativeAdManager.destroyLoader<AdFormatType>(loaderId);
  }

  recordImpression<AdFormatType>(adLoaderId: string) {
    return NativeAdManager.recordImpression<AdFormatType>(adLoaderId);
  }

  async setCustomClickHandlerForLoader(loaderId: string, clickHandler?: CustomAdClickHandler) {
    if (clickHandler) {
      await NativeAdManager.setCustomClickHandlerForLoader(loaderId);
      this.customClickHandler[loaderId] = clickHandler;
    } else {
      return this.removeCustomClickHandlerForLoader(loaderId);
    }
  }

  async removeCustomClickHandlerForLoader(loaderId: string) {
    await NativeAdManager.removeCustomClickHandlerForLoader(loaderId);
    delete this.customClickHandler[loaderId];
  }

  recordClick<AdFormatType>(adLoaderId: string) {
    return NativeAdManager.recordClick<AdFormatType>(adLoaderId);
  }

  recordClickOnAssetKey<AdFormatType>(adLoaderId: string, assetKey: string) {
    return NativeAdManager.recordClickOnAssetKey<AdFormatType>(adLoaderId, assetKey);
  }
}

export const AdManager = new AdManagerController();
