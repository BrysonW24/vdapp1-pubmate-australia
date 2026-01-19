/**
 * Photo Service
 * Handles photo uploads, compression, and Firebase Storage integration
 *
 * IMPORTANT: This service requires expo-image-picker to be installed:
 * npm install expo-image-picker
 *
 * For Firebase Storage, you'll also need:
 * npm install @react-native-firebase/storage
 */

import { Platform } from 'react-native';
import { Photo, PhotoUploadProgress, PhotoPickerOptions } from '../types/photo.types';

// Uncomment when expo-image-picker is installed
// import * as ImagePicker from 'expo-image-picker';

export class PhotoService {
  private static uploadCallbacks: { [key: string]: (progress: PhotoUploadProgress) => void } = {};

  /**
   * Request camera permissions
   */
  static async requestCameraPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true; // Web doesn't need explicit permissions
    }

    // Uncomment when expo-image-picker is installed
    // const { status } = await ImagePicker.requestCameraPermissionsAsync();
    // return status === 'granted';

    console.warn('expo-image-picker not installed. Install with: npm install expo-image-picker');
    return false;
  }

  /**
   * Request media library permissions
   */
  static async requestMediaLibraryPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true;
    }

    // Uncomment when expo-image-picker is installed
    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // return status === 'granted';

    console.warn('expo-image-picker not installed. Install with: npm install expo-image-picker');
    return false;
  }

  /**
   * Pick image from camera
   */
  static async pickFromCamera(options?: PhotoPickerOptions): Promise<Photo | null> {
    const hasPermission = await this.requestCameraPermissions();
    if (!hasPermission) {
      throw new Error('Camera permission not granted');
    }

    // Uncomment when expo-image-picker is installed
    // const result = await ImagePicker.launchCameraAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: options?.allowsEditing ?? true,
    //   aspect: options?.aspect,
    //   quality: options?.quality ?? 0.8,
    // });

    // if (!result.canceled && result.assets && result.assets.length > 0) {
    //   const asset = result.assets[0];
    //   return this.createPhotoFromAsset(asset);
    // }

    console.warn('expo-image-picker not installed');
    return null;
  }

  /**
   * Pick image(s) from gallery
   */
  static async pickFromGallery(options?: PhotoPickerOptions): Promise<Photo[]> {
    const hasPermission = await this.requestMediaLibraryPermissions();
    if (!hasPermission) {
      throw new Error('Media library permission not granted');
    }

    // Uncomment when expo-image-picker is installed
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: options?.allowsEditing ?? false,
    //   aspect: options?.aspect,
    //   quality: options?.quality ?? 0.8,
    //   allowsMultipleSelection: options?.allowsMultipleSelection ?? true,
    //   selectionLimit: options?.selectionLimit ?? 5,
    // });

    // if (!result.canceled && result.assets) {
    //   return result.assets.map(asset => this.createPhotoFromAsset(asset));
    // }

    console.warn('expo-image-picker not installed');
    return [];
  }

  /**
   * Create Photo object from ImagePicker asset
   */
  private static createPhotoFromAsset(asset: any): Photo {
    return {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      size: asset.fileSize || 0,
      mimeType: asset.mimeType || 'image/jpeg',
    };
  }

  /**
   * Upload photo to Firebase Storage
   */
  static async uploadPhoto(
    photo: Photo,
    path: string,
    onProgress?: (progress: PhotoUploadProgress) => void
  ): Promise<string> {
    const uploadId = photo.id;

    // Track progress callback
    if (onProgress) {
      this.uploadCallbacks[uploadId] = onProgress;
    }

    try {
      // Update progress
      this.updateProgress(uploadId, { id: uploadId, progress: 0, status: 'uploading' });

      // In production, upload to Firebase Storage
      // Uncomment when @react-native-firebase/storage is installed
      /*
      const reference = storage().ref(path);
      const task = reference.putFile(photo.uri);

      task.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.updateProgress(uploadId, {
          id: uploadId,
          progress,
          status: 'uploading',
        });
      });

      await task;

      this.updateProgress(uploadId, {
        id: uploadId,
        progress: 90,
        status: 'processing',
      });

      const downloadURL = await reference.getDownloadURL();

      this.updateProgress(uploadId, {
        id: uploadId,
        progress: 100,
        status: 'completed',
      });

      return downloadURL;
      */

      // Mock upload for development
      await this.simulateUpload(uploadId);

      return `https://storage.example.com/${path}`;
    } catch (error) {
      this.updateProgress(uploadId, {
        id: uploadId,
        progress: 0,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Upload failed',
      });
      throw error;
    } finally {
      delete this.uploadCallbacks[uploadId];
    }
  }

  /**
   * Upload multiple photos
   */
  static async uploadPhotos(
    photos: Photo[],
    basePath: string,
    onProgress?: (uploadId: string, progress: PhotoUploadProgress) => void
  ): Promise<string[]> {
    const uploadPromises = photos.map((photo, index) => {
      const path = `${basePath}/${photo.id}`;
      const callback = onProgress
        ? (progress: PhotoUploadProgress) => onProgress(photo.id, progress)
        : undefined;
      return this.uploadPhoto(photo, path, callback);
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Delete photo from Firebase Storage
   */
  static async deletePhoto(url: string): Promise<void> {
    // In production, delete from Firebase Storage
    // Uncomment when @react-native-firebase/storage is installed
    /*
    const reference = storage().refFromURL(url);
    await reference.delete();
    */

    console.log('Delete photo:', url);
  }

  /**
   * Compress image (optional, for optimization)
   */
  static async compressImage(uri: string, quality: number = 0.8): Promise<string> {
    // In production, use expo-image-manipulator for compression
    // npm install expo-image-manipulator
    /*
    import * as ImageManipulator from 'expo-image-manipulator';

    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1920 } }], // Max width 1920px
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    );

    return manipResult.uri;
    */

    return uri;
  }

  /**
   * Generate thumbnail
   */
  static async generateThumbnail(uri: string, size: number = 200): Promise<string> {
    // In production, use expo-image-manipulator
    /*
    import * as ImageManipulator from 'expo-image-manipulator';

    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: size } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    return manipResult.uri;
    */

    return uri;
  }

  /**
   * Get image dimensions
   */
  static async getImageDimensions(uri: string): Promise<{ width: number; height: number }> {
    // Use Image.getSize from React Native
    return new Promise((resolve, reject) => {
      // In production:
      // Image.getSize(uri, (width, height) => resolve({ width, height }), reject);

      // Mock for development
      resolve({ width: 1920, height: 1080 });
    });
  }

  /**
   * Update progress callback
   */
  private static updateProgress(uploadId: string, progress: PhotoUploadProgress): void {
    const callback = this.uploadCallbacks[uploadId];
    if (callback) {
      callback(progress);
    }
  }

  /**
   * Simulate upload for development
   */
  private static async simulateUpload(uploadId: string): Promise<void> {
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      let status: PhotoUploadProgress['status'] = 'uploading';
      if (i >= 90) status = 'processing';
      if (i === 100) status = 'completed';

      this.updateProgress(uploadId, {
        id: uploadId,
        progress: i,
        status,
      });
    }
  }

  /**
   * Validate image file
   */
  static validateImage(photo: Photo): { valid: boolean; error?: string } {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (photo.size > MAX_SIZE) {
      return {
        valid: false,
        error: 'Image size must be less than 10MB',
      };
    }

    if (!ALLOWED_TYPES.includes(photo.mimeType)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, and WebP images are allowed',
      };
    }

    return { valid: true };
  }

  /**
   * Get mock venue photos for development
   */
  static getMockVenuePhotos(venueId: string): any[] {
    return [
      {
        id: 'photo_1',
        uri: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
        url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200',
        width: 1920,
        height: 1080,
        size: 2048000,
        mimeType: 'image/jpeg',
        venueId,
        venueName: 'The Baxter Inn',
        caption: 'Amazing rooftop view!',
        likes: 23,
        isUserPhoto: false,
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'photo_2',
        uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
        width: 1920,
        height: 1080,
        size: 1856000,
        mimeType: 'image/jpeg',
        venueId,
        venueName: 'The Baxter Inn',
        caption: 'Great cocktails',
        likes: 45,
        isUserPhoto: false,
        uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }
}
