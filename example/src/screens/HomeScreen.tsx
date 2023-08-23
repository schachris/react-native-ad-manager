import * as React from 'react';

import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
});

function ListItem({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginVertical: 4 }}>
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 6,
          minHeight: 44,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
        <Text>{'>'}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <ScrollView style={styles.container} contentContainerStyle={{}}>
        <ListItem title="Ad Screen" onPress={() => navigation.navigate('AdScreen')} />
        <ListItem title="Ads Screen" onPress={() => navigation.navigate('AdsScreen')} />
        <ListItem title="Manager Screen" onPress={() => navigation.navigate('ManagerScreen')} />
      </ScrollView>
    </View>
  );
}
