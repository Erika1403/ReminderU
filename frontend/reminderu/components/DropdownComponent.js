import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useFonts } from 'expo-font';

const data = [
{ label: 'ALL', value: '1' },
{ label: 'COMPLETED', value: '2' },
{ label: 'UPCOMING', value: '3' },
];

const DropdownComponent = () => {
const [value, setValue] = useState(null);
const [isFocus, setIsFocus] = useState(false);
const [fontLoaded] = useFonts({
    'Poppins_SemiBold': require('../fonts/Poppins-SemiBold.ttf'),
});

const renderLabel = () => {
if (value || isFocus) {
    return (
    <></>
    );
}
return null;
};

return (
<View style={styles.container}>
    {renderLabel()}
    <Dropdown
    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
    placeholderStyle={styles.placeholderStyle}
    selectedTextStyle={styles.selectedTextStyle}
    data={data}
    maxHeight={300}
    labelField="label"
    valueField="value"
    placeholder={!isFocus ? 'Select Reminder' : '...'}
    value={value}
    onFocus={() => setIsFocus(true)}
    onBlur={() => setIsFocus(false)}
    onChange={item => {
        setValue(item.value);
        setIsFocus(false);
    }}
    />
</View>
);
};

export default DropdownComponent;

const styles = StyleSheet.create({
    container: {
    marginBottom: -21,
    marginTop: -14,
    padding: 16,
    width: 200,
    },
    dropdown: {
    height: 50,
    paddingHorizontal: 8,
    },
    icon: {
    marginRight: 5,
    },
    placeholderStyle: {
    fontSize: 15,
    fontFamily: 'Poppins_SemiBold',
    color: '#C999D6'
    },
    selectedTextStyle: {
    fontSize: 16,
    color: '#3D405B',
    fontFamily: 'Poppins_SemiBold',
    textAlign: 'right',
    marginRight: 5,
    },
    iconStyle: {
    width: 20,
    height: 20,
    },
});