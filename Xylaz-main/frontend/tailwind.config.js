// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2e1700",
        customBackground: "#427dd9",
      },
      boxShadow: {
        colored: "0 10px 15px -3px var(--tw-shadow-color, rgba(0, 0, 0, 0.1))",
      },
    },
  },
  plugins: [],
};
