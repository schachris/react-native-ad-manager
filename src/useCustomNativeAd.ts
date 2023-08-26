import { useCallback, useEffect, useRef, useState } from 'react';

import { AdLoader } from './AdLoader';
import type { AdQueueLoader } from './AdQueueLoader';
import type { AdDetails } from './NativeAdManager';
import { AdState } from './types';
import { PackageConfig } from './utils';

export type AdSpecification = {
  adUnitId: string;
  formatIds: string[];
};

export type AdLoading = {
  specification: AdSpecification;
  state: AdState.Loading;
};

export type AdError = {
  state: AdState.Error;
  error?: Error;
};

export type AdDisplaying<AdFormatType> = { ad: AdDetails<AdFormatType>; state: AdState.Displaying };

export type AdReceived<AdFormatType> = {
  ad: AdDetails<AdFormatType>;
  state: AdState.Received;
  targeting?: Record<string, string>;
};

export type AdImpressionRecorded<AdFormatType> = {
  ad: AdDetails<AdFormatType>;
  state: AdState.Impression;
  targeting?: Record<string, string>;
};

export type AdClicked<AdFormatType> = {
  ad: AdDetails<AdFormatType>;
  state: AdState.Clicked;
  targeting?: Record<string, string>;
};

export type AdOutdated<AdFormatType> = {
  ad: AdDetails<AdFormatType>;
  state: AdState.Outdated;
  targeting?: Record<string, string>;
};

type AdStates<AdFormatType> =
  | AdLoading
  | AdError
  | AdReceived<AdFormatType>
  | AdDisplaying<AdFormatType>
  | AdImpressionRecorded<AdFormatType>
  | AdClicked<AdFormatType>
  | AdOutdated<AdFormatType>;

function getAdState<AdFormatType>(ad?: AdLoader<AdFormatType>): AdStates<AdFormatType> {
  if (ad) {
    const state = ad.getState();
    if (state === AdState.Init) {
      return {
        specification: ad.getSpecification(),
        state: AdState.Loading,
      };
    } else if (state === AdState.Loading) {
      return {
        specification: ad.getSpecification(),
        state: AdState.Loading,
      };
    } else if (state >= AdState.Received) {
      return {
        ad: ad.getInfos()!.ad!,
        targeting: ad.getTargeting(),
        state,
      };
    }
  }
  return {
    error: ad?.getError(),
    state: AdState.Error,
  };
}

function getOne<AdFormatType, Targeting>(
  config:
    | AdSpecification
    | {
        loader?: AdQueueLoader<AdFormatType, Targeting>;
      },
  instanceId?: string
) {
  const { loader, adUnitId, formatIds } = config as AdSpecification & {
    loader: AdQueueLoader<AdFormatType>;
  };
  const possibleAd = loader.dequeue();
  if (PackageConfig.logging) {
    console.log(possibleAd?.getId(), 'Get Initial');
  }

  if (possibleAd) {
    return possibleAd;
  }
  return new AdLoader<AdFormatType>(
    {
      adUnitId: adUnitId || loader!.getSpecification().adUnitId,
      formatIds: formatIds || loader!.getSpecification().formatIds,
    },
    undefined,
    instanceId
  );
}

