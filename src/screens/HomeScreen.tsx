import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleFavorite } from '../store/slices/venueSlice';
import VenueService from '../services/VenueService';
import { Venue, Special } from '../types/venue.types';

const { width } = Dimensions.get('window');

// Light theme colors matching original design
const colors = {
  background: '#F5F5F5',
  white: '#FFFFFF',
  primary: '#F97316', // Orange
  primaryLight: '#FFF7ED',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  success: '#10B981',
  purple: '#8B5CF6',
};

// Category filter chips
const CATEGORY_FILTERS = [
  { id: 'craft-beer', label: 'Craft Beer', icon: 'beer-outline' },
  { id: 'food', label: 'Food', icon: 'restaurant-outline' },
  { id: 'live-music', label: 'Live Music', icon: 'musical-notes-outline' },
  { id: 'sports', label: 'Sports', icon: 'football-outline' },
  { id: 'cocktails', label: 'Cocktails', icon: 'wine-outline' },
];

// Quick action cards
const QUICK_ACTIONS = [
  { id: 'map', label: 'Explore\nMap', icon: 'map', color: '#FEF3C7', iconColor: '#F59E0B' },
  { id: 'rewards', label: 'Rewards', icon: 'gift', color: '#FCE7F3', iconColor: '#EC4899' },
  { id: 'events', label: 'Events', icon: 'calendar', color: '#DBEAFE', iconColor: '#3B82F6' },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.venue);
  const { user } = useAppSelector((state) => state.auth);

  const [refreshing, setRefreshing] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [specials, setSpecials] = useState<Special[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Sydney region for map
  const sydneyRegion = {
    latitude: -33.8688,
    longitude: 151.2093,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allVenues = await VenueService.getVenues();
      setVenues(allVenues);

      // Get today's specials
      const todaySpecials = await VenueService.getTodaysSpecials();
      setSpecials(todaySpecials);

      // Mock upcoming events
      setUpcomingEvents([
        {
          id: '1',
          title: 'AFL Grand Final Screening',
          venue: 'The Royal Oak',
          date: 'Sat, Sep 28',
          time: '2:00 PM',
          interested: 156,
        },
        {
          id: '2',
          title: 'Pub Trivia Night',
          venue: 'The Royal Oak',
          date: 'Every Tuesday',
          time: '7:30 PM',
          interested: 89,
        },
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleSearch = () => {
    navigation.navigate('Search', { query: searchQuery });
  };

  const handleVenuePress = (venue: Venue) => {
    navigation.navigate('VenueDetail', { venueId: venue.id });
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'map':
        navigation.navigate('Search', { viewMode: 'map' });
        break;
      case 'rewards':
        navigation.navigate('Rewards');
        break;
      case 'events':
        navigation.navigate('Events');
        break;
    }
  };

  const renderSpecialCard = (special: Special) => {
    const venue = venues.find(v => v.id === special.venueId);
    const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
      <TouchableOpacity
        key={special.id}
        style={styles.specialCard}
        onPress={() => venue && handleVenuePress(venue)}
      >
        <Image
          source={{ uri: special.image || 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=400' }}
          style={styles.specialImage}
        />
        <View style={styles.specialContent}>
          <View style={styles.specialHeader}>
            <Text style={styles.specialTitle}>{special.title}</Text>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>${special.price?.toFixed(2) || '7.50'}</Text>
            </View>
          </View>
          <View style={styles.venueRow}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={styles.venueName}>{venue?.name || 'Venue'}</Text>
          </View>
          <Text style={styles.specialDescription} numberOfLines={2}>
            {special.description}
          </Text>
          <View style={styles.daysRow}>
            {daysOfWeek.map((day, index) => {
              const isActive = special.availableDays?.includes(index) ?? (index < 5);
              return (
                <View
                  key={index}
                  style={[styles.dayCircle, isActive && styles.dayCircleActive]}
                >
                  <Text style={[styles.dayText, isActive && styles.dayTextActive]}>
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.timeText}>
              {special.startTime || '4:00 PM'} - {special.endTime || '7:00 PM'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEventCard = (event: any) => (
    <View key={event.id} style={styles.eventCard}>
      <View style={styles.eventIcon}>
        <Ionicons name="calendar" size={20} color={colors.primary} />
      </View>
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.eventVenueRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.eventVenue}>{event.venue}</Text>
        </View>
        <View style={styles.eventTimeRow}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.eventTime}>{event.date} - {event.time}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.interestedBtn}>
        <Text style={styles.interestedText}>I'm Interested</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Orange Header */}
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

          <Text style={styles.tagline}>Find Your Spot</Text>
          <Text style={styles.taglineSubtext}>Discover the best pubs & bars in Sydney</Text>

          {/* Search Bar */}
          <TouchableOpacity style={styles.searchBar} onPress={handleSearch}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <Text style={styles.searchPlaceholder}>Search venues, suburbs, events...</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContainer}
        >
          {CATEGORY_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={styles.filterChip}
              onPress={() => navigation.navigate('Search', { category: filter.id })}
            >
              <Ionicons name={filter.icon as any} size={16} color={colors.text} />
              <Text style={styles.filterText}>{filter.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Explore Nearby Map */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Nearby</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search', { viewMode: 'map' })}>
              <Text style={styles.seeAllText}>Full Map</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={PROVIDER_DEFAULT}
              initialRegion={sydneyRegion}
              showsUserLocation
              showsMyLocationButton={false}
            >
              {venues.slice(0, 10).map((venue) => (
                <Marker
                  key={venue.id}
                  coordinate={{
                    latitude: venue.location?.latitude || -33.8688 + Math.random() * 0.05,
                    longitude: venue.location?.longitude || 151.2093 + Math.random() * 0.05,
                  }}
                  onPress={() => handleVenuePress(venue)}
                >
                  <View style={styles.markerContainer}>
                    <View style={[
                      styles.marker,
                      venue.hasActiveSpecials ? styles.markerSpecial : styles.markerNormal
                    ]}>
                      <Text style={styles.markerText}>
                        {venue.hasActiveSpecials ? venue.activeSpecialsCount || '1' : ''}
                      </Text>
                    </View>
                  </View>
                </Marker>
              ))}
            </MapView>
          </View>
        </View>

        {/* Today's Specials */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Specials</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search', { filter: 'specials' })}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {specials.slice(0, 3).map(renderSpecialCard)}
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingEvents.map(renderEventCard)}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.quickActionsRow}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: action.color }]}
                onPress={() => handleQuickAction(action.id)}
              >
                <MaterialCommunityIcons
                  name={action.icon as any}
                  size={28}
                  color={action.iconColor}
                />
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTitleContainer: {
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.white,
    marginLeft: 6,
    opacity: 0.9,
  },
  tagline: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  taglineSubtext: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.textSecondary,
  },
  filtersScroll: {
    marginTop: 16,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  markerSpecial: {
    backgroundColor: colors.primary,
  },
  markerNormal: {
    backgroundColor: '#1F2937',
  },
  markerText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  specialCard: {
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
  specialImage: {
    width: '100%',
    height: 140,
  },
  specialContent: {
    padding: 16,
  },
  specialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  specialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  priceTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  priceText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueName: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  specialDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dayTextActive: {
    color: colors.white,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 6,
    fontSize: 13,
    color: colors.textSecondary,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  eventVenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  eventVenue: {
    marginLeft: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  eventTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTime: {
    marginLeft: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  interestedBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  interestedText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
