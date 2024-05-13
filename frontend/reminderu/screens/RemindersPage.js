import { View, Text, StyleSheet, Modal, FlatList, TouchableHighlight, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DropdownComponent from '../components/DropdownComponent'
import { useFonts } from 'expo-font';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import moment from 'moment';
import { useUserContext } from '../UserContext'

export default function RemindersPage() {
  const [isModalVisible, setIsModalVisible] =useState(false);
  const [fontLoaded] = useFonts({
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'RumRaisin': require('../fonts/RumRaisin-Regular.ttf'),
});
  const date = moment().format('MMMM Do, YYYY');
  const dayOfWeek = moment().format('dddd');
  const schedData = useUserContext().schedData;
  const [mysched, setSchedDate] = useState(null);
  useEffect(() => {
    const temp = formatData();
    setSchedDate(temp);
  }, [schedData]);
  const formatData = () => {
    let temp = [];
    const dateToday = new Date();
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
  };
  let i = 0;
    schedData.forEach(element => {
      let currdate = new Date(element.Date);
      console.log(currdate)
      const formattedDate =currdate.toLocaleDateString('en-US', options);
      if(dateToday > currdate){
        let thedata = {id: i, Title: element.Event, Status: "Completed", Desc: "", Date: formattedDate, STime: convertToAMPM(element.Start_Time)};
        temp.push(thedata);
      }
      else if (dateToday <= currdate){
        let thedata = {id: i, Title: element.Event, Status: "Upcoming", Desc: "", Date: formattedDate, STime: convertToAMPM(element.Start_Time)};
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
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
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
  
      <FlatList style={{ maxHeight: 540, padding: 20}} 
      data={mysched}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{
        paddingTop: 10,
        paddingBottom: 10,
      }}
      />
      <Modal visible={isModalVisible} 
                onRequestClose={() => setIsModalVisible(false)}
                transparent={true}
                animationType='slide'
               >
        <View style={styles.modalContainer}>
          <View style={styles.CompRemModal}>
            <Text style={{fontSize:20, fontWeight:'bold', color:'#3D405B'}}>EDIT REMINDERS</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialIcons name="keyboard-arrow-down" size={25} color= '#3D405B'/>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
})