import { View, Text, Image, Button, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import belle from '../assets/belle.png';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';


export default function StartChatScreen() {
    const navigation = useNavigation();

    const [fontLoaded] = useFonts({
        'Poppins_ExtraBold': require('../fonts/Poppins-ExtraBold.ttf'),
        'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
        'Poppins_Regular': require('../fonts/Poppins-Regular.ttf'),
    });
    if(!fontLoaded){
        return undefined;
    }
    else{
        return (
            <View style={styles.container}>
              <Image source={belle}/>
              <Text style={styles.belle_font}>Hi I'm <Text style={{ color: '#C999D6' }}>Belle!</Text></Text>
              <Text style={styles.subtitle}>Let me assist you to create your very own Reminder.</Text>
              <TouchableOpacity onPress={() => navigation.navigate('chat')} style={styles.chat_btn}>
                <Text style={styles.txt_btn}>
                    Start talking to Belle
                </Text>
              </TouchableOpacity>
            </View>
          )
        }
  
}

const styles=StyleSheet.create({
    container:{
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    belle_font: {
        fontSize: 36,
        fontFamily: 'Poppins_ExtraBold',
    },
    subtitle: {
        fontSize: 15,
        fontFamily: 'Poppins_SemiBold',
        color: '#545454',
        marginLeft: 75,
        marginRight: 75,
        textAlign: 'center'
    },
    chat_btn:{
        backgroundColor: '#DCBDFF',
        padding: 10,
        borderRadius: 10,
        marginLeft: 44,
        marginRight: 44, 
        width: 272,
        height: 40,
        marginTop: 60,
    },
    txt_btn:{
        textAlign: 'center',
        color: '#112C41',
        fontFamily: 'Poppins_SemiBold',
        fontSize: 13
    },
});