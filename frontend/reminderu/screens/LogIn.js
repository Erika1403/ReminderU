import { View, Text, SafeAreaView, ImageBackground, Image, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import React, { useEffect, useState , useContext} from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../UserContext';
import REMINDERU_URL from '../API_ENDPOINTS';
import { cleanScheduleData } from '../functions/UpdateFunctions';
import { showAlert } from './NewReminderScreen';
import isEmail from 'validator/lib/isEmail';


export default function Login
() {
  const [User_Email, setEmail]= useState('');
  const [User_Password, setPassword] = useState('');
  const {setUserData, setSchedData, setSchedToday} = useUserContext();
  const userData = useUserContext().userData;
  const navigation = useNavigation();
  
  const [fontLoaded] = useFonts({
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'Rum_Raisin':require('../fonts/RumRaisin-Regular.ttf'),
});
  useEffect(()=>{
    if(userData !== null){
      getAllSchedule();
    }
  }, [userData]);

  const getAllSchedule = async () => {
    try{
      let url = REMINDERU_URL.SCHEDFUNC_URL + userData.user_id + "/1" ;
      const response = await fetch(url, {
        method: 'GET'
      });
      if (!response.ok) {
        showAlert("Error","Invalid Credentials");
        throw new Error(`API request failed with status ${response.status}`);
      }
      else {
        const fetchedData = await response.json();
        if(fetchedData.hasOwnProperty('error')){
          showAlert("Error","An error occured while fetching the data");
        }
        else {
          const result = cleanScheduleData(fetchedData);
          setSchedData(result.data);
          if(result.currData.length > 0){
            console.log(result.currData.length);
            setSchedToday(result.currData);
          }
        }
      }
    }
    catch (error){
      console.log(error);
    }
  };

  //Validation
  const CheckLogIn = () => {
    if(User_Email === '' || User_Password === ''){
      showAlert("Error","Please fill in all the fields");
    }
    else if (User_Email === '') {
      showAlert("Error","Please fill in your email address");
    }
    else if (User_Password === ''){
      showAlert("Error", "Please fill in your password");
    } 
    else {
      if (!isEmail(User_Email)){
        showAlert("Error", "The email you entered is not a valid email address");
        setEmail("");
      }
      else if (User_Password.length < 6){
        showAlert("Error", "Passwords should be longer than 6 characters!");
        setPassword("");
      }
      else {
        checkCredentials();
      }
    }
  };
  
  const checkCredentials = async () => {
    try{
      let url = REMINDERU_URL.USER_URL + User_Email + "/" + User_Password+ "/signin" ;
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
          showAlert("Error",'Invalid Credentials');
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
         <TextInput style={styles.inputHolder} value={User_Email} onChangeText={setEmail} placeholder='Enter your Email'
         placeholderTextColor={'#D9D9D9'}/>
         
         <Text style= {styles.input_title}>PASSWORD</Text>
         <TextInput style={styles.inputHolder} value={User_Password} onChangeText={setPassword} 
           placeholder= "Enter your Password" secureTextEntry= {true} placeholderTextColor={'#D9D9D9'}/>
       </View>
   
         <View style={styles.Forgot_Style}> 
           <TouchableOpacity onPress= {()=> navigation.navigate('ForgotPass')}>
             <Text style ={styles.Forgot_Text_Style}>Forgot Password?</Text></TouchableOpacity>
         </View>
     
       <View style ={{alignItems: 'center'}}>
       <TouchableOpacity 
         style ={styles.main_buttons}>
       <Text style= {styles.Button_Text} onPress={() => CheckLogIn()} // Go to Home Page
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
    marginTop: 90,
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
  inputHolder: {
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