import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { useFonts } from 'expo-font';
import { useUserContext } from '../UserContext';


export default function HomePage() {
  const [isModalVisible, setIsModalVisible] =useState(false);
  const userData = useUserContext().userData;
  const schedToday = useUserContext().schedToday;
  const date = moment().format('MMMM Do, YYYY');
  const dayOfWeek = moment().format('dddd');
  const [fontLoaded] = useFonts({
    'Poppins_ExtraBold': require('../fonts/Poppins-ExtraBold.ttf'),
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'Poppins_Regular': require('../fonts/Poppins-Regular.ttf'),
    'RumRaisin': require('../fonts/RumRaisin-Regular.ttf'),
    'Poppins_Bold': require('../fonts/Poppins-Bold.ttf'),
});
  if (!fontLoaded){
    return undefined;
  }
  else {
    return (
      <SafeAreaView style={styles.safeContainer}>
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.Title}>Hello, {userData? userData.user_name:"User"}!</Text>
        <Text style={styles.subTitle}>Create Reminders Just For You.</Text>
      </View>
  
      <View style={styles.dateContainer} >
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.dateText}>{dayOfWeek}</Text>
      </View>
  
      <View style={styles.TodayRemCon1} >
          <View style={{alignItems: 'flex-end'}}>
            <Image source={require('../assets/todays_reminder.png')} 
              style={styles.todayRemPic}/>
          </View>
          <Text style={styles.todayRemTitle}>Today's</Text>
          <Text style={styles.todayRemTitle}>Reminder</Text>
        </View>
        <View style={styles.TodayRemCon2}>
          {schedToday.map((data, index) => (
          <View key={index}>
            <Text style={styles.todayRemsubTitle}>{data.timeStr}</Text>
            <Text style={styles.todayRemDesc}>{data.Title}</Text>
          </View>
        ))} 
        </View>
      
  
      <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <View style={{width: 60, height: 60, backgroundColor: '#EDBBFA', borderRadius:10, justifyContent: 'center', alignItems: 'center'}}>
          <FontAwesome5 name="check" size={26} color="#fff" />
  
          <Modal visible={isModalVisible} 
                onRequestClose={() => setIsModalVisible(false)}
                transparent={true}
                animationType='slide'
               >
            <View style={styles.modalContainer}>
            <View style={styles.CompRemModal}>
              <Text style={{fontSize:20, fontWeight:'bold', color:'#3D405B'}}>COMPLETED REMINDERS</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <MaterialIcons name="keyboard-arrow-down" size={25} color= '#3D405B'/>
              </TouchableOpacity>
            </View>
            </View>
          </Modal>
          </View>
          <Text style={styles.remTitle}>COMPLETED</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <View style={{width: 60, height: 60, backgroundColor: '#B4D2FF', borderRadius:10, justifyContent: 'center', alignItems: 'center'}}>
          <FontAwesome5 name="clock" size={26} color="#fff" />
          <Modal visible={isModalVisible} 
                onRequestClose={() => setIsModalVisible(false)}
                transparent={true}
                animationType='slide'
               >
            <View style={styles.modalContainer}>
            <View style={styles.CompRemModal}>
              <Text style={{fontSize:20, fontWeight:'bold', color:'#3D405B'}}>UPCOMING REMINDERS</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <MaterialIcons name="keyboard-arrow-down" size={25} color= '#3D405B'/>
              </TouchableOpacity>
            </View>
            </View>
          </Modal>
          </View>
          <Text style={styles.remTitle}>UPCOMING</Text>
        </TouchableOpacity>      
      </View>
  
      <View style={styles.belleCon}>
        <Image source={require('../assets/belle_blob.png')} style={styles.belleBlob}/>
        <Image source={require('../assets/belle.png')} style={styles.bellePic}/>
      </View>
  
      <View style={{alignItems: 'flex-end', marginRight: 20}}>
      <Text style={styles.belleTitle}>TRY ASKING <Text style={{color: '#C999D6'}}>BELLE</Text></Text>
      <Text style={styles.bellSubtitle}>She can assist you in creating remiders for you</Text>
      </View>
      </ScrollView>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  safeContainer:{
    flex:1,
  },
  container:{
    padding:30,
  },
  Title: {
    fontSize: 34,
    fontFamily: "Poppins_ExtraBold",
    color: '#3D405B',
  },
  subTitle:{
    fontSize: 13,
    fontFamily: "Poppins_SemiBold",
    color: '#545454',
  },
  dateContainer:{
    height: 80,
    width: '55%' ,
    backgroundColor:'#B7B8FF',
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingLeft: 30,
    justifyContent: 'center',
  },
  dateText:{
    color: '#3D405B',
    fontSize: 24,
    fontFamily: "RumRaisin",  
    marginTop:-5,  
  },
  TodayRemCon1:{
    margin: 20,
    marginTop: 30,
    padding:10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFF690',
    flexDirection: 'column',
    height: 100
  },
  TodayRemCon2:{
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#FFF690',
    margin: 20,
    marginTop: -30,
    padding:20,
    flex: 1, 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
  },
  todayRemTitle:{
    fontFamily: "Poppins_ExtraBold",
    fontSize: 28,
    color: '#C999D6',
    top: -285,
    right:-10,
    marginTop:-5,
  },
  todayRemPic:{
    top:-135,
    right:-70,
    width:290,
    height:290,
    alignContent: 'flex-end',    
  },
  todayRemsubTitle:{
    fontSize: 20,
    fontFamily: 'Poppins_Bold',
    color: '#112C41',
  },
  todayRemDesc:{
    fontSize:16,
    color: '#3D405B',
    fontFamily: 'Poppins_SemiBold'
  },
  remTitle:{
    fontSize: 13,
    color: '#3D405B',
    fontFamily: 'Poppins_SemiBold',
    left: -2,
    marginTop: 2,
    alignItems: 'center',
  },
  belleCon:{
  flexDirection: 'column',
  marginTop:15,
  },
  belleBlob:{
    width: 150,
    height: 140,
    marginTop: 15,
  },
  bellePic:{
    width:130,
    height: 140,
    top: -170,
  },
  belleTitle:{
    top: -250,
    fontSize: 24,
    color: '#3D405B',
    fontFamily: 'Poppins_ExtraBold',
    justifyContent: 'flex-start',
    width: 250,
  },
  bellSubtitle:{
    top: -250,
    fontSize: 16,
    color: '#908D8D',
    textAlign: 'right',
    width:300,
    fontFamily: 'Poppins_SemiBold'
  },

  modalContainer:{
    flex:1,
    justifyContent:'flex-end',
    alignItems: 'center',
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  CompRemModal:{
    height: '70%',
    width:'100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    padding:20,
  },
})