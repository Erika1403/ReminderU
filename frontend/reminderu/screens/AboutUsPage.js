import { View, Text, Image, StyleSheet} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AboutUsPage() {
  return (
    <SafeAreaView style={{flex:1}}> 
        <View style={{flexDirection: 'row', top:-25, justifyContent: 'center' , alignItems: 'center'}}>
            <Image source={require('../assets/appImage.png')} style={styles.appImage}/>
            <View style={styles.appDesc}>
              <Text style={styles.DescText}>
              ReminderU is a reminder app intended to make task scheduling easier for students.
              </Text>
            </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'center' , alignItems: 'center'}}>
        <View style={styles.devDesc}>
              <Text style={styles.DescText}>
              The developers, as students themselves were inspired to create this app to manage their limited time for academic stuff, organization duties, and time for themselves.              </Text>
            </View>
          <Image source={require('../assets/developer.png')} style={styles.appImage}/>            
        </View>


        <View style={{flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../assets/belle.png')} style={styles.belleImage}/>
            <View style={styles.belleDesc}>
              <Text style={styles.DescText}>
              Belle is a Chatbot that is created to help the user create reminders for them and also reminder on time.              </Text>
            </View>
        </View>

        <View style={{flexDirection: 'row',  marginTop: 20, justifyContent: 'center' , alignItems: 'center'}}>
        <View style={styles.vscodeDesc}>
              <Text style={styles.DescText}>
              This app is developed using Android Studio as the Integrated Development Environment, React as a framework, and React Native for UI design.    </Text>        
             </View>
          <Image source={require('../assets/vscode.png')} style={styles.appImage}/>            
        </View>

    </SafeAreaView>
   
  )
}
const styles = StyleSheet.create({
  appImage:{
    width: 150,
    height: 130,
  },
  appDesc:{
    width: 210,
    height: 130,
    backgroundColor: '#DCBDFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  DescText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#545454'
  },
  devDesc:{
    width: 210,
    height: 180,
    backgroundColor: '#B4D2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10
  },
  belleImage:{
    width: 130,
    height: 130,
  },
  belleDesc:{
    width: 230,
    height: 120,
    backgroundColor: '#DCBDFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius:10,
    padding: 10
  },
  vscodeDesc:{
    width: 220,
    height: 140,
    backgroundColor: '#B4D2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10
  },
})  