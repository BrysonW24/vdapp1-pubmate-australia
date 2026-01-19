import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Switch, Divider, Surface, Button } from 'react-native-paper';
import { DEFAULT_NOTIFICATION_SETTINGS } from '../../types/notification.types';
import { pubmateColors } from '../../theme';

export default function NotificationSettingsScreen() {
  const [settings, setSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    console.log('Saving notification settings:', settings);
    // Save to backend/storage
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Global Settings */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Global Settings
        </Text>
        <Surface style={styles.card} elevation={0}>
          <List.Item
            title="Push Notifications"
            description="Receive notifications on this device"
            left={(props) => <List.Icon {...props} icon="bell" color={pubmateColors.orange} />}
            right={() => (
              <Switch
                value={settings.pushEnabled}
                onValueChange={() => handleToggle('pushEnabled')}
                color={pubmateColors.orange}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Email Notifications"
            description="Receive updates via email"
            left={(props) => <List.Icon {...props} icon="email" color={pubmateColors.orange} />}
            right={() => (
              <Switch
                value={settings.emailEnabled}
                onValueChange={() => handleToggle('emailEnabled')}
                color={pubmateColors.orange}
              />
            )}
          />
        </Surface>
      </View>

      {/* Notification Types */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          What to Notify Me About
        </Text>
        <Surface style={styles.card} elevation={0}>
          <List.Item
            title="New Specials"
            description="Specials at your favorite venues"
            left={(props) => <List.Icon {...props} icon="tag" />}
            right={() => (
              <Switch
                value={settings.newSpecials}
                onValueChange={() => handleToggle('newSpecials')}
                color={pubmateColors.orange}
                disabled={!settings.pushEnabled}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Event Reminders"
            description="Upcoming events you're attending"
            left={(props) => <List.Icon {...props} icon="calendar-clock" />}
            right={() => (
              <Switch
                value={settings.eventReminders}
                onValueChange={() => handleToggle('eventReminders')}
                color={pubmateColors.orange}
                disabled={!settings.pushEnabled}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Event Updates"
            description="Changes to events you follow"
            left={(props) => <List.Icon {...props} icon="calendar-edit" />}
            right={() => (
              <Switch
                value={settings.eventUpdates}
                onValueChange={() => handleToggle('eventUpdates')}
                color={pubmateColors.orange}
                disabled={!settings.pushEnabled}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Venue Updates"
            description="Updates from favorite venues"
            left={(props) => <List.Icon {...props} icon="map-marker" />}
            right={() => (
              <Switch
                value={settings.venueUpdates}
                onValueChange={() => handleToggle('venueUpdates')}
                color={pubmateColors.orange}
                disabled={!settings.pushEnabled}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Insider Recommendations"
            description="Picks from trusted insiders"
            left={(props) => <List.Icon {...props} icon="star" />}
            right={() => (
              <Switch
                value={settings.insiderRecommendations}
                onValueChange={() => handleToggle('insiderRecommendations')}
                color={pubmateColors.orange}
                disabled={!settings.pushEnabled}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Specials Ending Soon"
            description="Reminders for expiring deals"
            left={(props) => <List.Icon {...props} icon="timer-sand" />}
            right={() => (
              <Switch
                value={settings.specialEnding}
                onValueChange={() => handleToggle('specialEnding')}
                color={pubmateColors.orange}
                disabled={!settings.pushEnabled}
              />
            )}
          />
          <Divider />
          <List.Item
            title="New Events"
            description="Events at favorite venues"
            left={(props) => <List.Icon {...props} icon="calendar-plus" />}
            right={() => (
              <Switch
                value={settings.newEvents}
                onValueChange={() => handleToggle('newEvents')}
                color={pubmateColors.orange}
                disabled={!settings.pushEnabled}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Friend Activity"
            description="When friends attend events"
            left={(props) => <List.Icon {...props} icon="account-group" />}
            right={() => (
              <Switch
                value={settings.friendActivity}
                onValueChange={() => handleToggle('friendActivity')}
                color={pubmateColors.orange}
                disabled={!settings.pushEnabled}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Promotions & Offers"
            description="Special deals and app promotions"
            left={(props) => <List.Icon {...props} icon="gift" />}
            right={() => (
              <Switch
                value={settings.promotions}
                onValueChange={() => handleToggle('promotions')}
                color={pubmateColors.orange}
                disabled={!settings.pushEnabled}
              />
            )}
          />
        </Surface>
      </View>

      {/* Quiet Hours */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Quiet Hours
        </Text>
        <Surface style={styles.card} elevation={0}>
          <List.Item
            title="Enable Quiet Hours"
            description="Pause notifications during specific hours"
            left={(props) => <List.Icon {...props} icon="moon-waning-crescent" />}
            right={() => (
              <Switch
                value={settings.quietHoursEnabled}
                onValueChange={() => handleToggle('quietHoursEnabled')}
                color={pubmateColors.orange}
                disabled={!settings.pushEnabled}
              />
            )}
          />
          {settings.quietHoursEnabled && (
            <>
              <Divider />
              <List.Item
                title="Start Time"
                description="10:00 PM"
                left={(props) => <List.Icon {...props} icon="clock-start" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => console.log('Set start time')}
              />
              <Divider />
              <List.Item
                title="End Time"
                description="8:00 AM"
                left={(props) => <List.Icon {...props} icon="clock-end" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => console.log('Set end time')}
              />
            </>
          )}
        </Surface>
      </View>

      {/* Event Reminder Time */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Event Reminders
        </Text>
        <Surface style={styles.card} elevation={0}>
          <List.Item
            title="Reminder Time"
            description="1 hour before event"
            left={(props) => <List.Icon {...props} icon="bell-ring" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Change reminder time')}
          />
        </Surface>
      </View>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          icon="content-save"
        >
          Save Settings
        </Button>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
    color: pubmateColors.charcoal,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  saveButton: {
    backgroundColor: pubmateColors.orange,
  },
  bottomPadding: {
    height: 32,
  },
});
