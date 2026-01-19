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

const MENU_ITEMS = [
  { id: '1', icon: 'heart', label: 'Favorites', count: 12 },
  { id: '2', icon: 'time', label: 'Recent Visits', count: 28 },
  { id: '3', icon: 'star', label: 'Reviews', count: 8 },
  { id: '4', icon: 'bookmark', label: 'Saved Events', count: 5 },
];

const SETTINGS_ITEMS = [
  { id: '1', icon: 'notifications-outline', label: 'Notifications' },
  { id: '2', icon: 'location-outline', label: 'Location Settings' },
  { id: '3', icon: 'card-outline', label: 'Payment Methods' },
  { id: '4', icon: 'help-circle-outline', label: 'Help & Support' },
  { id: '5', icon: 'log-out-outline', label: 'Sign Out', danger: true },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://picsum.photos/200/200?random=20' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.location}>Melbourne, Australia</Text>
            <View style={styles.memberBadge}>
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text style={styles.memberText}>Gold Member</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Venues</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>28</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={22} color="#f59e0b" />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <View style={styles.menuRight}>
                <Text style={styles.menuCount}>{item.count}</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {SETTINGS_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={[styles.menuIcon, item.danger && styles.dangerIcon]}>
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={item.danger ? '#ef4444' : '#9ca3af'}
                />
              </View>
              <Text style={[styles.menuLabel, item.danger && styles.dangerText]}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>PubMate v1.0.0</Text>
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
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2d2d44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  location: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  memberText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3d3d5c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2d2d44',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#3d3d5c',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#2d2d44',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  dangerIcon: {
    backgroundColor: '#ef444420',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  dangerText: {
    color: '#ef4444',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  version: {
    fontSize: 12,
    color: '#4b5563',
  },
});
