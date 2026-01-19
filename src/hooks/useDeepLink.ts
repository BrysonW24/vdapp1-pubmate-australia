/**
 * useDeepLink Hook
 * React hook for handling deep links in the app
 */

import { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { DeepLinkService } from '../services/DeepLinkService';
import { DeepLinkData } from '../types/deepLink.types';

export function useDeepLink() {
  const navigation = useNavigation();

  const handleDeepLink = useCallback(
    (data: DeepLinkData) => {
      console.log('Deep link received:', data);

      // Add a small delay to ensure navigation is ready
      setTimeout(() => {
        DeepLinkService.navigateFromDeepLink(navigation, data);
      }, 100);
    },
    [navigation]
  );

  useEffect(() => {
    // Initialize deep linking
    const cleanup = DeepLinkService.initialize(handleDeepLink);

    // Cleanup on unmount
    return cleanup;
  }, [handleDeepLink]);

  return {
    shareVenue: DeepLinkService.shareVenue,
    shareEvent: DeepLinkService.shareEvent,
    shareSpecial: DeepLinkService.shareSpecial,
    shareReferral: DeepLinkService.shareReferral,
    openPhone: DeepLinkService.openPhone,
    openEmail: DeepLinkService.openEmail,
    openMaps: DeepLinkService.openMaps,
    openExternalURL: DeepLinkService.openExternalURL,
  };
}
