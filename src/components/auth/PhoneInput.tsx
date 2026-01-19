import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';
import parsePhoneNumber, { AsYouType } from 'libphonenumber-js';
import { pubmateColors } from '../../theme';

interface PhoneInputProps {
    value: string;
    countryCode: string;
    onChangeText: (text: string) => void;
    onCountrySelect: (country: Country) => void;
    error?: string;
    label?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
    value,
    countryCode,
    onChangeText,
    onCountrySelect,
    error,
    label = 'Mobile Number',
}) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleTextChange = (text: string) => {
        // Only allow numbers
        const cleaned = text.replace(/[^0-9]/g, '');
        onChangeText(cleaned);
    };

    const formattedNumber = new AsYouType(countryCode as any).input(value);

    return (
        <View style={styles.container}>
            {label && <Text variant="bodyMedium" style={styles.label}>{label}</Text>}

            <View style={styles.inputContainer}>
                <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    style={styles.countryPickerButton}
                >
                    <CountryPicker
                        countryCode={countryCode as CountryCode}
                        visible={showPicker}
                        onSelect={(country) => {
                            onCountrySelect(country);
                            setShowPicker(false);
                        }}
                        onClose={() => setShowPicker(false)}
                        withFilter
                        withFlag
                        withCallingCode
                        withCallingCodeButton
                        containerButtonStyle={styles.countryPickerInner}
                    />
                </TouchableOpacity>

                <TextInput
                    mode="outlined"
                    value={value}
                    onChangeText={handleTextChange}
                    placeholder="000 000 000"
                    keyboardType="phone-pad"
                    style={styles.input}
                    outlineColor={error ? '#D32F2F' : '#E0E0E0'}
                    activeOutlineColor={pubmateColors.orange}
                    error={!!error}
                />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        marginBottom: 8,
        color: '#333',
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countryPickerButton: {
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        backgroundColor: '#FAFAFA',
        marginTop: 6, // Align with outlined TextInput
    },
    countryPickerInner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});

export default PhoneInput;
