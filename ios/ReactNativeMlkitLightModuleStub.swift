import ExpoModulesCore

// Stub implementation when MLKit is disabled
public class ReactNativeMlkitLightModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ReactNativeMlkitLight")

    AsyncFunction("detectFaces") { (imageUri: String, options: [String: Any]?) in
      // Return error indicating MLKit is not available
      throw NSError(
        domain: "ReactNativeMlkitLight", 
        code: 1, 
        userInfo: [NSLocalizedDescriptionKey: "MLKit Face Detection is disabled. Enable it in the Expo config plugin configuration."]
      )
    }
  }
}