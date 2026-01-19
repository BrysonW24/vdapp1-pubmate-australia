import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Chip, Button, Surface, Divider } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../../store';
import { updateFoodPreferences, updateLocation } from '../../store/slices/userSlice';
import { FOOD_DRINK_CATEGORIES, AUSTRALIAN_CITIES, FoodDrinkCategory } from '../../types/user.types';

import { pubmateColors } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export default function EditPreferencesScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.profile);

  const [selectedCategories, setSelectedCategories] = useState<FoodDrinkCategory[]>(
    (user?.foodDrinkPreferences as FoodDrinkCategory[]) || []
  );
  const [selectedCity, setSelectedCity] = useState(user?.city || '');

  const [isSaving, setIsSaving] = useState(false);

  const handleCategoryToggle = (categoryId: FoodDrinkCategory) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };


  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!user) return;

      await dispatch(updateFoodPreferences({ uid: user.uid, preferences: selectedCategories })).unwrap();

      if (selectedCity !== user.city) {
        const cityData = AUSTRALIAN_CITIES.find(c => c.label === selectedCity);
        if (cityData) {
          await dispatch(updateLocation({
            uid: user.uid,
            city: selectedCity,
            // You would get actual coordinates from a geocoding service
            coordinates: { latitude: -33.8688, longitude: 151.2093 },
          })).unwrap();
        }
      }


      navigation.goBack();
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Location Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Your Location
        </Text>
        <Text variant="bodySmall" style={styles.sectionDescription}>
          Select your primary city for personalized recommendations
        </Text>

        <Surface style={styles.card} elevation={0}>
          <View style={styles.cityGrid}>
            {AUSTRALIAN_CITIES.map((city) => (
              <Chip
                key={city.id}
                selected={selectedCity === city.label}
                onPress={() => setSelectedCity(city.label)}
                style={[
                  styles.cityChip,
                  selectedCity === city.label && styles.selectedChip
                ]}
                textStyle={[
                  styles.chipText,
                  selectedCity === city.label && styles.selectedChipText
                ]}
              >
                {city.label}
              </Chip>
            ))}
          </View>
        </Surface>
      </View>

      <Divider style={styles.divider} />

      {/* Food & Drink Preferences Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Food & Drink Preferences
            </Text>
            <Text variant="bodySmall" style={styles.sectionDescription}>
              Select all that interest you ({selectedCategories.length} selected)
            </Text>
          </View>
          {selectedCategories.length > 0 && (
            <Button
              mode="text"
              compact
              onPress={() => setSelectedCategories([])}
              textColor={pubmateColors.orange}
            >
              Clear All
            </Button>
          )}
        </View>

        <Surface style={styles.card} elevation={0}>
          <View style={styles.categoryGrid}>
            {FOOD_DRINK_CATEGORIES.map((category) => (
              <Chip
                key={category.id}
                icon={category.icon}
                selected={selectedCategories.includes(category.id)}
                onPress={() => handleCategoryToggle(category.id)}
                style={[
                  styles.categoryChip,
                  selectedCategories.includes(category.id) && styles.selectedChip
                ]}
                textStyle={[
                  styles.chipText,
                  selectedCategories.includes(category.id) && styles.selectedChipText
                ]}
              >
                {category.label}
              </Chip>
            ))}
          </View>
        </Surface>

        <Text variant="bodySmall" style={styles.helperText}>
          Your preferences help us recommend venues and specials you'll love
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
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving || selectedCategories.length === 0}
          style={styles.saveButton}
        >
          Save Changes
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
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 4,
    color: pubmateColors.charcoal,
  },
  sectionDescription: {
    color: '#666',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cityChip: {
    marginRight: 0,
    backgroundColor: '#F5F5F5',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    marginRight: 0,
    backgroundColor: '#F5F5F5',
  },
  selectedChip: {
    backgroundColor: pubmateColors.orange,
  },
  chipText: {
    fontSize: 13,
    color: pubmateColors.charcoal,
  },
  selectedChipText: {
    color: '#fff',
    fontWeight: '600',
  },
  helperText: {
    color: '#666',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  divider: {
    marginVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
    backgroundColor: pubmateColors.orange,
  },
  bottomPadding: {
    height: 32,
  },
});
