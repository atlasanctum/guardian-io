import { useState, useCallback } from "react";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { Platform } from "react-native";

export type PermissionType = "camera" | "mediaLibrary" | "location";

export interface PermissionStatus {
  camera: boolean;
  mediaLibrary: boolean;
  location: boolean;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: false,
    mediaLibrary: false,
    location: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // On web, permissions are not required
      if (Platform.OS === "web") {
        setPermissions((prev) => ({ ...prev, camera: true }));
        setIsLoading(false);
        return true;
      }

      // For native platforms, camera permission is handled by expo-image-picker
      // This is a placeholder for future camera-specific logic
      setPermissions((prev) => ({ ...prev, camera: true }));
      setIsLoading(false);
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to request camera permission";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, []);

  const requestMediaLibraryPermission = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // On web, permissions are not required
      if (Platform.OS === "web") {
        setPermissions((prev) => ({ ...prev, mediaLibrary: true }));
        setIsLoading(false);
        return true;
      }

      // Request media library permission
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === "granted") {
        setPermissions((prev) => ({ ...prev, mediaLibrary: true }));
        setIsLoading(false);
        return true;
      } else {
        setError("Media library permission denied");
        setIsLoading(false);
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to request media library permission";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, []);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // On web, permissions are not required
      if (Platform.OS === "web") {
        setPermissions((prev) => ({ ...prev, location: true }));
        setIsLoading(false);
        return true;
      }

      // Request foreground location permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        setPermissions((prev) => ({ ...prev, location: true }));
        setIsLoading(false);
        return true;
      } else {
        setError("Location permission denied");
        setIsLoading(false);
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to request location permission";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, []);

  const requestPermission = useCallback(
    async (type: PermissionType): Promise<boolean> => {
      switch (type) {
        case "camera":
          return requestCameraPermission();
        case "mediaLibrary":
          return requestMediaLibraryPermission();
        case "location":
          return requestLocationPermission();
        default:
          setError("Unknown permission type");
          return false;
      }
    },
    [requestCameraPermission, requestMediaLibraryPermission, requestLocationPermission],
  );

  const requestAllPermissions = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const cameraOk = await requestCameraPermission();
      const mediaOk = await requestMediaLibraryPermission();
      const locationOk = await requestLocationPermission();

      setIsLoading(false);
      return cameraOk && mediaOk && locationOk;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to request permissions";
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, [requestCameraPermission, requestMediaLibraryPermission, requestLocationPermission]);

  return {
    permissions,
    requestPermission,
    requestAllPermissions,
    requestCameraPermission,
    requestMediaLibraryPermission,
    requestLocationPermission,
    isLoading,
    error,
  };
}
