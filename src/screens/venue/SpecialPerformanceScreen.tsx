import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Card, IconButton, SegmentedButtons, Divider } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchSpecialPerformance } from '../../store/slices/venueOwnerSlice';
import { pubmateColors } from '../../theme';
import { SpecialPerformance } from '../../types/venueOwner.types';

export default function SpecialPerformanceScreen() {
  const dispatch = useAppDispatch();
  const { isDark } = useAppSelector((state) => state.theme);
  const { specialPerformance, loading, currentVenueId } = useAppSelector((state) => state.venueOwner);
  const [period, setPeriod] = useState<string>('week');

  useEffect(() => {
    if (currentVenueId) {
      dispatch(fetchSpecialPerformance({ venueId: currentVenueId, period }));
    }
  }, [currentVenueId, period, dispatch]);

  const getTrendColor = (trend: SpecialPerformance['trend']) => {
    if (trend === 'up') return '#4CAF50';
    if (trend === 'down') return '#F44336';
    return '#757575';
  };

  const getTrendIcon = (trend: SpecialPerformance['trend']) => {
    if (trend === 'up') return 'trending-up';
    if (trend === 'down') return 'trending-down';
    return 'trending-neutral';
  };

  const getTotalRevenue = () => {
    return specialPerformance.reduce((sum, special) => sum + special.revenue, 0);
  };

  const getTotalConversions = () => {
    return specialPerformance.reduce((sum, special) => sum + special.conversions, 0);
  };

  const getAverageConversionRate = () => {
    if (specialPerformance.length === 0) return 0;
    const total = specialPerformance.reduce((sum, special) => sum + special.conversionRate, 0);
    return total / specialPerformance.length;
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Surface style={[styles.header, isDark && styles.headerDark]} elevation={0}>
        <Text variant="headlineSmall" style={[styles.headerTitle, isDark && styles.textDark]}>
          Special Performance
        </Text>
        <Text variant="bodyMedium" style={[styles.headerSubtext, isDark && styles.subtextDark]}>
          Track how your specials are performing
        </Text>
      </Surface>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <SegmentedButtons
          value={period}
          onValueChange={setPeriod}
          buttons={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Summary Stats */}
      <View style={styles.summarySection}>
        <Surface style={[styles.summaryCard, isDark && styles.cardDark]} elevation={1}>
          <Text variant="bodySmall" style={[styles.summaryLabel, isDark && styles.subtextDark]}>
            Total Revenue
          </Text>
          <Text variant="headlineMedium" style={[styles.summaryValue, { color: pubmateColors.orange }]}>
            ${getTotalRevenue().toLocaleString()}
          </Text>
        </Surface>

        <Surface style={[styles.summaryCard, isDark && styles.cardDark]} elevation={1}>
          <Text variant="bodySmall" style={[styles.summaryLabel, isDark && styles.subtextDark]}>
            Conversions
          </Text>
          <Text variant="headlineMedium" style={[styles.summaryValue, isDark && styles.textDark]}>
            {getTotalConversions()}
          </Text>
        </Surface>

        <Surface style={[styles.summaryCard, isDark && styles.cardDark]} elevation={1}>
          <Text variant="bodySmall" style={[styles.summaryLabel, isDark && styles.subtextDark]}>
            Avg Rate
          </Text>
          <Text variant="headlineMedium" style={[styles.summaryValue, isDark && styles.textDark]}>
            {getAverageConversionRate().toFixed(1)}%
          </Text>
        </Surface>
      </View>

      {/* Performance List */}
      <View style={styles.performanceList}>
        <Text variant="titleMedium" style={[styles.sectionTitle, isDark && styles.textDark]}>
          Special Breakdown
        </Text>

        {loading && (
          <Surface style={[styles.loadingCard, isDark && styles.cardDark]} elevation={1}>
            <Text variant="bodyMedium" style={isDark && styles.textDark}>
              Loading performance data...
            </Text>
          </Surface>
        )}

        {!loading && specialPerformance.length === 0 && (
          <Surface style={[styles.emptyCard, isDark && styles.cardDark]} elevation={1}>
            <IconButton icon="chart-bar" size={48} iconColor="#ccc" />
            <Text variant="titleMedium" style={[styles.emptyTitle, isDark && styles.textDark]}>
              No data yet
            </Text>
            <Text variant="bodyMedium" style={[styles.emptyText, isDark && styles.subtextDark]}>
              Create some specials to see performance data
            </Text>
          </Surface>
        )}

        {!loading &&
          specialPerformance.map((special, index) => (
            <Card
              key={special.specialId}
              style={[styles.performanceCard, isDark && styles.cardDark]}
              mode="elevated"
            >
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={[styles.rankBadge, { backgroundColor: pubmateColors.orange + '20' }]}>
                      <Text style={[styles.rankText, { color: pubmateColors.orange }]}>#{index + 1}</Text>
                    </View>
                    <Text variant="titleMedium" style={[styles.specialTitle, isDark && styles.textDark]}>
                      {special.title}
                    </Text>
                  </View>
                  <View style={styles.trendBadge}>
                    <IconButton
                      icon={getTrendIcon(special.trend)}
                      size={20}
                      iconColor={getTrendColor(special.trend)}
                      style={styles.trendIcon}
                    />
                  </View>
                </View>

                <Divider style={styles.divider} />

                {/* Metrics Grid */}
                <View style={styles.metricsGrid}>
                  <View style={styles.metric}>
                    <Text variant="bodySmall" style={[styles.metricLabel, isDark && styles.subtextDark]}>
                      Views
                    </Text>
                    <Text variant="titleLarge" style={[styles.metricValue, isDark && styles.textDark]}>
                      {special.views}
                    </Text>
                  </View>

                  <View style={styles.metric}>
                    <Text variant="bodySmall" style={[styles.metricLabel, isDark && styles.subtextDark]}>
                      Saves
                    </Text>
                    <Text variant="titleLarge" style={[styles.metricValue, isDark && styles.textDark]}>
                      {special.saves}
                    </Text>
                  </View>

                  <View style={styles.metric}>
                    <Text variant="bodySmall" style={[styles.metricLabel, isDark && styles.subtextDark]}>
                      Conversions
                    </Text>
                    <Text variant="titleLarge" style={[styles.metricValue, isDark && styles.textDark]}>
                      {special.conversions}
                    </Text>
                  </View>
                </View>

                <Divider style={styles.divider} />

                {/* Bottom Stats */}
                <View style={styles.bottomStats}>
                  <View style={styles.bottomStat}>
                    <IconButton icon="percent" size={16} iconColor={pubmateColors.orange} style={styles.statIcon} />
                    <View>
                      <Text variant="bodySmall" style={[styles.statLabel, isDark && styles.subtextDark]}>
                        Conversion Rate
                      </Text>
                      <Text variant="titleSmall" style={[styles.statValue, { color: pubmateColors.orange }]}>
                        {special.conversionRate.toFixed(1)}%
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bottomStat}>
                    <IconButton
                      icon="currency-usd"
                      size={16}
                      iconColor="#4CAF50"
                      style={styles.statIcon}
                    />
                    <View>
                      <Text variant="bodySmall" style={[styles.statLabel, isDark && styles.subtextDark]}>
                        Est. Revenue
                      </Text>
                      <Text variant="titleSmall" style={[styles.statValue, { color: '#4CAF50' }]}>
                        ${special.revenue}
                      </Text>
                    </View>
                  </View>
                </View>
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
  headerTitle: {
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
  summarySection: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cardDark: {
    backgroundColor: '#1E1E1E',
  },
  summaryLabel: {
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryValue: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
  },
  performanceList: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
    marginBottom: 16,
  },
  loadingCard: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyTitle: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
  performanceCard: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
  },
  specialTitle: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
    flex: 1,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    margin: 0,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#E0E0E0',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
  },
  bottomStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    margin: 0,
    marginRight: 8,
  },
  statLabel: {
    color: '#666',
    fontSize: 11,
  },
  statValue: {
    fontWeight: '700',
  },
});
