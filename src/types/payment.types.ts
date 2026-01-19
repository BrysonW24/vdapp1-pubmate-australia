export type PaymentMethodType = 'card' | 'digital_wallet' | 'bank_account';

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;

  // Card details
  cardBrand?: CardBrand;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  holderName?: string;

  // Digital wallet
  walletProvider?: string; // 'apple_pay', 'google_pay', etc.

  // Bank account
  accountLast4?: string;
  bankName?: string;

  // Common
  isDefault: boolean;
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };

  // Meta
  createdAt: string;
  updatedAt: string;
}

export type CreditTransactionType =
  | 'signup_bonus'
  | 'referral_bonus'
  | 'purchase'
  | 'redemption'
  | 'refund'
  | 'expiration'
  | 'admin_adjustment';

export type CreditTransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface CreditTransaction {
  id: string;
  type: CreditTransactionType;
  status: CreditTransactionStatus;

  // Amount (positive = credit, negative = debit)
  amount: number;
  balanceBefore: number;
  balanceAfter: number;

  // Details
  description: string;
  venueId?: string;
  venueName?: string;
  orderId?: string;
  referralUserId?: string;
  referralUserName?: string;

  // Meta
  createdAt: string;
  completedAt?: string;
  expiresAt?: string; // For credits with expiration

  // Receipt/proof
  receiptUrl?: string;
}

export interface CreditBalance {
  totalCredits: number;
  availableCredits: number;
  pendingCredits: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  expiringAmount?: number; // Amount expiring soon
  expiringDate?: string; // When credits expire
}

export interface SignupBonus {
  id: string;
  amount: number;
  status: 'pending' | 'active' | 'redeemed' | 'expired';
  grantedAt: string;
  expiresAt: string;
  redeemedAt?: string;
  redeemedVenueId?: string;
  redeemedVenueName?: string;
}

export interface Referral {
  id: string;
  code: string;
  referredUserId?: string;
  referredUserName?: string;
  status: 'pending' | 'completed' | 'expired';
  bonusAmount: number;
  bonusGranted: boolean;
  createdAt: string;
  completedAt?: string;
}

// Payment provider configurations
export const SUPPORTED_CARD_BRANDS: { id: CardBrand; label: string }[] = [
  { id: 'visa', label: 'Visa' },
  { id: 'mastercard', label: 'Mastercard' },
  { id: 'amex', label: 'American Express' },
  { id: 'discover', label: 'Discover' },
];

// Credit transaction display helpers
export const TRANSACTION_TYPE_LABELS: Record<CreditTransactionType, string> = {
  signup_bonus: 'Welcome Bonus',
  referral_bonus: 'Referral Bonus',
  purchase: 'Purchase',
  redemption: 'Redeemed at Venue',
  refund: 'Refund',
  expiration: 'Credit Expired',
  admin_adjustment: 'Adjustment',
};

export const TRANSACTION_TYPE_ICONS: Record<CreditTransactionType, string> = {
  signup_bonus: 'gift',
  referral_bonus: 'account-multiple',
  purchase: 'cart',
  redemption: 'cash-check',
  refund: 'cash-refund',
  expiration: 'clock-alert',
  admin_adjustment: 'cog',
};
