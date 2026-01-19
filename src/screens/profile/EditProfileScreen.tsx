import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Avatar, IconButton, Surface } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../../store';
import { updateUserProfile } from '../../store/slices/userSlice';
import { pubmateColors } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.profile);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!user) return;
      await dispatch(updateUserProfile({
        uid: user.uid,
        data: {
          firstName,
          lastName,
          email,
          phone,
        },
      })).unwrap();

      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Photo Section */}
      <View style={styles.photoSection}>
        <Avatar.Icon size={100} icon="account" style={styles.avatar} />
        <IconButton
          icon="camera"
          size={24}
          iconColor="#fff"
          style={styles.cameraButton}
          onPress={() => console.log('Change photo')}
        />
        <Button mode="text" onPress={() => console.log('Change photo')} style={styles.changePhotoButton}>
          Change Photo
        </Button>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Personal Information
        </Text>

        <Surface style={styles.formCard} elevation={0}>
          <TextInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            mode="outlined"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
          />

          <TextInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            mode="outlined"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
            right={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
            right={<TextInput.Icon icon="phone" />}
          />
        </Surface>

        <Text variant="bodySmall" style={styles.helperText}>
          Changes to your email or phone number may require verification
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
          style={styles.saveButton}
        >
          Save Changes
        </Button>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  photoSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: pubmateColors.orange,
    marginBottom: 8,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 60,
    right: '38%',
    backgroundColor: pubmateColors.charcoal,
  },
  changePhotoButton: {
    marginTop: 8,
  },
  formSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 16,
    color: pubmateColors.charcoal,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  helperText: {
    color: '#666',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
    backgroundColor: pubmateColors.orange,
  },
  bottomPadding: {
    height: 32,
  },
});
