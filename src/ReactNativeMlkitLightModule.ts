import { NativeModule, requireNativeModule } from 'expo';

import { DetectionResult, FaceDetectionOptions } from './ReactNativeMlkitLight.types';

declare class ReactNativeMlkitLightModule extends NativeModule {
  detectFaces(imageUri: string, options?: FaceDetectionOptions): Promise<DetectionResult>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativeMlkitLightModule>('ReactNativeMlkitLight');
