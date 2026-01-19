import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { verifyPhoneCode } from '../../store/slices/authSlice';
import { ProgressBar, VerificationCodeInput } from '../../components/auth';
import { pubmateColors } from '../../theme';

type PhoneVerificationScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'PhoneVerification'
>;

export default function PhoneVerificationScreen() {
  const navigation = useNavigation<PhoneVerificationScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error, onboardingData } = useAppSelector((state) => state.auth);

  const [code, setCode] = useState('');
  const [resendTimer, setResendTimer] = useState(28);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code;

    if (codeToVerify.length !== 6) {
      return;
    }

    try {
      await dispatch(
        verifyPhoneCode({
          verificationId: '', // Should be stored in redux/state from previous step
          verificationCode: codeToVerify,
        })
      ).unwrap();
      navigation.navigate('UserProfile');
    } catch (err) {
      console.error('Verification failed:', err);
      setCode('');
    }
  };

  const handleResend = () => {
    // TODO: Implement resend logic via dispatch
    setResendTimer(28);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <IconButton
            icon="chevron-left"
            size={30}
            onPress={() => navigation.goBack()}
            iconColor={pubmateColors.charcoal}
          />
          <ProgressBar currentStep={3} totalSteps={8} />
          <Button
            mode="text"
            onPress={() => navigation.navigate('UserProfile')}
            textColor={pubmateColors.orange}
            labelStyle={styles.skipLabel}
          >
            Skip
          </Button>
        </View>

        <View style={styles.content}>
          <View style={styles.heroSection}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>SMS Sent</Text>
            </View>
            <Text style={styles.title}>Enter verification code</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to{'\n'}
              <Text style={styles.phoneNumber}>{onboardingData.phone || '+61 XXX XXX XXX'}</Text>
            </Text>
          </View>

          <View style={styles.form}>
            <VerificationCodeInput
              code={code}
              onCodeChange={setCode}
              onComplete={handleVerify}
              error={!!error}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              <Button
                mode="text"
                onPress={handleResend}
                disabled={resendTimer > 0}
                textColor={pubmateColors.orange}
                labelStyle={styles.resendLabel}
              >
                {resendTimer > 0
                  ? `Resend in 00:${resendTimer.toString().padStart(2, '0')}`
                  : 'Resend SMS'
                }
              </Button>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={() => handleVerify()}
            loading={isLoading}
            disabled={isLoading || code.length !== 6}
            style={styles.verifyButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Verify & Continue
          </Button>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  skipLabel: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: pubmateColors.charcoal,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  phoneNumber: {
    fontWeight: 'bold',
    color: pubmateColors.charcoal,
  },
  form: {
    flex: 1,
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  resendContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  resendText: {
    color: '#999',
    fontSize: 14,
  },
  resendLabel: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 0 : 24,
  },
  verifyButton: {
    backgroundColor: pubmateColors.orange,
    borderRadius: 12,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
