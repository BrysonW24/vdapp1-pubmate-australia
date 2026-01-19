import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isLoading: boolean;
  isOnline: boolean;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  error: string | null;
}

const initialState: AppState = {
  isLoading: false,
  isOnline: true,
  currentLocation: null,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setCurrentLocation: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number } | null>
    ) => {
      state.currentLocation = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setOnline,
  setCurrentLocation,
  setError,
  clearError,
} = appSlice.actions;

export default appSlice.reducer;
