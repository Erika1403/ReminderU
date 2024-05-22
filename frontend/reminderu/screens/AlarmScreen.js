import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CustomNotification from '../components/popup';// Import the CustomNotification component
import * as Speech from 'expo-speech';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useRoute } from '@react-navigation/native';

//Sample Data
/*
const event = {
    title: 'BELLE',
    description: 'Hello everyone! My name is BELLE. I am an AI that will assist you with your scheduling plans. Reminder: I am here to help you stay on track!',
    alarm_time: new Date('2024-05-21T21:23:00'), // Set the alarm time to a specific date and time
};
*/
export default function AlarmScreen() {
    const param = useRoute().params;
    const [notificationReceived, setNotificationReceived] = useState(false);
    const [speakingInterval, setSpeakingInterval] = useState(null);
    const [snoozeInterval, setSnoozeInterval] = useState(null);

    // Transfer code to home page // start
    const event = {
        title: param.Event,
        description: param.Reminder,
        alarm_time: param.Reminder_Time
    };

    useEffect(() => {
        console.log('Configuring notifications...');
        configureNotifications();
    }, [event]);

    const configureNotifications = async () => {
        if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            Alert.alert('Failed to get push token for push notification!');
            return;
        }
        } else {
            Alert.alert('Must use physical device for Push Notifications');
        }

        Notifications.setNotificationHandler({
            handleNotification: async () => {
                console.log('Notification received');
                setNotificationReceived(true); // Set notification received state
                const timeinterval = setInterval(() => {
                    speakEvent();
                }, 3000);
                setSpeakingInterval(timeinterval)
                speakEvent(); // Call speakEvent function when a notification is received
                
                return {
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: false,
                };
            },
        });

        //scheduleAlarm(event);
        scheduleAlarm(event);
    };

  const scheduleAlarm = async (event) => {
    try {
      console.log('Scheduling alarm...');
      const trigger = new Date(event.alarm_time);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: event.title,
          body: event.description,
          sound: 'default',
        },
        trigger: {
          date: trigger,
        },
      });
    } 
    catch (error) {
      console.error('Error scheduling alarm:', error);
    }
  };

  const handleSnooze = async () => {
    try {
      console.log('Handling snooze...');
      Speech.stop();
      clearInterval(speakingInterval);
      setSpeakingInterval(null);
      clearInterval(snoozeInterval); // Clear existing snooze interval
      setSnoozeInterval(null); // Reset snooze interval state
      setNotificationReceived(false); // Reset notification received state
  
      
  
      // Schedule a new notification for 5 minutes from now
      const snoozeTrigger = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
      await Notifications.scheduleNotificationAsync({
        content: {
          title: event.title,
          body: event.description,
          sound: 'default',
        },
        trigger: {
          date: snoozeTrigger,
        },
      });

      // Set a new snooze interval
      const newSnoozeInterval = setInterval(() => {
        console.log('Snoozing alarm...');
        Speech.speak(event.description);
      }, 5 * 60 * 1000);
      setSnoozeInterval(newSnoozeInterval);
    } catch (error) {
      console.error('Error snoozing alarm:', error);
    }
  };
  // Transfer code to home page // end
  const handleStop = async () => {
    console.log('Handling stop...');
    Speech.stop();
    setNotificationReceived(false); // Reset notification received state
    //await Notifications.cancelAllScheduledNotificationsAsync();
    
    clearInterval(snoozeInterval);clearInterval(speakingInterval);
  };

  const speakEvent = () => {
    console.log('Speaking event...');
    Speech.speak(event.description, {
      onDone: () => {
        // If notification is received, speak again
        if (notificationReceived) {
          speakEvent(event);
        }
      },
    });
  };

    return (
      <TouchableOpacity style={styles.container}>
        <View>
        <Image source={require('./assets/snooze loading.gif')} style={{width: 300, height: 300}}/>
        </View>
        <View style={{alignItems: 'center'}}>
        <Text style={styles.alarmTitle}>ALARM</Text>
        <Text style={styles.alarmTime}>Time</Text>
        <TouchableOpacity onPress={handleSnooze}>
          <Text style={styles.snoozeText}>Tap To Snooze</Text>
        </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={handleStop} style={styles.stopButton}>
            <Text style={styles.stopTitle}>STOP</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
  
