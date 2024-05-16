import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import EditPage from '../screens/EditPage';
import RemindersPage from '../screens/RemindersPage';
import { useFonts } from 'expo-font';
import CustomBackButton from '../components/CustomBackBtn';


const Stack=createNativeStackNavigator();

export default function ReminderNav() {
  const [fontLoaded] = useFonts({
    'Poppins_Black': require('../fonts/Poppins-Black.ttf'),
});
  if(fontLoaded){
    return (
      <Stack.Navigator screenOptions={{
      headerLeft: () => <CustomBackButton />}} initialRouteName='reminder'>
          <Stack.Screen name='reminder' component={RemindersPage} options={{title: 'REMINDERS',
            headerTitleStyle:{ fontSize: 27, color: '#B7B8FF', fontFamily: 'Poppins_Black'},
            headerTitleAlign: 'center'}}/>
          <Stack.Screen name='edit' component={EditPage} options={{title: 'EDIT', headerTitleAlign: 'center', 
            headerTitleStyle: {fontFamily: 'Poppins_Black', color: '#C999D6'}, }}/>
      </Stack.Navigator>
    )
  }
  else{
    return undefined
  }
}