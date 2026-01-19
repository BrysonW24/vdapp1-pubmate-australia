/**
 * Recommendation Service
 * Generate personalized venue recommendations based on user preferences
 */

import { Venue, VenueListItem, VenueFilters } from '../types/venue.types';
import { User, FoodDrinkCategory } from '../types/user.types';

class RecommendationService {
  /**
   * Calculate recommendation score for a venue based on user preferences
   */
  calculateScore(venue: Venue, user: User): number {
    let score = 0;

    // Distance score (closer is better, max 30 points)
    if (venue.distance !== undefined) {
      const distanceScore = Math.max(0, 30 - venue.distance * 3);
      score += distanceScore;
    }

    // Food/drink preference match (max 40 points)
    const userPreferences = user.foodDrinkPreferences || [];
    const matchingCategories = this.getMatchingCategories(venue, userPreferences);
    const preferenceScore = (matchingCategories.length / userPreferences.length) * 40;
    score += preferenceScore;

    // Rating score (max 20 points)
    const ratingScore = (venue.rating / 7) * 20;
    score += ratingScore;

    // Insider pick bonus (10 points)
    if (venue.isInsiderPick) {
      score += 10;
    }

    // Specials count bonus (max 10 points)
    const specialsScore = Math.min(venue.specialsCount * 2, 10);
    score += specialsScore;

    // City match bonus (5 points)
    if (venue.city.toLowerCase() === user.city.toLowerCase()) {
      score += 5;
    }

    return Math.round(score);
  }

  /**
   * Get matching food/drink categories between venue and user preferences
   */
  private getMatchingCategories(venue: Venue, userPreferences: FoodDrinkCategory[]): string[] {
    // TODO: Extract categories from venue specials
    // For now, return mock data
    return userPreferences.slice(0, Math.floor(Math.random() * userPreferences.length));
  }

  /**
   * Generate personalized recommendations for user
   */
  async getRecommendations(
    venues: Venue[],
    user: User,
    limit: number = 20
  ): Promise<VenueListItem[]> {
    // Calculate scores for all venues
    const scoredVenues = venues.map((venue) => ({
      venue,
      score: this.calculateScore(venue, user),
    }));

    // Sort by score descending
    scoredVenues.sort((a, b) => b.score - a.score);

    // Convert to VenueListItem and return top N
    return scoredVenues.slice(0, limit).map(({ venue }) => this.toVenueListItem(venue));
  }

  /**
   * Get "For You" feed based on user's current location and preferences
   */
  async getForYouFeed(
    venues: Venue[],
    user: User,
    userLocation: { latitude: number; longitude: number } | null
  ): Promise<VenueListItem[]> {
    let filteredVenues = venues;

    // Filter by user's city if no location
    if (!userLocation && user.city) {
      filteredVenues = venues.filter(
        (v) => v.city.toLowerCase() === user.city.toLowerCase()
      );
    }

    // Filter by postcode proximity
    if (user.postcode) {
      filteredVenues = filteredVenues.filter((v) => {
        // TODO: Implement postcode proximity logic
        return true;
      });
    }

    return this.getRecommendations(filteredVenues, user, 20);
  }

  /**
   * Get recommended venues based on time of day
   */
  async getTimeBasedRecommendations(
    venues: Venue[],
    user: User,
    currentTime: Date = new Date()
  ): Promise<VenueListItem[]> {
    const hour = currentTime.getHours();
    const dayOfWeek = currentTime.toLocaleDateString('en-US', { weekday: 'long' });

    // Filter venues with active specials for current time
    const activeVenues = venues.filter((venue) => {
      // TODO: Check if venue has active specials for current time
      return true;
    });

    return this.getRecommendations(activeVenues, user, 10);
  }

  /**
   * Get similar venues based on a specific venue
   */
  async getSimilarVenues(
    targetVenue: Venue,
    allVenues: Venue[],
    limit: number = 5
  ): Promise<VenueListItem[]> {
    const scored = allVenues
      .filter((v) => v.id !== targetVenue.id)
      .map((venue) => ({
        venue,
        score: this.calculateSimilarityScore(targetVenue, venue),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored.map(({ venue }) => this.toVenueListItem(venue));
  }

  /**
   * Calculate similarity score between two venues
   */
  private calculateSimilarityScore(venue1: Venue, venue2: Venue): number {
    let score = 0;

    // Same suburb bonus
    if (venue1.suburb === venue2.suburb) score += 30;

    // Same city bonus
    if (venue1.city === venue2.city) score += 20;

    // Similar rating bonus
    const ratingDiff = Math.abs(venue1.rating - venue2.rating);
    score += Math.max(0, 20 - ratingDiff * 5);

    // Category overlap
    const categoryOverlap = venue1.categories.filter((c) =>
      venue2.categories.includes(c)
    ).length;
    score += categoryOverlap * 10;

    // Both insider picks
    if (venue1.isInsiderPick && venue2.isInsiderPick) score += 15;

    return score;
  }

  /**
   * Convert Venue to VenueListItem
   */
  private toVenueListItem(venue: Venue): VenueListItem {
    return {
      id: venue.id,
      name: venue.name,
      imageUrl: venue.imageUrl,
      rating: venue.rating,
      distance: venue.distance,
      specialsCount: venue.specialsCount,
      address: venue.address,
      isInsiderPick: venue.isInsiderPick,
      isFavorite: venue.isFavorite,
    };
  }

  /**
   * Get trending venues (most popular right now)
   */
  async getTrendingVenues(venues: Venue[], limit: number = 10): Promise<VenueListItem[]> {
    // Sort by combination of rating, specials count, and insider picks
    const trending = venues
      .map((venue) => ({
        venue,
        score:
          venue.rating * 10 +
          venue.specialsCount * 5 +
          (venue.isInsiderPick ? 20 : 0) +
          venue.reviewCount * 0.1,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return trending.map(({ venue }) => this.toVenueListItem(venue));
  }

  /**
   * Get new venues (recently added)
   */
  async getNewVenues(venues: Venue[], limit: number = 10): Promise<VenueListItem[]> {
    return venues
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
      .map((venue) => this.toVenueListItem(venue));
  }
}

export default new RecommendationService();
