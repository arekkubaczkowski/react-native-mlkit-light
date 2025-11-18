import ExpoModulesCore
import MLKitFaceDetection
import MLKitVision

public class ReactNativeMlkitLightModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ReactNativeMlkitLight")

    AsyncFunction("detectFaces") { (imageUri: String, options: [String: Any]?) in
      return try await self.detectFaces(imageUri: imageUri, options: options ?? [:])
    }
  }
  
  private func detectFaces(imageUri: String, options: [String: Any]) async throws -> [String: Any] {
    // Create face detector with options
    let faceDetectorOptions = FaceDetectorOptions()
    
    if let performanceMode = options["performanceMode"] as? String {
      faceDetectorOptions.performanceMode = performanceMode == "fast" ? .fast : .accurate
    }
    
    if let landmarkMode = options["landmarkMode"] as? String {
      faceDetectorOptions.landmarkMode = landmarkMode == "all" ? .all : .none
    }
    
    if let classificationMode = options["classificationMode"] as? String {
      faceDetectorOptions.classificationMode = classificationMode == "all" ? .all : .none
    }
    
    if let minFaceSize = options["minFaceSize"] as? Double {
      faceDetectorOptions.minFaceSize = CGFloat(minFaceSize)
    }
    
    if let trackingEnabled = options["trackingEnabled"] as? Bool {
      faceDetectorOptions.isTrackingEnabled = trackingEnabled
    }
    
    let faceDetector = FaceDetector.faceDetector(options: faceDetectorOptions)
    
    // Load image from URI
    guard let url = URL(string: imageUri),
          let imageData = try? Data(contentsOf: url),
          let uiImage = UIImage(data: imageData) else {
      throw NSError(domain: "ReactNativeMlkitLight", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not load image from URI"])
    }
    
    let visionImage = VisionImage(image: uiImage)
    visionImage.orientation = uiImage.imageOrientation
    
    // Detect faces
    let faces = try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<[Face], Error>) in
      faceDetector.process(visionImage) { faces, error in
        if let error = error {
          continuation.resume(throwing: error)
        } else {
          continuation.resume(returning: faces ?? [])
        }
      }
    }
    
    // Convert faces to dictionary format
    let facesData = faces.map { face -> [String: Any] in
      var faceDict: [String: Any] = [
        "bounds": [
          "x": face.frame.origin.x,
          "y": face.frame.origin.y,
          "width": face.frame.size.width,
          "height": face.frame.size.height
        ]
      ]
      
      if face.hasHeadEulerAngleY {
        faceDict["yawAngle"] = face.headEulerAngleY
      }
      if face.hasHeadEulerAngleZ {
        faceDict["rollAngle"] = face.headEulerAngleZ
      }
      if face.hasLeftEyeOpenProbability {
        faceDict["leftEyeOpenProbability"] = face.leftEyeOpenProbability
      }
      if face.hasRightEyeOpenProbability {
        faceDict["rightEyeOpenProbability"] = face.rightEyeOpenProbability
      }
      if face.hasSmilingProbability {
        faceDict["smilingProbability"] = face.smilingProbability
      }
      
      // Add landmarks if available
      var landmarksArray: [[String: Any]] = []
      for landmark in face.landmarks {
        let landmarkDict: [String: Any] = [
          "type": landmarkTypeToString(landmark.type),
          "x": landmark.position.x,
          "y": landmark.position.y
        ]
        landmarksArray.append(landmarkDict)
      }
      
      if !landmarksArray.isEmpty {
        faceDict["landmarks"] = landmarksArray
      }
      
      return faceDict
    }
    
    return ["faces": facesData]
  }
  
  private func landmarkTypeToString(_ type: FaceLandmarkType) -> String {
    // For now, return a string representation of the raw value
    // This will work with any landmark type
    return "LANDMARK_\(type.rawValue)"
  }
}
