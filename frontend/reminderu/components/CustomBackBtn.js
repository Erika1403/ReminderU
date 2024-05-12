// CustomBackButton.js
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import arrow from '../assets/Back.png';

const CustomBackButton = () => {
  const navigation = useNavigation();

  const handlePress = () => navigation.goBack();

  return (
    <TouchableOpacity onPress={handlePress}>
      <Image
        source={arrow} // Replace with your back arrow image
        style={{ width: 25, height: 25, marginLeft: 10 }} // Adjust styles as needed
      />
    </TouchableOpacity>
  );
};

export default CustomBackButton;
