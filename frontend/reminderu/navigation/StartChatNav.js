import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import StartChatScreen from '../screens/StartChatScreen';
import ChatScreen from '../screens/ChatScreen';
import ConvoScreen from '../screens/ConvoScreen';
import { useFonts } from 'expo-font';
import CustomBackButton from '../components/CustomBackBtn';


const Stack=createNativeStackNavigator();

export default function StartChatNav() {
  const [fontLoaded] = useFonts({
    'Poppins_Black': require('../fonts/Poppins-Black.ttf'),
});
  if(fontLoaded){
    return (
      <Stack.Navigator screenOptions={{headerTitleAlign: 'center', 
      headerTitleStyle: {fontFamily: 'Poppins_Black', color: '#C999D6'}, 
      headerLeft: () => <CustomBackButton />}} initialRouteName='belle'>
          <Stack.Screen name='belle' component={StartChatScreen} options={{title: ''}}/>
          <Stack.Screen name='chat' component={ChatScreen} options={{title: 'BELLE'}}/>
          <Stack.Screen name='convo' component={ConvoScreen} options={{title: 'BELLE'}}/>
      </Stack.Navigator>
    )
  }
  else{
    return undefined
  }
}