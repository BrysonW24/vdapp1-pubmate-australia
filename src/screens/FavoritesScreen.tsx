import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleFavorite } from '../store/slices/venueSlice';
import VenueService from '../services/VenueService';
import { Venue } from '../types/venue.types';

// Light theme colors
const colors = {
  background: '#F5F5F5',
  white: '#FFFFFF',
  primary: '#F97316',
  primaryLight: '#FFF7ED',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  success: '#10B981',
};

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.venue);

  const [refreshing, setRefreshing] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [favoriteVenues, setFavoriteVenues] = useState<Venue[]>([]);

  useEffect(() => {
    loadVenues();
  }, []);

  useEffect(() => {
    // Filter venues to show only favorites
    setFavoriteVenues(venues.filter((v) => favorites.includes(v.id)));
  }, [venues, favorites]);

  const loadVenues = async () => {
    try {
      const allVenues = await VenueService.getVenues();
      setVenues(allVenues);
    } catch (error) {
      console.error('Error loading venues:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVenues();
    setRefreshing(false);
  };

  const handleVenuePress = (venue: Venue) => {
    navigation.navigate('VenueDetail', { venueId: venue.id });
  };

  const handleFavoritePress = (venueId: string) => {
    dispatch(toggleFavorite(venueId));
  };

  const renderVenueCard = (venue: Venue) => (
    <TouchableOpacity
      key={venue.id}
      style={styles.venueCard}
      onPress={() => handleVenuePress(venue)}
    >
      <Image
        source={{ uri: venue.images?.[0] || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400' }}
        style={styles.venueImage}
      />
      <TouchableOpacity
        style={styles.favoriteBtn}
        onPress={() => handleFavoritePress(venue.id)}
      >
        <Ionicons name="heart" size={20} color={colors.primary} />
      </TouchableOpacity>
      {venue.hasActiveSpecials && (
        <View style={styles.specialBadge}>
          <Text style={styles.specialBadgeText}>
            {venue.activeSpecialsCount || 1} Special{(venue.activeSpecialsCount || 1) > 1 ? 's' : ''}
          </Text>
        </View>
      )}
      <View style={styles.venueContent}>
        <Text style={styles.venueName} numberOfLines={1}>
          {venue.name}
        </Text>
        <View style={styles.venueInfoRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.venueLocation} numberOfLines={1}>
            {venue.suburb || venue.address}
          </Text>
        </View>
        <View style={styles.venueInfoRow}>
          <Ionicons name="star" size={14} color="#FBBF24" />
          <Text style={styles.venueRating}>{venue.rating?.toFixed(1) || '4.5'}</Text>
          <Text style={styles.venueReviews}>({venue.reviewCount || 0} reviews)</Text>
        </View>
        <View style={styles.venueCategories}>
          {venue.categories?.slice(0, 3).map((cat, index) => (
            <View key={index} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{cat}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Pubmate</Text>
              <Text style={styles.headerSubtitle}>Australia</Text>
            </View>
          </View>
        </View>

        {/* Page Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Favorites</Text>
          <Text style={styles.pageSubtitle}>
            {favoriteVenues.length} saved venue{favoriteVenues.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Favorites List */}
        <View style={styles.venuesList}>
          {favoriteVenues.map(renderVenueCard)}
        </View>

        {favoriteVenues.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="heart-outline" size={48} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>
              Tap the heart icon on any venue to save it here for quick access.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreBtnText}>Explore Venues</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitleContainer: {
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    marginLeft: 6,
    opacity: 0.9,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  venuesList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  venueCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  venueImage: {
    width: '100%',
    height: 160,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  specialBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  venueContent: {
    padding: 16,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  venueInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  venueLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  venueRating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  venueReviews: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  venueCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  categoryChip: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  exploreBtn: {
    marginTop: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
