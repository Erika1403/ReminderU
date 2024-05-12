import { ImageBackground, SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';

export default function OnBoardPage() {
  return (
    <SafeAreaView style={{flex: 1}}> 
    <ImageBackground source={require('./assets/bg.png')} style={styles.imageBG}> 
      <View>
        <Image source={require('./assets/appImage.png')} style={styles.headerImage}/>
      </View>
      <View style={{width:250, top: -80}}>
        <Text style={styles.desc}>
          Never miss a beat again. All you need is your voice to set, manage, and stay on top of your reminders. No more scrambling – just speak your mind and let Belle handle the rest.
        </Text>
      </View>
      <View style={{marginTop: 10}}>
      <TouchableOpacity style={styles.logInButton} >
          <Text style={styles.buttonTitle}>LOG IN</Text>
        </TouchableOpacity>
      </View>
      <Image source={require('./assets/or.png')} style={styles.orImage}/>
      <View>
      <TouchableOpacity style={styles.signUpButton} >
          <Text style={styles.buttonTitle}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageBG:{
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  headerImage:{
    width: 300,
    height: 300,
  },
  desc:{
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    color: '#908D8D'
  },
  logInButton:{
    height: 40,
    width: 250,
    backgroundColor: '#DCBDFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    top: -30,
   
  },
  buttonTitle:{
    color: '#112C41',
    fontWeight: 'bold',
  },
  signUpButton:{
    height: 40,
    width: 250,
    borderColor: '#DCBDFF',
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    top:-70
  },
  orImage:{
    width: 200,
    height:100,
    top: -50
  },

});
