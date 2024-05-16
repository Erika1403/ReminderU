import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Modal } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useRoute } from '@react-navigation/native';
import { useUserContext } from '../UserContext';
import { AntDesign } from '@expo/vector-icons';

import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';

export default function EditPage() {
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

  return (
    <ScrollView style={{width: "100%", flex: 1, padding: 20}}>
        <View style={{flex: 1, width: "100%"}}>
            <Text style={styles.sub_title}>Title</Text>
            <TextInput style={styles.sub_input} value={title}/>
            <Text style={styles.sub_title}>Description</Text>
            <TextInput style={styles.sub_input} value={description} onChange={text => setLocation(text)}/>
            <Text style={styles.sub_title}>Date</Text>
            <View style={{ flexDirection: 'row', marginLeft :30, marginRight: 50, justifyContent: 'space-between'}}>
                <TextInput style={styles.input_DOB} editable={false}
                    selectTextOnFocus={false}  
                    value={date_date} 
                    onChangeText={setDate} 
                    placeholder='YYYY/MM/DD' 
                    placeholderTextColor={'#D9D9D9'}/>
            <View>
            <TouchableOpacity style={styles.Calendar_style} onPress={pickerPressed}>
                <AntDesign name="calendar" size={22} color="gray" />
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
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: 20}}>
                <View style={{width: "47%", marginRight: 10}}>
                    <Text style={styles.sub_title}>Start Time</Text>
                    <TouchableOpacity onPress={tpicker1Pressed} style={styles.time_picker}>
                    <Text style={{textAlign: 'center', padding: 5}}>{stime}</Text>
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
                            onTimeChange={selectedTime => onChangeSTime(selectedTime)}
                          />
                          </View>
                        </View>
                    </Modal>  
                    </View>
                    <View style={{width: "45%"}}>
                      <Text style={styles.sub_title}>End Time</Text>
                      <TouchableOpacity onPress={tpicker2Pressed} style={styles.time_picker}>
                        <Text style={{textAlign: 'center', padding: 5}}>{etime}</Text>
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
                            onTimeChange={selectedTime => onChangeETime(selectedTime)}
                          />
                          </View>
                        </View>
                      </Modal>
                    </View>
                  </View>
                  <Text style={styles.sub_title}>Location</Text>
                  <TextInput style={styles.sub_input} value={location} onChange={text => setLocation(text)}/>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',  marginTop: 20}}>
                    <TouchableOpacity style={{backgroundColor: 'gray', borderRadius: 10, width: "45%", height: 30, marginRight: "10%"}}>
                      <Text>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: 'purple', borderRadius: 10, width: "45%", height: 30}}>
                      <Text>Save</Text>
                    </TouchableOpacity>
                  </View>
         </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
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
  sub_title: {
    fontSize: 18, 
    fontFamily: 'Poppins_SemiBold',
    color: '#3D405B',
  },
  sub_input: {
    fontSize: 16, 
    fontFamily: 'Poppins', 
    color: 'black', 
    borderColor: 'black', 
    borderWidth: 1, 
    padding: 4
  },
  input_DOB: {
    height: 40, 
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#D9D9D9CC',
    backgroundColor: '#ffffff',
    fontFamily: 'Poppins_SemiBold',
    marginBottom: 30,
  },
  time_picker: {
    width: '100%', 
    backgroundColor: 'pink',
    height: 30,
    
  }
  })