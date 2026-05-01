/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Warm blog palette (from design samples)
        warm: {
          bg: "#fff8f6",
          surface: "#fff1ec",
          "surface-high": "#ffe2d9",
          "surface-dim": "#f2d4ca",
          border: "#e5beb2",
          "border-strong": "#907065",
          text: "#281812",
          muted: "#5c4037",
          subtle: "#7b7b78",
          primary: "#a63500",
          "primary-dark": "#822800",
          accent: "#d04500",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "Manrope",
          "-apple-system",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
