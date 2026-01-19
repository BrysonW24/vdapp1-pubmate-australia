import React from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';

interface ResponsiveContainerProps {
    children: React.ReactNode;
    maxWidth?: number;
}

/**
 * Responsive container that centers content on larger screens
 * and provides full-width on mobile
 */
export default function ResponsiveContainer({
    children,
    maxWidth = 1200
}: ResponsiveContainerProps) {
    const { width } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';
    const isLargeScreen = width > 768;

    return (
        <View style={[
            styles.container,
            isWeb && isLargeScreen && {
                maxWidth,
                alignSelf: 'center',
                width: '100%',
            }
        ]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
