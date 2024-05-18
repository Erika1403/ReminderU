import { View, Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import { AntDesign, Fontisto } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useFonts } from 'expo-font';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import REMINDERU_URL from '../API_ENDPOINTS';
import { useUserContext } from '../UserContext';


const showAlert = (title, themessage) =>
  Alert.alert(
    title,
    themessage,
    [
      {
        text: 'Ok',
        onPress: () => console.log('Cancel Pressed'),
        style: 'default',
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        console.log(
          'This alert was dismissed by tapping outside of the alert dialog.',
        ),
    },
  );

export default function NewReminder() {
    const today = new Date();
    const userData = useUserContext().userData;
    const date = format(today, 'yyyy-MM-dd');
    const schedData = useUserContext().schedData;
    const [newsched, setNewSched] = useState([]);
    const startdate = getFormatedDate(today.setDate(today.getDate()+1), 'YYYY-MM-DD');
    const [open, setOpen] = useState(false);
    const [date_date, setDate] = useState('YYYY-MM-DD');
    const [showST, setShowST] = useState(false);
    const [showET, setShowET] = useState(false);
    const [stime, setSTime] = useState('00:00');
    const [etime, setETime] = useState('00:00');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');

    const [fontLoaded] = useFonts({
      'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
      'Poppins_Regular': require('../fonts/Poppins-Regular.ttf'),
      'RumRaisin': require('../fonts/RumRaisin-Regular.ttf'),
      'Poppins': require('../fonts/Poppins-Regular.ttf'),
    });

    const pickerPressed = () => {
      setOpen(!open);
    };
    const tpicker1Pressed = () => {
      setShowST(!showST);
    };
    const tpicker2Pressed = () => {
      setShowET(!showET);
    };

    const handleDateChange = (propDate) => {
      setDate(propDate);
      pickerPressed();
    };

    const onChangeSTime = (time) => {
      setSTime(time);
      setShowST(false);
    };
  
    const onChangeETime = (time) => {
      setETime(time);
      setShowET(false);
    };

    const clickedSave = () => {
      console.log("Add New Reminder...");
      const newData = {
        Event: title,
        Date:date_date.replace(/\//g, '-'),
        Start_Time: stime + ":00",
        End_Time: etime + ":00",
        Location: location,
        Description: description
      }
      console.log(newData);
      checkAvailability(newData);
    }
    const addSchedule = async (data) => {
      try{
        let url = REMINDERU_URL.SCHEDFUNC_URL + userData.user_id+ "/0";
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
          if(fetchedData.hasOwnProperty('message')){
            //Alert result then go back 
            showAlert("Success", fetchedData["message"]);
          }
          else if(fetchedData.hasOwnProperty('error')) {
            showAlert("error", fetchedData["error"]);
          }
        }
      }
      catch (error){
        console.log(error);
        return false;
      }
    }
    const checkAvailability = async (idata) => {
      try{
        let url = REMINDERU_URL.SCHEDINFO_URL + userData.user_id  + "/availability" ;
        let data = {"schedule_records" : schedData, "new_schedule": idata};
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
            addSchedule(idata);
            setNewSched([]);
          }
          else if(fetchedData.hasOwnProperty('First Suggestion')) {
            // print message about suggestion in modal;
            const message = "Recommended Schedule: " + fetchedData["First Suggestion"] + " " + fetchedData["Second Suggestion"];
            showAlert("Conflicting Schedule", message);
          }
        }
      }
      catch (error){
        console.log(error);
        return false;
      }
    };

  if(!fontLoaded){
    return undefined;
  }
  else {
    return (
      <ScrollView>
      <SafeAreaView style={{flex: 1}}> 
        <View style={{ justifyContent: 'center',flex: 1, padding: 30}}>
          <Text style={styles.textTitle}>REMINDER TITLE</Text>
          <TextInput onChangeText={txt => setTitle(txt)} value={title} style={styles.textInput}/> 
  
          <Text style={styles.textTitle}>DESCRIPTION</Text>
          <TextInput onChangeText={txt => setDescription(txt)} value={description} style={styles.descInput} multiline/> 
  
          <Text style={styles.textTitle}>DATE OF REMINDER</Text>
          <View style={{flexDirection: 'row'}}>
          <TextInput value={date_date} style={styles.dateInput} editable={false}/> 
          <TouchableOpacity style={styles.remButton} onPress={pickerPressed}>
               <AntDesign name="calendar" size={17} color="white"/>
          </TouchableOpacity>
          <Modal
                  animationType='slide'
                  transparent={true}
                  visible={open}>
                  <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                          <DatePicker
                              mode='calendar'
                              minimumDate={startdate}
                              selected={date}
                              onDateChange={handleDateChange}
                              style={{ borderRadius: 10 }}
                              options={{
                                  backgroundColor: 'white',
                                  textHeaderColor: '#FFA25B',
                                  textDefaultColor: 'black',
                                  selectedTextColor: '#fff',
                                  mainColor: '#F4722B',
                                  textSecondaryColor: 'orange',
                                  borderColor: '#FFA25B',
                              }}
                          />
                      </View>
                  </View>
              </Modal>
          </View>
  
          <Text style={styles.textTitle}>START TIME</Text>
          <View style={{flexDirection: 'row'}}>
          <TextInput value={stime} style={styles.dateInput}/> 
          <TouchableOpacity onPress={tpicker1Pressed} style={styles.remButton}>
               <Fontisto name="clock" size={16} color="white"/>
          </TouchableOpacity>
          <Modal
            animationType='slide'
            transparent={true}
            visible={showST}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <DatePicker
                    mode="time"
                    minuteInterval={1}
                    selected={stime}
                    onTimeChange={selectedTime => onChangeSTime(selectedTime)}
                  />
                </View>
              </View>
          </Modal>  
          </View>
  
          <Text style={styles.textTitle}>END TIME</Text>
          <View style={{flexDirection: 'row'}}>
          <TextInput value={etime} style={styles.dateInput}/> 
          <TouchableOpacity onPress={tpicker2Pressed} style={styles.remButton}>
               <Fontisto name="clock" size={16} color="white"/>
          </TouchableOpacity>
          <Modal
            animationType='slide'
            transparent={true}
            visible={showET}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <DatePicker
                    mode="time"
                    minuteInterval={1}
                    selected={etime}
                    onTimeChange={selectedTime => onChangeETime(selectedTime)}
                  />
                </View>
              </View>
          </Modal> 
          </View>
  
          <Text style={styles.textTitle}>LOCATION</Text>
          <TextInput value={location} onChangeText={txt => setLocation(txt)} style={styles.textInput}/> 
          
          <TouchableOpacity onPress={() => clickedSave()} style={{width: "100%", height: 30, backgroundColor:"blue"}}>
              <Text style={{color: 'white'}}>Save</Text>
          </TouchableOpacity>
  
          <View style={{alignItems: 'center', justifyContent:'center'}}>
          <Image source={require('../assets/footerName.png')} style={styles.footerImage}/>
        </View>
  
        </View>
      </SafeAreaView>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    textInput:{
        height: 40,
        backgroundColor: '#fff',
        borderColor: '#D9D9D9',
        borderWidth: 2,
        padding: 10,
        fontFamily: 'Poppins_Regular',
        borderRadius: 10,
        marginBottom: 30,
    },
    textTitle: {
        fontFamily: 'Poppins_SemiBold',
        color: '#3D405B'
    },
    descInput:{
        height: 90,
        backgroundColor: '#fff',
        borderColor: '#D9D9D9',
        borderWidth: 2,
        padding: 10,
        borderRadius: 10,
        marginBottom: 30,
        fontFamily: 'Poppins_Regular',
    },
    dateInput:{
        height: 40,
        width: '80%',
        backgroundColor: '#fff',
        borderColor: '#D9D9D9',
        borderWidth: 2,
        padding: 10,
        fontFamily: 'Poppins_Regular',
        borderRadius: 10,
        marginBottom: 30,
    },
    remButton:{
        height: 40,
        width: 50,
        backgroundColor: '#DCBDFF',
        borderColor: '#D9D9D9',
        borderWidth: 2,
        fontFamily: 'Poppins_SemiBold',
        padding: 10,
        borderRadius: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerImage: {
        width: 250,
        height: 40,
        marginTop: 20,
    },
    centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    },
    modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    borderColor: 'purple',
    width: '90%',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2
      },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    },
})