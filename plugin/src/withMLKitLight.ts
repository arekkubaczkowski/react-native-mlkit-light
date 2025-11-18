import { ConfigPlugin, withPodfileProperties } from '@expo/config-plugins';

export interface MLKitLightPluginProps {
  enableIOS?: boolean;
}

const withMLKitLight: ConfigPlugin<MLKitLightPluginProps | void> = (config, props) => {
  const options: MLKitLightPluginProps = {
    enableIOS: true,
    ...props,
  };

  config = withPodfileProperties(config, (config: any) => {
    config.modResults['MLKIT_LIGHT_ENABLE_IOS'] = options.enableIOS ? 'YES' : 'NO';
    return config;
  });

  return config;
};

export default withMLKitLight;