import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Surface, Card, SegmentedButtons, IconButton, Chip } from 'react-native-paper';
import { useAppSelector } from '../../store';
import { pubmateColors } from '../../theme';
import { VenueAnalytics, VenueInsight } from '../../types/venueOwner.types';

// Mock data for development
const mockAnalytics: VenueAnalytics = {
  venueId: 'venue_1',
  venueName: 'The Baxter Inn',
  period: 'week',
  totalViews: 1247,
  uniqueVisitors: 892,
  profileClicks: 234,
  directionsClicked: 156,
  phoneClicked: 89,
  websiteClicked: 67,
  totalReviews: 47,
  averageRating: 6.2,
  newReviews: 8,
  reviewResponses: 6,
  specialsViewed: 567,
  specialsSaved: 234,
  activeSpecials: 5,
  newFavorites: 34,
  totalFavorites: 456,
  eventsCreated: 2,
  eventRegistrations: 89,
  viewsTrend: 12.5,
  ratingTrend: 0.3,
  favoritesTrend: 8.2,
};

const mockInsights: VenueInsight[] = [
  {
    id: 'insight_1',
    venueId: 'venue_1',
    type: 'peak_hours',
    title: 'Peak Hours',
    description: 'Most profile views occur between 5-7pm on Fridays',
    actionable: true,
    actionText: 'Create special for this time',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'insight_2',
    venueId: 'venue_1',
    type: 'recommendation',
    title: 'Increase Response Rate',
    description: 'You have 2 new reviews awaiting response. Venues that respond quickly see 23% more engagement.',
    actionable: true,
    actionText: 'Respond to reviews',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'insight_3',
    venueId: 'venue_1',
    type: 'top_special',
    title: 'Top Performing Special',
    description: 'Your "$5 Cocktails" special has 89 saves and high conversion',
    actionable: false,
    createdAt: new Date().toISOString(),
  },
];

