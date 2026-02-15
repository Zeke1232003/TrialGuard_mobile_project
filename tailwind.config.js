/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#36D9B8",
        "primary-dark": "#2AB89A",
        "primary-light": "#A8F0E0",
        danger: "#EF4444",
        info: "#3B82F6",
        warning: "#FF9966",
      },
    },
  },
  plugins: [],
};
