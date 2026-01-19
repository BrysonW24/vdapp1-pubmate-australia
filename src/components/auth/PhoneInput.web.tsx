import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { pubmateColors } from '../../theme';

interface PhoneInputProps {
    value: string;
    countryCode: string;
    onChangeText: (text: string) => void;
    onCountrySelect: (country: any) => void;
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
    const handleTextChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        onChangeText(cleaned);
    };

    return (
        <View style={styles.container}>
            {label && <Text variant="bodyMedium" style={styles.label}>{label}</Text>}

            <View style={styles.inputContainer}>
                <View style={styles.webCountryCode}>
                    <Text style={{ fontSize: 16 }}>🇦🇺 +61</Text>
                </View>

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

            <Text style={styles.webHint}>Country picker is disabled on web for stability. Defaulting to AU (+61).</Text>
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
    webCountryCode: {
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        backgroundColor: '#FAFAFA',
        marginTop: 6,
    },
    input: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
    },
    webHint: {
        fontSize: 10,
        color: '#999',
        marginTop: 4,
        fontStyle: 'italic',
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});

export default PhoneInput;