export default function VenueOwnerDashboardScreen() {
  const { isDark } = useAppSelector((state) => state.theme);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [analytics] = useState<VenueAnalytics>({ ...mockAnalytics, period });

  const getTrendColor = (trend: number) => {
    if (trend > 0) return '#4CAF50';
    if (trend < 0) return '#F44336';
    return '#757575';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return 'trending-up';
    if (trend < 0) return 'trending-down';
    return 'trending-neutral';
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]} showsVerticalScrollIndicator={false}>
      {/* Venue Header */}
      <Surface style={[styles.header, isDark && styles.headerDark]} elevation={0}>
        <Text variant="headlineSmall" style={[styles.venueName, isDark && styles.textDark]}>
          {analytics.venueName}
        </Text>
        <Text variant="bodyMedium" style={[styles.headerSubtext, isDark && styles.subtextDark]}>
          Owner Dashboard
        </Text>
      </Surface>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <SegmentedButtons
          value={period}
          onValueChange={(value) => setPeriod(value as typeof period)}
          buttons={[
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <Card style={[styles.metricCard, isDark && styles.cardDark]} mode="contained">
          <Card.Content>
            <View style={styles.metricHeader}>
              <Text variant="bodySmall" style={[styles.metricLabel, isDark && styles.textDark]}>
                Total Views
              </Text>
              <View style={styles.trendBadge}>
                <IconButton
                  icon={getTrendIcon(analytics.viewsTrend)}
                  size={16}
                  iconColor={getTrendColor(analytics.viewsTrend)}
                  style={styles.trendIcon}
                />
                <Text style={[styles.trendText, { color: getTrendColor(analytics.viewsTrend) }]}>
                  {analytics.viewsTrend > 0 ? '+' : ''}{analytics.viewsTrend}%
                </Text>
              </View>
            </View>
            <Text variant="headlineMedium" style={[styles.metricValue, isDark && styles.textDark]}>
              {analytics.totalViews.toLocaleString()}
            </Text>
            <Text variant="bodySmall" style={[styles.metricSubtext, isDark && styles.subtextDark]}>
              {analytics.uniqueVisitors.toLocaleString()} unique visitors
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.metricCard, isDark && styles.cardDark]} mode="contained">
          <Card.Content>
            <View style={styles.metricHeader}>
              <Text variant="bodySmall" style={[styles.metricLabel, isDark && styles.textDark]}>
                Average Rating
              </Text>
              <View style={styles.trendBadge}>
                <IconButton
                  icon={getTrendIcon(analytics.ratingTrend)}
                  size={16}
                  iconColor={getTrendColor(analytics.ratingTrend)}
                  style={styles.trendIcon}
                />
                <Text style={[styles.trendText, { color: getTrendColor(analytics.ratingTrend) }]}>
                  {analytics.ratingTrend > 0 ? '+' : ''}{analytics.ratingTrend}
                </Text>
              </View>
            </View>
            <Text variant="headlineMedium" style={[styles.metricValue, isDark && styles.textDark]}>
              {analytics.averageRating.toFixed(1)}/7
            </Text>
            <Text variant="bodySmall" style={[styles.metricSubtext, isDark && styles.subtextDark]}>
              {analytics.totalReviews} reviews
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.metricCard, isDark && styles.cardDark]} mode="contained">
          <Card.Content>
            <View style={styles.metricHeader}>
              <Text variant="bodySmall" style={[styles.metricLabel, isDark && styles.textDark]}>
                Favorites
              </Text>
              <View style={styles.trendBadge}>
                <IconButton
                  icon={getTrendIcon(analytics.favoritesTrend)}
                  size={16}
                  iconColor={getTrendColor(analytics.favoritesTrend)}
                  style={styles.trendIcon}
                />
                <Text style={[styles.trendText, { color: getTrendColor(analytics.favoritesTrend) }]}>
                  {analytics.favoritesTrend > 0 ? '+' : ''}{analytics.favoritesTrend}%
                </Text>
              </View>
            </View>
            <Text variant="headlineMedium" style={[styles.metricValue, isDark && styles.textDark]}>
              {analytics.totalFavorites}
            </Text>
            <Text variant="bodySmall" style={[styles.metricSubtext, isDark && styles.subtextDark]}>
              +{analytics.newFavorites} new this {period}
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.metricCard, isDark && styles.cardDark]} mode="contained">
          <Card.Content>
            <Text variant="bodySmall" style={[styles.metricLabel, isDark && styles.textDark]}>
              Active Specials
            </Text>
            <Text variant="headlineMedium" style={[styles.metricValue, isDark && styles.textDark]}>
              {analytics.activeSpecials}
            </Text>
            <Text variant="bodySmall" style={[styles.metricSubtext, isDark && styles.subtextDark]}>
              {analytics.specialsViewed} views, {analytics.specialsSaved} saves
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Engagement Breakdown */}
      <Surface style={[styles.section, isDark && styles.sectionDark]} elevation={1}>
        <Text variant="titleMedium" style={[styles.sectionTitle, isDark && styles.textDark]}>
          Engagement
        </Text>
        <View style={styles.engagementList}>
          <View style={styles.engagementRow}>
            <IconButton icon="eye" size={20} iconColor={pubmateColors.orange} />
            <View style={styles.engagementContent}>
              <Text variant="bodyMedium" style={isDark && styles.textDark}>Profile Clicks</Text>
              <Text variant="bodySmall" style={[styles.engagementValue, isDark && styles.subtextDark]}>
                {analytics.profileClicks}
              </Text>
            </View>
          </View>

          <View style={styles.engagementRow}>
            <IconButton icon="map-marker" size={20} iconColor={pubmateColors.orange} />
            <View style={styles.engagementContent}>
              <Text variant="bodyMedium" style={isDark && styles.textDark}>Directions</Text>
              <Text variant="bodySmall" style={[styles.engagementValue, isDark && styles.subtextDark]}>
                {analytics.directionsClicked}
              </Text>
            </View>
          </View>

          <View style={styles.engagementRow}>
            <IconButton icon="phone" size={20} iconColor={pubmateColors.orange} />
            <View style={styles.engagementContent}>
              <Text variant="bodyMedium" style={isDark && styles.textDark}>Phone Calls</Text>
              <Text variant="bodySmall" style={[styles.engagementValue, isDark && styles.subtextDark]}>
                {analytics.phoneClicked}
              </Text>
            </View>
          </View>

          <View style={styles.engagementRow}>
            <IconButton icon="web" size={20} iconColor={pubmateColors.orange} />
            <View style={styles.engagementContent}>
              <Text variant="bodyMedium" style={isDark && styles.textDark}>Website Visits</Text>
              <Text variant="bodySmall" style={[styles.engagementValue, isDark && styles.subtextDark]}>
                {analytics.websiteClicked}
              </Text>
            </View>
          </View>
        </View>
      </Surface>

      {/* Reviews */}
      <Surface style={[styles.section, isDark && styles.sectionDark]} elevation={1}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={[styles.sectionTitle, isDark && styles.textDark]}>
            Reviews
          </Text>
          {analytics.newReviews > 0 && (
            <Chip
              mode="flat"
              style={[styles.newBadge, { backgroundColor: pubmateColors.orange }]}
              textStyle={styles.newBadgeText}
            >
              {analytics.newReviews} New
            </Chip>
          )}
        </View>
        <View style={styles.reviewStats}>
          <View style={styles.reviewStat}>
            <Text variant="headlineSmall" style={[styles.reviewStatValue, isDark && styles.textDark]}>
              {analytics.totalReviews}
            </Text>
            <Text variant="bodySmall" style={[styles.reviewStatLabel, isDark && styles.subtextDark]}>
              Total Reviews
            </Text>
          </View>
          <View style={styles.reviewStat}>
            <Text variant="headlineSmall" style={[styles.reviewStatValue, isDark && styles.textDark]}>
              {analytics.reviewResponses}
            </Text>
            <Text variant="bodySmall" style={[styles.reviewStatLabel, isDark && styles.subtextDark]}>
              Your Responses
            </Text>
          </View>
          <View style={styles.reviewStat}>
            <Text variant="headlineSmall" style={[styles.reviewStatValue, isDark && styles.textDark]}>
              {Math.round((analytics.reviewResponses / analytics.totalReviews) * 100)}%
            </Text>
            <Text variant="bodySmall" style={[styles.reviewStatLabel, isDark && styles.subtextDark]}>
              Response Rate
            </Text>
          </View>
        </View>
      </Surface>

      {/* Insights */}
      <View style={styles.insightsSection}>
        <Text variant="titleMedium" style={[styles.sectionTitle, isDark && styles.textDark, { marginBottom: 12 }]}>
          Insights & Recommendations
        </Text>
        {mockInsights.map((insight) => (
          <Card key={insight.id} style={[styles.insightCard, isDark && styles.cardDark]} mode="outlined">
            <Card.Content>
              <Text variant="titleSmall" style={[styles.insightTitle, isDark && styles.textDark]}>
                {insight.title}
              </Text>
              <Text variant="bodyMedium" style={[styles.insightDescription, isDark && styles.subtextDark]}>
                {insight.description}
              </Text>
              {insight.actionable && insight.actionText && (
                <Chip
                  icon="lightbulb-outline"
                  mode="outlined"
                  style={styles.actionChip}
                  textStyle={{ color: pubmateColors.orange }}
                  onPress={() => {}}
                >
                  {insight.actionText}
                </Chip>
              )}
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerDark: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#3D3D3D',
  },
  venueName: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
    marginBottom: 4,
  },
  headerSubtext: {
    color: '#666',
  },
  textDark: {
    color: '#E1E1E1',
  },
  subtextDark: {
    color: '#999',
  },
  periodSelector: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: (Dimensions.get('window').width - 44) / 2,
    backgroundColor: '#fff',
  },
  cardDark: {
    backgroundColor: '#1E1E1E',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    color: '#666',
    fontWeight: '600',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    margin: 0,
    padding: 0,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },
  metricValue: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
    marginBottom: 4,
  },
  metricSubtext: {
    color: '#999',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
  },
  sectionDark: {
    backgroundColor: '#1E1E1E',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
  },
  newBadge: {
    height: 28,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  engagementList: {
    gap: 12,
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  engagementContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  engagementValue: {
    fontWeight: '700',
    color: '#666',
  },
  reviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  reviewStat: {
    flex: 1,
    alignItems: 'center',
  },
  reviewStatValue: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
    marginBottom: 4,
  },
  reviewStatLabel: {
    color: '#666',
    textAlign: 'center',
  },
  insightsSection: {
    padding: 16,
  },
  insightCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  insightTitle: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
    marginBottom: 8,
  },
  insightDescription: {
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionChip: {
    alignSelf: 'flex-start',
    borderColor: pubmateColors.orange,
  },
});
