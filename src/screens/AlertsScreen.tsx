import React, { useState } from 'react';
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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
  blue: '#3B82F6',
};

const ALERT_FILTERS = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'specials', label: 'Specials', icon: 'pricetag' },
  { id: 'events', label: 'Events', icon: 'calendar' },
  { id: 'venues', label: 'Venues', icon: 'location' },
  { id: 'social', label: 'Social', icon: 'people' },
];

// Mock alerts data
const MOCK_ALERTS = [
  {
    id: '1',
    type: 'special',
    icon: 'pricetag',
    iconColor: colors.primary,
    iconBg: colors.primaryLight,
    title: 'New Happy Hour at The Royal...',
    description: '$7.50 schooners & $10 pints of select house beers. Available Mon-Fri 4PM-7PM',
    time: '1 Oct',
    action: 'View Special →',
    read: false,
  },
  {
    id: '2',
    type: 'event',
    icon: 'calendar',
    iconColor: colors.primary,
    iconBg: colors.primaryLight,
    title: 'Event Starting in 1 Hour!',
    description: 'AFL Grand Final Screening at The Royal Oak starts at 2:00 PM',
    time: '30 Sep',
    action: 'View Event →',
    read: false,
  },
  {
    id: '3',
    type: 'venue',
    icon: 'location',
    iconColor: colors.textSecondary,
    iconBg: '#F3F4F6',
    title: 'Franca Brasserie Updated Menu',
    description: 'Your favorite venue just added 5 new dishes to their menu. Check it out!',
    time: '30 Sep',
    action: null,
    read: true,
  },
  {
    id: '4',
    type: 'event',
    icon: 'calendar',
    iconColor: colors.primary,
    iconBg: colors.primaryLight,
    title: 'New Event at The Local Taphou...',
    description: 'Craft Beer Tasting Event happening on Oct 10. 89 people already going!',
    time: '28 Sep',
    action: 'View Event →',
    read: true,
  },
  {
    id: '5',
    type: 'special',
    icon: 'pricetag',
    iconColor: colors.primary,
    iconBg: colors.primaryLight,
    title: '2-for-1 Cocktails Ending Toni...',
    description: "Last chance to enjoy 2-for-1 cocktails at The Baxter Inn. Ends tonight!",
    time: '28 Sep',
    action: 'View Special →',
    read: true,
  },
];

export default function AlertsScreen() {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'specials') return alert.type === 'special';
    if (selectedFilter === 'events') return alert.type === 'event';
    if (selectedFilter === 'venues') return alert.type === 'venue';
    if (selectedFilter === 'social') return alert.type === 'social';
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleMarkAllRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, read: true })));
  };

  const handleAlertPress = (alert: any) => {
    // Mark as read
    setAlerts(alerts.map((a) => (a.id === alert.id ? { ...a, read: true } : a)));

    // Navigate based on type
    if (alert.type === 'special') {
      navigation.navigate('Search', { filter: 'specials' });
    } else if (alert.type === 'event') {
      navigation.navigate('Events');
    } else if (alert.type === 'venue') {
      navigation.navigate('VenueDetail', { venueId: 'venue-1' });
    }
  };

  const renderAlertItem = (alert: any) => (
    <TouchableOpacity
      key={alert.id}
      style={[styles.alertItem, !alert.read && styles.alertItemUnread]}
      onPress={() => handleAlertPress(alert)}
    >
      <View style={[styles.alertIcon, { backgroundColor: alert.iconBg }]}>
        <Ionicons name={alert.icon as any} size={20} color={alert.iconColor} />
      </View>
      <View style={styles.alertContent}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertTitle} numberOfLines={1}>
            {alert.title}
          </Text>
          <Text style={styles.alertTime}>{alert.time}</Text>
        </View>
        <Text style={styles.alertDescription} numberOfLines={2}>
          {alert.description}
        </Text>
        {alert.action && (
          <Text style={styles.alertAction}>{alert.action}</Text>
        )}
      </View>
      {!alert.read && <View style={styles.unreadDot} />}
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
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Text style={styles.pageTitle}>Alerts</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead}>
              <Text style={styles.markAllRead}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContainer}
        >
          {ALERT_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={selectedFilter === filter.id ? colors.white : colors.textSecondary}
              />
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

        {/* Alerts List */}
        <View style={styles.alertsList}>
          {filteredAlerts.map(renderAlertItem)}
        </View>

        {filteredAlerts.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No alerts</Text>
            <Text style={styles.emptyText}>
              You're all caught up! Check back later for updates.
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  markAllRead: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  filtersScroll: {
    marginTop: 8,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
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
  alertsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  alertItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  alertItemUnread: {
    backgroundColor: colors.primaryLight,
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  alertTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  alertDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  alertAction: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
    alignSelf: 'center',
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
