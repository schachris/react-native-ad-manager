# react-native-admanager-mobile-ads

![Supports iOS and Android][support-badge]

Google Mobile Ads Custom Native Formats wrapper

## Installation

```sh
npm install react-native-admanager-mobile-ads
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

Navigate to example/package.json and set _RCT_NEW_ARCH_ENABLED=1_ in pods script

then run

```sh
yarn clean
yarn
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
