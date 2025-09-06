// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Update the content path to scan all files in your 'app' directory.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    // You can add paths to other directories with components if needed
    // "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // 2. Add the NativeWind preset. This is the line that fixes the error.
  presets: [require("nativewind/preset")],
};