import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PaymentMethod,
  CreditTransaction,
  CreditBalance,
  SignupBonus,
  Referral,
} from '../../types/payment.types';

interface PaymentState {
  // Payment Methods
  paymentMethods: PaymentMethod[];
  defaultPaymentMethodId: string | null;

  // Credits
  creditBalance: CreditBalance;
  creditTransactions: CreditTransaction[];
  signupBonus: SignupBonus | null;
  referrals: Referral[];
  referralCode: string | null;

  // UI State
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  paymentMethods: [],
  defaultPaymentMethodId: null,
  creditBalance: {
    totalCredits: 10.0, // $10 signup bonus
    availableCredits: 10.0,
    pendingCredits: 0,
    lifetimeEarned: 10.0,
    lifetimeSpent: 0,
  },
  creditTransactions: [],
  signupBonus: {
    id: 'signup_1',
    amount: 10.0,
    status: 'active',
    grantedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
  },
  referrals: [],
  referralCode: null,
  isLoading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // Payment Methods
    setPaymentMethods: (state, action: PayloadAction<PaymentMethod[]>) => {
      state.paymentMethods = action.payload;
    },
    addPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethods.push(action.payload);
      // If it's the first payment method, make it default
      if (state.paymentMethods.length === 1) {
        state.defaultPaymentMethodId = action.payload.id;
      }
    },
    removePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethods = state.paymentMethods.filter(pm => pm.id !== action.payload);
      // If removed method was default, clear default
      if (state.defaultPaymentMethodId === action.payload) {
        state.defaultPaymentMethodId = state.paymentMethods[0]?.id || null;
      }
    },
    setDefaultPaymentMethod: (state, action: PayloadAction<string>) => {
      const methodId = action.payload;
      // Update isDefault flag
      state.paymentMethods = state.paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === methodId,
      }));
      state.defaultPaymentMethodId = methodId;
    },
    updatePaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      const index = state.paymentMethods.findIndex(pm => pm.id === action.payload.id);
      if (index !== -1) {
        state.paymentMethods[index] = action.payload;
      }
    },

    // Credits
    setCreditBalance: (state, action: PayloadAction<CreditBalance>) => {
      state.creditBalance = action.payload;
    },
    addCreditTransaction: (state, action: PayloadAction<CreditTransaction>) => {
      state.creditTransactions.unshift(action.payload);
      // Update balance
      state.creditBalance.totalCredits = action.payload.balanceAfter;
      state.creditBalance.availableCredits = action.payload.balanceAfter;

    },
    setCreditTransactions: (state, action: PayloadAction<CreditTransaction[]>) => {
      state.creditTransactions = action.payload;
    },

    // Redeem credit
    redeemCredit: (state, action: PayloadAction<{ amount: number; venueId: string; venueName: string }>) => {
      const { amount, venueId, venueName } = action.payload;

      // Create transaction
      const transaction: CreditTransaction = {
        id: `txn_${Date.now()}`,
        type: 'redemption',
        status: 'completed',
        amount: -amount,
        balanceBefore: state.creditBalance.availableCredits,
        balanceAfter: state.creditBalance.availableCredits - amount,
        description: `Redeemed at ${venueName}`,
        venueId,
        venueName,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };

      state.creditTransactions.unshift(transaction);

      // Update balance
      state.creditBalance.availableCredits -= amount;
      state.creditBalance.totalCredits -= amount;
      state.creditBalance.lifetimeSpent += amount;

      // Mark signup bonus as redeemed if applicable
      if (state.signupBonus && state.signupBonus.status === 'active') {
        state.signupBonus.status = 'redeemed';
        state.signupBonus.redeemedAt = new Date().toISOString();
        state.signupBonus.redeemedVenueId = venueId;
        state.signupBonus.redeemedVenueName = venueName;
      }
    },

    // Signup Bonus
    setSignupBonus: (state, action: PayloadAction<SignupBonus>) => {
      state.signupBonus = action.payload;
    },
    grantSignupBonus: (state) => {
      if (state.signupBonus) {
        const transaction: CreditTransaction = {
          id: `txn_${Date.now()}`,
          type: 'signup_bonus',
          status: 'completed',
          amount: state.signupBonus.amount,
          balanceBefore: 0,
          balanceAfter: state.signupBonus.amount,
          description: 'Welcome to PubMate! Enjoy $10 on us',
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        };

        state.creditTransactions.unshift(transaction);
        state.creditBalance.totalCredits = state.signupBonus.amount;
        state.creditBalance.availableCredits = state.signupBonus.amount;
        state.creditBalance.lifetimeEarned = state.signupBonus.amount;
        state.signupBonus.status = 'active';
      }
    },

    // Referrals
    setReferralCode: (state, action: PayloadAction<string>) => {
      state.referralCode = action.payload;
    },
    addReferral: (state, action: PayloadAction<Referral>) => {
      state.referrals.push(action.payload);
    },
    completeReferral: (state, action: PayloadAction<{ referralId: string; bonusAmount: number }>) => {
      const { referralId, bonusAmount } = action.payload;
      const referral = state.referrals.find(r => r.id === referralId);

      if (referral && !referral.bonusGranted) {
        referral.status = 'completed';
        referral.completedAt = new Date().toISOString();
        referral.bonusGranted = true;

        // Add bonus to balance
        const transaction: CreditTransaction = {
          id: `txn_${Date.now()}`,
          type: 'referral_bonus',
          status: 'completed',
          amount: bonusAmount,
          balanceBefore: state.creditBalance.availableCredits,
          balanceAfter: state.creditBalance.availableCredits + bonusAmount,
          description: `Referral bonus for inviting ${referral.referredUserName}`,
          referralUserId: referral.referredUserId,
          referralUserName: referral.referredUserName,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        };

        state.creditTransactions.unshift(transaction);
        state.creditBalance.availableCredits += bonusAmount;
        state.creditBalance.totalCredits += bonusAmount;
        state.creditBalance.lifetimeEarned += bonusAmount;
      }
    },

    // UI State
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  updatePaymentMethod,
  setCreditBalance,
  addCreditTransaction,
  setCreditTransactions,
  redeemCredit,
  setSignupBonus,
  grantSignupBonus,
  setReferralCode,
  addReferral,
  completeReferral,
  setLoading,
  setError,
} = paymentSlice.actions;

export default paymentSlice.reducer;
