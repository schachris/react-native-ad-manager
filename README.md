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

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

[support-badge]: https://img.shields.io/badge/platforms-android%20%7C%20ios-lightgrey.svg?style=flat-square
