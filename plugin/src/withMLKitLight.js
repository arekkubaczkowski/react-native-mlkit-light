const { withPodfileProperties } = require('@expo/config-plugins');

const withMLKitLight = (config, props) => {
  const options = {
    enableIOS: true,
    ...props,
  };

  config = withPodfileProperties(config, (config) => {
    config.modResults['MLKIT_LIGHT_ENABLE_IOS'] = options.enableIOS ? 'YES' : 'NO';
    return config;
  });

  return config;
};

module.exports = withMLKitLight;