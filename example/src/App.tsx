import * as React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AdScreen } from './screens/AdScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ManagerScreen } from './screens/ManagerScreen';

const HomeStack = createNativeStackNavigator();
const ManagerStack = createNativeStackNavigator();
const AdStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function MainStack() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

function ManagerNavigationStack() {
  return (
    <ManagerStack.Navigator screenOptions={{ headerShown: false }}>
      <ManagerStack.Screen name="Manager" component={ManagerScreen} />
    </ManagerStack.Navigator>
  );
}

function AdsStack() {
  return (
    <AdStack.Navigator screenOptions={{ headerShown: false }}>
      <AdStack.Screen name="Ads" component={AdScreen} />
    </AdStack.Navigator>
  );
}

export default function RootApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="AdStack" component={AdsStack} />
        <Tab.Screen name="HomeStack" component={MainStack} />
        <Tab.Screen name="PlaygroundStack" component={ManagerNavigationStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
