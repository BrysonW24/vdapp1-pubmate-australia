import { Share, Platform } from 'react-native';

export interface ShareContent {
  title: string;
  message: string;
  url?: string;
}

/**
 * Share content using native share sheet
 */
export const shareContent = async (content: ShareContent): Promise<boolean> => {
  try {
    const result = await Share.share({
      title: content.title,
      message: Platform.OS === 'ios'
        ? content.message
        : `${content.message}${content.url ? '\n' + content.url : ''}`,
      url: Platform.OS === 'ios' ? content.url : undefined,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared with activity type (iOS)
        console.log('Shared with:', result.activityType);
      } else {
        // Shared (Android)
        console.log('Shared successfully');
      }
      return true;
    } else if (result.action === Share.dismissedAction) {
      // Dismissed
      console.log('Share dismissed');
      return false;
    }

    return false;
  } catch (error) {
    console.error('Error sharing:', error);
    return false;
  }
};

/**
 * Share a venue
 */
export const shareVenue = (venueName: string, address: string, rating?: number) => {
  const ratingText = rating ? ` (${rating}/7 stars)` : '';
  return shareContent({
    title: `Check out ${venueName}`,
    message: `I found this great venue on PubMate: ${venueName}${ratingText}\n${address}\n\nDownload PubMate to discover more venues!`,
    url: `https://pubmate.com.au/venue/${encodeURIComponent(venueName)}`,
  });
};

/**
 * Share an event
 */
export const shareEvent = (
  eventName: string,
  venueName: string,
  date: string,
  time: string
) => {
  return shareContent({
    title: `Join me at ${eventName}`,
    message: `I'm going to this event on PubMate!\n\n${eventName}\n📍 ${venueName}\n📅 ${date} at ${time}\n\nDownload PubMate to see more events!`,
    url: `https://pubmate.com.au/event/${encodeURIComponent(eventName)}`,
  });
};

/**
 * Share a special/deal
 */
export const shareSpecial = (
  specialName: string,
  venueName: string,
  description: string,
  days: string
) => {
  return shareContent({
    title: `Great deal at ${venueName}`,
    message: `Check out this deal I found on PubMate!\n\n${specialName}\n${description}\n\n📍 ${venueName}\n📅 ${days}\n\nDownload PubMate to find more deals!`,
    url: `https://pubmate.com.au/venue/${encodeURIComponent(venueName)}`,
  });
};

/**
 * Share referral code
 */
export const shareReferral = (referralCode: string, userName: string) => {
  return shareContent({
    title: 'Join me on PubMate!',
    message: `${userName} invited you to join PubMate!\n\nUse code ${referralCode} to get $10 credit when you sign up.\n\nFind the best pubs, bars, and specials in Australia!`,
    url: `https://pubmate.com.au/invite/${referralCode}`,
  });
};

/**
 * Share app download link
 */
export const shareApp = () => {
  return shareContent({
    title: 'Download PubMate',
    message: 'Discover the best pubs, bars, and specials in Australia with PubMate!',
    url: 'https://pubmate.com.au/download',
  });
};
