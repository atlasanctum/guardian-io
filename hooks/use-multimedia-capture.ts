import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";

export interface MediaFile {
  uri: string;
  type: "image" | "video";
  fileName?: string;
  mimeType?: string;
  size?: number;
}

// Hook for picking images from library
export function useImagePicker() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async (): Promise<MediaFile | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: "image",
          fileName: asset.fileName || "image.jpg",
          mimeType: "image/jpeg",
        };
      }

      setIsLoading(false);
      return null;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to pick image";
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  return { pickImage, isLoading, error };
}

// Hook for picking videos from library
export function useVideoPicker() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickVideo = async (): Promise<MediaFile | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: "video",
          fileName: asset.fileName || "video.mp4",
          mimeType: "video/mp4",
        };
      }

      setIsLoading(false);
      return null;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to pick video";
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  return { pickVideo, isLoading, error };
}

// Hook for camera capture
export function useCameraCapture() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capturePhoto = async (): Promise<MediaFile | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: "image",
          fileName: `photo_${Date.now()}.jpg`,
          mimeType: "image/jpeg",
        };
      }

      setIsLoading(false);
      return null;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to capture photo";
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  const captureVideo = async (): Promise<MediaFile | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: "video",
          fileName: `video_${Date.now()}.mp4`,
          mimeType: "video/mp4",
        };
      }

      setIsLoading(false);
      return null;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to capture video";
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  return { capturePhoto, captureVideo, isLoading, error };
}

// Hook for file operations
export function useFileOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFileSize = async (uri: string): Promise<number | null> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return (fileInfo as any).size || null;
    } catch (err) {
      console.error("Failed to get file size:", err);
      return null;
    }
  };

  const readFileAsBase64 = async (uri: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setIsLoading(false);
      return base64;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to read file";
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  const deleteFile = async (uri: string): Promise<boolean> => {
    try {
      await FileSystem.deleteAsync(uri);
      return true;
    } catch (err) {
      console.error("Failed to delete file:", err);
      return false;
    }
  };

  return {
    getFileSize,
    readFileAsBase64,
    deleteFile,
    isLoading,
    error,
  };
}

// Hook for managing multiple media files
export function useMediaCollection() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMedia = (media: MediaFile) => {
    setMediaFiles((prev) => [...prev, media]);
  };

  const removeMedia = (uri: string) => {
    setMediaFiles((prev) => prev.filter((m) => m.uri !== uri));
  };

  const clearMedia = () => {
    setMediaFiles([]);
  };

  const getMediaCount = () => mediaFiles.length;

  const getMediaByType = (type: "image" | "video") => {
    return mediaFiles.filter((m) => m.type === type);
  };

  return {
    mediaFiles,
    addMedia,
    removeMedia,
    clearMedia,
    getMediaCount,
    getMediaByType,
    isLoading,
  };
}
