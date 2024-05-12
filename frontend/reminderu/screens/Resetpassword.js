import { View, Text, SafeAreaView, ImageBackground, Image, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import { useState } from 'react';

export default function ForgotPassword () {
  const [Password, setPassword]= useState('');
  const [Confirm_Password, setConfirmPassword]= useState('');
  return (
   <SafeAreaView style= {{flex: 1}}>
    <ImageBackground source = {require("../assets/bg.png")} style= {{flex: 1}}>
    <View style= {styles.container}>
      <Image style = {styles.header_image} source = {require("../assets/forgot_password.png")}/>  
    </View>

    <View style= {{alignItems: 'center'}}>
      <Text style= {styles.title_text}>Change Password </Text>
      <Text style= {styles.subtitle_text}> Create new password and don't forget it! </Text>
      </View>


    <View style = {{padding:30}}>
      <Text style= {styles.input_title}>PASSWORD</Text>
      <TextInput style= {styles.input}value ={Password} secureTextEntry = {true} 
      onChangeText={setPassword} placeholder='Enter your Password...'/>
      </View>

      <View style = {{padding:30, marginTop: -65}}>
      <Text style= {styles.input_title}>CONFIRM PASSWORD</Text>
      <TextInput style= {styles.input}value ={Confirm_Password} secureTextEntry = {true} 
      onChangeText={setConfirmPassword} placeholder='Re-Enter your Password...'/>
      </View>

    <View style ={{alignItems: 'center', marginTop: -20}}>
    <TouchableOpacity onPress= {() =>console.log("send Button pressed")} 
      style ={styles.main_buttons}>
    <Text style= {styles.Button_Text}> SAVE PASSWORD</Text>
    </TouchableOpacity>
    </View>

    <View style = {{alignItems: 'center'}}>
      <Image source = {require("../assets/footerName.png")} style = {styles.footer_style}/>
    </View>
    </ImageBackground>


   </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent:'center',
  },
  header_image:{
    marginTop: 110,
    width: 200,
    height: 190,
  },
  title_text:{
    fontSize: 24,
    fontWeight: 'bold',
    color: "#3D405B",
  },
  subtitle_text: {
    fontWeight: 'bold',
    fontSize: 10,
    color: "#545454",
    alignItems: 'center',
    
    
  },
  input_title: {
    fontWeight: 'bold',
    fontSize: 13,
    color: "#545454",
  },
  input: {
    height: 40, 
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    backgroundColor: '#fff',
    fontWeight:'bold',
    marginBottom: 30,
  },
  main_buttons:{
    backgroundColor:'#DCBDFF',
    borderRadius:10, 
    height: 40, 
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  Button_Text:{
    color: '#112C41',
    fontWeight: 'bold',
  },
  Register_Style:{
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
    marginTop:100,
  },

  title_text:{
    fontSize: 24,
    fontWeight: 'bold',
    color: "#3D405B",
  },
  subtitle_text: {
    fontWeight: 'bold',
    fontSize: 15,
    color: "#545454",
    marginBottom: 10,
  },
})