# react-native-admanager-mobile-ads

![Supports iOS and Android][support-badge]

Google Mobile Ads Custom Native Formats wrapper

## Installation

```sh
npm install react-native-admanager-mobile-ads
```

> On Android, before releasing your app, you must select _Yes, my app contains ads_ in the Google Play Store, Policy, App content, Manage under Ads.

## Optionally configure iOS static frameworks

On iOS if you need to use static frameworks (that is, `use_frameworks! :linkage => :static` in your `Podfile`) you must add the variable `$RNAdManagerMobileAdsAsStaticFramework = true` to the targets in your `Podfile`. You may need this if you use this module in combination with react-native-firebase v15 and higher since it requires `use_frameworks!`.

Expo users may enable static frameworks by using the `expo-build-properties` plugin.
To do so [follow the official `expo-build-properties` installation instructions](https://docs.expo.dev/versions/latest/sdk/build-properties/) and merge the following code into your `app.json` or `app.config.js` file:

#### app.json

```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ]
  }
}
```

#### app.config.js

```js
{
  expo: {
    plugins: [
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static"
          }
        }
      ]
    ];
  }
}
```

## Usage

This package is for extreme flexibility.
Its a wrapper around [Google Ad Manager - Mobile Ads SDK](https://developers.google.com/ad-manager/mobile-ads-sdk) for ios and android. It tries to pass the core functionality to JS

```js
import {AdManager, useCustomNativeAd, useVisibleCustomNativeAd} from 'react-native-admanager-mobile-ads';

const adLoader = new AdQueueLoader<CustomAdFormat, CustomTargeting>(adSpecification, {
      length: 1,
    });

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
  } = useCustomNativeAd(adLoader);


// ...
```

## Testing

### New Arch

#### iOS

```sh
yarn
cd example/ios
RCT_NEW_ARCH_ENABLED=1 bundle exec pod install
xcodebuild clean
cd ../..
# or one line
yarn && cd example/ios && RCT_NEW_ARCH_ENABLED=1 bundle exec pod install && cd ../..
yarn && cd example/ios && RCT_NEW_ARCH_ENABLED=0 bundle exec pod install && cd ../..

# and then
yarn example ios
```

#### Android

Navigate to example/android/gradle.properties and set _newArchEnabled=true_
then run

```sh
yarn clean
yarn
# and then
yarn example android
```

##### generate Artifacts

```sh
cd ./example/android
./gradlew generateCodegenArtifactsFromSchema
cd ../../
yarn example android

# or
cd ./example/android && ./gradlew generateCodegenArtifactsFromSchema && cd ../../ && yarn example android
```

## European User Consent

Under the Google EU User Consent Policy, you must make certain disclosures to your users in the European Economic Area (EEA) and obtain their consent to use cookies or other local storage, where legally required, and to use personal data (such as AdID) to serve ads. This policy reflects the requirements of the EU ePrivacy Directive and the General Data Protection Regulation (GDPR).

The React Native Admanager Mobile Ads module provides out of the box support for helping to manage your users consent within your application. The AdsConsent helper which comes with the module wraps the Google UMP SDK for both Android & iOS, and provides a single JavaScript interface for both platforms.

> This is mostly copied from https://docs.page/invertase/react-native-google-mobile-ads/european-user-consent. as invertase did a great work on it.

### Understanding AdMob Ads

Ads served by Google can be categorized as personalized or non-personalized, both requiring consent from users in the EEA. By default,
ad requests to Google serve personalized ads, with ad selection based on the user's previously collected data. Users outside of the EEA do not require consent.

> The `AdsConsent` helper only provides you with the tools for requesting consent, it is up to the developer to ensure the consent status is reflected throughout the app.

### Handling consent

To setup and configure ads consent collection, first of all:

- Enable and configure GDPR and IDFA messaging in the [Privacy & messaging section of AdManager's Web Console](https://admanager.google.com/).

- For Android, add the following rule into
  `android/app/proguard-rules.pro`:
  ```
  -keep class com.google.android.gms.internal.consent_sdk.** { *; }
  ```
- For Expo users, add extraProguardRules property to `app.json` file following this guide [Expo](https://docs.expo.dev/versions/latest/sdk/build-properties/#pluginconfigtypeandroid):

```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "extraProguardRules": "-keep class com.google.android.gms.internal.consent_sdk.** { *; }"
          }
        }
      ]
    ]
  }
}
```

You'll need to generate a new development build before using it.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

[support-badge]: https://img.shields.io/badge/platforms-android%20%7C%20ios-lightgrey.svg?style=flat-square
