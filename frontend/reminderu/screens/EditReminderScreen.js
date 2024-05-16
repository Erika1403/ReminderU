import { View, Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { AntDesign, Fontisto } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';

export default function EditReminder() {
  const moment = require('moment-timezone');
    const origData = useRoute().params;
    const today = new Date();
    const date = moment().format('MMMM Do, YYYY');
    const startdate = getFormatedDate(today.setDate(today.getDate()+1), 'YYYY/MM/DD');
    const [open, setOpen] = useState(false);
    const [date_date, setDate] = useState(origData.Date);
    const [showST, setShowST] = useState(false);
    const [showET, setShowET] = useState(false);
    const [stime, setSTime] = useState(origData.STime);
    const [etime, setETime] = useState(origData.ETime);
    const [location, setLocation] = useState(origData.Location);
    const [description, setDescription] = useState(origData.Desc);
    const [title, setTitle] = useState(origData.Title);

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
          
          <TouchableOpacity style={{width: "100%", height: 30, backgroundColor:"blue"}}>
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