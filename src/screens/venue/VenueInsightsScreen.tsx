import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Surface, Card, Chip, IconButton, Divider, SegmentedButtons } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../../store';
import { fetchVenueInsights, dismissInsight, setInsightsFilter } from '../../store/slices/venueOwnerSlice';
import { pubmateColors } from '../../theme';
import { VenueInsight } from '../../types/venueOwner.types';

const { width } = Dimensions.get('window');

export default function VenueInsightsScreen() {
  const dispatch = useAppDispatch();
  const { isDark } = useAppSelector((state) => state.theme);
  const { insights, loading, insightsFilter, currentVenueId } = useAppSelector((state) => state.venueOwner);
  const [localFilter, setLocalFilter] = useState<string>(insightsFilter);

  useEffect(() => {
    if (currentVenueId) {
      dispatch(fetchVenueInsights(currentVenueId));
    }
  }, [currentVenueId, dispatch]);

  const handleDismissInsight = (insightId: string) => {
    dispatch(dismissInsight(insightId));
  };

  const handleFilterChange = (value: string) => {
    setLocalFilter(value);
    dispatch(setInsightsFilter(value as typeof insightsFilter));
  };

  const getFilteredInsights = () => {
    if (localFilter === 'all') return insights;
    if (localFilter === 'actionable') return insights.filter((i) => i.actionable);
    return insights.filter((i) => i.type === localFilter);
  };

  const filteredInsights = getFilteredInsights();

  const getInsightIcon = (type: VenueInsight['type']) => {
    switch (type) {
      case 'peak_hours':
        return 'clock-outline';
      case 'popular_day':
        return 'calendar-star';
      case 'customer_demographics':
        return 'account-group';
      case 'top_special':
        return 'star';
      case 'recommendation':
        return 'lightbulb-outline';
      default:
        return 'information-outline';
    }
  };

  const getInsightColor = (type: VenueInsight['type']) => {
    switch (type) {
      case 'peak_hours':
        return '#2196F3';
      case 'popular_day':
        return '#4CAF50';
      case 'customer_demographics':
        return '#9C27B0';
      case 'top_special':
        return pubmateColors.orange;
      case 'recommendation':
        return '#FF5722';
      default:
        return '#757575';
    }
  };

  const getTypeLabel = (type: VenueInsight['type']) => {
    switch (type) {
      case 'peak_hours':
        return 'Peak Hours';
      case 'popular_day':
        return 'Popular Day';
      case 'customer_demographics':
        return 'Demographics';
      case 'top_special':
        return 'Top Special';
      case 'recommendation':
        return 'Recommendation';
      default:
        return 'Insight';
    }
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Surface style={[styles.header, isDark && styles.headerDark]} elevation={0}>
        <Text variant="headlineSmall" style={[styles.headerTitle, isDark && styles.textDark]}>
          Insights & Recommendations
        </Text>
        <Text variant="bodyMedium" style={[styles.headerSubtext, isDark && styles.subtextDark]}>
          Data-driven insights to grow your business
        </Text>
      </Surface>

      {/* Filter */}
      <View style={styles.filterSection}>
        <SegmentedButtons
          value={localFilter}
          onValueChange={handleFilterChange}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'actionable', label: 'Actionable' },
            { value: 'peak_hours', label: 'Peak Hours' },
            { value: 'recommendation', label: 'Tips' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Summary Stats */}
      <View style={styles.statsRow}>
        <Surface style={[styles.statCard, isDark && styles.cardDark]} elevation={1}>
          <Text variant="headlineMedium" style={[styles.statValue, isDark && styles.textDark]}>
            {insights.length}
          </Text>
          <Text variant="bodySmall" style={[styles.statLabel, isDark && styles.subtextDark]}>
            Total Insights
          </Text>
        </Surface>

        <Surface style={[styles.statCard, isDark && styles.cardDark]} elevation={1}>
          <Text variant="headlineMedium" style={[styles.statValue, isDark && styles.textDark]}>
            {insights.filter((i) => i.actionable).length}
          </Text>
          <Text variant="bodySmall" style={[styles.statLabel, isDark && styles.subtextDark]}>
            Actionable
          </Text>
        </Surface>

        <Surface style={[styles.statCard, isDark && styles.cardDark]} elevation={1}>
          <Text variant="headlineMedium" style={[styles.statValue, { color: pubmateColors.orange }]}>
            {insights.filter((i) => i.type === 'recommendation').length}
          </Text>
          <Text variant="bodySmall" style={[styles.statLabel, isDark && styles.subtextDark]}>
            Tips
          </Text>
        </Surface>
      </View>

      {/* Insights List */}
      <View style={styles.insightsList}>
        {loading && (
          <Surface style={[styles.loadingCard, isDark && styles.cardDark]} elevation={1}>
            <Text variant="bodyMedium" style={isDark && styles.textDark}>
              Loading insights...
            </Text>
          </Surface>
        )}

        {!loading && filteredInsights.length === 0 && (
          <Surface style={[styles.emptyCard, isDark && styles.cardDark]} elevation={1}>
            <IconButton icon="lightbulb-outline" size={48} iconColor="#ccc" />
            <Text variant="titleMedium" style={[styles.emptyTitle, isDark && styles.textDark]}>
              No insights yet
            </Text>
            <Text variant="bodyMedium" style={[styles.emptyText, isDark && styles.subtextDark]}>
              Check back soon for personalized recommendations
            </Text>
          </Surface>
        )}

        {!loading &&
          filteredInsights.map((insight) => (
            <Card key={insight.id} style={[styles.insightCard, isDark && styles.cardDark]} mode="elevated">
              <Card.Content>
                <View style={styles.insightHeader}>
                  <View style={styles.insightHeaderLeft}>
                    <View style={[styles.iconCircle, { backgroundColor: getInsightColor(insight.type) + '20' }]}>
                      <IconButton
                        icon={getInsightIcon(insight.type)}
                        size={24}
                        iconColor={getInsightColor(insight.type)}
                        style={styles.insightIcon}
                      />
                    </View>
                    <View style={styles.insightHeaderText}>
                      <Text variant="titleMedium" style={[styles.insightTitle, isDark && styles.textDark]}>
                        {insight.title}
                      </Text>
                      <Chip
                        mode="outlined"
                        style={[styles.typeChip, { borderColor: getInsightColor(insight.type) }]}
                        textStyle={{ color: getInsightColor(insight.type), fontSize: 11 }}
                      >
                        {getTypeLabel(insight.type)}
                      </Chip>
                    </View>
                  </View>
                  <IconButton
                    icon="close"
                    size={20}
                    iconColor="#999"
                    onPress={() => handleDismissInsight(insight.id)}
                  />
                </View>

                <Divider style={styles.divider} />

                <Text variant="bodyMedium" style={[styles.insightDescription, isDark && styles.textDark]}>
                  {insight.description}
                </Text>

                {insight.data && (
                  <View style={styles.dataSection}>
                    {Object.entries(insight.data).map(([key, value]) => (
                      <View key={key} style={styles.dataRow}>
                        <Text variant="bodySmall" style={[styles.dataKey, isDark && styles.subtextDark]}>
                          {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:
                        </Text>
                        <Text variant="bodySmall" style={[styles.dataValue, isDark && styles.textDark]}>
                          {String(value)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {insight.actionable && insight.actionText && (
                  <View style={styles.actionSection}>
                    <Chip
                      icon="arrow-right"
                      mode="flat"
                      style={[styles.actionChip, { backgroundColor: pubmateColors.orange }]}
                      textStyle={styles.actionChipText}
                      onPress={() => {}}
                    >
                      {insight.actionText}
                    </Chip>
                  </View>
                )}

                <Text variant="bodySmall" style={[styles.insightDate, isDark && styles.subtextDark]}>
                  {new Date(insight.createdAt).toLocaleDateString('en-AU', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
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
  filterSection: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cardDark: {
    backgroundColor: '#1E1E1E',
  },
  statValue: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
    textAlign: 'center',
  },
  insightsList: {
    padding: 16,
    paddingTop: 0,
    gap: 16,
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
  insightCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    borderRadius: 24,
    marginRight: 12,
  },
  insightIcon: {
    margin: 0,
  },
  insightHeaderText: {
    flex: 1,
  },
  insightTitle: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
    marginBottom: 6,
  },
  typeChip: {
    alignSelf: 'flex-start',
    height: 24,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#E0E0E0',
  },
  insightDescription: {
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  dataSection: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataKey: {
    color: '#666',
    fontWeight: '600',
  },
  dataValue: {
    color: pubmateColors.charcoal,
    fontWeight: '700',
  },
  actionSection: {
    marginTop: 8,
  },
  actionChip: {
    alignSelf: 'flex-start',
  },
  actionChipText: {
    color: '#fff',
    fontWeight: '700',
  },
  insightDate: {
    color: '#999',
    marginTop: 12,
    fontSize: 11,
  },
});
