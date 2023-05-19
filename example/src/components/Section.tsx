import React from 'react';

import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
    paddingTop: 8,
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
    marginHorizontal: 8,
  },
});

export function Section({ children }: { children: React.ReactNode }) {
  return <View style={styles.section}>{children}</View>;
}
