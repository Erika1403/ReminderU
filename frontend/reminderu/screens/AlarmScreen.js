import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAlarmContext } from '../AlarmContext';
import { useNavigation } from '@react-navigation/native';



// Define yung details ng event
/*const event = {
  title: 'BELLE',
  description: 'Hello everyone! My name is BELLE. I am an AI that will assist you with your scheduling plans. Reminder: I am here to help you stay on track!',
  alarm_time: new Date('2024-05-22T23:35:00'), // Set niyo yung alarm time sa specific date and time
};*/


// Define yung main App component
export default function Alarm() {
  const {handleSnooze, handleStop} = useAlarmContext();
  const navigation = useNavigation();
 
  const onStop = () => {
    console.log('Setting timeout...');
    const timeout = setTimeout(() => {
      console.log('Timeout expired. Closing notification...');
      handleStop();
    }, 60000); // Change the timeout duration as needed
  
    console.log('Clearing timeout...');
    clearTimeout(timeout);
  }

  const handleStopClick = async() => {
    await handleStop();
    onStop();
    navigation.goBack();
  }

  const handleSnoozeClick = () => {
    handleSnooze();
    navigation.goBack();
  }

    return (
      <View style={{flex: 1}}>
      <TouchableOpacity style={styles.container}>
        <View>
        <Image source={require('../assets/snooze loading.gif')} style={{width: 300, height: 300}}/>
        </View>
        <View style={{alignItems: 'center'}}>
        <Text style={styles.alarmTitle}>ALARM</Text>
        <Text style={styles.alarmTime}>Time</Text>
        <TouchableOpacity onPress={() => handleSnoozeClick()}>
          <Text style={styles.snoozeText}>Tap To Snooze</Text>
        </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => handleStopClick()} style={styles.stopButton}>
            <Text style={styles.stopTitle}>STOP</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    alarmTitle:{
      top: -210,
      fontWeight: 'bold',
      fontSize: 50,
      color: '#C999D6'
    },
    alarmTime:{
      top: -210,
      fontWeight: 'bold',
      fontSize: 25,
      color: 'black'
    },
    snoozeText:{
      fontWeight: 'bold',
      fontSize: 18,
      color: '#3D405B',
      top: -190
    },
    stopButton:{
      width: 140,
      height: 40,
      marginTop: 70,
      borderRadius: 20,
      backgroundColor: '#C999D6',
      alignItems: 'center',
      justifyContent: 'center'
    },
    stopTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#3D405B'
  },
});
  
