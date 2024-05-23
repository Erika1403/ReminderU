import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font';
import { Entypo } from '@expo/vector-icons';
import { useUserContext } from '../UserContext';
import { formatData } from '../functions/UpdateFunctions';
import REMINDERU_URL from '../API_ENDPOINTS';
import { cleanScheduleData } from '../functions/UpdateFunctions';
import { showAlert } from './NewReminderScreen';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: 'ALL', value: '1' },
  { label: 'COMPLETED', value: '2' },
  { label: 'UPCOMING', value: '3' },
  ];

export default function RemindersPage({navigation}) {
  const [fontLoaded] = useFonts({
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'RumRaisin': require('../fonts/RumRaisin-Regular.ttf'),
    'Poppins': require('../fonts/Poppins-Regular.ttf'),
});
  const moment = require('moment-timezone');
  const userData = useUserContext().userData;
  const {setSchedData, setSchedToday} = useUserContext();
  const date = moment().format('MMMM Do, YYYY');
  const dayOfWeek = moment().format('dddd');
  const schedData = useUserContext().schedData;
  const [mysched, setSchedDate] = useState(null);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(null);
  
  const handleItemPressed = (item) => {
    navigation.navigate('edit', item.id);
  }
  const handleItemPressedDel = (item) => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this schedule??",
      [
        {
          text: 'Yes',
          onPress: () => deleteSchedule(item.id),
          style: 'default',
        },
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {
        cancelable: false,
        onDismiss: () =>
          console.log(
            'This alert was dismissed by tapping outside of the alert dialog.',
          ),
      },
    )
  }

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
          console.log("An error occured while fetching the data");
        }
        else {
          const result = cleanScheduleData(fetchedData);
          setSchedData(result.data);
          if(result.currData.length > 0){
            setSchedToday(result.currData);
          }
          console.log("Schedule successfully deleted!");
        }
      }
    }
    catch (error){
      console.log(error);
    }
  };

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
          showAlert("Schedule Deleted!", fetchedData["message"]);
          refreshScheduleData();
        }
        else if(fetchedData.hasOwnProperty('error')) {
          //Inform user
          showAlert("Error", fetchedData["error"]);
        }
      }
    }
    catch (error){
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    const temp = formatData(schedData);
    setSchedDate(temp);
    console.log(mysched);
  }, [schedData]);

  
  const filterData = (val) => {
    console.log(val);
    if (val != null) {
      if(val == 3){
        const filtered = mysched.filter((item) => 
          item.Status === "Upcoming"
        );
        console.log(filtered);
        setFilteredData(filtered);
      }
      else if (val == 2) {
        const filtered = mysched.filter((item) => 
          item.Status === "Completed"
        );
        console.log(filtered);
        setFilteredData(filtered);
      } 
      else if (val == 1){
        console.log("loading all");
        setFilteredData(mysched);
      }
    }
  };

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
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: '20%'}}>
        { item.Status == "Upcoming" &&
          <TouchableOpacity onPress={() => handleItemPressed(item)} style={{marginRight: 20}}>
            <Entypo name="edit" color={'#3D405B'} size={25}/>
          </TouchableOpacity>
        }
        <TouchableOpacity onPress={() => handleItemPressedDel(item)}>
            <Entypo name="trash" color={'#3D405B'} size={25}/>
        </TouchableOpacity>
      </View>
      </View>
      <View style={styles.footerCon}>
          <Text style={styles.Time}>{item.STime}</Text>
          <Text style={styles.Date}>{item.Date}</Text>
          <Text style={styles.Category}>{item.Status}</Text>
      </View>
      </View>
  );

  const renderLabel = () => {
    if (value || isFocus) {
        return (
        <></>
        );
    }
    return null;
  };

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
        <View>
          <View style={styles.container}>
            {renderLabel()}
            <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select Reminder' : '...'}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
                setValue(item.value);
                setIsFocus(false);
                filterData(item.value);
            }}
            />
          </View>
        </View>
      </View>
  
      <FlatList style={{ flex: 1, padding: 20, paddingBottom: 0}} 
      data={filteredData || mysched}
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
},
container: {
  marginBottom: -21,
  marginTop: -14,
  padding: 16,
  width: 200,
},
dropdown: {
  height: 50,
  paddingHorizontal: 8,
},
icon: {
  marginRight: 5,
},
placeholderStyle: {
  fontSize: 15,
  fontFamily: 'Poppins_SemiBold',
  color: '#C999D6'
},
selectedTextStyle: {
  fontSize: 16,
  color: '#3D405B',
  fontFamily: 'Poppins_SemiBold',
  textAlign: 'right',
  marginRight: 5,
},
iconStyle: {
  width: 20,
  height: 20,
},
})