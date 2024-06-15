package com.admanagermobileads;

import com.facebook.react.bridge.Promise;
import com.google.android.gms.ads.AdError;

import java.util.HashMap;
import java.util.Map;

public class CustomNativeAdError extends Exception {
  private String errorCode;
  private String title;
  private String message;
  private Throwable originalError;

  public CustomNativeAdError(Throwable error) {
    this(error, "UNKNOWN_ERROR");
  }

  public CustomNativeAdError(Throwable error, String code) {
    super(error.getMessage());
    this.originalError = error;
    this.title = error.getClass().getSimpleName();
    this.message = error.getMessage();
    this.errorCode = code != null ? code : "UNKNOWN_ERROR";
  }

  public CustomNativeAdError(String title, String message, String code) {
    super(message);
    this.title = title == null ? "RAMError" : title;
    this.message = message;
    this.errorCode = code;
    this.originalError = new Exception(message);
  }

  public String getTitle() {
    return this.title;
  }

  public String getMessage() {
    return this.message;
  }

  public String getErrorCode() {
    return this.errorCode;
  }

  public Map<String, Object> toMap() {
    Map<String, Object> errorMap = new HashMap<String, Object>();
    errorMap.put("title", this.title);
    errorMap.put("message", this.message);
    errorMap.put("code", this.errorCode);
    return errorMap;
  }

  public void insertIntoReactPromiseReject(Promise promise) {
    promise.reject(this.errorCode, this.getMessage(), this.originalError);
  }

  public static CustomNativeAdError fromError(Throwable error, String code) {
    return new CustomNativeAdError(error, code);
  }

  public static CustomNativeAdError withMessage(String message, String code) {
    return new CustomNativeAdError("CustomNativeAdError", message, code);
  }
  public static CustomNativeAdError fromAdError(AdError error, String code) {
    return CustomNativeAdError.withMessage(error.getMessage(), code == null ? "AdError" : code);
  }
}
