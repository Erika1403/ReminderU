import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Ionicons, Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';


export default function AddReminderPage() {
  const navigation = useNavigation();
  const handleNew = () => {
    navigation.navigate('new');
  };
  const handleChat = () => {
    navigation.navigate('chatbelle');
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={{fontSize:20, fontWeight:'bold', color:'#3D405B'}}>CREATE NEW REMINDER</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
              
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
    width: 140,
    height: 90,
    backgroundColor: '#B4D2FF',
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  belleButton:{
    width: 140,
    height: 90,
    backgroundColor: '#EDBBFA',
    borderRadius: 10,
    margin: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText:{
    fontWeight: 'bold',
    fontSize: 20,
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

});
