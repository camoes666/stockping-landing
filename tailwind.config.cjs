/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "float-left":   "floatLeft   3s ease-in-out infinite 0.5s",
        "float-center": "floatCenter 3s ease-in-out infinite",
        "float-right":  "floatRight  3s ease-in-out infinite 1s",
        "fade-up-0": "fadeUp 0.7s ease-out both",
        "fade-up-1": "fadeUp 0.7s ease-out 0.12s both",
        "fade-up-2": "fadeUp 0.7s ease-out 0.26s both",
        "fade-up-3": "fadeUp 0.7s ease-out 0.4s both",
        "fade-up-4": "fadeUp 0.7s ease-out 0.52s both",
      },
      keyframes: {
        floatLeft: {
          "0%, 100%": { transform: "perspective(700px) rotateY(20deg) rotate(-5deg) scale(0.82) translateY(0px)" },
          "50%":      { transform: "perspective(700px) rotateY(20deg) rotate(-5deg) scale(0.82) translateY(-20px)" },
        },
        floatCenter: {
          "0%, 100%": { transform: "scale(1.08) translateY(0px)" },
          "50%":      { transform: "scale(1.08) translateY(-28px)" },
        },
        floatRight: {
          "0%, 100%": { transform: "perspective(700px) rotateY(-20deg) rotate(5deg) scale(0.82) translateY(0px)" },
          "50%":      { transform: "perspective(700px) rotateY(-20deg) rotate(5deg) scale(0.82) translateY(-20px)" },
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
