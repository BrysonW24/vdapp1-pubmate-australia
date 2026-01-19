import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface, Checkbox, SegmentedButtons } from 'react-native-paper';
import { useAppDispatch } from '../../store';
import { addPaymentMethod } from '../../store/slices/paymentSlice';
import { CardBrand } from '../../types/payment.types';
import { pubmateColors } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export default function AddPaymentMethodScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [cardNumber, setCardNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [makeDefault, setMakeDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Billing address
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');

  const detectCardBrand = (number: string): CardBrand => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5')) return 'mastercard';
    if (cleaned.startsWith('3')) return 'amex';
    if (cleaned.startsWith('6')) return 'discover';
    return 'unknown';
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substring(0, 19); // Max 16 digits + 3 spaces
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const cleanedNumber = cardNumber.replace(/\s/g, '');
      const last4 = cleanedNumber.slice(-4);
      const brand = detectCardBrand(cardNumber);

      const newMethod = {
        id: `pm_${Date.now()}`,
        type: 'card' as const,
        cardBrand: brand,
        last4,
        expiryMonth: parseInt(expiryMonth),
        expiryYear: parseInt(expiryYear),
        holderName,
        isDefault: makeDefault,
        billingAddress: {
          line1: address1,
          line2: address2,
          city,
          state,
          postcode,
          country: 'AU',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addPaymentMethod(newMethod));
      alert('Payment method added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding payment method:', error);
      alert('Failed to add payment method. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = () => {
    return (
      cardNumber.replace(/\s/g, '').length >= 15 &&
      holderName.length > 0 &&
      expiryMonth.length === 2 &&
      expiryYear.length === 2 &&
      cvv.length >= 3 &&
      address1.length > 0 &&
      city.length > 0 &&
      state.length > 0 &&
      postcode.length > 0
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Add Payment Method
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Your card information is encrypted and secure
        </Text>
      </View>

      {/* Card Information */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Card Information
        </Text>

        <Surface style={styles.formCard} elevation={0}>
          <TextInput
            label="Card Number *"
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />

          <TextInput
            label="Cardholder Name *"
            value={holderName}
            onChangeText={setHolderName}
            mode="outlined"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
            placeholder="John Smith"
            autoCapitalize="words"
          />

          <View style={styles.row}>
            <TextInput
              label="MM *"
              value={expiryMonth}
              onChangeText={setExpiryMonth}
              mode="outlined"
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
              outlineColor="#E0E0E0"
              activeOutlineColor={pubmateColors.orange}
              placeholder="12"
              maxLength={2}
            />

            <TextInput
              label="YY *"
              value={expiryYear}
              onChangeText={setExpiryYear}
              mode="outlined"
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
              outlineColor="#E0E0E0"
              activeOutlineColor={pubmateColors.orange}
              placeholder="25"
              maxLength={2}
            />

            <TextInput
              label="CVV *"
              value={cvv}
              onChangeText={setCvv}
              mode="outlined"
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
              outlineColor="#E0E0E0"
              activeOutlineColor={pubmateColors.orange}
              placeholder="123"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </Surface>
      </View>

      {/* Billing Address */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Billing Address
        </Text>

        <Surface style={styles.formCard} elevation={0}>
          <TextInput
            label="Address Line 1 *"
            value={address1}
            onChangeText={setAddress1}
            mode="outlined"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
          />

          <TextInput
            label="Address Line 2"
            value={address2}
            onChangeText={setAddress2}
            mode="outlined"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
          />

          <TextInput
            label="City *"
            value={city}
            onChangeText={setCity}
            mode="outlined"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
          />

          <View style={styles.row}>
            <TextInput
              label="State *"
              value={state}
              onChangeText={setState}
              mode="outlined"
              style={[styles.input, styles.halfInput]}
              outlineColor="#E0E0E0"
              activeOutlineColor={pubmateColors.orange}
              placeholder="NSW"
            />

            <TextInput
              label="Postcode *"
              value={postcode}
              onChangeText={setPostcode}
              mode="outlined"
              keyboardType="numeric"
              style={[styles.input, styles.halfInput]}
              outlineColor="#E0E0E0"
              activeOutlineColor={pubmateColors.orange}
              placeholder="2000"
              maxLength={4}
            />
          </View>
        </Surface>
      </View>

      {/* Make Default Checkbox */}
      <View style={styles.checkboxSection}>
        <Surface style={styles.checkboxCard} elevation={0}>
          <View style={styles.checkboxRow}>
            <Checkbox
              status={makeDefault ? 'checked' : 'unchecked'}
              onPress={() => setMakeDefault(!makeDefault)}
              color={pubmateColors.orange}
            />
            <Text variant="bodyMedium" style={styles.checkboxLabel}>
              Set as default payment method
            </Text>
          </View>
        </Surface>
      </View>

      {/* Security Info */}
      <View style={styles.infoBox}>
        <Text variant="bodySmall" style={styles.infoText}>
          🔒 Your payment information is encrypted and stored securely. We never store your CVV.
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
          disabled={isSaving || !isFormValid()}
          style={styles.saveButton}
        >
          Add Card
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
  },
  section: {
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  checkboxSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  checkboxCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: pubmateColors.darkGreen,
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
  saveButton: {
    flex: 1,
    backgroundColor: pubmateColors.orange,
  },
  bottomPadding: {
    height: 32,
  },
});
