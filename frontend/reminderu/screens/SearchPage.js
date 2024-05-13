import { View, StyleSheet, FlatList, TextInput } from 'react-native';
import React, {useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ReminderCon from '../components/ReminderCon';
import { useUserContext } from '../UserContext';


export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(null);
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
};
const filterData = () => {
  if (!searchQuery) {
    setFilteredData(null);
    return;
  }

  const filtered = mysched.filter((item) => 
    item.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(filtered);
  setFilteredData(filtered);
};

  const renderItem = ({item}) => (
    <ReminderCon Title={item.Title} Status={item.Status} Desc={item.Desc} Date={item.Date} STime={item.STime}/>
  );
  return (
    <SafeAreaView style={styles.safeContainer}>
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <View style={styles.searchCon}>
          <Ionicons name="search"  color={'gray'} size={25} style={{marginLeft: 1, marginRight: 5}}/>
            <TextInput 
              placeholder="Search Your Reminders..."
              placeholderTextColor={"gray"}
              style={styles.input}  
              onChangeText={(text) => {
                setSearchQuery(text);
                filterData();
              }}
              value={searchQuery}          
            />
          </View>
        </View>
    </View>
    <FlatList style={{ maxHeight: 540, padding: 20}} 
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

const styles = StyleSheet.create({
  container:{
    padding:20,
    
  },
  safeContainer:{
    flex: 1,
  },
  seacrhRemCon:{
    marginLeft:20,
    marginRight:20,
  },
  subcontainer:{
    marginTop: -20, 
    width:'100%'     
},
searchCon:{
    padding:10,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius:10,
    alignItems: 'center',
},
input:{
    fontSize: 15,
    fontFamily: 'Poppins_SemiBold',
    color: '#333',
    width:'90%'
},
})