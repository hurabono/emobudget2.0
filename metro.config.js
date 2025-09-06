// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// This is the final step, wrapping the Metro configuration with NativeWind.
// Make sure to verify the path to your global CSS file.
module.exports = withNativeWind(config, {
  // Path to your PostCSS configuration file
  input: './app/global.css', 
  // Set this to `true` to see Tailwind JIT logs
  verbose: true,
});
