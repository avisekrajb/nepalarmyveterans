/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/index.html", "./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        colors: {
          army: {
            DEFAULT: "#1F3D2B",
            light: "#2E5940",
            dark: "#14291C",
          },
          gold: {
            DEFAULT: "#C9A227",
            light: "#E4C548",
            dark: "#9C7D1B",
          },
          crimson: "#8B2331",
        },
        fontFamily: {
          display: ["'Playfair Display'", "serif"],
          body: ["'Inter'", "sans-serif"],
        },
      },
    },
    plugins: [],
  };