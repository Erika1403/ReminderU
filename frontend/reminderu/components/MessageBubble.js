import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import belle from '../assets/belle.png';
import { useFonts } from 'expo-font';

export default function MessageBubble({user , message}) {
    const [fontLoaded] = useFonts({
        'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    });
    let now = new Date();
    if(!fontLoaded){
        return undefined
    }
    else{
        if(user){
            return (
                <View style={styles.user_container}>
                    <Text style={styles.user_style}>{message}</Text>
                </View>
            )    
        }
        else{
            return (
                <View style={styles.belle_container}>
                  <Image source={belle} style={styles.img}/>
                  <Text style={styles.belle_style}>{message}</Text>
                </View>
            )
        } 
    }
}

const styles= StyleSheet.create({
    user_container:{
        width: '100%',
        minHeight: 50,
        height: 'auto',
        padding: 5,
        paddingEnd: 40,
    },
    belle_container:{
        width: '100%',
        minHeight: 50,
        height: 'auto',
        padding: 10,
        flexDirection: 'row',
        marginLeft: 30,
    },
    user_style:{
        backgroundColor: '#B7B8FF',
        fontFamily: 'Poppins_SemiBold',
        color: '#112C41',
        fontSize: 13,
        padding: 10,
        maxWidth: 250,
        minHeight: 40,
        width: 'auto',
        height: 'auto',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 0,
        alignSelf: 'flex-end'
    },
    belle_style: {
        backgroundColor: '#DCBDFF',
        fontFamily: 'Poppins_SemiBold',
        color: '#112C41',
        maxWidth: 250,
        minHeight: 40,
        width: 'auto',
        height: 'auto',
        fontSize: 13,
        padding: 10,
        paddingBottom: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 10,
    },
    img:{
        width: 47,
        height: 47,
        alignSelf: 'flex-end',
        marginBottom: -10
    },
});