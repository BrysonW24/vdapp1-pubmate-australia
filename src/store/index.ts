import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import venueReducer from './slices/venueSlice';
import eventReducer from './slices/eventSlice';
import reviewReducer from './slices/reviewSlice';
import paymentReducer from './slices/paymentSlice';
import themeReducer from './slices/themeSlice';
import venueOwnerReducer from './slices/venueOwnerSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    venue: venueReducer,
    event: eventReducer,
    review: reviewReducer,
    payment: paymentReducer,
    theme: themeReducer,
    venueOwner: venueOwnerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
