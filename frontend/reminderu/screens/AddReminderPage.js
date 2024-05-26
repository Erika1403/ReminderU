import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Ionicons, Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useAlarmContext } from '../AlarmContext';


export default function AddReminderPage() {
  const navigation = useNavigation();
  const notificationReceived = useAlarmContext().notificationReceived;
  const [fontLoaded] = useFonts({
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'RumRaisin': require('../fonts/RumRaisin-Regular.ttf'),
    'Poppins': require('../fonts/Poppins-Regular.ttf'),
    'Poppins_Black': require('../fonts/Poppins-Black.ttf'),
});

useEffect(() => {
  if(notificationReceived){
    navigation.navigate("Alarm");
  }
}, [notificationReceived]);

  const handleNew = () => {
    navigation.navigate('new');
  };
  const handleChat = () => {
    navigation.navigate('chatbelle');
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff', flex: 1, justifyContent: 'center'}}>
              <Image source={require('../assets/newReminder.gif')} style={{width: 200, height:200, top: -20}}/>
              <View style={{}}><Text style={styles.taglineText}>LET'S BE PRODUCTIVE</Text></View>
              <TouchableOpacity onPress={handleNew} style={styles.selfButton}>
                <View style={styles.thumbsUp}><Entypo name="thumbs-up" size={25} color="white" /></View>
                <Text style={styles.buttonText}>I Can Do It!</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleChat} style={styles.belleButton}>
              <View ><Image source={require('../assets/belle.png')} style={styles.belle}/></View>
              <Text style={styles.buttonText}>Belle Can Help Me!</Text>
              </TouchableOpacity>
            </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer:{
    flex:1,
    justifyContent:'flex-end',
    alignItems: 'center',
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  CompRemModal:{
    height: '40%',
    width:'100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    padding:20,
  },
  selfButton:{
    width: 240,
    height: 110,
    backgroundColor: '#B4D2FF',
    borderRadius: 10,
    margin: 40,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  belleButton:{
    width: 240,
    height: 110,
    backgroundColor: '#EDBBFA',
    borderRadius: 10,
    margin: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText:{
    fontWeight: 'bold',
    fontSize: 25,
    color: '#3D405B',
    top:-25,
    textAlign: 'center',
  },
  thumbsUp:{
    width: 50,
    height: 50,
    backgroundColor: '#3D405B',
    borderRadius: 100,
    top: -35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  belle:{
    width: 70,
    height: 70,
    top: -30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taglineText: {
    fontSize: 35,
    color: '#3D405B',
    fontFamily: 'Poppins_Black',
  },
});
