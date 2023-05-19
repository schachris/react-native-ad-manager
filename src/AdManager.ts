import { NativeModules, Platform } from 'react-native';

import type { Spec } from './NativeAdManager';

const LINKING_ERROR =
  `The package 'react-native-ad-manager' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const AdManagerModule: Spec = isTurboModuleEnabled ? require('./NativeAdManager').default : NativeModules.AdManager;

export const AdManager: Spec = AdManagerModule
  ? AdManagerModule
  : new Proxy({} as any, {
      get() {
        throw new Error(LINKING_ERROR);
      },
    });
