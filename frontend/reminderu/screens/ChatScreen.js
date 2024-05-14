import { View, Text,StyleSheet, Image, SafeAreaView, TouchableHighlight, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React from 'react'
import belle from '../assets/belle.png';
import { useFonts } from 'expo-font';
import { useState, useEffect } from 'react';
import sentimg from '../assets/Sent.png';
import { useNavigation } from '@react-navigation/native';

export default function ChatScreen() {
  const navigation = useNavigation();
  const [currentMessage, setCurrentMessage] = useState('') ;
  const [isDisabled, setIsDisabled] = useState(false);
  const [fontLoaded] = useFonts({
    'Poppins_ExtraBold': require('../fonts/Poppins-ExtraBold.ttf'),
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'Poppins_Regular': require('../fonts/Poppins-Regular.ttf'),
    'Poppins_Black':require('../fonts/Poppins-Black.ttf'),
});


  const handleAddMessage = () => {
    if (currentMessage.trim() !== ''){
      let data = { messages: currentMessage, user: true, id: 0 };
      navigation.navigate('convo', data)
    }
  };
  if(!fontLoaded){
    return undefined
  }
  else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
        <View style={styles.sub_containers}>
          <Image source={belle}/>
          <Text style={styles.belle_font}>Let's get started!</Text>
          <Text style={styles.subtitle}>You can use talk to me or have a chat with me, whatever is convenient to you</Text>
        </View>
        <View style={styles.btn_containers}>
          <TouchableHighlight activeOpacity={0.9} underlayColor="#DDDDDD" onPress={() => navigation.navigate("convo", {id:0, messages: "What Schedule do you want to add?", user: false, function: "Add"})} style={styles.choice_btn}>
            <Text style={styles.txt_btn}>Can you add a schedule for me?</Text>
          </TouchableHighlight>
          <TouchableHighlight activeOpacity={0.9} underlayColor="#DDDDDD" onPress={() => navigation.navigate("convo", {id:0,  messages: "What Schedule do you want to update?", user: false, function: "Update"})} style={styles.choice_btn}>
            <Text style={styles.txt_btn}>Can you update a schedule for me?</Text>
          </TouchableHighlight>
          <TouchableHighlight activeOpacity={0.9} underlayColor="#DDDDDD" onPress={() => navigation.navigate("convo", {id:0, messages: "What Schedule do you want to delete?", user: false, function: "Delete"})} style={styles.choice_btn}>
            <Text style={styles.txt_btn}>Can you delete a schedule for me?</Text>
          </TouchableHighlight>
          <TouchableHighlight activeOpacity={0.9} underlayColor="#DDDDDD" onPress={() => navigation.navigate("convo", {id:0, messages: "Which date would you like to check?", user: false, function: "Get"})} style={styles.choice_btn}>
            <Text style={styles.txt_btn}>Can you list my schedule?</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.convo_input_container}>
        <View style={styles.input_container}>
          <TextInput 
            defaultValue = {currentMessage}
            onChangeText={newTxt => setCurrentMessage(newTxt)}
            multiline
            editable
            placeholder='Ask me anything....'
            placeholderTextColor='#908D8D6E'
            disabled={isDisabled}
            style={styles.txt_input}
          />
        </View>
        <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" 
        style={styles.sent_btn} 
        onPress={() => handleAddMessage()} 
        disabled={isDisabled}>
            <Image source={sentimg} style={{margin: 9}}/>
        </TouchableHighlight>
      </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
  
}

const styles=StyleSheet.create({
  container:{
      flex: 1, 
      backgroundColor: '#fff',
      justifyContent: 'center'
  },
  sub_containers: {
      alignItems: 'center', 
  },
  btn_containers:{
      alignItems: 'center', 
      marginTop: 75, 
      marginBottom: 60
  },
  convo_input_container:{
    width: '100%',
    height: 40,
    flexDirection: 'row',
    marginTop: 60,
    marginBottom: 30,
  },
  input_container:{
    backgroundColor: '#D9D9D91F',
    borderColor: '#D9D9D9B2',
    borderWidth: 1,
    borderRadius: 10,
    width: 255,
    height: 40,
    flex: 1,
    flexDirection: 'row',
    marginLeft: 55, 
    marginRight: 5
  },
  belle_font: {
      fontSize: 13,
      fontFamily: 'Poppins_Black',
      color: '#112C41',
      marginLeft: 68,
      marginRight: 68,
  },
  subtitle: {
      fontSize: 11,
      fontFamily: 'Poppins_SemiBold',
      color: '#727272',
      marginLeft: 68,
      marginRight: 68,
      textAlign: 'center'
  },
  choice_btn:{
      backgroundColor: '#D9D9D999',
      padding: 10,
      borderRadius: 10,
      width: '80%',
      height: 47,
      marginBottom: 18
  },
  txt_btn:{
      textAlign: 'center',
      color: '#908D8D',
      fontFamily: 'Poppins_SemiBold',
      fontSize: 12,
      padding: 5,
  },
  txt_input:{
    padding: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: '#D9D9D91F',
    borderWidth: 0,
    width: "85%",
    height: 40,
    fontFamily: 'Poppins_SemiBold',
    fontSize: 12
  },
  sent_btn: {
    backgroundColor: '#F3EB85',
    height: 40, 
    width: 40,
    borderRadius: 20,
    alignContent: 'center',
    marginLeft: 15,
    marginRight: 55
  },
});