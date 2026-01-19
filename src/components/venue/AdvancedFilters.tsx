import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Checkbox, Divider, SegmentedButtons, Switch, IconButton } from 'react-native-paper';
import { AdvancedVenueFilters } from '../../types/venue.types';
import { pubmateColors } from '../../theme';

interface AdvancedFiltersProps {
  filters: AdvancedVenueFilters;
  onFiltersChange: (filters: AdvancedVenueFilters) => void;
  onClose: () => void;
  onSaveSearch?: (name: string) => void;
}

const AMENITIES = [
  { id: 'wifi', label: 'Free WiFi' },
  { id: 'outdoorSeating', label: 'Outdoor Seating' },
  { id: 'liveMusic', label: 'Live Music' },
  { id: 'sportsTv', label: 'Sports TV' },
  { id: 'poolTable', label: 'Pool Table' },
  { id: 'darts', label: 'Darts' },
  { id: 'parking', label: 'Parking' },
  { id: 'wheelchairAccessible', label: 'Wheelchair Accessible' },
  { id: 'petFriendly', label: 'Pet Friendly' },
  { id: 'rooftopBar', label: 'Rooftop Bar' },
];

const PRICE_RANGES = [
  { id: '$', label: '$', description: 'Budget' },
  { id: '$$', label: '$$', description: 'Moderate' },
  { id: '$$$', label: '$$$', description: 'Expensive' },
  { id: '$$$$', label: '$$$$', description: 'Very Expensive' },
];

