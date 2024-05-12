import { Modal, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Image, ImageBackground, TextInput } from 'react-native';
import React from 'react';
import { useState } from 'react';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import { AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useNavigation} from '@react-navigation/native';

const SampleDatePicker = () => {
    const today = new Date();
    const startdate = getFormatedDate(today.setDate(today.getDate()+1), 'YYYY/MM/DD');
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState('');

    const [User_Name, setName] = useState('');
    const [User_Bday, setBday] = useState('');

    const handleDateChange = (propDate) => {
        setBday(propDate);
        setDate(propDate);
        pickerPressed();
    }
    const pickerPressed = () => {
        setOpen(!open);
    }

    const navigation = useNavigation();

    const [fontLoaded] = useFonts({
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    'Rum_Raisin':require('../fonts/RumRaisin-Regular.ttf'),
});

    if(!fontLoaded){
        return undefined;
    }
    else{
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ImageBackground style={{ flex: 1 }} source={require("../assets/bg.png")}>
                    <View style={styles.container}>
                        <Image style={styles.header_image} source={require("../assets/sign_up.png")} />
                    </View>
    
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                        <Text style={styles.title_text}> Let's Create Your Account</Text>
                        <Text style={styles.subtitle_text}> Create Reminders For You.</Text>
                    </View>
    
                    <View style={{ padding: 30, marginTop: -20 }}>
                        <Text style={styles.input_title}>USERNAME</Text>
                        <TextInput style={styles.input} value={User_Name} onChangeText={setName} placeholder='Enter your Username' placeholderTextColor={'#D9D9D9'}/>
                    </View>
    
                    <View style={{ padding: 30, marginTop: -60, marginRight: 40, marginBottom: -30}}>
                        <Text style={styles.input_title}>DATE OF BIRTH</Text>
                    </View>
    
                    <View style={{ flexDirection: 'row', marginLeft :30, marginRight: 50}}>
                        <TextInput style={styles.input_DOB} editable={false}
                        selectTextOnFocus={false}  
                        value={User_Bday} 
                        onChangeText={setBday} 
                        placeholder='DD/MM/YYYY' 
                        placeholderTextColor={'#D9D9D9'}/>
    
                        <View >
                        <TouchableOpacity style={styles.Calendar_style} onPress={pickerPressed}>
                        <AntDesign name="calendar" size={22} color="gray" />
                        </TouchableOpacity>
    
                        <Modal
                            animationType='slide'
                            transparent={true}
                            visible={open}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <DatePicker
                                        mode='calendar'
                                        minimumDate={startdate}
                                        selected={date}
                                        onDateChange={handleDateChange}
                                    />
                                </View>
                            </View>
                        </Modal>
                    </View>
                    </View>
    
                     
    
                    <View style={{ alignItems: 'center', justifyContent: 'center', paddingLeft: 30, paddingRight:30}}>
                        <Text style={{ color: '#727272', fontSize: 11, fontFamily: 'Poppins_SemiBold' }}> By tapping the Signup you agree to the Terms </Text>
                        <Text style={{ color: '#727272', fontSize: 11, fontFamily: 'Poppins_SemiBold' }}> & Conditions and Privacy Policy of this App</Text>
                    </View>
    
                    <View style={{ alignItems: 'center', padding: 30}}>
                        <TouchableOpacity onPress={() => console.log("Go to Home")}
                            style={styles.main_buttons}>
                            <Text style={styles.Button_Text}> SIGN UP</Text>
                        </TouchableOpacity>
                    </View>
    
                    <View style={styles.Login_Style}>
                        <Text style={{ color: '#727272', fontSize: 11, fontFamily: 'Poppins_SemiBold' }}> Already a member?</Text>
                        <TouchableOpacity onPress= {() => navigation.navigate('LogIn')}>
                            <Text style={{ fontSize: 11, fontFamily: 'Poppins_SemiBold' }}>Log in!</Text>
                        </TouchableOpacity>
                    </View>
    
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require("../assets/footerName.png")} style={styles.footer_style} />
                    </View>
    
                </ImageBackground>
            </SafeAreaView>
        )
    }
}

export default SampleDatePicker;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    choice_btn: {
        backgroundColor: 'purple',
        padding: 10,
        borderRadius: 10,
        width: '80%',
        height: 47,
    },
    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: 'purple',
        width: '90%',
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
      marginRight: 10,
      fontFamily: 'Poppins_SemiBold',
    },
    input_DOB: {
      height: 40, 
      width: '90%',
      padding: 10,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#D9D9D9CC',
      backgroundColor: '#ffffff',
      fontFamily: 'Poppins_SemiBold',
      marginBottom: 30,
      
    },
    Calendar_style: {
      height: 40, 
      width: '70%',
      padding: 8,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: 'gray',
      backgroundColor: '#fff',
      fontWeight:'bold',
      marginBottom: 30,
      marginLeft: 10,
      marginRight: 9
      
    },
    header_image:{
      marginTop: 20,
      width: 200,
      height: 200,
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
});
