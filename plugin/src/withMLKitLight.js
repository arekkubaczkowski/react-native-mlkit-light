const { withPodfile } = require("@expo/config-plugins");

const withMLKitLight = (config, props) => {
  const options = {
    enableIOS: true,
    ...props,
  };

  // Modify Podfile to set ENV variable at the very beginning
  return withPodfile(config, (config) => {
    const podfile = config.modResults;

    // Add ENV setting at the top of the file, before any requires
    const envSetting = `# MLKit Light configuration\nENV['MLKIT_LIGHT_ENABLE_IOS'] = '${options.enableIOS}'\n\n`;

    // Insert at the very beginning of the file
    podfile.contents = envSetting + podfile.contents;

    config.modResults = podfile;
    return config;
  });
};

module.exports = withMLKitLight;
