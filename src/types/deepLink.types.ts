/**
 * Deep Link Types
 * Types for deep linking and URL handling
 */

export type DeepLinkType =
  | 'venue'
  | 'event'
  | 'special'
  | 'review'
  | 'user'
  | 'search'
  | 'referral'
  | 'unknown';

export interface DeepLinkData {
  type: DeepLinkType;
  id?: string;
  params?: { [key: string]: string };
  rawUrl: string;
}

export interface ShareOptions {
  title: string;
  message: string;
  url: string;
  subject?: string; // For email
}

export interface DeepLinkConfig {
  scheme: string; // e.g., 'pubmate://'
  domain: string; // e.g., 'pubmate.app'
  universalLinkDomain?: string; // e.g., 'https://pubmate.app'
}
