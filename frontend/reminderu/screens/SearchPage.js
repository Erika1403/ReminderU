import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';
import ReminderCon from '../components/ReminderCon';


export default function SearchPage() {

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
  return (
    <SafeAreaView style={styles.safeContainer}>
    <View style={styles.container}>
      <SearchBar />
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
})