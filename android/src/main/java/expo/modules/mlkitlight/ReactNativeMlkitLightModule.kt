package expo.modules.mlkitlight

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import com.google.mlkit.vision.common.InputImage
import java.net.URL
import com.google.mlkit.vision.face.Face
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetector
import com.google.mlkit.vision.face.FaceDetectorOptions
import com.google.mlkit.vision.face.FaceLandmark
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import java.io.IOException

class ReactNativeMlkitLightModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ReactNativeMlkitLight")

    AsyncFunction("detectFaces") { imageUri: String, options: Map<String, Any>?, promise: Promise ->
      detectFaces(imageUri, options ?: emptyMap(), promise)
    }
  }

  private fun detectFaces(imageUri: String, options: Map<String, Any>, promise: Promise) {
    // Create face detector options
    val builder = FaceDetectorOptions.Builder()
    
    // Set performance mode
    val performanceMode = options["performanceMode"] as? String
    if (performanceMode == "fast") {
      builder.setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_FAST)
    } else {
      builder.setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
    }
    
    // Set landmark mode
    val landmarkMode = options["landmarkMode"] as? String
    if (landmarkMode == "all") {
      builder.setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_ALL)
    } else {
      builder.setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_NONE)
    }
    
    // Set classification mode
    val classificationMode = options["classificationMode"] as? String
    if (classificationMode == "all") {
      builder.setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_ALL)
    } else {
      builder.setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_NONE)
    }
    
    // Set minimum face size
    val minFaceSize = options["minFaceSize"] as? Double
    if (minFaceSize != null) {
      builder.setMinFaceSize(minFaceSize.toFloat())
    }
    
    // Set tracking enabled
    val trackingEnabled = options["trackingEnabled"] as? Boolean
    if (trackingEnabled == true) {
      builder.enableTracking()
    }
    
    val detector = FaceDetection.getClient(builder.build())
    
    try {
      // Load image from URI (support both local files and HTTP URLs)
      val bitmap: Bitmap = if (imageUri.startsWith("http://") || imageUri.startsWith("https://")) {
        // Download image from URL
        val url = URL(imageUri)
        val inputStream = url.openStream()
        BitmapFactory.decodeStream(inputStream)
          ?: throw IOException("Could not decode bitmap from URL: $imageUri")
      } else {
        // Load local file
        val uri = Uri.parse(imageUri)
        val inputStream = appContext.reactContext?.contentResolver?.openInputStream(uri)
          ?: throw IOException("Could not open input stream for URI: $imageUri")
        
        BitmapFactory.decodeStream(inputStream)
          ?: throw IOException("Could not decode bitmap from URI: $imageUri")
      }
      
      val image = InputImage.fromBitmap(bitmap, 0)
      
      // Detect faces
      detector.process(image)
        .addOnSuccessListener { faces ->
          try {
            // Convert faces to map format
            val facesData = faces.map { face ->
              val faceMap = mutableMapOf<String, Any>()
              
              // Add bounding box
              faceMap["bounds"] = mapOf(
                "x" to face.boundingBox.left,
                "y" to face.boundingBox.top,
                "width" to face.boundingBox.width(),
                "height" to face.boundingBox.height()
              )
              
              // Add angles (always available in MLKit)
              faceMap["yawAngle"] = face.headEulerAngleY
              faceMap["rollAngle"] = face.headEulerAngleZ
              
              // Add probabilities if available (nullable properties)
              face.leftEyeOpenProbability?.let { 
                faceMap["leftEyeOpenProbability"] = it 
              }
              face.rightEyeOpenProbability?.let { 
                faceMap["rightEyeOpenProbability"] = it 
              }
              face.smilingProbability?.let { 
                faceMap["smilingProbability"] = it 
              }
              
              // Add landmarks if available
              val landmarksList = mutableListOf<Map<String, Any>>()
              face.allLandmarks.forEach { landmark ->
                landmarksList.add(mapOf(
                  "type" to landmarkTypeToString(landmark.landmarkType),
                  "x" to landmark.position.x,
                  "y" to landmark.position.y
                ))
              }
              
              if (landmarksList.isNotEmpty()) {
                faceMap["landmarks"] = landmarksList
              }
              
              faceMap
            }
            
            promise.resolve(mapOf("faces" to facesData))
          } finally {
            detector.close()
          }
        }
        .addOnFailureListener { e ->
          detector.close()
          promise.reject("FACE_DETECTION_ERROR", "Face detection failed: ${e.message}", e)
        }
      
    } catch (e: Exception) {
      detector.close()
      promise.reject("FACE_DETECTION_ERROR", "Face detection failed: ${e.message}", e)
    }
  }
  
  private fun landmarkTypeToString(type: Int): String {
    return when (type) {
      FaceLandmark.MOUTH_BOTTOM -> "MOUTH_BOTTOM"
      FaceLandmark.LEFT_CHEEK -> "LEFT_CHEEK"
      FaceLandmark.LEFT_EAR -> "LEFT_EAR"
      FaceLandmark.LEFT_EYE -> "LEFT_EYE"
      FaceLandmark.MOUTH_LEFT -> "MOUTH_LEFT"
      FaceLandmark.NOSE_BASE -> "NOSE_BASE"
      FaceLandmark.RIGHT_CHEEK -> "RIGHT_CHEEK"
      FaceLandmark.RIGHT_EAR -> "RIGHT_EAR"
      FaceLandmark.RIGHT_EYE -> "RIGHT_EYE"
      FaceLandmark.MOUTH_RIGHT -> "MOUTH_RIGHT"
      else -> "UNKNOWN"
    }
  }
}
