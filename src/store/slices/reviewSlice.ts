import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Review, ReviewStats, ReviewFilters } from '../../types/review.types';

interface ReviewState {
  // Reviews by venue
  reviewsByVenue: Record<string, Review[]>;

  // Stats by venue
  statsByVenue: Record<string, ReviewStats>;

  // User's reviews
  userReviews: Review[];

  // Filters
  filters: ReviewFilters;

  // UI State
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviewsByVenue: {},
  statsByVenue: {},
  userReviews: [],
  filters: {
    sortBy: 'recent',
  },
  isLoading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    // Set reviews for a venue
    setVenueReviews: (state, action: PayloadAction<{ venueId: string; reviews: Review[] }>) => {
      const { venueId, reviews } = action.payload;
      state.reviewsByVenue[venueId] = reviews;
    },

    // Add a new review
    addReview: (state, action: PayloadAction<Review>) => {
      const review = action.payload;
      const venueId = review.venueId;

      // Add to venue reviews
      if (!state.reviewsByVenue[venueId]) {
        state.reviewsByVenue[venueId] = [];
      }
      state.reviewsByVenue[venueId].unshift(review);

      // Add to user reviews
      state.userReviews.unshift(review);

      // Update stats
      if (state.statsByVenue[venueId]) {
        const stats = state.statsByVenue[venueId];
        stats.totalReviews += 1;
        stats.ratingDistribution[review.rating] += 1;

        // Recalculate average
        const totalRating = Object.entries(stats.ratingDistribution).reduce(
          (sum, [rating, count]) => sum + parseInt(rating) * count,
          0
        );
        stats.averageRating = totalRating / stats.totalReviews;
      }
    },

    // Update a review
    updateReview: (state, action: PayloadAction<Review>) => {
      const review = action.payload;
      const venueId = review.venueId;

      // Update in venue reviews
      if (state.reviewsByVenue[venueId]) {
        const index = state.reviewsByVenue[venueId].findIndex(r => r.id === review.id);
        if (index !== -1) {
          state.reviewsByVenue[venueId][index] = review;
        }
      }

      // Update in user reviews
      const userIndex = state.userReviews.findIndex(r => r.id === review.id);
      if (userIndex !== -1) {
        state.userReviews[userIndex] = review;
      }
    },

    // Delete a review
    deleteReview: (state, action: PayloadAction<{ reviewId: string; venueId: string }>) => {
      const { reviewId, venueId } = action.payload;

      // Remove from venue reviews
      if (state.reviewsByVenue[venueId]) {
        state.reviewsByVenue[venueId] = state.reviewsByVenue[venueId].filter(
          r => r.id !== reviewId
        );
      }

      // Remove from user reviews
      state.userReviews = state.userReviews.filter(r => r.id !== reviewId);
    },

    // Vote on review (helpful/not helpful)
    voteOnReview: (
      state,
      action: PayloadAction<{ reviewId: string; venueId: string; vote: 'helpful' | 'not_helpful' }>
    ) => {
      const { reviewId, venueId, vote } = action.payload;

      const review = state.reviewsByVenue[venueId]?.find(r => r.id === reviewId);
      if (review) {
        const previousVote = review.userVote;

        // Remove previous vote counts
        if (previousVote === 'helpful') {
          review.helpfulCount--;
        } else if (previousVote === 'not_helpful') {
          review.notHelpfulCount--;
        }

        // Add new vote counts
        if (vote === 'helpful') {
          review.helpfulCount++;
        } else {
          review.notHelpfulCount++;
        }

        review.userVote = vote;
      }
    },

    // Report a review
    reportReview: (state, action: PayloadAction<{ reviewId: string; venueId: string }>) => {
      const { reviewId, venueId } = action.payload;

      const review = state.reviewsByVenue[venueId]?.find(r => r.id === reviewId);
      if (review) {
        review.isReported = true;
      }
    },

    // Set review stats for a venue
    setVenueStats: (state, action: PayloadAction<{ venueId: string; stats: ReviewStats }>) => {
      const { venueId, stats } = action.payload;
      state.statsByVenue[venueId] = stats;
    },

    // Set user reviews
    setUserReviews: (state, action: PayloadAction<Review[]>) => {
      state.userReviews = action.payload;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<Partial<ReviewFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = { sortBy: 'recent' };
    },

    // UI State
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setVenueReviews,
  addReview,
  updateReview,
  deleteReview,
  voteOnReview,
  reportReview,
  setVenueStats,
  setUserReviews,
  setFilters,
  clearFilters,
  setLoading,
  setError,
} = reviewSlice.actions;

export default reviewSlice.reducer;
