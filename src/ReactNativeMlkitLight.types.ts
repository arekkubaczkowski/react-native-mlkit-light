export interface FaceBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceLandmark {
  type: string;
  x: number;
  y: number;
}

export interface Face {
  bounds: FaceBounds;
  rollAngle?: number;
  pitchAngle?: number;
  yawAngle?: number;
  leftEyeOpenProbability?: number;
  rightEyeOpenProbability?: number;
  smilingProbability?: number;
  landmarks?: FaceLandmark[];
}

export interface FaceDetectionOptions {
  performanceMode?: 'fast' | 'accurate';
  landmarkMode?: 'none' | 'all';
  classificationMode?: 'none' | 'all';
  minFaceSize?: number;
  trackingEnabled?: boolean;
}

export interface DetectionResult {
  faces: Face[];
}
