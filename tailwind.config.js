/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:  "#93A9D1",
          blush: "#FBCBC9",
          ink:   "#040305",
          lilac: "#E4E1EC",
          peach: "#F7DFE0",
          dim:   "#79758E",
          mute:  "#8F8AA6",
        },
        bg: {
          DEFAULT: "#F7DFE0",
          soft:    "#FFF7F6",
          card:    "#FFFFFF",
          tint:    "#E4E1EC", // 구분선/테두리
        },
        txt: {
          DEFAULT: "#040305",
          dim:     "#79758E",
          mute:    "#8F8AA6",
        },
      },
      fontFamily: {
        heading: ["InriaSerif_700Bold", "InriaSerif_600SemiBold", "serif"],
        serif:   ["InriaSerif_400Regular", "serif"],
        sans:    ["System"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 6px 20px rgba(9, 8, 19, 0.08)",
        inner: "inset 0 1px 0 rgba(255,255,255,0.6)",
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")], // 그대로 유지
};
