/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "float-left":   "floatLeft   3s ease-in-out infinite 0.5s",
        "float-center": "floatCenter 3s ease-in-out infinite",
        "float-right":  "floatRight  3s ease-in-out infinite 1s",
        "float-logo":   "floatLogo   3.8s ease-in-out infinite 1.4s",
        "float-video":  "floatVideo  4s ease-in-out infinite",
        "fade-up-0": "fadeUp 0.7s ease-out both",
        "fade-up-1": "fadeUp 0.7s ease-out 0.12s both",
        "fade-up-2": "fadeUp 0.7s ease-out 0.26s both",
        "fade-up-3": "fadeUp 0.7s ease-out 0.4s both",
        "fade-up-4": "fadeUp 0.7s ease-out 0.52s both",
        "fade-up-5": "fadeUp 0.7s ease-out 0.64s both",
        "fade-up-6": "fadeUp 0.7s ease-out 0.76s both",
        // Line reveal — each headline line slides up from behind a mask
        "reveal-1": "revealUp 1s cubic-bezier(0.16,1,0.3,1) 0.05s both",
        "reveal-2": "revealUp 1s cubic-bezier(0.16,1,0.3,1) 0.28s both",
        "reveal-3": "revealUp 1s cubic-bezier(0.16,1,0.3,1) 0.5s both",
        // Dynamic headline slides
        "slide-left":  "slideFromLeft  0.9s cubic-bezier(0.16,1,0.3,1) 0.08s both",
        "slide-right": "slideFromRight 0.9s cubic-bezier(0.16,1,0.3,1) 0.38s both",
        // Badge glow pulse
        "badge-pulse": "badgePulse 3s ease-in-out infinite",
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
        floatLogo: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-18px)" },
        },
        floatVideo: {
          "0%, 100%": { transform: "translateY(6px)" },
          "50%":      { transform: "translateY(-22px)" },
        },
        fadeUp: {
          "from": { opacity: "0", transform: "translateY(32px)" },
          "to":   { opacity: "1", transform: "translateY(0px)" },
        },
        revealUp: {
          "from": { opacity: "0", transform: "translateY(110%)" },
          "to":   { opacity: "1", transform: "translateY(0%)" },
        },
        slideFromLeft: {
          "from": { opacity: "0", transform: "translateX(-70px) skewX(-5deg) scale(0.95)" },
          "to":   { opacity: "1", transform: "translateX(0px)  skewX(0deg)  scale(1)" },
        },
        slideFromRight: {
          "from": { opacity: "0", transform: "translateX(70px) skewX(5deg) scale(0.95)" },
          "to":   { opacity: "1", transform: "translateX(0px)  skewX(0deg) scale(1)" },
        },
        badgePulse: {
          "0%, 100%": { opacity: "1", transform: "translateY(0px) scale(1)" },
          "50%":      { opacity: "0.92", transform: "translateY(-18px) scale(1.02)" },
        },
      },
      colors: {
        // Sentry-inspired dark purple palette
        sentry: {
          bg: "#1f1633",
          "bg-deep": "#150f23",
          border: "#362d59",
          "border-strong": "#584674",
          purple: "#6a5fc1",
          "muted-purple": "#79628c",
          violet: "#422082",
          lime: "#c2ef4e",
          coral: "#ffb287",
          pink: "#fa7faa",
        },
        // Warm blog palette (kept for legacy)
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
          "Rubik",
          "Manrope",
          "-apple-system",
          "sans-serif",
        ],
        rubik: ["Rubik", "sans-serif"],
      },
    },
  },
  plugins: [],
};
