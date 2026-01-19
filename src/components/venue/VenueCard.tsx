import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated, useWindowDimensions, Platform } from 'react-native';
import { Text, IconButton, Chip } from 'react-native-paper';
import { VenueListItem } from '../../types/venue.types';
import { pubmateColors } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface VenueCardProps {
  venue: VenueListItem;
  onPress: (venueId: string) => void;
  onFavoritePress: (venueId: string) => void;
}

export default function VenueCard({ venue, onPress, onFavoritePress }: VenueCardProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.container,
          isWeb && isLargeScreen && styles.containerDesktop
        ]}
        onPress={() => onPress(venue.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: venue.imageUrl }} style={styles.image} />
          {venue.isInsiderPick && (
            <View style={styles.insiderBadge}>
              <Icon name="star-circle" color="#fff" size={14} />
              <Text style={styles.insiderText}>INSIDER PICK</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.favoriteBadge}
            onPress={() => onFavoritePress(venue.id)}
          >
            <Icon
              name={venue.isFavorite ? 'heart' : 'heart-outline'}
              color={venue.isFavorite ? '#FF4081' : '#fff'}
              size={24}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.name} numberOfLines={1}>
              {venue.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" color={pubmateColors.orange} size={16} />
              <Text style={styles.ratingText}>{venue.rating.toFixed(1)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="map-marker" color="#999" size={14} />
            <Text style={styles.address} numberOfLines={1}>
              {venue.address}
            </Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.distance}>
              {venue.distance ? `${venue.distance.toFixed(1)}km` : 'Nearby'}
            </Text>
          </View>

          <View style={styles.specialsBanner}>
            <Icon name="tag" color={pubmateColors.orange} size={16} />
            <Text style={styles.specialsCount}>
              {venue.specialsCount} {venue.specialsCount === 1 ? 'special' : 'specials'} available
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  containerDesktop: {
    marginHorizontal: 12,
    marginVertical: 12,
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  insiderBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: pubmateColors.orange,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  insiderText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 4,
  },
  content: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: pubmateColors.charcoal,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: pubmateColors.charcoal,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    color: '#777',
    fontSize: 13,
    marginLeft: 4,
    flexShrink: 1,
  },
  dot: {
    color: '#CCC',
    marginHorizontal: 6,
  },
  distance: {
    color: pubmateColors.orange,
    fontSize: 13,
    fontWeight: '600',
  },
  specialsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  specialsCount: {
    color: pubmateColors.charcoal,
    fontSize: 14,
    fontWeight: '700',
  },
});
