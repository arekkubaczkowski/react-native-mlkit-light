import ExpoModulesCore

// Stub implementation when MLKit is not available (e.g., on simulator)
public class ReactNativeMlkitLightModuleStub: Module {
  public func definition() -> ModuleDefinition {
    Name("ReactNativeMlkitLight")

    AsyncFunction("detectFaces") { (imageUri: String, options: [String: Any]?) in
      // Return error indicating MLKit is not available
      throw NSError(
        domain: "ReactNativeMlkitLight", 
        code: 1, 
        userInfo: [NSLocalizedDescriptionKey: "MLKit Face Detection is not available on this platform/simulator. Enable simulator support in plugin configuration or test on device."]
      )
    }
  }
}