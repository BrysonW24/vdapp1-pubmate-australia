import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAppDispatch } from '../../store';
import { updateOnboardingData } from '../../store/slices/authSlice';
import { ProgressBar } from '../../components/auth';
import { pubmateColors } from '../../theme';

type UserProfileScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'UserProfile'
>;

export default function UserProfileScreen() {
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
  });

  const handleNext = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
    };

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);

    if (newErrors.firstName || newErrors.lastName) {
      return;
    }

    dispatch(updateOnboardingData({ firstName, lastName }));
    navigation.navigate('Location');
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
          <ProgressBar currentStep={4} totalSteps={8} />
        </View>

        <View style={styles.content}>
          <View style={styles.heroSection}>
            <Text style={styles.emoji}>👤</Text>
            <Text style={styles.title}>What's your name?</Text>
            <Text style={styles.subtitle}>
              How should we address you when you're at the pub?
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <TextInput
                label="First Name"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  setErrors({ ...errors, firstName: '' });
                }}
                placeholder="e.g. Bryson"
                error={!!errors.firstName}
                style={styles.input}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor={pubmateColors.orange}
              />
              {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                label="Last Name"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  setErrors({ ...errors, lastName: '' });
                }}
                placeholder="e.g. Walter"
                error={!!errors.lastName}
                style={styles.input}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor={pubmateColors.orange}
              />
              {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.nextButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Continue
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
    paddingHorizontal: 8,
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
  emoji: {
    fontSize: 50,
    marginBottom: 16,
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
    paddingHorizontal: 20,
  },
  form: {
    flex: 1,
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
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 0 : 24,
  },
  nextButton: {
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
