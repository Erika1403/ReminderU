import { View, Text, SafeAreaView, ImageBackground, Image, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import React, { useEffect, useState , useContext} from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../UserContext';



export default function Login
() {
  const [User_Email, setEmail]= useState('');
  const [User_Password, setPassword] = useState('');
  const {setUserData, setSchedData, setSchedToday} = useUserContext();
  const userData = useUserContext().userData;
  const schedToday = useUserContext().schedToday;
  const navigation = useNavigation();
  
  const [fontLoaded] = useFonts({
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'Rum_Raisin':require('../fonts/RumRaisin-Regular.ttf'),
});
  const USER_URL = "http://10.0.2.2:5000/user/";
  const SCHED_URL = "http://10.0.2.2:5000/function/";
  useEffect(()=>{
    if(userData !== null){
      getAllSchedule();
    }
  }, [userData]);

  const getAllSchedule = async () => {
    try{
      let url = SCHED_URL + userData.user_id + "/1" ;
      const response = await fetch(url, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      else {
        const fetchedData = await response.json();
        if(fetchedData.hasOwnProperty('error')){
          alert("An error occured while fetching the data");
        }
        else {
          const data = [];
          const currData = [];
          fetchedData.forEach(element => {

            const sched = {
              Event: element["Event"], 
              Date: element["Date"],
              Start_Time: element["Start Time"],
              End_Time: element["End Time"],
              Location: element["Location"],
              Category: element["Category"]
            }
            data.push(sched);
            const today = new Date();
            const currsched = new Date(element["Date"]);
            if(currsched === today){
              const strSched = {timeStr: element["Start Time"] + "-" + element["End Time"], Title: element["Event"]};
              currData.push(strSched)
            }

          });
          setSchedData(data);
          setSchedToday(currData);
        }
      }
    }
    catch (error){
      console.log(error);
    }
  };
  const checkCredentials = async () => {
    try{
      let url = USER_URL + User_Email + "/" + User_Password+ "/signin" ;
      const response = await fetch(url, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      else {
        const fetchedData = await response.json();
        if(fetchedData.hasOwnProperty('user_id')){
          const user_data = {user_name: fetchedData["user_name"], bday: fetchedData["Birthday"], user_id: fetchedData["user_id"], email: User_Email};
          setUserData(user_data);
          navigation.navigate("Home");
        }
        else {
          alert('Invalid Credentials');
        }
      }
    }
    catch (error){
      console.log(error);
    }
  };
  if(!fontLoaded){
    return undefined;
  }
  else {
    return (
      <SafeAreaView style= {{flex: 1}}>
       <ImageBackground source = {require("../assets/bg.png")} style= {{flex: 1}}>
       <View style= {styles.container}>
         <Image style = {styles.header_image}source = {require("../assets/log_in.png")}/>
       </View>
   
       <View style= {{alignItems: 'center'}}>
         <Text style={styles.title_text}>Welcome Back!</Text>
         <Text style={styles.subtitle_text}> Create Reminders For You.</Text>
       </View>
   
       <View style = {{padding:30}}>
         <Text style= {styles.input_title}>EMAIL</Text>
         <TextInput style={styles.input} value={User_Email} onChangeText={setEmail} placeholder='Enter your Email'
         placeholderTextColor={'#D9D9D9'}/>
         
         <Text style= {styles.input_title}>PASSWORD</Text>
         <TextInput style={styles.input} value={User_Password} onChangeText={setPassword} 
           placeholder= "Enter your Password" secureTextEntry= {true} placeholderTextColor={'#D9D9D9'}/>
       </View>
   
         <View style={styles.Forgot_Style}> 
           <TouchableOpacity onPress= {()=> navigation.navigate('ForgotPass')}>
             <Text style ={styles.Forgot_Text_Style}>Forgot Password?</Text></TouchableOpacity>
   
         </View>
     
       <View style ={{alignItems: 'center'}}>
       <TouchableOpacity 
         style ={styles.main_buttons}>
       <Text style= {styles.Button_Text} onPress={() => checkCredentials()} // Go to Home Page
       > UNLOCK YOUR PRODUCTIVITY</Text>
       </TouchableOpacity>
       </View>
     
       
       
       <View style = {styles.Register_Style}>    
       <Text style= {{color:'#727272', fontSize: 11, fontFamily: 'Poppins_SemiBold'}}> Don't have an account?</Text>
         <TouchableOpacity onPress= {() => navigation.navigate('Signup')}> 
         <Text style = {{fontSize: 11, fontFamily: 'Poppins_SemiBold'}}>Register Now</Text>
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
    marginTop: 20,
  },
  header_image:{
    marginTop: 50,
    width: 220,
    height: 210,
  },
  title_text:{
    fontSize: 24,
    color: "#3D405B",
    fontFamily: 'Rum_Raisin'
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
    fontFamily: 'Poppins_SemiBold',
    marginBottom: 30,
  },
  Forgot_Style: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingRight: 30,
      top: -50,
    },
  Forgot_Text_Style:{
    color: '#908D8D',
    fontSize: 12,
    fontFamily: 'Poppins_SemiBold',
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
    fontFamily: 'Poppins_SemiBold',
  },
  Register_Style:{
   color: '#908D8D',
   marginBottom: 1,
   marginTop:20,
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'center',
   
  },
  footer_style: {
    width: 250,
    height:40,
    marginTop:40,

  },
}

)