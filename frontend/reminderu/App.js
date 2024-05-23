import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInNav from './navigation/LogInNav';
import StartChatNav from './navigation/StartChatNav';
import TabNavigation from './navigation/tabNavigation';
import { UserContext } from './screens/Login';
import { AlarmContextProvider } from './AlarmContext';

const Stack = createNativeStackNavigator();

export default function App( navigation) {
  return (
    <AlarmContextProvider>
    <NavigationContainer>
        <LogInNav/>
    </NavigationContainer>
    </AlarmContextProvider>
  )
}