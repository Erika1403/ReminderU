import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons,  Entypo } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useUserContext } from '../UserContext';

export default function ProfilePage({ navigation }) {
  const userData = useUserContext().userData;
  const name = userData.user_name;
  const email = userData.email;
  const bday = userData.bday;
  const [fontLoaded] = useFonts({
    'Poppins_ExtraBold': require('../fonts/Poppins-ExtraBold.ttf'),
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'Poppins_Regular': require('../fonts/Poppins-Regular.ttf'),
    'RumRaisin': require('../fonts/RumRaisin-Regular.ttf'),
    'Poppins_Bold': require('../fonts/Poppins-Bold.ttf'),
});
  if(!fontLoaded){
    return undefined;
  }
  else{
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.picContainer}>
            <Image source={require('../assets/profile_pic.png')} style={styles.profilePic}/>
          </View>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.emailText}>{email}</Text>
      </View>
  
      <View style={styles.birthdayContainer}>
        <View style={{alignItems: 'flex-start'}}>
              <Image source={require('../assets/cake.png')} 
                style={styles.cakePic}/>
            </View>
          <View style={{alignItems: 'flex-start', marginLeft: 160,}}>
          <Text style={styles.bdayTitle}>BIRTHDAY</Text>
          <Text style={styles.bdayDate}>{bday}</Text>
          </View>
      </View>
  
      <View style={styles.btnCon}>
        <TouchableOpacity style={styles.profileButton}>
        <Ionicons name="information-circle-outline" size={24} color="#D9D9D9" />
          <Text style={styles.profileBtext} onPress={() => navigation.navigate('about_us')}>About Us</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.profileButton}>
        <Entypo name="log-out" size={23} color="#D9D9D9" />
          <Text style={styles.profileBtext} onPress={() => navigation.navigate('LogIn')}>Log Out</Text>
          </TouchableOpacity>
      </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeContainer:{
    flex:1,
  },
  profilePic:{
    width: 120,
    height:120,
    borderRadius: 100,
  },
  picContainer:{
    backgroundColor: '#fff',
    width: 140,
    height:140,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent:'center',
    borderWidth:2,
    borderColor: '#3D405B',
  },
  nameText:{
    fontSize: 22,
    fontFamily: 'Poppins_ExtraBold',
    color: '#3D405B',
    marginTop: 10,
  },
  emailText:{
    fontSize:15,
    fontStyle: 'italic',
    fontFamily: 'Poppins_SemiBold',
    color: 'gray'
  },
  birthdayContainer:{
    margin: 30,
    marginTop: 60,
    padding:10,
    height:100,
    borderRadius: 20,
    backgroundColor: '#FFF690',
    flexDirection: 'column',
  },
  cakePic:{
    width: 190,
    height: 220,
    top: -80,
    left: -22,
  },
  bdayTitle:{
    fontSize: 16,
    fontFamily: 'Poppins_ExtraBold',
    color: '#545454',
    alignItems: 'flex-end',
    top:-200,
    marginBottom:3,
  },
  bdayDate:{
    fontSize: 19,
    fontFamily: 'Poppins_SemiBold',
    color: '#545454',
    alignItems: 'flex-end',
    top:-205,
  },
  remTitle:{
    fontSize: 17,
    fontWeight: 'bold',
    color: '#3D405B',
    paddingLeft: 20,
    top: -10,
  },
  profileButton:{
    width: 130,
    height:45,
    padding: 10,
    margin:10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  profileBtext:{
    fontFamily: 'Poppins_ExtraBold',
    top: 2,
    marginLeft: 4,
    color: '#545454'
  },
  btnCon:{
    marginLeft: 30, 
    marginRigh: 20,
    marginTop: 70,
    alignItems: 'flex-start',
    flexDirection:'row'
  },
})