import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const EVENTS = [
  {
    id: '1',
    title: 'Live Jazz Night',
    venue: 'The Local Taphouse',
    date: 'Tonight',
    time: '8:00 PM',
    image: 'https://picsum.photos/400/200?random=10',
  },
  {
    id: '2',
    title: 'Trivia Tuesday',
    venue: 'Pub on the Corner',
    date: 'Tomorrow',
    time: '7:00 PM',
    image: 'https://picsum.photos/400/200?random=11',
  },
  {
    id: '3',
    title: 'Craft Beer Tasting',
    venue: 'Brewery District',
    date: 'Sat, Jan 25',
    time: '3:00 PM',
    image: 'https://picsum.photos/400/200?random=12',
  },
  {
    id: '4',
    title: 'Open Mic Night',
    venue: 'The Velvet Room',
    date: 'Sun, Jan 26',
    time: '6:00 PM',
    image: 'https://picsum.photos/400/200?random=13',
  },
];

export default function EventsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Events</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity style={[styles.chip, styles.chipActive]}>
            <Text style={[styles.chipText, styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>Tonight</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>This Week</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>Live Music</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>Trivia</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Events List */}
        <View style={styles.eventsList}>
          {EVENTS.map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <View style={styles.eventOverlay} />
              <View style={styles.eventContent}>
                <View style={styles.eventDate}>
                  <Text style={styles.eventDateText}>{event.date}</Text>
                  <Text style={styles.eventTimeText}>{event.time}</Text>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventVenue}>
                  <Ionicons name="location" size={14} color="#9ca3af" />
                  <Text style={styles.eventVenueText}>{event.venue}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2d2d44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2d2d44',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#f59e0b',
  },
  chipText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  chipTextActive: {
    color: '#1a1a2e',
    fontWeight: '600',
  },
  eventsList: {
    paddingHorizontal: 20,
  },
  eventCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    height: 180,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  eventOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  eventContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  eventDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  eventDateText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  eventTimeText: {
    fontSize: 12,
    color: '#d1d5db',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  eventVenue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventVenueText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
