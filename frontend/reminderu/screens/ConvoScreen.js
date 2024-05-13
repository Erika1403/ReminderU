import { View, Image, SafeAreaView, FlatList, StyleSheet, TextInput, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedbackComponent } from 'react-native'
import React, {useEffect, useState} from 'react'
import MessageBubble from '../components/MessageBubble';
import sentimg from '../assets/Sent.png';
import micImg from '../assets/Microphone.png';
import { useRoute } from '@react-navigation/native';
import {PermissionsAndroid, Platform} from 'react-native';
import Voice from '@react-native-voice/voice';




export default function ConvoScreen() {
  const param = useRoute().params;
  //{ id: DateNow, messages: "Hello Belle!", user: true }, sample format
  //SAMPLE ONLY
  /**{ id: 1, messages: "Hello Belle!", user: true },
    { id: 2, messages: "Good to see you!, What can I assist you with?", user: false },  */
  const BELLE_URL = 'http://10.0.2.2:5000/belle/';
  const [showRecordButton, setShowRecordButton] = useState(false);
  const [count, setCount] = useState(1);
  const initialMessage = param;
  const [message, setMessages] = useState([{id: param.id, messages: param.messages, user: param.user}]);
  const [currentMessage, setCurrentMessage] = useState('') 
  const [isDisabled, setIsDisabled] = useState(false);
  const [activeMic, setMicActive] = useState(false);
  const requestMicPermission = async () => {
    if (Platform.OS === 'android'){
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'ReminderU Permission',
            message:
              'ReminderU needs access to your microphone ' +
              'to record your audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setShowRecordButton(true);
          console.log('You can use the microphone');
        } else {
          setShowRecordButton(false);
          console.log('Microphone permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }  
  };

  useEffect(() => {
    requestMicPermission();
  }, []);



  const startRecognition = async () => {
    try {
      await Voice.start('en-US');
      setMicActive(true);
      setCurrentMessage('');
      console.log("Microphone Started...");
    } catch (e) {
      console.log("Error occured while starting recognition: ", e);
    }
  };

  const stopRecognition = async () => {
    try {
      await Voice.stop();
      setMicActive(false);
      console.log("Microphone Ended...");
      console.log(currentMessage);
    } catch (e) {
      console.log("Error occured while stopping recognition: ", e);
    }
  };

  Voice.onSpeechResults = (result) => {
    setCurrentMessage(result.value[0]);
    stopRecognition();
  };

  const handleAddMessage = () => {
    if (currentMessage.trim() !== ''){
      setCount(count+1);
      let data = { messages: currentMessage, user: true, id: count };
      setMessages([...message, data]);
      setCurrentMessage('');
      setIsDisabled(true);
    }
  };
  useEffect(() => {
    if (isDisabled) { // Only fetch when user is true
      fetchResponse(currentMessage);
    }
  }, [message]);
  useEffect(() => {
    if(initialMessage.user){
      setIsDisabled(true);
      fetchResponse(initialMessage.messages);
    }
  }, []);

  const fetchResponse = async (text) => {
    try {
      const data = {"message": text}
      const response = await fetch(BELLE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      else {
        const fetchedData = await response.json();
        if(fetchedData.hasOwnProperty('error')){
          console.log(fetchedData["error"]);
        }
        else {
          setCount(count+1);
          const belleMessage = {messages: fetchedData["response"], user: false, id: count};
          setIsDisabled(false);
          setMessages([...message, belleMessage]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  };

  const renderItem = ({item}) => (
    <MessageBubble message={item.messages} user={item.user} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={message}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 10,
        }}
      />
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
          { showRecordButton &&
          <TouchableOpacity disabled={isDisabled} onPress={activeMic? stopRecognition: startRecognition} style={{
          backgroundColor: activeMic? '#C999D6':'#D9D9D91F', width: 40, height: 40, borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
          }}>
            <Image source={micImg} style={{margin: 8}}/>
          </TouchableOpacity>
          }
        </View>
        <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" 
        style={styles.sent_btn} 
        onPress={() => handleAddMessage()} 
        disabled={isDisabled}>
            <Image source={sentimg} style={{margin: 9}}/>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    width: '100%',
    backgroundColor: '#fff'
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