import { View, Text, TouchableOpacity, TextInput, SafeAreaView, Image, ImageBackground, StyleSheet } from 'react-native'
import React from 'react';
import { useState } from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';

export default function Signup() {

  const [Email,setEmail]= useState("");
  const [Password, setPassword] = useState("");
  const [Confirm_Password, setConfirmPassword] = useState("");
  const USER_URL = "http://10.0.2.2:5000/user/";
  const navigation = useNavigation();
  const [fontLoaded] = useFonts({
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'Rum_Raisin':require('../fonts/RumRaisin-Regular.ttf'),
});

  const ToVerify = async () => {
    try{
      let url = USER_URL + Email + "/" + Password + "/create";
      const response = await fetch(url, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      else {
        const fetchedData = await response.json();
        if(fetchedData.hasOwnProperty('error')){
          alert(fetchedData["error"]);
        }
        else {
          const user_data = {email: Email, 
          user_id: fetchedData["user_id"],
          password: Password};
          navigation.navigate('Verify', user_data);
        }
      }
    }
    catch (error){
      console.log(error);
    }
  };

  const checkPasswords = ()=>{
    if(Password === Confirm_Password && Email !== "" && Password !== "" && Confirm_Password !== "" ){
      ToVerify();
      navigation.navigate("Verify");
    }
    else if(Email ==="" && Password==="" && Confirm_Password===""){
      alert("Please enter all the fields");
    }
    else if ((Email === "" && Password === "") ||
     (Password ==="" && Confirm_Password === "") ||
      (Email==="" && Confirm_Password==="")){
        alert("Please fill up empty fields");
      }
    else if(Email === ""){
      alert("Please enter email field");
    }
    else if (Password === ""){
      alert("Please enter a password");
    }
    else if (Confirm_Password === "") {
      alert("Please confirm your password");
    }
    else {
      alert ("Passwords mismatched!");
    }
  };

  if(!fontLoaded){
    return undefined;
  }
  else {
    return (
      <SafeAreaView style= {{flex: 1}}>
       <ImageBackground source= {require("../assets/bg.png")} style={{flex:1}}>
       <View style= {styles.container}>
         <Image style = {styles.header_image}source = {require("../assets/sign_up.png")}/>
       </View>
   
        <View style= {{alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
        <Text style= {styles.title_text}> Let's Create Your Account</Text>
         <Text style= {styles.subtitle_text}> Create Reminders For You.</Text>
        </View>
   
        <View style = {{paddingLeft:30, paddingRight: 30}}>
         <Text style= {styles.input_title}>EMAIL</Text>
         <TextInput style= {styles.input}value ={Email} onChangeText={setEmail} placeholder='example@gmail.com' placeholderTextColor={'#D9D9D9'}/>
         
         <Text style= {styles.input_title}>PASSWORD</Text>
         <TextInput style= {styles.input} value ={Password} onChangeText={setPassword} 
           placeholder= "Enter your Password" secureTextEntry= {true} placeholderTextColor={'#D9D9D9'}/>
         
         <Text style= {styles.input_title}>CONFIRM  PASSWORD</Text>
         <TextInput style= {styles.input} value ={Confirm_Password} onChangeText={setConfirmPassword} 
           placeholder= "Re-enter your Password" secureTextEntry= {true} placeholderTextColor={'#D9D9D9'}/>
         
         <TouchableOpacity onPress= {checkPasswords}
         style ={styles.main_buttons}>
         <Text style= {styles.Button_Text}>SEND CODE</Text>
         </TouchableOpacity>
         
         </View>
   
         <View style = {styles.Login_Style}>    
       <Text style= {{color:'#727272', fontSize: 11, fontFamily: 'Poppins_SemiBold'}}> Already a member?</Text>
         <TouchableOpacity onPress= {() => navigation.navigate('LogIn')}> 
         <Text style = {{fontSize: 11, fontFamily: 'Poppins_SemiBold'}}>Log in!
         </Text>
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
    justifyContent:'center',
    marginTop: 30,
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
  input: {
    height: 40, 
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#D9D9D9CC',
    backgroundColor: '#FFFFFF',
    marginBottom: 30,
    fontFamily: 'Poppins_SemiBold',
  },
  header_image:{
    marginTop: 50,
    width: 220,
    height: 210,
  },
  main_buttons:{
    backgroundColor:'#DCBDFF',
    borderRadius:10, 
    height: 40, 
    width: '100%',
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
 
})