import { useEffect } from 'react';

import type { AdQueueLoader } from './AdQueueLoader';
import { AdState } from './types';
import { CustomNativeAdHookReturnType, useCustomNativeAd } from './useCustomNativeAd';
import { useFireAfterVisibilityDuration } from './useFireAfterVisibilityDuration';
import { adStateToString } from './utils';

export function useVisibleCustomNativeAd<AdFormatType, Targeting>({
  visible,
  adLoader,
  msToDisplayTillImpressionRecording = 2000,
  msToDisplayTillRenew = 30 * 1000,
  log = false,
}: {
  visible: boolean;
  adLoader?: AdQueueLoader<AdFormatType, Targeting>;
  msToDisplayTillImpressionRecording?: number;
  msToDisplayTillRenew?: number;
  log?: boolean | string;
}): CustomNativeAdHookReturnType<AdFormatType, Targeting> {
  const {
    id,
    ad,
    state: adState,
    display,
    renew,
    impression,
    click,
    outdated,
    targeting,
    tracker,
  } = useCustomNativeAd(adLoader!, log);

  useEffect(() => {
    if (__DEV__ && log) {
      console.log(log, 'updateEffect state:', adStateToString(adState), 'visible:', visible);
    }
    if (adState === AdState.Received && visible) {
      display();
    } else if (adState === AdState.Error) {
      if (__DEV__ && log) {
        console.log(log, 'RENEW error');
      }
      renew();
    } else if (visible && adState === AdState.Outdated) {
      if (__DEV__ && log) {
        console.log(log, 'RENEW outdated');
      }
      renew();
    }
  }, [adState, visible, renew, display, log]);

  const isMinDisplaying = adState >= AdState.Displaying;
  const isMinImpression = adState >= AdState.Impression;
  useFireAfterVisibilityDuration(visible, impression, msToDisplayTillImpressionRecording, isMinDisplaying);
  useFireAfterVisibilityDuration(
    visible,
    outdated,
    msToDisplayTillRenew - msToDisplayTillImpressionRecording,
    isMinImpression
  );

  return {
    id,
    ad,
    state: adState,
    display,
    renew,
    impression,
    click,
    outdated,
    targeting,
    tracker,
  };
}
