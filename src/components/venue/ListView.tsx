import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { VenueListItem } from '../../types/venue.types';
import VenueCard from './VenueCard';

interface VenueListViewProps {
  venues: VenueListItem[];
  isLoading: boolean;
  onVenuePress: (venueId: string) => void;
  onFavoritePress: (venueId: string) => void;
  onRefresh?: () => void;
  onEndReached?: () => void;
}

export default function VenueListView({
  venues,
  isLoading,
  onVenuePress,
  onFavoritePress,
  onRefresh,
  onEndReached,
}: VenueListViewProps) {
  if (isLoading && venues.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading venues...</Text>
      </View>
    );
  }

  if (!isLoading && venues.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          No venues found
        </Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          Try adjusting your filters or search in a different area
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={venues}
      renderItem={({ item }) => (
        <VenueCard venue={item} onPress={onVenuePress} onFavoritePress={onFavoritePress} />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      onRefresh={onRefresh}
      refreshing={isLoading}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
});
