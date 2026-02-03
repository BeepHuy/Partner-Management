/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./auth/**/*.{html,js}",
    "./**/*.html"
  ],
  theme: {
    screens: {
      mb: "480px", // mobile dọc
      mbh: "640px", // mobile ngang
      tb: "768px", // tablet (iPad)
      lp: "1024px", // laptop
      pc: "1280px", // desktop
      tv: "1536px", // màn hình lớn / TV
    },

    extend: {
      backgroundImage: {
        'auth-body': 'linear-gradient(-54deg, #00265D 0%, #FFFFFF 50%, #00265D 100%)',
      },
      colors: {
        'navy-dark': '#00265D',
        'navy-light': '#0A1431',
      },
      spacing: {
        '94': '94px',
      },
      maxWidth: {
        '430': '430px',
      },
      width: {
        '1000': '1000px',
      },
      minHeight: {
        '600': '600px',
      }
    },
  },
  plugins: [],
};
