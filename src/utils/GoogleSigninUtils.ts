import { GoogleSignin } from '@react-native-google-signin/google-signin';

// TEMPORARILY DISABLED: Firebase removed, GoogleService-Info.plist not available
export const configureGoogleSignin = () => {
    console.warn('Google Sign In temporarily disabled - Firebase not configured');
    // GoogleSignin.configure({
    //     webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
    //     iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
    // });
};
