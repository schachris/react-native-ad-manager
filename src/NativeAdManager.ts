import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

import type { UnsafeObject } from 'react-native/Libraries/Types/CodegenTypes';

import type { AdState, GADNativeAdImageProps } from './types';

export type CustomAdClickHandler = (result: { assetKey: string } & AdLoaderDetails<any>) => void;

type AdAssets = Record<string, string | GADNativeAdImageProps>;

export type AdDetails<AdFormatType = AdAssets> = {
  formatId: string;
  responseInfo: Record<string, any>;
  assets: AdFormatType;
  assetKeys: keyof AdFormatType;
};

export type AdLoaderDetails<AdFormatType = AdAssets> = {
  id: string;
  adUnitId: string;
  formatIds: string[];
  state: AdState;
  ad?: AdDetails<AdFormatType>;
};

export interface Spec extends TurboModule {
  start(): void;
  clearAll(): void;
  startWithCallback(callback: (status: UnsafeObject) => void): void;
  setTestDeviceIds(testDeviceIds: ReadonlyArray<string>): void;

  setCustomDefaultClickHandler(): Promise<void>;
  removeCustomDefaultClickHandler(): Promise<void>;

  createAdLoader<AdFormatType>(options: {
    adUnitId: string;
    formatIds: ReadonlyArray<string>;
    videoConfig?: {
      startMuted?: boolean;
      customControlsRequested?: boolean;
      clickToExpandRequested?: boolean;
    };
  }): Promise<AdLoaderDetails<AdFormatType>>;
  loadRequest<AdFormatType, AdTargetingOptions = Record<string, string>>(
    adLoaderId: string,
    options: UnsafeObject
  ): Promise<AdLoaderDetails<AdFormatType> & { targeting: AdTargetingOptions }>;

  removeAdLoader(loaderId: string): Promise<ReadonlyArray<string>>;

  getAvailableAdLoaderIds(): Promise<string[]>;
  getAdLoaderDetails<AdFormatType>(adLoaderId: string): Promise<AdLoaderDetails<AdFormatType>>;

  setIsDisplayingForLoader<AdFormatType>(loaderId: string): Promise<AdLoaderDetails<AdFormatType>>;
  makeLoaderOutdated<AdFormatType>(loaderId: string): Promise<AdLoaderDetails<AdFormatType>>;

  recordImpression<AdFormatType>(adLoaderId: string): Promise<AdLoaderDetails<AdFormatType>>;

  setCustomClickHandlerForLoader(loaderId: string): Promise<void>;
  removeCustomClickHandlerForLoader(loaderId: string): Promise<void>;

  recordClick<AdFormatType>(adLoaderId: string): Promise<AdLoaderDetails<AdFormatType> & { assetKey: string }>;
  recordClickOnAssetKey<AdFormatType>(
    adLoaderId: string,
    assetKey: string
  ): Promise<AdLoaderDetails<AdFormatType> & { assetKey: string }>;

  // event emitter
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('AdManager');
