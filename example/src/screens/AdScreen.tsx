import * as React from 'react';

import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

// import { AdQueueLoader, GADNativeAdImageProps } from 'react-native-ad-manager';
import { LogBox } from '../components/LogBox';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  fakeAd: {
    borderWidth: 2,
    borderColor: 'orange',
    minHeight: 50,
    minWidth: 200,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 20,
  },
});

// const adUnitId = '/22248153318/test_native_ad';
// const formatIds = ['12008639'];

// type CustomAdFormat = {
//   title: string;
//   subtitle: string;

//   callToActionTitle?: string;
//   callToActionSubtitle?: string;
//   contentImage?: GADNativeAdImageProps;
//   titleIcon?: GADNativeAdImageProps;
// };

// const adSpecification = {
//   adUnitId,
//   formatIds,
// };

// const queueLoader = new AdQueueLoader<CustomAdFormat, { t: 'd' | 'l' }>(adSpecification, {
//   length: 1,
// });

// queueLoader.setOptions({
//   targeting: {
//     t: 'd',
//   },
// });
export function AdScreen() {
  const [counter, _setCounter] = React.useState(0);
  const [log] = React.useState<any[]>([]);
  // const addLog = (...addedLogs: any[]) => setLog((logs) => [...logs, '\n', ...addedLogs]);
  const [delay, setDelay] = React.useState(true);
  React.useEffect(() => {
    setInterval(() => {
      setDelay(false);
    }, 100);
  }, []);
  if (delay) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <LogBox logs={log} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          backgroundColor: 'yellow',
        }}
      >
        <Text>{counter}</Text>
        <Button
          onPress={() => {
            // setCounter((c) => c + 1);
            // if (counter < 1) {
            //   queueLoader.setOptions({
            //     targeting: {
            //       t: 'd',
            //     },
            //   });
            //   setCounter(1);
            // } else {
            //   queueLoader.setOptions({
            //     targeting: {
            //       t: 'l',
            //     },
            //   });
            //   setCounter(0);
            // }
          }}
          title="Counter"
        />
        <View style={{ height: 300 }} />
        <View style={styles.section}>
          {/* <NativeAd<CustomAdFormat> {...adSpecification} testId="Ad_1" loader={queueLoader}>
            {({ ad, state, click }) => {
              const { title, subtitle, titleIcon, contentImage, callToActionSubtitle, callToActionTitle } =
                ad?.assets || {};
              if (state < AdState.Received) {
                return <ActivityIndicator />;
              }
              return (
                <TouchableOpacity
                  onPress={() => {
                    console.log('Record a click');
                    click();
                  }}
                >
                  <View style={[styles.fakeAd, {}]}>
                    <Text>{title}</Text>
                    {titleIcon ? (
                      <Image
                        source={{ uri: titleIcon.uri }}
                        style={{
                          width: 40,
                          height: 40,
                        }}
                      />
                    ) : undefined}
                    {contentImage ? (
                      <Image source={{ uri: contentImage.uri }} style={{ width: '100%', aspectRatio: 3.2 }} />
                    ) : undefined}
                    <Text>{subtitle}</Text>

                    <View style={{ gap: 4 }}>
                      {callToActionTitle ? <Text>{callToActionTitle}</Text> : undefined}
                      {callToActionSubtitle ? <Text>{callToActionSubtitle}</Text> : undefined}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          </NativeAd> */}

          {/* <NativeAd {...adSpecification} testId="Ad_2" loader={queueLoader}>
            {({ ad }) => {
              return (
                <View style={[styles.fakeAd, {}]}>
                  <Text>Hey there I'm another ad with same "source"</Text>
                  <Text>{ad?.assets.title}</Text>
                  <Text>{ad?.assets.subtitle}</Text>
                </View>
              );
            }}
          </NativeAd> */}
        </View>
        <View style={{ height: 800 }} />
      </ScrollView>
    </View>
  );
}
