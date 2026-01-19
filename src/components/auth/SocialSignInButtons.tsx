import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../store';
import {
    signInWithApple,
    signInWithGoogle,
    signInWithFacebook
} from '../../store/slices/authSlice';

interface SocialSignInButtonsProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

const SocialSignInButtons: React.FC<SocialSignInButtonsProps> = ({ onSuccess, onError }) => {
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.auth);

    const handleAppleSignIn = async () => {
        try {
            await dispatch(signInWithApple()).unwrap();
            onSuccess?.();
        } catch (error: any) {
            onError?.(error.message || 'Apple Sign In failed');
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await dispatch(signInWithGoogle()).unwrap();
            onSuccess?.();
        } catch (error: any) {
            onError?.(error.message || 'Google Sign In failed');
        }
    };

    const handleFacebookSignIn = async () => {
        try {
            await dispatch(signInWithFacebook()).unwrap();
            onSuccess?.();
        } catch (error: any) {
            onError?.(error.message || 'Facebook Sign In failed');
        }
    };

    return (
        <View style={styles.container}>
            {Platform.OS === 'ios' && (
                <Button
                    mode="contained"
                    onPress={handleAppleSignIn}
                    icon="apple"
                    style={[styles.button, styles.appleButton]}
                    contentStyle={styles.buttonContent}
                    disabled={isLoading}
                    labelStyle={styles.appleLabel}
                >
                    Continue with Apple
                </Button>
            )}

            <Button
                mode="outlined"
                onPress={handleGoogleSignIn}
                icon="google"
                style={[styles.button, styles.googleButton]}
                contentStyle={styles.buttonContent}
                disabled={isLoading}
                textColor="#000"
            >
                Continue with Google
            </Button>

            <Button
                mode="contained"
                onPress={handleFacebookSignIn}
                icon="facebook"
                style={[styles.button, styles.facebookButton]}
                contentStyle={styles.buttonContent}
                disabled={isLoading}
            >
                Continue with Facebook
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 12,
        width: '100%',
    },
    button: {
        borderRadius: 8,
    },
    buttonContent: {
        height: 48,
    },
    appleButton: {
        backgroundColor: '#000000',
    },
    appleLabel: {
        color: '#FFFFFF',
    },
    googleButton: {
        borderColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
    },
    facebookButton: {
        backgroundColor: '#1877F2',
    },
});

export default SocialSignInButtons;
