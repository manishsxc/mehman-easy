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
          DEFAULT: "#0F0F0F", // premium dark charcoal
          soft: "#1A1A1A",
          panel: "#1E1E1E",
          line: "#2B2B2B",
        },
        cream: {
          DEFAULT: "#FAF9F6", // luxury warm alabaster
          dim: "#F4F1EA",
          card: "#FFFFFF",
        },
        gold: {
          DEFAULT: "#D4AF37", // exquisite leaf gold
          soft: "#F3E5AB",
          deep: "#AA7C11",
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
        display: ["var(--font-serif)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        sans: ["var(--font-sora)", "sans-serif"],
      },
      borderRadius: {
        stub: "2px",
      },
      boxShadow: {
        card: "0 10px 40px -10px rgba(0,0,0,0.4)",
        ticket: "0 16px 48px -12px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(246,241,228,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
