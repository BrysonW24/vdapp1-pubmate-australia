import { MD3LightTheme } from 'react-native-paper';
import { pubmateColors } from './index';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: pubmateColors.orange,
    secondary: pubmateColors.darkGreen,
    tertiary: pubmateColors.cream,
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    surfaceDisabled: '#E0E0E0',
    error: '#B00020',
    errorContainer: '#F9DEDC',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#1A1A1A',
    onSurface: '#1A1A1A',
    onSurfaceVariant: '#666666',
    onError: '#FFFFFF',
    outline: '#E0E0E0',
    outlineVariant: '#F5F5F5',
    inverseSurface: '#1A1A1A',
    inverseOnSurface: '#FFFFFF',
    inversePrimary: pubmateColors.orange,
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(0, 0, 0, 0.4)',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F8F8F8',
      level3: '#F5F5F5',
      level4: '#F2F2F2',
      level5: '#F0F0F0',
    },
  },
  dark: false,
};

export const lightColors = {
  // Brand colors
  orange: pubmateColors.orange,
  darkGreen: pubmateColors.darkGreen,
  cream: pubmateColors.cream,
  charcoal: pubmateColors.charcoal,

  // Backgrounds
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  card: '#FFFFFF',

  // Text
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',

  // Borders
  border: '#E0E0E0',
  divider: '#F0F0F0',

  // Status
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#B00020',
  info: '#2196F3',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.4)',
  ripple: 'rgba(0, 0, 0, 0.12)',

  // Special states
  disabled: '#E0E0E0',
  placeholder: '#999999',
  backdrop: 'rgba(0, 0, 0, 0.4)',
};
