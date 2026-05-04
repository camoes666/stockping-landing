/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "float-0": "float 2.8s ease-in-out infinite",
        "float-1": "float 2.8s ease-in-out infinite 0.55s",
        "float-2": "float 2.8s ease-in-out infinite 1.1s",
        "fade-up-0": "fadeUp 0.7s ease-out both",
        "fade-up-1": "fadeUp 0.7s ease-out 0.12s both",
        "fade-up-2": "fadeUp 0.7s ease-out 0.26s both",
        "fade-up-3": "fadeUp 0.7s ease-out 0.4s both",
        "fade-up-4": "fadeUp 0.7s ease-out 0.52s both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%":       { transform: "translateY(-12px) rotate(1deg)" },
          "50%":       { transform: "translateY(-26px) rotate(0deg)" },
          "75%":       { transform: "translateY(-12px) rotate(-1deg)" },
        },
        fadeUp: {
          "from": { opacity: "0", transform: "translateY(32px)" },
          "to":   { opacity: "1", transform: "translateY(0px)" },
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
