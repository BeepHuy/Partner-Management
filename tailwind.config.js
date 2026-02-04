/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./src/auth/**/*.{html,js}",
    "./src/layouts/**/*.{html,js}",
    "./src/partials/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00265D",
        accent: "#4dd0e1",
        bgLight: "#D9E9FF",
        inputBg: "#E9F2FF",
        inputtb: "#BCBFC8",
        bgictich: "#04EEFF",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(-54deg, #00265D 0%, #FFFFFF 50%, #00265D 100%)",
      },
      fontFamily: {
        domine: ["Domine", "serif"],
      },
    },
  },
  plugins: [],
};