export function useCustomNativeAd<AdFormatType, Targeting>(
  queue: AdQueueLoader<AdFormatType, Targeting>,
  log: boolean | string = false
) {
  const tracker = useRef<{ renew_counter: number; renew_afterError: number; impressions: number }>({
    renew_counter: 0,
    renew_afterError: 0,
    impressions: 0,
  });
  const ref = useRef<AdLoader<AdFormatType>>();
  if (!ref.current) {
    ref.current = getOne({ loader: queue });
  }
  const [state, setState] = useState<AdStates<AdFormatType>>(getAdState(ref.current));
  useEffect(() => {
    if (ref.current) {
      ref.current.onStateChangeHandler = () => {
        const adState = getAdState<AdFormatType>(ref.current);
        setState(adState);
      };
    }

    return () => {
      if (ref.current) {
        ref.current.destroy();
        ref.current.onStateChangeHandler = undefined;
      }
    };
  }, []);

  const upcomingAdRef = useRef<AdLoader<AdFormatType>>();
  const renew = useCallback(() => {
    if (__DEV__ && log) {
      console.log(log, 'do renew', tracker.current, upcomingAdRef.current);
    }
    const renew_attempts = 2;
    if (!upcomingAdRef.current) {
      tracker.current.renew_counter += 1;
      const newAd = getOne({ loader: queue });
      const newAdState = newAd.getState();
      if (__DEV__ && log) {
        console.log(log, 'get new adstate:', newAdState);
      }
      if (newAdState === AdState.Init || newAdState === AdState.Loading) {
        upcomingAdRef.current = newAd;
        upcomingAdRef.current!.onStateChangeHandler = (newState) => {
          if (__DEV__ && log) {
            console.log(log, 'legacy onStateChangeHandler', newState);
          }
          if (upcomingAdRef.current) {
            if (newState === AdState.Error) {
              upcomingAdRef.current.onStateChangeHandler = undefined;
              upcomingAdRef.current = undefined;
              //   renew_tracker.current.afterError += 1;
              //   if (renew_tracker.current.afterError < renew_attempts) {
              //     console.log('call renew');
              //     renew();
              //   }
            } else if (newState === AdState.Received) {
              tracker.current.renew_afterError = 0;
              if (ref.current) {
                ref.current.destroy();
                ref.current.onStateChangeHandler = undefined;
                ref.current = undefined;
              }
              ref.current = upcomingAdRef.current;
              ref.current.onStateChangeHandler = () => setState(getAdState(ref.current));
              upcomingAdRef.current = undefined;
              setState(getAdState(ref.current));
            }
          }
        };
      } else if (newAdState === AdState.Received) {
        tracker.current.renew_afterError = 0;
        if (ref.current) {
          ref.current.destroy();
          ref.current.onStateChangeHandler = undefined;
        }
        ref.current = newAd;
        newAd.onStateChangeHandler = () => setState(getAdState(ref.current));
        setState(getAdState(ref.current));
      } else {
        tracker.current.renew_afterError += 1;
        if (tracker.current.renew_afterError < renew_attempts) {
          if (__DEV__ && log) {
            console.log(log, 'call renew error');
          }
          renew();
        }
      }
    } else {
      if (__DEV__ && log) {
        console.log(log, 'blocked...something running already');
      }
    }
  }, [queue, log]);

  const outdated = useCallback(() => {
    ref.current?.makeOutdated();
  }, []);

  const impression = useCallback(() => {
    ref.current?.recordImpression();
    tracker.current.impressions += 1;
  }, []);

  const display = useCallback(() => {
    ref.current?.display();
  }, []);

  const click = useCallback((assetKey?: string) => {
    ref.current?.recordClick(assetKey);
  }, []);

  return {
    state: state.state,
    id: ref.current.getId(),
    ad: (state as AdReceived<AdFormatType>).ad || undefined,
    targeting: (state as AdReceived<AdFormatType>).targeting,
    error: (state as AdError).error,
    display,
    outdated,
    impression,
    click,
    renew,
    tracker: tracker.current,
  } as CustomNativeAdHookReturnType<AdFormatType, Targeting>;
}

export type CustomNativeAdHookReturnType<AdFormatType, T> = {
  state: AdState;
  id: string;
  ad?: AdDetails<AdFormatType>;
  error?: Error;
  click: (assetKey?: string) => void;
  display: () => void;
  impression: () => void;
  outdated: () => void;
  renew: () => void;
  targeting: T;
  tracker: {
    renew_counter: number;
    renew_afterError: number;
    impressions: number;
  };
};
