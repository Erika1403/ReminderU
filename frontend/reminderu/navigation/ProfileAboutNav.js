import { View, Text } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfilePage from '../screens/ProfilePage';
import AboutUsPage from '../screens/AboutUsPage';
import CustomBackButton from '../components/CustomBackBtn';


const Stack = createNativeStackNavigator();

export default function ProfileAboutNav() {
    const [fontLoaded] = useFonts({
        'Poppins_Black': require('../fonts/Poppins-Black.ttf'),
    });
  if(!fontLoaded){
    return undefined;
  }
  else {
    return(
        <Stack.Navigator screenOptions={{headerTitleAlign: 'center', 
      headerTitleStyle: {fontFamily: 'Poppins_Black'}, 
      headerLeft: () => <CustomBackButton />}} initialRouteName='profile'>
          <Stack.Screen name='profile' component={ProfilePage} options={{title: 'PROFILE', headerTintColor: "#FFB0F7"}}/>
          <Stack.Screen name='about_us' component={AboutUsPage} options={{title: 'ABOUT US', headerTintColor: "#908D8D"}}/>
    </Stack.Navigator>
    )
  }
}