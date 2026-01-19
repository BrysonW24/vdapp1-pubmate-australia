/**
 * Auth Slice
 * Redux state management for authentication
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AuthService from '../../services/auth/AuthService';
import PhoneAuthService from '../../services/auth/PhoneAuthService';
import SocialAuthService from '../../services/auth/SocialAuthService';
import {
  AuthState,
  AuthUser,
  SignupCredentials,
  LoginCredentials,
  OnboardingStep,
  OnboardingData,
  PhoneAuthCredentials,
  PhoneVerificationData,
  ResetPasswordRequest,
  AuthProvider,
} from '../../types/auth.types';

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  onboardingStep: 'welcome',
  onboardingData: {},
};

// Async thunks
export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async (credentials: SignupCredentials, { rejectWithValue }) => {
    try {
      const user = await AuthService.signUpWithEmail(credentials);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const user = await AuthService.signInWithEmail(credentials);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithApple = createAsyncThunk(
  'auth/signInWithApple',
  async (_, { rejectWithValue }) => {
    try {
      const result = await SocialAuthService.signInWithApple();
      return result.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const result = await SocialAuthService.signInWithGoogle();
      return result.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithFacebook = createAsyncThunk(
  'auth/signInWithFacebook',
  async (_, { rejectWithValue }) => {
    try {
      const result = await SocialAuthService.signInWithFacebook();
      return result.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendPhoneVerification = createAsyncThunk(
  'auth/sendPhoneVerification',
  async (credentials: PhoneAuthCredentials, { rejectWithValue }) => {
    try {
      const verificationId = await PhoneAuthService.sendVerificationCode(credentials);
      return { verificationId, phoneNumber: credentials.phoneNumber };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyPhoneCode = createAsyncThunk(
  'auth/verifyPhoneCode',
  async (verificationData: PhoneVerificationData, { rejectWithValue }) => {
    try {
      await PhoneAuthService.verifyCode(verificationData);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  try {
    await AuthService.signOut();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (request: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      await AuthService.resetPassword(request);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeOnboarding = createAsyncThunk(
  'auth/completeOnboarding',
  async (onboardingData: OnboardingData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const userId = state.auth.user?.uid;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      await AuthService.updateUserProfile(userId, onboardingData);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setOnboardingStep: (state, action: PayloadAction<OnboardingStep>) => {
      state.onboardingStep = action.payload;
    },
    updateOnboardingData: (state, action: PayloadAction<Partial<OnboardingData>>) => {
      state.onboardingData = {
        ...state.onboardingData,
        ...action.payload,
      };
    },
    resetOnboarding: (state) => {
      state.onboardingStep = 'welcome';
      state.onboardingData = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Sign up with email
    builder
      .addCase(signUpWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.onboardingStep = 'age-verification';
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign in with email
    builder
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Social sign-in (Apple, Google, Facebook)
    const handleSocialSignIn = (builder: any, action: any) => {
      builder
        .addCase(action.pending, (state: AuthState) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(action.fulfilled, (state: AuthState, actionResult: PayloadAction<AuthUser>) => {
          state.isLoading = false;
          state.user = actionResult.payload;
          state.isAuthenticated = true;
          // TEMP: Skip onboarding for mock auth testing
          state.onboardingStep = 'complete';
        })
        .addCase(action.rejected, (state: AuthState, actionResult: any) => {
          state.isLoading = false;
          state.error = actionResult.payload as string;
        });
    };

    handleSocialSignIn(builder, signInWithApple);
    handleSocialSignIn(builder, signInWithGoogle);
    handleSocialSignIn(builder, signInWithFacebook);

    // Phone verification
    builder
      .addCase(sendPhoneVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendPhoneVerification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.onboardingData.phone = action.payload.phoneNumber;
        state.onboardingStep = 'phone-verification';
      })
      .addCase(sendPhoneVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(verifyPhoneCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPhoneCode.fulfilled, (state) => {
        state.isLoading = false;
        state.onboardingStep = 'profile';
      })
      .addCase(verifyPhoneCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.onboardingStep = 'welcome';
        state.onboardingData = {};
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Complete onboarding
    builder
      .addCase(completeOnboarding.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeOnboarding.fulfilled, (state) => {
        state.isLoading = false;
        state.onboardingStep = 'complete';
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUser,
  setOnboardingStep,
  updateOnboardingData,
  resetOnboarding,
  clearError,
  setError,
} = authSlice.actions;

export default authSlice.reducer;
