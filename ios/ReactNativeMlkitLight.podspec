require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

# Check for configuration flags from ENV with fallback to true
enable_ios = ENV['MLKIT_LIGHT_ENABLE_IOS'] != 'false'

Pod::Spec.new do |s|
  s.name           = 'ReactNativeMlkitLight'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platforms      = {
    :ios => '15.5',
    :tvos => '15.5'
  }
  s.swift_version  = '5.9'
  s.source         = { git: 'https://github.com/arekkubaczkowski/react-native-mlkit-light' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  
  # Conditionally add MLKit dependency and source files
  if enable_ios
    s.dependency 'GoogleMLKit/FaceDetection', '~> 8.0.0'
    s.source_files = "ReactNativeMlkitLightModule.swift"
  else
    s.source_files = "ReactNativeMlkitLightModuleStub.swift"
  end

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }
end
