/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Fya Social Capital brand palette — mirrors credit-web/ui/theme.js so
        // the mobile app and the admin web share the same identity.
        brand: {
          100: "#d0f7e6",
          400: "#34d399",
          600: "#00d280",
          700: "#049a5f",
        },
        ink: "#052224",
      },
    },
  },
  plugins: [],
};
