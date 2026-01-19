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
import { markAsInterested, markAsGoing } from '../store/slices/eventSlice';

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
  purple: '#8B5CF6',
};

const EVENT_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'tonight', label: 'Tonight' },
  { id: 'this-week', label: 'This Week' },
  { id: 'live-music', label: 'Live Music' },
  { id: 'trivia', label: 'Trivia' },
  { id: 'sports', label: 'Sports' },
];

// Mock events data
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'AFL Grand Final Screening',
    venue: 'The Royal Oak',
    venueId: 'venue-1',
    date: 'Saturday, Sep 28',
    time: '2:00 PM',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600',
    category: 'sports',
    going: 156,
    interested: 342,
    description: 'Watch the AFL Grand Final on our big screens! Drink specials all day.',
  },
  {
    id: '2',
    title: 'Pub Trivia Night',
    venue: 'The Local Taphouse',
    venueId: 'venue-2',
    date: 'Every Tuesday',
    time: '7:30 PM',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600',
    category: 'trivia',
    going: 45,
    interested: 89,
    description: 'Test your knowledge and win prizes! Teams of up to 6 people.',
  },
  {
    id: '3',
    title: 'Live Jazz Night',
    venue: 'The Baxter Inn',
    venueId: 'venue-3',
    date: 'Friday, Sep 27',
    time: '8:00 PM',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
    category: 'live-music',
    going: 78,
    interested: 156,
    description: 'Enjoy live jazz music with Sydney\'s finest musicians.',
  },
  {
    id: '4',
    title: 'Craft Beer Tasting',
    venue: 'Frankie\'s Pizza',
    venueId: 'venue-4',
    date: 'Saturday, Sep 28',
    time: '3:00 PM',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600',
    category: 'other',
    going: 34,
    interested: 67,
    description: 'Sample 8 different craft beers from local breweries.',
  },
  {
    id: '5',
    title: 'Open Mic Night',
    venue: 'The Glenmore Hotel',
    venueId: 'venue-5',
    date: 'Sunday, Sep 29',
    time: '6:00 PM',
    image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600',
    category: 'live-music',
    going: 23,
    interested: 45,
    description: 'Show off your talent! Sign up at the bar from 5pm.',
  },
];

export default function EventsScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { userEvents, userInterested } = useAppSelector((state) => state.event);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [events, setEvents] = useState(MOCK_EVENTS);

  const filteredEvents = events.filter((event) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'tonight') return event.date.toLowerCase().includes('tonight') || event.date.includes('Friday');
    if (selectedFilter === 'this-week') return true;
    return event.category === selectedFilter;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleEventPress = (event: any) => {
    navigation.navigate('EventDetail', { eventId: event.id });
  };

  const handleInterestedPress = (eventId: string) => {
    dispatch(markAsInterested(eventId));
  };

  const handleGoingPress = (eventId: string) => {
    dispatch(markAsGoing(eventId));
  };

  const isInterested = (eventId: string) => userInterested.includes(eventId);
  const isGoing = (eventId: string) => userEvents.includes(eventId);

  const renderEventCard = (event: any) => (
    <TouchableOpacity
      key={event.id}
      style={styles.eventCard}
      onPress={() => handleEventPress(event)}
    >
      <Image source={{ uri: event.image }} style={styles.eventImage} />
      <View style={styles.eventOverlay} />
      <View style={styles.eventContent}>
        <View style={styles.eventDateBadge}>
          <Ionicons name="calendar" size={12} color={colors.primary} />
          <Text style={styles.eventDateText}>{event.date}</Text>
          <Text style={styles.eventTimeText}>• {event.time}</Text>
        </View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.eventVenueRow}>
          <Ionicons name="location" size={14} color={colors.white} />
          <Text style={styles.eventVenue}>{event.venue}</Text>
        </View>
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>
        <View style={styles.eventFooter}>
          <View style={styles.eventStats}>
            <Text style={styles.statText}>{event.going} going</Text>
            <Text style={styles.statDot}>•</Text>
            <Text style={styles.statText}>{event.interested} interested</Text>
          </View>
          <View style={styles.eventActions}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                isInterested(event.id) && styles.actionBtnActive,
              ]}
              onPress={() => handleInterestedPress(event.id)}
            >
              <Ionicons
                name={isInterested(event.id) ? 'star' : 'star-outline'}
                size={16}
                color={isInterested(event.id) ? colors.white : colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.goingBtn,
                isGoing(event.id) && styles.goingBtnActive,
              ]}
              onPress={() => handleGoingPress(event.id)}
            >
              <Text
                style={[
                  styles.goingText,
                  isGoing(event.id) && styles.goingTextActive,
                ]}
              >
                {isGoing(event.id) ? 'Going!' : "I'm Going"}
              </Text>
            </TouchableOpacity>
          </View>
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
          <Text style={styles.pageTitle}>Events</Text>
          <Text style={styles.pageSubtitle}>Find what's happening near you</Text>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContainer}
        >
          {EVENT_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Events List */}
        <View style={styles.eventsList}>
          {filteredEvents.map(renderEventCard)}
        </View>

        {filteredEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters or check back later
            </Text>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  filtersScroll: {
    marginTop: 16,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.white,
  },
  eventsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  eventCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    height: 280,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  eventOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  eventContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  eventDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  eventDateText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  eventTimeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  eventVenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventVenue: {
    fontSize: 14,
    color: colors.white,
    marginLeft: 4,
    opacity: 0.9,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.85,
    lineHeight: 20,
    marginBottom: 12,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
  },
  statDot: {
    color: colors.white,
    opacity: 0.5,
    marginHorizontal: 6,
  },
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnActive: {
    backgroundColor: colors.primary,
  },
  goingBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  goingBtnActive: {
    backgroundColor: colors.primary,
  },
  goingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  goingTextActive: {
    color: colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
