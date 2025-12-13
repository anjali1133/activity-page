import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const palette = {
  primary: '#2563eb',
  secondary: '#0ea5e9',
  accent: '#f59e0b',
  background: '#f1f5f9',
  surface: '#f8fafc',
  border: '#e2e8f0',
  muted: '#475569',
  chip: '#e5e7eb',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    secondary: palette.secondary,
    tertiary: palette.accent,
    surface: palette.surface,
    background: palette.background,
    outline: palette.border,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: palette.primary,
    secondary: palette.secondary,
    tertiary: palette.accent,
    surface: '#0f172a',
    background: '#0b1220',
    outline: '#1f2937',
  },
};
