import { View, TextInput, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from "expo-font";

const SearchBar = () => {
    const [fontLoaded] = useFonts({
        'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
        'RumRaisin': require('../fonts/RumRaisin-Regular.ttf'),
    });
    if(!fontLoaded){
        return undefined;
    }
    else {
        return(
            <View style={styles.container}>
                <View style={styles.searchCon}>
                <Ionicons name="search"  color={'gray'} size={25} style={{marginLeft: 1, marginRight: 5}}/>
                <TextInput 
                    placeholder="Search Your Reminders..."
                    placeholderTextColor={"gray"}
                    style={styles.input}            
                />
                </View>
            </View>
        )
    }
}

export default SearchBar;

const styles = StyleSheet.create({
    container:{
        marginTop: -20, 
        width:'100%'     
    },
    searchCon:{
        padding:10,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius:10,
        alignItems: 'center',
    },
    input:{
        fontSize: 15,
        fontFamily: 'Poppins_SemiBold',
        color: '#333',
        width:'90%'
    },
});