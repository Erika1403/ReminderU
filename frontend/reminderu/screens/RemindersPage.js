import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DropdownComponent from '../components/DropdownComponent'
import ReminderCon from '../components/ReminderCon'
import { useFonts } from 'expo-font';
import moment from 'moment';

export default function RemindersPage() {
  const [fontLoaded] = useFonts({
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'RumRaisin': require('../fonts/RumRaisin-Regular.ttf'),
});
  const date = moment().format('MMMM Do, YYYY');
  const dayOfWeek = moment().format('dddd');
  const sampleData = [
    {id: 0, Title: "Sample1", Status: "Pending", Desc: "sample sample", Date: "May 00, 0000", STime: "00:00 PM"},
    {id: 1, Title: "Sample1", Status: "Completed", Desc: "sample sample", Date: "May 00, 0000", STime: "00:00 PM"},
    {id: 2, Title: "Sample1", Status: "Completed", Desc: "sample sample", Date: "May 00, 0000", STime: "00:00 PM"},
    {id: 3, Title: "Sample1", Status: "Pending", Desc: "sample sample", Date: "May 00, 0000", STime: "00:00 PM"},
    {id: 4, Title: "Sample1", Status: "Completed", Desc: "sample sample", Date: "May 00, 0000", STime: "00:00 PM"},
    {id: 5, Title: "Sample1", Status: "Pending", Desc: "sample sample", Date: "May 00, 0000", STime: "00:00 PM"},
    {id: 6, Title: "Sample1", Status: "Pending", Desc: "sample sample", Date: "May 00, 0000", STime: "00:00 PM"},
  ]
  const [mysched, setSchedDate] = useState(sampleData);
  const renderItem = ({item}) => (
    <ReminderCon Title={item.Title} Status={item.Status} Desc={item.Desc} Date={item.Date} STime={item.STime}/>
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
})