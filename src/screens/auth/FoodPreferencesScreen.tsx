import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Text, Button, Chip, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateOnboardingData } from '../../store/slices/authSlice';
import { FOOD_DRINK_CATEGORIES, FoodDrinkCategory } from '../../types/user.types';
import { ProgressBar } from '../../components/auth';
import { pubmateColors } from '../../theme';

type FoodPreferencesScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'FoodPreferences'
>;

export default function FoodPreferencesScreen() {
  const navigation = useNavigation<FoodPreferencesScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [selectedPreferences, setSelectedPreferences] = useState<FoodDrinkCategory[]>([]);

  const togglePreference = (preference: FoodDrinkCategory) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  const selectAll = () => {
    if (selectedPreferences.length === FOOD_DRINK_CATEGORIES.length) {
      setSelectedPreferences([]);
    } else {
      setSelectedPreferences(FOOD_DRINK_CATEGORIES.map((cat) => cat.id as FoodDrinkCategory));
    }
  };

  const handleNext = () => {
    dispatch(updateOnboardingData({ foodDrinkPreferences: selectedPreferences }));
    navigation.navigate('PaymentMethod');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <IconButton
          icon="chevron-left"
          size={30}
          onPress={() => navigation.goBack()}
          iconColor={pubmateColors.charcoal}
        />
        <ProgressBar currentStep={6} totalSteps={8} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text style={styles.emoji}>🍔</Text>
          <Text style={styles.title}>What's your vibe?</Text>
          <Text style={styles.subtitle}>
            Select your favorite pub treats and we'll notify you about the best deals.
          </Text>
        </View>

        <View style={styles.actionRow}>
          <Text style={styles.sectionTitle}>Pick at least 3</Text>
          <Button
            mode="text"
            onPress={selectAll}
            textColor={pubmateColors.orange}
            labelStyle={styles.selectAllLabel}
          >
            {selectedPreferences.length === FOOD_DRINK_CATEGORIES.length ? 'Deselect All' : 'Select All'}
          </Button>
        </View>

        <View style={styles.chipContainer}>
          {FOOD_DRINK_CATEGORIES.map((category) => {
            const isSelected = selectedPreferences.includes(category.id as FoodDrinkCategory);
            return (
              <Chip
                key={category.id}
                selected={isSelected}
                onPress={() => togglePreference(category.id as FoodDrinkCategory)}
                icon={category.icon}
                style={[
                  styles.chip,
                  isSelected && styles.chipSelected,
                ]}
                textStyle={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected
                ]}
                showSelectedOverlay
                selectedColor={isSelected ? '#FFF' : pubmateColors.charcoal}
              >
                {category.label}
              </Chip>
            );
          })}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            🍻 Note: You can change these preferences anytime in your profile.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleNext}
          disabled={selectedPreferences.length < 3}
          style={[
            styles.nextButton,
            selectedPreferences.length < 3 && styles.disabledButton
          ]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {selectedPreferences.length < 3
            ? `Select ${3 - selectedPreferences.length} more`
            : 'Looking Good!'
          }
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    paddingHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: pubmateColors.charcoal,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: pubmateColors.charcoal,
  },
  selectAllLabel: {
    fontWeight: 'bold',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 32,
  },
  chip: {
    backgroundColor: '#F5F5F5',
    borderWidth: 0,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: pubmateColors.orange,
  },
  chipText: {
    fontSize: 15,
    color: pubmateColors.charcoal,
  },
  chipTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  infoText: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 0 : 24,
  },
  nextButton: {
    backgroundColor: pubmateColors.orange,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
