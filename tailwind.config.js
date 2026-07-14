/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E2529", // deep dark teal/charcoal — primary background
          soft: "#153338",
          panel: "#1B3E44",
          line: "#2A4F55",
        },
        cream: {
          DEFAULT: "#F6F1E4", // off-white / cream for cards & text accents
          dim: "#EAE2CC",
          card: "#FBF8F0",
        },
        gold: {
          DEFAULT: "#C79A4B", // warm gold highlight
          soft: "#E3C687",
          deep: "#9C7A34",
        },
      },
      fontWeight: {
        400: "400",
        500: "500",
        600: "600",
        700: "700",
        800: "800",
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      borderRadius: {
        stub: "2px",
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(14,37,41,0.35)",
        ticket: "0 12px 40px -14px rgba(14,37,41,0.55)",
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(246,241,228,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
