import * as React from 'react';

import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { VisibilityAwareView } from 'react-native-visibility-aware-view';

import { LogBox } from '../components/LogBox';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export function HomeScreen() {
  const [log, setLog] = React.useState<any[]>([]);
  const addLog = (...addedLogs: any[]) => setLog((logs) => [...logs, '\n', ...addedLogs]);

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
        <VisibilityAwareView
          onBecomeInvisible={() => {
            addLog('invisible');
            Alert.alert('VisibilityView', 'Invisible');
          }}
          onBecomeVisible={() => {
            addLog('visible');
            Alert.alert('VisibilityView', 'Visible');
          }}
        >
          <View style={[{ backgroundColor: 'red', paddingHorizontal: 10, width: 200, height: 40 }]}></View>
        </VisibilityAwareView>
        <View style={{ height: 800 }} />
      </ScrollView>
    </View>
  );
}
