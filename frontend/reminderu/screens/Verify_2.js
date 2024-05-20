import { View, Text, TouchableOpacity, TextInput, SafeAreaView, Image, ImageBackground, StyleSheet } from 'react-native'
import React from 'react';
import { useState } from 'react';
import { useFonts } from 'expo-font';
import { useNavigation, useRoute } from '@react-navigation/native';
import { OtpInput } from 'react-native-otp-entry';
import { showAlert } from './NewReminderScreen';


export default function Verify2({route}) {
  const [OTP, setOTP] = useState("");
  const navigation = useNavigation();
  const param = useRoute().params;
  const [fontLoaded] = useFonts({
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'Rum_Raisin':require('../fonts/RumRaisin-Regular.ttf'),
  });
  const USER_URL = "http://10.0.2.2:5000/user/";
  const VerifyEmail = async () =>{
    try{
      let url = USER_URL + param.email + "/" + param.password + "/verify";
      const data = {
        "token": OTP,
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      else {
        const fetchedData = await response.json();
        if(fetchedData.hasOwnProperty('error')){
          console.log(fetchedData["error"]);
        }
        else if (fetchedData.hasOwnProperty('confirmed')) {
          console.log(fetchedData);
          if(fetchedData["confirmed"] === true){
            navigation.navigate('LogIn');
          }
          else {
            showAlert("OTP Verification Failed", "Wrong OTP, Try Again!");
          }
        }
      }
    }
    catch (error){
      console.log(error);
    }
  };

  const checkOTP = () => {
    if(OTP.length === 6){
      VerifyEmail();
    }
    else {
      showAlert("Invalid","The OTP you entered is incomplete");
    }
  };
  if (!fontLoaded) {
    return undefined;
  }
  else {
    return (
      <SafeAreaView style= {{flex:1}}>
       <ImageBackground source ={require("../assets/bg.png")} style= {{flex:1}}>
    
       <View style= {styles.container}>
       <Image source={require("../assets/verify_email.png")} style= {styles.header_image}/>
       </View>
   
       <View style= {{alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
       <Text style= {styles.title_text}>Let's Verify Your Email</Text>
       <Text style= {styles.subtitle_text}>Code is given to your given email</Text>
       </View> 
   
       <View style= {styles.OTPContainer}>
       <OtpInput
          numberOfDigits = {6}
          focusColor={"purple"}
          focusStickBlinkingDuration={400}
          onTextChange={(text) => setOTP(text)}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
          }}
       />

        </View>
   
       <View style = {styles.Login_Style}>    
       <Text style= {{color:'#727272', fontSize: 11, fontFamily: 'Poppins_SemiBold'}}> You didn't receive a code?</Text>
       <TouchableOpacity onPress= {() =>console.log("Function to Resend Code")}> 
       <Text style = {{fontSize: 11, fontFamily: 'Poppins_SemiBold'}}>Resend code</Text>
       </TouchableOpacity>
       </View>
   
       <View style={{paddingLeft:30, paddingRight: 30, marginTop: 60, width: '100%', alignItems: 'center'}}>
       <TouchableOpacity onPress= {checkOTP}
            style ={styles.main_buttons}>
            <Text style= {styles.Button_Text}>VERIFY EMAIL</Text>
       </TouchableOpacity>
       </View>
   
       <View style = {{alignItems: 'center'}}>
         <Image source = {require("../assets/footerName.png")} style = {styles.footer_style}/>
       </View>
       
   
   
       </ImageBackground>
      </SafeAreaView>
     )
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent:'center'
  },
  title_text:{
    fontSize: 24,
    fontFamily: 'Rum_Raisin',
    color: "#3D405B",
  },
  subtitle_text: {
    fontFamily: 'Poppins_SemiBold',
    fontSize: 15,
    color: "#545454",
    marginBottom: 10,
  },
  input_title: {
    fontFamily: 'Poppins_SemiBold',
    fontSize: 13,
    color: "#545454",
  },
  header_image:{
    marginTop: 100,
    width: 210,
    height: 210,
  },
  main_buttons:{
    backgroundColor:'#DCBDFF',
    borderRadius:10, 
    height: 40, 
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    Top: -5, 
  },
  Button_Text:{
    color: '#112C41',
    fontFamily: 'Poppins_SemiBold',
  },
  Login_Style:{
    color: '#908D8D',
    marginBottom: 1,
    marginTop:20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
 
   },
   footer_style: {
     width: 250,
     height:40,
     marginTop:40,
 
   },
    OTPContainer: {
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
    },
    Login_Style:{
      color: '#908D8D',
      marginBottom: 1,
      marginTop:20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
     },
     footer_style: {
      width: 250,
      height:40,
      marginTop:150,
    },
})