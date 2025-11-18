# react-native-mlkit-light

Lightweight React Native wrapper for Google MLKit Face Detection.

## Features

- 🔍 **Face Detection** - Detect faces in images with comprehensive data
- 📱 **Cross Platform** - iOS and Android support  
- ⚡ **Expo Module** - Built using Expo Modules API with new architecture support
- 🎯 **MLKit Powered** - Uses Google's on-device ML models
- 🌐 **Flexible Input** - Support for both local files and remote URLs

## Installation

```bash
bun add react-native-mlkit-light
```

For iOS, run `npx pod-install` after installation.

## Usage

### Simple Import (Recommended)

```typescript
import { detectFaces, FaceDetectionOptions, DetectionResult } from 'react-native-mlkit-light';

const handleFaceDetection = async () => {
  try {
    const options: FaceDetectionOptions = {
      performanceMode: 'accurate',     // 'fast' | 'accurate'
      landmarkMode: 'all',            // 'none' | 'all'  
      classificationMode: 'all',      // 'none' | 'all'
      minFaceSize: 0.1,               // minimum face size (0.0 - 1.0)
      trackingEnabled: false          // enable face tracking
    };

    const result: DetectionResult = await detectFaces(
      'https://example.com/image.jpg', // local file or URL
      options
    );

    console.log(`Found ${result.faces.length} faces`);
    
    result.faces.forEach((face, index) => {
      console.log(`Face ${index + 1}:`, {
        bounds: face.bounds,
        smiling: face.smilingProbability,
        leftEyeOpen: face.leftEyeOpenProbability,
        rightEyeOpen: face.rightEyeOpenProbability,
        landmarks: face.landmarks?.length || 0
      });
    });
    
  } catch (error) {
    console.error('Face detection failed:', error);
  }
};
```

### Alternative Import Methods

```typescript
// Import specific helper functions
import { detectFacesFromUrl, detectFacesFromFile } from 'react-native-mlkit-light';

// Detect from URL
const result1 = await detectFacesFromUrl('https://example.com/photo.jpg');

// Detect from local file
const result2 = await detectFacesFromFile('file:///path/to/image.jpg');

// Import native module directly (legacy)
import ReactNativeMlkitLight from 'react-native-mlkit-light';
const result3 = await ReactNativeMlkitLight.detectFaces(imageUri);
```

## API

### `detectFaces(imageUri: string, options?: FaceDetectionOptions): Promise<DetectionResult>`

**Parameters:**
- `imageUri` - Local file URI or HTTP/HTTPS URL to image
- `options` - Face detection configuration (optional)

**Returns:**
- `DetectionResult` - Object containing detected faces data

## Types

### `Face`
```typescript
interface Face {
  bounds: FaceBounds;                    // Face bounding box
  rollAngle?: number;                    // Head rotation (Z-axis)  
  pitchAngle?: number;                   // Head rotation (X-axis)
  yawAngle?: number;                     // Head rotation (Y-axis)
  leftEyeOpenProbability?: number;       // 0.0-1.0
  rightEyeOpenProbability?: number;      // 0.0-1.0
  smilingProbability?: number;           // 0.0-1.0
  landmarks?: FaceLandmark[];            // Facial landmarks
}
```

### `FaceDetectionOptions`
```typescript
interface FaceDetectionOptions {
  performanceMode?: 'fast' | 'accurate'; // Detection speed vs accuracy
  landmarkMode?: 'none' | 'all';         // Detect facial landmarks
  classificationMode?: 'none' | 'all';   // Eye/smile classification  
  minFaceSize?: number;                   // Min face size (0.0-1.0)
  trackingEnabled?: boolean;              // Enable face tracking IDs
}
```

## Platform Support

- ✅ **iOS** - Requires iOS 12.0+
- ✅ **Android** - Requires API level 21+
- ❌ **Web** - Not supported

## Dependencies

Uses Google MLKit Vision APIs:
- iOS: `GoogleMLKit/FaceDetection` 
- Android: `com.google.mlkit:face-detection`

## License

MIT
