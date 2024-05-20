import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Signup_2 from '../screens/Signup_2';
import Verify from '../screens/Verify';
import Resetpassword from '../screens/Resetpassword';
import ForgotPassword from '../screens/ForgotPassword';
import TabNavigation from './tabNavigation';
import { UserContextProvider } from '../UserContext';
import Verify2 from '../screens/Verify_2';


const Stack=createNativeStackNavigator();

export default function LogInNav() {
    return (
        <UserContextProvider>
        <Stack.Navigator initialRouteName='LogIn' screenOptions={{headerShown: false}}>
            <Stack.Screen name='LogIn' component={Login}/>
            <Stack.Screen name='Signup' component={Signup}/>
            <Stack.Screen name='Signup2' component={Signup_2}/>
            <Stack.Screen name='Home' component={TabNavigation}/> 
            <Stack.Screen name='Verify' component={Verify}/>
            <Stack.Screen name='Verify2' component={Verify2}/>
            <Stack.Screen name='ResetPass' component={Resetpassword}/>
            <Stack.Screen name='ForgotPass' component={ForgotPassword}/>
        </Stack.Navigator>
        </UserContextProvider>
    )
}