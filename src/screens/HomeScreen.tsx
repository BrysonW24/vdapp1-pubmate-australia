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

const FEATURED_VENUES = [
  {
    id: '1',
    name: 'The Local Taphouse',
    type: 'Craft Beer Bar',
    rating: 4.8,
    distance: '0.5 km',
    image: 'https://picsum.photos/300/200?random=1',
  },
  {
    id: '2',
    name: 'Pub on the Corner',
    type: 'Traditional Pub',
    rating: 4.5,
    distance: '1.2 km',
    image: 'https://picsum.photos/300/200?random=2',
  },
  {
    id: '3',
    name: 'Rooftop Bar & Grill',
    type: 'Rooftop Bar',
    rating: 4.7,
    distance: '0.8 km',
    image: 'https://picsum.photos/300/200?random=3',
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening</Text>
            <Text style={styles.title}>Find your next pub</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6b7280" />
          <Text style={styles.searchPlaceholder}>Search pubs, bars, breweries...</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: '#f59e0b20' }]}>
              <Ionicons name="location" size={24} color="#f59e0b" />
            </View>
            <Text style={styles.actionText}>Nearby</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: '#3b82f620' }]}>
              <Ionicons name="beer" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.actionText}>Craft Beer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: '#10b98120' }]}>
              <Ionicons name="restaurant" size={24} color="#10b981" />
            </View>
            <Text style={styles.actionText}>Food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: '#8b5cf620' }]}>
              <Ionicons name="musical-notes" size={24} color="#8b5cf6" />
            </View>
            <Text style={styles.actionText}>Live Music</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Venues</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {FEATURED_VENUES.map((venue) => (
            <TouchableOpacity key={venue.id} style={styles.venueCard}>
              <Image source={{ uri: venue.image }} style={styles.venueImage} />
              <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{venue.name}</Text>
                <Text style={styles.venueType}>{venue.type}</Text>
                <View style={styles.venueStats}>
                  <View style={styles.stat}>
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.statText}>{venue.rating}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="location" size={14} color="#6b7280" />
                    <Text style={styles.statText}>{venue.distance}</Text>
                  </View>
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
  greeting: {
    fontSize: 14,
    color: '#6b7280',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2d2d44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchPlaceholder: {
    color: '#6b7280',
    fontSize: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  seeAll: {
    fontSize: 14,
    color: '#f59e0b',
  },
  venueCard: {
    flexDirection: 'row',
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  venueImage: {
    width: 100,
    height: 100,
  },
  venueInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  venueType: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 8,
  },
  venueStats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#9ca3af',
  },
});
