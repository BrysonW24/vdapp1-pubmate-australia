import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, Modal } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';
import { pubmateColors } from '../../theme';
import { VenuePhoto } from '../../types/photo.types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const THUMBNAIL_SIZE = (SCREEN_WIDTH - 48) / 3; // 3 columns with padding

interface PhotoGalleryProps {
  photos: VenuePhoto[];
  onPhotoPress?: (photo: VenuePhoto, index: number) => void;
  isDark?: boolean;
}

export default function PhotoGallery({ photos, onPhotoPress, isDark = false }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);

  const handlePhotoPress = (photo: VenuePhoto, index: number) => {
    setSelectedIndex(index);
    setViewerVisible(true);
    onPhotoPress?.(photo, index);
  };

  const handleClose = () => {
    setViewerVisible(false);
    setSelectedIndex(null);
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  if (photos.length === 0) {
    return (
      <Surface style={[styles.emptyContainer, isDark && styles.emptyContainerDark]} elevation={0}>
        <IconButton icon="image-off" size={48} iconColor="#ccc" />
        <Text variant="bodyMedium" style={[styles.emptyText, isDark && styles.textDark]}>
          No photos yet
        </Text>
      </Surface>
    );
  }

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <>
      {/* Thumbnail Grid */}
      <View style={styles.grid}>
        {photos.map((photo, index) => (
          <TouchableOpacity
            key={photo.id}
            style={styles.thumbnail}
            onPress={() => handlePhotoPress(photo, index)}
          >
            <Image
              source={{ uri: photo.thumbnailUrl || photo.url || photo.uri }}
              style={styles.thumbnailImage}
              resizeMode="cover"
            />
            {photo.isUserPhoto && (
              <View style={styles.userBadge}>
                <IconButton icon="account" size={16} iconColor="#fff" style={styles.userBadgeIcon} />
              </View>
            )}
            {photo.likes > 0 && (
              <View style={styles.likeBadge}>
                <IconButton icon="heart" size={12} iconColor="#fff" style={styles.likeBadgeIcon} />
                <Text style={styles.likeCount}>{photo.likes}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Full Screen Photo Viewer Modal */}
      <Modal
        visible={viewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <IconButton icon="close" size={28} iconColor="#fff" onPress={handleClose} />
            <Text variant="titleMedium" style={styles.modalTitle}>
              {selectedIndex !== null ? `${selectedIndex + 1} / ${photos.length}` : ''}
            </Text>
            <View style={{ width: 56 }} />
          </View>

          {selectedPhoto && (
            <>
              <ScrollView
                contentContainerStyle={styles.imageContainer}
                maximumZoomScale={3}
                minimumZoomScale={1}
              >
                <Image
                  source={{ uri: selectedPhoto.url || selectedPhoto.uri }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </ScrollView>

              <View style={styles.modalFooter}>
                <View style={styles.photoInfo}>
                  {selectedPhoto.caption && (
                    <Text variant="bodyMedium" style={styles.caption}>
                      {selectedPhoto.caption}
                    </Text>
                  )}
                  <View style={styles.photoMeta}>
                    {selectedPhoto.isUserPhoto && (
                      <View style={styles.metaItem}>
                        <IconButton icon="account" size={16} iconColor="#fff" style={styles.metaIcon} />
                        <Text style={styles.metaText}>Your photo</Text>
                      </View>
                    )}
                    <View style={styles.metaItem}>
                      <IconButton icon="heart-outline" size={16} iconColor="#fff" style={styles.metaIcon} />
                      <Text style={styles.metaText}>{selectedPhoto.likes} likes</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.navigation}>
                  <IconButton
                    icon="chevron-left"
                    size={32}
                    iconColor="#fff"
                    onPress={handlePrevious}
                    disabled={selectedIndex === 0}
                    style={[styles.navButton, selectedIndex === 0 && styles.navButtonDisabled]}
                  />
                  <IconButton
                    icon="chevron-right"
                    size={32}
                    iconColor="#fff"
                    onPress={handleNext}
                    disabled={selectedIndex === photos.length - 1}
                    style={[
                      styles.navButton,
                      selectedIndex === photos.length - 1 && styles.navButtonDisabled,
                    ]}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 6,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  userBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: pubmateColors.orange,
    borderRadius: 12,
  },
  userBadgeIcon: {
    margin: 0,
  },
  likeBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 6,
  },
  likeBadgeIcon: {
    margin: 0,
  },
  likeCount: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    backgroundColor: '#fff',
    padding: 48,
    alignItems: 'center',
    borderRadius: 12,
    margin: 16,
  },
  emptyContainerDark: {
    backgroundColor: '#1E1E1E',
  },
  emptyText: {
    color: '#999',
    marginTop: 8,
  },
  textDark: {
    color: '#E1E1E1',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalTitle: {
    color: '#fff',
    fontWeight: '700',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 200,
  },
  modalFooter: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
  },
  photoInfo: {
    marginBottom: 12,
  },
  caption: {
    color: '#fff',
    marginBottom: 8,
  },
  photoMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    margin: 0,
    marginRight: 4,
  },
  metaText: {
    color: '#fff',
    fontSize: 12,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  navButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
});
