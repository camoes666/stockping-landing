/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "float-0": "float 3.2s ease-in-out infinite",
        "float-1": "float 3.2s ease-in-out infinite 0.6s",
        "float-2": "float 3.2s ease-in-out infinite 1.2s",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
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
