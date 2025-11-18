const { withPodfile } = require('@expo/config-plugins');

const withMLKitLight = (config, props) => {
  const options = {
    enableIOS: true,
    ...props,
  };

  // Modify Podfile to set constant 
  config = withPodfile(config, (config) => {
    const podfile = config.modResults;
    
    // Add constant setting at the top of Podfile
    const constantSetting = `MLKIT_LIGHT_ENABLE_IOS = ${options.enableIOS}`;
    
    // Add after the first line (usually require_relative)
    const lines = podfile.contents.split('\n');
    lines.splice(1, 0, constantSetting);
    podfile.contents = lines.join('\n');
    
    return config;
  });

  return config;
};

module.exports = withMLKitLight;