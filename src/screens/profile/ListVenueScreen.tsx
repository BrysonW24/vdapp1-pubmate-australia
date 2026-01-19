import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface, Checkbox } from 'react-native-paper';
import { pubmateColors } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export default function ListVenueScreen() {
  const navigation = useNavigation();

  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit venue listing request
      console.log('Submitting venue listing:', {
        venueName,
        address,
        contactName,
        contactEmail,
        contactPhone,
        website,
        description,
        isOwner,
      });

      // Show success message
      alert('Thank you! Your venue listing request has been submitted. We\'ll review it and get back to you soon.');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting venue listing:', error);
      alert('Sorry, something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = venueName && address && contactName && contactEmail && contactPhone;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          List Your Venue
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Add your pub or bar to PubMate Australia. Our team will review your submission and reach out within 2-3 business days.
        </Text>
      </View>

      <View style={styles.formSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Venue Information
        </Text>

        <Surface style={styles.formCard} elevation={0}>
          <TextInput
            label="Venue Name *"
            value={venueName}
            onChangeText={setVenueName}
            mode="outlined"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
          />

          <TextInput
            label="Address *"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            multiline
            numberOfLines={2}
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
          />

          <TextInput
            label="Website"
            value={website}
            onChangeText={setWebsite}
            mode="outlined"
            keyboardType="url"
            autoCapitalize="none"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
            placeholder="https://"
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
            placeholder="Tell us about your venue..."
          />
        </Surface>
      </View>

      <View style={styles.formSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Contact Information
        </Text>

        <Surface style={styles.formCard} elevation={0}>
          <TextInput
            label="Contact Name *"
            value={contactName}
            onChangeText={setContactName}
            mode="outlined"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
          />

          <TextInput
            label="Contact Email *"
            value={contactEmail}
            onChangeText={setContactEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
          />

          <TextInput
            label="Contact Phone *"
            value={contactPhone}
            onChangeText={setContactPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
          />

          <View style={styles.checkboxRow}>
            <Checkbox
              status={isOwner ? 'checked' : 'unchecked'}
              onPress={() => setIsOwner(!isOwner)}
              color={pubmateColors.orange}
            />
            <Text variant="bodyMedium" style={styles.checkboxLabel}>
              I am the owner or authorized representative
            </Text>
          </View>
        </Surface>
      </View>

      <View style={styles.infoBox}>
        <Text variant="bodySmall" style={styles.infoText}>
          By submitting this form, you agree to our Terms of Service and confirm that you have the authority to list this venue on PubMate Australia.
        </Text>
      </View>

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
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || !isFormValid}
          style={styles.submitButton}
        >
          Submit
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
  header: {
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    color: pubmateColors.charcoal,
  },
  description: {
    color: '#666',
    lineHeight: 22,
  },
  formSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 8,
    color: pubmateColors.charcoal,
  },
  infoBox: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: pubmateColors.cream,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: pubmateColors.orange,
  },
  infoText: {
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
    backgroundColor: pubmateColors.orange,
  },
  bottomPadding: {
    height: 32,
  },
});
