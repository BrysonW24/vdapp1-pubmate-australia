import React from 'react';
import { View, StyleSheet, ScrollView, Image, Linking, Platform } from 'react-native';
import { Text, Button, IconButton, Chip, Divider, Surface } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../store';
import { voteOnReview, reportReview } from '../../store/slices/reviewSlice';
import { toggleFavorite } from '../../store/slices/venueSlice';
import { StarRating, ReviewCard } from '../../components/review';
import { ReviewRating } from '../../types/review.types';
import { shareVenue } from '../../utils/shareUtils';
import { pubmateColors } from '../../theme';
import { MOCK_VENUES } from '../../services/VenueService';

export default function VenueDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const { id: venueId = '1' } = (route.params as { id?: string }) || {};

  const reviews = useAppSelector((state) => state.review.reviewsByVenue[venueId] || []);
  const { favorites } = useAppSelector((state) => state.venue);
  const isFavorite = favorites.includes(venueId);

  // Find venue from service
  const venueData = MOCK_VENUES.find(v => v.id === venueId);

  // Fallback if not found
  const venue = venueData ? {
    ...venueData,
    isFavorite, // Override with Redux state
  } : {
    id: '1',
    name: 'Establishment',
    imageUrl: 'https://via.placeholder.com/400x300',
    images: [],
    rating: 4,
    address: '252 George St, Sydney',
    phone: '',
    email: '',
    website: '',
    specialsCount: 1,
    isInsiderPick: false,
    isFavorite: isFavorite,
    categories: ['Pub'],
    latitude: -33.8688,
    longitude: 151.2093,
    suburb: 'Sydney',
    city: 'Sydney',
    postcode: '2000'
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pool Tables': return 'billiards';
      case 'Sports Bar': return 'trophy';
      case 'Live Music': return 'guitar-electric';
      case 'Beer Garden': return 'tree';
      case 'Rooftop Bar': return 'weather-sunny';
      case 'Darts': return 'bullseye-arrow';
      case 'Cocktail Bar': return 'glass-cocktail';
      case 'Pizza': return 'pizza';
      default: return 'glass-mug-variant';
    }
  };

  // Mock special for display
  const special = {
    title: 'Happy Hour',
    description: '$7.50 schooners & $10 pints of select house beers. $7.50 house sprits, $7.50 house wine.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '17:00',
    endTime: '19:00',
    addedDate: '09/12/2025',
  };

  const handleShare = () => {
    shareVenue(venue.name, venue.address, venue.rating);
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(venue.id));
  };

  const handleGetDirections = () => {
    const scheme = Platform.select({ ios: 'maps:', android: 'geo:' });
    const latLng = venue.latitude && venue.longitude ? `${venue.latitude},${venue.longitude}` : '';
    const label = encodeURIComponent(venue.name);

    let url = '';
    if (Platform.OS === 'web') {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`;
    } else {
      url = Platform.select({
        ios: `${scheme}?q=${label}&ll=${latLng}`,
        android: `${scheme}0,0?q=${latLng}(${label})`,
      }) || '';
    }

    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: venue.imageUrl }} style={styles.mainImage} />
          <View style={styles.imageOverlay}>
            <IconButton
              icon="arrow-left"
              iconColor="#fff"
              size={24}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            <View style={styles.imageActions}>
              <IconButton
                icon="map-marker-radius"
                iconColor="#fff"
                size={24}
                style={styles.actionButton}
                onPress={handleGetDirections}
              />
              <IconButton
                icon="share-variant"
                iconColor="#fff"
                size={24}
                style={styles.actionButton}
                onPress={handleShare}
              />
              <IconButton
                icon={venue.isFavorite ? 'heart' : 'heart-outline'}
                iconColor={venue.isFavorite ? pubmateColors.orange : "#fff"}
                size={24}
                style={styles.actionButton}
                onPress={handleToggleFavorite}
              />
            </View>
          </View>
          <View style={styles.imageIndicator}>
            <Text style={styles.imageIndicatorText}>1/1</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <Text variant="headlineMedium" style={[styles.venueName, { flex: 1, marginBottom: 0 }]}>
              {venue.name}
            </Text>
            <Button
              mode="contained-tonal"
              icon="directions"
              buttonColor="#FFE0B2"
              textColor={pubmateColors.orange}
              compact
              onPress={handleGetDirections}
            >
              Go
            </Button>
          </View>

          {/* Categories / Features */}
          <View style={styles.featuresContainer}>
            {venue.categories?.map((cat: string) => (
              <Chip
                key={cat}
                style={styles.featureChip}
                textStyle={styles.featureText}
                icon={getCategoryIcon(cat)}
              >
                {cat}
              </Chip>
            ))}
          </View>

          {/* Specials Section */}
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Food & drink specials
            </Text>

            <View style={styles.specialCard}>
              <View style={styles.specialHeader}>
                <Text variant="titleMedium" style={styles.specialTitle}>
                  Happy Hour!
                </Text>
              </View>

              <Text variant="titleMedium" style={styles.specialName}>
                {special.title}
              </Text>
              <Text variant="bodyMedium" style={styles.specialDescription}>
                {special.description}
              </Text>

              <Text variant="labelMedium" style={styles.availableLabel}>
                Available on:
              </Text>
              <View style={styles.daysContainer}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <View
                    key={day}
                    style={[
                      styles.dayCircle,
                      index < special.availableDays.length && styles.dayCircleActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        index < special.availableDays.length && styles.dayTextActive,
                      ]}
                    >
                      {day.charAt(0)}
                    </Text>
                  </View>
                ))}
              </View>

              <Text variant="bodyMedium" style={styles.timeText}>
                {special.startTime} - {special.endTime}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* About Section */}
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>About</Text>
            <Text variant="bodyMedium" style={styles.description}>
              {(venue as any).description || "A great local venue."}
            </Text>
            <View style={styles.infoRow}>
              <IconButton icon="map-marker" size={20} />
              <Text variant="bodyMedium" style={styles.infoText}>{venue.address}, {venue.suburb}</Text>
            </View>
            <View style={styles.infoRow}>
              <IconButton icon="phone" size={20} />
              <Text variant="bodyMedium" style={styles.infoText}>{venue.phone || 'No phone available'}</Text>
            </View>
            <View style={styles.infoRow}>
              <IconButton icon="web" size={20} />
              <Text variant="bodyMedium" style={styles.infoText}>{(venue as any).website || 'No website available'}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Ratings & Reviews */}
          <View style={styles.section}>
            <Button
              mode="contained-tonal"
              icon="directions"
              buttonColor="#FFE0B2"
              textColor={pubmateColors.orange}
              compact
              onPress={handleGetDirections}
            >
              Go
            </Button>
          </View>
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Text variant="titleLarge" style={styles.sectionTitle}>Reviews</Text>
              <Button mode="text" onPress={() => console.log('See all reviews')}>See all</Button>
            </View>

            <View style={styles.ratingSummary}>
              <Text variant="displayMedium" style={styles.ratingScore}>{venue.rating}</Text>
              <StarRating rating={Math.round(venue.rating) as ReviewRating} size="medium" />
              <Text variant="bodyMedium" style={styles.reviewCountText}>(Based on regular visitors)</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Action Bar */}
      <Surface style={styles.actionBar} elevation={4}>
        <Button
          mode="outlined"
          style={styles.actionButtonBottom}
          onPress={() => console.log('Check In')}
        >
          Check In
        </Button>
        <Button
          mode="contained"
          style={styles.actionButtonBottom}
          buttonColor={pubmateColors.charcoal}
          onPress={() => navigation.navigate('SubmitReview' as any, { venueId: venue.id, venueName: venue.name })}
        >
          Write Review
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    margin: 0,
  },
  imageActions: {
    flexDirection: 'row',
  },
  actionButton: {
    margin: 0,
    marginLeft: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  venueName: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  featureChip: {
    backgroundColor: '#fff',
    borderColor: '#eee',
    borderWidth: 1,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  specialCard: {
    backgroundColor: '#FFF5E6',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: pubmateColors.orange,
  },
  specialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  specialTitle: {
    color: pubmateColors.orange,
    fontWeight: 'bold',
  },
  specialName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  specialDescription: {
    color: '#555',
    marginBottom: 16,
    lineHeight: 20,
  },
  availableLabel: {
    color: '#888',
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: pubmateColors.orange,
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#888',
  },
  dayTextActive: {
    color: '#fff',
  },
  timeText: {
    color: pubmateColors.orange,
    fontWeight: 'bold',
  },
  addedText: {
    color: '#999',
    marginTop: 12,
    fontStyle: 'italic',
  },
  divider: {
    marginVertical: 24,
    backgroundColor: '#eee',
  },
  description: {
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: '#555',
    marginLeft: 8,
    flex: 1,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingSummary: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 24,
    borderRadius: 16,
  },
  ratingScore: {
    color: pubmateColors.orange,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reviewCountText: {
    color: '#888',
    marginTop: 8,
  },
  actionBar: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    gap: 16,
  },
  actionButtonBottom: {
    flex: 1,
  },
});
