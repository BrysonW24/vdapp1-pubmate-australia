import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, IconButton, Chip } from 'react-native-paper';
import { Review } from '../../types/review.types';
import StarRating from './StarRating';
import { pubmateColors } from '../../theme';

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  onNotHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
}

export default function ReviewCard({ review, onHelpful, onNotHelpful, onReport }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleHelpful = () => {
    if (onHelpful && review.userVote !== 'helpful') {
      onHelpful(review.id);
    }
  };

  const handleNotHelpful = () => {
    if (onNotHelpful && review.userVote !== 'not_helpful') {
      onNotHelpful(review.id);
    }
  };

  return (
    <Surface style={styles.card} elevation={0}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text variant="titleMedium" style={styles.userName}>
            {review.userName}
            {review.isInsider && (
              <Chip compact style={styles.insiderBadge} textStyle={styles.insiderText}>
                Insider
              </Chip>
            )}
          </Text>
          <Text variant="bodySmall" style={styles.date}>
            {formatDate(review.createdAt)}
            {review.isVerifiedVisit && ' • Verified Visit'}
          </Text>
        </View>

        {review.type === 'editorial' && review.editorialSource && (
          <Chip compact style={styles.editorialBadge} textStyle={styles.editorialText}>
            {review.editorialSource}
          </Chip>
        )}
      </View>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <StarRating rating={review.rating} size="small" readonly />
      </View>

      {/* Title */}
      {review.title && (
        <Text variant="titleMedium" style={styles.title}>
          {review.title}
        </Text>
      )}

      {/* Content */}
      <Text variant="bodyMedium" style={styles.content}>
        {review.content}
      </Text>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <View style={styles.photosContainer}>
          {/* Photo thumbnails would go here */}
        </View>
      )}

      {/* Venue Response */}
      {review.venueResponse && (
        <Surface style={styles.responseCard} elevation={0}>
          <Text variant="labelSmall" style={styles.responseLabel}>
            Response from {review.venueResponse.responderName}
          </Text>
          <Text variant="bodySmall" style={styles.responseContent}>
            {review.venueResponse.content}
          </Text>
          <Text variant="bodySmall" style={styles.responseDate}>
            {formatDate(review.venueResponse.respondedAt)}
          </Text>
        </Surface>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.helpfulActions}>
          <IconButton
            icon={review.userVote === 'helpful' ? 'thumb-up' : 'thumb-up-outline'}
            size={18}
            iconColor={review.userVote === 'helpful' ? pubmateColors.darkGreen : '#666'}
            onPress={handleHelpful}
          />
          <Text variant="bodySmall" style={styles.actionCount}>
            {review.helpfulCount}
          </Text>

          <IconButton
            icon={review.userVote === 'not_helpful' ? 'thumb-down' : 'thumb-down-outline'}
            size={18}
            iconColor={review.userVote === 'not_helpful' ? pubmateColors.orange : '#666'}
            onPress={handleNotHelpful}
            style={styles.notHelpfulButton}
          />
          <Text variant="bodySmall" style={styles.actionCount}>
            {review.notHelpfulCount}
          </Text>
        </View>

        {!review.isReported && onReport && (
          <IconButton
            icon="flag-outline"
            size={18}
            iconColor="#666"
            onPress={() => onReport(review.id)}
          />
        )}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '700',
    marginBottom: 4,
    color: pubmateColors.charcoal,
  },
  date: {
    color: '#666',
  },
  insiderBadge: {
    backgroundColor: pubmateColors.amber,
    marginLeft: 8,
  },
  insiderText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  editorialBadge: {
    backgroundColor: pubmateColors.cream,
  },
  editorialText: {
    fontSize: 10,
    fontWeight: '600',
    color: pubmateColors.charcoal,
  },
  ratingContainer: {
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    color: pubmateColors.charcoal,
  },
  content: {
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  photosContainer: {
    marginBottom: 12,
  },
  responseCard: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: pubmateColors.orange,
  },
  responseLabel: {
    fontWeight: '700',
    marginBottom: 4,
    color: pubmateColors.charcoal,
    textTransform: 'uppercase',
  },
  responseContent: {
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  responseDate: {
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpfulActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notHelpfulButton: {
    marginLeft: 8,
  },
  actionCount: {
    color: '#666',
    fontWeight: '600',
  },
});
