import * as React from 'react';

import { ActivityIndicator, Alert, Button, SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AdManager } from 'react-native-ad-manager';

import { LogBox } from '../components/LogBox';
import { Section } from '../components/Section';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  textField: {
    padding: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 15,
    margin: 8,
    borderRadius: 8,
  },
  keyboardPlaceholder: { height: 400 },
  logBox: {
    paddingHorizontal: 6,
    marginHorizontal: 4,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: 'gray',
    minHeight: 60,
  },
  logBoxTitle: {
    marginHorizontal: 12,
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 3,
    color: '#919191',
  },
  text: {
    color: 'black',
  },
});

AdManager.setTestDeviceIds(['4e18bd2fffe833d3ecc0c614e168aa10']);

export function ManagerScreen() {
  const [isLoadingAds, setIsLoading] = React.useState<{ [loaderId: string]: boolean | string }>({});
  const [log, setLog] = React.useState<any[]>([]);
  const addLog = (...addedLogs: any[]) => setLog((logs) => [...logs, '\n', ...addedLogs]);

  const [loaderId, setLoaderId] = React.useState<string>('');
  const [assetKey, setAssetKey] = React.useState<string>('');

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <LogBox logs={log} />
      <ScrollView style={styles.container}>
        <Section>
          <Button
            title="start"
            onPress={async () => {
              AdManager.start();
              addLog(`started`);
            }}
          />
        </Section>
        <Section>
          <Button
            title="start with callback"
            onPress={async () => {
              AdManager.startWithCallback((result) => {
                addLog(`Started with callback`, result);
              });
            }}
          />
        </Section>
        <Section>
          <Button
            title="getAvailableAdLoaderIds"
            onPress={async () => {
              try {
                const ids = await AdManager.getAvailableAdLoaderIds();
                addLog(`Ids:`, ids);
              } catch (e) {
                addLog(`Error:`, (e as Error).message);
              }
            }}
          />
        </Section>
        <Section>
          <TextInput
            onChangeText={setLoaderId}
            value={loaderId}
            placeholder={'adLoaderId'}
            clearButtonMode="while-editing"
            style={styles.textField}
          />
          <Button
            title="getAdLoaderDetails"
            onPress={async () => {
              try {
                const details = await AdManager.getAdLoaderDetails(loaderId);
                addLog(`Details:`, details);
              } catch (e) {
                addLog(`Error:`, (e as Error).message);
              }
            }}
          />
        </Section>

        <Section>
          <Button
            title="createAdLoader"
            onPress={async () => {
              try {
                const adUnitId = '/22248153318/test_native_ad';
                // const formatIds = ['1111111'];
                const formatIds = ['12008639'];
                const details = await AdManager.createAdLoader({
                  adUnitId,
                  formatIds,
                });

                setLoaderId((lId) => (lId === '' ? details.id : lId));
                addLog(`AdLoader:`, details);
              } catch (e) {
                addLog(`Error:`, (e as Error).message);
              }
            }}
          />
        </Section>

        <Section>
          <ActivityIndicator animating={isLoadingAds[loaderId] === 'request'} color="blue" />
          <Button
            title="loadRequest"
            onPress={async () => {
              try {
                setIsLoading((loadings) => ({ ...loadings, [loaderId]: 'request' }));
                const details = await AdManager.loadRequest(loaderId, {});
                addLog(`loadRequest:`, details);
              } catch (e) {
                addLog(`Error:`, (e as Error).message);
              }
              setIsLoading((loadings) => ({ ...loadings, [loaderId]: false }));
            }}
          />
          <Button
            title="loadRequest with targeting"
            onPress={async () => {
              try {
                setIsLoading((loadings) => ({ ...loadings, [loaderId]: 'request' }));
                const details = await AdManager.loadRequest(loaderId, {
                  targeting: {
                    test: 'hi',
                  },
                });
                addLog(`loadRequest with targeting:`, details);
              } catch (e) {
                addLog(`Error:`, (e as Error).message);
              }
              setIsLoading((loadings) => ({ ...loadings, [loaderId]: false }));
            }}
          />
        </Section>
        <Section>
          <ActivityIndicator animating={isLoadingAds[loaderId] === 'impression'} color="blue" />
          <Button
            title="recordImpression"
            onPress={async () => {
              try {
                setIsLoading((loadings) => ({ ...loadings, [loaderId]: 'impression' }));
                const result = await AdManager.recordImpression(loaderId);
                addLog(`recordImpression:`, result);
              } catch (e) {
                addLog(`Error:`, (e as Error).message);
              }
              setIsLoading((loadings) => ({ ...loadings, [loaderId]: false }));
            }}
          />
        </Section>
        <Section>
          <ActivityIndicator animating={isLoadingAds[loaderId] === 'displaying'} color="blue" />
          <Button
            title="setIsDisplayingForLoader"
            onPress={async () => {
              try {
                setIsLoading((loadings) => ({ ...loadings, [loaderId]: 'displaying' }));
                const result = await AdManager.setIsDisplayingForLoader(loaderId);
                addLog(`setIsDisplayingForLoader:`, result);
              } catch (e) {
                addLog(`Error:`, (e as Error).message);
              }
              setIsLoading((loadings) => ({ ...loadings, [loaderId]: false }));
            }}
          />
        </Section>
        <Section>
          <ActivityIndicator animating={isLoadingAds[loaderId] === 'outdated'} color="blue" />
          <Button
            title="makeLoaderOutdated"
            onPress={async () => {
              try {
                setIsLoading((loadings) => ({ ...loadings, [loaderId]: 'outdated' }));
                const outdated = await AdManager.makeLoaderOutdated(loaderId);
                addLog(`makeLoaderOutdated:`, outdated);
              } catch (e) {
                addLog(`Error:`, (e as Error).message);
              }
              setIsLoading((loadings) => ({ ...loadings, [loaderId]: false }));
            }}
          />
        </Section>
        <Section>
          <ActivityIndicator animating={isLoadingAds[loaderId] === 'click'} color="blue" />
          <Button
            title="recordClick"
            onPress={async () => {
              try {
                setIsLoading((loadings) => ({ ...loadings, [loaderId]: 'click' }));
                const status = await AdManager.recordClick(loaderId);
                addLog(`recordClick:`, `recorded ${JSON.stringify(status)}`);
              } catch (e) {
                addLog(`Error:`, (e as Error).message);
              }
              setIsLoading((loadings) => ({ ...loadings, [loaderId]: false }));
            }}
          />
        </Section>
        <Section>
          <ActivityIndicator animating={isLoadingAds[loaderId] === 'click'} color="blue" />
          <TextInput
            onChangeText={setAssetKey}
            value={assetKey}
            placeholder={'assetKey'}
            clearButtonMode="while-editing"
            style={styles.textField}
          />
          <Button
            title="recordClickOnAssetKey"
            onPress={async () => {
              try {
                setIsLoading((loadings) => ({ ...loadings, [loaderId]: 'click' }));
                const status = await AdManager.recordClickOnAssetKey(loaderId, assetKey);
                addLog(`recordClickOnAssetKey:`, `recorded ${JSON.stringify(status)}`);
              } catch (e) {
                addLog(`Error:`, (e as Error).message);
              }
              setIsLoading((loadings) => ({ ...loadings, [loaderId]: false }));
            }}
          />
        </Section>
        <Section>
          <ActivityIndicator animating={isLoadingAds[loaderId] === 'clickCustom'} color="blue" />
          <TextInput
            onChangeText={setAssetKey}
            value={assetKey}
            placeholder={'assetKey'}
            clearButtonMode="while-editing"
            style={styles.textField}
          />
        </Section>

        <Section>
          <TextInput
            onChangeText={setLoaderId}
            value={loaderId}
            placeholder={'loaderId'}
            clearButtonMode="while-editing"
            style={styles.textField}
          />
          <Button
            title="set"
            onPress={async () => {
              try {
                await AdManager.setCustomClickHandlerForLoader(loaderId, (result, error) => {
                  Alert.alert('Töröooo', 'Custom click handler for specific loader called!');
                  addLog(`recordClickOnAssetKeyWithHandler:`, {
                    result,
                    error: error,
                  });
                });
                addLog(`setCustomClickHandlerForLoader: true`);
              } catch (e) {
                addLog(`Error:`, (e as Error).message);
              }
            }}
          />
          <Button
            title="remove"
            onPress={async () => {
              try {
                AdManager.removeCustomClickHandlerForLoader(loaderId);
                addLog(`setCustomClickHandlerForLoader: false`);
              } catch (e) {
                addLog(`Error:`, (e as Error).message);
              }
            }}
          />
          <Button
            title="setCustomClickHandler (alert)"
            onPress={async () => {
              AdManager.setCustomClickHandler((result) => {
                Alert.alert('CustomClickHandler', JSON.stringify(result || {}));
              });
              addLog(`set custom click handler:`);
            }}
          />
          <Button
            title="remove customClickHandler (alert)"
            onPress={async () => {
              AdManager.removeCustomClickHandler();
              addLog(`removed custom click handler:`);
            }}
          />
        </Section>

        <Section>
          <TextInput
            onChangeText={setLoaderId}
            value={loaderId}
            placeholder={'loaderId'}
            clearButtonMode="while-editing"
            style={styles.textField}
          />
          <Button
            title="removeAdLoader"
            onPress={async () => {
              try {
                setIsLoading((loadings) => ({ ...loadings, [loaderId]: 'click' }));
                const onRemove = await AdManager.removeAdLoader(loaderId);
                addLog(`removeAdLoader:`, `removed ${onRemove}`);
              } catch (e) {
                addLog(`Error:`, (e as Error).message);
              }
              setIsLoading((loadings) => ({ ...loadings, [loaderId]: false }));
            }}
          />
        </Section>

        <Section>
          <Button
            title="clear logs"
            onPress={async () => {
              setLog([]);
            }}
          />

          <Button
            title="clear"
            onPress={async () => {
              AdManager.clearAll();
              setLog(['Cleared AdManager']);
              setLoaderId('');
            }}
          />
        </Section>
        <View style={styles.keyboardPlaceholder} />
      </ScrollView>
    </View>
  );
}
