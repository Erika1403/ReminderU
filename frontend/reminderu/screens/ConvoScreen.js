import { View, Image, SafeAreaView, FlatList, StyleSheet, TextInput, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedbackComponent } from 'react-native'
import React, {useContext, useEffect, useState} from 'react'
import MessageBubble from '../components/MessageBubble';
import sentimg from '../assets/Sent.png';
import micImg from '../assets/Microphone.png';
import { useRoute } from '@react-navigation/native';
import {PermissionsAndroid, Platform} from 'react-native';
import Voice from '@react-native-voice/voice';
import { useUserContext } from '../UserContext';
import REMINDERU_URL from '../API_ENDPOINTS';
import { cleanScheduleData } from '../functions/UpdateFunctions';




export default function ConvoScreen() {
  const param = useRoute().params;
  const userData = useUserContext().userData;
  const schedData = useUserContext().schedData;
  const {setSchedData, setSchedToday} = useUserContext();
  const [hasStartTime, setHasStartTime] = useState(false);
  const [showRecordButton, setShowRecordButton] = useState(false);
  const [count, setCount] = useState(1);
  const initialMessage = param;
  const [toUpdate, setToUpdate] = useState(false);
  const [intent, setIntent] = useState("");
  const [initSched, setInitSched] = useState([]);
  const [delSched, setDelSched] = useState([]);
  const [message, setMessages] = useState([{id: param.id, messages: param.messages, user: param.user}]);
  const [currentMessage, setCurrentMessage] = useState('') 
  const [isDisabled, setIsDisabled] = useState(false);
  const [activeMic, setMicActive] = useState(false);
  const [newsched, setNewSched] = useState([]);
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
      setIsDisabled(true);
    }
  };

  //Function for getting responses from API automatically
  useEffect(() => {
    if (isDisabled && currentMessage.trim() !== '') { // Only fetch when user is true
      fetchResponse(currentMessage);
      setCurrentMessage('');
      console.log(currentMessage);
    }
  }, [message]);

  // Function for getting responses if user does not clicked any of the buttons in chat screen
  useEffect(() => {
    if(initialMessage.user){
      setIsDisabled(true);
      fetchResponse(initialMessage.messages);
    }
    else {
      setIntent(initialMessage.function);
    }
  }, []);

  //Function that should contain functions that will add data to database via API (Add, Update)
  useEffect(() => {
    if((newsched.length === 5) && intent === "Add"){
      //Function to add schedule
      console.log("Adding Schedule...");
      checkAvailability();
    }
  }, [newsched]);


  //Function that should contain functions that will delete data from database via API
  useEffect(() => {
    if(delSched.length === 2) {
      //Function to delete schedule
      // Get the ID of schedule using the event and date then delete
      console.log("Deleting Schedule...");
      getID(delSched, "Delete");
    }
  }, [delSched]);

  const deleteSchedule = async (id) => {
    try{
      let url = REMINDERU_URL.SCHEDFUNC_URL + userData.user_id  + "/"+id ;
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      else {
        const fetchedData = await response.json();
        if(fetchedData.hasOwnProperty('message')){
          // Inform user
          setCount(count+1);
          const belleMessage = {messages: fetchedData["message"], user: false, id: count};
          setMessages([...message, belleMessage]);
          refreshScheduleData();
        }
        else if(fetchedData.hasOwnProperty('error')) {
          //Inform user
          setCount(count+1);
          const belleMessage = {messages: fetchedData["error"], user: false, id: count};
          setMessages([...message, belleMessage])
        }
        setIsDisabled(false);
        setIntent("");
        setDelSched([]);
      }
    }
    catch (error){
      console.log(error);
      return false;
    }
  }

  const updateSchedule = async (id) => {
    try{
      let url = REMINDERU_URL.SCHEDFUNC_URL + userData.user_id  + "/"+id ;
      const data = formatSched(newsched);
      const response = await fetch(url, {
        method: 'PUT',
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
        if(fetchedData.hasOwnProperty('message')){
          // Inform user
          setCount(count+1);
          const belleMessage = {messages: fetchedData["message"], user: false, id: count};
          setMessages([...message, belleMessage]);
          refreshScheduleData();
          //console.log(schedData);
        }
        else if(fetchedData.hasOwnProperty('error')) {
          //Inform user
          setCount(count+1);
          const belleMessage = {messages: fetchedData["error"], user: false, id: count};
          setMessages([...message, belleMessage]);
        }
        setIsDisabled(false);
        setIntent("");
        setInitSched([]);
        setNewSched([]);
      }
    }
    catch (error){
      console.log(error);
      return false;
    }
  };

  const getID = async (sched_data, goal) => {
    //Get the id of the schedule to update
    try{
      let url = REMINDERU_URL.SCHEDINFO_URL + userData.user_id  + "/get_id" ;
      const data = formatSched(sched_data);
      const response = await fetch(url, {
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
        if(goal == "Update"){
          if(fetchedData.hasOwnProperty('sched_id')){
            updateSchedule(fetchedData["sched_id"]);
          }
          else if(fetchedData.hasOwnProperty('error')) {
            setCount(count+1);
            const belleMessage = {messages: "No event with this title on that day was found!", user: false, id: count};
            setMessages([...message, belleMessage]);
          }
        }
        else if(goal == "Delete"){
          if(fetchedData.hasOwnProperty('sched_id')){
            deleteSchedule(fetchedData['sched_id']);
          }
          else if(fetchedData.hasOwnProperty('error')) {
            setCount(count+1);
            const belleMessage = {messages: "No event with this title on that day was found!", user: false, id: count};
            setMessages([...message, belleMessage]);
          }
        }
      }
    }
    catch (error){
      console.log(error);
      setCount(count+1);
      const belleMessage = {messages: "No event with this title on that day was found!", user: false, id: count};
      setMessages([...message, belleMessage]);
      setIsDisabled(false);
      setDelSched([]);
      setInitSched([]);
      setNewSched([]);
      return false;
    }
  };
  const refreshScheduleData = async () => {
    try{
      let url = REMINDERU_URL.SCHEDFUNC_URL + userData.user_id + "/1" ;
      const response = await fetch(url, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      else {
        const fetchedData = await response.json();
        if(fetchedData.hasOwnProperty('error')){
          console.log("error while refreshing schedule");
        }
        else {
          const result = cleanScheduleData(fetchedData);
          setSchedData(result.data);
          if(result.currData.length > 0){
            setSchedToday(result.currData);
          }
          navigation.navigate('add');
        }
      }
    }
    catch (error){
      console.log(error);
    }
  };
  const formatSched = (data) => {
    let nData= {};
    data.forEach(element => {
      Object.assign(nData, element);
    });
    return nData;
  };
  const addSchedule = async () => {
    try{
      let url = REMINDERU_URL.SCHEDFUNC_URL + userData.user_id+ "/0";
      const iData = formatSched(newsched);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(iData)
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      else {
        const fetchedData = await response.json();
        if(fetchedData.hasOwnProperty('message')){
          setCount(count+1);
          const belleMessage = {messages: fetchedData["message"], user: false, id: count};
          setMessages([...message, belleMessage]);
          refreshScheduleData();
        }
        else if(fetchedData.hasOwnProperty('error')) {
          alert(fetchedData["error"]);
        }
      }
    }
    catch (error){
      console.log(error);
      return false;
    }
  }

  const checkAvailability = async () => {
    try{
      let url = REMINDERU_URL.SCHEDINFO_URL + userData.user_id  + "/availability" ;
      const iData = formatSched(newsched);
      let data = {"schedule_records" : schedData, "new_schedule": iData};
      console.log(data);
      const response = await fetch(url, {
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
        if(fetchedData.hasOwnProperty('available')){
          addSchedule();
          setNewSched([]);
        }
        else if(fetchedData.hasOwnProperty('First Suggestion')) {
          // print message about suggestion;
          setCount(count+1);
          const belleMessage = {messages: "The event cannot be added to your schedule because of conflicts! I recommend that you move your schedule at "+ fetchedData["First Suggestion"] + " or at "+ fetchedData["Second Suggestion"] + ".", user: false, id: count};
          setMessages([...message, belleMessage]);
        }
      }
    }
    catch (error){
      console.log(error);
      return false;
    }
  };

  //Function to fetch response/message from API
  const fetchResponse = async (text) => {
    try {
      let data;
      console.log(hasStartTime);
      if(intent === ""){
        data = {"message": text}
      }
      else if(hasStartTime){
        data = {"message": text, "function":intent, "time_type": 1};
      }
      else{
        data = {"message": text, "function":intent};
      }
      const response = await fetch(REMINDERU_URL.BELLE_URL, {
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
          const belleMessage = {messages: fetchedData["message"], user: false, id: count};
          if(fetchedData.hasOwnProperty("function")){
            //If the intent in NONE and the goal is to update, do a function
            if(fetchedData["function"] === "None" && intent === "Update"){
              getID(initSched, "Update");
              console.log("Should update");
            }
            //Update the function or goal of user
            else {
              setIntent(fetchedData["function"]);
              setIsDisabled(false);
            }
          }
          //Collect the data from user
          else if(fetchedData.hasOwnProperty("Date")){
            let newS = {"Date" : fetchedData["Date"]};
            updateSchedData(newS);
            setIsDisabled(false);
          }
          else if(fetchedData.hasOwnProperty("Start Time")){
            let newS = {"Start Time" : fetchedData["Start Time"] + ":00"};
            updateSchedData(newS);
            setHasStartTime(true);
            setIsDisabled(false);
          }
          else if(fetchedData.hasOwnProperty("Event")){
            let newS = {"Event" : fetchedData["Event"]};
            updateSchedData(newS);
            setIsDisabled(false);
          }
          else if(fetchedData.hasOwnProperty("End Time")){
            let newS = {"End Time" : fetchedData["End Time"] + ":00"};
            updateSchedData(newS);
            setIsDisabled(false);
          }
          else if(fetchedData.hasOwnProperty("Location")){
            let newS = {"Location" : fetchedData["Location"]};
            updateSchedData(newS);
            setIntent("");
            setIsDisabled(false);
          }
          else {
            setIsDisabled(false);
          }
          setMessages([...message, belleMessage]);
          console.log("NewSched");
          console.log(newsched);
          console.log("InitSched");
          console.log(initSched);
          console.log("DelSched");
          console.log(delSched);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  };
  //Function to filter what data to collect
  const updateSchedData = (newS) => {
    if(intent === "Update" && initSched.length < 2){
      //Get the date and title of the event to change
      setInitSched([...initSched, newS])
    }
    else if(intent === "Update" && initSched.length > 2){
      // Get the info to change
      setNewSched([...newsched, newS])
    }
    else if(intent === "Delete"){
      //get the data about the sched to delete
      setDelSched([...delSched, newS])
    }
    else {
      //get the data about the new sched to add
      setNewSched([...newsched, newS])
    }
  }

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
    marginTop: 20,
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