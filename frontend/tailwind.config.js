/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15121A",       // near-black with a whisper of aubergine — brand primary
        stone: "#EAE5E7",     // cool porcelain-mauve surface, not warm cream
        stoneDark: "#D8D1D4",
        gold: "#A8823C",      // antique bronze-gold accent
        goldLight: "#C9A868",
        oxblood: "#6E1423",   // secondary accent — hover/active states
        muted: "#8A8390",     // supporting grey-mauve for captions/meta
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'General Sans'", "'Inter'", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.28em",
      },
    },
  },
  plugins: [],
};