export default function AdvancedFilters({
  filters,
  onFiltersChange,
  onClose,
  onSaveSearch,
}: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<AdvancedVenueFilters>(filters);

  const handleAmenityToggle = (amenityId: string) => {
    const amenities = localFilters.amenities || [];
    const newAmenities = amenities.includes(amenityId)
      ? amenities.filter((a) => a !== amenityId)
      : [...amenities, amenityId];
    setLocalFilters({ ...localFilters, amenities: newAmenities });
  };

  const handlePriceRangeToggle = (priceRange: string) => {
    const priceRanges = localFilters.priceRange || [];
    const newPriceRanges = priceRanges.includes(priceRange)
      ? priceRanges.filter((p) => p !== priceRange)
      : [...priceRanges, priceRange];
    setLocalFilters({ ...localFilters, priceRange: newPriceRanges });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: AdvancedVenueFilters = {
      sortBy: 'distance',
      distance: 5,
      minRating: 1,
      openNow: false,
      hasSpecials: false,
      insiderPicksOnly: false,
      amenities: [],
      priceRange: [],
    };
    setLocalFilters(clearedFilters);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Advanced Filters
        </Text>
        <Button onPress={handleClear} mode="text">
          Clear All
        </Button>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sort By */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Sort By
          </Text>
          <SegmentedButtons
            value={localFilters.sortBy || 'distance'}
            onValueChange={(value) =>
              setLocalFilters({ ...localFilters, sortBy: value as any })
            }
            buttons={[
              { value: 'distance', label: 'Distance' },
              { value: 'rating', label: 'Rating' },
              { value: 'specials', label: 'Specials' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Distance */}
        <View style={styles.section}>
          <View style={styles.sliderHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Distance
            </Text>
            <Text variant="bodyMedium" style={styles.sliderValue}>
              {localFilters.distance || 5} km
            </Text>
          </View>
          <View style={styles.buttonSlider}>
            <IconButton
              icon="minus"
              size={20}
              onPress={() => {
                const current = localFilters.distance || 5;
                if (current > 1) {
                  setLocalFilters({ ...localFilters, distance: current - 1 });
                }
              }}
            />
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderFill,
                  { width: `${((localFilters.distance || 5) / 20) * 100}%` },
                ]}
              />
            </View>
            <IconButton
              icon="plus"
              size={20}
              onPress={() => {
                const current = localFilters.distance || 5;
                if (current < 20) {
                  setLocalFilters({ ...localFilters, distance: current + 1 });
                }
              }}
            />
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Minimum Rating */}
        <View style={styles.section}>
          <View style={styles.sliderHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Minimum Rating
            </Text>
            <Text variant="bodyMedium" style={styles.sliderValue}>
              {localFilters.minRating || 1}/7
            </Text>
          </View>
          <View style={styles.buttonSlider}>
            <IconButton
              icon="minus"
              size={20}
              onPress={() => {
                const current = localFilters.minRating || 1;
                if (current > 1) {
                  setLocalFilters({ ...localFilters, minRating: current - 1 });
                }
              }}
            />
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderFill,
                  { width: `${((localFilters.minRating || 1) / 7) * 100}%` },
                ]}
              />
            </View>
            <IconButton
              icon="plus"
              size={20}
              onPress={() => {
                const current = localFilters.minRating || 1;
                if (current < 7) {
                  setLocalFilters({ ...localFilters, minRating: current + 1 });
                }
              }}
            />
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Quick Toggles */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Quick Filters
          </Text>

          <View style={styles.switchRow}>
            <Text variant="bodyMedium">Open Now</Text>
            <Switch
              value={localFilters.openNow || false}
              onValueChange={(value) => setLocalFilters({ ...localFilters, openNow: value })}
              color={pubmateColors.orange}
            />
          </View>

          <View style={styles.switchRow}>
            <Text variant="bodyMedium">Has Active Specials</Text>
            <Switch
              value={localFilters.hasSpecials || false}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, hasSpecials: value })
              }
              color={pubmateColors.orange}
            />
          </View>

          <View style={styles.switchRow}>
            <Text variant="bodyMedium">Insider Picks Only</Text>
            <Switch
              value={localFilters.insiderPicksOnly || false}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, insiderPicksOnly: value })
              }
              color={pubmateColors.orange}
            />
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Price Range */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Price Range
          </Text>
          <View style={styles.checkboxGrid}>
            {PRICE_RANGES.map((price) => (
              <View key={price.id} style={styles.checkboxRow}>
                <Checkbox.Android
                  status={
                    (localFilters.priceRange || []).includes(price.id)
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={() => handlePriceRangeToggle(price.id)}
                  color={pubmateColors.orange}
                />
                <View style={styles.checkboxLabel}>
                  <Text variant="bodyMedium">{price.label}</Text>
                  <Text variant="bodySmall" style={styles.checkboxDescription}>
                    {price.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Amenities */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Amenities
          </Text>
          <View style={styles.checkboxGrid}>
            {AMENITIES.map((amenity) => (
              <View key={amenity.id} style={styles.checkboxRow}>
                <Checkbox.Android
                  status={
                    (localFilters.amenities || []).includes(amenity.id)
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={() => handleAmenityToggle(amenity.id)}
                  color={pubmateColors.orange}
                />
                <Text variant="bodyMedium" style={styles.checkboxText}>
                  {amenity.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {onSaveSearch && (
          <Button
            mode="outlined"
            onPress={() => onSaveSearch('My Search')}
            style={styles.saveButton}
            icon="bookmark-outline"
          >
            Save Search
          </Button>
        )}
        <Button
          mode="contained"
          onPress={handleApply}
          style={styles.applyButton}
          buttonColor={pubmateColors.orange}
        >
          Apply Filters
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
    color: pubmateColors.charcoal,
  },
  divider: {
    backgroundColor: '#E0E0E0',
  },
  segmentedButtons: {
    marginTop: 8,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sliderValue: {
    color: pubmateColors.orange,
    fontWeight: '600',
  },
  buttonSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: pubmateColors.orange,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkboxGrid: {
    gap: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  checkboxText: {
    marginLeft: 8,
    flex: 1,
  },
  checkboxLabel: {
    marginLeft: 8,
    flex: 1,
  },
  checkboxDescription: {
    color: '#666',
    marginTop: 2,
  },
  bottomPadding: {
    height: 16,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  saveButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
});
