import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean; // Actual current theme (resolved from auto)
}

const initialState: ThemeState = {
  mode: 'auto',
  isDark: false, // Will be set based on system preference
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    setIsDark: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
    },
    toggleTheme: (state) => {
      if (state.mode === 'auto') {
        state.mode = state.isDark ? 'light' : 'dark';
      } else {
        state.mode = state.mode === 'light' ? 'dark' : 'light';
      }
      state.isDark = state.mode === 'dark';
    },
  },
});

export const { setThemeMode, setIsDark, toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
