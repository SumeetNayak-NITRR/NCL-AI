/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Kinetic Void" Palette
        background: "#050505", // Deepest void black
        "void-black": "#000000",
        "off-white": "#f0f0f0", // Editorial white
        "laser-blue": "#0022ff", // Stark electric blue
        "signal-red": "#ff2a00", // Industrial red
        "concrete": "#888888", // Brutalist grey
        "gold": "#FFD700", // Gold for premium buttons
        "neon": "#00D4FF", // Neon cyan for highlights
      },
      fontFamily: {
        bebas: ["Bebas Neue", "sans-serif"], // Massive headers
        rajdhani: ["Rajdhani", "sans-serif"], // Tech specs
        inter: ["Inter", "sans-serif"], // Minimal body
      },
      backgroundImage: {
        'noise': "url('/noise.png')", // We will create this texture or simulate it with CSS
        'grid-pattern': "linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)",
      },
      animation: {
        'grain': 'grain 8s steps(10) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'drift': 'drift 20s linear infinite',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -5%)' },
          '20%': { transform: 'translate(-10%, 5%)' },
          '30%': { transform: 'translate(5%, -10%)' },
          '40%': { transform: 'translate(-5%, 15%)' },
          '50%': { transform: 'translate(-10%, 5%)' },
          '60%': { transform: 'translate(15%, 0)' },
          '70%': { transform: 'translate(0, 10%)' },
          '80%': { transform: 'translate(-15%, 0)' },
          '90%': { transform: 'translate(10%, 5%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        drift: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
