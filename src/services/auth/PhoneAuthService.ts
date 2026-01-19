import { Platform } from 'react-native';
import { PhoneAuthCredentials, PhoneVerificationData } from '../../types/auth.types';

// Lazy load native firebase auth
// TEMPORARILY DISABLED: Firebase removed due to C++20 compatibility issues
const getNativeAuth = () => {
  // if (Platform.OS === 'web') return null;
  // return require('@react-native-firebase/auth').default();
  console.warn('Firebase Auth temporarily disabled');
  return null;
};

class PhoneAuthService {
  private confirmationResult: any = null;

  /**
   * Send verification code to phone number (Native)
   */
  async sendVerificationCode(credentials: PhoneAuthCredentials): Promise<string> {
    if (process.env.USE_MOCK_AUTH === 'true') {
      console.log('Mock Phone Auth: Sending code to', credentials.phoneNumber);
      return 'mock-verification-id';
    }

    try {
      const { phoneNumber } = credentials;
      // In React Native with Firebase, confirmVerification returns a confirmation object
      const confirmation = await getNativeAuth().signInWithPhoneNumber(phoneNumber);
      this.confirmationResult = confirmation;
      return 'native-verification-id'; // Return a dummy or the internal ID if needed
    } catch (error: any) {
      throw this.handlePhoneAuthError(error);
    }
  }

  /**
   * Resend verification code (Native)
   */
  async resendCode(phoneNumber: string): Promise<string> {
    try {
      const confirmation = await getNativeAuth().signInWithPhoneNumber(phoneNumber, true);
      this.confirmationResult = confirmation;
      return 'reset-verification-id';
    } catch (error: any) {
      throw this.handlePhoneAuthError(error);
    }
  }

  /**
   * Check if a user is already signed in via phone
   */
  getCurrentUser(): any {
    return getNativeAuth()?.currentUser;
  }

  /**
   * Verify code received via SMS
   */
  async verifyCode(data: PhoneVerificationData): Promise<void> {
    if (process.env.USE_MOCK_AUTH === 'true') {
      console.log('Mock Phone Auth: Verifying code', data.verificationCode);
      return;
    }

    try {
      if (!this.confirmationResult) {
        throw new Error('No active verification session');
      }
      await this.confirmationResult.confirm(data.verificationCode);
      // Clear the confirmation result
      this.confirmationResult = null;
    } catch (error: any) {
      console.error('Error verifying code:', error);
      throw this.handlePhoneAuthError(error);
    }
  }

  /**
   * Link phone number to existing user account
   */
  async linkPhoneToAccount(credentials: PhoneAuthCredentials): Promise<string> {
    try {
      const { phoneNumber, countryCode } = credentials;
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;

      // Verify phone number first to get verificationId
      const verificationId = await this.sendVerificationCode(credentials);
      return verificationId;
    } catch (error: any) {
      throw this.handlePhoneAuthError(error);
    }
  }

  /**
   * Complete phone linking with verification code
   */
  async completeLinking(verificationData: PhoneVerificationData): Promise<void> {
    try {
      const nativeAuth = getNativeAuth();
      const user = nativeAuth?.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const { verificationId, verificationCode } = verificationData;

      // Create credential
      const credential = require('@react-native-firebase/auth').default.PhoneAuthProvider.credential(verificationId, verificationCode);

      // Link credential to user
      await user.linkWithCredential(credential);
    } catch (error: any) {
      throw this.handlePhoneAuthError(error);
    }
  }

  /**
   * Resend verification code
   */
  async resendVerificationCode(credentials: PhoneAuthCredentials): Promise<string> {
    this.confirmationResult = null;
    return this.sendVerificationCode(credentials);
  }

  /**
   * Handle phone auth errors
   */
  private handlePhoneAuthError(error: any): Error {
    let message = 'Phone verification failed';

    switch (error.code) {
      case 'auth/invalid-phone-number':
        message = 'Invalid phone number. Please check and try again.';
        break;
      case 'auth/invalid-verification-code':
        message = 'Invalid verification code. Please try again.';
        break;
      case 'auth/code-expired':
        message = 'Verification code has expired. Please request a new one.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later.';
        break;
      default:
        message = error.message || message;
    }

    return new Error(message);
  }
}

export default new PhoneAuthService();
