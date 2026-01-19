import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { ViewMode } from '../../types/venue.types';

interface ViewToggleProps {
  viewMode: ViewMode;
  onToggle: () => void;
}

export default function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  return (
    <FAB
      icon={viewMode === 'map' ? 'format-list-bulleted' : 'map-marker'}
      label={viewMode === 'map' ? 'Show list' : 'Show map'}
      style={styles.fab}
      onPress={onToggle}
      color="#fff"
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    backgroundColor: '#FFB700',
  },
});
