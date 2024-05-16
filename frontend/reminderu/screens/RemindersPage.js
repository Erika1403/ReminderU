import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DropdownComponent from '../components/DropdownComponent'
import { useFonts } from 'expo-font';
import { Entypo } from '@expo/vector-icons';
import { useUserContext } from '../UserContext';


export default function RemindersPage({navigation}) {
  const [fontLoaded] = useFonts({
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'RumRaisin': require('../fonts/RumRaisin-Regular.ttf'),
    'Poppins': require('../fonts/Poppins-Regular.ttf'),
});
  const moment = require('moment-timezone');
  
  const date = moment().format('MMMM Do, YYYY');
  const dayOfWeek = moment().format('dddd');
  const schedData = useUserContext().schedData;
  const [mysched, setSchedDate] = useState(null);
  const philippinesTimeZone = 'Asia/Manila';
  
  const handleItemPressed = (item) => {
    navigation.navigate('edit', item);
  }


  useEffect(() => {
    const temp = formatData();
    setSchedDate(temp);
  }, [schedData]);

  const formatData = () => {
    let temp = [];
    let origDate = new Date();
    const utcMoment = moment(origDate);
    const date_t = utcMoment.tz(philippinesTimeZone);
    const dateToday = new Date(date_t);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
  let i = 0;
  schedData.forEach(element => {
    let thedate = element.Date + " " + element.Start_Time;
    let currdate_o = moment.tz(thedate, philippinesTimeZone);
    const currdate = currdate_o.utc();
    const formattedDate = new Date(currdate).toLocaleDateString('en-US', options);
    if(dateToday > currdate){
      let thedata = {id: i, Title: element.Event, Status: "Completed", Desc: "", Date: formattedDate, STime: convertToAMPM(element.Start_Time), ETime: convertToAMPM(element.End_Time), Location: element.Location};
      temp.push(thedata);
    }
    else if (dateToday <= currdate){
      let thedata = {id: i, Title: element.Event, Status: "Upcoming", Desc: "", Date: formattedDate, STime: convertToAMPM(element.Start_Time), ETime: convertToAMPM(element.End_Time), Location: element.Location};
      temp.push(thedata);
    }
    i++;
  });
    return temp;
};
  function convertToAMPM(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    let hours12 = parseInt(hours, 10);
    const suffix = hours12 >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    hours12 = hours12 % 12 || 12;

    // Add leading zeros to minutes if necessary
    const paddedMinutes = minutes.padStart(2, '0');

    return `${hours12}:${paddedMinutes} ${suffix}`;
}

 
  const renderItem = ({item}) => (
    <View style={{
      height: "auto",
      padding: 10,
      marginTop: 10,
      backgroundColor:item.Status=="Upcoming"? '#B4D2FF':'#EDBBFA',
      borderRadius: 10,}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style={{marginBottom: 5}}>
        <Text style={styles.remTitle2}>{item.Title}</Text>
        <Text style={styles.remDesc}>{item.Desc}</Text>
      </View>
      <TouchableOpacity onPress={() => handleItemPressed(item)}>
          <Entypo name="edit" color={'#3D405B'} size={25}/>
      </TouchableOpacity>
      </View>
      <View style={styles.footerCon}>
          <Text style={styles.Time}>{item.STime}</Text>
          <Text style={styles.Date}>{item.Date}</Text>
          <Text style={styles.Category}>{item.Status}</Text>
      </View>
      </View>
  );
  if(!fontLoaded){
    return undefined;
  }
  else {
    return (
      <SafeAreaView style={{flex: 1}}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.dateText} > | </Text>
        <Text style={styles.dateText}>{dayOfWeek}</Text>
      </View>
  
      <View style={{marginLeft: 20,marginRight: 20, flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.remTitle}>MY REMINDERS</Text>
        <View ><DropdownComponent/></View>
      </View>
  
      <FlatList style={{ maxHeight: 600, padding: 20, paddingBottom: 0}} 
      data={mysched}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{
        paddingTop: 10,
        paddingBottom: 10,
      }}
      />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  dateContainer:{
    marginLeft:20,
    marginRight:20,
    marginTop: -10,
    height: 40,
    borderRadius:20,
    backgroundColor: '#B7B8FF',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center'
  },
  dateText:{
    fontSize: 20,
    fontFamily: 'RumRaisin',
    color:'#3D405B'
  },
  remTitle: {
    fontFamily: 'Poppins_SemiBold',
    fontSize: 19, 
    color: '#3D405B', 
    marginRight: 40, 
    marginBottom: -21,
    marginTop: -14,
  },
  seacrhRemCon:{
    marginLeft:20,
    marginRight:20,
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
  remTitle2:{
    fontSize: 15,
    fontFamily: 'Poppins_ExtraBold',
    color: '#3D405B',
},
remDesc: {
    fontSize: 13,
    fontFamily: 'Poppins_SemiBold',
    color: '#fff'
},
footerCon:{
    marginTop:5,
    borderTopWidth:2,
    borderTopColor: 'gray',
    flexDirection: 'row',

},
Time: {
    fontSize: 18,
    fontFamily: 'Poppins_SemiBold',
    color: '#3D405B',
    marginTop: 3,
    marginRight: 10,
},
Date: {
    fontFamily: 'Poppins_SemiBold',
    color: '#908D8D',
    marginTop: 5,
    marginRight: 60,
},
Category:{
    fontFamily: 'Poppins_SemiBold',
    color: '#908D8D',
    marginTop: 5,
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