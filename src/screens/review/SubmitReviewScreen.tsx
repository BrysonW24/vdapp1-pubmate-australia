import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface, Divider } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../store';
import { addReview } from '../../store/slices/reviewSlice';
import { ReviewRating } from '../../types/review.types';
import StarRating from '../../components/review/StarRating';
import { pubmateColors } from '../../theme';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function SubmitReviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  // const { venueId, venueName } = route.params;

  // Mock data
  const venueId = '1';
  const venueName = 'The Royal Oak';

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.profile);

  const [rating, setRating] = useState<ReviewRating>(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const review = {
        id: `review_${Date.now()}`,
        type: 'user' as const,
        userId: user?.uid || 'user_1',

        userName: user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : 'Anonymous User',
        userAvatar: undefined,
        isInsider: false,
        venueId,
        venueName,
        rating,
        title: title || undefined,
        content,
        photos: [],
        helpfulCount: 0,
        notHelpfulCount: 0,
        userVote: null,
        isReported: false,
        isVerifiedVisit: true,
        visitDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addReview(review));
      alert('Thank you! Your review has been submitted.');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = content.trim().length >= 20;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Write a Review
        </Text>
        <Text variant="titleMedium" style={styles.venueName}>
          {venueName}
        </Text>
      </View>

      {/* Rating Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          How would you rate this venue?
        </Text>
        <Surface style={styles.ratingCard} elevation={0}>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="large"
            showLabel
          />
        </Surface>
      </View>

      <Divider style={styles.divider} />

      {/* Review Content */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Share your experience
        </Text>

        <Surface style={styles.formCard} elevation={0}>
          <TextInput
            label="Review Title (Optional)"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
            placeholder="Sum up your visit"
            maxLength={100}
          />

          <TextInput
            label="Your Review *"
            value={content}
            onChangeText={setContent}
            mode="outlined"
            multiline
            numberOfLines={8}
            style={styles.input}
            outlineColor="#E0E0E0"
            activeOutlineColor={pubmateColors.orange}
            placeholder="Tell us about your experience... (minimum 20 characters)"
          />

          <Text variant="bodySmall" style={styles.characterCount}>
            {content.length} / 500 characters
          </Text>
        </Surface>
      </View>

      {/* Guidelines */}
      <View style={styles.guidelinesBox}>
        <Text variant="titleSmall" style={styles.guidelinesTitle}>
          Review Guidelines
        </Text>
        <Text variant="bodySmall" style={styles.guidelinesText}>
          • Be honest and constructive{'\n'}
          • Focus on your experience{'\n'}
          • Be respectful and appropriate{'\n'}
          • Don't include personal information
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || !isFormValid}
          style={styles.submitButton}
          icon="send"
        >
          Submit Review
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
  header: {
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    color: pubmateColors.charcoal,
  },
  venueName: {
    color: pubmateColors.orange,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 16,
    color: pubmateColors.charcoal,
  },
  ratingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  divider: {
    marginVertical: 8,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  characterCount: {
    color: '#666',
    textAlign: 'right',
  },
  guidelinesBox: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: pubmateColors.cream,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: pubmateColors.orange,
  },
  guidelinesTitle: {
    fontWeight: '700',
    marginBottom: 8,
    color: pubmateColors.charcoal,
  },
  guidelinesText: {
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
    backgroundColor: pubmateColors.orange,
  },
  bottomPadding: {
    height: 32,
  },
});
