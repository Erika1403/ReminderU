import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useFonts } from 'expo-font';
import CustomBackButton from '../components/CustomBackBtn';
import NewReminder from '../screens/NewReminderScreen';
import StartChatNav from './StartChatNav';
import AddReminderPage from '../screens/AddReminderPage';


const Stack=createNativeStackNavigator();

export default function AddNav() {
  const [fontLoaded] = useFonts({
    'Poppins_Black': require('../fonts/Poppins-Black.ttf'),
});
  if(fontLoaded){
    return (
      <Stack.Navigator screenOptions={{
      headerLeft: () => <CustomBackButton />}} initialRouteName='reminder'>
          <Stack.Screen name='add' component={AddReminderPage} options={{title: 'ADD REMINDER',
            headerTitleStyle:{ fontSize: 27, color: '#B7B8FF', fontFamily: 'Poppins_Black'},
            headerTitleAlign: 'center'}}/>
          <Stack.Screen name='new' component={NewReminder} options={{title: 'NEW', headerTitleAlign: 'center', 
            headerTitleStyle: {fontFamily: 'Poppins_Black', color: '#C999D6'}, }}/>
          <Stack.Screen name='chatbelle' component={StartChatNav} options={{headerShown: false}}/>
      </Stack.Navigator>
    )
  }
  else{
    return undefined
  }
}