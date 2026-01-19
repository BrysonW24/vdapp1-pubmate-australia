import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Surface, IconButton, Button, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../store';
import { deleteSavedSearch, loadSavedSearch } from '../../store/slices/venueSlice';
import { pubmateColors } from '../../theme';

export default function SavedSearchesScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { savedSearches } = useAppSelector((state) => state.venue);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getFilterSummary = (search: any) => {
    const parts = [];

    if (search.filters.sortBy) {
      parts.push(`Sorted by ${search.filters.sortBy}`);
    }
    if (search.filters.distance) {
      parts.push(`Within ${search.filters.distance}km`);
    }
    if (search.filters.minRating && search.filters.minRating > 1) {
      parts.push(`${search.filters.minRating}+ stars`);
    }
    if (search.filters.openNow) {
      parts.push('Open now');
    }
    if (search.filters.hasSpecials) {
      parts.push('Has specials');
    }
    if (search.filters.insiderPicksOnly) {
      parts.push('Insider picks');
    }
    if (search.filters.amenities && search.filters.amenities.length > 0) {
      parts.push(`${search.filters.amenities.length} amenities`);
    }

    return parts.join(' • ');
  };

  const handleLoadSearch = (searchId: string) => {
    dispatch(loadSavedSearch(searchId));
    navigation.navigate('Search' as never);
  };

  const handleDeleteSearch = (searchId: string, searchName: string) => {
    Alert.alert(
      'Delete Saved Search',
      `Are you sure you want to delete "${searchName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteSavedSearch(searchId)),
        },
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconButton icon="bookmark-outline" size={64} iconColor="#ccc" />
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No Saved Searches
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        Save your favorite search filters to quickly find venues that match your preferences
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Search' as never)}
        style={styles.searchButton}
        buttonColor={pubmateColors.orange}
      >
        Start Searching
      </Button>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {savedSearches.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.headerText}>
              {savedSearches.length} {savedSearches.length === 1 ? 'Search' : 'Searches'}
            </Text>
          </View>

          {savedSearches.map((search, index) => (
            <React.Fragment key={search.id}>
              <Surface style={styles.searchCard} elevation={0}>
                <View style={styles.searchHeader}>
                  <View style={styles.searchInfo}>
                    <Text variant="titleMedium" style={styles.searchName}>
                      {search.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.searchDate}>
                      Saved {formatDate(search.createdAt)}
                    </Text>
                  </View>
                  <IconButton
                    icon="delete-outline"
                    size={20}
                    onPress={() => handleDeleteSearch(search.id, search.name)}
                    iconColor="#999"
                  />
                </View>

                <Text variant="bodySmall" style={styles.filterSummary}>
                  {getFilterSummary(search)}
                </Text>

                {search.resultCount !== undefined && (
                  <Text variant="bodySmall" style={styles.resultCount}>
                    {search.resultCount} results
                  </Text>
                )}

                <Button
                  mode="outlined"
                  onPress={() => handleLoadSearch(search.id)}
                  style={styles.loadButton}
                  icon="magnify"
                >
                  Use This Search
                </Button>
              </Surface>

              {index < savedSearches.length - 1 && <Divider style={styles.divider} />}
            </React.Fragment>
          ))}
        </>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontWeight: '600',
    color: pubmateColors.charcoal,
  },
  searchCard: {
    backgroundColor: '#fff',
    padding: 16,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  searchInfo: {
    flex: 1,
  },
  searchName: {
    fontWeight: '600',
    color: pubmateColors.charcoal,
    marginBottom: 4,
  },
  searchDate: {
    color: '#999',
  },
  filterSummary: {
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  resultCount: {
    color: pubmateColors.orange,
    fontWeight: '600',
    marginBottom: 12,
  },
  loadButton: {
    borderColor: pubmateColors.orange,
  },
  divider: {
    backgroundColor: '#E0E0E0',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    color: pubmateColors.charcoal,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  searchButton: {
    paddingHorizontal: 24,
  },
  bottomPadding: {
    height: 32,
  },
});
