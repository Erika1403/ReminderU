import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from '../screens/HomePage'
import RemindersPage from '../screens/RemindersPage'
import StartChatNav from "./StartChatNav";
import SearchPage from '../screens/SearchPage'
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import ProfileAboutNav from "./ProfileAboutNav";
import { useRoute } from '@react-navigation/native';
import ReminderNav from "./ReminderNav";
import AddNav from "./AddNav";



const Tab = createBottomTabNavigator()

export default function TabNavigation() {
  const [fontLoaded] = useFonts({
    'Poppins_Black': require('../fonts/Poppins-Black.ttf'),
});
  if(!fontLoaded){
    return undefined;
  }
  else{
    
    return (

      <Tab.Navigator screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle:{
            position:'absolute',
            bottom: 20,
            left: 20,
            right:20,
            elevation: 1,
            borderRadius: 25,
            height: 60,
            backgroundColor:'#B7B8FF',
  
          }
        }}>
          <Tab.Screen name="HOME" component={HomePage} 
          options={{
            headerShown:false,
            tabBarIcon: ({focused}) => (
              <Entypo name="home" color={focused ? '#3D405B' : '#fff'} size={25}/>
            )
          }}/>
  
          <Tab.Screen name="SEARCH" component={SearchPage}  
          options={{
            headerTitleStyle:{ fontSize: 27, color: '#3D405B', fontFamily: 'Poppins_Black'},
            headerTitleAlign: 'center',
            tabBarIcon: ({focused}) => (
              <Ionicons name="search"  color={focused ? '#3D405B' : '#fff'} size={30}/>
            )
          }}
          />
         
          <Tab.Screen name="ADD" component={AddNav}  
          options={{
            headerShown:false,
            tabBarIcon: ({focused}) => (
              <Entypo name="circle-with-plus"  color={focused ? '#3D405B' : '#B7B8FF'} size={60} 
                style={{top:-20, backgroundColor:'#fff', borderRadius:100, alignItems:'center'}}/>
            ),
            tabBarStyle: {display: 'none'},
          }}/>
  
          <Tab.Screen name="REMINDERS" component={ReminderNav}  
          options={{
            tabBarIcon: ({focused}) => (
              <Entypo name="bell"  color={focused ? '#3D405B' : '#fff'} size={25}/>
            ),
            headerShown: false,
            tabBarStyle: {display: 'none'},
          }}/>
  
          <Tab.Screen name="PROFILE" component={ProfileAboutNav} 
          options={{
            headerShown: false,
            headerTitleStyle:{ fontSize: 27, color: '#C999D6', fontFamily: 'Poppins_Black'},
            headerTitleAlign: 'center',
            tabBarIcon: ({focused}) => (
              <Ionicons name="person"  color={focused ? '#3D405B' : '#fff'} size={25}/>
            )
          }}/>
        </Tab.Navigator>
    )
  }
}


