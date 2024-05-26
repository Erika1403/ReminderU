import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native'
import React, {useState} from 'react'
import { useFonts } from 'expo-font';
import { Entypo } from '@expo/vector-icons';

export default function ReminderCon({Title, Desc, STime, Date, Status}) {
    const [fontLoaded] = useFonts({
        'Poppins_ExtraBold': require('../fonts/Poppins-ExtraBold.ttf'),
        'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
    });
    if(!fontLoaded){
        return undefined;
    }
    else {
        return (
            <View style={{
            height: "auto",
            padding: 10,
            marginTop: 10,
            backgroundColor:Status=="Upcoming"? '#B4D2FF':'#EDBBFA',
            borderRadius: 10,}}>
            <View style={{marginBottom: 5}}>
              <Text style={styles.remTitle}>{Title}</Text>
              <Text style={styles.remDesc}>{Desc}</Text>
            </View>
            <View style={styles.footerCon}>
                <Text style={styles.Time}>{STime}</Text>
                <Text style={styles.Date}>{Date}</Text>
                <Text style={styles.Category}>{Status}</Text>
            </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    remTitle:{
        fontSize: 15,
        fontFamily: 'Poppins_ExtraBold',
        color: '#3D405B',
    },
    remDesc: {
        fontSize: 13,
        fontFamily: 'Poppins_SemiBold',
        color: '#fff'
    },
    footerCon:{
        marginTop:5,
        borderTopWidth:2,
        borderTopColor: 'gray',
        flexDirection: 'row',

    },
    Time: {
        fontSize: 18,
        fontFamily: 'Poppins_SemiBold',
        color: '#3D405B',
        marginTop: 3,
        marginRight: 10,
    },
    Date: {
        fontFamily: 'Poppins_SemiBold',
        color: '#908D8D',
        marginTop: 5,
        marginRight: 60,
    },
    Category:{
        fontFamily: 'Poppins_SemiBold',
        color: '#908D8D',
        marginTop: 5,
    
    },
})