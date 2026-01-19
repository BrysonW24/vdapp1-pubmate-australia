import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Surface, Button, TextInput, Divider } from 'react-native-paper';
import { useAppSelector } from '../../store';
import { pubmateColors } from '../../theme';
import { Photo, PhotoUploadProgress } from '../../types/photo.types';
import { PhotoService } from '../../services/PhotoService';
import PhotoPicker from '../../components/photo/PhotoPicker';

interface VenuePhotoUploadScreenProps {
  route: {
    params: {
      venueId: string;
      venueName: string;
    };
  };
  navigation: any;
}

export default function VenuePhotoUploadScreen({ route, navigation }: VenuePhotoUploadScreenProps) {
  const { isDark } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.auth);
  const { venueId, venueName } = route.params;

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: PhotoUploadProgress }>({});

  const handlePhotosSelected = (selectedPhotos: Photo[]) => {
    setPhotos(selectedPhotos);
  };

  const handleUpload = async () => {
    if (photos.length === 0) {
      Alert.alert('No Photos', 'Please select at least one photo to upload');
      return;
    }

    if (!user?.uid) {
      Alert.alert('Error', 'You must be logged in to upload photos');
      return;
    }

    try {
      setUploading(true);

      // Upload photos with progress tracking
      const uploadPath = `venues/${venueId}/photos`;
      const urls = await PhotoService.uploadPhotos(
        photos,
        uploadPath,
        (uploadId, progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [uploadId]: progress,
          }));
        }
      );

      // In production, save photo metadata to Firestore
      console.log('Photos uploaded:', urls);
      console.log('Caption:', caption);
      console.log('Venue ID:', venueId);
      console.log('User ID:', user.uid);

      Alert.alert(
        'Success!',
        `${photos.length} photo${photos.length > 1 ? 's' : ''} uploaded successfully`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Failed to upload photos. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const getTotalProgress = () => {
    if (Object.keys(uploadProgress).length === 0) return 0;
    const total = Object.values(uploadProgress).reduce((sum, p) => sum + p.progress, 0);
    return total / Object.keys(uploadProgress).length;
  };

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Surface style={[styles.header, isDark && styles.headerDark]} elevation={0}>
        <Text variant="headlineSmall" style={[styles.headerTitle, isDark && styles.textDark]}>
          Add Photos
        </Text>
        <Text variant="bodyMedium" style={[styles.headerSubtext, isDark && styles.subtextDark]}>
          {venueName}
        </Text>
      </Surface>

      {/* Photo Picker */}
      <PhotoPicker
        onPhotosSelected={handlePhotosSelected}
        maxPhotos={5}
        existingPhotos={photos}
        isDark={isDark}
      />

      <Divider style={styles.divider} />

      {/* Caption Input */}
      <View style={styles.section}>
        <Text variant="titleSmall" style={[styles.sectionTitle, isDark && styles.textDark]}>
          Add a Caption (Optional)
        </Text>
        <TextInput
          mode="outlined"
          placeholder="Share what you loved about this place..."
          value={caption}
          onChangeText={setCaption}
          multiline
          numberOfLines={4}
          maxLength={200}
          style={[styles.input, isDark && styles.inputDark]}
          outlineColor={isDark ? '#3D3D3D' : '#E0E0E0'}
          activeOutlineColor={pubmateColors.orange}
          textColor={isDark ? '#E1E1E1' : pubmateColors.charcoal}
          disabled={uploading}
        />
        <Text variant="bodySmall" style={[styles.charCount, isDark && styles.subtextDark]}>
          {caption.length} / 200
        </Text>
      </View>

      {/* Upload Progress */}
      {uploading && (
        <Surface style={[styles.progressSection, isDark && styles.sectionDark]} elevation={1}>
          <Text variant="titleSmall" style={[styles.progressTitle, isDark && styles.textDark]}>
            Uploading... {Math.round(getTotalProgress())}%
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${getTotalProgress()}%`, backgroundColor: pubmateColors.orange },
              ]}
            />
          </View>
          {Object.entries(uploadProgress).map(([id, progress]) => (
            <View key={id} style={styles.individualProgress}>
              <Text variant="bodySmall" style={isDark && styles.subtextDark}>
                Photo {id.substring(6, 10)}... - {progress.status}
              </Text>
              <Text variant="bodySmall" style={[styles.progressPercent, isDark && styles.subtextDark]}>
                {Math.round(progress.progress)}%
              </Text>
            </View>
          ))}
        </Surface>
      )}

      {/* Guidelines */}
      <Surface style={[styles.guidelinesSection, isDark && styles.sectionDark]} elevation={0}>
        <Text variant="titleSmall" style={[styles.guidelinesTitle, isDark && styles.textDark]}>
          Photo Guidelines
        </Text>
        <View style={styles.guideline}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text variant="bodySmall" style={[styles.guidelineText, isDark && styles.subtextDark]}>
            Photos should be clear and well-lit
          </Text>
        </View>
        <View style={styles.guideline}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text variant="bodySmall" style={[styles.guidelineText, isDark && styles.subtextDark]}>
            Show the venue's atmosphere, drinks, or food
          </Text>
        </View>
        <View style={styles.guideline}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text variant="bodySmall" style={[styles.guidelineText, isDark && styles.subtextDark]}>
            Avoid photos with people's faces without permission
          </Text>
        </View>
        <View style={styles.guideline}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text variant="bodySmall" style={[styles.guidelineText, isDark && styles.subtextDark]}>
            Max 10MB per photo • JPEG, PNG, or WebP format
          </Text>
        </View>
      </Surface>

      {/* Upload Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleUpload}
          disabled={photos.length === 0 || uploading}
          loading={uploading}
          style={[styles.uploadButton, { backgroundColor: pubmateColors.orange }]}
          labelStyle={styles.uploadButtonLabel}
        >
          {uploading ? 'Uploading...' : `Upload ${photos.length} Photo${photos.length !== 1 ? 's' : ''}`}
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          disabled={uploading}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
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
  divider: {
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
  },
  inputDark: {
    backgroundColor: '#1E1E1E',
  },
  charCount: {
    textAlign: 'right',
    color: '#999',
    marginTop: 4,
  },
  progressSection: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  sectionDark: {
    backgroundColor: '#1E1E1E',
  },
  progressTitle: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  individualProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressPercent: {
    fontWeight: '700',
    color: '#666',
  },
  guidelinesSection: {
    backgroundColor: '#FFF8E1',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  guidelinesTitle: {
    fontWeight: '700',
    color: pubmateColors.charcoal,
    marginBottom: 12,
  },
  guideline: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    marginRight: 8,
    color: pubmateColors.orange,
    fontWeight: '700',
  },
  guidelineText: {
    flex: 1,
    color: '#666',
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  uploadButton: {
    paddingVertical: 8,
  },
  uploadButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  cancelButton: {
    borderColor: '#E0E0E0',
  },
});
