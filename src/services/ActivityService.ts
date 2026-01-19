/**
 * Activity Service
 * Handles user activity tracking and history
 */

import { Activity, ActivityGroup, ActivityStats, ActivityType } from '../types/activity.types';

export class ActivityService {
  /**
   * Get user activity history
   */
  static getUserActivities(userId: string): Activity[] {
    // Mock activity data - would fetch from backend in production
    const now = new Date();

    return [
      {
        id: 'act_1',
        userId,
        type: 'venue_visit',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        venueId: 'venue_1',
        venueName: 'The Baxter Inn',
        title: 'Visited venue',
        description: 'Checked out The Baxter Inn',
        iconName: 'store',
        iconColor: '#2196F3',
      },
      {
        id: 'act_2',
        userId,
        type: 'special_saved',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        venueId: 'venue_2',
        venueName: 'The Glenmore Hotel',
        specialId: 'special_1',
        specialTitle: '$5 House Cocktails',
        title: 'Saved special',
        description: '$5 House Cocktails at The Glenmore Hotel',
        iconName: 'bookmark',
        iconColor: '#FFB700',
      },
      {
        id: 'act_3',
        userId,
        type: 'review_submitted',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        venueId: 'venue_3',
        venueName: 'Frankie\'s Pizza',
        reviewId: 'review_1',
        metadata: { rating: 6 },
        title: 'Submitted review',
        description: 'Reviewed Frankie\'s Pizza - 6/7 stars',
        iconName: 'star',
        iconColor: '#4CAF50',
      },
      {
        id: 'act_4',
        userId,
        type: 'venue_favorite',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
        venueId: 'venue_1',
        venueName: 'The Baxter Inn',
        title: 'Added to favorites',
        description: 'Favorited The Baxter Inn',
        iconName: 'heart',
        iconColor: '#E91E63',
      },
      {
        id: 'act_5',
        userId,
        type: 'event_going',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        venueId: 'venue_2',
        venueName: 'The Glenmore Hotel',
        eventId: 'event_1',
        eventName: 'Pub Trivia Night',
        title: 'Marked as going',
        description: 'Going to Pub Trivia Night at The Glenmore Hotel',
        iconName: 'calendar-check',
        iconColor: '#9C27B0',
      },
      {
        id: 'act_6',
        userId,
        type: 'credit_earned',
        timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: { creditAmount: 10 },
        title: 'Earned credits',
        description: 'Received $10 signup bonus',
        iconName: 'currency-usd',
        iconColor: '#4CAF50',
      },
      {
        id: 'act_7',
        userId,
        type: 'badge_earned',
        timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        badgeId: 'badge_1',
        badgeName: 'First Review',
        title: 'Earned badge',
        description: 'Unlocked the "First Review" badge',
        iconName: 'trophy',
        iconColor: '#FFB700',
      },
      {
        id: 'act_8',
        userId,
        type: 'special_redeemed',
        timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        venueId: 'venue_4',
        venueName: 'The Norfolk Hotel',
        specialId: 'special_2',
        specialTitle: 'Happy Hour Beers',
        title: 'Redeemed special',
        description: 'Used Happy Hour Beers at The Norfolk Hotel',
        iconName: 'ticket',
        iconColor: '#FF5722',
      },
      {
        id: 'act_9',
        userId,
        type: 'search_saved',
        timestamp: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: { searchName: 'Weekend Specials' },
        title: 'Saved search',
        description: 'Saved search: Weekend Specials',
        iconName: 'magnify',
        iconColor: '#607D8B',
      },
      {
        id: 'act_10',
        userId,
        type: 'referral_sent',
        timestamp: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Sent referral',
        description: 'Invited a friend to PubMate',
        iconName: 'account-multiple-plus',
        iconColor: '#00BCD4',
      },
    ];
  }

  /**
   * Group activities by date
   */
  static groupActivitiesByDate(activities: Activity[]): ActivityGroup[] {
    const groups: { [key: string]: Activity[] } = {};
    const now = new Date();
    const today = this.getDateKey(now);
    const yesterday = this.getDateKey(new Date(now.getTime() - 24 * 60 * 60 * 1000));

    // Group activities by date
    activities.forEach((activity) => {
      const date = new Date(activity.timestamp);
      const dateKey = this.getDateKey(date);

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    });

    // Convert to array and sort by date (newest first)
    const groupArray: ActivityGroup[] = Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map((dateKey) => {
        let displayDate = dateKey;

        if (dateKey === today) {
          displayDate = 'Today';
        } else if (dateKey === yesterday) {
          displayDate = 'Yesterday';
        } else {
          const date = new Date(dateKey);
          displayDate = date.toLocaleDateString('en-AU', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        }

        return {
          date: dateKey,
          displayDate,
          activities: groups[dateKey].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ),
        };
      });

    return groupArray;
  }

