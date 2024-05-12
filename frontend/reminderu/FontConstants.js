import { useFonts } from 'expo-font';

const [fontLoaded] = useFonts({
    'Poppins_Black': require('./fonts/Poppins-Black.ttf'),
    'Poppins_Bold': require('./fonts/Poppins-Bold.ttf'),
    'Poppins_ExtraBold': require('./fonts/Poppins-ExtraBold.ttf'),
    'Poppins_SemiBold': require('./fonts/Poppins-SemiBold.ttf'),
    'Poppins_Regular': require('./fonts/Poppins-Regular.ttf'),
    'RumRaisin': require('./fonts/RumRaisin-Regular.ttf'),
});
const FONTS = {
    P_Black: 'Poppins_Black',
    P_Bold: 'Poppins_Bold',
    P_EBold: 'Poppins_ExtraBold',
    P_SBold: 'Poppins_SemiBold',
    P_Regular: 'Poppins_Regular',
    RumR: 'RumRaisin'
}
export default FONTS;