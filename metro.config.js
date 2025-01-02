const { getDefaultConfig } = require('expo/metro-config');

// Get the default configuration
const config = getDefaultConfig(__dirname);

// Add custom resolver configurations
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    buffer: require.resolve('buffer'),
    process: require.resolve('process'),
  },
};

// Export the updated configuration
module.exports = config;
