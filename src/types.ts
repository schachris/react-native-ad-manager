import type { Double } from 'react-native/Libraries/Types/CodegenTypes';

export enum GADAdapterStatusState {
  NotReady = 0,
  Ready = 1,
}

export type AdErrorProps = { title: string; code: string; message: string };

export type AdSpecification = {
  adUnitId: string;
  formatIds: string[];
};

export enum AdTrackingTransparencyStatus {
  NotDetermined = 0,
  Restricted = 1,
  Denied = 2,
  Authorized = 3,
}

export type GADAdRequestOptions<T = Record<string, string>> = {
  /**
   * Arbitrary object of custom targeting information.
   */
  targeting?: T;

  /**
   * Array of exclusion labels.
   */
  categoryExclusions?: string[];

  /**
   * Array of keyword strings.
   */
  keywords?: string[];

  /**
   * Applications that monetize content matching a webpage's content may pass
   * a content URL for keyword targeting.
   */
  contentURL?: string;

  /**
   * You can set a publisher provided identifier (PPID) for use in frequency
   * capping, audience segmentation and targeting, sequential ad rotation, and
   * other audience-based ad delivery controls across devices.
   */
  publisherProvidedID?: string;

  requestAgent?: string;

  neighboringContentURLStrings?: Record<string, string>;

  /**
   * Android only
   * ios is handled differently. See AdManager for more details.
   */
  returnUrlsForImageAssets?: boolean;
  requestMultipleImages?: boolean;
};

type GADAdapterStatus = {
  description: string;
  state: GADAdapterStatusState;
  latency: Double;
};

export type GADInitializationStatus = {
  [adapterName: string]: GADAdapterStatus;
};

export type GADNativeAdImageProps = {
  uri: string;
  width: number;
  height: number;
  scale: number;
};

export enum AdState {
  Error = -1,
  Init = 0,
  Loading = 1,
  Received = 2,
  Displaying = 3,
  Impression = 4,
  Clicked = 5,
  Outdated = 6,
}
