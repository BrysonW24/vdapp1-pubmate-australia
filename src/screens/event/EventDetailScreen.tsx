import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton, Chip, Divider, Surface } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { shareEvent } from '../../utils/shareUtils';
import { pubmateColors } from '../../theme';

export default function EventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  // const { eventId } = route.params;

  // Mock event data
  const event = {
    id: '1',
    title: 'AFL Grand Final Screening',
    description: 'Join us for the biggest game of the year! Watch the AFL Grand Final on our massive screens with surround sound. Special food and drink packages available.',
    category: 'Sports',
    imageUrl: 'https://via.placeholder.com/400x300',
    images: [
      'https://via.placeholder.com/400x300',
      'https://via.placeholder.com/400x300',
    ],
    venueId: '1',
    venueName: 'The Royal Oak',
    venueAddress: '252 George St, Sydney NSW 2000',
    startDate: '2025-09-30',
    endDate: '2025-09-30',
    startTime: '14:00',
    endTime: '18:00',
    priceType: 'paid' as const,
    price: '20.00',
    goingCount: 234,

    interestedCount: 89,
    capacity: 500,
    ageRestriction: 18,
    organizer: 'The Royal Oak',
    contactPhone: '+61292403000',
    contactEmail: 'events@theroyaloak.com.au',
    tags: ['AFL', 'Sports', 'Grand Final', 'Live Screening'],
    isFeatured: true,
    isPromoted: true,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-AU', options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleShare = () => {
    shareEvent(
      event.title,
      event.venueName,
      formatDate(event.startDate),
      formatTime(event.startTime)
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image Gallery */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.imageUrl }} style={styles.mainImage} />
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
              icon="share-variant"
              iconColor="#fff"
              size={24}
              style={styles.actionButton}
              onPress={handleShare}
            />
            <IconButton
              icon="heart-outline"
              iconColor="#fff"
              size={24}
              style={styles.actionButton}
            />
          </View>
        </View>
        {event.isFeatured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>FEATURED</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Category */}
        <Chip
          style={styles.categoryChip}
          textStyle={styles.categoryText}
        >
          {event.category}
        </Chip>

        {/* Title */}
        <Text variant="headlineMedium" style={styles.eventTitle}>
          {event.title}
        </Text>

        {/* Venue */}
        <TouchableOpacity style={styles.venueRow}>
          <IconButton icon="map-marker" size={20} />
          <View style={styles.venueInfo}>
            <Text variant="titleMedium" style={styles.venueName}>
              {event.venueName}
            </Text>
            <Text variant="bodySmall" style={styles.venueAddress}>
              {event.venueAddress}
            </Text>
          </View>
          <IconButton icon="chevron-right" size={20} />
        </TouchableOpacity>

        <Divider style={styles.divider} />

        {/* Date & Time Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            When
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <IconButton icon="calendar" size={24} iconColor={pubmateColors.orange} />
              <View style={styles.infoContent}>
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Date
                </Text>
                <Text variant="titleMedium" style={styles.infoValue}>
                  {formatDate(event.startDate)}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <IconButton icon="clock-outline" size={24} iconColor={pubmateColors.orange} />
              <View style={styles.infoContent}>
                <Text variant="bodyMedium" style={styles.infoLabel}>
                  Time
                </Text>
                <Text variant="titleMedium" style={styles.infoValue}>
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Description */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            About this event
          </Text>
          <Text variant="bodyLarge" style={styles.description}>
            {event.description}
          </Text>
        </View>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {event.tags.map((tag, index) => (
              <Chip key={index} style={styles.tag} compact textStyle={styles.tagText}>
                {tag}
              </Chip>
            ))}
          </View>
        )}

        <Divider style={styles.divider} />

        {/* Event Details */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Event Details
          </Text>

          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.detailLabel}>
              Price
            </Text>
            <Surface style={event.priceType === 'paid' ? styles.paidBadge : styles.freeBadge}>
              <Text style={styles.badgeText}>
                {(event.priceType as any) === 'free' ? 'FREE' : `$${(event as any).price}`}

              </Text>
            </Surface>

          </View>

          {event.capacity && (
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>
                Capacity
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {event.capacity} people
              </Text>
            </View>
          )}

          {event.ageRestriction && (
            <View style={styles.detailRow}>
              <Text variant="bodyMedium" style={styles.detailLabel}>
                Age Restriction
              </Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {event.ageRestriction}+
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.detailLabel}>
              Organizer
            </Text>
            <Text variant="bodyMedium" style={styles.detailValue}>
              {event.organizer}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Contact */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Contact
          </Text>

          <View style={styles.contactRow}>
            <IconButton icon="phone" size={20} />
            <Text variant="bodyMedium">{event.contactPhone}</Text>
          </View>
          <View style={styles.contactRow}>
            <IconButton icon="email" size={20} />
            <Text variant="bodyMedium">{event.contactEmail}</Text>
          </View>
        </View>

        {/* Attendance Stats */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Who's attending?
          </Text>
          <View style={styles.statsRow}>
            <Surface style={styles.statCard} elevation={1}>
              <Text style={styles.statNumber}>{event.goingCount}</Text>
              <Text style={styles.statLabel}>Going</Text>
            </Surface>
            <Surface style={styles.statCard} elevation={1}>
              <Text style={styles.statNumber}>{event.interestedCount}</Text>
              <Text style={styles.statLabel}>Interested</Text>
            </Surface>
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          mode="outlined"
          icon="star-outline"
          style={styles.interestedButton}
          onPress={() => console.log('Interested')}
        >
          Interested
        </Button>
        <Button
          mode="contained"
          icon="check-circle"
          style={styles.goingButton}
          onPress={() => console.log('Going')}
        >
          I'm Going
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  imageActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: pubmateColors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  featuredText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: pubmateColors.cream,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: pubmateColors.charcoal,
  },
  eventTitle: {
    fontWeight: '700',
    marginBottom: 16,
    color: pubmateColors.charcoal,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontWeight: '600',
    color: pubmateColors.charcoal,
  },
  venueAddress: {
    color: '#666',
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
    color: pubmateColors.charcoal,
  },
  infoCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontWeight: '600',
    color: pubmateColors.charcoal,
  },
  description: {
    color: '#666',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F5F5F5',
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    color: '#666',
  },
  detailValue: {
    fontWeight: '600',
    color: pubmateColors.charcoal,
  },
  freeBadge: {
    backgroundColor: pubmateColors.darkGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  paidBadge: {
    backgroundColor: pubmateColors.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: pubmateColors.orange,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  interestedButton: {
    flex: 1,
  },
  goingButton: {
    flex: 1,
    backgroundColor: pubmateColors.orange,
  },
});
