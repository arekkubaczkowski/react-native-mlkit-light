import ReactNativeMlkitLightModule from './ReactNativeMlkitLightModule';
import type { FaceDetectionOptions, DetectionResult } from './ReactNativeMlkitLight.types';

// Export types
export * from './ReactNativeMlkitLight.types';

// Export native module (for backward compatibility)
export { default } from './ReactNativeMlkitLightModule';

// Export convenient wrapper functions
export const detectFaces = (
  imageUri: string, 
  options?: FaceDetectionOptions
): Promise<DetectionResult> => {
  return ReactNativeMlkitLightModule.detectFaces(imageUri, options);
};

// Export additional helper functions
export const detectFacesFromUrl = (
  url: string,
  options?: FaceDetectionOptions
): Promise<DetectionResult> => {
  return ReactNativeMlkitLightModule.detectFaces(url, options);
};

export const detectFacesFromFile = (
  fileUri: string,
  options?: FaceDetectionOptions
): Promise<DetectionResult> => {
  return ReactNativeMlkitLightModule.detectFaces(fileUri, options);
};
