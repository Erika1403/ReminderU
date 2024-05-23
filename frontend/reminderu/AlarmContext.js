import React, { createContext, useState, useContext, Alert } from 'react'
import * as Speech from 'expo-speech';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const AlarmContext = createContext();
export const AlarmContextProvider = ({ children }) => {
    // State para i-track kung may notification na nareceive
    const [notificationReceived, setNotificationReceived] = useState(false);
    // State para i-track yung interval ng speaking
    const [speakingInterval, setSpeakingInterval] = useState(null);
    // State para i-track yung interval ng snoozing
    const [snoozeInterval, setSnoozeInterval] = useState(null);

    const configureNotifications = async (events) => {
        try{
        console.log("In configureNotifications");
        if (Device.isDevice) {
          // Request ng notification permissions
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
        // Set notification handler
        Notifications.setNotificationHandler({
          handleNotification: async () => {
            console.log('Notification received');
            setNotificationReceived(true); // Set yung notification received state
      
            // Set interval para ulit-ulitin magsalita ng event description every 3 seconds
            
            const timeinterval = setInterval(() => {
              speakEvent(events.description);
            }, 3000);
            setSpeakingInterval(timeinterval);
            
            // Tawagin yung speakEvent function pag may notification na nareceive
            speakEvent(events.description);
      
            return {
              shouldShowAlert: true,
              shouldPlaySound: true,
              shouldSetBadge: false,
            };
          },
        });
      
        // Schedule alarms para sa bawat event
        scheduleAlarm(events);
        
        }
        catch(error){
          console.log(error);
        }
      };
      
    const speakEvent = (description) => {
        console.log('Speaking event...');
        Speech.speak(description, {
          onDone: () => {
            // Kung may notification na nareceive, magsalita ulit
            if (notificationReceived) {
              speakEvent(description);
            }
          },
        });
      };
    
      // Function para i-schedule ang notification alarm
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
      } catch (error) {
        console.error('Error scheduling alarm:', error);
      }
    };
    
      // Function para i-handle ang notification click
    const handleNotificationClick = (trigger, event) => {
        // Perform specific actions when notification is clicked
        console.log('Handling notification click...');
        const notificationDate = trigger.date || new Date();
        const eventDate = new Date(event.alarm_time);
    
        // Check if the notification time is in the past and the current time is at least one minute after the alarm time
        if (notificationDate || notificationDate >= eventDate && (eventDate - notificationDate) < 60000) {
          setNotificationReceived(true);
          clearInterval(speakingInterval);
          const timeinterval = setInterval(() => {
            speakEvent(event.description);
          }, 3000);
          setSpeakingInterval(timeinterval);
          speakEvent(event.description);
        } 
        else {
          console.log('Alarm Expired');
          Alert.alert(event.description);
          Speech.stop();
        }
      };

      // Function para i-handle ang snooze action
  const handleSnooze = async () => {
    try {
      console.log('Handling snooze...');
      Speech.stop(); // Stop yung current speech
      clearInterval(speakingInterval); // Clear yung speaking interval
      setSpeakingInterval(null);
      clearInterval(snoozeInterval); // Clear yung existing snooze interval
      setSnoozeInterval(null);
      setNotificationReceived(false); // Reset yung notification received state

      // Schedule ng bagong notification 5 minutes from now
      const snoozeTrigger = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "ReminderU Notification",
          body: "You have a schedule today!",
          sound: 'ding',
        },
        trigger: {
          date: snoozeTrigger,
        },
      });

      // Set ng bagong snooze interval para magsalita ng event description every 5 minutes
      const newSnoozeInterval = setInterval(() => {
        console.log('Snoozing alarm...');
        Speech.speak("Snooze Alarm! Snooze Alarm!");
      }, 5 * 60 * 1000);
      setSnoozeInterval(newSnoozeInterval);
    } catch (error) {
      console.error('Error snoozing alarm:', error);
    }
  };

  // Function para i-handle ang stop action
  const handleStop = async () => {
    console.log('Handling stop...');
    Speech.stop(); // Stop yung current speech
    setNotificationReceived(false); // Reset yung notification received state
    clearInterval(snoozeInterval); // Clear yung snooze interval
    clearInterval(speakingInterval); // Clear yung speaking interval
  };  

    return (
      <AlarmContext.Provider value={{ notificationReceived, setNotificationReceived, speakingInterval, setSpeakingInterval, snoozeInterval, setSnoozeInterval, configureNotifications, handleNotificationClick, handleSnooze, handleStop }}>
        {children}
      </AlarmContext.Provider>
    );
  };
export const useAlarmContext = () => useContext(AlarmContext);