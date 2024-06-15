package com.admanagermobileads;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.ads.MediaContent;
import com.google.android.gms.ads.initialization.AdapterStatus;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.nativead.NativeCustomFormatAd;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class Utils {
  public static List<String> convertReadableArrayToStringArray(ReadableArray readableArray) {
    List<String> stringArray = new ArrayList<>();
    for (int i = 0; i < readableArray.size(); i++) {
      stringArray.add(readableArray.getString(i));
    }
    return stringArray;
  }

  public static WritableArray convertToWriteableArray(Collection<String> list) {
    WritableArray keys = Arguments.createArray();
    for (String str : list) {
      keys.pushString(str);
    }
    return keys;
  }

  public static WritableMap getAvailableAssets(NativeCustomFormatAd nativeCustomFormatAd) {
    WritableMap assets = Arguments.createMap();
    MediaContent mediaContent = nativeCustomFormatAd.getMediaContent();
    if (mediaContent != null && mediaContent.hasVideoContent()) {
      WritableMap videoMap = Arguments.createMap();
      videoMap.putDouble("duration", mediaContent.getDuration());
      videoMap.putDouble("duration", mediaContent.getAspectRatio());
      assets.putMap("video", videoMap);
    }

    for (String adAssetName : nativeCustomFormatAd.getAvailableAssetNames()) {
      if (nativeCustomFormatAd.getText(adAssetName) != null) {
        assets.putString(adAssetName, nativeCustomFormatAd.getText(adAssetName).toString());
      } else if (nativeCustomFormatAd.getImage(adAssetName) != null) {
        WritableMap imageMap = Arguments.createMap();
        imageMap.putString("uri", nativeCustomFormatAd.getImage(adAssetName).getUri().toString());
        imageMap.putInt("width", nativeCustomFormatAd.getImage(adAssetName).getDrawable().getIntrinsicWidth());
        imageMap.putInt("height", nativeCustomFormatAd.getImage(adAssetName).getDrawable().getIntrinsicHeight());
        imageMap.putDouble("scale", nativeCustomFormatAd.getImage(adAssetName).getScale());
        assets.putMap(adAssetName, imageMap);
      }
    }
    return assets;
  }

  public static WritableArray getAvailableAssetKeys(NativeCustomFormatAd nativeCustomFormatAd) {
    WritableArray assetKeys = Arguments.createArray();
    for (String str : nativeCustomFormatAd.getAvailableAssetNames()) {
      assetKeys.pushString(str);
    }
    return assetKeys;
  }

  public static String getOneAssetKey(NativeCustomFormatAd nativeCustomFormatAd) {
    String assetKey = "ad";
    for (String key : nativeCustomFormatAd.getAvailableAssetNames()) {
      String value = (String) nativeCustomFormatAd.getText(key);
      if (value != null && value.length() > 1) {
        assetKey = key;
      }
    }
    return assetKey;
  }

  public static WritableMap initializationStatusToMap(InitializationStatus initializationStatus) {
    WritableMap map = Arguments.createMap();
    Map<String, AdapterStatus> adapterStatusMap = initializationStatus.getAdapterStatusMap();
    for (Map.Entry<String, AdapterStatus> entry : adapterStatusMap.entrySet()) {
      WritableMap status = Arguments.createMap();
      status.putString("description", entry.getValue().getDescription());
      status.putString("state", entry.getValue().getInitializationState().toString());
      status.putInt("latency", entry.getValue().getLatency());
      map.putMap(entry.getKey(), status);
    }
    return map;
  }

}