  /**
   * Get activity statistics
   */
  static getActivityStats(activities: Activity[]): ActivityStats {
    return {
      totalActivities: activities.length,
      venueVisits: activities.filter((a) => a.type === 'venue_visit').length,
      reviewsSubmitted: activities.filter((a) => a.type === 'review_submitted').length,
      specialsSaved: activities.filter((a) => a.type === 'special_saved').length,
      eventsAttended: activities.filter((a) => a.type === 'event_going').length,
      creditsEarned: activities
        .filter((a) => a.type === 'credit_earned')
        .reduce((sum, a) => sum + (a.metadata?.creditAmount || 0), 0),
      badgesEarned: activities.filter((a) => a.type === 'badge_earned').length,
      favoriteVenues: activities.filter((a) => a.type === 'venue_favorite').length,
    };
  }

  /**
   * Filter activities by type
   */
  static filterActivitiesByType(activities: Activity[], types: ActivityType[]): Activity[] {
    if (types.length === 0) return activities;
    return activities.filter((activity) => types.includes(activity.type));
  }

  /**
   * Track new activity (would send to backend in production)
   */
  static async trackActivity(
    userId: string,
    type: ActivityType,
    data: Partial<Activity>
  ): Promise<Activity> {
    const activity: Activity = {
      id: `act_${Date.now()}`,
      userId,
      type,
      timestamp: new Date().toISOString(),
      title: data.title || this.getDefaultTitle(type),
      description: data.description || '',
      iconName: data.iconName || this.getDefaultIcon(type),
      iconColor: data.iconColor || this.getDefaultColor(type),
      ...data,
    };

    // In production, would send to backend API
    console.log('Activity tracked:', activity);

    return activity;
  }

  /**
   * Helper: Get date key (YYYY-MM-DD)
   */
  private static getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Helper: Get default title for activity type
   */
  private static getDefaultTitle(type: ActivityType): string {
    const titles: { [key in ActivityType]: string } = {
      venue_visit: 'Visited venue',
      venue_favorite: 'Added to favorites',
      venue_unfavorite: 'Removed from favorites',
      review_submitted: 'Submitted review',
      review_helpful: 'Marked review helpful',
      special_saved: 'Saved special',
      special_redeemed: 'Redeemed special',
      event_going: 'Marked as going',
      event_interested: 'Marked as interested',
      search_saved: 'Saved search',
      credit_earned: 'Earned credits',
      credit_spent: 'Spent credits',
      referral_sent: 'Sent referral',
      badge_earned: 'Earned badge',
    };
    return titles[type];
  }

  /**
   * Helper: Get default icon for activity type
   */
  private static getDefaultIcon(type: ActivityType): string {
    const icons: { [key in ActivityType]: string } = {
      venue_visit: 'store',
      venue_favorite: 'heart',
      venue_unfavorite: 'heart-outline',
      review_submitted: 'star',
      review_helpful: 'thumb-up',
      special_saved: 'bookmark',
      special_redeemed: 'ticket',
      event_going: 'calendar-check',
      event_interested: 'calendar-star',
      search_saved: 'magnify',
      credit_earned: 'currency-usd',
      credit_spent: 'currency-usd',
      referral_sent: 'account-multiple-plus',
      badge_earned: 'trophy',
    };
    return icons[type];
  }

  /**
   * Helper: Get default color for activity type
   */
  private static getDefaultColor(type: ActivityType): string {
    const colors: { [key in ActivityType]: string } = {
      venue_visit: '#2196F3',
      venue_favorite: '#E91E63',
      venue_unfavorite: '#999',
      review_submitted: '#4CAF50',
      review_helpful: '#2196F3',
      special_saved: '#FFB700',
      special_redeemed: '#FF5722',
      event_going: '#9C27B0',
      event_interested: '#9C27B0',
      search_saved: '#607D8B',
      credit_earned: '#4CAF50',
      credit_spent: '#F44336',
      referral_sent: '#00BCD4',
      badge_earned: '#FFB700',
    };
    return colors[type];
  }
}
