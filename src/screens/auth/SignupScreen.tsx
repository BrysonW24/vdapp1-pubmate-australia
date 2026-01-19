import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { signUpWithEmail } from '../../store/slices/authSlice';
import { SocialSignInButtons } from '../../components/auth';
import { pubmateColors } from '../../theme';

type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

export default function SignupScreen() {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignup = async () => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password || newErrors.confirmPassword) {
      return;
    }

    try {
      await dispatch(signUpWithEmail({ email, password })).unwrap();
      navigation.navigate('AgeVerification');
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.headerRow}>
          <IconButton
            icon="chevron-left"
            size={30}
            onPress={() => navigation.goBack()}
            iconColor={pubmateColors.charcoal}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Step into Australia's best pub experience 🍻</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.promoCard}>
              <Text style={styles.promoTitle}>🎁 Free $10 Credit!</Text>
              <Text style={styles.promoText}>
                Complete your profile to get a $10 bonus in your account.
              </Text>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
                style={styles.input}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor={pubmateColors.orange}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={!!errors.password}
                style={styles.input}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor={pubmateColors.orange}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                    color="#999"
                  />
                }
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                error={!!errors.confirmPassword}
                style={styles.input}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor={pubmateColors.orange}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    color="#999"
                  />
                }
              />
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            {error ? <Text style={[styles.errorText, styles.centerText]}>{error}</Text> : null}

            <Button
              mode="contained"
              onPress={handleSignup}
              loading={isLoading}
              disabled={isLoading}
              style={styles.signupButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Sign Up
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <SocialSignInButtons
              onSuccess={() => { }}
              onError={(err) => console.log(err)}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already a user? </Text>
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                Log In
              </Text>
            </View>

            <Text style={styles.terms}>
              By joining, you agree to our{' '}
              <Text style={styles.link} onPress={() => { }}>Terms</Text> and{' '}
              <Text style={styles.link} onPress={() => { }}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  headerRow: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: pubmateColors.charcoal,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  promoCard: {
    backgroundColor: '#FFF8E7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  promoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: pubmateColors.orange,
    marginBottom: 4,
  },
  promoText: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  centerText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  signupButton: {
    marginTop: 8,
    marginBottom: 24,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEE',
  },
  dividerText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  loginText: {
    color: '#777',
    fontSize: 16,
  },
  loginLink: {
    color: pubmateColors.orange,
    fontWeight: 'bold',
    fontSize: 16,
  },
  terms: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 16,
  },
  link: {
    color: '#666',
    textDecorationLine: 'underline',
  },
});
