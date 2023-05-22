package com.admanager;

public enum CustomNativeAdState {

    CustomNativeAdStateError(-1),
    CustomNativeAdStateInit(0),
    CustomNativeAdStateLoading(1),
    CustomNativeAdStateReceived(2),
    CustomNativeAdStateDisplaying(3),
    CustomNativeAdStateImpression(4),
    CustomNativeAdStateClicked(5),
    CustomNativeAdStateOutdated(6);

    private final int value;

    CustomNativeAdState(int value) {
      this.value = value;
    }

    public int getValue() {
      return value;
    }
}
