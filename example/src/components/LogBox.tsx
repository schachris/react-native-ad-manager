import React from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
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

export function LogBox({ logs: log }: { logs: any[] }) {
  const scrollRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [scrollRef, log]);
  return (
    <View style={styles.logBox}>
      <ScrollView ref={scrollRef} style={{ height: 260 }} scrollEnabled>
        {log.map((logInfo, i) => {
          return (
            <Text selectable selectionColor={'#45342155'} key={i} style={styles.text}>
              {typeof logInfo === 'string' ? logInfo : JSON.stringify(logInfo)}
              {logInfo === '\n' ? '' : '\n'}
            </Text>
          );
        })}
      </ScrollView>
      <Text style={styles.logBoxTitle}>logs:</Text>
    </View>
  );
}
