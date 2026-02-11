/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        gold: "#fadd78",
        neon: "#00ff9c",
      },
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
      },
      animation: {
        'stamp': 'stamp 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      },
      keyframes: {
        stamp: {
          '0%': { opacity: '0', transform: 'scale(3)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
