import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Chip, Button, Portal, Modal, IconButton } from 'react-native-paper';
import { VenueFilters, AdvancedVenueFilters, WHAT_FILTER_OPTIONS, WHEN_FILTER_OPTIONS, CATEGORY_QUICK_FILTERS } from '../../types/venue.types';
import { AUSTRALIAN_CITIES } from '../../types/user.types';
import { pubmateColors } from '../../theme';
import AdvancedFilters from './AdvancedFilters';

interface SearchFiltersProps {
  filters: VenueFilters;
  onFiltersChange: (filters: VenueFilters) => void;
  resultCount: number;
  advancedFilters?: AdvancedVenueFilters;
  onAdvancedFiltersChange?: (filters: AdvancedVenueFilters) => void;
  onSaveSearch?: (name: string) => void;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  resultCount,
  advancedFilters = {},
  onAdvancedFiltersChange,
  onSaveSearch,
}: SearchFiltersProps) {
  const [whatModalVisible, setWhatModalVisible] = useState(false);
  const [whereModalVisible, setWhereModalVisible] = useState(false);
  const [whenModalVisible, setWhenModalVisible] = useState(false);
  const [advancedModalVisible, setAdvancedModalVisible] = useState(false);

  const handleQuickFilterPress = (filterId: string) => {
    // TODO: Implement quick filter logic
    onFiltersChange({ ...filters, searchQuery: filterId });
  };

  return (
    <View style={styles.container}>
      {/* Main Filter Tabs */}
      <View style={styles.mainFilters}>
        <Button
          mode={filters.what && filters.what.length > 0 ? "contained" : "outlined"}
          onPress={() => setWhatModalVisible(true)}
          style={[styles.filterButton, (filters.what && filters.what.length > 0) ? styles.activeButton : undefined]}
          contentStyle={styles.filterButtonContent}
          textColor={filters.what && filters.what.length > 0 ? '#fff' : pubmateColors.charcoal}
          buttonColor={filters.what && filters.what.length > 0 ? pubmateColors.orange : undefined}
        >
          {filters.what && filters.what.length > 0
            ? WHAT_FILTER_OPTIONS.find(o => o.id === filters.what![0])?.label || 'What'
            : 'What'}
        </Button>
        <Button
          mode={filters.where ? "contained" : "outlined"}
          onPress={() => setWhereModalVisible(true)}
          style={[styles.filterButton, filters.where ? styles.activeButton : undefined]}
          contentStyle={styles.filterButtonContent}
          textColor={filters.where ? '#fff' : pubmateColors.charcoal}
          buttonColor={filters.where ? pubmateColors.orange : undefined}
        >
          {filters.where === 'nearest' ? 'Nearest' : filters.where || 'Where'}
        </Button>
        <Button
          mode={filters.when && filters.when.length > 0 ? "contained" : "outlined"}
          onPress={() => setWhenModalVisible(true)}
          style={[styles.filterButton, (filters.when && filters.when.length > 0) ? styles.activeButton : undefined]}
          contentStyle={styles.filterButtonContent}
          textColor={filters.when && filters.when.length > 0 ? '#fff' : pubmateColors.charcoal}
          buttonColor={filters.when && filters.when.length > 0 ? pubmateColors.orange : undefined}
        >
          {filters.when && filters.when.length > 0
            ? WHEN_FILTER_OPTIONS.find(o => o.id === filters.when![0])?.label || 'When'
            : 'When'}
        </Button>
        <IconButton
          icon="tune"
          mode="contained"
          containerColor="#F5F5F5"
          iconColor={pubmateColors.charcoal}
          size={24}
          onPress={() => setAdvancedModalVisible(true)}
        />
      </View>

      {/* Quick Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickFilters}
      >
        {CATEGORY_QUICK_FILTERS.map((filter) => (
          <Chip
            key={filter.id}
            selected={filters.searchQuery === filter.id}
            onPress={() => handleQuickFilterPress(filter.id)}
            icon={filter.icon}
            style={styles.chip}
          >
            {filter.label}
          </Chip>
        ))}
      </ScrollView>

      {/* Result Count */}
      <View style={styles.resultCount}>
        <Text variant="bodySmall" style={styles.resultText}>
          {resultCount} specials found
        </Text>
      </View>

      {/* What Modal */}
      <Portal>
        <Modal
          visible={whatModalVisible}
          onDismiss={() => setWhatModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            What
          </Text>
          <Text variant="bodyMedium" style={styles.modalSubtitle}>
            Select
          </Text>
          <View style={styles.optionsList}>
            {WHAT_FILTER_OPTIONS.map((option) => (
              <Button
                key={option.id}
                mode="outlined"
                onPress={() => {
                  onFiltersChange({ ...filters, what: [option.id] });
                  setWhatModalVisible(false);
                }}
                style={styles.optionButton}
              >
                {option.label}
              </Button>
            ))}
          </View>
        </Modal>
      </Portal>

      {/* Where Modal */}
      <Portal>
        <Modal
          visible={whereModalVisible}
          onDismiss={() => setWhereModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Where
          </Text>
          <Text variant="bodyMedium" style={styles.modalSubtitle}>
            Select
          </Text>
          <ScrollView style={styles.scrollModal}>
            <Button
              mode="outlined"
              onPress={() => {
                onFiltersChange({ ...filters, where: 'nearest' });
                setWhereModalVisible(false);
              }}
              style={styles.optionButton}
            >
              Nearest
            </Button>
            {AUSTRALIAN_CITIES.map((city) => (
              <Button
                key={city.id}
                mode="outlined"
                onPress={() => {
                  onFiltersChange({ ...filters, where: city.label });
                  setWhereModalVisible(false);
                }}
                style={styles.optionButton}
              >
                {city.label}
              </Button>
            ))}
          </ScrollView>
        </Modal>
      </Portal>

      {/* When Modal */}
      <Portal>
        <Modal
          visible={whenModalVisible}
          onDismiss={() => setWhenModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            When
          </Text>
          <Text variant="bodyMedium" style={styles.modalSubtitle}>
            Select
          </Text>
          <View style={styles.optionsList}>
            {WHEN_FILTER_OPTIONS.map((option) => (
              <Button
                key={option.id}
                mode="outlined"
                onPress={() => {
                  onFiltersChange({ ...filters, when: [option.id] });
                  setWhenModalVisible(false);
                }}
                style={styles.optionButton}
              >
                {option.label}
              </Button>
            ))}
          </View>
        </Modal>
      </Portal>

      {/* Advanced Filters Modal */}
      <Portal>
        <Modal
          visible={advancedModalVisible}
          onDismiss={() => setAdvancedModalVisible(false)}
          contentContainerStyle={styles.fullScreenModal}
        >
          <AdvancedFilters
            filters={advancedFilters}
            onFiltersChange={(newFilters) => {
              if (onAdvancedFiltersChange) {
                onAdvancedFiltersChange(newFilters);
              }
            }}
            onClose={() => setAdvancedModalVisible(false)}
            onSaveSearch={onSaveSearch}
          />
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 8,
  },
  mainFilters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    borderRadius: 8,
  },
  activeButton: {
    borderColor: pubmateColors.orange,
  },
  filterButtonContent: {
    height: 40,
  },
  filterIcon: {
    width: 48,
  },
  quickFilters: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    marginRight: 0,
  },
  resultCount: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultText: {
    color: '#666',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 8,
  },
  modalSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
  scrollModal: {
    maxHeight: 400,
  },
  optionsList: {
    gap: 8,
  },
  optionButton: {
    marginBottom: 8,
  },
  fullScreenModal: {
    flex: 1,
    margin: 0,
    backgroundColor: '#fff',
  },
});
